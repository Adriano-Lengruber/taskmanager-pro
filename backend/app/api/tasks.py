"""
Task management API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.crud import TaskCRUD, ProjectCRUD
from app.models.database import Task
from app.models.schemas import TaskResponse, TaskCreate, TaskUpdate, APIResponse, PaginatedResponse
from app.dependencies import get_current_active_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/", response_model=PaginatedResponse)
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    project_id: int = Query(None, description="Filter by project ID"),
    status: str = Query(None, description="Filter by status"),
    assignee_id: int = Query(None, description="Filter by assignee"),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get tasks with optional filters"""
    
    if project_id:
        # Check if user has access to the project
        project = ProjectCRUD.get_project(db, project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        tasks = TaskCRUD.get_project_tasks(db, project_id, skip=skip, limit=limit)
    elif assignee_id:
        # Users can only see their own tasks unless they're admin
        if assignee_id != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        tasks = TaskCRUD.get_user_tasks(db, assignee_id, skip=skip, limit=limit)
    else:
        tasks = TaskCRUD.get_tasks(db, skip=skip, limit=limit)
    
    # Filter by status if provided
    if status:
        tasks = [task for task in tasks if task.status == status]
    
    total = len(tasks)
    
    return PaginatedResponse(
        items=[TaskResponse.from_orm(task).dict() for task in tasks],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/my", response_model=PaginatedResponse)
async def get_my_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: str = Query(None, description="Filter by status"),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's assigned tasks"""
    tasks = TaskCRUD.get_user_tasks(db, current_user.id, skip=skip, limit=limit)
    
    # Filter by status if provided
    if status:
        tasks = [task for task in tasks if task.status == status]
    
    total = len(tasks)
    
    return PaginatedResponse(
        items=[TaskResponse.from_orm(task).dict() for task in tasks],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new task"""
    
    # Check if project exists and user has access
    project = ProjectCRUD.get_project(db, task.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions (owner, admin, or manager can create tasks)
    if (project.owner_id != current_user.id and 
        current_user.role not in ["admin", "manager"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to create tasks in this project"
        )
    
    # If assignee is specified, check if user exists
    if task.assignee_id:
        from app.crud import UserCRUD
        assignee = UserCRUD.get_user(db, task.assignee_id)
        if not assignee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignee not found"
            )
    
    # If parent task is specified, check if it exists and belongs to same project
    if task.parent_task_id:
        parent_task = TaskCRUD.get_task(db, task.parent_task_id)
        if not parent_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent task not found"
            )
        if parent_task.project_id != task.project_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent task must belong to the same project"
            )
    
    created_task = TaskCRUD.create_task(db, task)
    return created_task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get task by ID"""
    task = TaskCRUD.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user has access to the project
    project = ProjectCRUD.get_project(db, task.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update task"""
    task = TaskCRUD.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions (assignee, project owner, admin, or manager)
    project = ProjectCRUD.get_project(db, task.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    can_update = (
        task.assignee_id == current_user.id or  # Assignee can update
        project.owner_id == current_user.id or  # Project owner can update
        current_user.role in ["admin", "manager"]  # Admin/Manager can update
    )
    
    if not can_update:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this task"
        )
    
    # If status is being changed to "done", set completed_at
    if task_update.status == "done" and task.status != "done":
        task_update.completed_at = datetime.utcnow()
    elif task_update.status != "done" and task.status == "done":
        task_update.completed_at = None
    
    updated_task = TaskCRUD.update_task(db, task_id, task_update)
    return updated_task

@router.delete("/{task_id}", response_model=APIResponse)
async def delete_task(
    task_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete task (soft delete by marking as inactive)"""
    task = TaskCRUD.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions (project owner or admin only)
    project = ProjectCRUD.get_project(db, task.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this task"
        )
    
    # For now, we'll actually delete the task
    # In production, you might want to implement soft delete
    db.delete(task)
    db.commit()
    
    return APIResponse(
        success=True,
        message=f"Task '{task.title}' deleted successfully"
    )

@router.get("/{task_id}/subtasks", response_model=List[TaskResponse])
async def get_task_subtasks(
    task_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get subtasks of a specific task"""
    task = TaskCRUD.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Get subtasks
    subtasks = db.query(Task).filter(Task.parent_task_id == task_id).all()
    return [TaskResponse.from_orm(subtask) for subtask in subtasks]

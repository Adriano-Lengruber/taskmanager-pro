"""
API routes for task hierarchy (checklists and action items)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.dependencies import get_current_user
from app.models.database import User, Task
from app.models.schemas import (
    ChecklistCreate, ChecklistUpdate, ChecklistResponse, ChecklistWithItems,
    ActionItemCreate, ActionItemUpdate, ActionItemResponse,
    TaskCompleteHierarchy, APIResponse
)
from app.crud import ChecklistCRUD, ActionItemCRUD, TaskCRUD, TaskHierarchyCRUD, ProjectMemberCRUD

router = APIRouter(prefix="/api/v1", tags=["hierarchy"])


# Checklist endpoints
@router.post("/tasks/{task_id}/checklists", response_model=ChecklistResponse)
async def create_checklist(
    task_id: int,
    checklist: ChecklistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new checklist for a task"""
    
    # Verify task exists and user has access
    db_task = TaskCRUD.get_task(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Override task_id from URL
    checklist.task_id = task_id
    return ChecklistCRUD.create_checklist(db, checklist)


@router.get("/tasks/{task_id}/checklists", response_model=List[ChecklistWithItems])
async def get_task_checklists(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all checklists for a task"""
    
    # Verify task exists and user has access
    db_task = TaskCRUD.get_task(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    checklists = ChecklistCRUD.get_task_checklists(db, task_id)
    
    # Add action items to each checklist
    result = []
    for checklist in checklists:
        action_items = ActionItemCRUD.get_checklist_action_items(db, checklist.id)
        checklist_data = ChecklistResponse.model_validate(checklist)
        result.append(ChecklistWithItems(
            **checklist_data.model_dump(),
            action_items=[ActionItemResponse.model_validate(item) for item in action_items]
        ))
    
    return result


@router.put("/checklists/{checklist_id}", response_model=ChecklistResponse)
async def update_checklist(
    checklist_id: int,
    checklist_update: ChecklistUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a checklist"""
    
    db_checklist = ChecklistCRUD.get_checklist(db, checklist_id)
    if not db_checklist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    # Get task to check permissions
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return ChecklistCRUD.update_checklist(db, checklist_id, checklist_update)


@router.delete("/checklists/{checklist_id}", response_model=APIResponse)
async def delete_checklist(
    checklist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a checklist"""
    
    db_checklist = ChecklistCRUD.get_checklist(db, checklist_id)
    if not db_checklist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    # Get task to check permissions
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    success = ChecklistCRUD.delete_checklist(db, checklist_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete checklist"
        )
    
    return APIResponse(message="Checklist deleted successfully")


# Action Item endpoints
@router.post("/checklists/{checklist_id}/action-items", response_model=ActionItemResponse)
async def create_action_item(
    checklist_id: int,
    action_item: ActionItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new action item for a checklist"""
    
    # Verify checklist exists and user has access
    db_checklist = ChecklistCRUD.get_checklist(db, checklist_id)
    if not db_checklist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    # Get task to check permissions
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Override checklist_id from URL
    action_item.checklist_id = checklist_id
    return ActionItemCRUD.create_action_item(db, action_item)


@router.get("/checklists/{checklist_id}/action-items", response_model=List[ActionItemResponse])
async def get_checklist_action_items(
    checklist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all action items for a checklist"""
    
    # Verify checklist exists and user has access
    db_checklist = ChecklistCRUD.get_checklist(db, checklist_id)
    if not db_checklist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    # Get task to check permissions
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    action_items = ActionItemCRUD.get_checklist_action_items(db, checklist_id)
    return [ActionItemResponse.model_validate(item) for item in action_items]


@router.put("/action-items/{action_item_id}", response_model=ActionItemResponse)
async def update_action_item(
    action_item_id: int,
    action_item_update: ActionItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an action item"""
    
    db_action_item = ActionItemCRUD.get_action_item(db, action_item_id)
    if not db_action_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Action item not found"
        )
    
    # Get checklist and task to check permissions
    db_checklist = ChecklistCRUD.get_checklist(db, db_action_item.checklist_id)
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return ActionItemCRUD.update_action_item(db, action_item_id, action_item_update)


@router.delete("/action-items/{action_item_id}", response_model=APIResponse)
async def delete_action_item(
    action_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an action item"""
    
    db_action_item = ActionItemCRUD.get_action_item(db, action_item_id)
    if not db_action_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Action item not found"
        )
    
    # Get checklist and task to check permissions
    db_checklist = ChecklistCRUD.get_checklist(db, db_action_item.checklist_id)
    db_task = TaskCRUD.get_task(db, db_checklist.task_id)
    
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id, ["OWNER", "ADMIN", "MEMBER"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    success = ActionItemCRUD.delete_action_item(db, action_item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete action item"
        )
    
    return APIResponse(message="Action item deleted successfully")


# Task hierarchy endpoints
@router.get("/tasks/{task_id}/hierarchy", response_model=TaskCompleteHierarchy)
async def get_task_hierarchy(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete task hierarchy (task + subtasks + checklists + action items)"""
    
    db_task = TaskHierarchyCRUD.get_task_with_hierarchy(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return TaskCompleteHierarchy.model_validate(db_task)


@router.get("/projects/{project_id}/task-tree", response_model=List[TaskCompleteHierarchy])
async def get_project_task_tree(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete project task tree"""
    
    # Check permissions
    if not ProjectMemberCRUD.check_user_permission(
        db, project_id, current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    tasks = TaskHierarchyCRUD.get_project_task_tree(db, project_id)
    return [TaskCompleteHierarchy.model_validate(task) for task in tasks]


@router.get("/tasks/{task_id}/completion", response_model=dict)
async def get_task_completion(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task completion percentage based on hierarchy"""
    
    db_task = TaskCRUD.get_task(db, task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check permissions
    if not ProjectMemberCRUD.check_user_permission(
        db, db_task.project_id, current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    completion_percentage = TaskHierarchyCRUD.calculate_task_completion(db, task_id)
    
    return {
        "task_id": task_id,
        "completion_percentage": completion_percentage,
        "status": db_task.status
    }


@router.get("/users/{user_id}/action-items", response_model=List[ActionItemResponse])
async def get_user_action_items(
    user_id: int,
    completed: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get action items assigned to a user"""
    
    # Users can only see their own action items unless they're admin
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    action_items = ActionItemCRUD.get_user_action_items(db, user_id, completed)
    return [ActionItemResponse.model_validate(item) for item in action_items]

"""
Project management API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import ProjectCRUD
from app.models.database import Project
from app.models.schemas import ProjectResponse, ProjectCreate, ProjectUpdate, APIResponse, PaginatedResponse
from app.dependencies import get_current_active_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/", response_model=PaginatedResponse)
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all projects (paginated)"""
    projects = ProjectCRUD.get_projects(db, skip=skip, limit=limit)
    total = len(projects)
    
    return PaginatedResponse(
        items=[ProjectResponse.from_orm(project).dict() for project in projects],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/my", response_model=PaginatedResponse)
async def get_my_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's projects"""
    projects = ProjectCRUD.get_user_projects(db, current_user.id, skip=skip, limit=limit)
    total = len(projects)
    
    return PaginatedResponse(
        items=[ProjectResponse.from_orm(project).dict() for project in projects],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    # Check if project key already exists
    existing_project = db.query(Project).filter(Project.key == project.key).first()
    if existing_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project key already exists"
        )
    
    created_project = ProjectCRUD.create_project(db, project, current_user.id)
    return created_project

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get project by ID"""
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update project (owner or admin)"""
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions
    if project.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this project"
        )
    
    updated_project = ProjectCRUD.update_project(db, project_id, project_update)
    return updated_project

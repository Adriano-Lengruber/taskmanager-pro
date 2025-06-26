"""
Project Members API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.database import User, ProjectMember
from app.models.schemas import (
    ProjectMemberCreate, 
    ProjectMemberUpdate,
    ProjectMemberWithUser,
    APIResponse
)
from app.crud import ProjectMemberCRUD, ProjectCRUD, UserCRUD

router = APIRouter()

@router.post("/projects/{project_id}/members", response_model=APIResponse)
async def add_member_to_project(
    project_id: int,
    member_data: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a member to a project"""
    
    # Check if project exists
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if current user has permission (owner or admin)
    if project.owner_id != current_user.id:
        if not ProjectMemberCRUD.check_user_permission(
            db, project_id, current_user.id, ["owner", "admin"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to add members"
            )
    
    # Check if user to be added exists
    user_to_add = UserCRUD.get_user(db, member_data.user_id)
    if not user_to_add:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is already a member
    existing_member = ProjectMemberCRUD.get_member_by_project_and_user(
        db, project_id, member_data.user_id
    )
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this project"
        )
    
    # Add member
    new_member = ProjectMemberCRUD.add_member_to_project(db, project_id, member_data)
    
    return APIResponse(
        success=True,
        message="Member added to project successfully",
        data={"member_id": new_member.id, "username": user_to_add.username}
    )

@router.get("/projects/{project_id}/members", response_model=List[ProjectMemberWithUser])
async def get_project_members(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all members of a project"""
    
    # Check if project exists
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user has access to project
    if project.owner_id != current_user.id:
        if not ProjectMemberCRUD.get_member_by_project_and_user(db, project_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to view project members"
            )
    
    members = ProjectMemberCRUD.get_project_members(db, project_id)
    
    # Load user data for each member
    result = []
    for member in members:
        user = UserCRUD.get_user(db, member.user_id)
        if user:
            result.append({
                "id": member.id,
                "project_id": member.project_id,
                "user_id": member.user_id,
                "role": member.role,
                "joined_at": member.joined_at,
                "is_active": member.is_active,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "is_active": user.is_active,
                    "is_verified": user.is_verified,
                    "created_at": user.created_at,
                    "updated_at": user.updated_at
                }
            })
    
    return result

@router.put("/projects/{project_id}/members/{member_id}", response_model=APIResponse)
async def update_member_role(
    project_id: int,
    member_id: int,
    member_update: ProjectMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update member role in a project"""
    
    # Check if project exists
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions (owner or admin)
    if project.owner_id != current_user.id:
        if not ProjectMemberCRUD.check_user_permission(
            db, project_id, current_user.id, ["owner", "admin"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to update member roles"
            )
    
    # Update member
    updated_member = ProjectMemberCRUD.update_member_role(db, member_id, member_update)
    if not updated_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    
    return APIResponse(
        success=True,
        message="Member role updated successfully",
        data={"member_id": member_id}
    )

@router.delete("/projects/{project_id}/members/{user_id}", response_model=APIResponse)
async def remove_member_from_project(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a member from a project"""
    
    # Check if project exists
    project = ProjectCRUD.get_project(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check permissions (owner or admin, or user removing themselves)
    if project.owner_id != current_user.id and user_id != current_user.id:
        if not ProjectMemberCRUD.check_user_permission(
            db, project_id, current_user.id, ["owner", "admin"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to remove members"
            )
    
    # Remove member
    success = ProjectMemberCRUD.remove_member_from_project(db, project_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in project"
        )
    
    return APIResponse(
        success=True,
        message="Member removed from project successfully",
        data={"user_id": user_id}
    )

@router.get("/users/{user_id}/projects", response_model=List[dict])
async def get_user_projects(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all projects where user is a member"""
    
    # Users can only see their own projects unless they're admin
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view user projects"
        )
    
    memberships = ProjectMemberCRUD.get_user_projects(db, user_id)
    
    result = []
    for membership in memberships:
        project = ProjectCRUD.get_project(db, membership.project_id)
        if project:
            result.append({
                "membership_id": membership.id,
                "role": membership.role,
                "joined_at": membership.joined_at,
                "project": {
                    "id": project.id,
                    "name": project.name,
                    "description": project.description,
                    "key": project.key,
                    "owner_id": project.owner_id,
                    "is_active": project.is_active,
                    "created_at": project.created_at,
                    "updated_at": project.updated_at
                }
            })
    
    return result

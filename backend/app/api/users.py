"""
User management API endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import UserCRUD
from app.models.schemas import UserResponse, UserUpdate, APIResponse, PaginatedResponse
from app.dependencies import get_current_active_user, get_admin_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=PaginatedResponse)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all users (paginated)"""
    users = UserCRUD.get_users(db, skip=skip, limit=limit)
    total = len(users)  # Simple count for now
    
    return PaginatedResponse(
        items=[UserResponse.from_orm(user).dict() for user in users],
        total=total,
        page=skip // limit + 1,
        per_page=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user by ID"""
    user = UserCRUD.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user (self or admin)"""
    
    # Users can only update themselves, unless they're admin
    if user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this user"
        )
    
    user = UserCRUD.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.delete("/{user_id}", response_model=APIResponse)
async def delete_user(
    user_id: int,
    admin_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    user = UserCRUD.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Soft delete by deactivating
    user_update = UserUpdate(is_active=False)
    UserCRUD.update_user(db, user_id, user_update)
    
    return APIResponse(
        success=True,
        message=f"User {user.username} deactivated successfully"
    )

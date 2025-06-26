"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    DEVELOPER = "developer"
    VIEWER = "viewer"

class TaskType(str, Enum):
    TASK = "task"
    SUBTASK = "subtask"
    CHECKLIST = "checklist"
    ACTION_ITEM = "action_item"

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"
    BLOCKED = "blocked"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class ProjectRole(str, Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"

# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    avatar_url: Optional[str] = None
    role: UserRole = UserRole.DEVELOPER

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    key: str = Field(..., min_length=2, max_length=10)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    task_type: TaskType = TaskType.TASK
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    estimated_hours: Optional[int] = None
    order_index: int = 0

class TaskCreate(TaskBase):
    project_id: int
    assignee_id: Optional[int] = None
    parent_task_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[TaskType] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    estimated_hours: Optional[int] = None
    order_index: Optional[int] = None
    completed_at: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int] = None
    parent_task_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Checklist Schemas
class ChecklistBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = 0

class ChecklistCreate(ChecklistBase):
    task_id: int

class ChecklistUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    is_completed: Optional[bool] = None

class ChecklistResponse(ChecklistBase):
    id: int
    task_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Action Item Schemas
class ActionItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    order_index: int = 0

class ActionItemCreate(ActionItemBase):
    checklist_id: int
    assignee_id: Optional[int] = None

class ActionItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    order_index: Optional[int] = None
    is_completed: Optional[bool] = None

class ActionItemResponse(ActionItemBase):
    id: int
    checklist_id: int
    assignee_id: Optional[int] = None
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Enhanced Task Response with hierarchy
class TaskWithHierarchy(TaskResponse):
    subtasks: List['TaskWithHierarchy'] = []
    checklists: List[ChecklistResponse] = []

class ChecklistWithItems(ChecklistResponse):
    action_items: List[ActionItemResponse] = []

class TaskCompleteHierarchy(TaskResponse):
    subtasks: List['TaskCompleteHierarchy'] = []
    checklists: List[ChecklistWithItems] = []

# Project Member Schemas
class ProjectMemberBase(BaseModel):
    user_id: int
    role: ProjectRole = ProjectRole.MEMBER

class ProjectMemberCreate(ProjectMemberBase):
    pass

class ProjectMemberUpdate(BaseModel):
    role: Optional[ProjectRole] = None
    is_active: Optional[bool] = None

class ProjectMemberInDB(ProjectMemberBase):
    id: int
    project_id: int
    joined_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class ProjectMember(ProjectMemberInDB):
    user: Optional[UserResponse] = None

class ProjectMemberWithUser(ProjectMemberInDB):
    user: UserResponse

# Updated Project Response with members
class ProjectWithMembers(ProjectResponse):
    members: List[ProjectMemberWithUser] = []

# Updated User Response with project memberships
class UserWithProjects(UserResponse):
    project_memberships: List[ProjectMember] = []

# API Response Schemas
class APIResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    per_page: int
    pages: int

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=8)

class UserRegister(UserCreate):
    confirm_password: str = Field(..., min_length=8)

# Update forward references for recursive models
TaskWithHierarchy.model_rebuild()
TaskCompleteHierarchy.model_rebuild()

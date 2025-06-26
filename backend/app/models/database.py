"""
Database models for TaskManager Pro
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

Base = declarative_base()

class TaskType(enum.Enum):
    """Types of tasks in the hierarchy"""
    TASK = "task"           # Main task
    SUBTASK = "subtask"     # Subtask of a main task
    CHECKLIST = "checklist" # Checklist item
    ACTION_ITEM = "action_item"  # Action item within a checklist

class ChecklistStatus(enum.Enum):
    """Status for checklist items"""
    PENDING = "pending"
    COMPLETED = "completed"

class UserRole(enum.Enum):
    """User roles in the system"""
    ADMIN = "admin"
    MANAGER = "manager" 
    DEVELOPER = "developer"
    VIEWER = "viewer"

class ProjectRole(enum.Enum):
    """User roles within a project"""
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(255))
    role = Column(String(20), default="developer")  # admin, manager, developer, viewer
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owned_projects = relationship("Project", back_populates="owner")
    assigned_tasks = relationship("Task", back_populates="assignee")
    action_items = relationship("ActionItem", back_populates="assignee")
    project_memberships = relationship("ProjectMember", back_populates="user")

class Project(Base):
    """Project model"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    key = Column(String(10), unique=True, index=True)  # e.g., "TMP" for TaskManager Pro
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="owned_projects")
    tasks = relationship("Task", back_populates="project")
    members = relationship("ProjectMember", back_populates="project")

class Task(Base):
    """Task model with hierarchical structure"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    task_type = Column(Enum(TaskType), default=TaskType.TASK)  # New field for hierarchy
    status = Column(String(20), default="todo")  # todo, in_progress, in_review, done, blocked
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    
    # Hierarchy fields
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"))
    parent_task_id = Column(Integer, ForeignKey("tasks.id"))  # For subtasks
    
    # Additional hierarchy metadata
    order_index = Column(Integer, default=0)  # For ordering within parent
    is_template = Column(Boolean, default=False)  # For template tasks
    estimated_hours = Column(Integer)  # Time estimation
    
    # Dates
    due_date = Column(DateTime)
    start_date = Column(DateTime)  # For planning
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")
    parent_task = relationship("Task", remote_side=[id], back_populates="subtasks")
    subtasks = relationship("Task", back_populates="parent_task", cascade="all, delete-orphan")
    checklists = relationship("Checklist", back_populates="task", cascade="all, delete-orphan")

class Checklist(Base):
    """Checklist model - contains multiple action items"""
    __tablename__ = "checklists"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    order_index = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    
    # Dates
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    task = relationship("Task", back_populates="checklists")
    action_items = relationship("ActionItem", back_populates="checklist", cascade="all, delete-orphan")

class ActionItem(Base):
    """Action Item model - individual items within checklists"""
    __tablename__ = "action_items"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    checklist_id = Column(Integer, ForeignKey("checklists.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"))
    order_index = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    
    # Dates
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    checklist = relationship("Checklist", back_populates="action_items")
    assignee = relationship("User", back_populates="action_items")

class ProjectMember(Base):
    """Project member association model"""
    __tablename__ = "project_members"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(Enum(ProjectRole), default=ProjectRole.MEMBER)
    joined_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships")

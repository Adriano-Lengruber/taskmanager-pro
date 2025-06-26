"""
CRUD operations for TaskManager Pro
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.database import User, Project, Task, ProjectMember
from app.models.schemas import (
    UserCreate, UserUpdate, ProjectCreate, ProjectUpdate, TaskCreate, TaskUpdate,
    ProjectMemberCreate, ProjectMemberUpdate
)
from app.auth import get_password_hash, verify_password

class UserCRUD:
    """User CRUD operations"""
    
    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create new user"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password,
            avatar_url=user.avatar_url,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """Update user"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            update_data = user_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_user, field, value)
            db.commit()
            db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """Authenticate user with username and password"""
        user = UserCRUD.get_user_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

class ProjectCRUD:
    """Project CRUD operations"""
    
    @staticmethod
    def get_project(db: Session, project_id: int) -> Optional[Project]:
        """Get project by ID"""
        return db.query(Project).filter(Project.id == project_id).first()
    
    @staticmethod
    def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
        """Get all projects with pagination"""
        return db.query(Project).filter(Project.is_active == True).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_projects(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Project]:
        """Get user's projects"""
        return db.query(Project).filter(
            Project.owner_id == user_id,
            Project.is_active == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_project(db: Session, project: ProjectCreate, owner_id: int) -> Project:
        """Create new project"""
        db_project = Project(
            name=project.name,
            description=project.description,
            key=project.key,
            owner_id=owner_id
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    
    @staticmethod
    def update_project(db: Session, project_id: int, project_update: ProjectUpdate) -> Optional[Project]:
        """Update project"""
        db_project = db.query(Project).filter(Project.id == project_id).first()
        if db_project:
            update_data = project_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_project, field, value)
            db.commit()
            db.refresh(db_project)
        return db_project

class TaskCRUD:
    """Task CRUD operations"""
    
    @staticmethod
    def get_task(db: Session, task_id: int) -> Optional[Task]:
        """Get task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()
    
    @staticmethod
    def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[Task]:
        """Get all tasks with pagination"""
        return db.query(Task).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_project_tasks(db: Session, project_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
        """Get project tasks"""
        return db.query(Task).filter(Task.project_id == project_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
        """Get user assigned tasks"""
        return db.query(Task).filter(Task.assignee_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_task(db: Session, task: TaskCreate) -> Task:
        """Create new task"""
        db_task = Task(
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            project_id=task.project_id,
            assignee_id=task.assignee_id,
            parent_task_id=task.parent_task_id,
            due_date=task.due_date
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Update task"""
        db_task = db.query(Task).filter(Task.id == task_id).first()
        if db_task:
            update_data = task_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_task, field, value)
            db.commit()
            db.refresh(db_task)
        return db_task

class ProjectMemberCRUD:
    """Project Member CRUD operations"""
    
    @staticmethod
    def add_member_to_project(db: Session, project_id: int, member_data: ProjectMemberCreate) -> ProjectMember:
        """Add a member to a project"""
        db_member = ProjectMember(
            project_id=project_id,
            user_id=member_data.user_id,
            role=member_data.role
        )
        db.add(db_member)
        db.commit()
        db.refresh(db_member)
        return db_member
    
    @staticmethod
    def get_project_members(db: Session, project_id: int) -> List[ProjectMember]:
        """Get all members of a project"""
        return db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.is_active == True
        ).all()
    
    @staticmethod
    def get_member_by_project_and_user(db: Session, project_id: int, user_id: int) -> Optional[ProjectMember]:
        """Get specific member in a project"""
        return db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
            ProjectMember.is_active == True
        ).first()
    
    @staticmethod
    def update_member_role(db: Session, member_id: int, member_update: ProjectMemberUpdate) -> Optional[ProjectMember]:
        """Update member role or status"""
        db_member = db.query(ProjectMember).filter(ProjectMember.id == member_id).first()
        if db_member:
            update_data = member_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_member, field, value)
            db.commit()
            db.refresh(db_member)
        return db_member
    
    @staticmethod
    def remove_member_from_project(db: Session, project_id: int, user_id: int) -> bool:
        """Remove a member from a project (soft delete)"""
        db_member = ProjectMemberCRUD.get_member_by_project_and_user(db, project_id, user_id)
        if db_member:
            db_member.is_active = False
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_user_projects(db: Session, user_id: int) -> List[ProjectMember]:
        """Get all projects where user is a member"""
        return db.query(ProjectMember).filter(
            ProjectMember.user_id == user_id,
            ProjectMember.is_active == True
        ).all()
    
    @staticmethod
    def check_user_permission(db: Session, project_id: int, user_id: int, required_roles: List[str] = None) -> bool:
        """Check if user has permission in project"""
        member = ProjectMemberCRUD.get_member_by_project_and_user(db, project_id, user_id)
        if not member:
            return False
        
        if required_roles is None:
            return True
            
        return member.role.value in required_roles

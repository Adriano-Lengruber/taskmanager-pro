#!/usr/bin/env python3
"""
Script para criar usuário administrador no TaskManager Pro
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.models.database import User, Base
from app.auth import get_password_hash
from app.database import DATABASE_URL

def create_admin_user():
    """Cria o usuário administrador padrão"""
    
    # Criar engine e sessão
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Criar tabelas se não existirem
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar se já existe um admin
        existing_admin = db.query(User).filter(User.email == "admin@taskmanager.com").first()
        
        if existing_admin:
            print("✅ Usuário admin já existe!")
            print(f"   Email: {existing_admin.email}")
            print(f"   Nome: {existing_admin.full_name}")
            print(f"   Ativo: {existing_admin.is_active}")
            return existing_admin
        
        # Criar usuário admin
        hashed_password = get_password_hash("admin123")
        
        admin_user = User(
            username="admin",
            email="admin@taskmanager.com",
            full_name="Administrador do Sistema",
            hashed_password=hashed_password,
            role="admin",
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("🚀 Usuário admin criado com sucesso!")
        print(f"   📧 Email: admin@taskmanager.com")
        print(f"   🔑 Senha: admin123")
        print(f"   👤 Nome: {admin_user.full_name}")
        print(f"   🔐 Role: {admin_user.role}")
        
        return admin_user
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário admin: {e}")
        db.rollback()
        return None
    finally:
        db.close()

def create_test_users():
    """Cria alguns usuários de teste"""
    
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    test_users = [
        {
            "username": "developer",
            "email": "dev@taskmanager.com",
            "full_name": "Desenvolvedor Teste",
            "password": "dev123",
            "role": "developer"
        },
        {
            "username": "manager",
            "email": "manager@taskmanager.com", 
            "full_name": "Gerente Teste",
            "password": "manager123",
            "role": "manager"
        }
    ]
    
    created_users = []
    
    try:
        for user_data in test_users:
            # Verificar se já existe
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if not existing_user:
                hashed_password = get_password_hash(user_data["password"])
                
                new_user = User(
                    username=user_data["username"],
                    email=user_data["email"],
                    full_name=user_data["full_name"],
                    hashed_password=hashed_password,
                    role=user_data["role"],
                    is_active=True
                )
                
                db.add(new_user)
                created_users.append(user_data)
        
        if created_users:
            db.commit()
            print(f"\n🧪 {len(created_users)} usuários de teste criados:")
            for user in created_users:
                print(f"   📧 {user['email']} | 🔑 {user['password']} | 👤 {user['role']}")
        else:
            print("\n✅ Usuários de teste já existem!")
            
    except Exception as e:
        print(f"❌ Erro ao criar usuários de teste: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Inicializando banco de dados TaskManager Pro...")
    print("=" * 50)
    
    # Criar admin
    admin = create_admin_user()
    
    # Criar usuários de teste
    create_test_users()
    
    print("\n✅ Inicialização concluída!")
    print("🌐 Acesse: http://localhost:5173")
    print("📚 API Docs: http://localhost:8000/docs")

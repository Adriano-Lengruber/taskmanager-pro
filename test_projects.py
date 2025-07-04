#!/usr/bin/env python3
"""
Teste completo do CRUD de Projetos
"""
import requests
import json

def get_auth_token():
    """Obter token de autenticação"""
    url = "http://localhost:8000/api/v1/auth/login"
    form_data = {
        "username": "newuser456",
        "password": "testpassword123"
    }
    
    response = requests.post(url, data=form_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_create_project(token):
    """Testar criação de projeto"""
    print("🔍 Testando criação de projeto...")
    url = "http://localhost:8000/api/v1/projects"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "name": "Projeto Teste",
        "description": "Descrição do projeto de teste",
        "key": "TEST01"  # Campo obrigatório!
    }
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("✅ Projeto criado com sucesso!")
            project = response.json()
            print(f"Projeto ID: {project.get('id')}")
            return project.get('id')
        else:
            print("❌ Falha na criação do projeto!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro na criação: {e}")
        return None

def test_list_projects(token):
    """Testar listagem de projetos"""
    print("\n🔍 Testando listagem de projetos...")
    url = "http://localhost:8000/api/v1/projects"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Listagem funcionando!")
            projects = response.json()
            print(f"Total de projetos: {len(projects)}")
            return projects
        else:
            print("❌ Falha na listagem!")
            print(f"Response: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Erro na listagem: {e}")
        return []

def test_get_project(token, project_id):
    """Testar busca de projeto específico"""
    print(f"\n🔍 Testando busca do projeto {project_id}...")
    url = f"http://localhost:8000/api/v1/projects/{project_id}"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Busca funcionando!")
            project = response.json()
            print(f"Projeto: {project.get('name')}")
            return project
        else:
            print("❌ Falha na busca!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro na busca: {e}")
        return None

def main():
    """Executar todos os testes de projetos"""
    print("🚀 TaskManager Pro - Teste de Projetos\n")
    
    # Obter token
    token = get_auth_token()
    if not token:
        print("❌ Não foi possível obter token de autenticação")
        return
    
    print("✅ Token obtido com sucesso!\n")
    
    # Teste 1: Criar projeto
    project_id = test_create_project(token)
    
    # Teste 2: Listar projetos
    projects = test_list_projects(token)
    
    # Teste 3: Buscar projeto específico
    if project_id:
        test_get_project(token, project_id)
    
    print("\n✅ Testes de projetos concluídos!")

if __name__ == "__main__":
    main()

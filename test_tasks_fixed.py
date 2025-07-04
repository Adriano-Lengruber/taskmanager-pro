#!/usr/bin/env python3
"""
Teste corrigido do CRUD de Tarefas
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
    
    response = requests.post(url, data=form_data, timeout=10)
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def get_project_id(token):
    """Obter ID de um projeto para usar nos testes"""
    url = "http://localhost:8000/api/v1/projects"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        print(f"📊 Response type: {type(data)}")
        
        # A API retorna um objeto paginado com 'items'
        if isinstance(data, dict) and 'items' in data:
            projects = data['items']
            print(f"📊 Projetos encontrados: {len(projects)}")
            
            if projects:
                project_id = projects[0]["id"]
                print(f"✅ Usando projeto ID: {project_id}")
                return project_id
        
        print("❌ Nenhum projeto encontrado")
        return None
    else:
        print(f"❌ Erro ao buscar projetos: {response.status_code}")
        return None

def test_create_task(token, project_id):
    """Testar criação de tarefa"""
    print("🔍 Testando criação de tarefa...")
    url = "http://localhost:8000/api/v1/tasks"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Tarefa de Teste",
        "description": "Descrição da tarefa de teste",
        "project_id": project_id
    }
    
    response = requests.post(url, json=data, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    
    if response.status_code in [200, 201]:
        print("✅ Tarefa criada com sucesso!")
        task = response.json()
        print(f"Tarefa ID: {task.get('id')}")
        return task.get('id')
    else:
        print("❌ Falha na criação da tarefa!")
        print(f"Response: {response.text}")
        return None

def test_list_tasks(token):
    """Testar listagem de tarefas"""
    print("\n🔍 Testando listagem de tarefas...")
    url = "http://localhost:8000/api/v1/tasks"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Listagem funcionando!")
        data = response.json()
        
        # Verificar se é paginado como projetos
        if isinstance(data, dict) and 'items' in data:
            tasks = data['items']
            print(f"Total de tarefas: {len(tasks)}")
        elif isinstance(data, list):
            tasks = data
            print(f"Total de tarefas: {len(tasks)}")
        else:
            print(f"Formato inesperado: {type(data)}")
            tasks = []
        
        return tasks
    else:
        print("❌ Falha na listagem!")
        print(f"Response: {response.text}")
        return []

def main():
    """Executar todos os testes de tarefas"""
    print("🚀 TaskManager Pro - Teste de Tarefas\n")
    
    # Obter token
    token = get_auth_token()
    if not token:
        print("❌ Não foi possível obter token de autenticação")
        return
    
    print("✅ Token obtido com sucesso!\n")
    
    # Obter um projeto para usar nos testes
    project_id = get_project_id(token)
    if not project_id:
        print("❌ Não foi possível obter um projeto para os testes")
        return
    
    # Teste 1: Criar tarefa
    task_id = test_create_task(token, project_id)
    
    # Teste 2: Listar tarefas
    test_list_tasks(token)
    
    print("\n✅ Testes de tarefas concluídos!")

if __name__ == "__main__":
    main()

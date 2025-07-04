#!/usr/bin/env python3
"""
Teste completo do CRUD de Tarefas
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

def get_project_id(token):
    """Obter ID de um projeto para usar nos testes"""
    url = "http://localhost:8000/api/v1/projects"
    headers = {"Authorization": f"Bearer {token}"}
    
def get_project_id(token):
    """Obter ID de um projeto para usar nos testes"""
    url = "http://localhost:8000/api/v1/projects"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"📊 Response type: {type(data)}")
        
        # A API retorna um objeto paginado com 'items'
        if isinstance(data, dict) and 'items' in data:
            projects = data['items']
            print(f"📊 Projetos encontrados: {len(projects)}")
            
            if projects and len(projects) > 0:
                first_project = projects[0]
                print(f"🔍 Estrutura do projeto: {first_project}")
                
                if "id" in first_project:
                    return first_project["id"]
                else:
                    print("❌ Campo ID não encontrado no projeto")
                    return None
            else:
                print("❌ Nenhum projeto encontrado na lista items")
                return None
        # Fallback para lista direta (caso a API mude)
        elif isinstance(data, list):
            projects = data
            print(f"📊 Projetos encontrados (lista direta): {len(projects)}")
            
            if projects and len(projects) > 0:
                return projects[0]["id"]
        else:
            print(f"❌ Formato inesperado da response: {data}")
            return None
    else:
        print(f"❌ Erro ao buscar projetos: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def test_create_task(token, project_id):
    """Testar criação de tarefa"""
    print("🔍 Testando criação de tarefa...")
    url = "http://localhost:8000/api/v1/tasks"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Tarefa de Teste",
        "description": "Descrição da tarefa de teste",
        "project_id": project_id,
        "priority": "medium",
        "status": "todo"
    }
    
    try:
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
    except Exception as e:
        print(f"❌ Erro na criação: {e}")
        return None

def test_list_tasks(token):
    """Testar listagem de tarefas"""
    print("\n🔍 Testando listagem de tarefas...")
    url = "http://localhost:8000/api/v1/tasks"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Listagem funcionando!")
            tasks = response.json()
            print(f"Total de tarefas: {len(tasks)}")
            return tasks
        else:
            print("❌ Falha na listagem!")
            print(f"Response: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Erro na listagem: {e}")
        return []

def test_get_task(token, task_id):
    """Testar busca de tarefa específica"""
    print(f"\n🔍 Testando busca da tarefa {task_id}...")
    url = f"http://localhost:8000/api/v1/tasks/{task_id}"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Busca funcionando!")
            task = response.json()
            print(f"Tarefa: {task.get('title')}")
            return task
        else:
            print("❌ Falha na busca!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro na busca: {e}")
        return None

def test_update_task(token, task_id):
    """Testar atualização de tarefa"""
    print(f"\n🔍 Testando atualização da tarefa {task_id}...")
    url = f"http://localhost:8000/api/v1/tasks/{task_id}"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Tarefa Atualizada",
        "status": "in_progress"
    }
    
    try:
        response = requests.put(url, json=data, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Atualização funcionando!")
            task = response.json()
            print(f"Nova tarefa: {task.get('title')} - Status: {task.get('status')}")
            return task
        else:
            print("❌ Falha na atualização!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro na atualização: {e}")
        return None

def main():
    """Executar todos os testes de tarefas"""
    print("🚀 TaskManager Pro - Teste de Tarefas\n")
    
    # Obter token
    token = get_auth_token()
    if not token:
        print("❌ Não foi possível obter token de autenticação")
        return
    
    print("✅ Token obtido com sucesso!")
    
    # Obter um projeto para usar nos testes
    project_id = get_project_id(token)
    if not project_id:
        print("❌ Não foi possível obter um projeto para os testes")
        return
    
    print(f"✅ Usando projeto ID: {project_id}\n")
    
    # Teste 1: Criar tarefa
    task_id = test_create_task(token, project_id)
    
    # Teste 2: Listar tarefas
    tasks = test_list_tasks(token)
    
    # Teste 3: Buscar tarefa específica
    if task_id:
        test_get_task(token, task_id)
        
        # Teste 4: Atualizar tarefa
        test_update_task(token, task_id)
    
    print("\n✅ Testes de tarefas concluídos!")

if __name__ == "__main__":
    main()

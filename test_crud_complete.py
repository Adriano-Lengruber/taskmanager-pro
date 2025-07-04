#!/usr/bin/env python3
"""
Teste completo de Edição e Deleção - Projetos e Tarefas
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

def test_update_project(token):
    """Testar atualização de projeto"""
    print("🔍 Testando atualização de projeto...")
    
    # Primeiro, vamos buscar um projeto existente
    list_url = "http://localhost:8000/api/v1/projects"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(list_url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        if 'items' in data and data['items']:
            project_id = data['items'][0]['id']
            print(f"✅ Projeto encontrado para edição: ID {project_id}")
            
            # Agora vamos atualizar o projeto
            update_url = f"http://localhost:8000/api/v1/projects/{project_id}"
            update_data = {
                "name": "Projeto Atualizado",
                "description": "Nova descrição do projeto"
            }
            
            response = requests.put(update_url, json=update_data, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Projeto atualizado com sucesso!")
                project = response.json()
                print(f"Novo nome: {project.get('name')}")
                return True
            else:
                print("❌ Falha na atualização do projeto!")
                print(f"Response: {response.text}")
                return False
        else:
            print("❌ Nenhum projeto encontrado para editar")
            return False
    else:
        print(f"❌ Erro ao buscar projetos: {response.status_code}")
        return False

def test_update_task(token):
    """Testar atualização de tarefa"""
    print("\n🔍 Testando atualização de tarefa...")
    
    # Primeiro, vamos buscar uma tarefa existente
    list_url = "http://localhost:8000/api/v1/tasks"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(list_url, headers=headers, timeout=10)
    if response.status_code == 200:
        data = response.json()
        
        # Verificar se é paginado
        if isinstance(data, dict) and 'items' in data:
            tasks = data['items']
        elif isinstance(data, list):
            tasks = data
        else:
            tasks = []
        
        if tasks:
            task_id = tasks[0]['id']
            print(f"✅ Tarefa encontrada para edição: ID {task_id}")
            
            # Agora vamos atualizar a tarefa
            update_url = f"http://localhost:8000/api/v1/tasks/{task_id}"
            update_data = {
                "title": "Tarefa Atualizada",
                "description": "Nova descrição da tarefa",
                "status": "in_progress"
            }
            
            response = requests.put(update_url, json=update_data, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Tarefa atualizada com sucesso!")
                task = response.json()
                print(f"Novo título: {task.get('title')}")
                print(f"Novo status: {task.get('status')}")
                return True
            else:
                print("❌ Falha na atualização da tarefa!")
                print(f"Response: {response.text}")
                return False
        else:
            print("❌ Nenhuma tarefa encontrada para editar")
            return False
    else:
        print(f"❌ Erro ao buscar tarefas: {response.status_code}")
        return False

def test_delete_task(token):
    """Testar deleção de tarefa"""
    print("\n🔍 Testando deleção de tarefa...")
    
    # Primeiro, criar uma tarefa para deletar
    create_url = "http://localhost:8000/api/v1/tasks"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Buscar um projeto primeiro
    projects_response = requests.get("http://localhost:8000/api/v1/projects", headers=headers, timeout=10)
    if projects_response.status_code == 200:
        projects_data = projects_response.json()
        if 'items' in projects_data and projects_data['items']:
            project_id = projects_data['items'][0]['id']
            
            # Criar tarefa para deletar
            create_data = {
                "title": "Tarefa para Deletar",
                "description": "Esta tarefa será deletada",
                "project_id": project_id
            }
            
            create_response = requests.post(create_url, json=create_data, headers=headers, timeout=10)
            if create_response.status_code in [200, 201]:
                task_id = create_response.json()['id']
                print(f"✅ Tarefa criada para deleção: ID {task_id}")
                
                # Agora deletar a tarefa
                delete_url = f"http://localhost:8000/api/v1/tasks/{task_id}"
                delete_response = requests.delete(delete_url, headers=headers, timeout=10)
                print(f"Status: {delete_response.status_code}")
                
                if delete_response.status_code in [200, 204]:
                    print("✅ Tarefa deletada com sucesso!")
                    return True
                else:
                    print("❌ Falha na deleção da tarefa!")
                    print(f"Response: {delete_response.text}")
                    return False
            else:
                print("❌ Não foi possível criar tarefa para deletar")
                return False
        else:
            print("❌ Nenhum projeto encontrado")
            return False
    else:
        print("❌ Erro ao buscar projetos")
        return False

def main():
    """Executar todos os testes de edição/deleção"""
    print("🚀 TaskManager Pro - Testes de Edição e Deleção\n")
    
    # Obter token
    token = get_auth_token()
    if not token:
        print("❌ Não foi possível obter token de autenticação")
        return
    
    print("✅ Token obtido com sucesso!\n")
    
    # Teste 1: Atualizar projeto
    project_updated = test_update_project(token)
    
    # Teste 2: Atualizar tarefa
    task_updated = test_update_task(token)
    
    # Teste 3: Deletar tarefa
    task_deleted = test_delete_task(token)
    
    # Resumo
    print("\n📊 RESUMO DOS TESTES:")
    print(f"✅ Atualização de Projeto: {'✅' if project_updated else '❌'}")
    print(f"✅ Atualização de Tarefa: {'✅' if task_updated else '❌'}")
    print(f"✅ Deleção de Tarefa: {'✅' if task_deleted else '❌'}")
    
    print("\n✅ Testes de edição/deleção concluídos!")

if __name__ == "__main__":
    main()

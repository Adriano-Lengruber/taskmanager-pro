#!/usr/bin/env python3
"""
Teste de Atribuição de Responsáveis em Tarefas
TaskManager Pro - Teste automatizado para atribuir/alterar responsáveis
"""

import requests
import json
import random
import string

# Configuração da API
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

def generate_unique_key():
    """Gera uma chave única para o projeto"""
    return "ASG" + ''.join(random.choices(string.digits, k=4))

def get_token():
    """Obtém token de autenticação"""
    print("🔑 Obtendo token de autenticação...")
    
    # Primeiro, registra um usuário para teste
    register_data = {
        "username": "testuser_assignee",
        "email": "testassignee@example.com",
        "password": "testpass123",
        "full_name": "Test User Assignee",
        "confirm_password": "testpass123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=register_data, timeout=10)
        if response.status_code == 200:
            print("✅ Usuário registrado para teste")
        elif response.status_code == 400 and "already registered" in response.text:
            print("ℹ️ Usuário já existe, prosseguindo...")
        else:
            print(f"⚠️ Resposta inesperada no registro: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Erro no registro: {e}")
    
    # Login para obter token
    login_data = {
        "username": "testuser_assignee",
        "password": "testpass123"
    }
    
    response = requests.post(f"{API_BASE}/auth/login", data=login_data, timeout=10)
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ Token obtido com sucesso!")
        return token
    else:
        print(f"❌ Erro ao obter token: {response.status_code}")
        print(f"Resposta: {response.text}")
        return None

def create_test_project(token):
    """Cria um projeto para teste"""
    headers = {"Authorization": f"Bearer {token}"}
    
    project_data = {
        "name": "Projeto para Teste de Atribuição",
        "description": "Projeto criado para testar atribuição de responsáveis",
        "key": generate_unique_key()
    }
    
    response = requests.post(f"{API_BASE}/projects/", 
                           json=project_data, 
                           headers=headers,
                           timeout=10)
    
    if response.status_code == 200:
        project = response.json()
        print(f"✅ Projeto criado para teste: ID {project['id']}")
        return project['id']
    else:
        print(f"❌ Erro ao criar projeto: {response.status_code}")
        print(f"Resposta: {response.text}")
        return None

def create_test_user(username, email):
    """Cria um usuário para atribuir como responsável"""
    user_data = {
        "username": username,
        "email": email,
        "password": "assigneepass123",
        "full_name": f"Assignee {username}",
        "confirm_password": "assigneepass123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=user_data, timeout=10)
        if response.status_code == 200:
            print(f"✅ Usuário criado: {username}")
            return True
        elif response.status_code == 400 and "already registered" in response.text:
            print(f"ℹ️ Usuário {username} já existe")
            return True
        else:
            print(f"⚠️ Erro ao criar usuário {username}: {response.status_code}")
            return False
    except Exception as e:
        print(f"⚠️ Erro na criação do usuário {username}: {e}")
        return False

def get_user_by_username(token, username):
    """Busca usuário pelo username"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/users/", headers=headers, timeout=10)
    
    if response.status_code == 200:
        users_data = response.json()
        users = users_data.get("items", users_data) if isinstance(users_data, dict) else users_data
        
        for user in users:
            if user["username"] == username:
                print(f"✅ Usuário {username} encontrado: ID {user['id']}")
                return user["id"]
    
    print(f"❌ Usuário {username} não encontrado")
    return None

def create_task_with_assignee(token, project_id, assignee_id):
    """Cria uma tarefa com responsável atribuído"""
    headers = {"Authorization": f"Bearer {token}"}
    
    task_data = {
        "title": "Tarefa com Responsável",
        "description": "Tarefa criada para testar atribuição de responsáveis",
        "project_id": project_id,
        "assignee_id": assignee_id,
        "priority": "high",
        "status": "todo"
    }
    
    response = requests.post(f"{API_BASE}/tasks/", 
                           json=task_data, 
                           headers=headers,
                           timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        task = response.json()
        print(f"✅ Tarefa criada com responsável: ID {task['id']}")
        return task['id']
    else:
        print(f"❌ Erro ao criar tarefa: {response.text}")
        return None

def create_task_without_assignee(token, project_id):
    """Cria uma tarefa sem responsável"""
    headers = {"Authorization": f"Bearer {token}"}
    
    task_data = {
        "title": "Tarefa sem Responsável",
        "description": "Tarefa criada para testar atribuição posterior",
        "project_id": project_id,
        "priority": "medium",
        "status": "todo"
    }
    
    response = requests.post(f"{API_BASE}/tasks/", 
                           json=task_data, 
                           headers=headers,
                           timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        task = response.json()
        print(f"✅ Tarefa criada sem responsável: ID {task['id']}")
        return task['id']
    else:
        print(f"❌ Erro ao criar tarefa: {response.text}")
        return None

def assign_user_to_task(token, task_id, assignee_id):
    """Atribui um responsável a uma tarefa existente"""
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "assignee_id": assignee_id
    }
    
    response = requests.put(f"{API_BASE}/tasks/{task_id}", 
                          json=update_data, 
                          headers=headers,
                          timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Responsável atribuído com sucesso!")
        return True
    else:
        print(f"❌ Erro ao atribuir responsável: {response.text}")
        return False

def change_task_assignee(token, task_id, new_assignee_id):
    """Altera o responsável de uma tarefa"""
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "assignee_id": new_assignee_id
    }
    
    response = requests.put(f"{API_BASE}/tasks/{task_id}", 
                          json=update_data, 
                          headers=headers,
                          timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Responsável alterado com sucesso!")
        return True
    else:
        print(f"❌ Erro ao alterar responsável: {response.text}")
        return False

def remove_task_assignee(token, task_id):
    """Remove o responsável de uma tarefa"""
    headers = {"Authorization": f"Bearer {token}"}
    
    update_data = {
        "assignee_id": None
    }
    
    response = requests.put(f"{API_BASE}/tasks/{task_id}", 
                          json=update_data, 
                          headers=headers,
                          timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Responsável removido com sucesso!")
        return True
    else:
        print(f"❌ Erro ao remover responsável: {response.text}")
        return False

def get_task_details(token, task_id):
    """Obtém detalhes de uma tarefa"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/tasks/{task_id}", 
                          headers=headers,
                          timeout=10)
    
    if response.status_code == 200:
        task = response.json()
        assignee = task.get("assignee_id")
        print(f"✅ Tarefa obtida - Responsável atual: {assignee}")
        return task
    else:
        print(f"❌ Erro ao obter tarefa: {response.text}")
        return None

def main():
    print("🚀 TaskManager Pro - Teste de Atribuição de Responsáveis\\n")
    
    # Obtém token
    token = get_token()
    if not token:
        print("❌ Não foi possível obter token. Encerrando.")
        return
    
    # Cria projeto para teste
    print("\\n🔍 Criando projeto para teste...")
    project_id = create_test_project(token)
    if not project_id:
        print("❌ Não foi possível criar projeto. Encerrando.")
        return
    
    # Cria usuários para atribuir como responsáveis
    print("\\n🔍 Criando usuários para teste...")
    create_test_user("assignee1", "assignee1@example.com")
    create_test_user("assignee2", "assignee2@example.com")
    
    # Busca IDs dos usuários criados
    print("\\n🔍 Buscando IDs dos usuários...")
    assignee1_id = get_user_by_username(token, "assignee1")
    assignee2_id = get_user_by_username(token, "assignee2")
    
    if not assignee1_id or not assignee2_id:
        print("❌ Não foi possível encontrar os usuários criados. Encerrando.")
        return
    
    results = {
        "criar_com_responsavel": False,
        "criar_sem_responsavel": False,
        "atribuir_responsavel": False,
        "alterar_responsavel": False,
        "remover_responsavel": False
    }
    
    # Teste 1: Criar tarefa com responsável
    print(f"\\n🔍 Testando criação de tarefa com responsável (ID {assignee1_id})...")
    task1_id = create_task_with_assignee(token, project_id, assignee1_id)
    results["criar_com_responsavel"] = task1_id is not None
    
    # Teste 2: Criar tarefa sem responsável
    print("\\n🔍 Testando criação de tarefa sem responsável...")
    task2_id = create_task_without_assignee(token, project_id)
    results["criar_sem_responsavel"] = task2_id is not None
    
    if task2_id:
        # Teste 3: Atribuir responsável a tarefa sem responsável
        print(f"\\n🔍 Testando atribuição de responsável (ID {assignee1_id})...")
        results["atribuir_responsavel"] = assign_user_to_task(token, task2_id, assignee1_id)
        
        # Teste 4: Alterar responsável
        print(f"\\n🔍 Testando alteração de responsável (para ID {assignee2_id})...")
        results["alterar_responsavel"] = change_task_assignee(token, task2_id, assignee2_id)
        
        # Teste 5: Remover responsável
        print("\\n🔍 Testando remoção de responsável...")
        results["remover_responsavel"] = remove_task_assignee(token, task2_id)
        
        # Verificar estado final
        print("\\n🔍 Verificando estado final da tarefa...")
        get_task_details(token, task2_id)
    
    # Resumo
    print("\\n📊 RESUMO DOS TESTES:")
    print(f"✅ Criar com Responsável: {'✅' if results['criar_com_responsavel'] else '❌'}")
    print(f"✅ Criar sem Responsável: {'✅' if results['criar_sem_responsavel'] else '❌'}")
    print(f"✅ Atribuir Responsável: {'✅' if results['atribuir_responsavel'] else '❌'}")
    print(f"✅ Alterar Responsável: {'✅' if results['alterar_responsavel'] else '❌'}")
    print(f"✅ Remover Responsável: {'✅' if results['remover_responsavel'] else '❌'}")
    
    success_count = sum(results.values())
    total_tests = len(results)
    
    if success_count == total_tests:
        print(f"\\n✅ Todos os testes de atribuição de responsáveis passaram! ({success_count}/{total_tests})")
    else:
        print(f"\\n⚠️ Alguns testes falharam: {success_count}/{total_tests} passaram")

if __name__ == "__main__":
    main()

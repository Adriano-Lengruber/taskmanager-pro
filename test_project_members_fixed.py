#!/usr/bin/env python3
"""
Teste de Gerenciamento de Membros em Projetos
TaskManager Pro - Teste automatizado para adicionar/remover membros
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
    return "MEM" + ''.join(random.choices(string.digits, k=4))

def get_token():
    """Obtém token de autenticação"""
    print("🔑 Obtendo token de autenticação...")
    
    # Primeiro, registra um usuário para teste
    register_data = {
        "username": "testuser_members",
        "email": "testmembers@example.com",
        "password": "testpass123",
        "full_name": "Test User Members",
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
        "username": "testuser_members",
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
        "name": "Projeto para Teste de Membros",
        "description": "Projeto criado para testar gerenciamento de membros",
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
    """Cria um usuário para adicionar como membro"""
    user_data = {
        "username": username,
        "email": email,
        "password": "memberpass123",
        "full_name": f"Member {username}",
        "confirm_password": "memberpass123"
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

def test_add_member(token, project_id, user_id):
    """Testa adicionar membro ao projeto"""
    headers = {"Authorization": f"Bearer {token}"}
    
    member_data = {
        "user_id": user_id,
        "role": "MEMBER"
    }
    
    response = requests.post(f"{API_BASE}/projects/{project_id}/members", 
                           json=member_data, 
                           headers=headers,
                           timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Membro adicionado com sucesso!")
        return True
    else:
        print(f"❌ Erro ao adicionar membro: {response.text}")
        return False

def test_list_members(token, project_id):
    """Testa listar membros do projeto"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/projects/{project_id}/members", 
                           headers=headers,
                           timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        members = response.json()
        members_list = members.get("items", members) if isinstance(members, dict) else members
        print(f"✅ Membros listados: {len(members_list)} encontrados")
        return members_list
    else:
        print(f"❌ Erro ao listar membros: {response.text}")
        return None

def test_remove_member(token, project_id, user_id):
    """Testa remover membro do projeto"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.delete(f"{API_BASE}/projects/{project_id}/members/{user_id}", 
                              headers=headers,
                              timeout=10)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Membro removido com sucesso!")
        return True
    else:
        print(f"❌ Erro ao remover membro: {response.text}")
        return False

def main():
    print("🚀 TaskManager Pro - Teste de Gerenciamento de Membros\\n")
    
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
    
    # Cria usuários para adicionar como membros
    print("\\n🔍 Criando usuários para teste...")
    create_test_user("member1", "member1@example.com")
    create_test_user("member2", "member2@example.com")
    
    # Busca IDs dos usuários criados
    print("\\n🔍 Buscando IDs dos usuários...")
    member1_id = get_user_by_username(token, "member1")
    member2_id = get_user_by_username(token, "member2")
    
    if not member1_id or not member2_id:
        print("❌ Não foi possível encontrar os usuários criados. Encerrando.")
        return
    
    results = {
        "adicionar_membro1": False,
        "adicionar_membro2": False,
        "listar_membros": False,
        "remover_membro": False
    }
    
    # Teste 1: Adicionar primeiro membro
    print(f"\\n🔍 Testando adição do primeiro membro (ID {member1_id})...")
    results["adicionar_membro1"] = test_add_member(token, project_id, member1_id)
    
    # Teste 2: Adicionar segundo membro
    print(f"\\n🔍 Testando adição do segundo membro (ID {member2_id})...")
    results["adicionar_membro2"] = test_add_member(token, project_id, member2_id)
    
    # Teste 3: Listar membros
    print("\\n🔍 Testando listagem de membros...")
    members = test_list_members(token, project_id)
    results["listar_membros"] = members is not None
    
    # Teste 4: Remover membro
    print(f"\\n🔍 Testando remoção de membro (ID {member1_id})...")
    results["remover_membro"] = test_remove_member(token, project_id, member1_id)
    
    # Resumo
    print("\\n📊 RESUMO DOS TESTES:")
    print(f"✅ Adicionar Membro 1: {'✅' if results['adicionar_membro1'] else '❌'}")
    print(f"✅ Adicionar Membro 2: {'✅' if results['adicionar_membro2'] else '❌'}")
    print(f"✅ Listar Membros: {'✅' if results['listar_membros'] else '❌'}")
    print(f"✅ Remover Membro: {'✅' if results['remover_membro'] else '❌'}")
    
    success_count = sum(results.values())
    total_tests = len(results)
    
    if success_count == total_tests:
        print(f"\\n✅ Todos os testes de gerenciamento de membros passaram! ({success_count}/{total_tests})")
    else:
        print(f"\\n⚠️ Alguns testes falharam: {success_count}/{total_tests} passaram")

if __name__ == "__main__":
    main()

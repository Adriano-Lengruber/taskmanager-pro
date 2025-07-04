#!/usr/bin/env python3
"""
Teste simples para debug da API
"""
import requests

def debug_projects():
    """Debug dos projetos"""
    # Login
    login_url = "http://localhost:8000/api/v1/auth/login"
    form_data = {"username": "newuser456", "password": "testpassword123"}
    
    response = requests.post(login_url, data=form_data)
    if response.status_code != 200:
        print("❌ Falha no login")
        return
    
    token = response.json()["access_token"]
    print("✅ Login OK")
    
    # Testar projetos
    projects_url = "http://localhost:8000/api/v1/projects"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(projects_url, headers=headers)
    print(f"Status da listagem: {response.status_code}")
    print(f"Response completo: {response.text}")
    
    if response.status_code == 200:
        projects = response.json()
        print(f"Tipo do retorno: {type(projects)}")
        print(f"Tamanho: {len(projects) if isinstance(projects, list) else 'N/A'}")
        
        if projects:
            print(f"Primeiro projeto: {projects[0] if isinstance(projects, list) else projects}")

if __name__ == "__main__":
    debug_projects()

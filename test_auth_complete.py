#!/usr/bin/env python3
"""
Teste completo das funcionalidades de autenticação
"""
import requests
import json

def test_api_health():
    """Testar se a API está funcionando"""
    print("🔍 Testando health da API...")
    url = "http://localhost:8000/api/health"
    try:
        response = requests.get(url, timeout=5)
        print(f"✅ API Health: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ API Health falhou: {e}")
        return False

def test_register():
    """Testar registro de novo usuário"""
    print("\n🔍 Testando registro de usuário...")
    url = "http://localhost:8000/api/v1/auth/register"
    data = {
        "username": "testuser789", 
        "email": "testuser789@example.com", 
        "full_name": "Test User 789", 
        "password": "testpassword123", 
        "confirm_password": "testpassword123"
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Registro bem-sucedido!")
            print(f"Response: {response.json()}")
            return True
        else:
            print("⚠️ Registro falhou (pode ser usuário já existente)")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro no registro: {e}")
        return False

def test_login():
    """Testar login de usuário"""
    print("\n🔍 Testando login de usuário...")
    url = "http://localhost:8000/api/v1/auth/login"
    
    # OAuth2PasswordRequestForm expects form-data
    form_data = {
        "username": "newuser456",  # Usuário que sabemos que existe
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(url, data=form_data, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login bem-sucedido!")
            response_data = response.json()
            token = response_data.get("access_token")
            if token:
                print(f"🔑 Token obtido: {token[:30]}...")
                return token
        else:
            print("❌ Login falhou!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        return None

def test_protected_endpoint(token):
    """Testar endpoint protegido com token"""
    print("\n🔍 Testando endpoint protegido...")
    url = "http://localhost:8000/api/v1/auth/me"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Endpoint protegido funcionando!")
            user_data = response.json()
            print(f"Usuário: {user_data.get('username')} ({user_data.get('email')})")
            return True
        else:
            print("❌ Endpoint protegido falhou!")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro no endpoint protegido: {e}")
        return False

def main():
    """Executar todos os testes"""
    print("🚀 TaskManager Pro - Teste de Autenticação\n")
    
    # Teste 1: Health check
    if not test_api_health():
        print("❌ API não está respondendo. Verifique se o backend está rodando.")
        return
    
    # Teste 2: Registro (pode falhar se usuário já existe)
    test_register()
    
    # Teste 3: Login
    token = test_login()
    if not token:
        print("❌ Não foi possível obter token. Abortando testes.")
        return
    
    # Teste 4: Endpoint protegido
    test_protected_endpoint(token)
    
    print("\n✅ Testes de autenticação concluídos!")

if __name__ == "__main__":
    main()

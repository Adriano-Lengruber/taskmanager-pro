#!/usr/bin/env python3
"""
Teste rápido do endpoint de registro
"""
import requests
import json

def test_register():
    url = "http://localhost:8000/api/v1/auth/register"
    data = {
        "username": "newuser456", 
        "email": "newuser456@example.com", 
        "full_name": "New User 456", 
        "password": "testpassword123", 
        "confirm_password": "testpassword123"
    }
    
    print(f"Testing URL: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
        else:
            print("❌ Registration failed!")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_register()

#!/usr/bin/env python3
"""
Teste do endpoint de login
"""
import requests
import json

def test_login():
    url = "http://localhost:8000/api/v1/auth/login"
    # OAuth2PasswordRequestForm expects form-data, not JSON
    form_data = {
        "username": "newuser456",
        "password": "testpassword123"
    }
    
    print(f"Testing URL: {url}")
    print(f"Form Data: {json.dumps(form_data, indent=2)}")
    
    try:
        # Send as form-data, not JSON
        response = requests.post(url, data=form_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            response_data = response.json()
            if "access_token" in response_data:
                token = response_data["access_token"]
                print(f"🔑 Token: {token[:20]}...")
                return token
            else:
                print("⚠️ No token in response")
        else:
            print("❌ Login failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

if __name__ == "__main__":
    test_login()

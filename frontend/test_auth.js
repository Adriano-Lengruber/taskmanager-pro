// Script para testar autenticação manual
// Abra o console do navegador em http://localhost:5174 e execute:

// 1. Limpar storage
localStorage.clear();

// 2. Fazer login via API
fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=testuser&password=testpass123'
})
.then(r => r.json())
.then(data => {
  console.log('Login response:', data);
  if (data.access_token) {
    localStorage.setItem('auth_token', data.access_token);
    console.log('Token stored:', data.access_token);
    
    // Buscar dados do usuário
    return fetch('http://localhost:8000/api/v1/auth/me', {
      headers: { 'Authorization': `Bearer ${data.access_token}` }
    });
  }
})
.then(r => r.json())
.then(userData => {
  console.log('User data:', userData);
  localStorage.setItem('user_data', JSON.stringify(userData));
  console.log('User data stored');
  
  // Recarregar página para ver se funciona
  window.location.reload();
})
.catch(err => console.error('Error:', err));

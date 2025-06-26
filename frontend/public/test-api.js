// Test API communication
console.log('Testing API communication...');

// Test 1: Simple fetch to backend
fetch('http://127.0.0.1:8000/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'testapi',
    email: 'testapi@example.com',
    password: 'testapi123',
    confirm_password: 'testapi123',
    full_name: 'Test API User'
  })
})
.then(response => {
  console.log('API Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('API Response Data:', data);
})
.catch(error => {
  console.error('API Error:', error);
});

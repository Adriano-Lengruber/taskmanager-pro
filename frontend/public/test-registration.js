// Test frontend registration
async function testRegistration() {
    const testData = {
        username: "frontendtest789",
        email: "frontendtest789@example.com", 
        full_name: "Frontend Test 789",
        password: "testpassword123",
        confirmPassword: "testpassword123"
    };
    
    console.log('Testing frontend registration with:', testData);
    
    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: testData.username,
                email: testData.email,
                full_name: testData.full_name,
                password: testData.password,
                confirm_password: testData.confirmPassword
            })
        });
        
        const result = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', result);
        
        if (response.ok) {
            console.log('✅ Frontend registration successful!');
        } else {
            console.log('❌ Frontend registration failed!');
        }
    } catch (error) {
        console.error('❌ Request error:', error);
    }
}

// Call test function
testRegistration();

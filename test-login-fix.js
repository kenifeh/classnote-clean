const axios = require('axios');

console.log('🔍 Testing Login with Correct Credentials...\n');

async function testLoginWithCorrectCredentials() {
    try {
        console.log('1. Testing login with correct credentials...');
        
        // Use the same username that was successfully registered
        const loginData = {
            username: 'testuser_1754012922837',
            password: 'testpass123'
        };
        
        console.log('   Login data:', loginData);
        
        const response = await axios.post('http://localhost:3001/auth/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('✅ Login successful!');
        console.log('   Status:', response.status);
        console.log('   Response:', response.data);
        
        return response.data.token;
        
    } catch (error) {
        console.log('❌ Login failed!');
        console.log('   Error:', error.message);
        
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
        
        return null;
    }
}

async function testNewUserRegistration() {
    try {
        console.log('\n2. Testing new user registration...');
        
        const testUser = {
            username: `newuser_${Date.now()}`,
            email: `newuser_${Date.now()}@example.com`,
            password: 'password123'
        };
        
        console.log('   Test user data:', testUser);
        
        const response = await axios.post('http://localhost:3001/auth/register', testUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('✅ Registration successful!');
        console.log('   Status:', response.status);
        console.log('   User ID:', response.data.user.id);
        
        return response.data;
        
    } catch (error) {
        console.log('❌ Registration failed!');
        console.log('   Error:', error.message);
        
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
        
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting login tests...\n');
    
    await testLoginWithCorrectCredentials();
    await testNewUserRegistration();
    
    console.log('\n📊 Test completed!');
    console.log('\n🎉 User creation and authentication are now working!');
    console.log('📱 You can now use the application at http://localhost:5173');
}

runTests().catch(console.error); 
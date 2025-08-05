const axios = require('axios');

console.log('🔍 Testing User Creation...\n');

async function testUserRegistration() {
    try {
        console.log('1. Testing registration endpoint...');
        
        const testUser = {
            username: `testuser_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'testpass123'
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
        console.log('   Response:', response.data);
        
        return response.data.token;
        
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

async function testUserLogin() {
    try {
        console.log('\n2. Testing login endpoint...');
        
        const loginData = {
            username: 'testuser',
            password: 'testpass123'
        };
        
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

async function testDatabaseConnection() {
    try {
        console.log('\n3. Testing database connection...');
        
        // Try to access a protected endpoint to see if database is working
        const response = await axios.get('http://localhost:3001/notes', {
            headers: {
                'Authorization': 'Bearer invalid_token'
            },
            timeout: 5000
        });
        
        console.log('✅ Database connection working');
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Database connection working (expected 401 for invalid token)');
        } else {
            console.log('❌ Database connection issue');
            console.log('   Error:', error.message);
        }
    }
}

async function runTests() {
    console.log('🚀 Starting user creation tests...\n');
    
    await testDatabaseConnection();
    await testUserRegistration();
    await testUserLogin();
    
    console.log('\n📊 Test completed!');
}

runTests().catch(console.error); 
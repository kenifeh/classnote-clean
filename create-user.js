const axios = require('axios');

async function createTestUser() {
  console.log('Creating test user for ClassNote AI...\n');
  
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };
  
  console.log('Test User Credentials:');
  console.log('Username:', testUser.username);
  console.log('Email:', testUser.email);
  console.log('Password:', testUser.password);
  console.log('');
  
  try {
    // Check if backend is running
    console.log('Checking if backend is running...');
    await axios.get('http://localhost:3001/');
    console.log('✅ Backend is running');
    
    // Create test user
    console.log('Creating test user...');
    const registerResponse = await axios.post('http://localhost:3001/auth/register', testUser);
    console.log('✅ Test user created successfully!');
    
    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:3001/auth/login', {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
    
    console.log('');
    console.log('🎉 Test user setup complete!');
    console.log('');
    console.log('You can now login to the app with:');
    console.log('Username:', testUser.username);
    console.log('Password:', testUser.password);
    console.log('');
    console.log('Access the app at: http://localhost:5173');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running. Please start the app first with: .\\start-app.ps1');
    } else if (error.response && error.response.status === 409) {
      console.log('ℹ️ Test user already exists');
      console.log('Testing login...');
      try {
        const loginResponse = await axios.post('http://localhost:3001/auth/login', {
          username: testUser.username,
          password: testUser.password
        });
        console.log('✅ Login successful!');
        console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
        console.log('');
        console.log('🎉 Test user is ready!');
        console.log('');
        console.log('You can now login to the app with:');
        console.log('Username:', testUser.username);
        console.log('Password:', testUser.password);
        console.log('');
        console.log('Access the app at: http://localhost:5173');
      } catch (loginError) {
        console.log('❌ Login failed:', loginError.response?.data?.error || loginError.message);
      }
    } else {
      console.log('❌ Error:', error.response?.data?.error || error.message);
    }
  }
}

createTestUser(); 
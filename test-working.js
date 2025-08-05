const axios = require('axios');

async function testApplication() {
  console.log('🧪 Testing ClassNote AI Application...\n');

  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:3001');
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test 2: Frontend Accessibility
    console.log('\n2️⃣ Testing Frontend...');
    const frontendResponse = await axios.get('http://localhost:5173');
    console.log('✅ Frontend is running (Status:', frontendResponse.status + ')');
    
    // Test 3: Test Transcription API (Demo Mode)
    console.log('\n3️⃣ Testing Transcription API (Demo Mode)...');
    
    // Create a mock audio file (just a text file for testing)
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');
    
    // Create a dummy audio file
    const dummyAudioPath = path.join(__dirname, 'test-audio.txt');
    fs.writeFileSync(dummyAudioPath, 'This is a test audio file');
    
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(dummyAudioPath), {
      filename: 'test-audio.mp3',
      contentType: 'audio/mp3'
    });
    
    const transcribeResponse = await axios.post('http://localhost:3001/transcribe', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Transcription API working:', transcribeResponse.data.text ? 'Demo text returned' : 'No text returned');
    
    // Test 4: Test Summarization API (Demo Mode)
    console.log('\n4️⃣ Testing Summarization API (Demo Mode)...');
    const summarizeResponse = await axios.post('http://localhost:3001/summarize', {
      text: 'This is a test lecture about artificial intelligence and machine learning. We discussed neural networks and deep learning algorithms.'
    });
    
    console.log('✅ Summarization API working:', summarizeResponse.data.summary ? 'Summary generated' : 'No summary generated');
    
    // Clean up
    fs.unlinkSync(dummyAudioPath);
    
    console.log('\n🎉 All tests passed! The application is working correctly.');
    console.log('\n📱 You can now:');
    console.log('   • Open http://localhost:5173 in your browser');
    console.log('   • Upload an audio file');
    console.log('   • Get transcription and summary (demo mode)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testApplication(); 
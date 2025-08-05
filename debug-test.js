const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function debugTest() {
  console.log('🔍 Debug Test - Checking API Responses\n');

  try {
    // Test transcription API
    console.log('1️⃣ Testing Transcription API...');
    
    // Create a dummy audio file
    const dummyAudioPath = path.join(__dirname, 'debug-audio.txt');
    fs.writeFileSync(dummyAudioPath, 'test content');
    
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(dummyAudioPath), {
      filename: 'debug-audio.mp3',
      contentType: 'audio/mp3'
    });
    
    const transcribeResponse = await axios.post('http://localhost:3001/transcribe', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('📝 Transcription Response:');
    console.log(JSON.stringify(transcribeResponse.data, null, 2));
    
    // Test summarization API
    console.log('\n2️⃣ Testing Summarization API...');
    const testText = "Welcome to today's lecture on artificial intelligence and machine learning. We'll be discussing the fundamentals of neural networks, deep learning algorithms, and their applications in modern technology.";
    
    const summarizeResponse = await axios.post('http://localhost:3001/summarize', {
      text: testText
    });
    
    console.log('📋 Summarization Response:');
    console.log(JSON.stringify(summarizeResponse.data, null, 2));
    
    // Clean up
    fs.unlinkSync(dummyAudioPath);
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugTest(); 
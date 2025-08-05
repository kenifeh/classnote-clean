const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAudioUpload() {
  console.log('🧪 Testing Audio Upload with Real API...\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Check backend status
    console.log('1️⃣ Checking Backend Status...');
    const healthResponse = await axios.get('http://localhost:3001');
    console.log('✅ Backend Status:', healthResponse.data.status);
    console.log('✅ API Key Status:', healthResponse.data.hasApiKey ? 'Found' : 'Missing');
    
    if (!healthResponse.data.hasApiKey) {
      console.log('\n❌ No OpenAI API key found!');
      return;
    }
    
    // Test 2: Try with a real audio file (if available) or create a test
    console.log('\n2️⃣ Testing Audio File Upload...');
    
    // Check if there are any real audio files in the uploads folder
    const uploadsDir = path.join(__dirname, 'backend', 'uploads');
    const audioFiles = fs.readdirSync(uploadsDir).filter(file => 
      file.match(/\.(mp3|wav|m4a|flac|ogg|webm|aac)$/i)
    );
    
    if (audioFiles.length > 0) {
      console.log('📁 Found audio files in uploads folder:', audioFiles);
      
      // Use the first audio file
      const audioFile = audioFiles[0];
      const audioPath = path.join(uploadsDir, audioFile);
      
      console.log(`📤 Uploading ${audioFile} to OpenAI Whisper API...`);
      
      const formData = new FormData();
      formData.append('audio', fs.createReadStream(audioPath));
      
      const transcribeResponse = await axios.post('http://localhost:3001/transcribe', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      const transcriptionText = transcribeResponse.data.text;
      console.log('✅ Transcription Response:');
      console.log('📝 Length:', transcriptionText.length, 'characters');
      console.log('📝 Content:', transcriptionText);
      
      // Check if it's real or demo content
      if (transcriptionText.includes("This is the transcription of your audio file")) {
        console.log('❌ Still getting demo content - this might be due to file format issues');
      } else if (transcriptionText.includes("Welcome to today's lecture")) {
        console.log('❌ Still getting demo content - API key might not be working for transcription');
      } else {
        console.log('✅ Real transcription received!');
      }
      
    } else {
      console.log('📁 No audio files found in uploads folder');
      console.log('💡 To test with real audio:');
      console.log('   1. Upload an audio file through the web interface');
      console.log('   2. Check the backend/uploads folder for the file');
      console.log('   3. Run this test again');
    }
    
    // Test 3: Test summarization with real API
    console.log('\n3️⃣ Testing Real Summarization...');
    const testText = "This is a test of the real OpenAI API. We are checking if the summarization is working correctly with the actual GPT model.";
    
    const summarizeResponse = await axios.post('http://localhost:3001/summarize', {
      text: testText
    });
    
    const summaryText = summarizeResponse.data.summary;
    console.log('✅ Summarization Response:');
    console.log('📝 Summary:', summaryText);
    
    // Final Results
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 AUDIO UPLOAD TEST COMPLETE');
    console.log('=' .repeat(60));
    
    console.log('\n📝 Troubleshooting:');
    console.log('   • If you see "This is the transcription of your audio file" - file format issue');
    console.log('   • If you see "Welcome to today\'s lecture" - demo mode still active');
    console.log('   • If you see real transcription - everything is working!');
    
    console.log('\n🎯 Next Steps:');
    console.log('   • Try uploading a real audio file (mp3, wav, m4a) through the web interface');
    console.log('   • Make sure the file is actually an audio file, not a text file');
    console.log('   • Check the browser console for any errors');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAudioUpload(); 
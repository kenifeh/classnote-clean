const axios = require('axios');

async function testRealAPISimple() {
  console.log('🧪 Testing ClassNote AI with Real OpenAI API (Simple Test)...\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:3001');
    console.log('✅ Backend Status:', healthResponse.data.status);
    console.log('✅ API Key Status:', healthResponse.data.hasApiKey ? 'Found' : 'Missing');
    
    if (!healthResponse.data.hasApiKey) {
      console.log('\n❌ No OpenAI API key found!');
      return;
    }
    
    // Test 2: Test Real Summarization (no file upload needed)
    console.log('\n2️⃣ Testing Real Summarization...');
    console.log('📝 Note: This will use real OpenAI GPT API calls and may incur costs.');
    
    const sampleText = "Welcome to today's lecture on artificial intelligence and machine learning. We'll be discussing the fundamentals of neural networks, deep learning algorithms, and their applications in modern technology. The field of AI has evolved significantly over the past decade, with breakthroughs in natural language processing, computer vision, and autonomous systems. These technologies are transforming industries from healthcare to finance, creating new opportunities and challenges for society.";
    
    console.log('📤 Sending text to OpenAI GPT API for summarization...');
    const summarizeResponse = await axios.post('http://localhost:3001/summarize', {
      text: sampleText
    });
    
    const summaryText = summarizeResponse.data.summary;
    console.log('✅ Real Summary Generated!');
    console.log('📝 Original Length:', sampleText.length, 'characters');
    console.log('📝 Summary Length:', summaryText.length, 'characters');
    console.log('📝 Summary:', summaryText);
    
    // Final Results
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 REAL API TEST COMPLETE - SUCCESS!');
    console.log('=' .repeat(60));
    console.log('\n✅ OpenAI API Key: Valid and working');
    console.log('✅ GPT API: Real summarization working');
    console.log('✅ Backend: Properly configured');
    
    console.log('\n💰 Cost Information:');
    console.log('   • GPT-3.5-turbo: ~$0.002 per 1K tokens');
    console.log('   • Whisper API: ~$0.006 per minute of audio');
    console.log('   • Monitor usage at: https://platform.openai.com/usage');
    
    console.log('\n📱 Ready to Use:');
    console.log('   • Main App: http://localhost:5173');
    console.log('   • Upload real audio files for transcription');
    console.log('   • Get AI-powered summaries');
    
    console.log('\n🎯 Next Steps:');
    console.log('   • Try uploading a real audio file through the web interface');
    console.log('   • Test with different audio formats (mp3, wav, m4a)');
    console.log('   • Monitor your OpenAI usage and costs');
    
  } catch (error) {
    console.error('\n❌ Real API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n🔑 API Key Error:');
        console.log('   • Check if your OpenAI API key is valid');
        console.log('   • Ensure you have sufficient credits');
        console.log('   • Verify the key is correctly set in .env file');
      }
    }
  }
}

testRealAPISimple(); 
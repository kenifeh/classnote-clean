const axios = require('axios');
const FormData = require('form-data');

async function finalTest() {
    console.log('🔍 FINAL BACKEND TEST\n');

    try {
        // Test 1: Health check
        console.log('1. Testing backend health...');
        const healthResponse = await axios.get('http://localhost:3001/');
        console.log('   Status:', healthResponse.data);
        console.log('   Demo mode:', !healthResponse.data.hasApiKey ? 'Enabled' : 'Disabled');
        console.log('');

        // Test 2: Transcribe endpoint
        console.log('2. Testing transcribe endpoint...');
        
        // Create a minimal WAV file
        const wavData = Buffer.from([
            0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
            0x66, 0x6D, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
            0x44, 0xAC, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
            0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00
        ]);

        const formData = new FormData();
        formData.append('audio', wavData, { filename: 'test.wav', contentType: 'audio/wav' });

        const transcribeResponse = await axios.post('http://localhost:3001/transcribe', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        console.log('   Response received');
        console.log('   Full response:', JSON.stringify(transcribeResponse.data, null, 2));
        console.log('   Text length:', transcribeResponse.data.text.length);
        console.log('   Text preview:', transcribeResponse.data.text.substring(0, 100) + '...');
        console.log('');

        // Check what text we're getting
        if (transcribeResponse.data.text.includes("Welcome to today's lecture")) {
            console.log('✅ SUCCESS: Backend is returning improved demo text!');
            console.log('   The issue is definitely browser caching.');
        } else if (transcribeResponse.data.text.includes("This is the transcription of your audio file")) {
            console.log('❌ ISSUE: Backend is still returning old demo text');
            console.log('   There might be an old backend process running.');
        } else {
            console.log('❓ UNKNOWN: Backend is returning different text');
            console.log('   Full text:', transcribeResponse.data.text);
        }

        console.log('');
        console.log('💡 Next steps:');
        console.log('   1. Open fresh-test.html in your browser');
        console.log('   2. Click "Test Transcribe"');
        console.log('   3. Compare the results');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

finalTest(); 
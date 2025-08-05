const axios = require('axios');
const FormData = require('form-data');

async function quickVerify() {
    console.log('🔍 Quick Backend Verification\n');
    
    try {
        // Test transcribe endpoint
        console.log('Testing transcribe endpoint...');
        
        // Create a minimal WAV file
        const wavData = Buffer.from([
            0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
            0x66, 0x6D, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
            0x44, 0xAC, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
            0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00
        ]);
        
        const formData = new FormData();
        formData.append('audio', wavData, { filename: 'test.wav', contentType: 'audio/wav' });
        
        const response = await axios.post('http://localhost:3001/transcribe', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });
        
        console.log('Response received:');
        console.log('Text length:', response.data.text.length);
        console.log('Text preview:', response.data.text.substring(0, 100) + '...');
        
        if (response.data.text.includes("Welcome to today's lecture")) {
            console.log('✅ SUCCESS: Backend is returning improved demo text!');
        } else if (response.data.text.includes("This is the transcription of your audio file")) {
            console.log('❌ ISSUE: Backend is still returning old demo text');
        } else {
            console.log('❓ UNKNOWN: Backend is returning different text');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

quickVerify(); 
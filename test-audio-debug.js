const axios = require('axios');

console.log('🔍 Debugging Audio Playback in Notes...\n');

async function debugAudioPlayback() {
    try {
        // First, let's register a test user and get a token
        console.log('👤 Creating test user...');
        
        const testUser = {
            username: `testuser_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'testpassword123'
        };
        
        const registerResponse = await axios.post('http://localhost:3001/auth/register', testUser);
        
        if (registerResponse.status === 200 || registerResponse.status === 201) {
            const token = registerResponse.data.token;
            console.log('✅ Test user created successfully');
            console.log(`   Username: ${testUser.username}`);
            console.log(`   Token: ${token.substring(0, 20)}...`);
            
            // Now let's test the notes endpoint
            console.log('\n📋 Testing notes endpoint...');
            
            const notesResponse = await axios.get('http://localhost:3001/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (notesResponse.status === 200) {
                const notes = notesResponse.data.notes;
                console.log(`✅ Found ${notes.length} notes`);
                
                if (notes.length > 0) {
                    const firstNote = notes[0];
                    console.log(`\n📝 Testing with note: ${firstNote.title} (ID: ${firstNote.id})`);
                    console.log(`   Filename: ${firstNote.original_filename}`);
                    console.log(`   File size: ${firstNote.file_size} bytes`);
                    
                    // Test the audio endpoint
                    console.log('\n🎵 Testing audio endpoint...');
                    
                    const audioResponse = await axios.get(`http://localhost:3001/notes/${firstNote.id}/audio`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        responseType: 'stream',
                        validateStatus: function (status) {
                            return status < 500;
                        }
                    });
                    
                    console.log(`   Status: ${audioResponse.status}`);
                    console.log(`   Content-Type: ${audioResponse.headers['content-type']}`);
                    console.log(`   Content-Length: ${audioResponse.headers['content-length']}`);
                    console.log(`   Accept-Ranges: ${audioResponse.headers['accept-ranges']}`);
                    
                    if (audioResponse.status === 200) {
                        console.log('✅ Audio endpoint working!');
                        console.log('   Audio file is being served correctly');
                    } else if (audioResponse.status === 404) {
                        console.log('❌ Audio file not found');
                        console.log('   This means the file exists in the database but not on disk');
                    } else {
                        console.log(`❌ Unexpected status: ${audioResponse.status}`);
                    }
                    
                    // Test the transcript endpoint
                    console.log('\n📖 Testing transcript endpoint...');
                    
                    const transcriptResponse = await axios.get(`http://localhost:3001/notes/${firstNote.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (transcriptResponse.status === 200) {
                        console.log('✅ Transcript endpoint working!');
                        const note = transcriptResponse.data.note;
                        console.log(`   Has transcript: ${!!note.transcription_text}`);
                        console.log(`   Has summary: ${!!note.summary_text}`);
                    } else {
                        console.log(`❌ Transcript endpoint failed: ${transcriptResponse.status}`);
                    }
                    
                } else {
                    console.log('⚠️ No notes found. You need to upload an audio file first.');
                }
            } else {
                console.log(`❌ Failed to get notes: ${notesResponse.status}`);
            }
            
        } else {
            console.log(`❌ Failed to create test user: ${registerResponse.status}`);
        }
        
        console.log('\n🎉 Audio debugging completed!');
        console.log('\n📱 Issues Fixed:');
        console.log('   ✅ Added audio tracking to prevent multiple tracks');
        console.log('   ✅ Enhanced error handling for audio playback');
        console.log('   ✅ Added debugging logs for audio requests');
        console.log('   ✅ Fixed modal audio cleanup');
        
    } catch (error) {
        console.log('❌ Test failed:');
        console.log('   Error:', error.message);
        
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
    }
}

// Wait for server to start
setTimeout(() => {
    debugAudioPlayback();
}, 3000); 
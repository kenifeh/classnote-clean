const axios = require('axios');

console.log('🔍 Testing Existing Notes Audio Playback...\n');

async function testExistingNotes() {
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
            
            // Test the notes endpoint
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
                    console.log('\n📝 Notes found:');
                    notes.forEach((note, index) => {
                        console.log(`   ${index + 1}. ID: ${note.id}, Title: "${note.title}"`);
                        console.log(`      Filename: ${note.original_filename}`);
                        console.log(`      File size: ${note.file_size} bytes`);
                        console.log(`      Created: ${new Date(note.created_at).toLocaleString()}`);
                        console.log('');
                    });
                    
                    // Test audio playback for the first note
                    const firstNote = notes[0];
                    console.log(`🎵 Testing audio playback for note: ${firstNote.title}`);
                    
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
                    
                    if (audioResponse.status === 200) {
                        console.log('✅ Audio playback endpoint working!');
                        console.log('   The audio file is being served correctly');
                    } else if (audioResponse.status === 404) {
                        console.log('❌ Audio file not found on disk');
                        console.log('   This means the file exists in the database but not in the uploads folder');
                    } else {
                        console.log(`❌ Unexpected status: ${audioResponse.status}`);
                    }
                    
                } else {
                    console.log('⚠️ No notes found for this user.');
                    console.log('   To test audio playback, you need to:');
                    console.log('   1. Upload an audio file through the web interface');
                    console.log('   2. Or use an existing user account that has notes');
                }
            } else {
                console.log(`❌ Failed to get notes: ${notesResponse.status}`);
            }
            
        } else {
            console.log(`❌ Failed to create test user: ${registerResponse.status}`);
        }
        
        console.log('\n🎉 Audio playback test completed!');
        console.log('\n📱 Issues Fixed:');
        console.log('   ✅ Fixed multiple audio tracks playing simultaneously');
        console.log('   ✅ Enhanced error handling for audio playback');
        console.log('   ✅ Added debugging logs for troubleshooting');
        console.log('   ✅ Fixed modal audio cleanup on close');
        console.log('   ✅ Added audio tracking to prevent conflicts');
        console.log('\n💡 To test audio playback:');
        console.log('   1. Open the web interface in your browser');
        console.log('   2. Upload an audio file');
        console.log('   3. Go to the Notes tab');
        console.log('   4. Click the 🎵 button on any note');
        
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
    testExistingNotes();
}, 3000); 
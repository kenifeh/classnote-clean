const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Audio Filename Mismatch...\n');

async function debugAudioFilenames() {
    try {
        // Step 1: Create test user
        console.log('👤 Step 1: Creating test user...');
        
        const testUser = {
            username: `debuguser_${Date.now()}`,
            email: `debug_${Date.now()}@example.com`,
            password: 'testpassword123'
        };
        
        const registerResponse = await axios.post('http://localhost:3001/auth/register', testUser);
        
        if (registerResponse.status === 200 || registerResponse.status === 201) {
            const token = registerResponse.data.token;
            console.log('✅ Test user created successfully');
            console.log(`   Username: ${testUser.username}`);
            
            // Step 2: Get notes from database
            console.log('\n📋 Step 2: Getting notes from database...');
            
            const notesResponse = await axios.get('http://localhost:3001/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (notesResponse.status === 200) {
                const notes = notesResponse.data.notes;
                console.log(`✅ Found ${notes.length} notes in database`);
                
                if (notes.length > 0) {
                    console.log('\n📝 Database Notes:');
                    notes.forEach((note, index) => {
                        console.log(`   ${index + 1}. ID: ${note.id}`);
                        console.log(`      Title: "${note.title}"`);
                        console.log(`      Original Filename: "${note.original_filename}"`);
                        console.log(`      File Size: ${note.file_size} bytes`);
                        console.log(`      Created: ${new Date(note.created_at).toLocaleString()}`);
                        console.log('');
                    });
                    
                    // Step 3: Check uploads directory
                    console.log('📁 Step 3: Checking uploads directory...');
                    const uploadsDir = path.join(__dirname, 'backend', 'uploads');
                    
                    if (fs.existsSync(uploadsDir)) {
                        const files = fs.readdirSync(uploadsDir);
                        console.log(`✅ Found ${files.length} files in uploads directory`);
                        
                        console.log('\n📁 Uploads Directory Files:');
                        files.slice(0, 10).forEach((file, index) => {
                            const filePath = path.join(uploadsDir, file);
                            const stats = fs.statSync(filePath);
                            console.log(`   ${index + 1}. "${file}" (${stats.size} bytes)`);
                        });
                        
                        if (files.length > 10) {
                            console.log(`   ... and ${files.length - 10} more files`);
                        }
                        
                        // Step 4: Check for filename matches
                        console.log('\n🔍 Step 4: Checking for filename matches...');
                        const firstNote = notes[0];
                        const expectedFile = firstNote.original_filename;
                        const expectedPath = path.join(uploadsDir, expectedFile);
                        
                        console.log(`   Looking for: "${expectedFile}"`);
                        console.log(`   Expected path: "${expectedPath}"`);
                        console.log(`   File exists: ${fs.existsSync(expectedPath)}`);
                        
                        if (!fs.existsSync(expectedPath)) {
                            console.log('\n❌ PROBLEM FOUND:');
                            console.log('   The filename stored in the database does not match any file in the uploads directory!');
                            console.log('   This is why audio playback returns 404.');
                            
                            // Look for similar filenames
                            console.log('\n🔍 Looking for similar filenames...');
                            const similarFiles = files.filter(file => 
                                file.includes(expectedFile.split('.')[0]) || 
                                expectedFile.includes(file.split('.')[0])
                            );
                            
                            if (similarFiles.length > 0) {
                                console.log('   Similar files found:');
                                similarFiles.forEach(file => console.log(`     - "${file}"`));
                            } else {
                                console.log('   No similar files found.');
                            }
                        } else {
                            console.log('\n✅ File found! Audio should work.');
                        }
                        
                    } else {
                        console.log('❌ Uploads directory does not exist!');
                    }
                    
                } else {
                    console.log('⚠️ No notes found for this user.');
                    console.log('   To test audio playback, you need to upload an audio file first.');
                }
            } else {
                console.log(`❌ Failed to get notes: ${notesResponse.status}`);
            }
            
        } else {
            console.log(`❌ Failed to create test user: ${registerResponse.status}`);
        }
        
        console.log('\n🎉 Filename debug completed!');
        
    } catch (error) {
        console.log('❌ Debug failed:');
        console.log('   Error:', error.message);
        
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
    }
}

// Wait for server to start
setTimeout(() => {
    debugAudioFilenames();
}, 3000); 
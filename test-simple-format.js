const axios = require('axios');

console.log('🧪 Testing Simple Format Instruction...\n');

async function testSimpleFormat() {
    try {
        console.log('📝 Testing with simple format instruction...');
        
        const simpleText = "Today we learned about photosynthesis. Plants use sunlight to convert carbon dioxide and water into glucose and oxygen. This process happens in the chloroplasts.";
        
        const response = await axios.post('http://localhost:3001/summarize', {
            text: simpleText
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
        
        console.log('✅ Response received!');
        console.log('\n📋 SUMMARY:');
        console.log('=' .repeat(50));
        console.log(response.data.summary);
        console.log('=' .repeat(50));
        
        // Check if it starts with the expected format
        const summary = response.data.summary;
        const startsWithKeyConcepts = summary.includes('• Key Concepts:') || summary.includes('Key Concepts:');
        const hasStructuredFormat = summary.includes('• Important Definitions:') || summary.includes('• Key Facts:') || summary.includes('• Main Arguments:') || summary.includes('• Study Notes:');
        
        console.log('\n🔍 Analysis:');
        console.log(`Starts with "• Key Concepts:": ${startsWithKeyConcepts ? 'YES' : 'NO'}`);
        console.log(`Has structured format: ${hasStructuredFormat ? 'YES' : 'NO'}`);
        console.log(`Contains bullet points: ${summary.includes('•') ? 'YES' : 'NO'}`);
        console.log(`Summary length: ${summary.length} characters`);
        
        if (startsWithKeyConcepts && hasStructuredFormat) {
            console.log('🎉 Study-friendly format is working!');
        } else if (startsWithKeyConcepts) {
            console.log('✅ Partial format working');
        } else {
            console.log('⚠️ Format instruction not being followed');
        }
        
    } catch (error) {
        console.log('❌ Test failed:');
        console.log('   Error:', error.message);
        
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
    }
}

testSimpleFormat(); 
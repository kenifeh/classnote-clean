const axios = require('axios');

console.log('🎯 ClassNote AI - Quick Status Test');
console.log('=====================================\n');

async function testBackend() {
    try {
        const response = await axios.get('http://localhost:3001');
        console.log('✅ Backend: Running on port 3001');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${response.data}`);
        return true;
    } catch (error) {
        console.log('❌ Backend: Not accessible');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testFrontend() {
    try {
        const response = await axios.get('http://localhost:5173');
        console.log('✅ Frontend: Running on port 5173');
        console.log(`   Status: ${response.status}`);
        console.log(`   Content Length: ${response.data.length} characters`);
        return true;
    } catch (error) {
        console.log('❌ Frontend: Not accessible');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testSummarization() {
    try {
        const response = await axios.post('http://localhost:3001/summarize', {
            text: 'This is a test text for summarization.'
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('✅ Summarization: Working');
        console.log(`   Summary: ${response.data.summary}`);
        return true;
    } catch (error) {
        console.log('❌ Summarization: Failed');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('Testing servers...\n');
    
    const backendOk = await testBackend();
    console.log('');
    
    const frontendOk = await testFrontend();
    console.log('');
    
    const summaryOk = await testSummarization();
    console.log('');
    
    console.log('📊 Summary:');
    console.log(`Backend: ${backendOk ? '✅' : '❌'}`);
    console.log(`Frontend: ${frontendOk ? '✅' : '❌'}`);
    console.log(`Summarization: ${summaryOk ? '✅' : '❌'}`);
    
    if (backendOk && frontendOk) {
        console.log('\n🎉 Application is ready!');
        console.log('📱 Open http://localhost:5173 in your browser');
        console.log('🔧 API available at http://localhost:3001');
    } else {
        console.log('\n⚠️ Some components are not working');
        console.log('💡 Try running: npm start (in backend) and npm run dev (in frontend)');
    }
}

runTests().catch(console.error); 
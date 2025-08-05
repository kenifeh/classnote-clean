const axios = require('axios');

console.log('📝 Testing Simple Summary Format...\n');

async function testSimpleSummary() {
    try {
        console.log('📝 Testing with sample lecture content...');
        
        const sampleLecture = `
        Today we're going to discuss the fundamental principles of quantum mechanics, which is a branch of physics that describes the behavior of matter and energy at the atomic and subatomic level. 

        The key concept here is wave-particle duality, which states that particles like electrons can exhibit both wave-like and particle-like properties depending on how we observe them. This was first demonstrated in the famous double-slit experiment conducted by Thomas Young in 1801, though it wasn't understood in quantum terms until much later.

        Another crucial principle is the Heisenberg Uncertainty Principle, formulated by Werner Heisenberg in 1927. This principle states that we cannot simultaneously know both the position and momentum of a particle with absolute precision. The more precisely we know one, the less precisely we can know the other. This is not due to limitations in our measuring instruments, but rather a fundamental property of nature.

        The Schrödinger equation, developed by Erwin Schrödinger in 1926, is the fundamental equation of quantum mechanics. It describes how the quantum state of a physical system changes over time. The equation is written as iℏ∂ψ/∂t = Ĥψ, where ψ is the wave function, Ĥ is the Hamiltonian operator, and ℏ is the reduced Planck constant.

        Quantum superposition is another important concept. It means that a quantum system can exist in multiple states simultaneously until it is measured. For example, an electron in an atom can be in multiple energy levels at the same time, but when we measure its energy, it collapses into a single definite state.

        These principles have profound implications for our understanding of reality and have led to revolutionary technologies like quantum computing, quantum cryptography, and quantum sensors.
        `;
        
        console.log('📤 Sending to summarization endpoint...');
        
        const response = await axios.post('http://localhost:3001/summarize', {
            text: sampleLecture
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
        
        console.log('✅ Summary generated successfully!');
        console.log('\n📋 SIMPLE SUMMARY:');
        console.log('=' .repeat(50));
        console.log(response.data.summary);
        console.log('=' .repeat(50));
        
        // Check if the summary follows the new simple format
        const summary = response.data.summary;
        const hasKeyConcepts = summary.includes('• Key Concepts:') || summary.includes('Key Concepts:');
        const hasDefinitions = summary.includes('Definitions') || summary.includes('Important Definitions');
        const hasKeyFacts = summary.includes('Key Facts') || summary.includes('Important Facts');
        const hasArguments = summary.includes('Arguments') || summary.includes('Main Arguments');
        const hasStudyNotes = summary.includes('Study Notes') || summary.includes('Review Points');
        
        console.log('\n🔍 Format Analysis:');
        console.log(`❌ Key Concepts section: ${hasKeyConcepts ? 'Still present (should be removed)' : 'Removed ✅'}`);
        console.log(`❌ Definitions section: ${hasDefinitions ? 'Still present (should be removed)' : 'Removed ✅'}`);
        console.log(`❌ Key Facts section: ${hasKeyFacts ? 'Still present (should be removed)' : 'Removed ✅'}`);
        console.log(`❌ Arguments section: ${hasArguments ? 'Still present (should be removed)' : 'Removed ✅'}`);
        console.log(`❌ Study Notes section: ${hasStudyNotes ? 'Still present (should be removed)' : 'Removed ✅'}`);
        
        const summaryLength = summary.length;
        const originalLength = sampleLecture.length;
        const ratio = (summaryLength / originalLength * 100).toFixed(1);
        
        console.log(`\n📏 Summary Length: ${summaryLength} characters (${ratio}% of original)`);
        console.log(`📏 Original Length: ${originalLength} characters`);
        
        if (ratio <= 33) {
            console.log('✅ Summary length is appropriate (≤33% of original)');
        } else {
            console.log('⚠️ Summary might be too long (>33% of original)');
        }
        
        if (!hasKeyConcepts && !hasDefinitions && !hasKeyFacts && !hasArguments && !hasStudyNotes) {
            console.log('\n🎉 Simple summary format is working correctly!');
        } else {
            console.log('\n⚠️ Summary still contains categorization sections');
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

testSimpleSummary(); 
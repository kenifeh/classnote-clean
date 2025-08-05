// Test the truncation function directly
function truncateSummary(summary) {
  // Split into sections
  const sections = summary.split('• ');
  const truncatedSections = [];
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    if (section.startsWith('Key Concepts:')) {
      const concepts = section.replace('Key Concepts:', '').trim();
      const conceptList = concepts.split(',').slice(0, 3).join(',');
      truncatedSections.push(`• Key Concepts: ${conceptList}`);
    }
    else if (section.startsWith('Important Definitions:')) {
      // Extract only the first 2 definitions, truncate each
      const content = section.replace('Important Definitions:', '').trim();
      const defLines = content.split('\n').filter(line => line.trim() && line.includes(':'));
      const shortDefs = defLines.slice(0, 2).map(def => {
        const cleanDef = def.replace(/^[-•*]\s*/, '').trim();
        return cleanDef.length > 60 ? cleanDef.substring(0, 60) + '...' : cleanDef;
      });
      truncatedSections.push(`• Important Definitions: ${shortDefs.join('; ')}`);
    }
    else if (section.startsWith('Key Facts:')) {
      // Extract only the first 2 facts, truncate each
      const content = section.replace('Key Facts:', '').trim();
      const factLines = content.split('\n').filter(line => line.trim() && line.includes(':'));
      const shortFacts = factLines.slice(0, 2).map(fact => {
        const cleanFact = fact.replace(/^[-•*]\s*/, '').trim();
        return cleanFact.length > 50 ? cleanFact.substring(0, 50) + '...' : cleanFact;
      });
      truncatedSections.push(`• Key Facts: ${shortFacts.join('; ')}`);
    }
    else if (section.startsWith('Main Arguments:')) {
      // Extract only the first argument, truncate
      const content = section.replace('Main Arguments:', '').trim();
      const argLines = content.split('\n').filter(line => line.trim() && line.includes(':'));
      const shortArg = argLines.length > 0 ? argLines[0].replace(/^[-•*]\s*/, '').trim() : content;
      const finalArg = shortArg.length > 70 ? shortArg.substring(0, 70) + '...' : shortArg;
      truncatedSections.push(`• Main Arguments: ${finalArg}`);
    }
    else if (section.startsWith('Study Notes:')) {
      // Extract only the first 2 study notes, truncate each
      const content = section.replace('Study Notes:', '').trim();
      const noteLines = content.split('\n').filter(line => line.trim() && line.includes(':'));
      const shortNotes = noteLines.slice(0, 2).map(note => {
        const cleanNote = note.replace(/^[-•*]\s*/, '').trim();
        return cleanNote.length > 50 ? cleanNote.substring(0, 50) + '...' : cleanNote;
      });
      truncatedSections.push(`• Study Notes: ${shortNotes.join('; ')}`);
    }
  }
  
  return truncatedSections.join('\n');
}

// Test the function
console.log('🧪 Testing Truncation Function...\n');

const testSummary = `• Key Concepts: Wave-particle duality, Heisenberg Uncertainty Principle, Schrödinger equation, Quantum superposition
• Important Definitions:
  - Wave-particle duality: The concept that particles like electrons can exhibit both wave-like and particle-like properties.
  - Heisenberg Uncertainty Principle: The principle stating that we cannot simultaneously know both the position and momentum of a particle with absolute precision.
  - Schrödinger equation: The fundamental equation of quantum mechanics that describes how the quantum state of a physical system changes over time.
  - Quantum superposition: The concept that a quantum system can exist in multiple states simultaneously until it is measured.
• Key Facts:
  - The double-slit experiment demonstrating wave-particle duality was conducted by Thomas Young in 1801.
  - The Heisenberg Uncertainty Principle was formulated by Werner Heisenberg in 1927.
  - The Schrödinger equation was developed by Erwin Schrödinger in 1926.
• Main Arguments:
  - The principles of quantum mechanics are not due to limitations in our measuring instruments, but rather fundamental properties of nature.
  - These principles have profound implications for our understanding of reality and have led to revolutionary technologies like quantum computing, quantum cryptography, and quantum sensors.
• Study Notes:
  - Review the double-slit experiment and its implications for wave-particle duality.
  - Understand the Heisenberg Uncertainty Principle and its impact on our ability to measure quantum systems.
  - Familiarize yourself with the Schrödinger equation and its role in quantum mechanics.
  - Understand the concept of quantum superposition and its implications for the behavior of quantum systems.
  - Consider the practical applications and implications of quantum mechanics in technology and our understanding of reality.`;

console.log('📝 Original Summary Length:', testSummary.length);
console.log('\n📋 Original Summary:');
console.log(testSummary);
console.log('\n📋 Truncated Summary:');
console.log('=' .repeat(50));
const truncated = truncateSummary(testSummary);
console.log(truncated);
console.log('=' .repeat(50));
console.log('\n📏 Truncated Summary Length:', truncated.length);
console.log(`📊 Reduction: ${((testSummary.length - truncated.length) / testSummary.length * 100).toFixed(1)}%`);

console.log('\n✅ Truncation function test completed!'); 
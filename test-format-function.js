// Test the formatting function directly
function formatSummaryForStudy(summary, originalText) {
  // If the summary already follows our format, return it as is
  if (summary.includes('• Key Concepts:') && summary.includes('• Important Definitions:')) {
    return summary;
  }
  
  // Extract key information from the summary and original text
  const lines = summary.split('\n').filter(line => line.trim());
  const concepts = [];
  const definitions = [];
  const facts = [];
  const arguments = [];
  const studyNotes = [];
  
  // Process each line and categorize the information
  lines.forEach(line => {
    const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
    if (cleanLine) {
      // Look for definitions (contains "is", "means", "refers to", etc.)
      if (cleanLine.includes(' is ') || cleanLine.includes(' means ') || cleanLine.includes(' refers to ') || cleanLine.includes(' = ')) {
        definitions.push(cleanLine);
      }
      // Look for facts (contains dates, numbers, names)
      else if (/\d{4}|\d+%|\d+\.\d+/.test(cleanLine) || /[A-Z][a-z]+ [A-Z][a-z]+/.test(cleanLine)) {
        facts.push(cleanLine);
      }
      // Look for arguments (contains "because", "therefore", "leads to", etc.)
      else if (cleanLine.includes(' because ') || cleanLine.includes(' therefore ') || cleanLine.includes(' leads to ') || cleanLine.includes(' results in ')) {
        arguments.push(cleanLine);
      }
      // Look for study notes (contains "remember", "understand", "focus on", etc.)
      else if (cleanLine.includes(' remember ') || cleanLine.includes(' understand ') || cleanLine.includes(' focus on ') || cleanLine.includes(' important ')) {
        studyNotes.push(cleanLine);
      }
      // Everything else goes to concepts
      else {
        concepts.push(cleanLine);
      }
    }
  });
  
  // If we don't have enough categorized content, use the original summary lines
  if (concepts.length === 0 && lines.length > 0) {
    concepts.push(...lines.slice(0, Math.min(3, lines.length)).map(line => line.replace(/^[-•*]\s*/, '').trim()));
  }
  
  // Build the formatted summary
  let formattedSummary = '';
  
  if (concepts.length > 0) {
    formattedSummary += '• Key Concepts: ' + concepts.slice(0, 3).join('; ') + '\n';
  }
  
  if (definitions.length > 0) {
    formattedSummary += '• Important Definitions: ' + definitions.slice(0, 2).join('; ') + '\n';
  }
  
  if (facts.length > 0) {
    formattedSummary += '• Key Facts: ' + facts.slice(0, 2).join('; ') + '\n';
  }
  
  if (arguments.length > 0) {
    formattedSummary += '• Main Arguments: ' + arguments.slice(0, 2).join('; ') + '\n';
  }
  
  if (studyNotes.length > 0) {
    formattedSummary += '• Study Notes: ' + studyNotes.slice(0, 2).join('; ') + '\n';
  }
  
  // If we still don't have a proper format, create a simple structured version
  if (!formattedSummary.includes('• Key Concepts:')) {
    const mainPoints = lines.slice(0, Math.min(5, lines.length)).map(line => line.replace(/^[-•*]\s*/, '').trim());
    formattedSummary = '• Key Concepts: ' + mainPoints.slice(0, 2).join('; ') + '\n';
    if (mainPoints.length > 2) {
      formattedSummary += '• Important Definitions: ' + mainPoints.slice(2, 4).join('; ') + '\n';
    }
    if (mainPoints.length > 4) {
      formattedSummary += '• Study Notes: Focus on understanding the main concepts and their applications';
    }
  }
  
  return formattedSummary.trim();
}

// Test the function
console.log('🧪 Testing Format Function...\n');

const testSummary = `- Photosynthesis is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen.
- This process takes place in the chloroplasts of plant cells.`;

const originalText = "Today we learned about photosynthesis. Plants use sunlight to convert carbon dioxide and water into glucose and oxygen. This process happens in the chloroplasts.";

console.log('📝 Original Summary:');
console.log(testSummary);
console.log('\n📋 Formatted Summary:');
console.log('=' .repeat(50));
const formatted = formatSummaryForStudy(testSummary, originalText);
console.log(formatted);
console.log('=' .repeat(50));

console.log('\n✅ Format function test completed!'); 
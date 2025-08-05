import './style.css'

// Add minimalist Notion-like styles
const style = document.createElement('style');
style.textContent = `
  /* Minimalist Notion-like Design */
  .minimalist-result {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin: 20px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .result-header {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .result-header h3 {
    color: #2c2c2c;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .result-header p {
    color: #6b6b6b;
    margin: 0;
    font-size: 14px;
  }
  
  .result-section {
    margin-bottom: 24px;
  }
  
  .result-section h4 {
    color: #2c2c2c;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
  
  .transcript-content, .summary-content {
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 16px;
    color: #2c2c2c;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .result-footer {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e5e5e5;
  }
  
  .result-footer p {
    color: #6b6b6b;
    margin: 0;
    font-size: 14px;
  }
  
  /* Update existing elements for minimalist design */
  .section-title {
    color: #2c2c2c;
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0 12px 0;
  }
  
  .transcription-text, .summary-text {
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 16px;
    color: #2c2c2c;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
    margin: 12px 0;
  }
  
  .stats-content {
    background: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 16px;
    color: #2c2c2c;
    font-size: 14px;
    margin: 12px 0;
  }
  
  .tags-content {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
  }
  
  .summary-tag {
    background: #2c2c2c;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
`;
document.head.appendChild(style);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Add aggressive cache-busting parameter to force fresh requests
const CACHE_BUSTER = Date.now() + Math.random() + Math.random() + 'v8';

// Debug: Verify this is the updated version
console.log('🎯 Frontend loaded - Version 8 - Cache buster:', CACHE_BUSTER);

async function uploadAudio() {
  const fileInput = document.getElementById('audioFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const output = document.getElementById('output');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an audio file first.");
    return;
  }

  // Show file information with detailed analysis
  const fileSize = (file.size / 1024 / 1024).toFixed(2);
  const fileSizeKB = (file.size / 1024).toFixed(2);
  
  output.innerHTML = `
    <div class="file-info">
      📁 Selected: ${file.name} (${fileSize} MB / ${fileSizeKB} KB)<br>
      🎵 Type: ${file.type || 'Unknown'}<br>
      📏 Size: ${file.size} bytes
    </div>
  `;

  // Validate file before upload
  if (file.size < 1024) {
    output.innerHTML = `<span class="error">❌ File too small (${file.size} bytes). Please select a larger audio file.</span>`;
    return;
  }

  // Show loading state
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Processing...';
  output.innerHTML += '<span class="loading">Processing audio file...</span>';

  const formData = new FormData();
  formData.append('audio', file);

  try {
    // Transcribe
    output.innerHTML = '<span class="loading">Transcribing audio...</span>';
    const transcribeRes = await fetch(`${API_URL}/transcribe?t=${CACHE_BUSTER}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!transcribeRes.ok) {
      const errorData = await transcribeRes.json().catch(() => ({}));
      throw new Error(errorData.error || `Transcribe error: ${transcribeRes.statusText}`);
    }

    const transcribeData = await transcribeRes.json();
    console.log("Full transcribe response:", transcribeData);
    
    const { text } = transcribeData;
    console.log("Transcription text:", text);

    if (!text || text.trim().length === 0) {
      throw new Error('No transcription was generated. Please try with a different audio file.');
    }

    // Show transcription progress
    output.innerHTML = `
      <div class="section-title">📝 Transcription</div>
      <div class="transcription-text">${text}</div>
      <span class="loading">Generating summary...</span>
    `;

    // Summarize
    const summarizeRes = await fetch(`${API_URL}/summarize?t=${CACHE_BUSTER}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ text }),
    });

    if (!summarizeRes.ok) {
      const errorData = await summarizeRes.json().catch(() => ({}));
      throw new Error(errorData.error || `Summarize error: ${summarizeRes.statusText}`);
    }

    const summarizeData = await summarizeRes.json();
    console.log("Full summarize response:", summarizeData);
    
    const { summary } = summarizeData;
    console.log("Summary text:", summary);

    if (!summary || summary.trim().length === 0) {
      throw new Error('No summary was generated. Please try again.');
    }

    // Show clean, minimalist result with only one transcript and summary
    output.innerHTML = `
      <div class="minimalist-result">
        <div class="result-header">
          <h3>✅ Processing Complete</h3>
          <p>Your audio has been transcribed and summarized successfully.</p>
        </div>
        
        <div class="result-section">
          <h4>📝 Transcript</h4>
          <div class="transcript-content">${text}</div>
        </div>
        
        <div class="result-section">
          <h4>📋 Summary</h4>
          <div class="summary-content">${summary}</div>
        </div>
        
        <div class="result-footer">
          <p>Go to <strong>Archive</strong> to view your saved notes and start ThinkSpace discussions.</p>
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Error:", error);
    
    // Provide more detailed error information
    let errorMessage = error.message;
    if (error.message.includes('Failed to fetch')) {
      errorMessage = '❌ Connection error: Backend server might not be running. Please check if the server is running on http://localhost:3001';
    } else if (error.message.includes('Invalid file type')) {
      errorMessage = '❌ File type error: Please select a valid audio file (MP3, WAV, M4A, etc.)';
    } else if (error.message.includes('File too small')) {
      errorMessage = '❌ File size error: Please select a larger audio file (at least 1KB)';
    }
    
    output.innerHTML = `
      <span class="error">${errorMessage}</span>
      <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
        <strong>Debug Info:</strong><br>
        File: ${file.name}<br>
        Size: ${file.size} bytes<br>
        Type: ${file.type || 'Unknown'}<br>
        Error: ${error.message}
      </div>
    `;
  } finally {
    // Reset button state
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Process Audio';
  }
}

// Make function globally accessible
window.uploadAudio = uploadAudio;

// Also add a simple test function
window.testButton = function() {
  console.log('Test button clicked!');
  alert('Button is working!');
};

// Debug: Log when script loads
console.log('🎯 Main.js loaded - uploadAudio function available:', typeof window.uploadAudio);

// Ensure function is available immediately
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 DOM loaded - uploadAudio function available:', typeof window.uploadAudio);
  if (typeof window.uploadAudio !== 'function') {
    console.error('❌ uploadAudio function not available after DOM load!');
  }
});

// Also try to make it available on window load
window.addEventListener('load', function() {
  console.log('🎯 Window loaded - uploadAudio function available:', typeof window.uploadAudio);
  if (typeof window.uploadAudio !== 'function') {
    console.error('❌ uploadAudio function not available after window load!');
  }
});







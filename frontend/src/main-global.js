// ClassNote AI Frontend - Global Version
// This version ensures functions are available in global scope

const API_URL = 'http://localhost:3001';

// Add aggressive cache-busting parameter to force fresh requests
const CACHE_BUSTER = Date.now() + Math.random() + Math.random() + 'v10';

// Debug: Verify this is the updated version
console.log('🎯 Frontend loaded - Version 10 - Cache buster:', CACHE_BUSTER);

async function uploadAudio() {
  const fileInput = document.getElementById('audioFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const output = document.getElementById('output');

  const file = fileInput.files[0];
  if (!file) {
    output.innerHTML = '<span class="error">Please select an audio file first.</span>';
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
      throw new Error('No transcription was received. Please try again.');
    }

    // Show intermediate result
    output.innerHTML = `
      <div class="section-title">🔍 DEBUG: Raw API Response</div>
      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px;">
        ${JSON.stringify(transcribeData, null, 2)}
      </div>
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

    // Show final result with debug info
    output.innerHTML = `
      <div class="section-title">🔍 DEBUG: Transcribe API Response</div>
      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px;">
        ${JSON.stringify(transcribeData, null, 2)}
      </div>
      <div class="section-title">🔍 DEBUG: Summarize API Response</div>
      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; font-size: 12px;">
        ${JSON.stringify(summarizeData, null, 2)}
      </div>
      <div class="section-title">📝 Transcription</div>
      <div class="transcription-text">${text}</div>
      <div class="section-title">📋 Summary</div>
      <div class="summary-text">${summary}</div>
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

// Test function
function testButton() {
  console.log('Test button clicked!');
  alert('Button is working!');
}

// Make functions globally accessible immediately
window.uploadAudio = uploadAudio;
window.testButton = testButton;

// Debug: Log when script loads
console.log('🎯 Main-global.js loaded - uploadAudio function available:', typeof window.uploadAudio);

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
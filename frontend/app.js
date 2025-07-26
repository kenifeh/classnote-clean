async function uploadAudio() {
  const fileInput = document.getElementById('audioFile');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('audio', file);

  const transcribeRes = await fetch('https://your-backend-url/transcribe', {
    method: 'POST',
    body: formData
  });
  const { text } = await transcribeRes.json();

  const summarizeRes = await fetch('https://your-backend-url/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const { summary } = await summarizeRes.json();

  document.getElementById('output').textContent = summary;
}

const API_URL = import.meta.env.VITE_API_URL;

async function uploadAudio() {
  const fileInput = document.getElementById('audioFile');
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an audio file.");
    return;
  }

  const formData = new FormData();
  formData.append('audio', file);

  try {
    const transcribeRes = await fetch(`${API_URL}/transcribe`, {
      method: 'POST',
      body: formData
    });

    const { text } = await transcribeRes.json();

    const summarizeRes = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const { summary } = await summarizeRes.json();
    document.getElementById('output').textContent = summary;

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check the console for details.");
  }
}

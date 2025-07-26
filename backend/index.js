const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json());

// Set up multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => res.send('ClassNote AI Backend is Live'));

// ✅ Add this route for /transcribe
app.post('/transcribe', upload.single('audio'), (req, res) => {
  // Simulated transcription logic
  const dummyText = "This is a dummy transcription of the uploaded audio.";
  res.json({ text: dummyText });
});

// ✅ Add this route for /summarize
app.post('/summarize', (req, res) => {
  const { text } = req.body;
  const summary = text.length > 50 ? text.slice(0, 50) + '...' : text; // dummy summary
  res.json({ summary });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => res.send('ClassNote AI Backend is Live'));

app.post('/transcribe', upload.single('audio'), (req, res) => {
  // Dummy response for now
  const dummyText = "This is the transcription of your audio file.";
  res.json({ text: dummyText });
});

app.post('/summarize', (req, res) => {
  const { text } = req.body;
  const summary = text.slice(0, 30) + '...';
  res.json({ summary });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

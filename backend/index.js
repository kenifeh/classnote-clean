const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const upload = multer();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: req.file.buffer,
            model: "whisper-1",
        });
        res.json({ text: transcription.text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: `Summarize the following lecture:

${text}` }],
        });
        res.json({ summary: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

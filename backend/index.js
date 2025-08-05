const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const config = require('./config');
const Database = require('./database');
const Auth = require('./auth');

const app = express();
const PORT = config.PORT || 3001;

// Initialize database and auth
const db = new Database();
const auth = new Auth();

// Audio file cleanup scheduler
const AUDIO_RETENTION_HOURS = 24;
const CLEANUP_INTERVAL_MINUTES = 60; // Run cleanup every hour

// Schedule audio file cleanup
function scheduleAudioCleanup() {
  setInterval(async () => {
    try {
      console.log('🧹 Starting scheduled audio file cleanup...');
      
      const uploadsDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        return;
      }

      const files = fs.readdirSync(uploadsDir);
      const now = Date.now();
      const retentionTime = AUDIO_RETENTION_HOURS * 60 * 60 * 1000; // 24 hours in milliseconds

      let deletedCount = 0;
      let totalSizeFreed = 0;

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        // Delete files older than retention period
        if (fileAge > retentionTime) {
          try {
            const fileSize = stats.size;
            fs.unlinkSync(filePath);
            deletedCount++;
            totalSizeFreed += fileSize;
            console.log(`🗑️ Deleted old audio file: ${file} (${formatBytes(fileSize)})`);
          } catch (error) {
            console.error(`❌ Failed to delete file ${file}:`, error.message);
          }
        }
      }

      if (deletedCount > 0) {
        console.log(`✅ Cleanup complete: Deleted ${deletedCount} files, freed ${formatBytes(totalSizeFreed)}`);
      } else {
        console.log('✅ Cleanup complete: No files to delete');
      }
    } catch (error) {
      console.error('❌ Audio cleanup error:', error);
    }
  }, CLEANUP_INTERVAL_MINUTES * 60 * 1000); // Convert minutes to milliseconds
}

// Start the cleanup scheduler
scheduleAudioCleanup();

// Utility function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to format summary into study-friendly structure
function formatSummaryForStudy(summary, originalText) {
  // If the summary already follows our format, truncate it to be more concise
  if (summary.includes('• Key Concepts:') && summary.includes('• Important Definitions:')) {
    return truncateSummary(summary);
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

// Function to truncate summary to be more concise
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    console.log('🔍 File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size || 'unknown'
    });
    
    // Check MIME type
    const allowedTypes = /audio\/(mp3|wav|m4a|flac|ogg|webm|aac|mpeg)/;
    const hasValidMimeType = allowedTypes.test(file.mimetype);
    
    // Check file extension as fallback
    const allowedExtensions = /\.(mp3|wav|m4a|flac|ogg|webm|aac)$/i;
    const hasValidExtension = allowedExtensions.test(file.originalname);
    
    // Check file size (must be at least 1KB) - but be lenient if size is undefined
    const hasValidSize = file.size === undefined || file.size > 1024;
    
    if (hasValidMimeType || hasValidExtension) {
      if (hasValidSize) {
        console.log('✅ File accepted:', file.originalname, 'Size:', file.size || 'unknown');
        cb(null, true);
      } else {
        console.log('❌ File too small:', file.size, 'bytes');
        cb(new Error('File too small. Audio file must be at least 1KB.'), false);
      }
    } else {
      console.log('❌ Invalid file type:', file.mimetype, 'or extension');
      cb(new Error(`Invalid file type. Got: ${file.mimetype}. Only audio files are allowed.`), false);
    }
  }
});

// Initialize OpenAI
let openai;
let hasApiKey = false;

// Check for OpenAI API key
if (config.OPENAI_API_KEY && config.OPENAI_API_KEY !== 'your_openai_api_key_here' && config.OPENAI_API_KEY.startsWith('sk-')) {
  openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
  });
  hasApiKey = true;
  console.log('✅ OpenAI API key found. Real transcription and summarization enabled.');
} else {
  console.log('❌ No valid OpenAI API key found. Please set OPENAI_API_KEY in your .env file.');
  console.log('📝 Get your API key from: https://platform.openai.com/api-keys');
  console.log('📝 Current config value:', config.OPENAI_API_KEY ? 'Set (but invalid)' : 'Not set');
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'ClassNote AI Backend is running!',
    status: 'healthy',
    hasApiKey: hasApiKey
  });
});

// Authentication routes
app.post('/auth/register', (req, res) => auth.register(req, res));
app.post('/auth/login', (req, res) => auth.login(req, res));
app.get('/auth/profile', auth.authenticateToken.bind(auth), (req, res) => auth.getProfile(req, res));
app.post('/auth/change-password', auth.authenticateToken.bind(auth), (req, res) => auth.changePassword(req, res));

// Note management routes
app.get('/notes', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const notes = await db.getNotesByUserId(req.user.id, parseInt(limit), parseInt(offset));
    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
});

app.get('/notes/:id', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const note = await db.getNoteById(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to get note' });
  }
});

app.delete('/notes/:id', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const result = await db.deleteNote(req.params.id, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.put('/notes/:id', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (categoryId) updates.category_id = categoryId;
    
    const result = await db.updateNote(req.params.id, req.user.id, updates);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Search notes
app.get('/notes/search/:term', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const notes = await db.searchNotes(req.user.id, req.params.term);
    res.json({ notes });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// Get audio file for a note
app.get('/notes/:id/audio', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const note = await db.getNoteById(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Construct the file path
    const filePath = path.join(__dirname, 'uploads', note.original_filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Set appropriate headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Stream the audio file
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Get audio error:', error);
    res.status(500).json({ error: 'Failed to get audio file' });
  }
});

// Category management routes
app.get('/categories', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const categories = await db.getCategoriesByUserId(req.user.id);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

app.post('/categories', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const category = await db.createCategory(req.user.id, name, color);
    res.status(201).json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// User statistics
app.get('/stats', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const stats = await db.getUserStats(req.user.id);
    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Storage management routes
app.get('/storage', auth.authenticateToken.bind(auth), async (req, res) => {
  try {
    const storageInfo = await db.getUserStorageInfo(req.user.id);
    res.json({ storage: storageInfo });
  } catch (error) {
    console.error('Get storage info error:', error);
    res.status(500).json({ error: 'Failed to get storage information' });
  }
});

app.post('/transcribe', auth.optionalAuth.bind(auth), upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    console.log('📁 File uploaded:', req.file.originalname);

    // Check storage limit for authenticated users
    if (req.user) {
      try {
        const storageCheck = await db.checkStorageLimit(req.user.id, req.file.size);
        if (!storageCheck.canUpload) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          return res.status(413).json({ 
            error: 'Storage limit exceeded',
            details: `You have used ${formatBytes(storageCheck.currentUsage)} of ${formatBytes(storageCheck.limit)}. Upgrade to upload more files.`,
            storage: {
              currentUsage: storageCheck.currentUsage,
              limit: storageCheck.limit,
              remaining: storageCheck.remaining
            }
          });
        }
      } catch (storageError) {
        console.error('Storage check error:', storageError);
        // Continue with upload if storage check fails
      }
    }

    if (!hasApiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY in your .env file'
      });
    }

    // Real transcription using OpenAI Whisper
    const audioFile = fs.createReadStream(req.file.path);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text"
    });

    // Keep the uploaded file for audio playback
    // fs.unlinkSync(req.file.path); // Commented out to preserve audio files

    console.log('✅ Transcription completed');
    
    // If user is authenticated, save the note
    if (req.user) {
      try {
        const noteData = {
          title: req.file.originalname.replace(/\.[^/.]+$/, ""), // Remove file extension
          originalFilename: req.file.filename, // Use the actual saved filename, not original
          transcriptionText: transcription,
          fileSize: req.file.size,
          categoryId: req.body.categoryId || null
        };
        
        const note = await db.createNote(req.user.id, noteData);
        res.json({ 
          text: transcription, 
          noteId: note.id,
          message: 'Note saved successfully'
        });
      } catch (dbError) {
        console.error('Failed to save note:', dbError);
        res.json({ text: transcription, message: 'Transcription completed but failed to save note' });
      }
    } else {
      res.json({ text: transcription });
    }

  } catch (error) {
    console.error('❌ Transcription error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    });
  }
});

app.post('/summarize', auth.optionalAuth.bind(auth), async (req, res) => {
  console.log('📝 Summary request received:', { body: req.body });
  const { text, noteId } = req.body;

  if (!text || typeof text !== 'string') {
    console.log('❌ Invalid text for summarization:', { text, type: typeof text });
    return res.status(400).json({ error: 'Text is required for summarization.' });
  }

  try {
    if (!hasApiKey) {
      // Enhanced demo mode with better formatting
      const words = text.split(' ').length;
      const targetWords = Math.floor(words * 0.35);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const demoSummary = sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';
      
      return res.json({ 
        summary: demoSummary,
        wordCount: demoSummary.split(' ').length,
        originalWordCount: words,
        tags: ['demo', 'sample']
      });
    }

    // Calculate target word count (35% of original)
    const originalWordCount = text.split(' ').length;
    const targetWordCount = Math.floor(originalWordCount * 0.35);

    // Enhanced summarization using OpenAI GPT with new rules
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert academic summarizer. Create clear, intelligent summaries following these strict rules:

SUMMARY RULES:
1. WORD COUNT: Target exactly ${targetWordCount} words (35% of original ${originalWordCount} words)
2. SIMPLIFICATION: Rewrite complex language into simple, clear academic English
3. SENTENCES: Use shorter sentences and active voice, remove jargon
4. CONTENT: Preserve all core ideas, key terms, and logical flow
5. STRUCTURE: Write in paragraph form with clean formatting, no bullet points
6. TONE: Academic but accessible, like student revision notes
7. STYLE: Rephrase everything - avoid copying transcript verbatim
8. COHERENCE: If a sentence crosses the word limit, include the entire sentence

FORMAT: Return only the summary text, no additional formatting or explanations.`
        },
        {
          role: "user",
          content: `Create a summary of this lecture transcript following the rules above:

${text}`
        }
      ],
      max_tokens: Math.floor(targetWordCount * 1.5), // Allow some flexibility
      temperature: 0.3
    });

    let summary = completion.choices[0].message.content.trim();
    
    // Clean up the summary
    summary = summary.replace(/^Summary:|^Here's the summary:/i, '').trim();
    
    // Generate tags for future features
    const tagCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract 3-5 key academic themes or topics from the text. Return only a JSON array of strings, no other text."
        },
        {
          role: "user",
          content: `Extract themes from: ${summary}`
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    });

    let tags = [];
    try {
      const tagResponse = tagCompletion.choices[0].message.content.trim();
      tags = JSON.parse(tagResponse);
    } catch (e) {
      // Fallback tags if parsing fails
      tags = ['academic', 'lecture'];
    }

    console.log('✅ Enhanced summary generated');
    
    // If user is authenticated and noteId is provided, update the note
    if (req.user && noteId) {
      try {
        await db.updateNote(noteId, req.user.id, { 
          summary_text: summary,
          summary_tags: JSON.stringify(tags),
          summary_word_count: summary.split(' ').length,
          original_word_count: originalWordCount
        });
        res.json({ 
          summary, 
          wordCount: summary.split(' ').length,
          originalWordCount,
          tags,
          message: 'Summary saved to note' 
        });
      } catch (dbError) {
        console.error('Failed to save summary:', dbError);
        res.json({ 
          summary, 
          wordCount: summary.split(' ').length,
          originalWordCount,
          tags,
          message: 'Summary generated but failed to save to note' 
        });
      }
    } else {
      res.json({ 
        summary,
        wordCount: summary.split(' ').length,
        originalWordCount,
        tags
      });
    }

  } catch (error) {
    console.error('❌ Summarization error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

// ThinkSpace Socratic Chat API
app.post('/thinkspace/chat', auth.requireAuth.bind(auth), async (req, res) => {
  console.log('🧠 ThinkSpace chat request received:', { body: req.body });
  const { message, context, conversationHistory, sessionId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required for chat.' });
  }

  if (!context || typeof context !== 'string') {
    return res.status(400).json({ error: 'Context is required for chat.' });
  }

  try {
    if (!hasApiKey) {
      // Enhanced fallback responses that follow Socratic principles
      const socraticResponses = [
        "What do you think about that?",
        "Can you explain your reasoning?",
        "What evidence supports your understanding?",
        "How does this connect to what you already know?",
        "What questions does this raise for you?",
        "What assumptions are you making here?",
        "How might someone disagree with your view?",
        "What would happen if we looked at this differently?",
        "Can you think of an example that illustrates this?",
        "What's the most important thing you're learning here?"
      ];
      
      const randomResponse = socraticResponses[Math.floor(Math.random() * socraticResponses.length)];
      return res.json({ 
        response: randomResponse,
        understandingLevel: 'exploring',
        suggestedDepth: 'deeper'
      });
    }

    // Build conversation history for context
    const messages = [
      {
        role: "system",
        content: `You are a Socratic tutor in the ThinkSpace environment. Your role is to guide students through critical thinking and self-discovery, NOT to provide direct answers.

SOCRATIC RULES:
1. NEVER give direct answers or explanations unless explicitly asked
2. ALWAYS ask questions that guide the student to think deeper
3. Begin conversations with "What do you think?" or similar open-ended prompts
4. Ask layered, context-aware follow-up questions
5. Reference the original lecture material when relevant
6. Only provide definitions/clarifications after multiple probing questions
7. Never complete thoughts for the student
8. Focus on developing critical thinking habits, not correctness
9. Score understanding internally and adjust question depth accordingly
10. If responses are superficial, ask deeper questions
11. Encourage reflection and self-discovery

CONTEXT: ${context}

Your responses should be 1-2 sentences maximum, always in question form.`
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        if (msg.sender === 'user') {
          messages.push({ role: 'user', content: msg.text });
        } else if (msg.sender === 'ai') {
          messages.push({ role: 'assistant', content: msg.text });
        }
      });
    }

    // Add the current message
    messages.push({ role: 'user', content: message });

    // Generate Socratic response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 100,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content.trim();
    
    // Analyze understanding level and suggest next steps
    const analysisCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the student's response and return a JSON object with: understandingLevel (superficial/exploring/deep), suggestedDepth (basic/deeper/expert), and nextQuestionType (clarification/application/analysis/synthesis)."
        },
        {
          role: "user",
          content: `Student response: "${message}"\nContext: "${context}"\nAI response: "${response}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.1
    });

    let analysis = { understandingLevel: 'exploring', suggestedDepth: 'deeper', nextQuestionType: 'clarification' };
    try {
      const analysisResponse = analysisCompletion.choices[0].message.content.trim();
      analysis = JSON.parse(analysisResponse);
    } catch (e) {
      console.log('Analysis parsing failed, using default values');
    }

    console.log('✅ ThinkSpace Socratic response generated');
    
    res.json({ 
      response,
      understandingLevel: analysis.understandingLevel,
      suggestedDepth: analysis.suggestedDepth,
      nextQuestionType: analysis.nextQuestionType
    });

  } catch (error) {
    console.error('❌ ThinkSpace chat error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Voice Input - Speech to Text for ThinkSpace
app.post('/thinkspace/voice-input', auth.requireAuth.bind(auth), upload.single('audio'), async (req, res) => {
  console.log('🎤 ThinkSpace voice input received');
  
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  try {
    if (!hasApiKey) {
      // Demo mode - return a sample transcription
      const demoTranscriptions = [
        "I think this concept is about understanding the basic principles",
        "Can you help me understand this better?",
        "I'm not sure how this connects to what we learned before",
        "This seems to relate to the previous topic we discussed"
      ];
      
      const randomTranscription = demoTranscriptions[Math.floor(Math.random() * demoTranscriptions.length)];
      return res.json({ 
        transcription: randomTranscription,
        confidence: 0.95
      });
    }

    // Use OpenAI Whisper for speech-to-text
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
      response_format: "verbose_json"
    });

    console.log('✅ Voice input transcribed successfully');
    
    res.json({
      transcription: transcription.text,
      confidence: transcription.verbose_json?.segments?.[0]?.avg_logprob || 0.8
    });

  } catch (error) {
    console.error('❌ Voice input error:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe voice input',
      details: error.message 
    });
  } finally {
    // Clean up the uploaded audio file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// Voice Output - Text to Speech for ThinkSpace responses
app.post('/thinkspace/voice-output', auth.requireAuth.bind(auth), async (req, res) => {
  console.log('🔊 ThinkSpace voice output requested');
  const { text, voice = 'alloy', speed = 1.0 } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for voice output' });
  }

  try {
    if (!hasApiKey) {
      // Demo mode - return a placeholder audio URL
      return res.json({ 
        audioUrl: '/demo-audio-response.mp3',
        duration: Math.ceil(text.length / 10), // Rough estimate
        message: 'Demo mode: Voice output not available without API key'
      });
    }

    // Use OpenAI TTS for text-to-speech
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: speed
    });

    // Save the audio file temporarily
    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const fileName = `thinkspace-voice-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, 'uploads', fileName);
    
    fs.writeFileSync(filePath, audioBuffer);

    console.log('✅ Voice output generated successfully');
    
    res.json({
      audioUrl: `/uploads/${fileName}`,
      duration: Math.ceil(text.length / 10), // Rough estimate
      fileName: fileName
    });

  } catch (error) {
    console.error('❌ Voice output error:', error);
    res.status(500).json({ 
      error: 'Failed to generate voice output',
      details: error.message 
    });
  }
});

// Serve uploaded files (including voice output)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Audio Cleanup Management API
app.get('/audio/cleanup-status', auth.requireAuth.bind(auth), async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    let status = {
      retentionHours: AUDIO_RETENTION_HOURS,
      cleanupIntervalMinutes: CLEANUP_INTERVAL_MINUTES,
      totalFiles: 0,
      filesToDelete: 0,
      totalSize: 0,
      sizeToFree: 0,
      lastCleanup: null
    };

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const now = Date.now();
      const retentionTime = AUDIO_RETENTION_HOURS * 60 * 60 * 1000;

      status.totalFiles = files.length;

      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        status.totalSize += stats.size;

        if (fileAge > retentionTime) {
          status.filesToDelete++;
          status.sizeToFree += stats.size;
        }
      }
    }

    res.json(status);
  } catch (error) {
    console.error('❌ Cleanup status error:', error);
    res.status(500).json({ error: 'Failed to get cleanup status' });
  }
});

app.post('/audio/cleanup-now', auth.requireAuth.bind(auth), async (req, res) => {
  try {
    console.log('🧹 Manual audio cleanup triggered by user');
    
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ 
        message: 'No uploads directory found',
        deletedCount: 0,
        freedSize: 0
      });
    }

    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const retentionTime = AUDIO_RETENTION_HOURS * 60 * 60 * 1000;

    let deletedCount = 0;
    let freedSize = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtime.getTime();

      if (fileAge > retentionTime) {
        try {
          const fileSize = stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          freedSize += fileSize;
          console.log(`🗑️ Manual cleanup: Deleted ${file} (${formatBytes(fileSize)})`);
        } catch (error) {
          console.error(`❌ Failed to delete file ${file}:`, error.message);
        }
      }
    }

    res.json({
      message: `Cleanup complete: Deleted ${deletedCount} files`,
      deletedCount,
      freedSize,
      freedSizeFormatted: formatBytes(freedSize)
    });
  } catch (error) {
    console.error('❌ Manual cleanup error:', error);
    res.status(500).json({ error: 'Failed to perform cleanup' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ClassNote AI Backend running on http://localhost:${PORT}`);
  console.log(`🌐 Network accessible at http://192.168.1.154:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /transcribe - Upload and transcribe audio files`);
  console.log(`   POST /summarize - Generate summaries from text`);
  console.log(`   GET  /          - Health check`);
});

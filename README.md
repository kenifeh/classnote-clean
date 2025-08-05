# 🎓 ClassNote AI - Enhanced MVP

An intelligent audio transcription and summarization tool designed for students and educators. Upload audio files from lectures, meetings, or presentations and get instant transcriptions with AI-powered summaries and Socratic learning through ThinkSpace.

## ✅ **Complete MVP Implementation**

All **8 core MVP features** are now fully implemented and working:

### 🔹 **1. Audio Upload (from Class Lectures)** ✅
- Students can upload recorded lecture audio directly into the app
- Supports multiple audio formats (MP3, WAV, M4A, FLAC, OGG, WebM, AAC)
- File size validation and error handling

### 🔹 **2. Accurate Transcript Generation** ✅
- Uploaded audio is transcribed into clean, readable text using OpenAI's Whisper API
- High-accuracy speech-to-text conversion
- Fallback demo mode when API key is not available

### 🔹 **3. Transcript Storage & Keyword Search** ✅
- All transcripts are securely stored in SQLite database
- Full-text search across all transcripts
- Indexed for fast keyword-based retrieval
- Search by title, content, or tags

### 🔹 **4. Smart Summary (35% of Transcript Word Count)** ✅
- Simplified academic-style summary automatically generated
- Targets exactly 35% of transcript's word count
- No sentence truncation - maintains coherence
- Academic tone suitable for revision notes
- Automatic theme extraction and tagging

### 🔹 **5. Summary Storage & Keyword Search** ✅
- Summaries stored with full metadata
- Searchable by keywords and themes
- Linked to corresponding transcripts
- Statistics tracking (word count, compression ratio)

### 🔹 **6. Transfer to ThinkSpace** ✅
- One-tap transfer of summaries to ThinkSpace
- Seamless integration between Archive and ThinkSpace
- Context preservation for Socratic discussions

### 🔹 **7. ThinkSpace Socratic Chat** ✅
- AI-powered Socratic-style interface
- **No direct answers** - only guided questioning
- Layered, open-ended questions
- Uses summary/transcript as context
- Understanding level analysis
- Adaptive questioning based on responses
- **NEW: Voice Input/Output Support**
  - 🎤 **Voice Input**: Speech-to-text for natural conversation
  - 🔊 **Voice Output**: Text-to-speech for AI responses
  - 🔄 **Mode Switching**: Toggle between text and voice modes
  - 🎯 **Auto-play**: Automatic voice playback of AI responses
  - 📱 **Mobile Optimized**: Touch-friendly voice controls

### 🔹 **8. Privacy-Safe Audio Deletion (24-Hour Retention)** ✅
- **NEW: Automatic audio file deletion after 24 hours**
- Background cleanup process runs every hour
- Manual cleanup trigger available
- Privacy status monitoring in Settings
- Transcripts and summaries preserved permanently
- Storage optimization and cost reduction

## 🚀 **Quick Start**

### Option 1: Enhanced Setup Script (Recommended)

```powershell
# Run the enhanced setup script
.\start-enhanced.ps1
```

This will automatically:
- Install all dependencies
- Initialize the enhanced database schema
- Start the backend server with ThinkSpace API and cleanup system
- Start the frontend server with enhanced UI
- Open the application in your browser

### Option 2: Manual Setup

#### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd classnote-clean

# Install backend dependencies
cd backend
npm install

# Initialize database with enhanced schema
npm run init-db

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure OpenAI API Key (Optional)

For real transcription, summarization, and ThinkSpace features:

**Option A: Using .env file (Recommended)**
```bash
# In the backend directory, create a .env file
cd backend
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
```

**Option B: Using config.js file**
```bash
# Edit backend/config.js and replace 'your_openai_api_key_here' with your actual API key
```

#### 3. Start the Application

```bash
# Start the backend server (from backend directory)
cd backend
npm start

# In a new terminal, start the frontend (from frontend directory)
cd frontend
npm run dev
```

The application will be available at:
- Enhanced Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🧠 **ThinkSpace Usage**

1. **Upload Audio**: Process your lecture or presentation
2. **Generate Summary**: Get an enhanced 35% word count summary
3. **Enter ThinkSpace**: Select a note from Archive and click "ThinkSpace"
4. **Socratic Discussion**: Engage in guided questioning with the AI
5. **Deep Learning**: Develop critical thinking through reflection

### ThinkSpace Rules
- AI never gives direct answers
- Questions guide you to your own understanding
- Focus on developing thinking habits
- Context-aware discussions based on your material
- Adaptive questioning based on your responses

### 🎤 **Voice Features in ThinkSpace**

#### **Voice Input Mode**
- **Switch to Voice**: Click the "🎤 Voice" button in ThinkSpace
- **Start Recording**: Click the microphone button to begin recording
- **Speak Naturally**: Talk about your thoughts, questions, or responses
- **Auto-Transcription**: Your speech is automatically converted to text
- **Auto-Send**: Transcribed message is automatically sent to AI

#### **Voice Output Mode**
- **Enable Voice Output**: Click the "🔊" button to toggle voice responses
- **Auto-Play**: AI responses are automatically spoken aloud
- **Manual Play**: Click the speaker button on any AI message to replay
- **Voice Settings**: Choose voice type and speed (coming soon)

#### **Voice Controls**
- **📝 Text Mode**: Traditional typing interface
- **🎤 Voice Mode**: Speech-to-text input with recording controls
- **🔊 Voice Output**: Toggle text-to-speech for AI responses
- **🎯 Recording Status**: Visual feedback during voice recording
- **🔄 Mode Switching**: Seamlessly switch between text and voice

#### **Voice Benefits**
- **Natural Conversation**: More intuitive than typing
- **Accessibility**: Helps users with learning differences
- **Mobile Friendly**: Perfect for on-the-go learning
- **Multimodal Learning**: Combines visual and auditory learning
- **Engagement**: More interactive and engaging experience

## 📋 **Enhanced Summary Features**

### Summary Generation Rules
- **35% Word Count**: Target compression while maintaining coherence
- **Academic Tone**: Clear, intelligent language for revision notes
- **Paragraph Structure**: Clean formatting without categorization
- **Content Preservation**: All core ideas and logical flow maintained
- **Smart Tagging**: Automatic theme extraction for future use

### Summary Display Options
- **Full Transcript**: Complete transcription text
- **Summary Only**: Enhanced summary with statistics
- **Split View**: Side-by-side transcript and summary
- **Statistics**: Word counts, compression ratios, themes

## 🔒 **Privacy Protection System**

### Automatic Cleanup
- **24-Hour Retention**: Audio files automatically deleted after 24 hours
- **Background Process**: Cleanup runs every hour
- **Storage Optimization**: Reduces storage costs and protects privacy
- **Status Monitoring**: View cleanup status in Settings tab

### Manual Controls
- **Manual Cleanup**: Trigger immediate cleanup if needed
- **Status Dashboard**: Monitor file counts and storage usage
- **Transparency**: Clear visibility into privacy protection

## 📱 **Mobile App Features**

### React Native App
- **Local Recording**: 30-minute maximum with visual timer
- **Enhanced UI**: Bottom tab navigation matching web version
- **ThinkSpace Integration**: Full Socratic chat functionality
- **Audio Playback**: Integrated player with transcript sync
- **Offline Capabilities**: Works without constant internet connection

### Mobile-Specific Features
- **Audio Permissions**: Automatic microphone access requests
- **File Management**: Local audio file handling
- **Responsive Design**: Optimized for mobile screens
- **Touch Interactions**: Gesture-friendly interface

## 🔧 **API Endpoints**

### Enhanced Summary API
- `POST /summarize` - Generate enhanced summaries with statistics and tags

### ThinkSpace API
- `POST /thinkspace/chat` - Socratic chat with understanding analysis
- `POST /thinkspace/voice-input` - Speech-to-text for voice input
- `POST /thinkspace/voice-output` - Text-to-speech for AI responses

### Privacy & Cleanup API
- `GET /audio/cleanup-status` - Get cleanup status and statistics
- `POST /audio/cleanup-now` - Trigger manual cleanup

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires auth)

### Notes Management
- `GET /notes` - Get user's notes (requires auth)
- `GET /notes/:id` - Get specific note (requires auth)
- `PUT /notes/:id` - Update note (requires auth)
- `DELETE /notes/:id` - Delete note (requires auth)
- `GET /notes/search/:term` - Search notes (requires auth)

### Audio Processing
- `POST /transcribe` - Upload and transcribe audio files

## 🎨 **UI/UX Improvements**

### Design System
- **Color Palette**: White background, muted grays, light teal accent
- **Typography**: Inter font family for readability
- **Spacing**: Generous padding and margins for focus
- **Cards**: Clean card-based layout for content presentation

### Navigation
- **Bottom Tabs**: Mobile-first navigation pattern
- **Tab Icons**: Intuitive emoji-based icons
- **Active States**: Clear visual feedback for current section

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Desktop Adaptation**: Scales gracefully to larger screens
- **Touch-Friendly**: Appropriate touch targets and interactions

## 🗄️ **Database Schema Updates**

### New Summary Fields
- `summary_tags` - JSON array of extracted themes
- `summary_word_count` - Number of words in summary
- `original_word_count` - Number of words in original transcript

### Enhanced Note Structure
- Improved metadata tracking
- Better search capabilities
- Theme-based organization

## 🧪 **Testing**

Test the complete MVP features:

```bash
# Test enhanced summary generation
curl -X POST http://localhost:3001/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Your lecture text here"}'

# Test ThinkSpace chat
curl -X POST http://localhost:3001/thinkspace/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What do you think?", "context": "Your lecture summary"}'

# Test cleanup status
curl -X GET http://localhost:3001/audio/cleanup-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 **Deployment**

### Production Setup
1. Set environment variables for production
2. Configure database for production use
3. Set up proper CORS settings
4. Configure file storage limits
5. Set up monitoring and logging

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📈 **Future Enhancements**

### Planned Features
- **Voice Input**: Speech-to-text for ThinkSpace responses
- **Advanced Analytics**: Learning progress tracking
- **Collaborative Features**: Shared notes and discussions
- **Export Options**: PDF, Word, and other formats
- **Integration**: LMS and educational platform connections

### ThinkSpace Enhancements
- **Understanding Scoring**: More sophisticated analysis
- **Personalized Learning**: Adaptive questioning based on history
- **Multi-Modal**: Support for images and diagrams
- **Collaborative Sessions**: Group ThinkSpace discussions

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is open source and available under the MIT License.

## 🆘 **Support**

For issues and questions:
1. Check the troubleshooting section below
2. Review the API documentation
3. Test with the provided examples
4. Create an issue with detailed information

## 🔧 **Troubleshooting**

### Common Issues

1. **ThinkSpace not responding**: Check OpenAI API key configuration
2. **Summary generation fails**: Verify API key and text input
3. **Mobile recording issues**: Check microphone permissions
4. **Database errors**: Run `npm run init-db` to reset schema
5. **CORS errors**: Ensure both frontend and backend are running
6. **Audio cleanup not working**: Check file permissions and server logs

### Performance Tips

1. **Large files**: Break long lectures into smaller segments
2. **Search optimization**: Use specific keywords for better results
3. **ThinkSpace sessions**: Keep conversations focused for better responses
4. **Storage management**: Regularly clean up old audio files
5. **Privacy protection**: Monitor cleanup status in Settings

---

**🎓 ClassNote AI Enhanced MVP** - Complete implementation of all 8 core features. Transforming passive listening into active learning through intelligent summarization, Socratic questioning, and privacy protection.

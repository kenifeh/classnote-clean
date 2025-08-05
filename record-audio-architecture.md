# 🎤 Record Audio Page - Software Architecture Diagram

## System Overview
The Record Audio page (`http://localhost:5173/record-audio.html`) is a standalone HTML application that provides in-browser audio recording capabilities for the ClassNote AI system.

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BROWSER ENVIRONMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    RECORD AUDIO PAGE                                │    │
│  │                (record-audio.html)                                  │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │   HTML Structure│  │   CSS Styling   │  │  JavaScript     │     │    │
│  │  │                 │  │                 │  │  Logic          │     │    │
│  │  │ • Container     │  │ • Responsive    │  │                 │     │    │
│  │  │ • Instructions  │  │   Design        │  │ • MediaRecorder │     │    │
│  │  │ • Buttons       │  │ • Animations    │  │ • File Handling │     │    │
│  │  │ • Status Display│  │ • Visual States │  │ • API Calls     │     │    │
│  │  │ • Test Section  │  │ • Color Themes  │  │ • Error Handling│     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           BROWSER APIs                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ MediaRecorder   │  │ getUserMedia    │  │ File API        │              │
│  │ API             │  │ API             │  │                 │              │
│  │                 │  │                 │  │ • Blob          │              │
│  │ • Audio Capture │  │ • Microphone    │  │ • File Download │              │
│  │ • Format Support│  │   Access        │  │ • File Upload   │              │
│  │ • Event Handling│  │ • Permissions   │  │ • Size Handling │              │
│  │ • MIME Types    │  │ • Stream        │  │                 │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           NETWORK LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    HTTP/HTTPS Communication                          │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐                    ┌─────────────────┐         │    │
│  │  │   Frontend      │  ──POST /transcribe──►  Backend API  │         │    │
│  │  │   (Port 5173)   │                    │  (Port 3001)    │         │    │
│  │  │                 │  ◄──JSON Response───  │               │         │    │
│  │  │ • FormData      │                    │ • OpenAI        │         │    │
│  │  │ • File Upload   │                    │   Integration   │         │    │
│  │  │ • Error Handling│                    │ • Whisper API   │         │    │
│  │  └─────────────────┘                    └─────────────────┘         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           BACKEND SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ClassNote AI Backend                              │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │   Express.js    │  │   OpenAI API    │  │   File System   │     │    │
│  │  │   Server        │  │   Integration   │  │   Operations    │     │    │
│  │  │                 │  │                 │  │                 │     │    │
│  │  │ • Route Handler │  │ • Whisper API   │  │ • Upload Dir    │     │    │
│  │  │ • CORS Support  │  │ • Transcription │  │ • Temp Storage  │     │    │
│  │  │ • File Upload   │  │ • Error Handling│  │ • Cleanup       │     │    │
│  │  │ • Validation    │  │ • Rate Limiting │  │ • Security      │     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                           EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    OpenAI Cloud Services                             │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │    │
│  │  │   Whisper API   │  │   GPT-3.5-turbo │  │   API Gateway   │     │    │
│  │  │                 │  │                 │  │                 │     │    │
│  │  │ • Audio to Text │  │ • Text          │  │ • Authentication│     │    │
│  │  │ • Multi-language│  │   Summarization │  │ • Rate Limiting │     │    │
│  │  │ • Format Support│  │ • Context       │  │ • Error Handling│     │    │
│  │  │ • Quality       │  │   Understanding │  │ • Logging       │     │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

## 🔧 Component Details

### 1. Frontend Components
- **HTML Structure**: Semantic markup with containers, buttons, and status displays
- **CSS Styling**: Responsive design with animations and visual feedback
- **JavaScript Logic**: Core functionality for audio recording and API communication

### 2. Browser APIs
- **MediaRecorder API**: Handles audio recording with format detection
- **getUserMedia API**: Manages microphone access and permissions
- **File API**: Handles blob creation, file downloads, and uploads

### 3. Network Communication
- **HTTP POST**: Sends audio files to backend transcription service
- **FormData**: Packages audio files for multipart/form-data transmission
- **JSON Response**: Receives transcription results from backend

### 4. Backend Services
- **Express.js Server**: Handles HTTP requests and file uploads
- **OpenAI Integration**: Manages API calls to Whisper and GPT services
- **File System**: Temporary storage and cleanup of uploaded files

### 5. External Services
- **OpenAI Whisper**: Converts audio to text with high accuracy
- **OpenAI GPT-3.5-turbo**: Generates summaries from transcribed text
- **OpenAI API Gateway**: Manages authentication and rate limiting

## 🔄 Data Flow

1. **User Interaction** → Button clicks trigger JavaScript functions
2. **Audio Recording** → MediaRecorder captures microphone input
3. **File Creation** → Audio blob is created with appropriate MIME type
4. **File Download** → User can download recorded audio file
5. **File Upload** → Audio file is sent to backend via HTTP POST
6. **Transcription** → Backend calls OpenAI Whisper API
7. **Response** → Transcription results are returned to frontend
8. **Display** → Results are shown to user with status updates

## 🛡️ Security & Error Handling

- **CORS Configuration**: Cross-origin resource sharing setup
- **File Validation**: MIME type and size validation
- **Error Boundaries**: Graceful handling of API failures
- **User Feedback**: Clear status messages and error reporting
- **Resource Cleanup**: Proper disposal of media streams and files

## 📊 Performance Considerations

- **Audio Quality**: Configurable sample rate and channel count
- **File Size**: Automatic size calculation and user feedback
- **Format Optimization**: MP3/WAV format detection and fallback
- **Network Efficiency**: Efficient file upload with progress tracking
- **Memory Management**: Proper cleanup of audio blobs and URLs 
# AI Study Buddy & Balanced Life Assistant

An AI-powered academic companion designed to support students in learning, productivity, career guidance, mental wellness, and balanced living. Built using **Python**, **Flask**, and the **Groq API**, the application delivers fast, intelligent, and multilingual conversations through a modern, responsive interface.

The assistant is engineered to feel more like a supportive study partner than a traditional chatbot — providing accurate guidance while encouraging healthy study habits and work-life balance.

---

# Overview

AI Study Buddy combines conversational AI with productivity-focused features to create an interactive educational experience. The system supports multilingual communication, voice interaction, document understanding, and persistent chat management, all wrapped inside a premium glassmorphism-based user interface.

---

# Core Features

## Intelligent Conversational AI

- Context-aware conversations with session-based memory
- Maintains up to **15 previous messages** for natural interactions
- Friendly and balanced conversational tone
- Powered by **Groq's ultra-fast inference engine**
- Uses the **Llama-3.1-8b-instant** model for rapid responses

---

## Multilingual Support

### Supported Languages
- English
- Hindi (हिंदी)

### Capabilities
- Dynamic language switching
- Fully translated UI components
- Language-specific AI system prompts
- Hindi responses generated in **Devanagari script**
- Speech recognition adapts automatically to selected language
- Easily extensible architecture for adding new languages

---

## Premium Modern User Interface

### UI Highlights
- Modern dark theme with gradient accents
- Glassmorphism-inspired components
- Animated welcome screen
- Responsive mobile-friendly layout
- Smooth transitions and micro-interactions
- Themed custom scrollbars
- Interactive suggestion chips
- Enhanced message bubble styling
- Animated typing indicator

### Design Palette
- Primary Gradient: `#7c5cfc → #00d4aa`
- Dark Background Theme
- Frosted-glass blur effects

---

## Voice Input Support

Integrated browser-based speech recognition using the **Web Speech API**.

### Features
- One-click voice input
- Real-time speech transcription
- Automatic language adaptation
- Recording animations and visual feedback

---

## Document Upload & Context Processing

Supports intelligent document-assisted conversations.

### Supported Formats
- `.pdf`
- `.txt`

### Processing Workflow
- PDF parsing using `PyPDF2`
- Text extraction with secure backend handling
- Injects extracted content into AI conversation memory
- Enables contextual Q&A from uploaded documents

### Example Usage

> “Summarize the uploaded document”  
> “Explain Chapter 2 from my notes”

---

## Advanced Chat Memory Management

### Frontend Storage
- Multiple chat threads stored using `localStorage`
- Seamless switching between conversations

### Backend Synchronization
- Session clearing via `/clear`
- Prevents context leakage between conversations
- Ensures isolated and accurate AI responses

---

## Dynamic Welcome Experience

Every new conversation includes:
- Animated graduation-cap illustration
- Personalized greeting
- AI capability overview
- Interactive suggestion prompts
- Language-aware onboarding interface

---

# System Architecture

## 1. Frontend Layer

Built using:
- HTML5
- CSS3
- Vanilla JavaScript

### Responsibilities
- UI rendering
- Internationalization (i18n)
- Speech recognition
- Fetch API communication
- Local storage management

---

## 2. Backend Layer

Powered by **Flask**.

### Responsibilities
- API routing
- Session management
- File processing
- Context handling
- AI request orchestration

---

## 3. AI Integration Layer

Connected to the **Groq API**.

### Responsibilities
- Fast LLM inference
- Context-aware response generation
- Language-specific prompting

---

# API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Renders the main interface |
| `/chat` | POST | Processes user messages and generates AI responses |
| `/upload` | POST | Uploads and extracts text from documents |
| `/clear` | POST | Clears backend session memory |

---

# Technology Stack

## Backend
- Python 3
- Flask

## AI
- Groq API
- Llama-3.1-8b-instant

## Frontend
- HTML5
- CSS3
- JavaScript

## Libraries & Tools
- PyPDF2
- python-dotenv
- marked.js
- Font Awesome
- Google Fonts (Inter)

---

# Project Structure

```text
Chatbot Project/
├── CHATBOT/
│   ├── .env
│   ├── app.py
│   ├── app1.py
│   ├── Multilingual_Implementation.md
│   ├── Presentation content.md
│   ├── README.md
│   ├── static/
│   │   ├── favicon.ico
│   │   ├── script.js
│   │   └── style.css
│   └── templates/
│       └── index.html
└── ChatbotNew Zip.zip
```

---

# Installation & Setup

## Prerequisites

- Python 3.8+
- Groq API Key

Get your API key from:  
https://console.groq.com/

---

## 1. Navigate to Project Directory

```bash
cd "Chatbot Project/CHATBOT"
```

---

## 2. Install Dependencies

```bash
pip install flask python-dotenv groq PyPDF2
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

---

## 4. Run the Application

```bash
python app.py
```

Open the browser at:

```text
http://127.0.0.1:5000
```

---

# Multilingual Usage Guide

## Change Language
Use the language selector in the top-right corner.

## Voice Recognition
Automatically adapts to:
- `en-US`
- `hi-IN`

## AI Replies
Responses are generated in the currently selected language.

---

# Key Engineering Highlights

- Session-based context management
- Context isolation between chats
- Responsive mobile-first architecture
- Secure environment variable handling
- Modular multilingual framework
- Optimized token usage for performance

---

# Contributors

- **Jagjit Singh**
- **Mohit Beetan**

---

# License

This project is intended for educational and learning purposes.

---

# Final Note

AI Study Buddy is more than just a chatbot — it is a productivity-focused learning companion designed to support students academically while encouraging healthier study habits and balanced living.

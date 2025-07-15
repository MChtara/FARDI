# CEFR Language Assessment Game

A Flask-based interactive language learning game that assesses English proficiency using the Common European Framework of Reference for Languages (CEFR) standards.

## Features

- **Interactive Dialogue System**: Engage with NPCs in a cultural event planning scenario
- **CEFR Level Assessment**: Automatic assessment of language responses using AI
- **Real-time Feedback**: Instant AI-powered feedback on responses
- **Audio Integration**: Text-to-speech functionality for listening comprehension
- **AI Detection**: Prevents cheating by detecting AI-generated responses
- **Progress Tracking**: XP system, achievements, and skill progression
- **Multilingual Support**: Recognizes and credits code-switching behavior

## Project Structure

```
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── models/
│   └── game_data.py           # Game data and constants
├── services/
│   ├── ai_service.py          # AI and language processing
│   ├── audio_service.py       # Audio generation service
│   └── assessment_service.py  # Language assessment service
├── routes/
│   └── api_routes.py          # API endpoints
├── utils/
│   └── helpers.py             # Helper functions
├── static/
│   ├── audio/                 # Generated audio files
│   └── images/
│       └── avatars/           # Character avatars
├── templates/                 # HTML templates
└── sessions/                  # Session storage
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cheedli/farooj_done
   cd fardi
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   - `GROQ_API_KEY`: For AI-powered language assessment
   - `SAPLING_API_KEY`: For AI content detection (optional)

5. **Run the application**
   ```bash
   python app.py
   ```

## API Keys Setup

### Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Create an account and generate an API key
3. Add to your `.env` file as `GROQ_API_KEY`

### Sapling API Key (Optional)
1. Visit [Sapling AI](https://sapling.ai/)
2. Sign up for an account
3. Get your API key for AI detection
4. Add to your `.env` file as `SAPLING_API_KEY`

## Services

### AI Service (`services/ai_service.py`)
- Handles Groq API interactions
- AI content detection using Sapling API
- Fallback local detection methods
- Character-based response generation

### Assessment Service (`services/assessment_service.py`)
- CEFR level assessment
- Listening comprehension evaluation
- Vocabulary and grammar analysis
- Professional English standards checking

### Audio Service (`services/audio_service.py`)
- Text-to-speech generation using Edge TTS
- Character-specific voice mapping
- Audio file management
- Custom audio generation for API requests

## Game Flow

1. **Introduction**: Player enters name and starts game
2. **Dialogue Sequence**: 9 interactive questions with different NPCs
3. **Assessment**: Each response is evaluated for CEFR level
4. **Feedback**: Real-time AI feedback on responses
5. **Results**: Overall assessment, achievements, and skill breakdown
6. **Certificate**: Downloadable completion certificate

## Assessment Categories

- **Introduction**: Self-expression skills
- **Motivation**: Reasoning abilities
- **Cultural Knowledge**: World knowledge and cultural awareness
- **Listening**: Comprehension and repetition accuracy
- **Creativity**: Original thinking and ideation
- **Social Interaction**: Conversation and politeness
- **Problem Solving**: Strategic thinking
- **Skills Discussion**: Abstract thinking
- **Writing**: Written expression skills

## CEFR Levels

- **A1**: Beginner - Basic everyday expressions
- **A2**: Elementary - Simple communication tasks
- **B1**: Intermediate - Most travel situations
- **B2**: Upper Intermediate - Fluent interaction with natives
- **C1**: Advanced - Fluent and spontaneous expression

## Development

### Adding New Questions
1. Add question data to `DIALOGUE_QUESTIONS` in `models/game_data.py`
2. Include assessment criteria and example responses
3. Update audio generation if needed

### Extending Assessment
1. Modify assessment prompts in `services/assessment_service.py`
2. Add new criteria to the evaluation system
3. Update scoring algorithms in `utils/helpers.py`

### Adding New NPCs
1. Add character data to `NPCS` in `models/game_data.py`
2. Create avatar images
3. Add voice mapping in `services/audio_service.py`

## API Endpoints

- `POST /api/get-ai-feedback`: Get AI feedback on responses
- `GET /api/language-tips`: Get personalized learning tips
- `GET /api/next-challenge`: Get bonus challenges
- `POST /api/check-ai-response`: Check for AI-generated content
- `POST /api/generate-audio`: Generate custom audio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error logs and environment details
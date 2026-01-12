# FARDI - Language Assessment Platform

This is a full-stack CEFR (Common European Framework of Reference for Languages) assessment game with separate frontend and backend components.

## Project Structure

```
FARDI/
├── backend/          # Flask API server
│   ├── app.py        # Main Flask application
│   ├── models/       # Database models and game data
│   ├── routes/       # API endpoints and authentication
│   ├── services/     # AI, audio, and assessment services
│   ├── utils/        # Helper functions
│   ├── templates/    # Server-side templates
│   ├── static/       # Static assets
│   ├── sessions/     # Session storage
│   ├── requirements.txt
│   └── CLAUDE.md     # Backend-specific documentation
│
└── frontend/         # React SPA
    ├── src/          # React source code
    ├── dist/         # Built files (served by Flask)
    ├── package.json
    └── vite.config.js

```

## Quick Start

### Backend (Flask API)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend (React SPA)
```bash
cd frontend
npm install
npm run build  # For production
# OR
npm run dev    # For development
```

## Development Workflow

1. **Backend Development**: Work in `backend/` directory
2. **Frontend Development**: Work in `frontend/` directory
3. **Full Stack**: Run both servers independently or build frontend and serve via Flask

## Access Points

- **Backend API**: `http://localhost:5010/api/`
- **React SPA**: `http://localhost:5010/app/`
- **Legacy Templates**: `http://localhost:5010/`

## Documentation

- See `backend/CLAUDE.md` for backend-specific documentation
- Frontend documentation is included in the backend CLAUDE.md file

## Environment Setup

Copy `backend/.env.example` to `backend/.env` and configure:
- `GROQ_API_KEY`: Required for AI-powered language assessment
- `SAPLING_API_KEY`: Optional for AI content detection
- `SECRET_KEY`: Flask session security
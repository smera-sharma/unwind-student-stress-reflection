# Unwind Project Foundation

Unwind is a production-ready application structure featuring a React (Vite) frontend with Tailwind CSS styling and a FastAPI backend with SQLAlchemy + SQLite database connections, complete with a JWT-ready authentication structure.

---

## 🏛️ Project Architecture

This repository is split into two independent applications:
1. **`frontend/`**: Single Page Application built on React, Vite, Tailwind CSS, React Router, and Axios.
2. **`backend/`**: REST API built with FastAPI, Python 3.8+, SQLAlchemy, and SQLite.

```text
UNWIND/
├── .env.example
├── .prettierrc
├── eslint.config.js
├── README.md
├── backend/                      # FastAPI Backend Application
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint
│   │   ├── core/                 # Config, DB connection, Security stubs
│   │   ├── models/               # SQLAlchemy Models (User, CheckIn, etc.)
│   │   ├── schemas/              # Pydantic validation schemas
│   │   └── api/                  # API router and endpoints (V1)
│   ├── services/                 # Business logic interfaces (placeholder)
│   ├── repositories/             # Database access layers (placeholder)
│   └── utils/                    # Shared helper utilities (placeholder)
└── frontend/                     # React + Vite Frontend Application
    ├── package.json
    ├── tailwind.config.js
    ├── src/
        ├── main.jsx              # React mount entry
        ├── App.jsx               # Router & Context provider wrapper
        ├── index.css             # Tailwind setup and theme styles
        ├── components/           # Component libraries (ui, common, forms, charts)
        ├── layouts/              # Route wrapper layouts (Layout, ProtectedLayout)
        ├── pages/                # Page route placeholders
        └── services/             # Axios client configurations and API services
```

---

## 🚀 Setup & Execution

### 📋 Prerequisites
- **Python 3.8+**
- **Node.js 18+ & NPM**

### 💻 1. Environment Configuration
Copy the configuration template at the root:
```bash
cp .env.example .env
```
*(Customize values inside `.env` to match your local setup).*

---

### 🐍 2. Backend Setup (`backend/`)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. View API docs:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### ⚛️ 3. Frontend Setup (`frontend/`)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at [http://localhost:5173](http://localhost:5173)

---

## 🎨 Theme & Design System

The frontend utilizes Tailwind CSS with a customized color palette defined in [tailwind.config.js](file:///c:/Users/Smerra/OneDrive/Desktop/UNWIND/frontend/tailwind.config.js):
- **Soft Blue**: `unwind-blue` (accent borders, primary buttons)
- **Pastel Lavender**: `unwind-lavender` (brand styling, secondary elements)
- **Mint**: `unwind-mint` (success indicators, subtle highlights)
- **Off-white**: `unwind-bg` (main background screens)
- **Glass White**: `unwind-glass` (cards, nav overlay containers with backdrop filters)

All layouts support responsive views and transition animations.

---

## 🔒 JWT-Ready Authentication Structure

Authentication is currently in **skeleton state** (no active encryption or token generation is implemented):
- **Backend**: API endpoints for `/api/v1/auth/login` and `/api/v1/auth/register` are defined in the router alongside placeholder schemas and security helper definitions (`security.py`).
- **Frontend**: `AuthContext.jsx` and `authService.js` are configured to handle user states and token headers. Route authorization is managed by `ProtectedLayout.jsx`.

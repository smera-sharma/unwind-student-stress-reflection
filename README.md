# 🌿 Unwind – AI-Powered Student Wellness Platform

> An intelligent wellness platform that helps students manage stress, organize their academic life, and build healthier habits through AI-powered assistance.

## 🌐 Live Demo

**Frontend:** https://unwind-student-stress-reflection.vercel.app/

**Backend API:** https://unwind-backend-dq7t.onrender.com/docs

---

## 📌 Overview

Unwind is a full-stack AI web application designed to improve student well-being and productivity.

It combines journaling, mood tracking, an AI problem-solving companion, calendar management, personalized insights, and wellness resources into one modern platform.

Unlike traditional wellness apps, Unwind focuses on helping students organize their thoughts, reflect on their progress, and solve academic or productivity challenges with AI assistance.

---

# ✨ Features

### 🔐 Authentication

* Secure JWT Authentication
* User Registration & Login
* Protected Routes
* Persistent Sessions

### 📊 Dashboard

* Personalized Welcome Screen
* Daily Mood Tracking
* Activity Overview
* Productivity Statistics
* Streak Tracking

### 🤖 Luna — AI Companion

* AI-powered academic & productivity assistant
* Problem-solving conversations
* Reflection support
* Study planning assistance
* Built using Google Gemini

### 📖 Journal

* Create journal entries
* Reflection history
* Mood logging
* Personal growth tracking

### 📅 Calendar

* Schedule academic tasks
* Event management
* Daily planning

### 📈 Insights

* Mood trends
* Productivity analytics
* Weekly summaries
* Personal progress visualization

### 📚 Resources

* Curated wellness resources
* Study techniques
* Mental wellness content
* Productivity guidance

### 👤 User Profile

* Profile customization
* Display name editing
* Personalized experience

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

## Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* Pydantic
* SQLite

## AI

* Google Gemini API

## Deployment

* Frontend → Vercel
* Backend → Render

---

# 📂 Project Structure

```
Unwind/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   └── ...
│
└── README.md
```

---

# 🚀 Running Locally

## Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

### Backend

```
DATABASE_URL=
SECRET_KEY=
GEMINI_API_KEY=
```

### Frontend

```
VITE_API_URL=
```

---

# 📸 Screenshots

*Add screenshots of:*

* Login
* Dashboard
* Luna AI
* Journal
* Calendar
* Insights

---

# 🔮 Future Enhancements

* Notifications & reminders
* Goal tracking
* AI-powered habit recommendations
* Cloud database migration
* Mobile application
* Peer support communities

---

# 👩‍💻 Author

**smmera sharrma**

GitHub: https://github.com/smera-sharma

---

# ⭐ If you like this project

Please consider giving it a ⭐ on GitHub!

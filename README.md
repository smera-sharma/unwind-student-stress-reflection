# 🌿 Unwind – AI-Powered Student Stress Reflection Platform

Unwind is a full-stack AI-powered web application designed to help students monitor their mental well-being, reflect on their academic journey, and receive personalized insights through intelligent analysis.

This project combines psychology, data analytics, and artificial intelligence to provide a safe and insightful self-reflection experience while maintaining user privacy.

---

## 🚀 Project Vision

College students often experience stress, burnout, and anxiety but lack accessible tools to regularly monitor their mental health.

Unwind aims to bridge this gap by providing:

- 🧠 AI-powered emotional reflection
- 📊 Stress trend visualization
- 📅 Weekly psychological check-ins
- 💡 Personalized wellness recommendations
- 🤝 Anonymous peer coping strategies
- 📈 Progress tracking over time

---

# ✨ Features (Planned)

- User Authentication (JWT)
- Secure Login & Registration
- Weekly PSS (Perceived Stress Scale) Check-ins
- Mood Tracking
- AI Reflection Summaries
- Personalized Recommendations
- Stress Analytics Dashboard
- Calendar & Habit Tracking
- Anonymous Peer Strategy Sharing
- Admin Analytics Dashboard

---

# 🏗 Tech Stack

## Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Axios

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication

## AI

- OpenAI API (Planned)
- Sentiment Analysis
- Reflection Summarization
- Personalized Recommendation Engine

## Development Tools

- Git
- GitHub
- VS Code
- Postman / Swagger UI

---

# 📂 Project Structure

```
UNWIND
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── routes/
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── services/
│
└── README.md
```

---

# ⚙️ Getting Started

## Clone the repository

```bash
git clone https://github.com/smera-sharma/unwind-student-stress-reflection.git
```

## Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 📅 Development Roadmap

- [x] Project Foundation
- [ ] Authentication System
- [ ] User Dashboard
- [ ] Weekly PSS Check-ins
- [ ] Reflection Journal
- [ ] AI Summaries
- [ ] Personalized Recommendations
- [ ] Mood Analytics
- [ ] Calendar Integration
- [ ] Peer Strategy Sharing
- [ ] Testing
- [ ] Deployment

---

# 🎯 Learning Goals

This project is being built to strengthen skills in:

- Full Stack Development
- REST API Design
- Authentication & Security
- Database Design
- AI Integration
- UI/UX Design
- Software Architecture
- Git & GitHub Workflow

---

# 🤝 Contributing

This project is currently being developed as a personal portfolio project.

Feedback and suggestions are always welcome.

---

# 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Eshniie Sharma**

B.Tech Computer Science Engineering Student

Building AI-driven applications focused on human-centered technology, mental well-being, and ethical AI.

---

⭐ If you found this project interesting, consider giving it a star!
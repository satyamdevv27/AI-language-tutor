```md
# 🧠 AI Language Tutor

An AI-powered English learning platform built using the **MERN stack**, designed to help users improve their communication skills through **real-time chat, voice learning, debates, and scenario-based conversations**.

---

## 🚀 Features

### 🔐 Authentication
- Secure user authentication using **JWT**
- Login, Signup, Reset Password
- Protected routes for authenticated users

### 💬 AI Chat
- Real-time AI-powered chat for English practice
- Chat history with multiple sessions
- Automatic session titles based on conversation

### 🎙️ Voice Learning
- Speech-to-text using **Web Speech API**
- AI-powered sentence correction
- Grammar explanation & vocabulary suggestions
- Text-to-speech for corrected sentences
- Voice learning history management

### 🗣️ Debate Mode
- AI debate partner with voice interaction
- Topic-based debate sessions
- Multiple rounds with speaking feedback
- Automatic debate flow & conclusion

### 🎭 Scenario-Based Practice
- Practice English in real-world situations:
  - Job Interview
  - Restaurant Ordering
  - Hotel Check-in
  - Airport Conversation
  - Customer Support
- AI voice adapts based on scenario role

### 📊 User Profile & Analytics
- User profile with avatar selection
- Learning score & rank system
- Progress tracking (Chats, Debates, Scenarios)
- Interactive charts using **Recharts**
- Dark / Light mode support

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Recharts
- Web Speech API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful APIs

---

├── frontend
│ ├── src
│ │ ├── pages # All main pages (Chat, Profile, Debate, Scenario, etc.)
│ │ ├── components # Reusable UI components
│ │ ├── data # Static data (scenarios, debate topics, etc.)
│ │ ├── App.jsx
│ │ └── main.jsx
│
├── backend
│ ├── controllers # Request handlers / business logic
│ ├── routes # API route definitions
│ ├── models # MongoDB schemas
│ ├── middleware # Auth & other middlewares
│ └── server.js # Express server entry point

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```

VITE_API_URL=[http://localhost:8080](http://localhost:8080)

```

### Backend (`.env`)
```

PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

````

---

## 🧪 Running Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ai-language-tutor.git
cd ai-language-tutor
````

### 2️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📸 Screenshots

*Add screenshots of:*

* Dashboard
* AI Chat
* Voice Learning
* Debate Mode
* Scenario Practice
* Profile Page

---

## 🎯 Learning Outcomes

* Full-stack MERN development
* AI-assisted learning workflows
* Speech recognition & synthesis
* State management & UI/UX design
* Secure authentication & REST API design

---

## 🧑‍💻 Author

**Satyam**
Web Developer | MERN Stack Enthusiast

---

## 📌 Future Improvements

* AI conversation scoring
* Grammar difficulty levels
* Multi-language support
* Mobile application
* Advanced speaking analytics

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

```


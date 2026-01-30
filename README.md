# 🖥️ Face Detection Backend (Face++ API Integration)

## 📖 Overview
This backend server powers the **AI Face Detection Web App**.  
It acts as a secure proxy between the frontend React application and the **Face++ API**, ensuring that sensitive API keys remain hidden from the client side.

- Built with **Node.js + Express**
- Deployed on **Render**
- Handles image URL requests from the frontend
- Returns bounding box data for detected faces

---

## 🚀 Features
- Securely stores API keys in environment variables (`.env`)
- Accepts image URLs from the frontend
- Calls Face++ API for face detection
- Returns scaled bounding box coordinates for accurate overlays
- Prevents exposing API keys in the frontend

---

## 🛠️ Tech Stack
- **Node.js** (runtime)
- **Express.js** (server framework)
- **Face++ API** (face detection service)
- **Render** (deployment platform)

---

## 📂 Project Structure
AI-backend/
│
├── server.js           # Main Express server
├── routes/            # API routes
├── controllers/       # Logic for Face++ requests
├── .env               # Environment variables (ignored in Git)
├── .gitignore         # Ensures .env and node_modules are not tracked
└── package.json        # Dependencies and scripts

---

## 🔒 Security
API keys are stored in .env and never exposed in frontend.

.gitignore ensures .env and node_modules are not pushed to GitHub.

Backend acts as a proxy to keep credentials safe.

---

## 📦 Deployment
Hosted on Render

Environment variables configured in Render dashboard

Automatic redeploys on git push

---

## 👨‍💻 Author
Mouad Benaich  
Ambitious React.js  engineer & UI/UX designer, focused on secure.
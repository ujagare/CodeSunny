# 🚀 CodeSunny - Web & Digital Solutions

Production-ready website with AI-powered chatbot.

## ✅ Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install

# MCP Server
cd mcp-server
pip install -r requirements.txt
```

### 2. Configure Environment

**Backend:** `backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MCP_URL=http://localhost:8001/mcp
```

**MCP Server:** `mcp-server/.env`

```env
GROQ_API_KEY=your_groq_key
FREEPIK_API_KEY=your_freepik_key
SMTP_HOST=smtppro.zoho.in
SMTP_PORT=465
SMTP_USER=information@codesunny.in
SMTP_PASS=your_password
```

### 3. Start Servers

```bash
# Terminal 1: MCP Server
cd mcp-server
python server.py

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: Frontend
npm run dev
```

### 4. Open Browser

```
http://localhost:5173
```

---

## 🎯 Features

- ✅ Modern React frontend with animations
- ✅ AI-powered chatbot (Groq LLM)
- ✅ SEO audit tool
- ✅ Image generation (Freepik AI)
- ✅ Quote calculator
- ✅ Lead capture with email notifications
- ✅ Session management
- ✅ Deterministic routing

---

## 📁 Project Structure

```
CodeSunny/
├── src/                    # Frontend React app
├── backend/                # Express.js API
├── mcp-server/            # MCP AI server
├── docs/                  # Documentation
└── README.md              # This file
```

---

## 🔧 Key Technologies

- **Frontend:** React, Vite, TailwindCSS, GSAP
- **Backend:** Node.js, Express, MongoDB
- **AI:** Groq (LLM), Freepik (Images)
- **Email:** Zoho Mail Pro

---

## 📚 Documentation

Detailed documentation available in `docs/` folder:

- `docs/PRODUCTION_ARCHITECTURE_COMPLETE.md` - Architecture details
- `docs/QUICK_START_PRODUCTION.md` - Setup guide
- `docs/ZOHO_EMAIL_SETUP.md` - Email configuration

---

## 🚀 Production Deployment

1. Build frontend: `npm run build`
2. Deploy backend to your server
3. Configure environment variables
4. Start all services

---

## 📞 Contact

- **Email:** information@codesunny.in
- **Website:** https://codesunny.com

---

**Status:** ✅ Production Ready

**Last Updated:** February 2026

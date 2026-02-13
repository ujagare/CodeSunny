# CodeSunny - Quick Start Guide

## Kal Laptop Kholne Ke Baad

### Option 1: Automatic (Recommended)

Double-click `start-all.bat` file - sab kuch automatically start ho jayega!

### Option 2: Manual

Teen terminals kholo aur ye commands run karo:

**Terminal 1 - MCP Server:**

```cmd
cd mcp-server
python server.py
```

**Terminal 2 - Backend:**

```cmd
cd backend
npm start
```

**Terminal 3 - Frontend:**

```cmd
npm run dev
```

## URLs

- Frontend (Chatbot): http://localhost:5174 ya 5175
- Backend API: http://localhost:5000
- MCP Server: http://localhost:8001

## Important Notes

- Teeno servers ko chalte rehne do
- Chatbot frontend URL pe dikhega
- Groq AI (FREE) use ho raha hai
- Agar koi port busy ho to error aayega - us port ko free karo

## Troubleshooting

### Port Already in Use

```cmd
netstat -ano | findstr :8001
taskkill /PID <process_id> /F
```

### MCP Server Not Working

- Check `.env` file mein GROQ_API_KEY set hai
- Python installed hai check karo: `python --version`

### Backend Not Starting

- MongoDB connection check karo
- `npm install` run karo agar packages missing hain

### Frontend Not Loading

- `npm install` run karo
- Browser cache clear karo

## Configuration Files

- `mcp-server/.env` - MCP server config (AI keys)
- `backend/.env` - Backend config (MongoDB, JWT)
- `vite.config.js` - Frontend proxy settings

## Git Commands

```cmd
git add .
git commit -m "your message"
git push
```

Sab kuch Git mein save hai, tension mat lo!

# 🤖 Gemini CLI Setup Guide

Aapke CodeSunny project mein Google Gemini AI CLI successfully add ho gaya hai!

## 📦 Kya Add Hua?

1. **gemini_cli.py** - Main CLI tool
2. **setup-gemini.bat** - Windows setup script
3. **test-gemini.py** - Configuration test script
4. **README_GEMINI.md** - Complete documentation
5. **.env** - Gemini configuration added

## 🚀 Setup Steps (3 Minutes)

### Step 1: Install Dependencies

```bash
# Windows
setup-gemini.bat

# Linux/Mac
cd mcp-server
pip install google-generativeai pillow
```

### Step 2: Get API Key (FREE)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 3: Configure

Open `mcp-server/.env` and update:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Step 4: Test

```bash
cd mcp-server
python test-gemini.py
```

Agar sab kuch ✅ dikhe, to ready hai!

## 💻 Usage Examples

### Interactive Chat

```bash
cd mcp-server
python gemini_cli.py chat
```

### Quick Question

```bash
python gemini_cli.py prompt "What is React?"
```

### Image Analysis

```bash
python gemini_cli.py image screenshot.png "What's in this image?"
```

## 🎯 Features

- ✅ Interactive chat mode
- ✅ Single prompt mode
- ✅ Image analysis (Gemini Vision)
- ✅ Colored terminal output
- ✅ Already integrated with MCP server
- ✅ Free tier: 60 requests/minute

## 📚 Documentation

Complete guide: `mcp-server/README_GEMINI.md`

## 🔗 Integration

Gemini already integrated hai aapke MCP server mein:

- Priority: Groq > MinMax > OpenAI > Gemini
- Automatic fallback if other APIs fail
- Used in chatbot for AI responses

## 🆘 Troubleshooting

### API Key Error?

```bash
# Check if key is set
cat mcp-server/.env | grep GEMINI_API_KEY

# Should NOT be:
GEMINI_API_KEY=your_gemini_api_key_here  # ❌

# Should be:
GEMINI_API_KEY=AIzaSyD...actual_key...   # ✅
```

### Module Not Found?

```bash
pip install google-generativeai pillow
```

### Test Failed?

```bash
cd mcp-server
python test-gemini.py
```

## 🎓 Next Steps

1. ✅ Setup complete (you're here!)
2. 📖 Read full docs: `mcp-server/README_GEMINI.md`
3. 🧪 Try examples above
4. 🚀 Integrate in your workflows

## 💡 Pro Tips

- Use chat mode for brainstorming
- Use prompt mode for automation
- Use image mode for UI/design analysis
- Combine with other AI tools (Groq, OpenAI)

## 📞 Support

Questions? Contact:

- 📧 information@codesunny.in
- 🌐 https://codesunny.com
- 📱 +91 89758075789

---

Happy coding with Gemini! 🎉

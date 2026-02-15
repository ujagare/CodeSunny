# 🤖 Gemini CLI - Google Gemini AI Command Line Interface

Simple aur powerful CLI tool jo Google Gemini AI ke saath interact karne ke liye hai.

## ✨ Features

- 💬 **Interactive Chat Mode** - Real-time conversation with Gemini
- 📝 **Single Prompt Mode** - Quick questions and answers
- 🖼️ **Image Analysis** - Gemini Vision ke saath images analyze karo
- 🎨 **Colored Output** - Beautiful terminal interface
- ⚡ **Fast & Easy** - Simple commands, powerful results

## 🚀 Quick Start

### 1. Setup (Ek baar)

```bash
# Windows
setup-gemini.bat

# Linux/Mac
cd mcp-server
pip install google-generativeai pillow
```

### 2. API Key Setup

1. API key lo: https://makersuite.google.com/app/apikey
2. `mcp-server/.env` file mein add karo:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Use Karo!

```bash
cd mcp-server

# Interactive chat
python gemini_cli.py chat

# Single question
python gemini_cli.py prompt "What is AI?"

# Image analysis
python gemini_cli.py image photo.jpg "Describe this"
```

## 📖 Usage Examples

### Interactive Chat Mode

```bash
python gemini_cli.py chat
```

- Type karke Gemini se baat karo
- `exit` ya `quit` type karke band karo

### Single Prompt

```bash
# Simple question
python gemini_cli.py prompt "Explain quantum computing"

# Code generation
python gemini_cli.py prompt "Write a Python function to sort a list"

# Translation
python gemini_cli.py prompt "Translate 'Hello World' to Hindi"
```

### Image Analysis

```bash
# Basic analysis
python gemini_cli.py image photo.jpg

# Custom prompt
python gemini_cli.py image screenshot.png "What code is in this image?"

# Detailed description
python gemini_cli.py image design.png "Analyze this UI design"
```

## 🎯 Use Cases

### For Developers

```bash
# Code review
python gemini_cli.py prompt "Review this code: [paste code]"

# Debug help
python gemini_cli.py prompt "Why is this error happening: [error message]"

# Documentation
python gemini_cli.py prompt "Write documentation for this function"
```

### For Content

```bash
# Blog ideas
python gemini_cli.py prompt "Give me 10 blog post ideas about web development"

# SEO optimization
python gemini_cli.py prompt "Optimize this meta description: [text]"

# Social media
python gemini_cli.py prompt "Create 5 LinkedIn posts about AI"
```

### For Business

```bash
# Email drafts
python gemini_cli.py prompt "Write a professional email to a client about project delay"

# Market research
python gemini_cli.py prompt "What are the latest trends in e-commerce?"

# Competitor analysis
python gemini_cli.py prompt "Analyze this competitor website: [URL]"
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (defaults shown)
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Available Models

- `gemini-2.0-flash-exp` - Latest, fastest (recommended)
- `gemini-pro` - Stable, reliable
- `gemini-pro-vision` - For image analysis

## 💡 Tips & Tricks

### Better Prompts

```bash
# ❌ Bad
python gemini_cli.py prompt "code"

# ✅ Good
python gemini_cli.py prompt "Write a Python function that validates email addresses using regex"
```

### Chat Mode Shortcuts

- Type `exit`, `quit`, or `q` to end chat
- Press `Ctrl+C` for emergency exit
- Empty input is ignored

### Image Analysis Tips

- Supported formats: JPG, PNG, GIF, WebP
- Max size: 4MB (Gemini limit)
- Better quality = better analysis

## 🆚 Gemini vs Other AI

| Feature        | Gemini     | ChatGPT    | Groq       |
| -------------- | ---------- | ---------- | ---------- |
| Speed          | ⚡⚡⚡     | ⚡⚡       | ⚡⚡⚡⚡   |
| Free Tier      | 60 req/min | Limited    | 14,400/day |
| Image Analysis | ✅         | ✅ (Plus)  | ❌         |
| Code Quality   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| Context Length | 32K tokens | 8K-128K    | 32K        |

## 🐛 Troubleshooting

### "API Key not configured"

```bash
# Check .env file
cat mcp-server/.env | grep GEMINI_API_KEY

# Make sure it's not the placeholder
GEMINI_API_KEY=your_gemini_api_key_here  # ❌ Wrong
GEMINI_API_KEY=AIzaSyD...actual_key...   # ✅ Correct
```

### "Module not found"

```bash
# Reinstall dependencies
pip install google-generativeai pillow
```

### "Image not found"

```bash
# Use absolute path
python gemini_cli.py image C:\Users\You\Pictures\photo.jpg

# Or relative from mcp-server folder
python gemini_cli.py image ../public/image.png
```

## 🔗 Integration with MCP Server

Gemini CLI already integrated hai MCP server mein:

```python
# server.py mein already hai
import google.generativeai as genai

# Chat tool automatically uses Gemini if available
@mcp.tool()
def chat(message: str, session_id: str = ""):
    # Uses Gemini as fallback
    ...
```

Priority order:

1. Groq (fastest, free)
2. MinMax (Chinese LLM)
3. OpenAI (paid)
4. Gemini (free, good)

## 📚 Resources

- **API Key**: https://makersuite.google.com/app/apikey
- **Documentation**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **Models**: https://ai.google.dev/models

## 🎓 Learning Path

1. **Beginner**: Start with chat mode
2. **Intermediate**: Try single prompts for automation
3. **Advanced**: Integrate with your scripts
4. **Expert**: Build custom tools using Gemini API

## 🚀 Next Steps

```bash
# 1. Setup
setup-gemini.bat

# 2. Get API key
# Visit: https://makersuite.google.com/app/apikey

# 3. Add to .env
# GEMINI_API_KEY=your_key_here

# 4. Start chatting!
cd mcp-server
python gemini_cli.py chat
```

## 💬 Support

Issues? Questions?

- 📧 Email: information@codesunny.in
- 🌐 Website: https://codesunny.com
- 📱 Phone: +91 89758075789

---

Made with ❤️ by CodeSunny Team

# 🧹 Cleanup Guide - Safe to Delete Files

## ✅ Production mein Zaruri Files

### Must Keep (Core Application):

```
CodeSunny/
├── src/                    # Frontend code (KEEP)
├── backend/                # Backend API (KEEP)
├── mcp-server/            # AI server (KEEP)
│   ├── server.py          # Main server (KEEP)
│   ├── session_manager.py # Session handling (KEEP)
│   ├── intent_router.py   # Intent detection (KEEP)
│   ├── tool_flows.py      # Business logic (KEEP)
│   ├── llm_handler.py     # LLM control (KEEP)
│   ├── .env               # Configuration (KEEP)
│   └── data/              # Data storage (KEEP)
├── package.json           # Dependencies (KEEP)
├── .gitignore            # Git rules (KEEP)
├── README.md             # Main readme (KEEP)
└── start-all.bat         # Quick start (KEEP)
```

---

## ❌ Safe to Delete (Optional Files)

### Documentation (docs/):

**Can Delete Entire Folder** - Sirf reference ke liye hai

```
docs/
├── *.md                   # All documentation files
└── tests/                 # All test files
```

**Keep Only If:**

- Team ko documentation chahiye
- Future reference ke liye
- Development guide chahiye

**Delete If:**

- Production deployment only
- Space save karna hai
- Clean project chahiye

---

### Test Files (docs/tests/):

**Can Delete** - Production mein kaam nahi aate

```
docs/tests/
├── test-*.js              # Test scripts
├── test-*.cjs             # Test scripts
├── test-*.html            # Browser tests
├── demo-*.js              # Demo files
└── verify-*.cjs           # Verification scripts
```

---

### Development Tools:

**Can Delete** - Sirf development ke liye

```
mcp-server/
├── test-email.py          # Email test (optional)
├── locustfile.py          # Load testing (optional)
├── production_checks.py   # Checks (optional)
├── test_hardening.py      # Testing (optional)
└── server_hardened_example.py  # Example (optional)
```

---

### Batch Files:

**Can Delete** - Convenience scripts only

```
install-*.bat              # Installation scripts
```

**Keep:**

```
start-all.bat              # Quick start (useful)
```

---

## 🎯 Recommended Cleanup

### Minimal Production Setup:

**Delete These:**

```bash
# Delete documentation
rm -rf docs/

# Delete test files (already moved to docs/tests)
# (Already done)

# Delete optional MCP tools
rm mcp-server/locustfile.py
rm mcp-server/production_checks.py
rm mcp-server/test_hardening.py
rm mcp-server/server_hardened_example.py

# Delete install scripts
rm install-*.bat
```

**Keep These:**

```
✅ src/
✅ backend/
✅ mcp-server/
   ✅ server.py
   ✅ session_manager.py
   ✅ intent_router.py
   ✅ tool_flows.py
   ✅ llm_handler.py
   ✅ .env
   ✅ data/
✅ package.json
✅ .gitignore
✅ README.md
✅ start-all.bat
```

---

## 📊 File Size Impact

### Before Cleanup:

- Documentation: ~5-10 MB
- Test files: ~2-3 MB
- Optional tools: ~1-2 MB
- **Total:** ~8-15 MB

### After Cleanup:

- Core application only
- **Total:** ~50-100 KB (excluding node_modules)

---

## 🚀 Production Deployment

### What to Deploy:

**Essential:**

```
src/                    # Frontend
backend/                # Backend
mcp-server/            # AI server
  ├── server.py
  ├── session_manager.py
  ├── intent_router.py
  ├── tool_flows.py
  ├── llm_handler.py
  ├── .env (with production values)
  └── data/
package.json
.gitignore
README.md
```

**Optional:**

```
start-all.bat          # If deploying on Windows
docs/                  # If team needs reference
```

---

## ⚠️ Important Notes

### Never Delete:

- ❌ `src/` - Frontend code
- ❌ `backend/` - Backend API
- ❌ `mcp-server/server.py` - Main AI server
- ❌ `mcp-server/session_manager.py` - Session handling
- ❌ `mcp-server/intent_router.py` - Intent detection
- ❌ `mcp-server/tool_flows.py` - Business logic
- ❌ `mcp-server/llm_handler.py` - LLM control
- ❌ `mcp-server/.env` - Configuration
- ❌ `mcp-server/data/` - Data storage
- ❌ `package.json` - Dependencies
- ❌ `.gitignore` - Git rules

### Safe to Delete:

- ✅ `docs/` - Documentation
- ✅ `test-*.js` - Test files
- ✅ `install-*.bat` - Install scripts
- ✅ `mcp-server/test-email.py` - Test script
- ✅ `mcp-server/locustfile.py` - Load testing
- ✅ `mcp-server/*_example.py` - Examples

---

## 🎯 Quick Cleanup Commands

### Delete All Optional Files:

**Windows (PowerShell):**

```powershell
# Delete docs (optional)
Remove-Item -Recurse -Force docs/

# Delete optional MCP files
Remove-Item mcp-server/locustfile.py
Remove-Item mcp-server/production_checks.py
Remove-Item mcp-server/test_hardening.py
Remove-Item mcp-server/server_hardened_example.py
Remove-Item mcp-server/test-email.py

# Delete install scripts
Remove-Item install-*.bat
```

**Linux/Mac:**

```bash
# Delete docs (optional)
rm -rf docs/

# Delete optional MCP files
rm mcp-server/locustfile.py
rm mcp-server/production_checks.py
rm mcp-server/test_hardening.py
rm mcp-server/server_hardened_example.py
rm mcp-server/test-email.py

# Delete install scripts
rm install-*.bat
```

---

## ✅ After Cleanup

Your project structure will be:

```
CodeSunny/
├── src/                    # Frontend ✅
├── backend/                # Backend ✅
├── mcp-server/            # AI Server ✅
│   ├── server.py
│   ├── session_manager.py
│   ├── intent_router.py
│   ├── tool_flows.py
│   ├── llm_handler.py
│   ├── .env
│   └── data/
├── package.json           # Dependencies ✅
├── .gitignore            # Git rules ✅
├── README.md             # Main readme ✅
└── start-all.bat         # Quick start ✅
```

**Clean, minimal, production-ready!** 🚀

---

## 📝 Summary

### Can Delete:

- ✅ `docs/` folder (all documentation)
- ✅ Test files (already in docs/tests)
- ✅ Optional MCP tools
- ✅ Install scripts (except start-all.bat)

### Must Keep:

- ❌ Core application files
- ❌ Configuration files
- ❌ Data folders

### Result:

- Clean project structure
- Smaller size
- Production-ready
- Easy to deploy

---

**Recommendation:** Keep `docs/` folder for reference, delete only if space is critical.

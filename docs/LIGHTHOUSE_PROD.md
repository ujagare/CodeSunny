# Production Lighthouse Setup (Correct Scores)

Use this for accurate Lighthouse results. Dev server scores are not reliable.

## 1) Start Production Preview
```bash
npm run lighthouse:prep
```

This will:
1. Build the app
2. Serve it at `http://127.0.0.1:4173`

## 2) Run Lighthouse
1. Open Chrome
2. Go to `http://127.0.0.1:4173`
3. Open DevTools → Lighthouse
4. Run **Mobile** and **Desktop**

## Notes
- Keep other tabs closed.
- Use an incognito window for clean results.
- Scores in production are the real scores.

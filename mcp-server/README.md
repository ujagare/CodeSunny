# CodeSunny MCP Server

This is a minimal MCP server for CodeSunny with `search`, `fetch`, `chat`,
and `create_lead` tools.

## Run locally

```bash
pip install -r mcp-server/requirements.txt
python mcp-server/server.py
```

The server runs on `http://localhost:8000` by default.
The MCP endpoint is available at `/mcp`.

## Render deploy

Create a new Web Service in Render and use:

- Build Command: `pip install -r mcp-server/requirements.txt`
- Start Command: `python mcp-server/server.py`
- Environment: `PYTHON_VERSION` (optional, e.g. `3.11.8`)

Render will inject the `PORT` environment variable automatically.
The MCP endpoint will be `https://<your-service>.onrender.com/mcp`.

## Required env vars (Render)

- `OPENAI_API_KEY` (secret)
- `OPENAI_MODEL` (example: `gpt-4.1-mini` or your preferred model)

## Optional env vars (lead email automation)

- `SMTP_HOST`
- `SMTP_PORT` (default 587)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `LEADS_EMAIL_TO`

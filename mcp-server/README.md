# CodeSunny MCP Server

This is a minimal MCP server for CodeSunny with `search` and `fetch` tools
(plus a placeholder `create_lead` tool).

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

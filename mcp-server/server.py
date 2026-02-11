from mcp.server.fastmcp import FastMCP
import json
import os
from pathlib import Path
import re

DATA_PATH = Path(__file__).parent / "data" / "site_index.json"


def load_docs():
    if not DATA_PATH.exists():
        return []
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip().lower()


mcp = FastMCP("CodeSunny MCP")


@mcp.tool()
def search(query: str):
    """Search CodeSunny site pages."""
    docs = load_docs()
    q = normalize(query)
    if not q:
        results = []
    else:
        ranked = []
        for doc in docs:
            hay = normalize(f"{doc.get('title','')} {doc.get('text','')}")
            score = hay.count(q)
            if score > 0:
                ranked.append((score, doc))
        ranked.sort(key=lambda x: x[0], reverse=True)
        results = [
            {"id": d[1]["id"], "title": d[1]["title"], "url": d[1]["url"]}
            for d in ranked[:5]
        ]

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps({"results": results}),
            }
        ]
    }


@mcp.tool()
def fetch(id: str):
    """Fetch a page by id."""
    docs = load_docs()
    doc = next((d for d in docs if d.get("id") == id), None)
    if not doc:
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({"error": "not_found", "id": id}),
                }
            ]
        }

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps(doc),
            }
        ]
    }


@mcp.tool()
def create_lead(name: str, email: str, message: str = ""):
    """Capture a lead (placeholder)."""
    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps(
                    {
                        "status": "received",
                        "name": name,
                        "email": email,
                        "message": message,
                    }
                ),
            }
        ]
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    # Streamable HTTP (recommended for deployments). Endpoint: /mcp
    mcp.run(transport="http", host="0.0.0.0", port=port)

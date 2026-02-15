"""
Session Manager - Persistent Memory for Chatbot
Handles user state, conversation history, and context
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Optional
from pathlib import Path
import json

# In-memory store (replace with Redis in production)
SESSION_STORE: Dict[str, dict] = {}

# Session data directory
SESSION_DIR = Path(__file__).parent / "data" / "sessions"
SESSION_DIR.mkdir(exist_ok=True, parents=True)


def generate_session_id() -> str:
    """Generate unique session ID"""
    return str(uuid.uuid4())


def get_session(session_id: str) -> dict:
    """
    Get or create session
    
    Returns:
        Session dict with state, history, and metadata
    """
    if not session_id:
        session_id = generate_session_id()
    
    if session_id not in SESSION_STORE:
        # Try to load from disk
        session_file = SESSION_DIR / f"{session_id}.json"
        if session_file.exists():
            with open(session_file, 'r') as f:
                SESSION_STORE[session_id] = json.load(f)
        else:
            # Create new session
            SESSION_STORE[session_id] = {
                "session_id": session_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_active": datetime.now(timezone.utc).isoformat(),
                
                # State tracking
                "stage": None,  # current conversation stage
                "intent": None,  # detected intent
                
                # User data
                "business_type": None,
                "budget_range": None,
                "timeline": None,
                "services_interested": [],
                
                # Action flags
                "meeting_requested": False,
                "quote_requested": False,
                "seo_audit_requested": False,
                "image_requested": False,
                "lead_captured": False,
                
                # Conversation history (last 10 messages)
                "history": [],
                
                # Metadata
                "message_count": 0,
                "tools_used": []
            }
    
    # Update last active
    SESSION_STORE[session_id]["last_active"] = datetime.now(timezone.utc).isoformat()
    
    return SESSION_STORE[session_id]


def update_session(session_id: str, key: str, value) -> None:
    """Update session field"""
    if session_id in SESSION_STORE:
        SESSION_STORE[session_id][key] = value
        save_session(session_id)


def add_to_history(session_id: str, role: str, content: str) -> None:
    """Add message to conversation history (keep last 10)"""
    session = get_session(session_id)
    session["history"].append({
        "role": role,
        "content": content,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    # Keep only last 10 messages
    if len(session["history"]) > 10:
        session["history"] = session["history"][-10:]
    
    session["message_count"] += 1
    save_session(session_id)


def save_session(session_id: str) -> None:
    """Save session to disk"""
    if session_id in SESSION_STORE:
        session_file = SESSION_DIR / f"{session_id}.json"
        with open(session_file, 'w') as f:
            json.dump(SESSION_STORE[session_id], f, indent=2)


def clear_session(session_id: str) -> None:
    """Clear session data"""
    if session_id in SESSION_STORE:
        del SESSION_STORE[session_id]
    
    session_file = SESSION_DIR / f"{session_id}.json"
    if session_file.exists():
        session_file.unlink()


def get_session_context(session_id: str) -> str:
    """Get formatted session context for LLM"""
    session = get_session(session_id)
    
    context_parts = []
    
    if session["business_type"]:
        context_parts.append(f"Business type: {session['business_type']}")
    
    if session["services_interested"]:
        context_parts.append(f"Interested in: {', '.join(session['services_interested'])}")
    
    if session["budget_range"]:
        context_parts.append(f"Budget: {session['budget_range']}")
    
    if session["timeline"]:
        context_parts.append(f"Timeline: {session['timeline']}")
    
    if context_parts:
        return "User context: " + " | ".join(context_parts)
    
    return ""


# ============================================================================
# REDIS INTEGRATION (for production)
# ============================================================================

"""
For production, replace in-memory store with Redis:

import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_session(session_id: str) -> dict:
    data = redis_client.get(f"session:{session_id}")
    if data:
        return json.loads(data)
    else:
        # Create new session
        session = {...}
        redis_client.setex(f"session:{session_id}", 3600, json.dumps(session))
        return session

def update_session(session_id: str, key: str, value):
    session = get_session(session_id)
    session[key] = value
    redis_client.setex(f"session:{session_id}", 3600, json.dumps(session))
"""

print("✅ Session Manager Loaded")
print(f"   - Session storage: {SESSION_DIR}")
print("   - In-memory cache active")
print("   - Ready for Redis upgrade")

"""
Social Media Automation - Multi-Platform Posting & Engagement
Supports: LinkedIn, Twitter/X, Facebook, Instagram
"""

import os
import json
import time
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

# Data storage
DATA_DIR = Path(__file__).parent / "data"
POSTS_LOG = DATA_DIR / "social_posts.json"
ENGAGEMENT_LOG = DATA_DIR / "social_engagement.json"

# AI clients
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    )


def ensure_data_dir():
    """Create data directory if not exists"""
    DATA_DIR.mkdir(exist_ok=True)
    if not POSTS_LOG.exists():
        POSTS_LOG.write_text("[]", encoding="utf-8")
    if not ENGAGEMENT_LOG.exists():
        ENGAGEMENT_LOG.write_text("[]", encoding="utf-8")


def generate_post_content(topic, platform="linkedin", tone="professional"):
    """Generate AI-powered social media post"""
    platform_limits = {
        "linkedin": 3000,
        "twitter": 280,
        "facebook": 500,
        "instagram": 2200
    }
    
    char_limit = platform_limits.get(platform, 500)
    
    prompt = f"""
Create a {platform} post about: {topic}

Requirements:
- Tone: {tone}
- Character limit: {char_limit}
- Include relevant hashtags (3-5)
- Add call-to-action
- Professional and engaging
- No fake claims or unsupported stats

Platform: {platform.upper()}
Topic: {topic}

Return ONLY the post text with hashtags.
""".strip()

    try:
        if groq_client:
            resp = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                temperature=0.7,
                max_tokens=300,
                messages=[
                    {"role": "system", "content": "You are a social media content creator."},
                    {"role": "user", "content": prompt}
                ]
            )
            return resp.choices[0].message.content.strip()
        elif gemini_client:
            resp = gemini_client.generate_content(prompt)
            return resp.text.strip()
        else:
            return f"Check out our latest update on {topic}! #CodeSunny #WebDevelopment #DigitalSolutions"
    except Exception as e:
        print(f"❌ AI generation failed: {e}")
        return f"Exciting news about {topic}! Learn more at codesunny.in #CodeSunny"


def post_to_platform(platform, content, image_url=None):
    """
    Post to social media platform
    Note: Requires platform API credentials in .env
    """
    # Placeholder for actual API integration
    # You'll need to add platform-specific API keys
    
    webhook_url = os.environ.get(f"{platform.upper()}_WEBHOOK_URL", "")
    
    if webhook_url:
        try:
            import requests
            payload = {
                "platform": platform,
                "content": content,
                "image_url": image_url,
                "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
            }
            resp = requests.post(webhook_url, json=payload, timeout=10)
            return resp.ok
        except Exception as e:
            print(f"❌ {platform} post failed: {e}")
            return False
    
    # Log post locally
    ensure_data_dir()
    posts = json.loads(POSTS_LOG.read_text(encoding="utf-8"))
    posts.append({
        "platform": platform,
        "content": content,
        "image_url": image_url,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        "status": "pending_manual_post"
    })
    POSTS_LOG.write_text(json.dumps(posts, indent=2), encoding="utf-8")
    
    print(f"✅ Post logged for {platform}")
    print(f"📝 Content: {content[:100]}...")
    return True


def post_to_all_platforms(topic, platforms=None, image_url=None):
    """Post to multiple platforms"""
    if platforms is None:
        platforms = ["linkedin", "twitter", "facebook"]
    
    results = {}
    for platform in platforms:
        print(f"\n📱 Posting to {platform.upper()}...")
        content = generate_post_content(topic, platform)
        success = post_to_platform(platform, content, image_url)
        results[platform] = success
        time.sleep(2)  # Rate limiting
    
    return results


def schedule_post(topic, platforms, schedule_time):
    """Schedule post for later"""
    ensure_data_dir()
    posts = json.loads(POSTS_LOG.read_text(encoding="utf-8"))
    
    for platform in platforms:
        content = generate_post_content(topic, platform)
        posts.append({
            "platform": platform,
            "content": content,
            "scheduled_time": schedule_time,
            "status": "scheduled",
            "created_at": datetime.now(timezone.utc).isoformat() + "Z"
        })
    
    POSTS_LOG.write_text(json.dumps(posts, indent=2), encoding="utf-8")
    print(f"✅ Scheduled {len(platforms)} posts for {schedule_time}")


def auto_engage(mode="view"):
    """
    Auto-engagement (view only for safety)
    For actual engagement, integrate platform APIs
    """
    ensure_data_dir()
    
    engagement_data = {
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        "mode": mode,
        "actions": []
    }
    
    if mode == "view":
        print("📊 Viewing recent engagement opportunities...")
        engagement_data["actions"].append("Viewed mentions and comments")
    
    engagements = json.loads(ENGAGEMENT_LOG.read_text(encoding="utf-8"))
    engagements.append(engagement_data)
    ENGAGEMENT_LOG.write_text(json.dumps(engagements, indent=2), encoding="utf-8")
    
    print(f"✅ Engagement logged: {mode}")


def get_best_posting_times():
    """Return optimal posting times for each platform"""
    return {
        "linkedin": ["09:00", "12:00", "17:00"],  # Business hours
        "twitter": ["08:00", "13:00", "18:00"],   # Peak activity
        "facebook": ["13:00", "15:00", "19:00"],  # Afternoon/evening
        "instagram": ["11:00", "14:00", "20:00"]  # Lunch/evening
    }


if __name__ == "__main__":
    import sys
    
    print("\n🚀 Social Media Automation")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  python social_media_automation.py post <topic>")
        print("  python social_media_automation.py schedule <topic> <datetime>")
        print("  python social_media_automation.py engage")
        print("  python social_media_automation.py times")
        print("\nExamples:")
        print('  python social_media_automation.py post "New AI chatbot feature"')
        print('  python social_media_automation.py schedule "Weekend offer" "2026-03-01 10:00"')
        sys.exit(0)
    
    command = sys.argv[1].lower()
    
    if command == "post":
        if len(sys.argv) < 3:
            print("❌ Topic required")
            sys.exit(1)
        topic = " ".join(sys.argv[2:])
        results = post_to_all_platforms(topic)
        print(f"\n✅ Posted to {sum(results.values())}/{len(results)} platforms")
    
    elif command == "schedule":
        if len(sys.argv) < 4:
            print("❌ Topic and datetime required")
            sys.exit(1)
        topic = sys.argv[2]
        schedule_time = " ".join(sys.argv[3:])
        schedule_post(topic, ["linkedin", "twitter", "facebook"], schedule_time)
    
    elif command == "engage":
        auto_engage("view")
    
    elif command == "times":
        times = get_best_posting_times()
        print("\n⏰ Best Posting Times:")
        for platform, hours in times.items():
            print(f"  {platform.capitalize()}: {', '.join(hours)}")
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)
    
    print("\n✅ Done!\n")

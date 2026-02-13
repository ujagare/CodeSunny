import sys
sys.path.insert(0, 'mcp-server')

from server import chat
import json

# Test chat function
result = chat("what services do you offer?")
response_text = result['content'][0]['text']
data = json.loads(response_text)

print("=" * 60)
print("CHAT RESPONSE TEST")
print("=" * 60)
print(f"\nResponse data: {data}")
print(f"\nReply field exists: {'reply' in data}")
print(f"\nReply content:\n{data.get('reply', 'NO REPLY FIELD!')}")
print("=" * 60)

# MCP Endpoint-wise Test Report

- Generated: 2026-03-01 00:42:10 +05:30
- Backend base URL: http://localhost:5000/api/mcp
- MCP base URL: http://localhost:8001/mcp
- Total tests: 18
- Passed: 13
- Failed: 5

## Summary Table

| Endpoint | Method | HTTP | Result | Notes |
|---|---|---:|---|---|
| /api/mcp/health | GET | 200 | PASS | /O/K/ |
| /api/mcp/search | POST | 200 | PASS | /O/K/ |
| /api/mcp/fetch | POST | 200 | PASS | /O/K/ |
| /api/mcp/chat | POST | 200 | PASS | /O/K/ |
| /api/mcp/lead | POST | 200 | PASS | /O/K/ |
| /api/mcp/web-search | POST | 502 | FAIL | /R/e/q/u/e/s/t/ /f/a/i/l/e/d/ |
| /api/mcp/quote | POST | 200 | PASS | /O/K/ |
| /api/mcp/seo-audit | POST | 200 | PASS | /O/K/ |
| /api/mcp/cloud-calculator | POST | 200 | PASS | /O/K/ |
| /api/mcp/schedule-meeting | POST | 200 | PASS | /O/K/ |
| /api/mcp/proposal | POST | 502 | FAIL | /R/e/q/u/e/s/t/ /f/a/i/l/e/d/ |
| /api/mcp/lead-stage | POST | 502 | FAIL | /R/e/q/u/e/s/t/ /f/a/i/l/e/d/ |
| /api/mcp/pipeline-stats | GET | 502 | FAIL | /R/e/q/u/e/s/t/ /f/a/i/l/e/d/ |
| /api/mcp/dashboard-summary | POST | 502 | FAIL | /R/e/q/u/e/s/t/ /f/a/i/l/e/d/ |
| /api/mcp/health-check | POST | 200 | PASS | /O/K/ |
| /api/mcp/project-status | POST | 200 | PASS | /O/K/ |
| /api/mcp/generate-image | POST | 200 | PASS | /O/K/ |
| /api/mcp/unsubscribe?email=endpoint.test@example.com | GET | 200 | PASS | /O/K/ |

## Sample Responses

### Health - /api/mcp/health
- Method: GET
- HTTP: 200
- Result: PASS
```json
{"status":"ok"}
```

### Search - /api/mcp/search
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\"results\": [{\"id\": \"seo-optimization\", \"title\": \"SEO Optimization\", \"url\": \"https://codesunny.com/services/seo-optimization\"}, {\"id\": \"home\", \"title\": \"CodeSunny - Web Development \u0026 Digital Solutions\", \"url\": \"https://codesunny.com/\"}, {\"id\": \"services\", \"title\": \"CodeSunny Services\", \"url\": \"https://codesunny.com/services\"}, {\"id\": \"digital-marketing\", \"title\": \"Digital Marketing Services\", \"url\": \"https://codesunny.com/services/digital-marketing\"}]}"}]}
```

### Fetch - /api/mcp/fetch
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\"id\": \"home\", \"title\": \"CodeSunny - Web Development \u0026 Digital Solutions\", \"url\": \"https://codesunny.com/\", \"text\": \"CodeSunny is a digital solutions agency offering web development, UI/UX design, digital marketing, e-commerce solutions, SEO optimization, and cloud services.\"}"}]}
```

### Chat - /api/mcp/chat
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"reply":"👋 Hello! I\u0027m CodeSunny\u0027s AI assistant powered by Gemini.\n\nI can help you with:\n🎨 Generate landing page demos\n🔍 SEO audits\n💰 Project quotes\n📅 Schedule consultations\n\nWhat would you like to explore?","session_id":"987af70f-9f24-44bf-a0fd-d6bd1b7c6b79","intent":"greeting","action":null,"confidence":0.95,"success":null,"images":null,"prompt":null,"original_prompt":null,"style":null,"size":null,"message":null,"error":false,"url":null,"overall_score":null,"metrics":null,"priority_actions":null,"estimated_improvement":null,"meeting":null,"quote":null}
```

### Lead - /api/mcp/lead
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\"status\": \"received\", \"emailed\": true, \"mongo_saved\": true, \"mongo_lead_id\": \"69a33dce97ba1e6e18e36ba9\", \"mongo_error\": \"\", \"automation_triggered\": true, \"lead_score\": 49, \"quality\": \"warm\", \"status_stage\": \"new\", \"services_interested\": [\"seo\", \"web\"], \"name\": \"Endpoint Test\", \"email\": \"endpoint.test@example.com\", \"message\": \"Need website and seo quote\"}"}]}
```

### Web Search - /api/mcp/web-search
- Method: POST
- HTTP: 502
- Result: FAIL
```json
{"error":"Invalid tool payload"}
```

### Quote - /api/mcp/quote
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"services\": [\n    {\n      \"name\": \"Basic Website\",\n      \"price\": 25000,\n      \"duration\": \"2-3 weeks\",\n      \"features\": [\n        \"5-7 pages\",\n        \"Responsive design\",\n        \"Contact form\",\n        \"Basic SEO\"\n      ]\n    },\n    {\n      \"name\": \"Advanced SEO\",\n      \"price\": 35000,\n      \"duration\": \"3 months\",\n      \"features\": [\n        \"Complete SEO audit\",\n        \"Content optimization\",\n        \"Link building\",\n        \"Monthly reports\",\n        \"Competitor analysis\"\n      ]\n    }\n  ],\n  \"total_price\": 60000,\n  \"estimated_duration\": \"6-12 weeks (depending on complexity)\",\n  \"recommendations\": [\n    \"SEO works best with ongoing optimization\",\n    \"Bundle discount: \\u20b96,000 off!\",\n    \"Consider monthly maintenance for \\u20b95,000/month\"\n  ],\n  \"discount\": 6000,\n  \"final_price\": 54000,\n  \"google_sheets_logged\": true\n}"}]}
```

### SEO Audit - /api/mcp/seo-audit
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"source\": \"fallback\",\n  \"url\": \"https://codesunny.in\",\n  \"overall_score\": 72,\n  \"metrics\": {\n    \"performance\": {\n      \"score\": 65,\n      \"issues\": [\n        \"Unable to fetch live Google PageSpeed data\"\n      ],\n      \"recommendations\": [\n        \"Re-run with a valid public URL and API key\"\n      ]\n    },\n    \"seo\": {\n      \"score\": 78,\n      \"issues\": [\n        \"Live SEO checks unavailable right now\"\n      ],\n      \"recommendations\": [\n        \"Retry after checking API key and URL reachability\"\n      ]\n    },\n    \"mobile\": {\n      \"score\": 85,\n      \"issues\": [],\n      \"recommendations\": [\n        \"Validate mobile usability in Search Console\"\n      ]\n    },\n    \"security\": {\n      \"score\": 90,\n      \"issues\": [],\n      \"recommendations\": [\n        \"Verify HTTPS and security headers\"\n      ]\n    }\n  },\n  \"priority_actions\": [\n    \"- Verify GOOGLE_PAGESPEED_API_KEY\",\n    \"- Ensure URL is publicly accessible\",\n    \"- Retry audit\"\n  ],\n  \"estimated_improvement\": \"Live audit unavailable; fallback report generated.\",\n  \"cta\": \"Google ... (truncated)
```

### Cloud Calculator - /api/mcp/cloud-calculator
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"recommended_plan\": {\n    \"name\": \"Startup Plan\",\n    \"monthly_cost\": 5000,\n    \"specs\": {\n      \"server\": \"2 vCPU, 4GB RAM\",\n      \"storage\": \"50GB SSD\",\n      \"bandwidth\": \"1TB/month\",\n      \"ssl\": \"Free SSL certificate\",\n      \"backup\": \"Daily backups\"\n    },\n    \"suitable_for\": \"Up to 10,000 monthly visitors\"\n  },\n  \"expected_traffic\": \"10,000\",\n  \"region\": \"asia\",\n  \"setup_cost\": 20000,\n  \"first_year_cost\": 80000,\n  \"benefits\": [\n    \"99.9% uptime guarantee\",\n    \"Free SSL certificate\",\n    \"Automatic backups\",\n    \"24/7 technical support\",\n    \"Easy scaling as you grow\"\n  ],\n  \"next_steps\": [\n    \"1. Share your project requirements\",\n    \"2. We\u0027ll create a custom architecture diagram\",\n    \"3. Setup and deployment in 1 week\",\n    \"4. Free 1-month monitoring included\"\n  ]\n}"}]}
```

### Schedule Meeting - /api/mcp/schedule-meeting
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"status\": \"scheduled\",\n  \"provider\": \"google_calendar\",\n  \"booking_link\": \"https://codesunny.com/book-call\",\n  \"event_link\": \"\",\n  \"meet_link\": \"\",\n  \"message\": \"Consultation scheduled via Google Calendar.\"\n}"}]}
```

### Proposal PDF - /api/mcp/proposal
- Method: POST
- HTTP: 502
- Result: FAIL
```json
{"error":"Invalid tool payload"}
```

### Lead Stage - /api/mcp/lead-stage
- Method: POST
- HTTP: 502
- Result: FAIL
```json
{"error":"Invalid tool payload"}
```

### Pipeline Stats - /api/mcp/pipeline-stats
- Method: GET
- HTTP: 502
- Result: FAIL
```json
{"error":"Invalid tool payload"}
```

### Dashboard Summary - /api/mcp/dashboard-summary
- Method: POST
- HTTP: 502
- Result: FAIL
```json
{"error":"Invalid tool payload"}
```

### Health Check - /api/mcp/health-check
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"domain\": \"codesunny.in\",\n  \"checked_at\": \"2026-02-28T19:12:05.703781+00:00Z\",\n  \"status\": \"down\",\n  \"checks\": {\n    \"reachability\": {\n      \"status\": \"\\u2717 Offline\",\n      \"message\": \"Server is not reachable\"\n    }\n  },\n  \"message\": \"Cannot connect to server\"\n}"}]}
```

### Project Status - /api/mcp/project-status
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"project_found\": false,\n  \"message\": \"Project not found. Please provide your project ID or contact our team.\",\n  \"contact\": \"projects@codesunny.com\"\n}"}]}
```

### Generate Image - /api/mcp/generate-image
- Method: POST
- HTTP: 200
- Result: PASS
```json
{"content":[{"type":"text","text":"{\n  \"success\": true,\n  \"prompt\": \"\\\"Generate a modern website hero banner for a software company, featuring a high-tech background with a subtle gradient of blues and whites, a prominent headline in a clean sans-serif font such as Open Sans or Montserrat, a brief tagline or supporting text in a smaller font size, and a visually appealing call-to-action button in a bright and contrasting color, with a focal point such as a simple illustration or icon representing innovation, coding, or data analysis, and plenty of negative space to create a sense of minimalism and sophistication, optimized for desktop and mobile devices with a responsive design and a maximum file size of 500KB.\\\"\",\n  \"original_prompt\": \"modern website hero banner for software company\",\n  \"style\": \"photo\",\n  \"size\": \"1024x1024\",\n  \"images\": [\n    {\n      \"base64\": \"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAA... (truncated)
```

### Unsubscribe - /api/mcp/unsubscribe?email=endpoint.test@example.com
- Method: GET
- HTTP: 200
- Result: PASS
```json
[[],[[],[[],[[]],[]],[],[[],[[],[[]],[],[[]],[],[[]],[],[[]],[],[[],[[]],[]],[]],[]],[]],[]]
```

## Process Logs (tail)

### mcp-server stderr
```text
Traceback (most recent call last):
  File "C:\Users\ujaga\OneDrive\Desktop\CodeSunny\mcp-server\server.py", line 151, in <module>
    print(f"  - OpenAI: {'\u2713' if openai_client else '\u2717'}")
    ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\ujaga\AppData\Local\Python\pythoncore-3.14-64\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
           ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeEncodeError: 'charmap' codec can't encode character '\u2713' in position 12: character maps to <undefined>
```

### backend stderr
```text
[31mWebSocket server error: Port 24678 is already in use[39m
```

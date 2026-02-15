# 🚀 Advanced System Prompt - Lead Qualification & Conversion Engine

## ✅ Successfully Implemented

Your chatbot now has an **advanced AI system prompt** optimized for:

### 🎯 Core Features

1. **Lead Qualification**

   - Automatically classifies users: Browsing → Interested → Ready → Technical
   - Asks smart qualification questions (max 2 at a time)
   - Identifies budget and timeline

2. **Conversion Optimization**

   - Guides users toward action (quote, call, proposal)
   - Provides value before selling
   - Uses tools proactively (calculate_quote, seo_audit, etc.)

3. **Token Efficiency**

   - Concise responses (3-5 sentences)
   - Structured output with bullet points
   - No unnecessary storytelling

4. **Sales Funnel Push**

   - Always asks forward-moving questions
   - Suggests next steps based on intent
   - Maintains conversation continuity

5. **Out-of-Scope Blocking**

   - Strict service boundary enforcement
   - Polite rejection of non-relevant queries

6. **Intelligent Pricing**
   - Never gives fixed prices without scope
   - Uses calculate_quote() tool for accuracy
   - Mentions pricing depends on features/scale

---

## 📊 How It Works

### Step 1: Identify Intent

```
User Type Classification:
├── Browsing (just looking)
├── Interested (asking questions)
├── Ready to Start (wants quote/timeline)
└── Technical Discussion (needs details)
```

### Step 2: Smart Qualification

```
Max 2 questions at a time:
- What type of business do you run?
- New website or redesign?
- Expected launch timeline?
- Estimated budget range?
```

### Step 3: Provide Value

```
Before selling, suggest:
- Suitable tech stack
- Feature structure
- Growth strategy
```

### Step 4: Move to Action

```
Based on intent:
├── Browsing → Educate + Ask questions
├── Interested → Provide value + Suggest tools
├── Ready → Use calculate_quote() + Offer call
└── Technical → Deep dive + Show expertise
```

---

## 🔧 Technical Implementation

### Location

`mcp-server/server.py` → `chat()` function → `system` variable

### Key Components

1. **Strict Service Scope**

   - Web Development
   - E-commerce
   - UI/UX Design
   - SEO Optimization
   - Digital Marketing
   - Cloud & Hosting
   - AI Automation
   - Image Generation

2. **Tool Integration**

   ```python
   - calculate_quote() → Instant pricing
   - seo_audit() → Free SEO analysis
   - cloud_calculator() → Infrastructure planning
   - generate_image() → Visual creation
   ```

3. **Context Awareness**
   - Reads entire conversation history
   - Maintains continuity
   - Refers back to previous topics
   - No repetitive "How can I help?"

---

## 🎯 Optimization for Fast Inference (Groq/MinMax)

This prompt is optimized for:

- **Groq** (llama-3.3-70b-versatile)
- **MinMax** (abab6.5-chat)
- **OpenAI** (gpt-4o-mini)
- **Gemini** (gemini-pro)

### Why It's Fast

- Short, structured instructions
- Clear decision trees
- Minimal token usage
- No verbose examples

---

## 📈 Expected Results

### Before (Old Prompt)

```
User: "How much for a website?"
Bot: "We offer various services! What type of website?
      We do React, Node.js, full-stack... [long explanation]"
```

### After (New Prompt)

```
User: "How much for a website?"
Bot: "Pricing depends on features and scale.
     Quick questions:
     - What type of business?
     - New site or redesign?

     I can provide an instant quote once I understand your needs."
```

---

## 🔥 Advanced: JSON Output (Optional)

For CRM integration, you can modify the response to return structured JSON:

```json
{
  "reply": "main message for user",
  "intent": "browsing | interested | ready | technical",
  "lead_score": 1-10,
  "recommended_action": "ask_more | schedule_call | send_quote | technical_explanation"
}
```

To enable this, modify the `chat()` function to parse AI response and add metadata.

---

## 🧪 Testing

Test these scenarios:

1. **Browsing User**

   ```
   User: "What do you do?"
   Expected: Brief service list + qualification question
   ```

2. **Interested User**

   ```
   User: "I need a website for my restaurant"
   Expected: Value suggestion + 2 qualification questions
   ```

3. **Ready User**

   ```
   User: "How much for an e-commerce site?"
   Expected: calculate_quote() tool usage + next steps
   ```

4. **Out of Scope**
   ```
   User: "Can you help with my taxes?"
   Expected: Polite rejection + redirect to services
   ```

---

## 📝 Maintenance

To update the system prompt:

1. Edit `mcp-server/server.py`
2. Find the `system = (...)` variable in `chat()` function
3. Modify as needed
4. Restart MCP server

---

## 🎉 Success Metrics

Track these to measure effectiveness:

- Lead qualification rate
- Conversation-to-quote ratio
- Average response length (should be 3-5 sentences)
- Tool usage frequency
- Out-of-scope rejection rate

---

**Status:** ✅ Implemented and Ready
**Last Updated:** Now
**Optimized For:** Groq, MinMax, OpenAI, Gemini

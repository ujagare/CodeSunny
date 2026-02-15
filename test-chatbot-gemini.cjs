// Test Chatbot with Gemini Integration
const axios = require("axios");

const MCP_URL = "http://localhost:8001/mcp";

async function testChat(message) {
  console.log("\n🧪 Testing Chatbot with Gemini...\n");
  console.log(`📨 Sending: "${message}"\n`);

  try {
    const response = await axios.post(
      MCP_URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "chat",
          arguments: {
            message: message,
            session_id: "test-session-" + Date.now(),
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        timeout: 30000,
      },
    );

    if (response.data && response.data.result) {
      const content = response.data.result.content;
      if (content && content[0] && content[0].text) {
        const result = JSON.parse(content[0].text);
        console.log("✅ Response received:\n");
        console.log("🤖 Chatbot:", result.reply);
        console.log("\n📊 Session ID:", result.session_id);

        if (result.action) {
          console.log("🎯 Action:", result.action);
        }

        return result;
      }
    }

    console.log("❌ Unexpected response format");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

// Run tests
async function runTests() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     GEMINI CHATBOT INTEGRATION TEST                     ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  // Test 1: Simple greeting
  await testChat("Hello! What services do you offer?");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 2: Technical question
  await testChat("Tell me about your web development services");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 3: Pricing inquiry
  await testChat("How much does an e-commerce website cost?");

  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║     TEST COMPLETE                                        ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");
}

runTests();

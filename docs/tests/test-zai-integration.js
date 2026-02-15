/**
 * Z.AI Integration Test Script
 * Tests if Z.AI Web Search is properly configured and working
 */

const https = require("https");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testZAIIntegration() {
  log("\n" + "=".repeat(60), "cyan");
  log("🔍 Z.AI Integration Test", "cyan");
  log("=".repeat(60), "cyan");

  // Test 1: Check if backend is running
  log("\n📡 Test 1: Backend Health Check", "blue");
  try {
    const response = await fetch("http://localhost:5000/api/health");
    const data = await response.json();
    if (data.status === "ok") {
      log("  ✅ Backend is running", "green");
    } else {
      log("  ❌ Backend health check failed", "red");
      return;
    }
  } catch (error) {
    log("  ❌ Backend is not running", "red");
    log("  💡 Start backend: cd backend && npm run dev", "yellow");
    return;
  }

  // Test 2: Test Z.AI Web Search endpoint
  log("\n🌐 Test 2: Z.AI Web Search Endpoint", "blue");
  try {
    const response = await fetch("http://localhost:5000/api/mcp/web-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "latest technology trends",
        maxResults: 3,
      }),
    });

    const data = await response.json();

    if (data.error) {
      log("  ❌ Z.AI is NOT configured", "red");
      log(`  📝 Error: ${data.error}`, "yellow");

      if (data.message) {
        log(`  💬 Message: ${data.message}`, "yellow");
      }

      if (data.instructions) {
        log(`  📖 Instructions: ${data.instructions}`, "yellow");
      }

      log("\n  🔧 How to fix:", "cyan");
      log(
        "  1. Get API key from: https://z.ai/manage-apikey/apikey-list",
        "blue",
      );
      log("  2. Edit mcp-server/.env", "blue");
      log("  3. Set: ZAI_API_KEY=your_actual_api_key", "blue");
      log("  4. Restart MCP server", "blue");
    } else if (data.results && data.results.length > 0) {
      log("  ✅ Z.AI is WORKING!", "green");
      log(`  📊 Query: "${data.query}"`, "blue");
      log(`  📈 Results found: ${data.count}`, "blue");
      log("\n  🔍 Sample Results:", "cyan");

      data.results.slice(0, 2).forEach((result, index) => {
        log(`\n  ${index + 1}. ${result.title}`, "green");
        log(`     🔗 ${result.url}`, "blue");
        if (result.summary) {
          const summary = result.summary.substring(0, 100) + "...";
          log(`     📝 ${summary}`, "yellow");
        }
      });
    } else {
      log("  ⚠️  Z.AI configured but no results", "yellow");
      log("  💡 Try a different search query", "blue");
    }
  } catch (error) {
    log("  ❌ Failed to test Z.AI endpoint", "red");
    log(`  📝 Error: ${error.message}`, "yellow");
  }

  // Test 3: Check MCP server
  log("\n🤖 Test 3: MCP Server Check", "blue");
  try {
    const response = await fetch("http://localhost:8001/health");
    if (response.ok) {
      log("  ✅ MCP Server is running", "green");
    } else {
      log("  ❌ MCP Server health check failed", "red");
    }
  } catch (error) {
    log("  ❌ MCP Server is not running", "red");
    log("  💡 Start MCP server: cd mcp-server && python server.py", "yellow");
  }

  // Test 4: Regular search (non-Z.AI)
  log("\n🔎 Test 4: Regular Search (Local)", "blue");
  try {
    const response = await fetch("http://localhost:5000/api/mcp/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "web development" }),
    });

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      log("  ✅ Local search is working", "green");
      log(`  📊 Results found: ${data.results.length}`, "blue");
    } else {
      log("  ⚠️  Local search returned no results", "yellow");
    }
  } catch (error) {
    log("  ❌ Local search failed", "red");
  }

  // Summary
  log("\n" + "=".repeat(60), "cyan");
  log("📊 Test Summary", "cyan");
  log("=".repeat(60), "cyan");
  log("\nZ.AI Integration Status:", "blue");
  log("  - Check the results above", "yellow");
  log("  - If Z.AI is working: ✅ You'll see web search results", "green");
  log("  - If Z.AI is NOT configured: ❌ You'll see error message", "red");
  log("\n💡 Tip: Z.AI is optional. Your chatbot works without it too!", "cyan");
  log("=".repeat(60), "cyan");
}

// Run the test
testZAIIntegration().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

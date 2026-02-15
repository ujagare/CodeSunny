/**
 * Quick Z.AI API Key Test
 * Tests if your Z.AI API key is working
 */

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

async function testZAIKey() {
  log("\n" + "=".repeat(70), "cyan");
  log("🔑 Z.AI API Key Test", "cyan");
  log("=".repeat(70), "cyan");

  // Check if services are running
  log("\n📡 Step 1: Checking if services are running...", "blue");

  try {
    const backendCheck = await fetch("http://localhost:5000/api/health");
    if (backendCheck.ok) {
      log("  ✅ Backend is running (http://localhost:5000)", "green");
    }
  } catch (error) {
    log("  ❌ Backend is NOT running", "red");
    log("  💡 Start backend: cd backend && npm run dev", "yellow");
    log("\n  ⚠️  Cannot test Z.AI without backend running", "yellow");
    return;
  }

  try {
    const mcpCheck = await fetch("http://localhost:8001/health");
    if (mcpCheck.ok) {
      log("  ✅ MCP Server is running (http://localhost:8001)", "green");
    }
  } catch (error) {
    log("  ❌ MCP Server is NOT running", "red");
    log("  💡 Start MCP: cd mcp-server && python server.py", "yellow");
    log("\n  ⚠️  Cannot test Z.AI without MCP server running", "yellow");
    return;
  }

  // Test Z.AI Web Search
  log("\n🌐 Step 2: Testing Z.AI Web Search...", "blue");
  log('  Query: "latest artificial intelligence news"', "cyan");

  try {
    const startTime = Date.now();
    const response = await fetch("http://localhost:5000/api/mcp/web-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "latest artificial intelligence news",
        maxResults: 3,
      }),
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const data = await response.json();

    log(`  ⏱️  Response time: ${responseTime}ms`, "blue");

    if (data.error) {
      log("\n  ❌ Z.AI API Key is NOT working", "red");
      log(`  📝 Error: ${data.error}`, "yellow");

      if (data.message) {
        log(`  💬 Message: ${data.message}`, "yellow");
      }

      // Provide specific troubleshooting
      if (data.error.includes("API key")) {
        log("\n  🔧 Troubleshooting:", "cyan");
        log("  1. Check if API key is correct in mcp-server/.env", "blue");
        log(
          "  2. Verify API key format: should start with letters/numbers",
          "blue",
        );
        log("  3. Check if API key is active on Z.AI dashboard", "blue");
        log("  4. Restart MCP server after changing .env", "blue");
      } else if (data.error.includes("401") || data.error.includes("403")) {
        log("\n  🔧 Authentication Error:", "cyan");
        log("  - API key is invalid or expired", "yellow");
        log(
          "  - Get new key from: https://z.ai/manage-apikey/apikey-list",
          "blue",
        );
      } else if (data.error.includes("timeout")) {
        log("\n  🔧 Timeout Error:", "cyan");
        log("  - Z.AI service might be slow", "yellow");
        log("  - Try again in a few seconds", "blue");
      }
    } else if (data.results && data.results.length > 0) {
      log("\n  ✅ Z.AI API Key is WORKING! 🎉", "green");
      log(`  📊 Query: "${data.query}"`, "blue");
      log(`  📈 Results found: ${data.count}`, "blue");

      log("\n  🔍 Search Results:", "cyan");
      data.results.forEach((result, index) => {
        log(`\n  ${index + 1}. ${result.title}`, "green");
        log(`     🔗 URL: ${result.url}`, "blue");

        if (result.summary) {
          const summary =
            result.summary.length > 150
              ? result.summary.substring(0, 150) + "..."
              : result.summary;
          log(`     📝 ${summary}`, "yellow");
        }

        if (result.siteName) {
          log(`     🌐 Source: ${result.siteName}`, "cyan");
        }
      });

      log("\n  💡 Your Z.AI integration is working perfectly!", "green");
      log("  💡 You can now use web search in your chatbot", "green");
    } else {
      log("\n  ⚠️  Z.AI responded but no results found", "yellow");
      log("  💡 Try a different search query", "blue");
    }
  } catch (error) {
    log("\n  ❌ Failed to test Z.AI", "red");
    log(`  📝 Error: ${error.message}`, "yellow");

    if (error.message.includes("fetch")) {
      log("\n  🔧 Network Error:", "cyan");
      log("  - Check if backend is running", "blue");
      log("  - Check if MCP server is running", "blue");
    }
  }

  // Summary
  log("\n" + "=".repeat(70), "cyan");
  log("📊 Test Complete", "cyan");
  log("=".repeat(70), "cyan");

  log("\n💡 Next Steps:", "blue");
  log("  - If Z.AI is working: You can use web search in your app", "green");
  log(
    "  - If Z.AI is not working: Check the troubleshooting steps above",
    "yellow",
  );
  log("  - Your chatbot works fine even without Z.AI!", "cyan");
  log("\n");
}

// Run the test
testZAIKey().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

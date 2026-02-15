/**
 * Freepik Image Generation Test Script
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

async function testImageGeneration() {
  log("\n" + "=".repeat(70), "cyan");
  log("🎨 Freepik Image Generation Test", "cyan");
  log("=".repeat(70), "cyan");

  // Check services
  log("\n📡 Step 1: Checking services...", "blue");

  try {
    const backendCheck = await fetch("http://localhost:5000/api/health");
    if (backendCheck.ok) {
      log("  ✅ Backend is running", "green");
    }
  } catch (error) {
    log("  ❌ Backend is NOT running", "red");
    log("  💡 Start: start-all.bat", "yellow");
    return;
  }

  // Test image generation
  log("\n🎨 Step 2: Testing image generation...", "blue");
  log('  Prompt: "modern website hero image"', "cyan");
  log("  Style: realistic", "cyan");
  log("  Size: 1024x1024", "cyan");

  try {
    const startTime = Date.now();

    const response = await fetch(
      "http://localhost:5000/api/mcp/generate-image",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "modern website hero image with gradient background",
          style: "digital-art",
          size: "1024x1024",
        }),
      },
    );

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const data = await response.json();

    log(`  ⏱️  Response time: ${responseTime}ms`, "blue");

    if (data.error) {
      log("\n  ❌ Freepik API is NOT configured", "red");
      log(`  📝 Error: ${data.error}`, "yellow");

      if (data.message) {
        log(`  💬 ${data.message}`, "yellow");
      }

      if (data.instructions) {
        log(`  📖 ${data.instructions}`, "blue");
      }

      log("\n  🔧 How to fix:", "cyan");
      log("  1. Get API key: https://www.freepik.com/api", "blue");
      log("  2. Edit mcp-server/.env", "blue");
      log("  3. Set: FREEPIK_API_KEY=your_key", "blue");
      log("  4. Restart MCP server", "blue");
    } else if (data.success && data.images && data.images.length > 0) {
      log("\n  ✅ Image Generated Successfully! 🎉", "green");
      log(`  📝 Original Prompt: "${data.original_prompt}"`, "blue");
      log(
        `  ✨ Enhanced Prompt: "${data.prompt.substring(0, 100)}..."`,
        "cyan",
      );
      log(`  🎨 Style: ${data.style}`, "blue");
      log(`  📐 Size: ${data.size}`, "blue");

      log("\n  🖼️  Generated Images:", "cyan");
      data.images.forEach((img, index) => {
        log(`\n  ${index + 1}. Image URL:`, "green");
        log(`     ${img.url}`, "blue");
        if (img.id) {
          log(`     ID: ${img.id}`, "yellow");
        }
      });

      log(
        "\n  💡 Tip: Copy the URL and open in browser to see the image!",
        "green",
      );
    } else {
      log("\n  ⚠️  Unexpected response format", "yellow");
      log(`  Response: ${JSON.stringify(data, null, 2)}`, "yellow");
    }
  } catch (error) {
    log("\n  ❌ Failed to test image generation", "red");
    log(`  📝 Error: ${error.message}`, "yellow");
  }

  // Test via chat
  log("\n💬 Step 3: Testing via chat bot...", "blue");

  try {
    const response = await fetch("http://localhost:5000/api/mcp/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Can you generate a professional hero image for my website?",
      }),
    });

    const data = await response.json();

    if (data.reply) {
      log("  ✅ Chat bot response:", "green");
      log(`  ${data.reply.substring(0, 200)}...`, "cyan");
    }
  } catch (error) {
    log("  ⚠️  Chat test skipped", "yellow");
  }

  // Summary
  log("\n" + "=".repeat(70), "cyan");
  log("📊 Test Complete", "cyan");
  log("=".repeat(70), "cyan");

  log("\n💡 Next Steps:", "blue");
  log("  - If working: Start using image generation!", "green");
  log("  - If not working: Add Freepik API key to .env", "yellow");
  log("  - Alternative: Use Groq for text, manual images for now", "cyan");
  log("\n");
}

// Run test
testImageGeneration().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

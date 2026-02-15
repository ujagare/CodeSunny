/**
 * Test Image Generation via Chat
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

async function testChatImageGeneration() {
  log("\n" + "=".repeat(70), "cyan");
  log("🎨 Testing Image Generation via Chat", "cyan");
  log("=".repeat(70), "cyan");

  const testMessages = [
    "Generate an image of a modern website hero section",
    "Create an image for my e-commerce store",
    "Make a professional business background image",
    "Can you show me a design for a tech startup?",
  ];

  for (const message of testMessages) {
    log(`\n📝 Testing: "${message}"`, "blue");

    try {
      const response = await fetch("http://localhost:5000/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.reply) {
        log(`  ✅ Got reply: ${data.reply.substring(0, 100)}...`, "green");

        // Check if it's an image generation response
        if (data.reply.includes("🎨") || data.reply.includes("image")) {
          log(`  🎨 Image generation detected!`, "cyan");
        }
      } else if (data.content && data.content[0]) {
        const parsed = JSON.parse(data.content[0].text);

        if (parsed.success && parsed.images) {
          log(`  ✅ Image Generated Successfully!`, "green");
          log(`  📝 Prompt: ${parsed.original_prompt}`, "blue");
          log(`  🎨 Style: ${parsed.style}`, "blue");
          log(`  📐 Size: ${parsed.size}`, "blue");
          log(`  🖼️  Images: ${parsed.images.length}`, "green");

          if (parsed.images[0].base64) {
            log(
              `  💾 Base64 length: ${parsed.images[0].base64.length} chars`,
              "yellow",
            );
          }
        } else if (parsed.reply) {
          log(`  ℹ️  Reply: ${parsed.reply.substring(0, 100)}...`, "yellow");
        }
      }
    } catch (error) {
      log(`  ❌ Error: ${error.message}`, "red");
    }

    // Wait a bit between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  log("\n" + "=".repeat(70), "cyan");
  log("✅ Test Complete", "cyan");
  log("=".repeat(70), "cyan");
  log("\n");
}

testChatImageGeneration().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

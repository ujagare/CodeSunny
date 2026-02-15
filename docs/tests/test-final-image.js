/**
 * Final Comprehensive Image Generation Test
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

async function testFinalImageGeneration() {
  log("\n" + "=".repeat(70), "cyan");
  log("🎨 Final Image Generation Test - All Variations", "cyan");
  log("=".repeat(70), "cyan");

  const testCases = [
    {
      message: "Generate an image of a modern website",
      expected: "SUCCESS",
    },
    {
      message: "Create a hero image for my landing page",
      expected: "SUCCESS",
    },
    {
      message: "Make a professional business background",
      expected: "SUCCESS",
    },
    {
      message: "Show me a design for e-commerce",
      expected: "SUCCESS",
    },
    {
      message: "Generate a picture of a tech startup office",
      expected: "SUCCESS",
    },
    {
      message: "Create a graphic for social media",
      expected: "SUCCESS",
    },
    {
      message: "Make a visual for my presentation",
      expected: "SUCCESS",
    },
    {
      message: "I need a hero image",
      expected: "CHAT_REPLY",
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    log(`\n📝 Testing: "${testCase.message}"`, "blue");

    try {
      const response = await fetch("http://localhost:5000/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testCase.message }),
      });

      const data = await response.json();

      if (data.content && data.content[0]) {
        const parsed = JSON.parse(data.content[0].text);

        if (parsed.success && parsed.images) {
          if (testCase.expected === "SUCCESS") {
            log(`  ✅ PASS - Image generated`, "green");
            log(`     Prompt: ${parsed.original_prompt}`, "blue");
            passed++;
          } else {
            log(`  ❌ FAIL - Expected chat reply, got image`, "red");
            failed++;
          }
        } else if (parsed.reply) {
          if (testCase.expected === "CHAT_REPLY") {
            log(`  ✅ PASS - Chat reply received`, "green");
            passed++;
          } else {
            log(`  ❌ FAIL - Expected image, got chat reply`, "red");
            log(`     Reply: ${parsed.reply.substring(0, 80)}...`, "yellow");
            failed++;
          }
        }
      }
    } catch (error) {
      log(`  ❌ ERROR: ${error.message}`, "red");
      failed++;
    }

    // Wait between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  log("\n" + "=".repeat(70), "cyan");
  log("📊 Test Results", "cyan");
  log("=".repeat(70), "cyan");
  log(`  ✅ Passed: ${passed}/${testCases.length}`, "green");
  log(
    `  ❌ Failed: ${failed}/${testCases.length}`,
    failed > 0 ? "red" : "green",
  );
  log(
    `  📈 Success Rate: ${Math.round((passed / testCases.length) * 100)}%`,
    passed === testCases.length ? "green" : "yellow",
  );
  log("=".repeat(70), "cyan");
  log("\n");

  if (passed === testCases.length) {
    log("🎉 ALL TESTS PASSED! Image generation is working perfectly!", "green");
  } else {
    log("⚠️  Some tests failed. Check the logs above.", "yellow");
  }
}

testFinalImageGeneration().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

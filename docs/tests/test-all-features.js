/**
 * Comprehensive Test - All Features
 */

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAllFeatures() {
  log("\n" + "=".repeat(70), "cyan");
  log("🚀 Comprehensive Feature Test - Image + SEO + Chat", "cyan");
  log("=".repeat(70), "cyan");

  const testCases = [
    {
      category: "Image Generation",
      message: "Generate an image of a modern website",
      expected: "IMAGE",
    },
    {
      category: "Image Generation",
      message: "Create a hero image for my landing page",
      expected: "IMAGE",
    },
    {
      category: "SEO Audit",
      message: "Audit my website https://example.com",
      expected: "SEO",
    },
    {
      category: "SEO Audit",
      message: "Check my site https://codesunny.com",
      expected: "SEO",
    },
    {
      category: "SEO Audit",
      message: "I need an SEO audit",
      expected: "ASK_URL",
    },
    {
      category: "Normal Chat",
      message: "What services do you offer?",
      expected: "CHAT",
    },
    {
      category: "Normal Chat",
      message: "How much does web development cost?",
      expected: "CHAT",
    },
  ];

  let passed = 0;
  let failed = 0;
  const results = {
    "Image Generation": { passed: 0, failed: 0 },
    "SEO Audit": { passed: 0, failed: 0 },
    "Normal Chat": { passed: 0, failed: 0 },
  };

  for (const testCase of testCases) {
    log(`\n[${testCase.category}] Testing: "${testCase.message}"`, "blue");

    try {
      const response = await fetch("http://localhost:5000/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testCase.message }),
      });

      const data = await response.json();

      if (data.content && data.content[0]) {
        const parsed = JSON.parse(data.content[0].text);

        // Check response type
        if (parsed.success && parsed.images) {
          // Image Generation
          if (testCase.expected === "IMAGE") {
            log(`  ✅ PASS - Image generated`, "green");
            log(`     Prompt: ${parsed.original_prompt}`, "blue");
            passed++;
            results[testCase.category].passed++;
          } else {
            log(`  ❌ FAIL - Expected ${testCase.expected}, got IMAGE`, "red");
            failed++;
            results[testCase.category].failed++;
          }
        } else if (parsed.url && parsed.overall_score !== undefined) {
          // SEO Audit
          if (testCase.expected === "SEO") {
            log(`  ✅ PASS - SEO Audit performed`, "green");
            log(`     URL: ${parsed.url}`, "blue");
            log(`     Score: ${parsed.overall_score}/100`, "blue");
            passed++;
            results[testCase.category].passed++;
          } else {
            log(`  ❌ FAIL - Expected ${testCase.expected}, got SEO`, "red");
            failed++;
            results[testCase.category].failed++;
          }
        } else if (parsed.reply) {
          // Chat Reply
          const isAskingForUrl = parsed.reply
            .toLowerCase()
            .includes("website url");

          if (testCase.expected === "ASK_URL" && isAskingForUrl) {
            log(`  ✅ PASS - Asked for URL`, "green");
            passed++;
            results[testCase.category].passed++;
          } else if (testCase.expected === "CHAT") {
            log(`  ✅ PASS - Chat reply received`, "green");
            log(`     Reply: ${parsed.reply.substring(0, 60)}...`, "blue");
            passed++;
            results[testCase.category].passed++;
          } else {
            log(`  ❌ FAIL - Expected ${testCase.expected}, got CHAT`, "red");
            log(`     Reply: ${parsed.reply.substring(0, 60)}...`, "yellow");
            failed++;
            results[testCase.category].failed++;
          }
        }
      }
    } catch (error) {
      log(`  ❌ ERROR: ${error.message}`, "red");
      failed++;
      results[testCase.category].failed++;
    }

    // Wait between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Print category-wise results
  log("\n" + "=".repeat(70), "cyan");
  log("📊 Category-wise Results", "cyan");
  log("=".repeat(70), "cyan");

  for (const [category, result] of Object.entries(results)) {
    const total = result.passed + result.failed;
    const rate = total > 0 ? Math.round((result.passed / total) * 100) : 0;
    const color = rate === 100 ? "green" : rate >= 50 ? "yellow" : "red";

    log(
      `\n${category}:`,
      rate === 100 ? "green" : rate >= 50 ? "yellow" : "red",
    );
    log(`  ✅ Passed: ${result.passed}/${total}`, "green");
    log(
      `  ❌ Failed: ${result.failed}/${total}`,
      result.failed > 0 ? "red" : "green",
    );
    log(`  📈 Success Rate: ${rate}%`, color);
  }

  // Print overall results
  log("\n" + "=".repeat(70), "cyan");
  log("📊 Overall Results", "cyan");
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
    log("🎉 ALL TESTS PASSED! All features working perfectly!", "green");
    log("✅ Image Generation: Working", "green");
    log("✅ SEO Audit: Working", "green");
    log("✅ Normal Chat: Working", "green");
  } else {
    log("⚠️  Some tests failed. Check the logs above.", "yellow");
  }
}

testAllFeatures().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

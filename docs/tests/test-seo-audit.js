/**
 * Test SEO Audit via Chat
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

async function testSEOAudit() {
  log("\n" + "=".repeat(70), "cyan");
  log("🔍 Testing SEO Audit via Chat", "cyan");
  log("=".repeat(70), "cyan");

  const testCases = [
    {
      message: "Can you audit my website https://example.com",
      expected: "SEO_AUDIT",
    },
    {
      message: "SEO audit for https://codesunny.com",
      expected: "SEO_AUDIT",
    },
    {
      message: "Check my site https://google.com",
      expected: "SEO_AUDIT",
    },
    {
      message: "Analyze my website https://github.com",
      expected: "SEO_AUDIT",
    },
    {
      message: "I need an SEO audit",
      expected: "ASK_URL",
    },
    {
      message: "Can you check my SEO?",
      expected: "ASK_URL",
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

        if (parsed.url && parsed.overall_score !== undefined) {
          // SEO Audit response
          if (testCase.expected === "SEO_AUDIT") {
            log(`  ✅ PASS - SEO Audit performed`, "green");
            log(`     URL: ${parsed.url}`, "blue");
            log(`     Score: ${parsed.overall_score}/100`, "blue");
            log(
              `     Performance: ${parsed.metrics.performance.score}/100`,
              "blue",
            );
            log(`     SEO: ${parsed.metrics.seo.score}/100`, "blue");
            passed++;
          } else {
            log(
              `  ❌ FAIL - Expected ${testCase.expected}, got SEO audit`,
              "red",
            );
            failed++;
          }
        } else if (parsed.reply) {
          // Chat reply
          if (testCase.expected === "ASK_URL") {
            log(`  ✅ PASS - Asked for URL`, "green");
            log(`     Reply: ${parsed.reply.substring(0, 80)}...`, "blue");
            passed++;
          } else {
            log(
              `  ❌ FAIL - Expected ${testCase.expected}, got chat reply`,
              "red",
            );
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
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    log("🎉 ALL TESTS PASSED! SEO Audit is working perfectly!", "green");
  } else {
    log("⚠️  Some tests failed. Check the logs above.", "yellow");
  }
}

testSEOAudit().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

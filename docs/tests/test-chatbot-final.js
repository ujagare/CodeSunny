const API_URL = process.env.VITE_API_URL || "http://localhost:3000";

console.log(
  "\n======================================================================",
);
console.log("🤖 FINAL CHATBOT TEST - Image Generation & SEO Audit");
console.log(
  "======================================================================\n",
);

async function testChat(message, expectedType) {
  console.log(`\n📝 Testing: "${message}"`);
  console.log(`   Expected: ${expectedType}`);

  try {
    const response = await fetch(`${API_URL}/api/mcp/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`   ❌ FAIL - HTTP ${response.status}`);
      console.log(`   Error: ${JSON.stringify(data)}`);
      return false;
    }

    // Parse the response - data should be the direct payload now
    let reply = data.reply;

    // Check for image data
    if (data.success && data.images && data.images.length > 0) {
      console.log(`   ✅ PASS - Image Generated`);
      console.log(`      Prompt: ${data.prompt}`);
      console.log(`      Style: ${data.style}`);
      console.log(`      Images: ${data.images.length}`);
      if (data.images[0].base64) {
        console.log(
          `      Base64 length: ${data.images[0].base64.length} chars`,
        );
      }
      return expectedType === "image";
    }

    // Check for SEO data
    if (data.url && data.overall_score && data.metrics) {
      console.log(`   ✅ PASS - SEO Audit Performed`);
      console.log(`      URL: ${data.url}`);
      console.log(`      Overall Score: ${data.overall_score}/100`);
      console.log(`      Performance: ${data.metrics.performance.score}/100`);
      console.log(`      SEO: ${data.metrics.seo.score}/100`);
      console.log(`      Mobile: ${data.metrics.mobile.score}/100`);
      console.log(`      Security: ${data.metrics.security.score}/100`);
      return expectedType === "seo";
    }

    // If we got here, it's a text reply
    console.log(
      `   ℹ️  Text Reply: ${reply ? reply.substring(0, 100) : "No reply"}...`,
    );
    return expectedType === "text";
  } catch (error) {
    console.log(`   ❌ FAIL - ${error.message}`);
    return false;
  }
}

async function runTests() {
  const tests = [
    // Image Generation Tests
    {
      message: "Generate an image of a modern website hero section",
      type: "image",
    },
    { message: "Create an image for my e-commerce store", type: "image" },
    { message: "Make a professional business background", type: "image" },
    { message: "Show me a design for a tech startup", type: "image" },

    // SEO Audit Tests
    { message: "Can you audit my website https://example.com", type: "seo" },
    { message: "SEO audit for https://codesunny.com", type: "seo" },
    { message: "Check my site https://google.com", type: "seo" },
    { message: "Analyze my website https://github.com", type: "seo" },

    // Text Reply Tests
    { message: "What services do you offer?", type: "text" },
    { message: "How much does a website cost?", type: "text" },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testChat(test.message, test.type);
    if (result) {
      passed++;
    } else {
      failed++;
    }

    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(
    "\n======================================================================",
  );
  console.log("📊 TEST RESULTS");
  console.log(
    "======================================================================",
  );
  console.log(`  ✅ Passed: ${passed}/${tests.length}`);
  console.log(`  ❌ Failed: ${failed}/${tests.length}`);
  console.log(
    `  📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`,
  );
  console.log(
    "======================================================================\n",
  );

  if (failed === 0) {
    console.log("🎉 ALL TESTS PASSED! Chatbot is working perfectly!\n");
  } else {
    console.log("⚠️  Some tests failed. Please check the logs above.\n");
  }
}

runTests().catch(console.error);

const API_URL = "http://localhost:5000";

console.log("\n🧪 Testing All Chatbot Tools\n");

async function testTool(message, expectedFeature) {
  console.log(`\n📝 Testing: "${message}"`);
  console.log(`   Expected: ${expectedFeature}`);

  try {
    const response = await fetch(`${API_URL}/api/mcp/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    console.log(
      `   Response:`,
      JSON.stringify(data, null, 2).substring(0, 300) + "...",
    );

    // Check what we got
    if (data.url && data.overall_score) {
      console.log(`   ✅ SEO Audit Working`);
      return "seo";
    } else if (data.success && data.images) {
      console.log(`   ✅ Image Generation Working`);
      return "image";
    } else if (data.services && data.total_price) {
      console.log(`   ✅ Quote Calculator Working`);
      return "quote";
    } else if (data.reply) {
      console.log(`   ℹ️  Text Reply: ${data.reply.substring(0, 100)}...`);
      return "text";
    } else {
      console.log(`   ❌ Unknown Response Format`);
      return "unknown";
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return "error";
  }
}

async function runTests() {
  const tests = [
    // Image Generation
    { msg: "Generate an image of a sunset", expected: "image" },
    { msg: "Create a professional business background", expected: "image" },

    // SEO Audit
    { msg: "SEO audit for https://example.com", expected: "seo" },
    { msg: "Check my site https://google.com", expected: "seo" },

    // Quote Calculator
    { msg: "How much for an ecommerce website?", expected: "quote" },
    { msg: "Give me a quote for web development and SEO", expected: "quote" },

    // Cloud Calculator
    { msg: "I need cloud hosting for 50000 visitors", expected: "cloud" },

    // General Chat
    { msg: "What services do you offer?", expected: "text" },
  ];

  console.log("\n" + "=".repeat(70));
  console.log("🚀 Starting Comprehensive Tool Tests");
  console.log("=".repeat(70));

  for (const test of tests) {
    await testTool(test.msg, test.expected);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(70));
  console.log("✅ Tests Complete");
  console.log("=".repeat(70) + "\n");
}

runTests().catch(console.error);

/**
 * Manual Test - Step by Step
 */

async function test(message) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Testing: "${message}"`);
  console.log("=".repeat(70));

  try {
    const response = await fetch("http://localhost:5000/api/mcp/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    console.log("\nResponse:");
    console.log(JSON.stringify(data, null, 2));

    if (data.content && data.content[0]) {
      const parsed = JSON.parse(data.content[0].text);
      console.log("\nParsed Content:");
      console.log(JSON.stringify(parsed, null, 2));

      // Check type
      if (parsed.success && parsed.images) {
        console.log("\n✅ Type: IMAGE GENERATION");
        console.log(`   Prompt: ${parsed.original_prompt}`);
        console.log(`   Images: ${parsed.images.length}`);
      } else if (parsed.url && parsed.overall_score !== undefined) {
        console.log("\n✅ Type: SEO AUDIT");
        console.log(`   URL: ${parsed.url}`);
        console.log(`   Score: ${parsed.overall_score}/100`);
      } else if (parsed.reply) {
        console.log("\n✅ Type: CHAT REPLY");
        console.log(`   Reply: ${parsed.reply.substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

async function runTests() {
  console.log("\n🧪 Manual Testing - Step by Step\n");

  // Test 1: Image Generation
  await test("Generate an image of a modern website");
  await new Promise((r) => setTimeout(r, 2000));

  // Test 2: SEO Audit with URL
  await test("Audit my website https://example.com");
  await new Promise((r) => setTimeout(r, 2000));

  // Test 3: SEO Audit without URL
  await test("I need an SEO audit");
  await new Promise((r) => setTimeout(r, 2000));

  // Test 4: Normal Chat
  await test("What services do you offer?");

  console.log("\n\n✅ All manual tests completed!\n");
}

runTests().catch(console.error);

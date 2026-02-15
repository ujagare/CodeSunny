const API_URL = "http://localhost:5000";

console.log("\n🎨 ========== QUICK IMAGE GENERATION TEST ==========\n");

async function testImage() {
  console.log('📝 Sending: "Generate a professional website hero image"\n');
  console.log("⏳ Please wait 5-10 seconds...\n");

  const startTime = Date.now();

  try {
    const response = await fetch(`${API_URL}/api/mcp/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Generate a professional website hero image",
      }),
    });

    const data = await response.json();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`⏱️  Response time: ${duration} seconds\n`);

    // Check if it's an image response
    if (data.success && data.images && data.images.length > 0) {
      console.log("✅ IMAGE GENERATED SUCCESSFULLY!\n");
      console.log("📊 Details:");
      console.log("   Style:", data.style);
      console.log("   Size:", data.size);
      console.log("   Prompt:", data.prompt.substring(0, 100) + "...");
      console.log("   Original:", data.original_prompt);
      console.log("\n📦 Image Data:");

      if (data.images[0].base64) {
        const base64Length = data.images[0].base64.length;
        const sizeKB = ((base64Length * 0.75) / 1024).toFixed(2);
        console.log("   Format: Base64");
        console.log("   Length:", base64Length, "characters");
        console.log("   Size: ~" + sizeKB + " KB");
        console.log("\n💡 Image is ready to display in browser!");
        console.log(
          "   Preview: data:image/jpeg;base64," +
            data.images[0].base64.substring(0, 50) +
            "...",
        );
      } else if (data.images[0].url) {
        console.log("   Format: URL");
        console.log("   URL:", data.images[0].url);
      }

      console.log("\n🎉 Test PASSED! Image generation is working perfectly!");
      console.log("📱 Now try in browser chatbot:\n");
      console.log("   1. Open http://localhost:5173");
      console.log('   2. Click "Chat with AI" button');
      console.log('   3. Type: "Generate an image of a sunset"');
      console.log("   4. Wait 5-10 seconds");
      console.log("   5. Image will appear in chat!\n");
    } else if (data.reply) {
      console.log("ℹ️  Got text reply instead of image:");
      console.log("   ", data.reply.substring(0, 200));
      console.log("\n⚠️  Image generation might not be triggered.");
      console.log(
        "   Make sure your message contains image generation keywords.",
      );
    } else {
      console.log("❌ UNEXPECTED RESPONSE:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log(
      "   1. Is backend server running? (npm start in backend folder)",
    );
    console.log(
      "   2. Is MCP server running? (python server.py in mcp-server folder)",
    );
    console.log("   3. Check Freepik API key in mcp-server/.env");
  }
}

testImage();

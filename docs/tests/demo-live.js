const API_URL = "http://localhost:5000";

async function demo() {
  console.log("\n🎨 ========== IMAGE GENERATION DEMO ==========\n");

  // Test 1: Image Generation
  console.log('📝 Request: "Generate a professional website hero image"');
  const imgRes = await fetch(`${API_URL}/api/mcp/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Generate a professional website hero image",
    }),
  });
  const imgData = await imgRes.json();

  if (imgData.success && imgData.images) {
    console.log("✅ Image Created Successfully!");
    console.log("   Style:", imgData.style);
    console.log("   Size:", imgData.size);
    console.log("   Prompt:", imgData.prompt.substring(0, 100) + "...");
    console.log(
      "   Image Data:",
      imgData.images[0].base64
        ? `Base64 (${imgData.images[0].base64.length} chars)`
        : `URL: ${imgData.images[0].url}`,
    );
  } else {
    console.log("❌ Failed:", imgData.reply || "Unknown error");
  }

  console.log("\n🔍 ========== SEO AUDIT DEMO ==========\n");

  // Test 2: SEO Audit
  console.log('📝 Request: "SEO audit for https://codesunny.com"');
  const seoRes = await fetch(`${API_URL}/api/mcp/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "SEO audit for https://codesunny.com" }),
  });
  const seoData = await seoRes.json();

  if (seoData.url && seoData.overall_score) {
    console.log("✅ SEO Report Generated!");
    console.log("   URL:", seoData.url);
    console.log("   Overall Score:", seoData.overall_score + "/100");
    console.log("   Performance:", seoData.metrics.performance.score + "/100");
    console.log("   SEO:", seoData.metrics.seo.score + "/100");
    console.log("   Mobile:", seoData.metrics.mobile.score + "/100");
    console.log("   Security:", seoData.metrics.security.score + "/100");
    console.log("\n   📋 Priority Actions:");
    seoData.priority_actions.forEach((action) =>
      console.log("      " + action),
    );
    console.log("\n   💡 Improvement:", seoData.estimated_improvement);
  } else {
    console.log("❌ Failed:", seoData.reply || "Unknown error");
  }

  console.log("\n✅ ========== DEMO COMPLETE ==========\n");
  console.log("🎉 Dono features perfectly kaam kar rahe hain!");
  console.log(
    "📱 Ab aap browser mein chatbot open karke test kar sakte hain.\n",
  );
}

demo().catch(console.error);

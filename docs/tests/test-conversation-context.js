const API_URL = "http://localhost:5000";

console.log("\n🗣️  Testing Conversation Context\n");

async function chat(message, context = null) {
  const response = await fetch(`${API_URL}/api/mcp/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });

  const data = await response.json();
  return data.reply || JSON.stringify(data);
}

async function testConversation() {
  console.log("=".repeat(70));
  console.log("Simulating Multi-Turn Conversation");
  console.log("=".repeat(70));

  // Turn 1
  console.log("\n👤 User: Tell me about cloud solutions");
  const reply1 = await chat("Tell me about cloud solutions");
  console.log("🤖 Bot:", reply1.substring(0, 200) + "...\n");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Turn 2 - With context
  const context1 = `User: Tell me about cloud solutions\nAssistant: ${reply1}`;
  console.log("👤 User: Yes, I want to know more");
  const reply2 = await chat("Yes, I want to know more", context1);
  console.log("🤖 Bot:", reply2.substring(0, 200) + "...\n");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Turn 3 - With more context
  const context2 = `${context1}\nUser: Yes, I want to know more\nAssistant: ${reply2}`;
  console.log("👤 User: How much does it cost?");
  const reply3 = await chat("How much does it cost?", context2);
  console.log("🤖 Bot:", reply3.substring(0, 200) + "...\n");

  console.log("=".repeat(70));
  console.log("✅ Conversation Context Test Complete");
  console.log("=".repeat(70));
  console.log("\nNow the bot should remember previous messages!");
  console.log(
    "Try in browser: Ask about cloud, then say 'yes' or 'tell me more'\n",
  );
}

testConversation().catch(console.error);

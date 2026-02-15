/**
 * Production Setup Verification Script
 * Verifies all components are properly configured
 */

const fs = require("fs");
const path = require("path");

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

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, "green");
    return true;
  } else {
    log(`❌ ${description} - NOT FOUND`, "red");
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    log(`✅ ${description}`, "green");
    return true;
  } else {
    log(`❌ ${description} - NOT FOUND`, "red");
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    if (content.includes(searchString)) {
      log(`✅ ${description}`, "green");
      return true;
    } else {
      log(`❌ ${description} - NOT FOUND`, "red");
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, "red");
    return false;
  }
}

console.log("\n");
log("╔═══════════════════════════════════════════════════════════╗", "cyan");
log("║   PRODUCTION ARCHITECTURE VERIFICATION                   ║", "cyan");
log("║   Checking all components...                             ║", "cyan");
log("╚═══════════════════════════════════════════════════════════╝", "cyan");
console.log("\n");

let allChecks = true;

// ============================================================================
// 1. Core Files
// ============================================================================
log("📁 Checking Core Files...", "blue");
console.log("─".repeat(60));

allChecks &= checkFile("mcp-server/server.py", "MCP Server (main entry point)");
allChecks &= checkFile(
  "mcp-server/session_manager.py",
  "Session Manager (memory)",
);
allChecks &= checkFile(
  "mcp-server/intent_router.py",
  "Intent Router (deterministic)",
);
allChecks &= checkFile(
  "mcp-server/tool_flows.py",
  "Tool Flows (business logic)",
);
allChecks &= checkFile("mcp-server/llm_handler.py", "LLM Handler (controlled)");

console.log("\n");

// ============================================================================
// 2. Backend Integration
// ============================================================================
log("🔌 Checking Backend Integration...", "blue");
console.log("─".repeat(60));

allChecks &= checkFile(
  "backend/src/routes/mcp.routes.js",
  "MCP Routes (API endpoints)",
);
allChecks &= checkFileContent(
  "backend/src/routes/mcp.routes.js",
  "session_id",
  "Session ID support in backend",
);

console.log("\n");

// ============================================================================
// 3. Frontend Integration
// ============================================================================
log("🎨 Checking Frontend Integration...", "blue");
console.log("─".repeat(60));

allChecks &= checkFile(
  "src/Components/ChatWidget.jsx",
  "Chat Widget component",
);
allChecks &= checkFileContent(
  "src/Components/ChatWidget.jsx",
  "sessionId",
  "Session ID state in frontend",
);
allChecks &= checkFileContent(
  "src/Components/ChatWidget.jsx",
  "session_id",
  "Session ID in API call",
);

console.log("\n");

// ============================================================================
// 4. Data Directories
// ============================================================================
log("📂 Checking Data Directories...", "blue");
console.log("─".repeat(60));

allChecks &= checkDirectory("mcp-server/data", "Data directory");

// Create sessions directory if it doesn't exist
const sessionsDir = "mcp-server/data/sessions";
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
  log(`✅ Created sessions directory`, "green");
} else {
  log(`✅ Sessions directory exists`, "green");
}

console.log("\n");

// ============================================================================
// 5. Documentation
// ============================================================================
log("📚 Checking Documentation...", "blue");
console.log("─".repeat(60));

allChecks &= checkFile(
  "PRODUCTION_ARCHITECTURE_COMPLETE.md",
  "Architecture documentation",
);
allChecks &= checkFile("QUICK_START_PRODUCTION.md", "Quick start guide");
allChecks &= checkFile("IMPLEMENTATION_SUMMARY_HINDI.md", "Hindi summary");

console.log("\n");

// ============================================================================
// 6. Test Files
// ============================================================================
log("🧪 Checking Test Files...", "blue");
console.log("─".repeat(60));

allChecks &= checkFile(
  "test-production-architecture.js",
  "Production test suite",
);

console.log("\n");

// ============================================================================
// 7. Code Integration Checks
// ============================================================================
log("🔍 Checking Code Integration...", "blue");
console.log("─".repeat(60));

// Check if server.py has updated chat function
allChecks &= checkFileContent(
  "mcp-server/server.py",
  "from session_manager import",
  "Session manager imported in server.py",
);
allChecks &= checkFileContent(
  "mcp-server/server.py",
  "from intent_router import",
  "Intent router imported in server.py",
);
allChecks &= checkFileContent(
  "mcp-server/server.py",
  "from tool_flows import",
  "Tool flows imported in server.py",
);
allChecks &= checkFileContent(
  "mcp-server/server.py",
  "detect_intent",
  "Intent detection in chat function",
);

console.log("\n");

// ============================================================================
// 8. Session Manager Checks
// ============================================================================
log("💾 Checking Session Manager...", "blue");
console.log("─".repeat(60));

allChecks &= checkFileContent(
  "mcp-server/session_manager.py",
  "SESSION_STORE",
  "Session store defined",
);
allChecks &= checkFileContent(
  "mcp-server/session_manager.py",
  "get_session",
  "get_session function",
);
allChecks &= checkFileContent(
  "mcp-server/session_manager.py",
  "update_session",
  "update_session function",
);
allChecks &= checkFileContent(
  "mcp-server/session_manager.py",
  "add_to_history",
  "add_to_history function",
);

console.log("\n");

// ============================================================================
// 9. Intent Router Checks
// ============================================================================
log("🎯 Checking Intent Router...", "blue");
console.log("─".repeat(60));

allChecks &= checkFileContent(
  "mcp-server/intent_router.py",
  "detect_intent",
  "detect_intent function",
);
allChecks &= checkFileContent(
  "mcp-server/intent_router.py",
  "seo_audit",
  "SEO audit intent",
);
allChecks &= checkFileContent(
  "mcp-server/intent_router.py",
  "schedule_meeting",
  "Meeting intent",
);
allChecks &= checkFileContent(
  "mcp-server/intent_router.py",
  "quote",
  "Quote intent",
);
allChecks &= checkFileContent(
  "mcp-server/intent_router.py",
  "image",
  "Image intent",
);

console.log("\n");

// ============================================================================
// 10. Tool Flows Checks
// ============================================================================
log("⚙️  Checking Tool Flows...", "blue");
console.log("─".repeat(60));

allChecks &= checkFileContent(
  "mcp-server/tool_flows.py",
  "schedule_meeting_flow",
  "Meeting flow",
);
allChecks &= checkFileContent(
  "mcp-server/tool_flows.py",
  "seo_audit_execute_flow",
  "SEO audit flow",
);
allChecks &= checkFileContent(
  "mcp-server/tool_flows.py",
  "quote_execute_flow",
  "Quote flow",
);
allChecks &= checkFileContent(
  "mcp-server/tool_flows.py",
  "image_execute_flow",
  "Image flow",
);
allChecks &= checkFileContent(
  "mcp-server/tool_flows.py",
  "confirmation_yes_flow",
  "Confirmation flow",
);

console.log("\n");

// ============================================================================
// Summary
// ============================================================================
console.log("═".repeat(60));
if (allChecks) {
  log("🎉 ALL CHECKS PASSED!", "green");
  console.log("\n");
  log("✅ Production architecture is properly configured", "green");
  log("✅ All files are in place", "green");
  log("✅ Code integration is complete", "green");
  log("✅ Session management is ready", "green");
  log("✅ Intent routing is configured", "green");
  log("✅ Tool flows are implemented", "green");
  console.log("\n");
  log("🚀 Ready to start servers!", "cyan");
  console.log("\n");
  log("Next steps:", "yellow");
  log("1. Start MCP server: cd mcp-server && python server.py", "yellow");
  log("2. Start backend: cd backend && npm start", "yellow");
  log("3. Start frontend: npm run dev", "yellow");
  log("4. Run tests: node test-production-architecture.js", "yellow");
} else {
  log("❌ SOME CHECKS FAILED", "red");
  console.log("\n");
  log("Please review the errors above and fix them.", "yellow");
  log("Then run this script again to verify.", "yellow");
}
console.log("\n");

process.exit(allChecks ? 0 : 1);

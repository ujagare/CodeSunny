#!/usr/bin/env node

/**
 * Pre-Deployment Configuration Verification Script
 * Verifies all configuration before deployment
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

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}: ${filePath}`, "green");
    return true;
  } else {
    log(`❌ ${description}: ${filePath} NOT FOUND`, "red");
    return false;
  }
}

function checkEnvFile(filePath, requiredVars) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${filePath} not found`, "red");
    return false;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const vars = {};

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key) {
        vars[key.trim()] = valueParts.join("=").trim();
      }
    }
  });

  let allPresent = true;
  requiredVars.forEach((varName) => {
    if (vars[varName]) {
      log(`  ✅ ${varName} is set`, "green");
    } else {
      log(`  ❌ ${varName} is missing`, "red");
      allPresent = false;
    }
  });

  return allPresent;
}

function checkCodeForLocalhost(filePath) {
  if (!fs.existsSync(filePath)) {
    return true;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const hasLocalhost =
    content.includes("localhost:3001") ||
    content.includes("localhost:5000") ||
    content.includes("http://localhost");

  if (hasLocalhost) {
    log(`⚠️  ${filePath} contains localhost references`, "yellow");
    return false;
  }

  return true;
}

function checkGitignore() {
  const gitignorePath = ".gitignore";
  if (!fs.existsSync(gitignorePath)) {
    log("❌ .gitignore not found", "red");
    return false;
  }

  const content = fs.readFileSync(gitignorePath, "utf-8");
  const requiredEntries = [".env", ".env.production", "backend/.env"];
  let allPresent = true;

  requiredEntries.forEach((entry) => {
    if (content.includes(entry)) {
      log(`  ✅ ${entry} in .gitignore`, "green");
    } else {
      log(`  ❌ ${entry} NOT in .gitignore`, "red");
      allPresent = false;
    }
  });

  return allPresent;
}

async function runVerification() {
  log("\n" + "=".repeat(60), "cyan");
  log("🔍 Pre-Deployment Configuration Verification", "cyan");
  log("=".repeat(60), "cyan");

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Check environment files
  log("\n📁 Checking Environment Files...", "blue");
  if (checkFileExists(".env.production", "Frontend Production Config")) {
    results.passed++;
    log("\n  Checking Frontend Production Variables:", "cyan");
    if (checkEnvFile(".env.production", ["VITE_API_URL", "VITE_APP_ENV"])) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    results.failed++;
  }

  if (checkFileExists("backend/.env.production", "Backend Production Config")) {
    results.passed++;
    log("\n  Checking Backend Production Variables:", "cyan");
    const backendVars = [
      "NODE_ENV",
      "PORT",
      "CORS_ORIGIN",
      "MONGO_URI",
      "JWT_SECRET",
      "JWT_REFRESH_SECRET",
      "APP_URL",
      "MCP_URL",
    ];
    if (checkEnvFile("backend/.env.production", backendVars)) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    results.failed++;
  }

  // Check code files
  log("\n📝 Checking Code Files...", "blue");
  const codeFiles = [
    "src/Components/ChatWidget.jsx",
    "backend/src/app.js",
    "backend/src/server.js",
  ];

  codeFiles.forEach((file) => {
    if (checkFileExists(file, `Code file`)) {
      results.passed++;
    } else {
      results.failed++;
    }
  });

  // Check for localhost references
  log("\n🔍 Checking for Hardcoded URLs...", "blue");
  const filesToCheck = ["src/Components/ChatWidget.jsx"];

  filesToCheck.forEach((file) => {
    if (!checkCodeForLocalhost(file)) {
      results.warnings++;
      log(`  ⚠️  Review ${file} for localhost references`, "yellow");
    } else {
      log(`  ✅ ${file} looks good`, "green");
      results.passed++;
    }
  });

  // Check .gitignore
  log("\n🔒 Checking .gitignore...", "blue");
  if (checkGitignore()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Check documentation
  log("\n📚 Checking Documentation...", "blue");
  const docs = [
    "PRODUCTION_DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_CHECKLIST.md",
    "QUICK_DEPLOY.md",
    "DEPLOYMENT_SUMMARY.md",
    "DEPLOYMENT_HINDI.md",
  ];

  docs.forEach((doc) => {
    if (checkFileExists(doc, "Documentation")) {
      results.passed++;
    } else {
      results.warnings++;
    }
  });

  // Check test script
  log("\n🧪 Checking Test Infrastructure...", "blue");
  if (checkFileExists("test-production.cjs", "Production Test Script")) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Check package.json scripts
  log("\n📦 Checking Package Scripts...", "blue");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  const requiredScripts = ["build:prod", "test:prod", "deploy:check"];

  requiredScripts.forEach((script) => {
    if (packageJson.scripts[script]) {
      log(`  ✅ Script "${script}" exists`, "green");
      results.passed++;
    } else {
      log(`  ❌ Script "${script}" missing`, "red");
      results.failed++;
    }
  });

  // Summary
  log("\n" + "=".repeat(60), "cyan");
  log("📊 Verification Summary", "cyan");
  log("=".repeat(60), "cyan");
  log(`Passed: ${results.passed}`, "green");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "red" : "green");
  log(
    `Warnings: ${results.warnings}`,
    results.warnings > 0 ? "yellow" : "green",
  );
  log("=".repeat(60), "cyan");

  if (results.failed === 0 && results.warnings === 0) {
    log("\n✅ All checks passed! Ready for deployment.", "green");
    log("\nNext steps:", "cyan");
    log("1. Set environment variables in Vercel", "blue");
    log("2. Set environment variables in Render/Railway", "blue");
    log("3. Push code: git push origin main", "blue");
    log("4. Run tests: npm run test:prod", "blue");
    process.exit(0);
  } else if (results.failed === 0) {
    log("\n⚠️  All critical checks passed, but there are warnings.", "yellow");
    log("Review warnings above before deploying.", "yellow");
    process.exit(0);
  } else {
    log("\n❌ Some checks failed. Please fix the issues above.", "red");
    log("\nRefer to:", "cyan");
    log("- PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions", "blue");
    log("- DEPLOYMENT_CHECKLIST.md for step-by-step guide", "blue");
    log("- QUICK_DEPLOY.md for quick reference", "blue");
    process.exit(1);
  }
}

// Run verification
runVerification().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

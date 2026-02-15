#!/usr/bin/env node

/**
 * Production Deployment Testing Script
 * Tests all critical endpoints and configurations
 */

const https = require("https");
const http = require("http");

// Configuration
const BACKEND_URL =
  process.env.BACKEND_URL || "https://codesunny-backend.onrender.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://codesunny.vercel.app";
const MCP_URL = process.env.MCP_URL || "https://codesunny-mcp.onrender.com";

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

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    log(`\n🧪 Testing: ${name}`, "cyan");
    log(`   URL: ${url}`, "blue");

    const result = await makeRequest(url, options);

    if (result.status >= 200 && result.status < 300) {
      log(`   ✅ Status: ${result.status}`, "green");
      if (result.data) {
        log(
          `   📦 Response: ${JSON.stringify(result.data).substring(0, 100)}...`,
          "blue",
        );
      }
      return true;
    } else {
      log(`   ❌ Status: ${result.status}`, "red");
      log(`   📦 Response: ${JSON.stringify(result.data)}`, "yellow");
      return false;
    }
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, "red");
    return false;
  }
}

async function testCORS(url, origin) {
  try {
    log(`\n🔒 Testing CORS: ${url}`, "cyan");
    log(`   Origin: ${origin}`, "blue");

    const result = await makeRequest(url, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    const corsHeader = result.headers["access-control-allow-origin"];

    if (corsHeader && (corsHeader === origin || corsHeader === "*")) {
      log(`   ✅ CORS Allowed: ${corsHeader}`, "green");
      return true;
    } else {
      log(`   ❌ CORS Not Configured Properly`, "red");
      log(`   📦 CORS Header: ${corsHeader || "Not Set"}`, "yellow");
      return false;
    }
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, "red");
    return false;
  }
}

async function runTests() {
  log("\n" + "=".repeat(60), "cyan");
  log("🚀 Production Deployment Testing", "cyan");
  log("=".repeat(60), "cyan");

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Test Backend Health
  results.total++;
  if (await testEndpoint("Backend Health Check", `${BACKEND_URL}/api/health`)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test CORS Configuration
  results.total++;
  if (await testCORS(`${BACKEND_URL}/api/health`, FRONTEND_URL)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test MCP Chat Endpoint
  results.total++;
  if (
    await testEndpoint("MCP Chat Endpoint", `${BACKEND_URL}/api/mcp/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: FRONTEND_URL,
      },
      body: { message: "Hello, this is a test" },
    })
  ) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test MCP Search Endpoint
  results.total++;
  if (
    await testEndpoint("MCP Search Endpoint", `${BACKEND_URL}/api/mcp/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: FRONTEND_URL,
      },
      body: { query: "SEO" },
    })
  ) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test MCP Lead Endpoint
  results.total++;
  if (
    await testEndpoint("MCP Lead Endpoint", `${BACKEND_URL}/api/mcp/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: FRONTEND_URL,
      },
      body: {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test lead",
      },
    })
  ) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test Frontend Accessibility
  results.total++;
  if (await testEndpoint("Frontend Accessibility", FRONTEND_URL)) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Summary
  log("\n" + "=".repeat(60), "cyan");
  log("📊 Test Results Summary", "cyan");
  log("=".repeat(60), "cyan");
  log(`Total Tests: ${results.total}`, "blue");
  log(`Passed: ${results.passed}`, "green");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "red" : "green");
  log(
    `Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`,
    results.failed === 0 ? "green" : "yellow",
  );
  log("=".repeat(60), "cyan");

  if (results.failed === 0) {
    log("\n✅ All tests passed! Production deployment is ready.", "green");
    process.exit(0);
  } else {
    log("\n❌ Some tests failed. Please review the errors above.", "red");
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, "red");
  process.exit(1);
});

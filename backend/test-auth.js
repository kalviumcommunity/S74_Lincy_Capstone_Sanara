const API_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== STARTING AUTH API TESTS ===");

  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "securePassword123";

  // Test 1: Register new user
  try {
    console.log("\n1. Testing Register new user...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const regData = await regRes.json();
    console.log("✅ Register Status:", regRes.status, regData);
    if (!regData.token) throw new Error("No token returned on register!");
  } catch (err) {
    console.error("❌ Register FAILED:", err.message);
    process.exit(1);
  }

  // Test 2: Register duplicate email
  try {
    console.log("\n2. Testing duplicate email register...");
    const dupRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const dupData = await dupRes.json();
    if (dupRes.status === 400 && dupData.error) {
      console.log("✅ Duplicate register correctly rejected:", dupData.error);
    } else {
      console.error("❌ Unexpected response on duplicate register:", dupRes.status, dupData);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error on duplicate register test:", err.message);
    process.exit(1);
  }

  // Test 3: Login with correct password
  let token = "";
  try {
    console.log("\n3. Testing Login with correct credentials...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const loginData = await loginRes.json();
    console.log("✅ Login Status:", loginRes.status, loginData.user);
    token = loginData.token;
    if (!token) throw new Error("No token returned on login!");
  } catch (err) {
    console.error("❌ Login FAILED:", err.message);
    process.exit(1);
  }

  // Test 4: Login with wrong password
  try {
    console.log("\n4. Testing Login with wrong password...");
    const wrongRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: "wrongpassword" }),
    });
    const wrongData = await wrongRes.json();
    if (wrongRes.status === 401) {
      console.log("✅ Wrong password correctly rejected:", wrongData.error);
    } else {
      console.error("❌ Unexpected error on wrong password:", wrongRes.status, wrongData);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error on wrong password test:", err.message);
    process.exit(1);
  }

  // Test 5: Verify /auth/me endpoint
  try {
    console.log("\n5. Testing /auth/me with Bearer token...");
    const meRes = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    console.log("✅ /auth/me SUCCESS. User email:", meData.email, "Provider:", meData.provider);
  } catch (err) {
    console.error("❌ /auth/me FAILED:", err.message);
    process.exit(1);
  }

  console.log("\nALL AUTH API TESTS PASSED SUCCESSFULLY! 🎉");
}

runTests();

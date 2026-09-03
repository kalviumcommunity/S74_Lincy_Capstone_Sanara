const {
  untangleSituation,
  performRealityCheck,
  buildDecisionRoom,
  calculateTextSimilarity,
  simulateConversationStep,
} = require("./services/aiService");

async function runSanaraTests() {
  console.log("==========================================");
  console.log("🧪 SANARA 2.0 INTEGRATION TEST SUITE");
  console.log("==========================================");

  // 1. Test Untangle Structuring
  console.log("\n1️⃣ Testing Untangle Situation Extraction...");
  const rawInput = "I want to quit my internship. My manager keeps criticizing me and I'm exhausted. Maybe I'm just not good at development anymore.";
  const structured = await untangleSituation(rawInput);

  console.log("✅ Title:", structured.title);
  console.log("✅ Facts count:", structured.facts.length);
  console.log("✅ Emotions:", structured.emotions.join(", "));
  console.log("✅ Assumptions:", structured.assumptions.join(" | "));
  console.log("✅ Fears:", structured.fears.join(" | "));
  console.log("✅ Needs:", structured.needs.join(" | "));

  if (!structured.title || structured.facts.length === 0 || structured.emotions.length === 0) {
    throw new Error("Untangle test failed: Missing required structured fields.");
  }

  // 2. Test Similarity Matching ("You Were Here Before")
  console.log("\n2️⃣ Testing Situation Memory Similarity Matching...");
  const textA = "I am scared to tell my manager I made a mistake on the deadline";
  const textB = "I was scared to tell my professor about a missed deadline";
  const textC = "I bought a new couch for my apartment";

  const simAB = calculateTextSimilarity(textA, textB);
  const simAC = calculateTextSimilarity(textA, textC);

  console.log(`✅ Similarity (Manager Mistake vs Professor Mistake): ${Math.round(simAB * 100)}%`);
  console.log(`✅ Similarity (Manager Mistake vs Buying Couch): ${Math.round(simAC * 100)}%`);

  if (simAB <= simAC) {
    throw new Error("Memory retrieval test failed: Relevant past situation similarity should be higher than irrelevant text.");
  }

  // 3. Test Reality Check
  console.log("\n3️⃣ Testing Reality Check (Fact vs Story)...");
  const claim = "Everyone in my class is doing better than me.";
  const facts = ["Two classmates scored higher than me."];
  const reality = await performRealityCheck(claim, facts);

  console.log("✅ Claim:", reality.claim);
  console.log("✅ Evidence For:", reality.evidenceFor[0]);
  console.log("✅ Evidence Against:", reality.evidenceAgainst[0]);
  console.log("✅ Balanced View:", reality.balancedInterpretation);

  if (!reality.claim || !reality.balancedInterpretation) {
    throw new Error("Reality check test failed.");
  }

  // 4. Test Decision Room
  console.log("\n4️⃣ Testing Decision Room Comparison...");
  const dec = await buildDecisionRoom("Struggling at internship", "Should I leave my internship?");
  console.log("✅ Question:", dec.question);
  console.log("✅ Option A:", dec.optionA.title);
  console.log("✅ Option B:", dec.optionB.title);

  if (!dec.optionA || !dec.optionB) {
    throw new Error("Decision room test failed.");
  }

  // 5. Test Conversation Simulator
  console.log("\n5️⃣ Testing Conversation Simulator...");
  const sim = await simulateConversationStep("Difficult feedback conversation", "I felt ignored in yesterday's meeting.", "Calm");
  console.log("✅ Simulated Partner Response:", sim.simulatedResponse);
  console.log("✅ Reflection Tip:", sim.reflectionTip);

  console.log("\n==========================================");
  console.log("🎉 ALL SANARA 2.0 INTEGRATION TESTS PASSED!");
  console.log("==========================================");
}

runSanaraTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

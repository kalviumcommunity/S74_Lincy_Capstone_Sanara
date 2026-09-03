const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const Situation = require("../models/Situation");
const Thread = require("../models/Thread");
const Event = require("../models/Event");
const Reflection = require("../models/Reflection");
const Decision = require("../models/Decision");
const Outcome = require("../models/Outcome");

const {
  untangleSituation,
  performRealityCheck,
  buildDecisionRoom,
  generateEmbedding,
  calculateCosineSimilarity,
  calculateTextSimilarity,
  simulateConversationStep,
  detectUserPatterns,
  askSanaraHistory,
} = require("../services/aiService");

/* =========================================================
   1. UNTANGLE: Post messy text -> Receive structured context
========================================================= */
router.post("/untangle", verifyToken, async (req, res) => {
  try {
    const { rawInput } = req.body;
    if (!rawInput || !rawInput.trim()) {
      return res.status(400).json({ error: "Please enter a situation to untangle." });
    }

    const userId = req.user.id;

    // 1. Structure raw text using AI/fallback engine
    const structured = await untangleSituation(rawInput);

    // 2. Generate vector embedding
    const embedding = await generateEmbedding(rawInput);

    // 3. Search for past similar situations ("You Were Here Before")
    const previousSituations = await Situation.find({ userId }).sort({ createdAt: -1 });

    let topMatch = null;
    let highestSim = 0;

    for (const prev of previousSituations) {
      let sim = 0;
      if (embedding.length > 0 && prev.embedding && prev.embedding.length > 0) {
        sim = calculateCosineSimilarity(embedding, prev.embedding);
      } else {
        sim = calculateTextSimilarity(rawInput, prev.rawInput);
      }

      if (sim > highestSim && sim >= 0.25) {
        highestSim = sim;
        topMatch = prev;
      }
    }

    let familiarPast = null;
    if (topMatch) {
      const pastOutcome = await Outcome.findOne({ situationId: topMatch._id, userId });
      const weeksAgo = Math.max(1, Math.round((Date.now() - new Date(topMatch.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7)));

      familiarPast = {
        situationId: topMatch._id,
        title: topMatch.title,
        timeframe: `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`,
        summary: topMatch.summary,
        pastOutcome: pastOutcome ? pastOutcome.actualOutcome || pastOutcome.learned : "Outcome recorded in past thread.",
        similarityScore: Math.round(highestSim * 100),
      };
    }

    // 4. Save new Situation
    const situation = new Situation({
      userId,
      title: structured.title,
      rawInput,
      summary: structured.summary,
      status: "active",
      currentStage: "untangled",
      facts: structured.facts,
      emotions: structured.emotions,
      assumptions: structured.assumptions,
      fears: structured.fears,
      needs: structured.needs,
      decisions: structured.decisions,
      openQuestions: structured.openQuestions,
      themes: structured.themes,
      embedding,
    });
    await situation.save();

    // 5. Create associated Living Thread
    const thread = new Thread({
      userId,
      situationId: situation._id,
      title: situation.title,
      status: "Decision pending",
      actionItems: structured.openQuestions.slice(0, 2).map((q) => ({ text: q, completed: false })),
      unfinishedThoughts: structured.assumptions.slice(0, 2),
    });
    await thread.save();

    // 6. Log initial Event
    const initialEvent = new Event({
      userId,
      situationId: situation._id,
      description: "Situation untangled & recorded",
      emotion: structured.emotions[0] || "Uncertainty",
    });
    await initialEvent.save();

    res.status(201).json({
      situation,
      thread,
      familiarPast,
    });
  } catch (err) {
    console.error("Untangle error:", err);
    res.status(500).json({ error: "Failed to untangle situation. Please try again." });
  }
});

/* =========================================================
   2. GET ALL SITUATIONS (Scoped to userId)
========================================================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const situations = await Situation.find(query).sort({ updatedAt: -1 });
    res.json(situations);
  } catch (err) {
    console.error("Fetch situations error:", err);
    res.status(500).json({ error: "Failed to fetch situations." });
  }
});

/* =========================================================
   2B. MY MAP: Interactive Graph Node Dataset
========================================================= */
router.get("/map/data", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const situations = await Situation.find({ userId }).sort({ createdAt: -1 });
    const threads = await Thread.find({ userId });
    const decisions = await Decision.find({ userId });
    const outcomes = await Outcome.find({ userId });

    const nodes = [
      {
        id: "user",
        label: "ME",
        type: "root",
        category: "User",
        appearances: situations.length,
        summary: "Center of your thinking universe",
      },
    ];
    const links = [];
    const linkSet = new Set();

    const addLink = (source, target, label = "connected") => {
      const linkKey = `${source}->${target}`;
      const revKey = `${target}->${source}`;
      if (source !== target && !linkSet.has(linkKey) && !linkSet.has(revKey)) {
        linkSet.add(linkKey);
        links.push({ source, target, label });
      }
    };

    // Track unique themes & emotions across situations
    const themeMap = {}; // themeName -> { id, count, sitIds: [] }
    const emotionMap = {}; // emoName -> { id, count, sitIds: [] }

    // First pass: aggregate themes & emotions
    situations.forEach((sit) => {
      const themes = (sit.themes || []).filter(Boolean);
      if (themes.length === 0) themes.push("General");

      themes.forEach((tName) => {
        const themeId = `theme_${tName.toLowerCase().replace(/[^a-z0-0]/g, "_")}`;
        if (!themeMap[tName]) {
          themeMap[tName] = { id: themeId, name: tName, count: 0, sitIds: [] };
        }
        themeMap[tName].count += 1;
        themeMap[tName].sitIds.push(sit._id.toString());
      });

      (sit.emotions || []).filter(Boolean).forEach((eName) => {
        const emoId = `emo_${eName.toLowerCase().replace(/[^a-z0-0]/g, "_")}`;
        if (!emotionMap[eName]) {
          emotionMap[eName] = { id: emoId, name: eName, count: 0, sitIds: [] };
        }
        emotionMap[eName].count += 1;
        emotionMap[eName].sitIds.push(sit._id.toString());
      });
    });

    // Create theme nodes & link to ME
    Object.values(themeMap).forEach((t) => {
      nodes.push({
        id: t.id,
        label: t.name,
        type: "theme",
        category: "Theme",
        appearances: t.count,
        summary: `Theme appearing in ${t.count} situation${t.count === 1 ? "" : "s"}`,
      });
      addLink("user", t.id, "theme");
    });

    // Create emotion nodes
    Object.values(emotionMap).forEach((e) => {
      nodes.push({
        id: e.id,
        label: e.name,
        type: "emotion",
        category: "Emotion",
        appearances: e.count,
        summary: `Emotion experienced in ${e.count} situation${e.count === 1 ? "" : "s"}`,
      });
    });

    // Create situation nodes, decision nodes, outcome nodes & connects
    situations.forEach((sit) => {
      const sitNodeId = `sit_${sit._id}`;
      const primaryTheme = sit.themes && sit.themes.length > 0 ? sit.themes[0] : "General";

      nodes.push({
        id: sitNodeId,
        label: sit.title,
        type: "situation",
        status: sit.status,
        summary: sit.summary || "Recorded personal situation",
        createdAt: sit.createdAt,
        emotions: sit.emotions || [],
        themes: sit.themes || [primaryTheme],
        category: primaryTheme,
        appearances: 1,
      });

      // Link situation to its themes
      (sit.themes || [primaryTheme]).forEach((tName) => {
        if (themeMap[tName]) {
          addLink(themeMap[tName].id, sitNodeId, "situation");
        }
      });

      // Link situation to its emotions
      (sit.emotions || []).forEach((eName) => {
        if (emotionMap[eName]) {
          addLink(sitNodeId, emotionMap[eName].id, "emotion");
        }
      });

      // Check for Decision
      const dec = decisions.find((d) => d.situationId.toString() === sit._id.toString());
      if (dec) {
        const decId = `dec_${sit._id}`;
        nodes.push({
          id: decId,
          label: dec.chosenOption || "Decision Made",
          type: "decision",
          category: "Decision",
          summary: dec.reasoning || "Deliberated decision path",
          createdAt: dec.createdAt,
          appearances: 1,
        });
        addLink(sitNodeId, decId, "decision");

        // Outcome link to Decision
        const outcome = outcomes.find((o) => o.situationId.toString() === sit._id.toString());
        if (outcome) {
          const outId = `out_${sit._id}`;
          nodes.push({
            id: outId,
            label: outcome.learned || "Outcome Stored",
            type: "outcome",
            category: "Outcome",
            summary: outcome.actualResult || "Reflected outcome & takeaway",
            createdAt: outcome.createdAt,
            appearances: 1,
          });
          addLink(decId, outId, "outcome");
        }
      } else {
        // Direct Outcome link if no decision record
        const outcome = outcomes.find((o) => o.situationId.toString() === sit._id.toString());
        if (outcome) {
          const outId = `out_${sit._id}`;
          nodes.push({
            id: outId,
            label: outcome.learned || "Outcome Stored",
            type: "outcome",
            category: "Outcome",
            summary: outcome.actualResult || "Reflected outcome & takeaway",
            createdAt: outcome.createdAt,
            appearances: 1,
          });
          addLink(sitNodeId, outId, "outcome");
        }
      }
    });

    // Cross-link co-occurring themes
    situations.forEach((sit) => {
      const sitThemes = (sit.themes || []).filter(Boolean);
      for (let i = 0; i < sitThemes.length; i++) {
        for (let j = i + 1; j < sitThemes.length; j++) {
          const t1 = themeMap[sitThemes[i]];
          const t2 = themeMap[sitThemes[j]];
          if (t1 && t2) {
            addLink(t1.id, t2.id, "co-theme");
          }
        }
      }
    });

    res.json({ nodes, links });
  } catch (err) {
    console.error("Map data error:", err);
    res.status(500).json({ error: "Failed to generate map data." });
  }
});

/* =========================================================
   2C. PATTERN INTELLIGENCE (Observed vs Interpretation)
========================================================= */
router.get("/patterns", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const situations = await Situation.find({ userId });
    const patterns = await detectUserPatterns(situations);
    res.json({ patterns });
  } catch (err) {
    console.error("Fetch patterns error:", err);
    res.status(500).json({ error: "Failed to detect patterns." });
  }
});

/* =========================================================
   3. GET SINGLE SITUATION DETAIL
========================================================= */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const situation = await Situation.findOne({ _id: req.params.id, userId });

    if (!situation) {
      return res.status(404).json({ error: "Situation not found." });
    }

    const thread = await Thread.findOne({ situationId: situation._id, userId });
    const events = await Event.find({ situationId: situation._id, userId }).sort({ createdAt: -1 });
    const reflections = await Reflection.find({ situationId: situation._id, userId }).sort({ createdAt: -1 });
    const decision = await Decision.findOne({ situationId: situation._id, userId });
    const outcome = await Outcome.findOne({ situationId: situation._id, userId });

    res.json({
      situation,
      thread,
      events,
      reflections,
      decision,
      outcome,
    });
  } catch (err) {
    console.error("Fetch single situation error:", err);
    res.status(500).json({ error: "Failed to load situation details." });
  }
});

/* =========================================================
   4. REALITY CHECK: Separate Facts vs Assumptions
========================================================= */
router.post("/:id/reality-check", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { claim } = req.body;

    const situation = await Situation.findOne({ _id: req.params.id, userId });
    if (!situation) {
      return res.status(404).json({ error: "Situation not found." });
    }

    const targetClaim = claim || (situation.assumptions[0] || situation.title);
    const result = await performRealityCheck(targetClaim, situation.facts);

    const reflection = new Reflection({
      userId,
      situationId: situation._id,
      type: "reality_check",
      claim: result.claim,
      evidenceFor: result.evidenceFor,
      evidenceAgainst: result.evidenceAgainst,
      balancedInterpretation: result.balancedInterpretation,
    });
    await reflection.save();

    res.json({ reflection, result });
  } catch (err) {
    console.error("Reality check error:", err);
    res.status(500).json({ error: "Failed to complete reality check." });
  }
});

/* =========================================================
   5. DECISION ROOM: Create / Get / Update Decision
========================================================= */
router.post("/:id/decision", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const situation = await Situation.findOne({ _id: req.params.id, userId });

    if (!situation) {
      return res.status(404).json({ error: "Situation not found." });
    }

    const { question, priorities, selectedOption, reasoning } = req.body;

    let decision = await Decision.findOne({ situationId: situation._id, userId });

    if (!decision) {
      const decisionText = question || (situation.decisions[0] || `Should I take action on ${situation.title}?`);
      const generated = await buildDecisionRoom(situation.summary, decisionText);

      decision = new Decision({
        userId,
        situationId: situation._id,
        question: generated.question,
        optionA: generated.optionA,
        optionB: generated.optionB,
        priorities: priorities || { career: 50, energy: 50, money: 50, learning: 50, time: 50, stability: 50 },
        selectedOption: selectedOption || "",
        reasoning: reasoning || "",
      });
    } else {
      if (priorities) decision.priorities = { ...decision.priorities, ...priorities };
      if (selectedOption !== undefined) decision.selectedOption = selectedOption;
      if (reasoning !== undefined) decision.reasoning = reasoning;
    }

    await decision.save();
    res.json(decision);
  } catch (err) {
    console.error("Decision room error:", err);
    res.status(500).json({ error: "Failed to manage Decision Room." });
  }
});

/* =========================================================
   6. RESOLVE SITUATION & TRACK OUTCOME
========================================================= */
router.post("/:id/resolve", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { expectedOutcome, actionTaken, actualOutcome, learned } = req.body;

    const situation = await Situation.findOne({ _id: req.params.id, userId });
    if (!situation) {
      return res.status(404).json({ error: "Situation not found." });
    }

    situation.status = "resolved";
    await situation.save();

    await Thread.findOneAndUpdate(
      { situationId: situation._id, userId },
      { status: "Resolved", lastUpdated: new Date() }
    );

    let outcome = await Outcome.findOne({ situationId: situation._id, userId });
    if (!outcome) {
      outcome = new Outcome({
        userId,
        situationId: situation._id,
        expectedOutcome: expectedOutcome || "Expected a challenging resolution.",
        actionTaken: actionTaken || "Took direct steps to clarify situation.",
        actualOutcome: actualOutcome || "Situation concluded.",
        learned: learned || "Gained insight for future decisions.",
      });
    } else {
      if (expectedOutcome) outcome.expectedOutcome = expectedOutcome;
      if (actionTaken) outcome.actionTaken = actionTaken;
      if (actualOutcome) outcome.actualOutcome = actualOutcome;
      if (learned) outcome.learned = learned;
    }
    await outcome.save();

    res.json({ situation, outcome });
  } catch (err) {
    console.error("Resolve error:", err);
    res.status(500).json({ error: "Failed to resolve situation." });
  }
});



/* =========================================================
   8. THREAD ACTION ITEMS & UNFINISHED THOUGHTS
========================================================= */
router.put("/threads/:id/action-items", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { actionItems, status } = req.body;

    const thread = await Thread.findOne({ _id: req.params.id, userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    if (actionItems) thread.actionItems = actionItems;
    if (status) thread.status = status;
    thread.lastUpdated = new Date();

    await thread.save();
    res.json(thread);
  } catch (err) {
    console.error("Thread update error:", err);
    res.status(500).json({ error: "Failed to update thread." });
  }
});

/* =========================================================
   8B. ADD THREAD UPDATE
========================================================= */
router.post("/threads/:id/updates", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Update content is required." });
    }

    const thread = await Thread.findOne({ _id: req.params.id, userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found." });
    }

    const shiftNote = `Update recorded on ${new Date().toLocaleDateString()}`;
    thread.updates.push({ content: content.trim(), createdAt: new Date(), aiShiftNote: shiftNote });
    thread.lastUpdated = new Date();

    await thread.save();

    // Also update situation timestamp
    await Situation.findOneAndUpdate({ _id: thread.situationId, userId }, { updatedAt: new Date() });

    res.json(thread);
  } catch (err) {
    console.error("Thread update add error:", err);
    res.status(500).json({ error: "Failed to post thread update." });
  }
});

/* =========================================================
   10. PATTERN INTELLIGENCE (Observed vs Interpretation)
========================================================= */
router.get("/patterns", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const situations = await Situation.find({ userId });
    const patterns = await detectUserPatterns(situations);
    res.json({ patterns });
  } catch (err) {
    console.error("Fetch patterns error:", err);
    res.status(500).json({ error: "Failed to detect patterns." });
  }
});

/* =========================================================
   11. ASK SANARA: Query Personal Journal History
========================================================= */
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required." });
    }

    const situations = await Situation.find({ userId }).sort({ createdAt: -1 });
    const outcomes = await Outcome.find({ userId });

    const response = await askSanaraHistory(query, situations, outcomes);
    res.json(response);
  } catch (err) {
    console.error("Ask Sanara error:", err);
    res.status(500).json({ error: "Failed to process history query." });
  }
});

module.exports = router;

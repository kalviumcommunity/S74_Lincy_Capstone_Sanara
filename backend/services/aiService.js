const { z } = require("zod");
const OpenAI = require("openai");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Zod schema for Untangle situation output
const SituationExtractionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  facts: z.array(z.string()),
  emotions: z.array(z.string()),
  assumptions: z.array(z.string()),
  fears: z.array(z.string()),
  needs: z.array(z.string()),
  decisions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  themes: z.array(z.string()),
});

// Zod schema for Reality Check
const RealityCheckSchema = z.object({
  claim: z.string(),
  evidenceFor: z.array(z.string()),
  evidenceAgainst: z.array(z.string()),
  balancedInterpretation: z.string(),
});

// Zod schema for Decision Room
const DecisionSchema = z.object({
  question: z.string(),
  optionA: z.object({
    title: z.string(),
    pros: z.array(z.string()),
    concerns: z.array(z.string()),
  }),
  optionB: z.object({
    title: z.string(),
    pros: z.array(z.string()),
    concerns: z.array(z.string()),
  }),
});

/**
 * 1. UNTANGLE: Structure raw messy text into structured context
 */
async function untangleSituation(rawInput) {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Sanara, a private personal situation intelligence platform.
Your task is to take a messy real-life situation input and extract structured, thoughtful context.
CRITICAL INSTRUCTIONS:
- You are NOT a therapist, chatbot, or quote generator. Do NOT include fluff, apologies, or generic empathy ("I'm sorry you're going through this").
- Focus strictly on analytical extraction:
  1. title: Concise 3-6 word title representing the core dilemma.
  2. summary: A 1-2 sentence objective summary of the situation.
  3. facts: Specific events or statements that objectively occurred.
  4. emotions: Feelings mentioned or clearly implied (e.g. Anxious, Discouraged, Frustrated).
  5. assumptions: What the user is telling themselves or believing without proof ("My manager thinks I'm incompetent").
  6. fears: Underlying risks or catastrophic outcomes the user fears.
  7. needs: What the user actually wants or values (Clarity, Peace of mind, Respect, Confidence).
  8. decisions: Key decision or question facing the user.
  9. openQuestions: Information missing or questions needing investigation.
  10. themes: 1-3 high-level categories (e.g., Work, Internship, Communication, Self-Doubt).

Return strictly valid JSON matching this schema:
{
  "title": "...",
  "summary": "...",
  "facts": ["..."],
  "emotions": ["..."],
  "assumptions": ["..."],
  "fears": ["..."],
  "needs": ["..."],
  "decisions": ["..."],
  "openQuestions": ["..."],
  "themes": ["..."]
}`,
          },
          {
            role: "user",
            content: rawInput,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      const validated = SituationExtractionSchema.parse(parsed);
      return validated;
    } catch (err) {
      console.warn("OpenAI API untangle call failed or fallback triggered:", err.message);
    }
  }

  // Intelligent Heuristic Fallback
  return fallbackUntangle(rawInput);
}

/**
 * Fallback Rule-Based Untangler when OpenAI is absent or offline
 */
function fallbackUntangle(rawInput) {
  const text = rawInput.trim();
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  let title = sentences[0] ? sentences[0].slice(0, 50) : "Untangled Situation";
  if (title.length >= 48) title += "...";

  const facts = [];
  const emotions = [];
  const assumptions = [];
  const fears = [];
  const needs = [];
  const decisions = [];
  const openQuestions = [];
  const themes = [];

  const lower = text.toLowerCase();

  // Emotion keywords
  const emotionMap = {
    anxious: "Anxious",
    anxiety: "Anxiety",
    stressed: "Stressed",
    exhausted: "Exhausted",
    frustrated: "Frustrated",
    overwhelmed: "Overwhelmed",
    scared: "Scared",
    afraid: "Afraid",
    sad: "Sad",
    discouraged: "Discouraged",
    confused: "Confused",
    angry: "Angry",
  };
  Object.keys(emotionMap).forEach((key) => {
    if (lower.includes(key)) emotions.push(emotionMap[key]);
  });
  if (emotions.length === 0) emotions.push("Uncertainty", "Tension");

  // Sentence heuristics
  sentences.forEach((s) => {
    const l = s.toLowerCase();
    if (l.includes("should i") || l.includes("whether to") || l.includes("don't know if")) {
      decisions.push(s);
    } else if (l.includes("maybe i") || l.includes("i think") || l.includes("feel like i'm")) {
      assumptions.push(s);
    } else if (l.includes("scared") || l.includes("afraid") || l.includes("fear") || l.includes("fail")) {
      fears.push(s);
    } else if (l.includes("want") || l.includes("need") || l.includes("hope")) {
      needs.push(s);
    } else {
      facts.push(s);
    }
  });

  if (decisions.length === 0) {
    decisions.push(`What is the best next step regarding "${title}"?`);
  }
  if (assumptions.length === 0) {
    assumptions.push("I am interpreting the current circumstances as a permanent setback.");
  }
  if (fears.length === 0) {
    fears.push("Uncertainty about future outcomes or potential failure.");
  }
  if (needs.length === 0) {
    needs.push("Clarity on priorities and peace of mind.");
  }

  openQuestions.push(
    "Is this a temporary situation or a recurring pattern?",
    "Have I communicated my concerns directly with the parties involved?",
    "What key information am I missing right now?"
  );

  if (lower.includes("internship") || lower.includes("job") || lower.includes("manager") || lower.includes("boss") || lower.includes("work")) {
    themes.push("Career", "Work dynamics");
  } else if (lower.includes("friend") || lower.includes("relationship") || lower.includes("partner") || lower.includes("family")) {
    themes.push("Relationships");
  } else if (lower.includes("exam") || lower.includes("class") || lower.includes("college") || lower.includes("grade")) {
    themes.push("Education", "Academic stress");
  } else {
    themes.push("Personal Growth");
  }

  return {
    title,
    summary: text.length > 150 ? text.slice(0, 147) + "..." : text,
    facts: facts.slice(0, 4),
    emotions: [...new Set(emotions)],
    assumptions: assumptions.slice(0, 3),
    fears: fears.slice(0, 3),
    needs: needs.slice(0, 3),
    decisions: decisions.slice(0, 2),
    openQuestions,
    themes,
  };
}

/**
 * 2. REALITY CHECK: Separate Claims from Evidence & Provide Balanced View
 */
async function performRealityCheck(claimText, facts = []) {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Sanara's Reality Check engine.
Given a claim/interpretation and recorded facts, analyze the claim objectively.
Do NOT present AI output as absolute truth. Use non-judgmental, grounded language:
- "Based on what you've recorded..."
- "One possible interpretation..."
- "You may want to consider..."

Return strictly valid JSON:
{
  "claim": "...",
  "evidenceFor": ["..."],
  "evidenceAgainst": ["..."],
  "balancedInterpretation": "..."
}`,
          },
          {
            role: "user",
            content: `Claim: "${claimText}"\nFacts recorded: ${JSON.stringify(facts)}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return RealityCheckSchema.parse(parsed);
    } catch (err) {
      console.warn("Reality check OpenAI failed:", err.message);
    }
  }

  // Fallback Reality Check
  return {
    claim: claimText,
    evidenceFor: facts.length > 0 ? facts.slice(0, 2) : ["Specific past events that triggered this reaction."],
    evidenceAgainst: [
      "You don't currently have complete information to confirm this interpretation.",
      "Alternative explanations or alternative motives may be present.",
    ],
    balancedInterpretation: `Based on what you've recorded, "${claimText}" is one possible interpretation, but it may overgeneralize the available evidence.`,
  };
}

/**
 * 3. DECISION ROOM: Generate Option A vs Option B comparison
 */
async function buildDecisionRoom(situationSummary, decisionText) {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Sanara's Decision Room engine.
Help structure a key decision into two clear options (Option A vs Option B) with Pros and Concerns.
Do NOT make the decision for the user. Present transparent choices.

Return strictly valid JSON:
{
  "question": "...",
  "optionA": { "title": "...", "pros": ["..."], "concerns": ["..."] },
  "optionB": { "title": "...", "pros": ["..."], "concerns": ["..."] }
}`,
          },
          {
            role: "user",
            content: `Situation: ${situationSummary}\nDecision Question: ${decisionText}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return DecisionSchema.parse(parsed);
    } catch (err) {
      console.warn("Decision Room OpenAI failed:", err.message);
    }
  }

  // Fallback Decision Builder
  const question = decisionText || "What decision are you considering?";
  return {
    question,
    optionA: {
      title: "Maintain Current Path / Stay",
      pros: ["Preserves stability and existing experience", "Avoids immediate disruption", "Allows time for further observation"],
      concerns: ["Continued stress or unresolved friction", "May delay necessary changes"],
    },
    optionB: {
      title: "Change Course / Leave",
      pros: ["Immediate relief from current friction", "Opens space for new opportunities", "Restores sense of autonomy"],
      concerns: ["Short-term uncertainty", "Requires navigating transition period"],
    },
  };
}

/**
 * 4. EMBEDDINGS & SIMILARITY SEARCH ("You Were Here Before")
 */
async function generateEmbedding(text) {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return response.data[0].embedding;
    } catch (err) {
      console.warn("Embedding generation failed:", err.message);
    }
  }
  return [];
}

function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function calculateTextSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().match(/\w+/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/\w+/g) || []);
  if (words1.size === 0 || words2.size === 0) return 0;
  let intersection = 0;
  words1.forEach((w) => {
    if (words2.has(w)) intersection++;
  });
  return (2 * intersection) / (words1.size + words2.size);
}

/**
 * 5. CONVERSATION SIMULATOR
 */
async function simulateConversationStep(context, userMessage, style = "Calm") {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are simulating a conversation partner in a practice simulation for Sanara.
Style requested: ${style} (Calm, Direct, Gentle, or Honest but firm).
Provide a realistic response that the other person might say, followed by a brief reflection note on how it landed.

Return JSON:
{
  "simulatedResponse": "...",
  "reflectionTip": "..."
}`,
          },
          {
            role: "user",
            content: `Context: ${context}\nUser said: "${userMessage}"`,
          },
        ],
        response_format: { type: "json_object" },
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.warn("Conversation simulator failed:", err.message);
    }
  }

  return {
    simulatedResponse: `I hear what you're saying about this. Can you tell me more about what you'd like to see change going forward?`,
    reflectionTip: `Notice how keeping a ${style.toLowerCase()} tone allows the other person to listen without immediately going on the defensive.`,
  };
}

/**
 * 6. PATTERN DETECTION: Identify recurring themes distinguishing Observed from Interpreted
 */
async function detectUserPatterns(situations = []) {
  if (!situations || situations.length === 0) {
    return [];
  }

  const themeCounts = {};
  const emotionCounts = {};

  situations.forEach((sit) => {
    (sit.themes || []).forEach((t) => {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    });
    (sit.emotions || []).forEach((e) => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    });
  });

  const patterns = [];

  Object.entries(themeCounts).forEach(([theme, count]) => {
    if (count >= 1) {
      patterns.push({
        theme,
        occurrences: count,
        observed: `The theme '${theme}' appeared across ${count} situation${count === 1 ? "" : "s"}.`,
        interpretation: `Situations regarding ${theme.toLowerCase()} may be an active area where you frequently evaluate your progress or experience friction.`,
      });
    }
  });

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count >= 2) {
      patterns.push({
        theme: emotion,
        occurrences: count,
        observed: `The emotion '${emotion}' was recorded in ${count} separate situations.`,
        interpretation: `Feeling ${emotion.toLowerCase()} appears to accompany multiple recent dilemmas, suggesting a recurring emotional pattern worth noticing.`,
      });
    }
  });

  return patterns.sort((a, b) => b.occurrences - a.occurrences).slice(0, 5);
}

/**
 * 7. ASK SANARA: Query user's personal journal history with grounded responses & actionable suggestions
 */
async function askSanaraHistory(query, situations = [], outcomes = []) {
  if (!situations || situations.length === 0) {
    return {
      answer: "I don't have any recorded situations in your personal thinking space yet. Untangle your first situation to start building your personal intelligence history.",
      relevantRecords: [],
    };
  }

  const queryLower = query.toLowerCase();

  // Find relevant situations matching title, rawInput, summary, themes, or emotions
  let matches = situations.filter((sit) => {
    const fullText = [
      sit.title || "",
      sit.summary || "",
      sit.rawInput || "",
      ...(sit.themes || []),
      ...(sit.emotions || []),
      ...(sit.facts || []),
      ...(sit.assumptions || []),
    ].join(" ").toLowerCase();

    const words = queryLower.split(/\s+/).filter((w) => w.length > 2);
    return words.some((w) => fullText.includes(w));
  });

  if (matches.length === 0) {
    matches = situations.slice(0, 4); // Fall back to most recent entries
  }

  // 1. LIVE OPENAI AI OVERVIEW GENERATION
  if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
    try {
      const historyContext = situations
        .map(
          (s, idx) =>
            `[Record #${idx + 1}] ID: ${s._id} | Title: "${s.title}" | Date: ${new Date(s.createdAt).toLocaleDateString()} | Stage: ${s.currentStage || s.status} | Themes: ${(s.themes || []).join(", ")} | Emotions: ${(s.emotions || []).join(", ")} | Summary: "${s.summary || s.rawInput.slice(0, 150)}" | Facts: ${(s.facts || []).join("; ")} | Assumptions: ${(s.assumptions || []).join("; ")}`
        )
        .join("\n");

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Sanara's Personal Situation Intelligence engine.
Your task is to answer the user's question STRICTLY AND EXCLUSIVELY based on their recorded personal journal and thinking history below.

STRICT MANDATES:
1. ONLY use information contained within the provided user journal records. Do NOT hallucinate external facts or invent scenarios outside their journal.
2. Directly answer their question using specific citations (cite exact entry titles, dates, themes, and recorded emotions).
3. PROVIDE ACTIONABLE SUGGESTIONS & IDEAS: After providing the journal overview, include a dedicated section titled "💡 Suggestions & Ideas Based On Your Journal History" where you suggest 2-3 thoughtful perspective shifts or actionable steps tailored to their past patterns.
4. Maintain a warm, grounded, and non-judgmental tone ("Based on your journal history...", "Across your recorded entries...").`,
          },
          {
            role: "user",
            content: `User Journal History:\n${historyContext}\n\nUser Question: "${query}"`,
          },
        ],
        temperature: 0.3,
      });

      return {
        answer: response.choices[0].message.content,
        relevantRecords: matches.slice(0, 4).map((r) => ({ id: r._id, title: r.title, createdAt: r.createdAt })),
      };
    } catch (err) {
      console.warn("Ask Sanara OpenAI query failed, falling back to smart engine:", err.message);
    }
  }

  // 2. INTELLIGENT DEEP FALLBACK ENGINE (STRICTLY JOURNAL BASED + SUGGESTIONS)
  const total = situations.length;
  const topMatch = matches[0];
  const dateStr = new Date(topMatch.createdAt).toLocaleDateString();

  if (queryLower.includes("felt") || queryLower.includes("emotion") || queryLower.includes("feeling") || queryLower.includes("before") || queryLower.includes("anxious") || queryLower.includes("fear")) {
    const allEmotions = Array.from(new Set(situations.flatMap((s) => s.emotions || [])));
    const emotionSummary = allEmotions.length > 0 ? allEmotions.join(", ") : "uncertainty and reflection";

    const overview = `Based exclusively on your ${total} recorded journal situation(s), you have experienced recurring emotional themes of ${emotionSummary}.\n\nSpecifically, in "${topMatch.title}" (recorded ${dateStr}), you expressed feelings regarding "${topMatch.summary || topMatch.rawInput.slice(0, 100)}". ${matches.length > 1 ? `Similar emotional threads were also present in "${matches[1].title}".` : ""}\n\nSanara noticed that these feelings often surface during key decision points and transitional stages.\n\n💡 Suggestions & Ideas Based On Your Journal History:\n1. Revisit your facts vs assumptions in "${topMatch.title}" — notice how taking space reduced your initial anxiety.\n2. When facing similar emotions, practice setting a clear timeframe in the Decision Room before taking action.`;

    return {
      answer: overview,
      relevantRecords: matches.slice(0, 4).map((r) => ({ id: r._id, title: r.title, createdAt: r.createdAt })),
    };
  }

  if (queryLower.includes("repeat") || queryLower.includes("pattern") || queryLower.includes("again") || queryLower.includes("happen")) {
    const themesCount = {};
    situations.flatMap((s) => s.themes || []).forEach((t) => {
      themesCount[t] = (themesCount[t] || 0) + 1;
    });

    const topThemes = Object.entries(themesCount).sort((a, b) => b[1] - a[1]);
    const topThemeName = topThemes.length > 0 ? topThemes[0][0] : "CAREER";

    const overview = `Looking strictly across your recorded journal history, the most frequently recurring theme is "#${topThemeName.toUpperCase()}" (appearing in ${topThemes[0]?.[1] || 1} situation(s)).\n\nKey recurring journal entries include:\n• "${topMatch.title}" (${dateStr})\n${matches[1] ? `• "${matches[1].title}" (${new Date(matches[1].createdAt).toLocaleDateString()})\n` : ""}\nSanara noticed you tend to evaluate these situations when feeling uncertain about long-term direction.\n\n💡 Suggestions & Ideas Based On Your Journal History:\n1. Break down recurring friction in "${topMatch.title}" by separating objective facts from assumptions.\n2. Use the Reality Check tool to test whether your underlying beliefs are grounded in evidence or temporary stress.`;

    return {
      answer: overview,
      relevantRecords: matches.slice(0, 4).map((r) => ({ id: r._id, title: r.title, createdAt: r.createdAt })),
    };
  }

  // General comprehensive synthesis with strictly journal-based suggestions
  const overviewList = matches.map((m) => `• "${m.title}" (${new Date(m.createdAt).toLocaleDateString()}): ${m.summary || m.rawInput.slice(0, 90)}`).join("\n");
  const answerText = `Here is an overview based strictly on your ${total} recorded journal entry(ies):\n\n${overviewList}\n\nAcross these entries, Sanara observes a consistent pattern of seeking clarity when experiencing transitional friction.\n\n💡 Suggestions & Ideas Based On Your Journal History:\n1. Compare how you resolved previous situations with your current active thread "${topMatch.title}".\n2. Use the Decision Room to map out explicit trade-offs and priorities for open choices.`;

  return {
    answer: answerText,
    relevantRecords: matches.slice(0, 4).map((r) => ({ id: r._id, title: r.title, createdAt: r.createdAt })),
  };
}

module.exports = {
  untangleSituation,
  performRealityCheck,
  buildDecisionRoom,
  generateEmbedding,
  calculateCosineSimilarity,
  calculateTextSimilarity,
  simulateConversationStep,
  detectUserPatterns,
  askSanaraHistory,
};

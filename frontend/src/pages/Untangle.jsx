import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { situationService } from "../services/situationService";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Clock,
  HelpCircle,
  FileText,
  Heart,
  AlertTriangle,
  Compass,
} from "lucide-react";

const STARTER_PROMPTS = [
  "Something happened at work...",
  "I'm unsure whether I should...",
  "I keep thinking about...",
  "I don't understand why I feel...",
];

export default function Untangle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [rawInput, setRawInput] = useState(location.state?.rawInput || "");
  const [processing, setProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const wordCount = rawInput.trim() ? rawInput.trim().split(/\s+/).length : 0;
  const charCount = rawInput.length;

  const handleUntangleSubmit = async (e) => {
    e.preventDefault();
    if (!rawInput.trim()) return;

    setProcessing(true);
    setError("");
    setStepIndex(0);

    const timer1 = setTimeout(() => setStepIndex(1), 600);
    const timer2 = setTimeout(() => setStepIndex(2), 1200);

    try {
      const data = await situationService.untangle(rawInput);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setStepIndex(2);
      setTimeout(() => {
        setAnalysisResult(data);
        showToast("Situation untangled successfully", "success");
      }, 400);
    } catch (err) {
      console.error("Untangle failed:", err);
      setError("We encountered an issue untangling your text. Your input is preserved below.");
      showToast("Untangle failed. Your input was saved.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pt-2">
      {/* ── Page Header ── */}
      <div className="space-y-2">
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">✦ UNTANGLE / 01</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">
          What’s taking up space in your mind?
        </h1>
        <p className="font-serif italic text-base text-[var(--text-secondary)]">
          "Start messy. You don't have to make sense of it yet."
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!analysisResult ? (
          /* ══════════════════════════════════════════
             WRITING DESK CONTAINER
             ══════════════════════════════════════════ */
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <form onSubmit={handleUntangleSubmit}>
              <div className="pinterest-card overflow-hidden bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-md relative">
                {/* Subtle top sky blue gradient bar */}
                <div className="h-2 w-full bg-gradient-to-r from-[var(--sky-primary)] via-[var(--sky-deep)] to-[var(--sky-hover)]" />

                <div className="p-7 sm:p-9 space-y-4">
                  {/* Status header */}
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[var(--sky-deep)]" />
                      <span className="font-bold text-[var(--sky-deep)]">Autosaved</span>
                    </div>
                    {rawInput.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setRawInput("")}
                        className="btn-sky-ghost text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Clear text
                      </button>
                    )}
                  </div>

                  {/* Main Textarea */}
                  <textarea
                    rows={8}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Tell me what's going on... (Start messy, grammar doesn't matter)"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      resize: "none",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)",
                      lineHeight: 1.65,
                      caretColor: "var(--sky-deep)",
                    }}
                  />

                  {/* Word & Character Count */}
                  <div className="flex items-center justify-between pt-3 text-xs border-t border-[var(--border-subtle)] text-[var(--text-muted)] font-bold">
                    <span>
                      {wordCount} words · {charCount} characters
                    </span>
                    <span className="hidden sm:inline italic text-[var(--text-muted)]">
                      Press ✦ Untangle this when ready
                    </span>
                  </div>
                </div>

                {/* Processing State Overlay / Bottom Bar */}
                {processing ? (
                  <div className="p-6 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] space-y-3">
                    <p className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
                      UNDERSTANDING YOUR SITUATION
                    </p>
                    <div className="space-y-2 text-xs font-bold">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[var(--text-primary)]">Reading what happened</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {stepIndex >= 1 ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-[var(--sky-primary)] animate-pulse" />
                        )}
                        <span className={stepIndex >= 1 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
                          Separating the pieces
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {stepIndex >= 2 ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky-deep)] animate-ping ml-0.5" />
                        )}
                        <span className={stepIndex >= 2 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
                          Looking for what's unclear
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 sm:px-9 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                    <p className="text-xs italic font-serif text-[var(--text-secondary)] font-medium">
                      "Sanara doesn't tell you what to think. It helps you see what you're thinking."
                    </p>
                    <button
                      type="submit"
                      disabled={!rawInput.trim() || processing}
                      className="btn-sky-primary text-xs py-3 px-6 shrink-0 w-full sm:w-auto font-bold shadow-md group cursor-pointer"
                    >
                      <span>✦ Untangle this</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Error banner */}
            {error && (
              <div className="sky-card p-4 text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                {error}
              </div>
            )}

            {/* STARTER PROMPTS */}
            <div className="pinterest-card p-6 space-y-3 bg-[var(--card-bg)] border-[var(--border-subtle)]">
              <p className="eyebrow-xs text-[var(--text-muted)] font-extrabold">TRY STARTING WITH</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setRawInput((prev) => (prev ? prev + " " + prompt : prompt))}
                    className="p-3.5 rounded-2xl text-left text-xs transition-all cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--sky-primary)] text-[var(--text-primary)] font-serif italic font-bold"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════
             AI ANALYSIS PAGE
             ══════════════════════════════════════════ */
          <motion.div
            key="analysis-breakdown"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Analysis Header */}
            <div className="space-y-1 border-b border-[var(--border-subtle)] pb-4">
              <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">UNTANGLED / 01</p>
              <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">
                Let's separate the pieces.
              </h2>
            </div>

            {/* Original Input Quote Card */}
            <div className="pinterest-card p-6 space-y-2 bg-[var(--card-bg)] border-[var(--border-subtle)]">
              <span className="eyebrow-xs text-[var(--text-muted)] font-extrabold">YOUR ORIGINAL INPUT</span>
              <p className="font-serif italic text-sm text-[var(--text-primary)] leading-relaxed font-bold">
                "{analysisResult.situation?.rawInput || rawInput}"
              </p>
            </div>

            {/* FOUR MAJOR ANALYSIS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. FACTS */}
              <div className="pinterest-card p-6 space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--sky-deep)]" />
                    <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">FACTS</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">What actually happened</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-primary)] font-bold">
                  {(analysisResult.situation?.facts || ["Situation statement recorded."]).map(
                    (fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-primary)] mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* 2. FEELINGS */}
              <div className="pinterest-card p-6 space-y-4 bg-[var(--card-bg)] border-purple-500/30">
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="eyebrow-xs text-purple-600 dark:text-purple-400 font-extrabold">FEELINGS</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">What you're experiencing</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(analysisResult.situation?.emotions || ["Anxiety", "Frustration", "Self-doubt"]).map(
                    (feeling, idx) => (
                      <span key={idx} className="tag-lavender px-3 py-1 text-xs">
                        {feeling}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* 3. ASSUMPTIONS */}
              <div className="pinterest-card p-6 space-y-4 bg-[var(--card-bg)] border-rose-500/30">
                <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span className="eyebrow-xs text-rose-600 dark:text-rose-400 font-extrabold">ASSUMPTIONS</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">What your mind may be adding</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-primary)]">
                  {(analysisResult.situation?.assumptions || ["Interpreting event as permanent failure."]).map(
                    (assumption, idx) => (
                      <li key={idx} className="font-serif italic text-[var(--text-primary)] font-bold">
                        "{assumption}"
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* 4. UNCERTAINTIES */}
              <div className="pinterest-card p-6 space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[var(--sky-deep)]" />
                    <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">UNCERTAINTIES</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">What we don't know yet</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-primary)] font-bold">
                  {(analysisResult.situation?.openQuestions || ["Information missing or unconfirmed."]).map(
                    (q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--sky-deep)] font-bold">?</span>
                        <span>{q}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* MAIN CONCERN CARD */}
            <div className="pinterest-card p-7 space-y-3 bg-gradient-to-r from-[var(--sky-deep)] to-[var(--sky-primary)] text-white shadow-lg">
              <span className="eyebrow-xs text-white/90 tracking-widest text-[10px] font-extrabold">MAIN CONCERN</span>
              <p className="font-serif text-lg sm:text-xl font-bold leading-relaxed">
                "{analysisResult.situation?.summary || "You're questioning what this situation says about your confidence and future."}"
              </p>
            </div>

            {/* THEMES */}
            {analysisResult.situation?.themes?.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="eyebrow-xs text-[var(--text-muted)] font-extrabold">THEMES:</span>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.situation.themes.map((theme, i) => (
                    <span key={i} className="tag-sky">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setRawInput("");
                }}
                className="btn-sky-secondary text-xs py-2.5 px-5 font-bold cursor-pointer"
              >
                ← Untangle Another Situation
              </button>

              <Link
                to={`/threads/${analysisResult.situation?._id}`}
                className="btn-sky-primary text-xs py-3 px-6 font-bold shadow-md group"
              >
                <span>Save as Thread →</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

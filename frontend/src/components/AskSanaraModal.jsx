import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Send, ArrowUpRight, BookOpen } from "lucide-react";
import { situationService } from "../services/situationService";
import { Link } from "react-router-dom";

const SUGGESTIONS = [
  "Have I felt this way before?",
  "What situations keep repeating?",
  "When was I most confident?",
  "What changed between these situations?",
  "What patterns keep showing up?",
];

export default function AskSanaraModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAsk = async (textToSubmit) => {
    const q = textToSubmit || query;
    if (!q.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await situationService.askSanara(q);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to retrieve history context.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.24 }}
          className="pinterest-card w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border-[var(--border-strong)] bg-[var(--card-bg)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--sky-soft)] text-[var(--sky-deep)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">Ask Sanara</h3>
                <p className="text-xs text-[var(--text-secondary)] font-bold">Query your recorded thinking history</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Input & Suggestions */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Ask about your own thinking history..."
                  className="input-sky flex-1 font-bold"
                />
                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !query.trim()}
                  className="btn-sky-primary px-5 shrink-0 font-bold shadow-xs cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      setQuery(sug);
                      handleAsk(sug);
                    }}
                    className="pinterest-pill text-xs font-bold"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-line font-bold">
                  {result.answer}
                </div>

                {result.relevantRecords && result.relevantRecords.length > 0 && (
                  <div className="space-y-2">
                    <p className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">
                      RELEVANT THREADS CITED:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.relevantRecords.map((rec) => (
                        <Link
                          key={rec.id}
                          to={`/threads/${rec.id}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--sky-primary)] text-xs font-bold text-[var(--text-primary)] transition-colors shadow-xs group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen className="w-3.5 h-3.5 text-[var(--sky-deep)] shrink-0" />
                            <span className="truncate">{rec.title}</span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--sky-deep)] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

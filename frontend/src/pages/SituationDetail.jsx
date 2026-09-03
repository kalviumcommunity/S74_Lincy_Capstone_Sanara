import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { situationService } from "../services/situationService";
import { useToast } from "../context/ToastContext";
import { SkeletonTimeline } from "../components/SkeletonLoader";
import {
  CheckSquare,
  Square,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertTriangle,
  Heart,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SituationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updateInput, setUpdateInput] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [actualOutcome, setActualOutcome] = useState("");
  const [learned, setLearned] = useState("");
  const [resolving, setResolving] = useState(false);

  const [showSimModal, setShowSimModal] = useState(false);
  const [simMessage, setSimMessage] = useState("");
  const [simStyle, setSimStyle] = useState("Calm");
  const [simHistory, setSimHistory] = useState([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await situationService.getSituation(id);
      setData(res);
    } catch (e) {
      console.error("Fetch detail error:", e);
      showToast("Failed to load situation details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActionItem = async (idx) => {
    if (!data?.thread) return;
    const next = [...(data.thread.actionItems || [])];
    if (next[idx]) {
      next[idx].completed = !next[idx].completed;
      try {
        const updated = await situationService.updateThreadActionItems(data.thread._id, {
          actionItems: next,
        });
        setData((p) => ({ ...p, thread: updated }));
        showToast("Action item updated", "info");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!updateInput.trim() || !data?.thread) return;
    setPostingUpdate(true);
    try {
      const updatedThread = await situationService.addThreadUpdate(
        data.thread._id,
        updateInput.trim()
      );
      setData((p) => ({ ...p, thread: updatedThread }));
      setUpdateInput("");
      showToast("Progress update recorded", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to post update", "error");
    } finally {
      setPostingUpdate(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setResolving(true);
    try {
      await situationService.resolveSituation(id, {
        expectedOutcome,
        actionTaken,
        actualOutcome,
        learned,
      });
      setShowResolveModal(false);
      showToast("Situation resolved & stored in archive", "success");
      navigate("/resolved");
    } catch (e) {
      console.error(e);
      showToast("Failed to resolve situation", "error");
    } finally {
      setResolving(false);
    }
  };

  const handleSimulateStep = async (e) => {
    e.preventDefault();
    if (!simMessage.trim()) return;
    setSimulating(true);
    try {
      const res = await situationService.simulateConversation({
        context: data?.situation?.title || "Difficult conversation",
        userMessage: simMessage,
        style: simStyle,
      });
      setSimHistory((p) => [
        ...p,
        { role: "user", text: simMessage },
        { role: "partner", text: res.simulatedResponse, tip: res.reflectionTip },
      ]);
      setSimMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonTimeline />
      </div>
    );
  }

  if (!data?.situation) {
    return (
      <div className="sky-card p-12 text-center space-y-4 bg-white">
        <p className="font-serif text-lg text-slate-800">Situation thread not found.</p>
        <Link to="/threads" className="btn-sky-secondary text-xs py-2 px-5 inline-flex">
          ← Return to Threads
        </Link>
      </div>
    );
  }

  const { situation, thread, reflections, decision, outcome } = data;
  const isResolved = situation.status === "resolved";
  const category = situation.themes?.[0] || "CAREER";

  return (
    <div className="space-y-10">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/threads"
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Threads</span>
        </Link>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isResolved
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-sky-100 text-sky-800 border border-sky-200"
          }`}
        >
          ● {isResolved ? "Resolved" : situation.currentStage || "Reflecting"}
        </span>
      </div>

      {/* ── Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pinterest-card p-8 sm:p-10 space-y-6 bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-sm"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
              THREAD / {category.toUpperCase()}
            </span>
            <span className="text-xs text-[var(--text-muted)]">•</span>
            <span className="text-xs text-[var(--text-muted)] font-bold">
              Started{" "}
              {new Date(situation.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight">
            {situation.title}
          </h1>
        </div>

        {/* SITUATION SUMMARY QUOTE BLOCK */}
        {situation.summary && (
          <div className="p-6 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] font-serif italic text-base text-[var(--text-secondary)] leading-relaxed font-bold">
            "{situation.summary}"
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <Link to={`/threads/${id}/reality-check`} className="btn-sky-secondary text-xs py-2 px-4 font-bold">
            <span>Reality Check</span>
          </Link>
          <Link to={`/threads/${id}/decision`} className="btn-sky-secondary text-xs py-2 px-4 font-bold">
            <span>Decision Room</span>
          </Link>
          <button
            onClick={() => setShowSimModal(true)}
            className="btn-sky-secondary text-xs py-2 px-4 cursor-pointer font-bold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Practice Conversation</span>
          </button>

          {!isResolved && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="btn-sky-primary text-xs py-2 px-4 ml-auto cursor-pointer font-bold shadow-xs"
            >
              ✓ Resolve Situation
            </button>
          )}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          THINKING TIMELINE (#12)
          ══════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <h2 className="section-title text-slate-800">Thinking Timeline</h2>
          <span className="text-xs text-slate-400 font-medium">Chronological progression</span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-sky-200">
          {/* Node 01: UNTANGLED */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative space-y-3"
          >
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            </div>

            <div className="flex items-center gap-2">
              <span className="eyebrow-xs text-sky-700">01 · UNTANGLED</span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date(situation.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="sky-card p-6 bg-sky-50/50 border-sky-100 space-y-2">
              <p className="eyebrow-xs text-slate-400 text-[10px]">ORIGINAL SITUATION</p>
              <p className="font-serif italic text-sm text-slate-700 leading-relaxed">
                "{situation.rawInput}"
              </p>
            </div>
          </motion.div>

          {/* Node 02: SANARA ANALYSIS */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative space-y-3"
          >
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            </div>

            <span className="eyebrow-xs text-sky-700">02 · SANARA ANALYSIS</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="sky-card p-5 bg-white space-y-2 border-sky-100">
                <span className="eyebrow-xs text-sky-700 text-[10px]">FACTS</span>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {situation.facts?.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-500">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sky-card p-5 bg-purple-50/30 space-y-2 border-purple-100">
                <span className="eyebrow-xs text-purple-700 text-[10px]">FEELINGS</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {situation.emotions?.map((e, i) => (
                    <span key={i} className="tag-lavender text-[10px]">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sky-card p-5 bg-rose-50/30 space-y-2 border-rose-100">
                <span className="eyebrow-xs text-rose-700 text-[10px]">ASSUMPTIONS</span>
                <ul className="space-y-1.5 text-xs font-serif italic text-slate-800">
                  {situation.assumptions?.map((a, i) => (
                    <li key={i}>"{a}"</li>
                  ))}
                </ul>
              </div>

              <div className="sky-card p-5 bg-slate-50 space-y-2 border-slate-200">
                <span className="eyebrow-xs text-slate-600 text-[10px]">UNCERTAINTIES</span>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                  {situation.openQuestions?.map((q, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-bold">?</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Node 03: REFLECTION / REALITY CHECK (If exists) */}
          {reflections?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="relative space-y-3"
            >
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>

              <span className="eyebrow-xs text-purple-700">03 · REFLECTION</span>

              <div className="sky-card p-6 bg-purple-50/40 border-purple-100 space-y-3">
                <p className="font-serif italic text-base text-slate-800">
                  "{reflections[0].balancedInterpretation || reflections[0].claim}"
                </p>
              </div>
            </motion.div>
          )}

          {/* Node 04: UPDATES POSTED */}
          {thread?.updates?.length > 0 &&
            thread.updates.map((upd, idx) => (
              <motion.div
                key={upd._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative space-y-2"
              >
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="eyebrow-xs text-amber-700">
                    UPDATE #{idx + 1} · {new Date(upd.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="sky-card p-6 bg-white space-y-2 border-sky-100">
                  <p className="text-sm font-serif italic text-slate-800">"{upd.content}"</p>
                  {upd.aiShiftNote && (
                    <p className="text-xs text-sky-700 font-semibold pt-1">
                      ✦ {upd.aiShiftNote}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

          {/* Node 05: DECISION ROOM RECORDED */}
          {decision?.selectedOption && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="relative space-y-2"
            >
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              </div>

              <span className="eyebrow-xs text-sky-700">05 · DECISION ROOM</span>

              <div className="sky-card p-6 bg-sky-50/60 border-sky-200 space-y-2">
                <p className="font-serif font-semibold text-base text-slate-800">
                  Option Chosen: "{decision.selectedOption}"
                </p>
                {decision.reasoning && (
                  <p className="text-xs italic font-serif text-slate-600">
                    "{decision.reasoning}"
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Node 06: RESOLUTION */}
          {outcome && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="relative space-y-2"
            >
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-600" />

              <span className="eyebrow-xs text-emerald-700">✓ COMPLETED CHAPTER</span>

              <div className="sky-card p-6 bg-emerald-50/40 border-emerald-200 space-y-2">
                <p className="text-xs font-semibold text-slate-800">
                  Action Taken: "{outcome.actionTaken}"
                </p>
                <p className="text-xs font-serif italic text-emerald-900">
                  Learned: "{outcome.learned}"
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Add Progress Update Form */}
      {!isResolved && (
        <form onSubmit={handleAddUpdate} className="sky-card p-7 space-y-4 bg-white border-sky-100">
          <span className="eyebrow-xs text-sky-700">SOMETHING CHANGED? ADD AN UPDATE</span>
          <textarea
            rows={3}
            value={updateInput}
            onChange={(e) => setUpdateInput(e.target.value)}
            placeholder="Record a new development or shift in your thinking..."
            className="input-sky text-xs"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={postingUpdate || !updateInput.trim()}
              className="btn-sky-primary text-xs py-2 px-5"
            >
              <span>{postingUpdate ? "Posting..." : "Add Update"}</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Action Items & Next Steps */}
      {thread?.actionItems?.length > 0 && (
        <div className="sky-card p-7 space-y-4 bg-white border-sky-100">
          <span className="eyebrow-xs text-slate-400">OPEN QUESTIONS & NEXT STEPS</span>
          <div className="space-y-2">
            {thread.actionItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleToggleActionItem(i)}
                className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                  item.completed
                    ? "bg-sky-50/50 border-sky-100 text-slate-400"
                    : "bg-white border-sky-100 hover:border-sky-300 text-slate-800"
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className={`text-xs font-medium ${item.completed ? "line-through" : ""}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {/* Resolve Situation Modal */}
      <AnimatePresence>
        {showResolveModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg pinterest-card p-8 space-y-5 bg-[var(--card-bg)] border-[var(--border-strong)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">CLOSING CHAPTER</span>
                  <h3 className="section-title text-[var(--text-primary)] text-xl font-serif font-bold">Resolve Situation</h3>
                </div>
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    What did you expect would happen?
                  </label>
                  <input
                    type="text"
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                    placeholder='"I thought it would turn out badly."'
                    className="input-sky text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    What action did you take?
                  </label>
                  <input
                    type="text"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder='"I had an honest conversation."'
                    className="input-sky text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">
                    What actually happened?
                  </label>
                  <input
                    type="text"
                    value={actualOutcome}
                    onChange={(e) => setActualOutcome(e.target.value)}
                    placeholder='"We reached a clear agreement."'
                    className="input-sky text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">What did you learn?</label>
                  <textarea
                    rows={3}
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    placeholder='"Feedback isn’t always evidence that I’m failing."'
                    className="input-sky text-xs font-serif italic font-bold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowResolveModal(false)}
                    className="btn-sky-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={resolving} className="btn-sky-primary text-xs py-2 px-5 font-bold cursor-pointer">
                    {resolving ? "Resolving..." : "Confirm & Resolve"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Practice Conversation Simulator Modal */}
      <AnimatePresence>
        {showSimModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg pinterest-card p-6 space-y-4 bg-[var(--card-bg)] border-[var(--border-strong)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="section-title text-[var(--text-primary)] text-xl font-serif font-bold">Practice Conversation</h3>
                <button
                  onClick={() => setShowSimModal(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] font-bold">Tone:</span>
                {["Calm", "Direct", "Gentle", "Honest but firm"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimStyle(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                      simStyle === s
                        ? "bg-[var(--sky-deep)] text-white border-[var(--sky-deep)] shadow-xs"
                        : "bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--sky-primary)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat History Box (HIGH CONTRAST & VISIBLE) */}
              <div className="max-h-60 overflow-y-auto space-y-3 p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                {simHistory.length === 0 ? (
                  <p className="text-center font-serif italic text-xs py-6 text-[var(--text-secondary)] font-bold">
                    Type what you want to say to practice how it might land.
                  </p>
                ) : (
                  simHistory.map((item, i) => (
                    <div
                      key={i}
                      className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[85%] space-y-1">
                        <div
                          className={`p-3 rounded-2xl text-xs font-bold ${
                            item.role === "user"
                              ? "bg-[var(--sky-deep)] text-white"
                              : "bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                          }`}
                        >
                          {item.text}
                        </div>
                        {item.tip && (
                          <p className="text-[10px] italic font-serif text-[var(--sky-deep)] font-extrabold">
                            💡 {item.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSimulateStep} className="flex gap-2">
                <input
                  type="text"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Type message..."
                  className="input-sky text-xs flex-1 font-bold"
                />
                <button
                  type="submit"
                  disabled={!simMessage.trim() || simulating}
                  className="btn-sky-primary text-xs shrink-0 px-4 font-bold shadow-xs cursor-pointer"
                >
                  {simulating ? "..." : "Send"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

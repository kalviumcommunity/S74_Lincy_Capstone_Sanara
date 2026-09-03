import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { situationService } from "../services/situationService";
import { useToast } from "../context/ToastContext";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  HelpCircle,
  CheckCircle,
  ChevronLeft,
  Sparkles,
  ShieldAlert,
  Save,
} from "lucide-react";

export default function RealityCheck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [situation, setSituation] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState("");
  const [customClaim, setCustomClaim] = useState("");
  const [reflection, setReflection] = useState(null);
  const [userResponseText, setUserResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await situationService.getSituation(id);
        setSituation(data.situation);
        if (data.situation?.assumptions?.[0]) {
          setSelectedClaim(data.situation.assumptions[0]);
        } else {
          setSelectedClaim(data.situation?.title || "");
        }
        const rcRef = data.reflections?.find((r) => r.type === "reality_check");
        if (rcRef) setReflection(rcRef);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCheck = async (claimText) => {
    const c = claimText || customClaim || selectedClaim;
    if (!c) return;
    setProcessing(true);
    try {
      const res = await situationService.performRealityCheck(id, c);
      setReflection(res.reflection);
      showToast("Reality check reflection generated", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to complete reality check", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveResponse = (e) => {
    e.preventDefault();
    if (!userResponseText.trim()) return;
    setSaved(true);
    showToast("Reflection saved to situation timeline", "success");
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <SkeletonCard lines={6} />;
  }

  if (!situation) {
    return (
      <div className="pinterest-card p-12 text-center space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
        <p className="font-serif text-lg text-[var(--text-primary)]">Situation not found.</p>
        <Link to="/threads" className="btn-sky-secondary text-xs py-2 px-5 inline-flex font-bold">
          ← Back to Threads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-3">
        <Link
          to={`/threads/${id}`}
          className="text-xs font-bold text-[var(--sky-deep)] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Thread: "{situation.title}"</span>
        </Link>
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">REFLECTION / 02</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Before deciding, sit with this.</h1>
        <p className="font-serif italic text-base text-[var(--text-secondary)]">
          "Sanara helps you separate objective facts from what your mind may be adding."
        </p>
      </div>

      {/* Facts vs Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="pinterest-card p-6 space-y-3 bg-[var(--card-bg)] border-[var(--border-subtle)]">
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">WHAT HAPPENED — Objective Facts</span>
          <p className="font-serif text-sm font-bold text-[var(--text-primary)] leading-snug">
            {situation.facts?.[0] || situation.rawInput?.slice(0, 120) || "Events as stated."}
          </p>
          {situation.facts?.slice(1).map((f, i) => (
            <p key={i} className="text-xs text-[var(--text-secondary)] font-bold">
              • {f}
            </p>
          ))}
        </div>

        <div className="pinterest-card p-6 space-y-3 bg-[var(--card-bg)] border-rose-500/30">
          <span className="eyebrow-xs text-rose-600 dark:text-rose-400 font-extrabold">
            WHAT YOUR MIND MAY BE ADDING — Assumptions
          </span>
          <p className="font-serif italic text-sm font-bold text-rose-700 dark:text-rose-300 leading-snug">
            "{situation.assumptions?.[0] || "Interpretation of the situation."}"
          </p>
          {situation.assumptions?.slice(1).map((a, i) => (
            <p key={i} className="text-xs font-serif italic text-[var(--text-secondary)] font-bold">
              "{a}"
            </p>
          ))}
        </div>
      </div>

      {/* Select Assumption To Examine */}
      <div className="pinterest-card p-7 space-y-5 bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-sm">
        <div className="space-y-1">
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">SELECT BELIEF TO EXAMINE</span>
          <h3 className="section-title text-[var(--text-primary)] text-xl font-serif font-bold">
            Which assumption do you want to test?
          </h3>
        </div>

        {situation.assumptions?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {situation.assumptions.map((a, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedClaim(a);
                  handleCheck(a);
                }}
                className={`text-xs px-3.5 py-2 rounded-2xl transition-all cursor-pointer font-serif italic border ${
                  selectedClaim === a
                    ? "bg-[var(--sky-deep)] text-white border-[var(--sky-deep)] font-bold shadow-xs"
                    : "bg-[var(--bg-canvas)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--sky-primary)]"
                }`}
              >
                "{a.slice(0, 60)}{a.length > 60 ? "..." : ""}"
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customClaim}
            onChange={(e) => setCustomClaim(e.target.value)}
            placeholder="Or type a specific belief (e.g. 'I believe I'm not capable of solving this...')"
            className="input-sky text-xs flex-1 font-serif italic font-bold"
          />
          <button
            onClick={() => handleCheck(customClaim)}
            disabled={processing || (!selectedClaim && !customClaim)}
            className="btn-sky-primary text-xs py-2 px-5 shrink-0 font-bold shadow-xs cursor-pointer"
          >
            <span>{processing ? "Examining..." : "Examine belief →"}</span>
          </button>
        </div>
      </div>

      {/* Grounded Reflection Results & Writing Experience */}
      <AnimatePresence>
        {reflection && (
          <motion.div
            key="reflection-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Grounded Perspective Card */}
            <div className="pinterest-card p-7 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-3 shadow-sm">
              <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">GROUNDED PERSPECTIVE</span>
              <p className="font-serif text-lg sm:text-xl text-[var(--text-primary)] leading-relaxed font-bold">
                "{reflection.balancedInterpretation}"
              </p>
            </div>

            {/* Evidence For vs Evidence Against */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="pinterest-card p-6 space-y-3 bg-[var(--card-bg)] border-emerald-500/30">
                <span className="eyebrow-xs text-emerald-600 dark:text-emerald-400 font-extrabold">EVIDENCE SUPPORTING THIS</span>
                <ul className="space-y-2 text-xs text-[var(--text-primary)] font-bold">
                  {reflection.evidenceFor?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pinterest-card p-6 space-y-3 bg-[var(--card-bg)] border-[var(--border-subtle)]">
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">COUNTER-EVIDENCE TO CONSIDER</span>
                <ul className="space-y-2 text-xs text-[var(--text-primary)] font-bold">
                  {reflection.evidenceAgainst?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--sky-deep)] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Central Serif Question & Writing Area */}
            <div className="pinterest-card p-8 sm:p-10 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm">
              <div className="space-y-2">
                <span className="eyebrow-xs text-purple-600 dark:text-purple-400 font-extrabold">REFLECTION QUESTION</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] leading-snug font-bold">
                  "If you knew you were fully capable, would you still want to leave?"
                </h2>
              </div>

              <form onSubmit={handleSaveResponse} className="space-y-4">
                <textarea
                  rows={6}
                  value={userResponseText}
                  onChange={(e) => setUserResponseText(e.target.value)}
                  placeholder="Write whatever comes up freely..."
                  className="input-sky font-serif italic text-sm font-bold"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    Take your time. No rush to decide.
                  </span>
                  <button
                    type="submit"
                    disabled={!userResponseText.trim()}
                    className="btn-sky-primary text-xs py-2.5 px-6 font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saved ? "✓ Saved" : "Save Reflection"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Transition to Decision Mode */}
            <div className="pinterest-card p-6 bg-gradient-to-r from-[var(--sky-deep)] to-[var(--sky-primary)] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold">Ready to map out your decision?</h4>
                <p className="text-xs text-white/90 font-medium">
                  Weigh options transparently in the Decision Room workspace.
                </p>
              </div>
              <Link
                to={`/threads/${id}/decision`}
                className="btn-sky-secondary text-xs py-3 px-6 shrink-0 font-bold"
              >
                <span>Decision Room →</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

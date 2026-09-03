import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { situationService } from "../services/situationService";
import { useToast } from "../context/ToastContext";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  ChevronLeft,
  Sliders,
  Scale,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

const OPTIONS = [
  {
    id: "STAY",
    title: "STAY",
    subtitle: "Maintain current path & work through friction",
    appeals: "Preserves current stability, income, and existing team relationships.",
    gives: "Continued experience, professional continuity, predictable schedule.",
    costs: "Continued stress or unresolved work dynamics during transition.",
    afraidOf: "That nothing will change and exhaustion will deepen.",
    dontKnow: "Whether feedback will improve with direct communication.",
    pros: ["+ learning", "+ experience", "+ income"],
    cons: ["− exhaustion", "− uncertainty"],
  },
  {
    id: "LEAVE",
    title: "LEAVE",
    subtitle: "Make a clear transition & open new space",
    appeals: "Immediate release from friction and fresh perspective.",
    gives: "Restored energy, freedom, autonomy over future direction.",
    costs: "Short-term uncertainty, financial adjustment, lost experience.",
    afraidOf: "Regretting leaving an opportunity before it played out.",
    dontKnow: "How long finding the next role will take.",
    pros: ["+ energy", "+ freedom"],
    cons: ["− uncertainty", "− lost experience"],
  },
  {
    id: "WAIT",
    title: "WAIT & OBSERVE",
    subtitle: "Set a clear timeframe before deciding",
    appeals: "Gathers more data without making an impulsive move.",
    gives: "Time for emotional clarity, space to evaluate patterns.",
    costs: "Prolongs current ambiguous state for a fixed duration.",
    afraidOf: "Wasting time on a situation that won't change.",
    dontKnow: "Whether external factors will shift over the next month.",
    pros: ["+ perspective", "+ clarity"],
    cons: ["− prolonged ambiguity"],
  },
  {
    id: "OTHER",
    title: "CUSTOM PATH",
    subtitle: "Negotiate a modified arrangement or scope",
    appeals: "Creates a middle ground tailored to your actual needs.",
    gives: "Custom boundaries, potential load reduction.",
    costs: "Requires assertive negotiation and clear boundary setting.",
    afraidOf: "Facing pushback or rejection during conversation.",
    dontKnow: "How flexible leadership is regarding scope changes.",
    pros: ["+ autonomy", "+ custom balance"],
    cons: ["− negotiation effort"],
  },
];

const PRIORITY_KEYS = [
  { key: "career", label: "Career", desc: "Professional trajectory & growth" },
  { key: "energy", label: "Energy", desc: "Mental & physical well-being" },
  { key: "money", label: "Money", desc: "Financial security & compensation" },
  { key: "learning", label: "Learning", desc: "Skill acquisition & challenge" },
  { key: "time", label: "Time", desc: "Schedule freedom & balance" },
  { key: "stability", label: "Stability", desc: "Predictability & peace of mind" },
  { key: "relationships", label: "Relationships", desc: "Team & network connections" },
];

export default function DecisionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [situation, setSituation] = useState(null);
  const [decision, setDecision] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState("STAY");
  const [priorities, setPriorities] = useState({
    career: 50,
    energy: 70,
    money: 50,
    learning: 60,
    time: 50,
    stability: 60,
    relationships: 40,
  });
  const [reasoning, setReasoning] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await situationService.getSituation(id);
        setSituation(data.situation);
        const decRes = await situationService.manageDecision(id, {});
        setDecision(decRes);
        if (decRes.priorities) setPriorities(decRes.priorities);
        if (decRes.selectedOption) setSelectedOptionId(decRes.selectedOption);
        if (decRes.reasoning) setReasoning(decRes.reasoning);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await situationService.manageDecision(id, {
        priorities,
        selectedOption: selectedOptionId,
        reasoning,
      });
      setDecision(updated);
      showToast("Decision recorded in situation timeline", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to save decision", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonCard lines={6} />;
  }

  const selectedOptObj = OPTIONS.find((o) => o.id === selectedOptionId) || OPTIONS[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-3">
        <Link
          to={`/threads/${id}`}
          className="text-xs font-bold text-[var(--sky-deep)] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Thread: "{situation?.title}"</span>
        </Link>
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">DECISION WORKSPACE</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">
          You don't need the perfect answer.
        </h1>
        <p className="font-serif italic text-base text-[var(--text-secondary)]">
          "You need a clearer picture. Laying options on paper makes trade-offs visible."
        </p>
      </div>

      {/* Interactive Option Cards */}
      <div className="space-y-4">
        <h2 className="eyebrow-xs text-[var(--text-muted)] font-extrabold">SELECT OPTION TO EXPLORE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`pinterest-card p-6 cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-[var(--card-bg)] border-[var(--sky-deep)] ring-2 ring-[var(--sky-primary)] shadow-md"
                    : "bg-[var(--card-bg)] border-[var(--border-subtle)] hover:border-[var(--sky-primary)]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">{opt.id}</span>
                    <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                      {opt.title}
                    </h3>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[var(--sky-deep)] text-white flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-bold mt-2">{opt.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Option Detailed Breakdown Card */}
      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm">
        <div className="border-b border-[var(--border-subtle)] pb-3 flex items-center justify-between">
          <div>
            <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">EXPLORING {selectedOptObj.id}</span>
            <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              {selectedOptObj.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
            <span className="eyebrow-xs text-[var(--sky-deep)] text-[10px] font-extrabold">WHY THIS APPEALS TO ME</span>
            <p className="font-bold text-[var(--text-primary)]">{selectedOptObj.appeals}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <span className="eyebrow-xs text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">WHAT IT GIVES ME</span>
            <p className="font-bold text-[var(--text-primary)]">{selectedOptObj.gives}</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <span className="eyebrow-xs text-rose-600 dark:text-rose-400 text-[10px] font-extrabold">WHAT IT COSTS</span>
            <p className="font-bold text-[var(--text-primary)]">{selectedOptObj.costs}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <span className="eyebrow-xs text-amber-600 dark:text-amber-400 text-[10px] font-extrabold">WHAT I'M AFRAID OF</span>
            <p className="font-bold text-[var(--text-primary)]">{selectedOptObj.afraidOf}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] col-span-1 sm:col-span-2 space-y-1">
            <span className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">WHAT I DON'T KNOW YET</span>
            <p className="font-bold text-[var(--text-primary)]">{selectedOptObj.dontKnow}</p>
          </div>
        </div>
      </div>

      {/* MY PRIORITIES WEIGHTING */}
      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Sliders className="w-4 h-4 text-[var(--sky-deep)]" />
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">MY PRIORITIES WEIGHTING</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PRIORITY_KEYS.map(({ key, label, desc }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[var(--text-primary)]">{label}</span>
                  <span className="block text-[10px] text-[var(--text-muted)] font-bold">{desc}</span>
                </div>
                <span className="font-extrabold text-[var(--sky-deep)]">{priorities[key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priorities[key]}
                onChange={(e) =>
                  setPriorities((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
                className="w-full h-2 bg-[var(--bg-canvas)] rounded-lg appearance-none cursor-pointer accent-[var(--sky-deep)] border border-[var(--border-subtle)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* TRADEOFFS BALANCE MATRIX */}
      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Scale className="w-4 h-4 text-[var(--sky-deep)]" />
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">TRADEOFFS BALANCE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {OPTIONS.slice(0, 2).map((opt) => (
            <div
              key={opt.id}
              className={`p-6 rounded-2xl border ${
                selectedOptionId === opt.id
                  ? "bg-[var(--sky-soft)] border-[var(--sky-deep)]"
                  : "bg-[var(--bg-canvas)] border-[var(--border-subtle)]"
              } space-y-3`}
            >
              <h4 className="font-serif font-bold text-[var(--text-primary)] text-lg">{opt.title}</h4>
              <div className="space-y-2 text-xs font-bold">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block mb-1">PROS</span>
                  {opt.pros.map((p, i) => (
                    <span key={i} className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mr-2 mb-1 border border-emerald-500/30">
                      {p}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold block mb-1">CONS</span>
                  {opt.cons.map((c, i) => (
                    <span key={i} className="inline-block px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 mr-2 mb-1 border border-rose-500/30">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SANARA NOTICED OBSERVATION */}
      <div className="pinterest-card p-7 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--sky-deep)]" />
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">SANARA NOTICED</span>
        </div>
        <p className="font-serif italic text-base text-[var(--text-primary)] leading-relaxed font-bold">
          "Your decision seems to involve a tradeoff between protecting your energy and preserving an opportunity."
        </p>
      </div>

      {/* REASONING & SAVE DECISION */}
      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">PERSONAL REASONING</span>
          <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">
            Why are you leaning this way?
          </h3>
        </div>

        <textarea
          rows={4}
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Write freely about your choice and what influenced your decision..."
          className="input-sky text-xs font-serif italic font-bold"
        />

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)] font-bold italic">
            Current choice: <span className="font-extrabold text-[var(--sky-deep)]">{selectedOptionId}</span>
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-sky-primary text-xs py-3 px-6 font-bold shadow-md cursor-pointer"
          >
            <span>{saving ? "Saving..." : "Record Decision →"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

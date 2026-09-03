import React, { useState, useEffect } from "react";
import { situationService } from "../services/situationService";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, BookOpen, Clock } from "lucide-react";

export default function Resolved() {
  const [resolvedItems, setResolvedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await situationService.getSituations("resolved");
        if (isMounted && Array.isArray(data)) {
          const detailed = await Promise.all(
            data.map(async (sit) => {
              try {
                const d = await situationService.getSituation(sit._id);
                return { situation: sit, outcome: d.outcome, decision: d.decision };
              } catch {
                return { situation: sit, outcome: null, decision: null };
              }
            })
          );
          setResolvedItems(detailed);
        }
      } catch (e) {
        console.error("Resolved fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-3">
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">✓ RESOLVED ARCHIVE</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Things you've worked through.</h1>
        <p className="font-serif italic text-base text-[var(--text-secondary)]">
          "Completed chapters from your thinking journey."
        </p>

        {/* Counter Badge */}
        <div className="pt-1">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold inline-flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{resolvedItems.length} COMPLETED CHAPTERS</span>
          </span>
        </div>
      </div>

      {/* Completed Chapter Cards */}
      {loading ? (
        <div className="space-y-6">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      ) : resolvedItems.length === 0 ? (
        <div className="sky-card p-12 text-center space-y-3 bg-[var(--card-bg)] border-[var(--border-subtle)]">
          <BookOpen className="w-8 h-8 text-[var(--sky-deep)] mx-auto" />
          <p className="font-serif text-lg text-[var(--text-primary)]">No completed chapters yet.</p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
            When you resolve a situation thread, it will become a preserved chapter in your archive.
          </p>
          <div className="pt-2">
            <Link to="/threads" className="btn-sky-primary text-xs py-2 px-5 font-bold">
              View Active Threads
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {resolvedItems.map(({ situation, outcome, decision }, idx) => {
            const category = situation.themes?.[0] || "CAREER";
            const dateStr = new Date(situation.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <motion.div
                key={situation._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="pinterest-card overflow-hidden bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-sm"
              >
                {/* Chapter Header */}
                <div className="p-6 sm:p-7 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--card-bg)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
                        #{category.toUpperCase()}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                      {situation.title}
                    </h3>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--sky-deep)]" /> {dateStr}
                  </span>
                </div>

                {/* 4 Pillars Grid: THEN -> WHAT HAPPENED -> NOW -> WHAT I LEARNED */}
                <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* THEN */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                    <span className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">THEN</span>
                    <p className="font-serif italic text-xs text-[var(--text-secondary)] leading-relaxed">
                      "{outcome?.expectedOutcome || "Expected a challenging resolution."}"
                    </p>
                  </div>

                  {/* WHAT HAPPENED */}
                  <div className="p-4 rounded-2xl bg-[var(--sky-soft)] border border-[var(--border-strong)] space-y-1">
                    <span className="eyebrow-xs text-[var(--sky-deep)] text-[10px] font-extrabold">WHAT HAPPENED</span>
                    <p className="font-sans text-xs font-bold text-[var(--text-primary)] leading-relaxed">
                      "{outcome?.actionTaken || "Took direct steps to clarify situation."}"
                    </p>
                  </div>

                  {/* NOW */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <span className="eyebrow-xs text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">NOW</span>
                    <p className="font-sans text-xs font-bold text-[var(--text-primary)] leading-relaxed">
                      "{outcome?.actualOutcome || "Situation concluded."}"
                    </p>
                  </div>

                  {/* WHAT I LEARNED */}
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1">
                    <span className="eyebrow-xs text-purple-600 dark:text-purple-400 text-[10px] font-extrabold">WHAT I LEARNED</span>
                    <p className="font-serif italic text-xs text-[var(--text-primary)] leading-relaxed font-bold">
                      "{outcome?.learned || "Gained insight for future decisions."}"
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-7 py-3.5 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-secondary)] font-bold italic">
                    {decision?.selectedOption
                      ? `Decision: "${decision.selectedOption}"`
                      : "Chapter completed"}
                  </span>
                  <Link
                    to={`/threads/${situation._id}`}
                    className="btn-sky-secondary text-xs py-1.5 px-3.5 font-bold group"
                  >
                    <span>View full chapter</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { situationService } from "../services/situationService";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import {
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  Brain,
  Clock,
  Compass,
  Bookmark,
  Pin,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const [activeSituations, setActiveSituations] = useState([]);
  const [resolvedSituations, setResolvedSituations] = useState([]);
  const [decisionsWaitingCount, setDecisionsWaitingCount] = useState(0);
  const [patternsCount, setPatternsCount] = useState(0);
  const [topPattern, setTopPattern] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [sits, patRes] = await Promise.allSettled([
          situationService.getSituations(),
          situationService.getPatterns(),
        ]);

        if (isMounted) {
          if (sits.status === "fulfilled" && Array.isArray(sits.value)) {
            const all = sits.value;
            const active = all.filter((s) => s.status !== "resolved");
            const resolved = all.filter((s) => s.status === "resolved");
            const dec = active.filter(
              (s) => (s.decisions && s.decisions.length > 0) || s.currentStage === "decision"
            );

            setActiveSituations(active);
            setResolvedSituations(resolved);
            setDecisionsWaitingCount(dec.length);
          }

          if (patRes.status === "fulfilled" && patRes.value?.patterns) {
            const pats = patRes.value.patterns;
            setPatternsCount(pats.length);
            if (pats.length > 0) {
              setTopPattern(pats[0]);
            }
          }
        }
      } catch (e) {
        console.warn("Home data fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pt-2">
      {/* ════════════════════════════════════════
          PINTEREST HERO MOODBOARD BANNER
          ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        className="pinterest-card p-8 sm:p-10 relative overflow-hidden bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-md"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky-deep)] animate-pulse" />
              <p className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">YOUR PERSONAL THINKING BOARD</p>
            </div>

            <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">
              {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Lincy"}.
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
              "What has been taking up space in your mind?"
            </p>
          </div>

          <button
            onClick={() => navigate("/untangle")}
            className="btn-sky-primary py-4 px-7 text-sm font-extrabold shadow-lg shrink-0 group cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Untangle a situation</span>
          </button>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          PINTEREST MOODBOARD METRIC CARDS
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Active Situations Pin */}
        <div className="pinterest-card p-5 space-y-2 bg-[var(--card-bg)] border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">
              {activeSituations.length}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-extrabold">Active Situations</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[var(--sky-soft)] text-[var(--sky-deep)] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Need a Decision Pin */}
        <div className="pinterest-card p-5 space-y-2 bg-[var(--card-bg)] border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">
              {decisionsWaitingCount}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-extrabold">Need a Decision</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Recently Resolved Pin */}
        <div className="pinterest-card p-5 space-y-2 bg-[var(--card-bg)] border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">
              {resolvedSituations.length}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-extrabold">Resolved Chapters</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Patterns Noticed Pin */}
        <div className="pinterest-card p-5 space-y-2 bg-[var(--card-bg)] border-[var(--border-subtle)] flex items-center justify-between shadow-xs">
          <div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{patternsCount}</p>
            <p className="text-xs text-[var(--text-secondary)] font-extrabold">Patterns Noticed</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          PINTEREST FILTER PILLS & PINBOARD GRID
          ════════════════════════════════════════ */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">Your Thinking Pins</h2>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Pins" },
              { id: "active", label: "Active Threads" },
              { id: "resolved", label: "Resolved Chapters" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pinterest-pill ${activeTab === tab.id ? "pinterest-pill-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SkeletonCard lines={4} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={4} />
          </div>
        ) : (
          /* PINTEREST STAGGERED PIN GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* FEATURED THREAD PIN */}
            {activeSituations.map((sit, idx) => {
              const themeTag = sit.themes?.[0] || "CAREER";
              const dateStr = new Date(sit.updatedAt || sit.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={sit._id}
                  className="pinterest-card p-6 flex flex-col justify-between space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between">
                      <span className="tag-sky text-[10px]">#{themeTag.toUpperCase()}</span>
                      <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--sky-deep)]" /> {dateStr}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] leading-snug">
                      {sit.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] font-serif italic line-clamp-3 leading-relaxed">
                      "{sit.summary || sit.rawInput}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--sky-deep)]">
                      ● {sit.currentStage || "Reflecting"}
                    </span>
                    <Link
                      to={`/threads/${sit._id}`}
                      className="btn-sky-secondary text-xs py-1.5 px-4 font-bold"
                    >
                      <span>Continue →</span>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* SANARA NOTICED PATTERN PIN */}
            {topPattern && (
              <div className="pinterest-card p-7 space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="eyebrow-xs text-[var(--sky-deep)] flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--sky-deep)]" /> PATTERN NOTICED
                  </span>
                  <span className="tag-sky text-[10px]">
                    {topPattern.occurrences} OCCURRENCES
                  </span>
                </div>

                <p className="font-serif italic text-base text-[var(--text-primary)] leading-relaxed font-semibold">
                  "{topPattern.interpretation}"
                </p>

                <div className="pt-2">
                  <Link
                    to="/map"
                    className="text-xs font-bold text-[var(--sky-deep)] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore pattern board →</span>
                  </Link>
                </div>
              </div>
            )}

            {/* QUESTION FOR YOU PIN */}
            <div className="pinterest-card p-7 space-y-4 bg-[var(--card-bg)] border-purple-500/30 shadow-sm">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="eyebrow-xs text-purple-600 dark:text-purple-400 font-bold">A QUESTION FOR YOU</span>
              </div>

              <p className="font-serif italic text-lg text-[var(--text-primary)] leading-relaxed font-medium">
                "What would you choose if you didn't need to prove anything?"
              </p>

              <div className="pt-2">
                <Link
                  to="/untangle"
                  className="btn-sky-secondary text-xs py-2 px-4 text-purple-600 dark:text-purple-400 font-bold"
                >
                  <span>Reflect on this →</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

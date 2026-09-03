import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { situationService } from "../services/situationService";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Filter,
  Plus,
  Bookmark,
} from "lucide-react";

export default function Threads() {
  const [situations, setSituations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await situationService.getSituations();
        if (isMounted && Array.isArray(data)) {
          setSituations(data);
        }
      } catch (e) {
        console.error("Threads fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCount = situations.filter((s) => s.status !== "resolved").length;
  const decisionCount = situations.filter(
    (s) => (s.decisions && s.decisions.length > 0) || s.currentStage === "decision"
  ).length;
  const recentlyUpdatedCount = situations.filter(
    (s) => new Date(s.updatedAt || s.createdAt) > new Date(Date.now() - 7 * 86400000)
  ).length;
  const resolvedCount = situations.filter((s) => s.status === "resolved").length;

  const filtered = situations.filter((s) => {
    if (filter === "active") return s.status !== "resolved";
    if (filter === "decision")
      return (s.decisions && s.decisions.length > 0) || s.currentStage === "decision";
    if (filter === "recent")
      return new Date(s.updatedAt || s.createdAt) > new Date(Date.now() - 7 * 86400000);
    if (filter === "resolved") return s.status === "resolved";
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-bold">◇ THINKING THREADS</p>
            <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Things still occupying your mind.</h1>
            <p className="font-serif italic text-base text-[var(--text-secondary)]">
              "Your unresolved situations, kept in one place."
            </p>
          </div>

          <button
            onClick={() => navigate("/untangle")}
            className="btn-sky-primary text-xs py-3 px-5 font-bold shrink-0 self-start sm:self-auto cursor-pointer"
          >
            + New situation
          </button>
        </div>

        {/* Top Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="pinterest-pill text-xs font-bold text-[var(--sky-deep)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky-deep)]" /> Active: {activeCount}
          </span>
          <span className="pinterest-pill text-xs font-bold text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Decision: {decisionCount}
          </span>
          <span className="pinterest-pill text-xs font-bold text-purple-600 dark:text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Recently updated: {recentlyUpdatedCount}
          </span>
          <span className="pinterest-pill text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved: {resolvedCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
        {[
          { id: "all", label: "All Threads" },
          { id: "active", label: "Active" },
          { id: "decision", label: "Decision Pending" },
          { id: "recent", label: "Recently Updated" },
          { id: "resolved", label: "Resolved" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`pinterest-pill ${filter === tab.id ? "pinterest-pill-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Threads Pinboard Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="pinterest-card p-12 text-center space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
          <Layers className="w-8 h-8 text-[var(--sky-deep)] mx-auto" />
          <p className="font-serif text-lg text-[var(--text-primary)]">No matching threads found.</p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
            When something starts taking up space in your mind, untangle it here.
          </p>
          <div className="pt-2">
            <button onClick={() => navigate("/untangle")} className="btn-sky-primary text-xs py-2.5 px-6 font-bold">
              + Untangle something
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filtered.map((sit) => {
            const dateStr = new Date(sit.updatedAt || sit.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const category = sit.themes?.[0] || "CAREER";
            const isRes = sit.status === "resolved";

            return (
              <div
                key={sit._id}
                className="pinterest-card p-6 bg-[var(--card-bg)] border-[var(--border-subtle)] hover:border-[var(--sky-primary)] transition-all h-full flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  {/* Category & Status Pill */}
                  <div className="flex items-center justify-between">
                    <span className="tag-sky text-[10px]">#{category.toUpperCase()}</span>
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        isRes
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-[var(--sky-soft)] text-[var(--sky-deep)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      ● {isRes ? "Resolved" : sit.currentStage || "Reflecting"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] leading-snug">
                    {sit.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[var(--text-secondary)] italic font-serif line-clamp-3 leading-relaxed">
                    "{sit.summary || sit.rawInput}"
                  </p>
                </div>

                {/* Progress Timeline Indicator Bar */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--text-muted)]">
                    <span className="text-[var(--sky-deep)]">Untangled</span>
                    <span className={sit.status !== "untangled" ? "text-[var(--sky-deep)]" : ""}>
                      Reflecting
                    </span>
                    <span className={isRes ? "text-emerald-600 dark:text-emerald-400" : ""}>Decision</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-canvas)] rounded-full overflow-hidden flex border border-[var(--border-subtle)]">
                    <div className="h-full bg-[var(--sky-primary)] w-1/3" />
                    <div
                      className={`h-full ${
                        isRes ? "bg-emerald-500 w-2/3" : "bg-[var(--sky-deep)] w-1/3"
                      }`}
                    />
                  </div>

                  {/* Themes Tags */}
                  {sit.themes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sit.themes.slice(0, 3).map((t, i) => (
                        <span key={i} className="tag-sky text-[10px] py-0.5 px-2.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Row */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[var(--text-muted)] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--sky-deep)]" /> {dateStr}
                    </span>
                    <Link
                      to={`/threads/${sit._id}`}
                      className="btn-sky-secondary text-xs py-1.5 px-4 font-bold group"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

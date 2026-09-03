import React, { useState, useEffect } from "react";
import { situationService } from "../services/situationService";
import { SkeletonCard } from "../components/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MessageSquare,
  Search,
  ArrowRight,
  Eye,
  Lightbulb,
  Compass,
  Layers,
  Heart,
  BookOpen,
} from "lucide-react";

const NODE_COLORS = {
  root: { bg: "#25678B", text: "#FFFFFF", border: "#59A8CF" },
  theme: { bg: "#CCE8F6", text: "#25678B", border: "#7DB9D8" },
  situation: { bg: "#FFFFFF", text: "#15242C", border: "#ACD3E6" },
  emotion: { bg: "#F3EBF7", text: "#4A3E68", border: "#9788B7" },
  outcome: { bg: "#FAF0EE", text: "#72372E", border: "#C9796C" },
};

export default function MyMap() {
  const [mapData, setMapData] = useState({ nodes: [], links: [] });
  const [patterns, setPatterns] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask Sanara state
  const [askQuery, setAskQuery] = useState("");
  const [askResult, setAskResult] = useState(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [d, p] = await Promise.allSettled([
          situationService.getMapData(),
          situationService.getPatterns(),
        ]);

        if (isMounted) {
          if (d.status === "fulfilled" && d.value?.nodes) {
            setMapData(d.value);
            if (d.value.nodes.length > 0) {
              setSelectedNode(d.value.nodes[0]);
            }
          }
          if (p.status === "fulfilled" && p.value?.patterns) {
            setPatterns(p.value.patterns);
          }
        }
      } catch (e) {
        console.error("Map fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    setAsking(true);
    try {
      const res = await situationService.askSanara(askQuery.trim());
      setAskResult(res);
    } catch (e) {
      console.error("Ask Sanara error:", e);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return <SkeletonCard lines={6} />;
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-3">
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">◎ MY MAP</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Everything is connected.</h1>
        <p className="font-serif italic text-base text-[var(--text-secondary)]">
          "A living map of your situations, emotions, themes, decisions, and outcomes."
        </p>
      </div>

      {mapData.nodes.length <= 1 ? (
        <div className="pinterest-card p-12 text-center space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
          <Compass className="w-8 h-8 text-[var(--sky-deep)] mx-auto" />
          <p className="font-serif text-lg text-[var(--text-primary)]">Your constellation is just beginning.</p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
            Untangle a situation to populate themes, emotions, decisions, and outcomes automatically.
          </p>
          <div className="pt-2">
            <Link to="/untangle" className="btn-sky-primary text-xs py-2.5 px-6 font-bold">
              ✦ Untangle your first situation
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Interactive Graph Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Graph Visual Canvas Container */}
            <div className="lg:col-span-8 pinterest-card p-6 bg-[var(--card-bg)] border-[var(--border-subtle)] min-h-[460px] flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-serif italic text-sm text-[var(--text-secondary)] font-bold">
                  Constellation Graph Visualization
                </span>
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
                  {mapData.nodes.length} CONNECTED NODES
                </span>
              </div>

              {/* Node Tags Constellation Cloud */}
              <div className="flex flex-wrap gap-3 justify-center items-center py-10 min-h-[320px]">
                {mapData.nodes.map((node) => {
                  const colors = NODE_COLORS[node.type] || NODE_COLORS.situation;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                        isSelected ? "ring-3 ring-[var(--sky-primary)] shadow-md scale-105" : "shadow-2xs"
                      }`}
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.border,
                      }}
                    >
                      {node.type === "root" && "✦ "}
                      <span>{node.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Legend Bar */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky-deep)]" />
                  <span>User</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--sky-soft)] border border-[var(--border-subtle)]" />
                  <span>Theme</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)]" />
                  <span>Situation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-200 text-purple-900" />
                  <span>Emotion</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-200 text-rose-900" />
                  <span>Outcome</span>
                </div>
              </div>
            </div>

            {/* Selected Node Detail Panel */}
            <div className="lg:col-span-4 pinterest-card p-6 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-4 shadow-xs">
              <div className="border-b border-[var(--border-subtle)] pb-2">
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">NODE DETAIL PANEL</span>
              </div>

              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <span className="tag-sky text-[10px] capitalize">
                      {selectedNode.category || selectedNode.type}
                    </span>

                    <h4 className="font-serif text-2xl font-bold text-[var(--text-primary)] leading-snug">
                      {selectedNode.label}
                    </h4>

                    {selectedNode.summary && (
                      <p className="text-xs italic font-serif text-[var(--text-secondary)] leading-relaxed font-bold">
                        "{selectedNode.summary}"
                      </p>
                    )}

                    {selectedNode.emotions?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-[var(--text-muted)]">
                          CONNECTED EMOTIONS:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNode.emotions.map((emo, idx) => (
                            <span key={idx} className="tag-lavender text-[10px]">
                              {emo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.createdAt && (
                      <p className="text-[11px] text-[var(--text-muted)] font-bold">
                        Recorded: {new Date(selectedNode.createdAt).toLocaleDateString()}
                      </p>
                    )}

                    {selectedNode.type === "situation" && (
                      <div className="pt-2">
                        <Link
                          to={`/threads/${selectedNode.id.replace("sit_", "")}`}
                          className="btn-sky-primary text-xs w-full justify-center py-2.5 px-4 font-bold"
                        >
                          <span>Open Thread →</span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="py-12 text-center text-xs font-serif italic text-[var(--text-muted)] font-bold">
                    Click any node in the constellation to view details.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              PATTERN INTELLIGENCE SECTION
              ══════════════════════════════════════════ */}
          {patterns.length > 0 && (
            <section className="space-y-5 pt-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
                <Sparkles className="w-5 h-5 text-[var(--sky-deep)]" />
                <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">Patterns Sanara Noticed</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patterns.map((pat, idx) => (
                  <div
                    key={idx}
                    className="pinterest-card p-6 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                      <span className="tag-sky text-[10px]">PATTERN #{idx + 1}</span>
                      <span className="text-[11px] font-extrabold text-[var(--sky-deep)]">
                        {pat.occurrences} occurrence{pat.occurrences === 1 ? "" : "s"}
                      </span>
                    </div>

                    {/* OBSERVED DATA */}
                    <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">
                          OBSERVED DATA
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                        "{pat.observed}"
                      </p>
                    </div>

                    {/* AI INTERPRETATION */}
                    <div className="p-4 rounded-2xl bg-[var(--sky-soft)] border border-[var(--border-strong)] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-[var(--sky-deep)]" />
                        <span className="eyebrow-xs text-[var(--sky-deep)] text-[10px] font-extrabold">
                          POSSIBLE PATTERN (AI INTERPRETATION)
                        </span>
                      </div>
                      <p className="text-xs font-serif italic text-[var(--text-primary)] leading-relaxed font-bold">
                        "{pat.interpretation}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════
              ASK SANARA ENGINE
              ══════════════════════════════════════════ */}
          <section className="pinterest-card p-8 sm:p-10 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--sky-deep)]" />
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">ASK SANARA ABOUT YOUR THINKING</span>
              </div>
              <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">Ask about your own thinking history</h2>
              <p className="text-xs text-[var(--text-secondary)] font-bold">
                Sanara searches your recorded situations and outcomes to answer questions about your patterns.
              </p>
            </div>

            {/* Prompt suggestions */}
            <div className="flex flex-wrap gap-2">
              {[
                "Have I felt this way before?",
                "What situations keep repeating?",
                "When was I most confident?",
                "What changed between these situations?",
                "What patterns keep showing up?",
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setAskQuery(sug)}
                  className="pinterest-pill text-xs font-bold"
                >
                  "{sug}"
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleAskSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Ask about your recorded thinking..."
                className="input-sky text-xs flex-1 font-bold"
              />
              <button
                type="submit"
                disabled={asking || !askQuery.trim()}
                className="btn-sky-primary text-xs py-2.5 px-6 shrink-0 font-bold shadow-xs cursor-pointer"
              >
                <span>{asking ? "Searching..." : "Ask Sanara"}</span>
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Response */}
            {askResult && (
              <div className="p-6 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-4">
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">SANARA'S REFLECTION RESPONSE</span>
                <p className="font-serif italic text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-bold">
                  "{askResult.answer}"
                </p>

                {askResult.relevantRecords?.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <span className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">CITED THREADS</span>
                    <div className="flex flex-wrap gap-2">
                      {askResult.relevantRecords.map((r, i) => (
                        <Link key={i} to={`/threads/${r.id}`} className="tag-sky text-[10px]">
                          <BookOpen className="w-3 h-3" />
                          <span>{r.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { situationService } from "../services/situationService";
import { SkeletonCard } from "../components/SkeletonLoader";
import Constellation3DCanvas from "../components/Constellation3DCanvas";
import ConstellationListView from "../components/ConstellationListView";
import AskSanaraModal from "../components/AskSanaraModal";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  MessageSquare,
  Search,
  ArrowRight,
  Eye,
  Lightbulb,
  Compass,
  Layers,
  RotateCcw,
  ListFilter,
  Grid,
  List,
  X,
  Share2,
  BookOpen,
} from "lucide-react";

export default function MyMap() {
  const navigate = useNavigate();
  const [mapData, setMapData] = useState({ nodes: [], links: [] });
  const [patterns, setPatterns] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controls & Filters
  const [viewMode, setViewMode] = useState("3d"); // '3d' | 'list'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'situation' | 'theme' | 'emotion' | 'decision' | 'outcome'
  const [searchQuery, setSearchQuery] = useState("");
  const [resetTrigger, setResetTrigger] = useState(0);

  // Ask Sanara Modal State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askContextQuery, setAskContextQuery] = useState("");

  // Ask Sanara inline engine state
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

  const handleOpenAskSanaraForNode = (node) => {
    const connectedLinks = mapData.links.filter(
      (l) => l.source === node.id || l.target === node.id
    );
    const connectedNodeIds = connectedLinks.map((l) => (l.source === node.id ? l.target : l.source));
    const connectedNames = mapData.nodes
      .filter((n) => connectedNodeIds.includes(n.id))
      .map((n) => n.label)
      .slice(0, 3)
      .join(", ");

    const prompt = 'Why does "' + node.label + '" keep connecting to ' + (connectedNames || "other themes") + ' in my thinking?';
    setAskContextQuery(prompt);
    setAskModalOpen(true);
  };

  const filteredNodes = mapData.nodes.filter((node) => {
    if (activeFilter !== "all" && node.type !== activeFilter && node.type !== "root") {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLabel = node.label.toLowerCase().includes(q);
      const matchCat = node.category?.toLowerCase().includes(q);
      return matchLabel || matchCat;
    }
    return true;
  });

  if (loading) {
    return <SkeletonCard lines={8} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pt-1 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">◎ MY MAP</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[var(--sky-soft)] text-[var(--sky-deep)] uppercase border border-[var(--border-subtle)]">
              3D Constellation Layer
            </span>
          </div>
          <h1 className="page-title text-[var(--text-primary)] font-serif font-bold text-3xl sm:text-4xl">
            Everything is connected.
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[var(--text-secondary)]">
            "A living 3D map of your situations, emotions, themes, decisions, and outcomes."
          </p>
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search map..."
              className="input-sky text-xs pl-8 py-2 w-44 sm:w-56 font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* 3D vs List Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-2xs">
            <button
              onClick={() => setViewMode("3d")}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (viewMode === "3d" ? "bg-[#25678B] text-white shadow-xs" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>3D Map</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (viewMode === "list" ? "bg-[#25678B] text-white shadow-xs" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {mapData.nodes.length <= 1 ? (
        <div className="pinterest-card p-12 text-center space-y-4 bg-[var(--card-bg)] border-[var(--border-subtle)]">
          <Compass className="w-8 h-8 text-[var(--sky-deep)] mx-auto animate-pulse" />
          <p className="font-serif text-lg text-[var(--text-primary)] font-bold">
            Your constellation is ready to form.
          </p>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
            Untangle a situation to populate themes, emotions, decisions, and outcomes in 3D automatically.
          </p>
          <div className="pt-2">
            <Link to="/untangle" className="btn-sky-primary text-xs py-2.5 px-6 font-bold">
              ✦ Untangle your first situation
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Main Interactive Map Viewport & Filter Control Bar */}
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase px-2">FILTER:</span>
                {[
                  { id: "all", label: "All Nodes" },
                  { id: "theme", label: "Themes" },
                  { id: "situation", label: "Situations" },
                  { id: "emotion", label: "Emotions" },
                  { id: "decision", label: "Decisions" },
                  { id: "outcome", label: "Outcomes" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={"px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer " + (activeFilter === f.id ? "bg-[var(--sky-soft)] text-[var(--sky-deep)] border border-[var(--border-strong)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Reset View Button */}
              {viewMode === "3d" && (
                <button
                  onClick={() => setResetTrigger((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-[var(--sky-deep)]" />
                  <span>Reset Camera</span>
                </button>
              )}
            </div>

            {/* 3D Viewport or List View Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Viewport (75-80% on Desktop) */}
              <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border border-[var(--border-subtle)] bg-[#07141D]">
                {viewMode === "3d" ? (
                  <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px]">
                    <Constellation3DCanvas
                      nodes={filteredNodes}
                      links={mapData.links}
                      selectedNode={selectedNode}
                      hoveredNode={hoveredNode}
                      onSelectNode={(node) => setSelectedNode(node)}
                      onHoverNode={(node) => setHoveredNode(node)}
                      activeFilter={activeFilter}
                      searchQuery={searchQuery}
                      resetTrigger={resetTrigger}
                    />

                    {/* Canvas Floating Top Overlay */}
                    <div className="absolute top-4 left-4 pointer-events-none space-y-1">
                      <p className="text-[10px] font-extrabold text-[#73C5EA] tracking-widest uppercase">
                        INTERACTIVE 3D MINDSCAPE
                      </p>
                      <p className="text-xs font-serif text-[#F2F7F9]/80 italic">
                        Click, drag, or rotate to explore thinking connections
                      </p>
                    </div>

                    {/* Canvas Floating Bottom Legend Bar */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#07141D]/80 backdrop-blur-md border border-[#2F759B]/40 text-[11px] font-bold text-[#F2F7F9]">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#25678B] ring-2 ring-[#73C5EA]" />
                          <span>User (ME)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rotate-45 bg-[#B8B2D6]" />
                          <span>Theme</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#73C5EA]" />
                          <span>Situation</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8DD8E8]" />
                          <span>Emotion</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rotate-45 bg-[#2F759B]" />
                          <span>Decision</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D9A8A0]" />
                          <span>Outcome</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#91A8B4] font-extrabold">
                        {filteredNodes.length} NODES VISIBLE
                      </span>
                    </div>
                  </div>
                ) : (
                  <ConstellationListView
                    nodes={filteredNodes}
                    selectedNode={selectedNode}
                    onSelectNode={(node) => setSelectedNode(node)}
                  />
                )}
              </div>

              {/* Right Contextual Insight Detail Panel */}
              <div className="lg:col-span-4 pinterest-card p-6 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">INSIGHT DETAIL PANEL</span>
                  {selectedNode && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[var(--sky-soft)] text-[var(--sky-deep)]">
                      {selectedNode.type}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {selectedNode ? (
                    <motion.div
                      key={selectedNode.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <span className="tag-sky text-[10px] capitalize">
                          {selectedNode.category || selectedNode.type}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mt-1 leading-snug">
                          {selectedNode.label}
                        </h3>
                        {selectedNode.summary && (
                          <p className="text-xs italic font-serif text-[var(--text-secondary)] mt-2 leading-relaxed font-bold">
                            "{selectedNode.summary}"
                          </p>
                        )}
                      </div>

                      {/* Appearances / Stats */}
                      <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-bold">
                        <span className="text-[var(--text-muted)]">RECORDED APPEARANCES:</span>
                        <span className="text-[var(--sky-deep)] font-extrabold text-sm">
                          {selectedNode.appearances || 1} situation{selectedNode.appearances === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* SANARA NOTICED INSIGHT */}
                      <div className="p-4 rounded-2xl bg-[var(--sky-soft)] border border-[var(--border-strong)] space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--sky-deep)]" />
                          <span className="eyebrow-xs text-[var(--sky-deep)] text-[10px] font-extrabold">
                            SANARA NOTICED (AI PATTERN OBSERVER)
                          </span>
                        </div>
                        <p className="text-xs font-serif italic text-[var(--text-primary)] leading-relaxed font-bold">
                          "{selectedNode.type === "root"
                            ? "You are at the core of your constellation. Every situation you untangle reveals deeper clarity."
                            : selectedNode.type === "theme"
                            ? "You've returned to " + selectedNode.label + " across multiple situations, indicating a core theme in your thinking."
                            : selectedNode.type === "emotion"
                            ? selectedNode.label + " appears most frequently when outcomes remain uncertain."
                            : selectedNode.type === "decision"
                            ? "This decision path directly led to recorded reflection outcomes."
                            : selectedNode.type === "outcome"
                            ? "Stored takeaway from your resolved thinking loop."
                            : "Connected to your recorded situations and living threads."}"
                        </p>
                      </div>

                      {/* Action CTAs */}
                      <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
                        <button
                          onClick={() => handleOpenAskSanaraForNode(selectedNode)}
                          className="btn-sky-primary text-xs w-full justify-center py-2.5 px-4 font-bold shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask Sanara about this</span>
                        </button>

                        {selectedNode.type === "situation" && (
                          <Link
                            to={"/threads/" + selectedNode.id.replace("sit_", "")}
                            className="btn-sky-secondary text-xs w-full justify-center py-2.5 px-4 font-bold text-decoration-none"
                          >
                            <span>View Thread →</span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-12 text-center text-xs font-serif italic text-[var(--text-muted)] font-bold">
                      Select or click any node in the constellation to view details and insights.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              PATTERN INTELLIGENCE SECTION
              ══════════════════════════════════════════ */}
          {patterns.length > 0 && (
            <section className="space-y-5 pt-6">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
                <Sparkles className="w-5 h-5 text-[var(--sky-deep)]" />
                <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">
                  Patterns Sanara Noticed
                </h2>
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
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
                  ASK SANARA ABOUT YOUR THINKING
                </span>
              </div>
              <h2 className="section-title text-[var(--text-primary)] font-serif font-bold">
                Ask about your own thinking history
              </h2>
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
                <span className="eyebrow-xs text-[var(--sky-deep)] font-extrabold">
                  SANARA'S REFLECTION RESPONSE
                </span>
                <p className="font-serif italic text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-bold">
                  "{askResult.answer}"
                </p>

                {askResult.relevantRecords?.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <span className="eyebrow-xs text-[var(--text-muted)] text-[10px] font-extrabold">
                      CITED THREADS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {askResult.relevantRecords.map((r, i) => (
                        <Link key={i} to={"/threads/" + r.id} className="tag-sky text-[10px]">
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

      {/* Contextual Ask Sanara Modal */}
      <AskSanaraModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        initialQuery={askContextQuery}
      />
    </div>
  );
}

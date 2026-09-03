import React from "react";

const NODE_TYPE_BADGES = {
  root: { label: "USER", class: "bg-[#25678B] text-white" },
  theme: { label: "THEME", class: "bg-purple-100 text-purple-900 border border-purple-200" },
  situation: { label: "SITUATION", class: "bg-sky-100 text-sky-900 border border-sky-200" },
  emotion: { label: "EMOTION", class: "bg-teal-100 text-teal-900 border border-teal-200" },
  decision: { label: "DECISION", class: "bg-indigo-100 text-indigo-900 border border-indigo-200" },
  outcome: { label: "OUTCOME", class: "bg-rose-100 text-rose-900 border border-rose-200" },
};

export default function ConstellationListView({ nodes, selectedNode, onSelectNode }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[var(--text-muted)] font-serif italic">
        No nodes found matching your current search or filter.
      </div>
    );
  }

  const categories = ["root", "theme", "situation", "emotion", "decision", "outcome"];

  return (
    <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar bg-[var(--bg-canvas)] rounded-3xl border border-[var(--border-subtle)]">
      {categories.map((catType) => {
        const catNodes = nodes.filter((n) => n.type === catType);
        if (catNodes.length === 0) return null;

        return (
          <div key={catType} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
              <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase " + (NODE_TYPE_BADGES[catType]?.class || "bg-slate-200")}>
                {NODE_TYPE_BADGES[catType]?.label || catType}
              </span>
              <span className="text-[11px] font-bold text-[var(--text-muted)]">
                ({catNodes.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={"text-left p-4 rounded-2xl border transition-all cursor-pointer " + (isSelected ? "bg-[var(--card-bg)] border-[var(--sky-primary)] shadow-md ring-2 ring-[var(--sky-soft)]" : "bg-[var(--card-bg)]/80 border-[var(--border-subtle)] hover:border-[var(--sky-primary)] hover:bg-[var(--card-bg)]")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-[var(--text-primary)]">
                        {node.type === "root" && "✦ "}
                        {node.label}
                      </h4>
                      {node.appearances > 1 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--sky-soft)] text-[var(--sky-deep)] shrink-0">
                          {node.appearances}x
                        </span>
                      )}
                    </div>
                    {node.summary && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 italic font-serif">
                        "{node.summary}"
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

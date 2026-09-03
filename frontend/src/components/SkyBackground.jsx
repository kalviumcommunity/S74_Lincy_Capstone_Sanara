import React from "react";

export default function SkyBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-canvas)] transition-colors duration-250"
      aria-hidden="true"
    >
      {/* Soft atmospheric top sky glow */}
      <div
        className="absolute -top-32 right-0 w-[800px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, var(--sky-primary) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

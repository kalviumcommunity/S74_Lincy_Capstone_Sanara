import React from "react";

export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div
      className={`sky-card p-6 space-y-4 animate-pulse ${className}`}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="h-4 bg-sky-100/70 rounded-md w-1/3" />
      <div className="h-6 bg-sky-100/80 rounded-md w-3/4" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-sky-50 rounded-md"
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex-shrink-0" />
          <div className="flex-1 sky-card p-5 space-y-3">
            <div className="h-4 bg-sky-100/70 rounded w-1/4" />
            <div className="h-5 bg-sky-100/90 rounded w-2/3" />
            <div className="h-3 bg-sky-50 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";

/**
 * TopoBackground — Sanara's subtle organic paper terrain background.
 * Soft, ultra-faint natural contour lines on Warm Natural background (#F5F2EA).
 * Fixed behind all content, z-index 0.
 */
export default function TopoBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundColor: "#F5F2EA",
      }}
    >
      {/* Soft warm ambient gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(236,231,220,0.6) 0%, rgba(245,242,234,0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "55vw",
          height: "55vh",
          background: "radial-gradient(circle, rgba(143,161,138,0.08) 0%, rgba(245,242,234,0) 70%)",
          filter: "blur(70px)",
        }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 4000 3000"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}
      >
        <defs>
          <style>{`
            .c1 { fill:none; stroke:rgba(220,215,205,0.4); stroke-linecap:round; stroke-linejoin:round; }
            .c2 { fill:none; stroke:rgba(143,161,138,0.12); stroke-linecap:round; stroke-linejoin:round; }
            .c3 { fill:none; stroke:rgba(220,215,205,0.25); stroke-linecap:round; stroke-linejoin:round; }
          `}</style>
        </defs>

        {/* Central Massif Contour Lines */}
        <path className="c1" strokeWidth="1.2"
          d="M 1480 1200 C 1560 1100 1720 1060 1880 1080 C 2040 1100 2160 1200 2180 1340
             C 2200 1480 2100 1600 1940 1640 C 1780 1680 1600 1620 1500 1480
             C 1420 1380 1420 1290 1480 1200 Z" />

        <path className="c2" strokeWidth="1.0"
          d="M 1380 1140 C 1480 1010 1680 950 1900 970 C 2120 990 2280 1110 2320 1290
             C 2360 1470 2240 1640 2060 1700 C 1880 1760 1680 1700 1560 1560
             C 1460 1450 1400 1310 1380 1140 Z" />

        <path className="c3" strokeWidth="0.8"
          d="M 1260 1080 C 1380 920 1640 840 1920 860 C 2200 880 2400 1030 2460 1250
             C 2520 1470 2380 1680 2160 1760 C 1940 1840 1700 1780 1560 1620
             C 1440 1490 1360 1340 1260 1080 Z" />

        {/* Outer Ridge Lines */}
        <path className="c3" strokeWidth="0.7"
          d="M 1140 1020 C 1280 840 1580 740 1920 760 C 2260 780 2500 950 2570 1210
             C 2640 1470 2490 1720 2250 1810 C 2010 1900 1740 1840 1580 1660
             C 1450 1520 1360 1360 1140 1020 Z" />
      </svg>
    </div>
  );
}

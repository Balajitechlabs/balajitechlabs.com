"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Sparkles, SlidersHorizontal } from "lucide-react";

export function EditorialHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePct, setMousePct] = useState({ x: 50, y: 50 });
  const [smoothPct, setSmoothPct] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<"slash" | "lens">("slash");
  const [istTime, setIstTime] = useState<string>("");

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setIstTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth lerp physics for cursor tracking
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setSmoothPct((prev) => {
        const dx = mousePct.x - prev.x;
        const dy = mousePct.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12,
        };
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePct]);

  // Window-level mouse tracking for full-screen feel
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePct({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    });

    // Subtle 3D perspective tilt (-6 to +6 deg)
    const tiltX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -6;
    const tiltY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 6;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  // Mobile Gyroscope Tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const x = Math.max(-8, Math.min(8, (e.beta - 45) * 0.3));
      const y = Math.max(-8, Math.min(8, e.gamma * 0.3));
      setTilt({ x: -x, y });
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  // Compute reveal clip-path
  // Mode "slash": Angled cyber slice (Lando Norris / Aimon Renso style)
  // Mode "lens": Circular spotlight
  const getRevealClipPath = () => {
    if (mode === "lens") {
      return `circle(180px at ${smoothPct.x}% ${smoothPct.y}%)`;
    }
    // Angled diagonal slash: top is smoothPct.x + 12%, bottom is smoothPct.x - 12%
    const top = Math.min(100, Math.max(0, smoothPct.x + 12));
    const bottom = Math.min(100, Math.max(0, smoothPct.x - 12));
    return `polygon(${top}% 0%, 100% 0%, 100% 100%, ${bottom}% 100%)`;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full min-h-screen bg-[#070709] text-white flex items-center justify-center overflow-hidden select-none cursor-crosshair"
    >
      {/* ============================================================ */}
      {/* BACKGROUND: TOPOGRAPHIC CONTOUR LINES & AMBIENT GLOW */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Contour topographic paths */}
          <path
            d="M-100 200 C 300 100, 600 350, 1000 150 C 1200 50, 1400 300, 1600 200"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-50 350 C 350 250, 700 500, 1100 300 C 1300 200, 1450 450, 1650 350"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-150 550 C 250 450, 550 700, 950 500 C 1150 400, 1350 650, 1600 550"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-100 700 C 300 600, 650 850, 1050 650 C 1250 550, 1450 800, 1650 700"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Fluid organic blob shadows */}
          <ellipse
            cx="320"
            cy="280"
            rx="240"
            ry="140"
            fill="rgba(52, 211, 153, 0.03)"
            filter="blur(80px)"
          />
          <ellipse
            cx="1100"
            cy="650"
            rx="280"
            ry="180"
            fill="rgba(255, 255, 255, 0.03)"
            filter="blur(100px)"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 4-CORNER EDITORIAL HUD (AIMON RENSO / LANDO NORRIS ARCHITECTURE) */}
      {/* ============================================================ */}

      {/* 1. TOP-LEFT: BRAND & IDENTITY */}
      <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-40 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-sm"></span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
            Balaji S.
          </h1>
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <span>||BTL||™ LABS</span>
          <span className="text-zinc-600">/</span>
          <span>balajitechlabs.com</span>
        </div>
      </div>

      {/* 2. TOP-RIGHT: NAVIGATION PILLS & MODE TOGGLE */}
      <div className="absolute top-6 sm:top-10 right-6 sm:right-10 z-40 flex items-center gap-3">
        {/* Effect Mode Toggle Pill */}
        <button
          type="button"
          onClick={() => setMode(mode === "slash" ? "lens" : "slash")}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all backdrop-blur-md shadow-sm"
        >
          <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
          <span>Mode: {mode === "slash" ? "Cyber Slash" : "Spotlight"}</span>
        </button>

        <a
          href="https://github.com/Balajitechlabs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all backdrop-blur-md"
        >
          <span>GitHub</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
        </a>

        <a
          href="mailto:contact@balajitechlabs.com"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-xs font-mono font-medium hover:bg-zinc-200 transition-all active:scale-95 shadow-sm"
        >
          <Mail className="w-3 h-3" />
          <span>Contact</span>
        </a>
      </div>

      {/* 3. BOTTOM-LEFT: DISCIPLINE & PORTFOLIO METADATA */}
      <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 z-40 flex flex-col items-start gap-1">
        <div className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-200 font-sans uppercase">
          Software Architect // Systems Logic
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <span>Portfolio 2026</span>
          <span className="text-zinc-600">•</span>
          <span>Cloudflare Edge</span>
          <span className="text-zinc-600">•</span>
          <span>Bun Native</span>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT: LIVE IST CLOCK & TELEMETRY BEACON */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 z-40 flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs sm:text-sm font-mono tracking-tight text-zinc-200">
            {istTime || "12:50:00 PM IST"}
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
           Bengaluru, IN • Available for select roles
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER STAGE: LARGE IMMERSIVE DUAL-LAYER PORTRAIT */}
      {/* ============================================================ */}
      <div
        className="relative w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[42vw] max-w-2xl aspect-[4/5] flex items-center justify-center transition-transform duration-200 ease-out will-change-transform z-20"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Subtle Ambient Backing Halo */}
        <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-emerald-500/10 via-white/5 to-zinc-500/10 blur-3xl pointer-events-none" />

        {/* ------------------------------------------------------------ */}
        {/* LAYER 1: BASE LAYER (Monochrome Vector Illustration) */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center">
          <Image
            src="/images/profile-illustrated.png"
            alt="Balaji S. - Vector Form"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 85vw, 45vw"
            className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER 2: REVEAL LAYER (Real 4K Photo) with Dynamic Clip Path */}
        {/* ------------------------------------------------------------ */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center transition-[clip-path] duration-75 ease-out pointer-events-none"
          style={{
            clipPath: getRevealClipPath(),
            WebkitClipPath: getRevealClipPath(),
          }}
        >
          <Image
            src="/images/profile-real.png"
            alt="Balaji S. - Real Portrait 4K"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 85vw, 45vw"
            className="object-cover object-center"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* THE DIAGONAL CYBER LASER SEAM LINE (Visible in "slash" mode) */}
        {/* ------------------------------------------------------------ */}
        {mode === "slash" && (
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-transform duration-75 ease-out"
            style={{
              clipPath: "none",
            }}
          >
            {/* Angled glowing laser seam line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-400 via-white to-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)] opacity-85 transition-all duration-75"
              style={{
                left: `${smoothPct.x}%`,
                transform: "rotate(14deg) scaleY(1.3)",
                transformOrigin: "center center",
              }}
            />

            {/* Hover Coordinate Badge on the Seam */}
            <div
              className="absolute px-2.5 py-1 rounded bg-black/90 border border-emerald-400/50 text-[9px] font-mono text-emerald-300 tracking-wider shadow-lg backdrop-blur-md transition-all duration-75"
              style={{
                left: `${smoothPct.x}%`,
                top: `${smoothPct.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              RESOLVE // {Math.round(smoothPct.x)}%
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* THE SPOTLIGHT LENS RETICLE (Visible in "lens" mode) */}
        {/* ------------------------------------------------------------ */}
        {mode === "lens" && (
          <div
            className="absolute pointer-events-none z-30 transition-opacity duration-200"
            style={{
              left: `${smoothPct.x}%`,
              top: `${smoothPct.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-[360px] h-[360px] rounded-full border border-emerald-400/70 shadow-[0_0_25px_rgba(52,211,153,0.4)]" />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/90 border border-emerald-400/50 text-[9px] font-mono text-emerald-300 tracking-wider whitespace-nowrap">
              OPTICAL_LENS // {Math.round(smoothPct.x)},{Math.round(smoothPct.y)}
            </div>
          </div>
        )}

        {/* Floating Center HUD Label */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-400 uppercase backdrop-blur-xl shadow-xl flex items-center gap-2 z-30"
          style={{ transform: "translateZ(40px) translateX(-50%)" }}
        >
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Hover / Drag across screen to reveal</span>
        </div>
      </div>
    </div>
  );
}

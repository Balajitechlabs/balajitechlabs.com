"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Layers, Sparkles } from "lucide-react";

type RevealMode = "lens" | "vector" | "reality";

export function LandoReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 190, y: 190 });
  const [smoothPos, setSmoothPos] = useState({ x: 190, y: 190 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<RevealMode>("lens");
  const [lensRadius, setLensRadius] = useState(130);

  // Smooth lerp animation for lens tracking (Awwwards feel)
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setSmoothPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Handle pointer movement inside container
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      setMousePos({ x, y });

      // 3D Perspective Tilt (-10 to +10 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -8;
      const tiltY = ((x - centerX) / centerX) * 8;
      setTilt({ x: tiltX, y: tiltY });
    },
    [],
  );

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Mobile orientation tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const x = Math.max(-10, Math.min(10, (e.beta - 45) * 0.4));
      const y = Math.max(-10, Math.min(10, e.gamma * 0.4));
      setTilt({ x: -x, y });
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  // Compute clip path according to active mode
  const getClipPath = () => {
    if (mode === "reality") {
      return "circle(150% at 50% 50%)";
    }
    if (mode === "vector") {
      return "circle(0% at 50% 50%)";
    }
    // "lens" mode: spotlight follows cursor
    const r = isHovered ? lensRadius : 0;
    return `circle(${r}px at ${smoothPos.x}px ${smoothPos.y}px)`;
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* 3D Perspective Wrapper */}
      <div
        className="relative group perspective-[1000px] flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Ambient Titanium Glow behind card */}
        <div
          className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-zinc-500/15 to-emerald-400/10 blur-2xl transition-opacity duration-700 pointer-events-none"
          style={{
            opacity: isHovered ? 0.75 : 0.25,
            transform: `translate3d(${tilt.y * 1.5}px, ${-tilt.x * 1.5}px, -30px)`,
          }}
        />

        {/* Main Interactive Stage Container */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl overflow-hidden cursor-crosshair transition-transform duration-200 ease-out will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          }}
        >
          {/* ============================================================ */}
          {/* LAYER 1: BASE LAYER (Stylized Vector Illustration) */}
          {/* ============================================================ */}
          <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
            <Image
              src="/images/profile-illustrated.png"
              alt="Balaji S. - Vector Avatar"
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, 384px"
              className="object-contain"
            />
          </div>

          {/* ============================================================ */}
          {/* LAYER 2: REVEAL LAYER (Real 4K Photograph) with Clip Path */}
          {/* ============================================================ */}
          <div
            className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden transition-[clip-path] duration-75 ease-out pointer-events-none"
            style={{
              clipPath: getClipPath(),
              WebkitClipPath: getClipPath(),
            }}
          >
            <Image
              src="/images/profile-real.png"
              alt="Balaji S. - Real Portrait"
              fill
              priority
              unoptimized
              sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, 384px"
              className="object-cover"
            />

            {/* Lens Specular Glare Effect inside the reveal */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20"
              style={{
                background: `radial-gradient(circle ${lensRadius}px at ${smoothPos.x}px ${smoothPos.y}px, rgba(255,255,255,0.8), transparent 70%)`,
              }}
            />
          </div>

          {/* ============================================================ */}
          {/* LENS RETICLE / SCANNER HUD (Follows Mouse in "lens" mode) */}
          {/* ============================================================ */}
          {mode === "lens" && (
            <div
              className="absolute pointer-events-none transition-opacity duration-300 z-40"
              style={{
                left: `${smoothPos.x}px`,
                top: `${smoothPos.y}px`,
                transform: "translate(-50%, -50%)",
                opacity: isHovered ? 1 : 0,
              }}
            >
              {/* Outer Luminous Ring */}
              <div
                className="rounded-full border border-emerald-400/70 shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-150"
                style={{
                  width: `${lensRadius * 2}px`,
                  height: `${lensRadius * 2}px`,
                }}
              />

              {/* Center Crosshair Tick */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-400" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-400" />
              </div>

              {/* Dynamic Coordinate Tag */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 tracking-wider whitespace-nowrap backdrop-blur-md">
                OPTICAL_RESOLVE // {Math.round(smoothPos.x)},{Math.round(smoothPos.y)}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* CARD METADATA OVERLAY (Bottom HUD) */}
          {/* ============================================================ */}
          <div
            className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between z-30 transition-transform duration-200"
            style={{ transform: "translateZ(35px)" }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono tracking-wider text-zinc-200">
                ||BTL||™ DUAL_LAYER
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {mode === "lens" ? "Hover to Scan" : mode.toUpperCase()}
            </span>
          </div>

          {/* Border Outline */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-30" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE MODE TOGGLE PILLS (Desktop & Touch Friendly) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md backdrop-blur-md">
        <button
          type="button"
          onClick={() => setMode("lens")}
          className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
            mode === "lens"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Interactive Lens</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("vector")}
          className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
            mode === "vector"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers className="w-3 h-3 text-zinc-400" />
          <span>Vector</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("reality")}
          className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
            mode === "reality"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Eye className="w-3 h-3 text-emerald-400" />
          <span>Reality (4K)</span>
        </button>
      </div>
    </div>
  );
}


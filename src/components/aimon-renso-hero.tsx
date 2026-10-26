"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, X } from "lucide-react";

export function AimonRensoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Position relative to avatar container
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [smoothMouse, setSmoothMouse] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [lensRadius, setLensRadius] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [istTimestamp, setIstTimestamp] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Live timestamp (YYYY-MM-DD HH:mm:ss)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setIstTimestamp(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth fluid spring interpolation for the Lando Norris lens
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setSmoothMouse((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });

      // Smooth lens expansion / collapse
      setLensRadius((prev) => {
        const target = isHovered ? 160 : 0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.4) return target;
        return prev + diff * 0.22;
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isHovered]);

  // Robust pointer tracking: check coordinates directly against avatar bounding rect
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();

    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (inside) {
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      setMousePos({ x: localX, y: localY });
      setIsHovered(true);

      // Subtle 3D perspective tilt (-3 to +3 deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setTilt({
        x: ((localY - centerY) / centerY) * -3,
        y: ((localX - centerX) / centerX) * 3,
      });
    } else {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  // The reveal mask: dynamically sized to lensRadius
  // When lensRadius is 0, exactly 0 pixels are visible
  const revealMaskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(circle ${lensRadius}px at ${smoothMouse.x}px ${smoothMouse.y}px, black 95%, transparent 100%)`,
    maskImage: `radial-gradient(circle ${lensRadius}px at ${smoothMouse.x}px ${smoothMouse.y}px, black 95%, transparent 100%)`,
    opacity: lensRadius > 1 ? 1 : 0,
    pointerEvents: "none",
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-screen bg-[#E5E4E0] text-[#141414] flex items-center justify-center overflow-hidden select-none font-sans"
    >
      {/* ============================================================ */}
      {/* 1. TOPOGRAPHIC CONTOUR LINES & AMORPHOUS BLOBS (AIMON RENSO) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full object-cover opacity-60"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Amorphous floating organic shapes */}
          <path
            d="M 180 180 C 260 120, 390 140, 480 220 C 560 300, 520 420, 430 460 C 320 500, 210 440, 160 360 C 120 280, 120 220, 180 180 Z"
            fill="#D5D4CF"
          />
          <path
            d="M 960 200 C 1080 140, 1220 180, 1280 280 C 1340 380, 1280 500, 1180 540 C 1060 580, 920 520, 880 420 C 840 320, 860 250, 960 200 Z"
            fill="#DCDCD7"
          />
          <path
            d="M 880 580 C 960 540, 1060 560, 1100 620 C 1140 680, 1100 750, 1040 770 C 970 800, 880 770, 850 710 C 820 650, 820 610, 880 580 Z"
            fill="#D1D0CB"
          />

          {/* Delicate Topographic Contour Vector Paths */}
          <path
            d="M -100 120 C 250 40, 500 240, 850 100 C 1150 -20, 1350 200, 1600 120"
            stroke="#BCBBB5"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M -50 280 C 300 180, 650 420, 1050 220 C 1250 120, 1400 350, 1650 260"
            stroke="#B5B4AE"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M -150 480 C 200 360, 550 620, 950 420 C 1180 300, 1380 540, 1650 440"
            stroke="#BCBBB5"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M -100 680 C 280 560, 600 800, 1020 600 C 1250 480, 1420 720, 1650 640"
            stroke="#C4C3BD"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 100 850 C 400 750, 750 920, 1150 780 C 1350 700, 1500 850, 1650 800"
            stroke="#BCBBB5"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. THE 4-CORNER EDITORIAL HUD (AIMON RENSO SPEC) */}
      {/* ============================================================ */}

      {/* TOP-LEFT: BRAND NAME */}
      <div className="absolute top-8 sm:top-10 left-8 sm:left-12 z-40 flex flex-col items-start select-none">
        <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.05em] leading-[0.85] text-[#111111] uppercase font-sans">
          BALAJI
          <br />
          S.
        </h1>
        <div className="text-[10px] tracking-widest text-[#666666] font-mono uppercase mt-2">
          ||BTL||™ • balajitechlabs.com
        </div>
      </div>

      {/* TOP-RIGHT: MINIMALIST MENU PILL */}
      <div className="absolute top-8 sm:top-10 right-8 sm:right-12 z-40">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-[#111111] text-white hover:bg-black px-6 py-2 rounded-md text-xs font-mono tracking-widest uppercase transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          {menuOpen ? <X className="w-3.5 h-3.5" /> : null}
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
        </button>

        {/* Dropdown Navigation Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111111]/95 text-white p-3 shadow-2xl backdrop-blur-xl border border-white/10 z-50 flex flex-col gap-1 text-xs font-mono">
            <a
              href="https://github.com/Balajitechlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <a
              href="mailto:contact@balajitechlabs.com"
              className="px-3 py-2 rounded-lg hover:bg-white/10 flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
            >
              <span>Contact</span>
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <div className="h-[1px] bg-white/10 my-1" />
            <div className="px-3 py-1.5 text-[10px] text-zinc-500">
              Bun • Next.js 15 • Cloudflare Edge
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT: EDITORIAL METADATA */}
      <div className="absolute bottom-8 sm:bottom-10 left-8 sm:left-12 z-40 flex flex-col items-start gap-1 select-none pointer-events-none">
        <div className="text-[11px] sm:text-xs font-mono tracking-widest text-[#222222] uppercase font-bold">
          HUMAN FORM // MACHINE LOGIC
        </div>
        <div className="text-[10px] font-mono tracking-wider text-[#666666] uppercase">
          Software Architect • Systems Engineer • Portfolio 2026
        </div>
      </div>

      {/* BOTTOM-RIGHT: LIVE TIMESTAMP */}
      <div className="absolute bottom-8 sm:bottom-10 right-8 sm:right-12 z-40 flex flex-col items-end gap-1 select-none font-mono pointer-events-none">
        <div className="text-[11px] sm:text-xs tracking-wider text-[#222222] font-semibold">
          {istTimestamp}
        </div>
        <div className="text-[10px] tracking-widest text-[#666666] uppercase flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span> Bengaluru, IN</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTER STAGE: THE DUAL-LAYER MATTE CUTOUT AVATAR */}
      {/* ============================================================ */}
      <div
        ref={avatarRef}
        className="relative w-[92vw] sm:w-[75vw] md:w-[60vw] lg:w-[46vw] max-w-2xl h-[70vh] sm:h-[78vh] flex items-end justify-center transition-transform duration-200 ease-out will-change-transform z-20 cursor-crosshair"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Soft realistic drop shadow under the cutout person */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-black/15 rounded-full blur-2xl pointer-events-none" />

        {/* ------------------------------------------------------------ */}
        {/* LAYER A: BASE LAYER (Real 4K Photo Cutout) */}
        {/* When NOT hovering over the person, strictly this pristine photo is seen */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
          <Image
            src="/images/avatar-real.png"
            alt="Balaji S. - Human Form"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 92vw, 50vw"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER B: REVEAL LAYER (Sub-Pixel Aligned Illustrated Form) */}
        {/* Revealed inside the circular Lando Norris lens beneath the cursor */}
        {/* ------------------------------------------------------------ */}
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none"
          style={revealMaskStyle}
        >
          <Image
            src="/images/avatar-illustrated.png"
            alt="Balaji S. - Machine Logic Vector"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 92vw, 50vw"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 4. LANDO NORRIS INTERACTIVE LENS RING (FLUID CURSOR FOLLOWER) */}
        {/* ------------------------------------------------------------ */}
        {lensRadius > 4 && (
          <div
            className="absolute pointer-events-none rounded-full border border-black/25 transition-opacity duration-150 z-30 flex items-start justify-end p-2.5"
            style={{
              width: `${lensRadius * 2}px`,
              height: `${lensRadius * 2}px`,
              left: `${smoothMouse.x - lensRadius}px`,
              top: `${smoothMouse.y - lensRadius}px`,
              boxShadow: "0 0 35px rgba(0,0,0,0.06)",
            }}
          >
            {/* Sleek minimalist HUD indicator */}
            <span className="text-[8px] font-mono tracking-widest text-[#111111]/70 uppercase bg-[#E5E4E0]/80 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs select-none">
              VIEW // 02
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

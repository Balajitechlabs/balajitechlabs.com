"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function AimonRensoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // IST Digital Clock state (mounted client-side only to prevent SSR hydration mismatch)
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTimeStr(formatter.format(now));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Detect user prefers-reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches && avatarRef.current) {
        avatarRef.current.style.setProperty("--tilt-x", "0deg");
        avatarRef.current.style.setProperty("--tilt-y", "0deg");
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // Zero-VDOM Physics State: coordinates, intensity, and 3D tilt are mutated
  // directly on CSS custom properties on the avatar DOM ref. React never re-renders during interaction.
  const physics = useRef({
    targetX: -1000,
    targetY: -1000,
    currentX: -1000,
    currentY: -1000,
    targetIntensity: 0,
    currentIntensity: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    isSleeping: true,
  });

  const tick = useCallback(() => {
    const p = physics.current;
    const avatar = avatarRef.current;
    if (!avatar) return;

    // Fluid spring drag interpolation
    const dx = p.targetX - p.currentX;
    const dy = p.targetY - p.currentY;
    p.currentX += dx * 0.14;
    p.currentY += dy * 0.14;

    const dIntensity = p.targetIntensity - p.currentIntensity;
    p.currentIntensity += dIntensity * 0.12;

    const dTiltX = p.targetTiltX - p.currentTiltX;
    const dTiltY = p.targetTiltY - p.currentTiltY;
    p.currentTiltX += dTiltX * 0.12;
    p.currentTiltY += dTiltY * 0.12;

    const rx = 240 * p.currentIntensity;
    const ry = 290 * p.currentIntensity;

    // Check if motion has settled beneath sub-pixel thresholds to sleep the RAF loop
    const isPosSettled = Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15;
    const isIntensitySettled = Math.abs(dIntensity) < 0.002;
    const isTiltSettled = Math.abs(dTiltX) < 0.01 && Math.abs(dTiltY) < 0.01;

    if (isPosSettled && isIntensitySettled && isTiltSettled) {
      // Snap to exact target values upon sleep
      p.currentX = p.targetX;
      p.currentY = p.targetY;
      p.currentIntensity = p.targetIntensity;
      p.currentTiltX = p.targetTiltX;
      p.currentTiltY = p.targetTiltY;

      const finalRx = 240 * p.currentIntensity;
      const finalRy = 290 * p.currentIntensity;

      avatar.style.setProperty("--light-x", `${p.currentX.toFixed(1)}px`);
      avatar.style.setProperty("--light-y", `${p.currentY.toFixed(1)}px`);
      avatar.style.setProperty("--light-rx", `${finalRx.toFixed(1)}px`);
      avatar.style.setProperty("--light-ry", `${finalRy.toFixed(1)}px`);
      avatar.style.setProperty("--light-opacity", p.currentIntensity.toFixed(3));
      avatar.style.setProperty(
        "--tilt-x",
        `${prefersReducedMotionRef.current ? 0 : p.currentTiltX.toFixed(2)}deg`
      );
      avatar.style.setProperty(
        "--tilt-y",
        `${prefersReducedMotionRef.current ? 0 : p.currentTiltY.toFixed(2)}deg`
      );

      p.isSleeping = true;
      rafIdRef.current = null;
      return;
    }

    // Direct GPU-composited CSS variable updates
    avatar.style.setProperty("--light-x", `${p.currentX.toFixed(1)}px`);
    avatar.style.setProperty("--light-y", `${p.currentY.toFixed(1)}px`);
    avatar.style.setProperty("--light-rx", `${rx.toFixed(1)}px`);
    avatar.style.setProperty("--light-ry", `${ry.toFixed(1)}px`);
    avatar.style.setProperty("--light-opacity", p.currentIntensity.toFixed(3));
    avatar.style.setProperty(
      "--tilt-x",
      `${prefersReducedMotionRef.current ? 0 : p.currentTiltX.toFixed(2)}deg`
    );
    avatar.style.setProperty(
      "--tilt-y",
      `${prefersReducedMotionRef.current ? 0 : p.currentTiltY.toFixed(2)}deg`
    );

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  const wakeLoop = useCallback(() => {
    if (!physics.current.isSleeping) return;
    physics.current.isSleeping = false;
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Update pointer coordinates and compute spotlight proximity & 3D tilt
  const updateCoordinates = useCallback(
    (clientX: number, clientY: number, forceActive?: boolean) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();

      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      physics.current.targetX = localX;
      physics.current.targetY = localY;

      // Volumetric spotlight active zone (avatar bounds + padding buffer)
      const padding = 120;
      const isNearAvatar =
        forceActive ||
        (clientX >= rect.left - padding &&
          clientX <= rect.right + padding &&
          clientY >= rect.top - padding &&
          clientY <= rect.bottom + padding);

      physics.current.targetIntensity = isNearAvatar ? 1 : 0;

      // Subtle 3D perspective tilt across viewport
      if (!prefersReducedMotionRef.current && typeof window !== "undefined") {
        const windowCenterX = window.innerWidth / 2;
        const windowCenterY = window.innerHeight / 2;
        physics.current.targetTiltX = ((clientY - windowCenterY) / windowCenterY) * -3.5;
        physics.current.targetTiltY = ((clientX - windowCenterX) / windowCenterX) * 3.5;
      } else {
        physics.current.targetTiltX = 0;
        physics.current.targetTiltY = 0;
      }

      wakeLoop();
    },
    [wakeLoop]
  );

  // Full pointer lifecycle (pointerdown, pointermove, pointerup, pointercancel, pointerleave)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      updateCoordinates(e.clientX, e.clientY, true);
    },
    [updateCoordinates]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      updateCoordinates(e.clientX, e.clientY);
    },
    [updateCoordinates]
  );

  const handlePointerUp = useCallback(() => {
    physics.current.targetIntensity = 0;
    physics.current.targetTiltX = 0;
    physics.current.targetTiltY = 0;
    wakeLoop();
  }, [wakeLoop]);

  const handlePointerCancel = useCallback(() => {
    physics.current.targetIntensity = 0;
    physics.current.targetTiltX = 0;
    physics.current.targetTiltY = 0;
    wakeLoop();
  }, [wakeLoop]);

  const handlePointerLeave = useCallback(() => {
    physics.current.targetIntensity = 0;
    physics.current.targetTiltX = 0;
    physics.current.targetTiltY = 0;
    wakeLoop();
  }, [wakeLoop]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-screen bg-[#E5E4E0] text-[#141414] flex flex-col items-center justify-center overflow-hidden select-none font-sans touch-pan-y"
    >
      {/* ============================================================ */}
      {/* 1. ARCHITECTURAL 4-CORNER HUD                                */}
      {/* ============================================================ */}

      {/* HUD 1: TOP-LEFT BRAND IDENTITY */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 flex flex-col gap-1 pointer-events-auto select-none">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#141414]">
            ||BTL||™
          </span>
          <span className="text-[#141414]/30 font-mono text-xs">/</span>
          <span className="font-mono text-[11px] sm:text-xs tracking-widest uppercase text-[#141414]/80">
            BALAJI S.
          </span>
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#141414]/50">
          SYSTEMS &amp; INTERACTION LAB
        </span>
      </div>

      {/* HUD 2: TOP-RIGHT LIVE IST CLOCK */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 flex flex-col items-end gap-1 pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs text-[#141414]/70 tracking-wider">
            {timeStr || "--:--:--"}
          </span>
          <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded border border-black/15 bg-black/5 text-[#141414]/80 font-medium">
            IST
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#141414]/50 uppercase">
          CHENNAI, IN (UTC+05:30)
        </span>
      </div>

      {/* HUD 3: BOTTOM-LEFT STATUS BEACON */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-30 flex flex-col gap-1 pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#141414]/80">
            ALL SYSTEMS NOMINAL
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#141414]/50">
          CLOUDFLARE EDGE • SUB-10MS
        </span>
      </div>

      {/* HUD 4: BOTTOM-RIGHT INTERACTION TELEMETRY */}
      <div className="hidden sm:flex absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex-col items-end gap-1 pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#141414]/80 tracking-widest uppercase">
          <span>MODE //</span>
          <span className="text-[#141414] font-semibold">STUDIO KEYLIGHT</span>
        </div>
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#141414]/50">
          DUAL-STATE RADIAL SHADER
        </span>
      </div>

      {/* ============================================================ */}
      {/* 2. TOPOGRAPHIC CONTOUR LINES & AMORPHOUS BLOBS (BACKGROUND)  */}
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
      {/* 3. CENTER STAGE: VOLUMETRIC LIGHT-SWEPT DUAL-STATE AVATAR    */}
      {/* ============================================================ */}
      <div
        ref={avatarRef}
        className="relative w-[92vw] sm:w-[75vw] md:w-[60vw] lg:w-[46vw] max-w-2xl h-[72vh] sm:h-[80vh] flex items-end justify-center will-change-transform z-20 cursor-default"
        style={{
          transformStyle: "preserve-3d",
          transform:
            "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          ["--light-x" as string]: "-1000px",
          ["--light-y" as string]: "-1000px",
          ["--light-rx" as string]: "0px",
          ["--light-ry" as string]: "0px",
          ["--light-opacity" as string]: "0",
          ["--tilt-x" as string]: "0deg",
          ["--tilt-y" as string]: "0deg",
        }}
      >
        {/* Hardware-composited realistic floor shadow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-black/15 rounded-full blur-2xl pointer-events-none" />

        {/* ------------------------------------------------------------ */}
        {/* LAYER A: BASE PERSONA (Signature Vector Illustration)       */}
        {/* Modern AVIF format with WebP & PNG progressive fallback     */}
        {/* Filter drop shadow removed to eliminate CPU raster repaints */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
          <picture className="w-full h-full flex items-end justify-center">
            <source srcSet="/images/avatar-illustrated.avif" type="image/avif" />
            <source srcSet="/images/avatar-illustrated.webp" type="image/webp" />
            <img
              src="/images/avatar-illustrated.png"
              alt="Balaji S. - Machine Logic Vector"
              className="w-full h-full object-contain object-bottom select-none"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* LAYER B: VOLUMETRIC KEYLIGHT REVEAL (Real Human Photo)       */}
        {/* Driven directly by CSS variables --light-x, --light-y, etc. */}
        {/* ------------------------------------------------------------ */}
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none will-change-[mask-image,opacity]"
          style={{
            maskImage:
              "radial-gradient(ellipse var(--light-rx, 0px) var(--light-ry, 0px) at var(--light-x, -1000px) var(--light-y, -1000px), black 15%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse var(--light-rx, 0px) var(--light-ry, 0px) at var(--light-x, -1000px) var(--light-y, -1000px), black 15%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%)",
            opacity: "var(--light-opacity, 0)",
          }}
        >
          <picture className="w-full h-full flex items-end justify-center">
            <source srcSet="/images/avatar-real.avif" type="image/avif" />
            <source srcSet="/images/avatar-real.webp" type="image/webp" />
            <img
              src="/images/avatar-real.png"
              alt="Balaji S. - Human Reality"
              className="w-full h-full object-contain object-bottom select-none"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. PHYSICAL SPECULAR LIGHT SHEEN                             */}
        {/* ------------------------------------------------------------ */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-150"
          style={{
            background:
              "radial-gradient(ellipse calc(var(--light-rx, 0px) * 1.3) calc(var(--light-ry, 0px) * 1.3) at var(--light-x, -1000px) var(--light-y, -1000px), rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 45%, transparent 75%)",
            opacity: "var(--light-opacity, 0)",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* 4. EDITORIAL SCROLL DOWN INDICATOR (BOTTOM CENTER)           */}
      {/* ============================================================ */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 select-none pointer-events-auto cursor-pointer group">
        <div className="w-5 h-8.5 rounded-full border border-black/25 flex items-start justify-center p-1.5 backdrop-blur-xs transition-colors group-hover:border-black/50">
          <div className="w-1 h-2 rounded-full bg-[#111111] animate-bounce" />
        </div>

        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-[0.28em] text-[#111111]/60 uppercase group-hover:text-[#111111] transition-colors">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3 h-3 text-[#111111]/40 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

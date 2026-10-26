"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function AimonRensoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Smooth cursor tracking relative to avatar container
  const [targetMouse, setTargetMouse] = useState({ x: -1000, y: -1000 });
  const [smoothMouse, setSmoothMouse] = useState({ x: -1000, y: -1000 });
  const [isLightActive, setIsLightActive] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Spring interpolation loop for buttery 60-120fps motion
  useEffect(() => {
    let animId: number;
    const animate = () => {
      // Easing factor: 0.14 provides smooth fluid drag physics
      setSmoothMouse((prev) => {
        const dx = targetMouse.x - prev.x;
        const dy = targetMouse.y - prev.y;
        return {
          x: prev.x + dx * 0.14,
          y: prev.y + dy * 0.14,
        };
      });

      // Smooth light intensity transition (soft glow fade-in / fade-out)
      setLightIntensity((prev) => {
        const target = isLightActive ? 1 : 0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) return target;
        return prev + diff * 0.12;
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetMouse, isLightActive]);

  // Track cursor position across the whole hero viewport
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();

    // Local coordinates relative to the avatar container
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    setTargetMouse({ x: localX, y: localY });

    // Activate the volumetric light beam when the cursor is in or near the avatar
    const padding = 120;
    const isNearAvatar =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;

    setIsLightActive(isNearAvatar);

    // Subtle, organic 3D perspective tilt across the entire screen
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;
    const tiltX = ((e.clientY - windowCenterY) / windowCenterY) * -3.5;
    const tiltY = ((e.clientX - windowCenterX) / windowCenterX) * 3.5;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsLightActive(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  // Volumetric Studio Keylight Reveal Mask:
  // An elliptical light beam with smooth Gaussian falloff (20% -> 55% -> 80% -> 100%)
  // Real 4K photograph emerges naturally where the light falls;
  // Outside the beam, it smoothly falls off into the signature vector illustration.
  const lightRadiusX = 240 * lightIntensity;
  const lightRadiusY = 290 * lightIntensity;

  const lightRevealMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      lightIntensity > 0.01
        ? `radial-gradient(ellipse ${lightRadiusX}px ${lightRadiusY}px at ${smoothMouse.x}px ${smoothMouse.y}px, black 15%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%)`
        : "radial-gradient(circle 0px at 0 0, transparent 0%, transparent 100%)",
    maskImage:
      lightIntensity > 0.01
        ? `radial-gradient(ellipse ${lightRadiusX}px ${lightRadiusY}px at ${smoothMouse.x}px ${smoothMouse.y}px, black 15%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 75%, transparent 100%)`
        : "radial-gradient(circle 0px at 0 0, transparent 0%, transparent 100%)",
    opacity: lightIntensity,
    pointerEvents: "none",
    transition: "opacity 0.15s ease-out",
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-screen bg-[#E5E4E0] text-[#141414] flex flex-col items-center justify-center overflow-hidden select-none font-sans"
    >
      {/* ============================================================ */}
      {/* 1. TOPOGRAPHIC CONTOUR LINES & AMORPHOUS BLOBS (BACKGROUND)  */}
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
      {/* 2. CENTER STAGE: THE VOLUMETRIC LIGHT-SWEPT AVATAR           */}
      {/* ============================================================ */}
      <div
        ref={avatarRef}
        className="relative w-[92vw] sm:w-[75vw] md:w-[60vw] lg:w-[46vw] max-w-2xl h-[72vh] sm:h-[80vh] flex items-end justify-center transition-transform duration-200 ease-out will-change-transform z-20 cursor-default"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Soft realistic floor drop shadow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-black/15 rounded-full blur-2xl pointer-events-none" />

        {/* ------------------------------------------------------------ */}
        {/* LAYER A: BASE PERSONA (Signature Vector Illustration)       */}
        {/* Crisp, clean default layer visible everywhere               */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
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
        {/* LAYER B: VOLUMETRIC KEYLIGHT REVEAL (Real 4K Human Photo)   */}
        {/* Smoothly illuminated where the studio light beam passes     */}
        {/* ------------------------------------------------------------ */}
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none"
          style={lightRevealMaskStyle}
        >
          <Image
            src="/images/avatar-real.png"
            alt="Balaji S. - Human Reality"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 92vw, 50vw"
            className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. PHYSICAL SPECULAR LIGHT SHEEN (VOLUMETRIC AMBIENT BEAM)  */}
        {/* ------------------------------------------------------------ */}
        {lightIntensity > 0.05 && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse ${lightRadiusX * 1.3}px ${lightRadiusY * 1.3}px at ${smoothMouse.x}px ${smoothMouse.y}px, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 45%, transparent 75%)`,
              opacity: lightIntensity,
            }}
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. EDITORIAL SCROLL DOWN INDICATOR (BOTTOM CENTER)           */}
      {/* ============================================================ */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 select-none pointer-events-auto cursor-pointer group">
        {/* Minimalist animated capsule */}
        <div className="w-5 h-8.5 rounded-full border border-black/25 flex items-start justify-center p-1.5 backdrop-blur-xs transition-colors group-hover:border-black/50">
          <div className="w-1 h-2 rounded-full bg-[#111111] animate-bounce" />
        </div>

        {/* Typography Label */}
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-[0.28em] text-[#111111]/60 uppercase group-hover:text-[#111111] transition-colors">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3 h-3 text-[#111111]/40 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export function SpatialAvatar() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse move handler with 3D perspective calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation limits (-14 to +14 deg for subtle premium feel)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Mobile device orientation (gyroscope tilt)
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // Clamp tilt values for handheld feel
      const x = Math.max(-15, Math.min(15, (e.beta - 45) * 0.5));
      const y = Math.max(-15, Math.min(15, e.gamma * 0.5));
      setRotate({ x: -x, y });
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  return (
    <div className="relative group perspective-[1000px] flex items-center justify-center">
      {/* Ambient Titanium Glow behind card */}
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-zinc-800/40 via-zinc-500/20 to-zinc-800/40 blur-2xl transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: isHovered ? 0.8 : 0.35,
          transform: `translate3d(${rotate.y * 1.5}px, ${-rotate.x * 1.5}px, -20px)`,
        }}
      />

      {/* 3D Interactive Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-3 shadow-2xl transition-transform duration-200 ease-out will-change-transform overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
        }}
      >
        {/* Holographic Specular Sheen Overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 mix-blend-overlay"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.9), transparent 80%)`,
          }}
        />

        {/* Outer Titanium Trim Edge */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-20" />

        {/* Avatar Image Layer with 3D Depth Pop */}
        <div
          className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900/60 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Profile Illustration */}
          <Image
            src="/images/profile.png"
            alt="Balaji S. - ||BTL||™"
            fill
            priority
            unoptimized
            sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, 384px"
            className="object-contain p-2 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Bottom Badge Tag floating in 3D */}
          <div
            className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between z-40 transition-transform duration-200"
            style={{ transform: "translateZ(45px)" }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono tracking-wider text-zinc-300">
                ||BTL||™ LABS
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              VisionOS Spatial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


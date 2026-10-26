import { ArrowUpRight, Code2, Globe2, Mail, Terminal } from "lucide-react";
import { LandoReveal } from "./lando-reveal";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 md:py-20 px-6 sm:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-zinc-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full relative z-10">
        {/* Left Column: Identity & Manifesto (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Status HUD Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-zinc-300 tracking-wide">
               Bengaluru, IN • Available for select roles
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-sans">
              Balaji S.
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-zinc-400 tracking-tight">
              Software Architect & Systems Engineer
            </p>
          </div>

          {/* Bio Description */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl font-normal">
            Engineering high-throughput edge systems, Cloudflare architectures, and minimalist
            digital software. Driven by sub-second latencies, clean engineering, and bloat-free
            design.
          </p>

          {/* Core Stack Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Cloudflare Workers", "Next.js 15", "React 19", "Bun", "TypeScript", "1Password"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-zinc-900/80 border border-zinc-800/80 text-zinc-300"
                >
                  {tech}
                </span>
              )
            )}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <a
              href="https://github.com/Balajitechlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm"
            >
              <Terminal className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
            </a>

            <a
              href="mailto:contact@balajitechlabs.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 font-medium text-sm border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Contact</span>
            </a>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-zinc-500">
              <Globe2 className="w-3.5 h-3.5 text-zinc-600" />
              <span>balajitechlabs.com</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Lando Norris Interactive Reveal (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
          <LandoReveal />
        </div>
      </div>
    </section>
  );
}

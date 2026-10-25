import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none relative">
      <div className="space-y-6 max-w-sm">
        {/* Subtle Identity Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111113] border border-[#222225] text-xs text-[#a1a1aa]">
          <span className="text-[#ededed]"></span>
          <span>balajitechlabs.com</span>
          <span className="text-[#3f3f46]">/</span>
          <span className="text-[#71717a]">init</span>
        </div>

        {/* Clean Name & Status */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Balaji S.</h1>
          <p className="text-xs sm:text-sm text-[#71717a] font-mono leading-relaxed">
            Rebuilding the official portfolio.
            <br />
            Under active construction.
          </p>
        </div>

        {/* Direct Links */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="https://github.com/Balajitechlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#161618] border border-[#27272a] text-[#ededed] text-xs font-medium hover:border-[#3f3f46] hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-[#71717a]" />
          </Link>

          <Link
            href="mailto:contact@balajitechlabs.com"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#161618] border border-[#27272a] text-[#ededed] text-xs font-medium hover:border-[#3f3f46] hover:text-white transition-colors"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3 h-3 text-[#71717a]" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-[11px] text-[#52525b]">
        <span>Copyright (c) 2026 ||BTL||™</span>
      </footer>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Clock, ArrowUpRight } from "lucide-react";

export function Header() {
  const [timeStr, setTimeStr] = useState<string>("02:42:18 IST");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 border-b border-border-subtle bg-surface-1 px-5 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-mono text-[10px] font-bold">
            TX
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight text-white text-sm">TRACE-X</span>
            <span className="text-zinc-600 text-xs hidden lg:inline">/</span>
            <span className="text-xs text-zinc-400 font-normal hidden lg:inline">
              Financial Crime &amp; Insider Risk Investigation
            </span>
          </div>
        </Link>
      </div>

      {/* Center Search / Command Palette */}
      <div className="hidden xl:flex items-center gap-2 bg-surface-2 border border-border-subtle rounded px-2.5 py-1 w-72 text-xs text-zinc-400 focus-within:border-zinc-600 transition-colors">
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <span className="flex-1 text-[11px] text-zinc-400">Search entity, account, or case...</span>
        <kbd className="px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
          ⌘K
        </kbd>
      </div>

      {/* Institutional Telemetry & Case Link */}
      <div className="flex items-center gap-3.5">
        {/* Audit Status */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Audit telemetry synced</span>
        </div>

        {/* IST Clock */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
          <Clock className="w-3 h-3 text-zinc-600" />
          <span>{timeStr}</span>
        </div>

        {/* Case Direct Shortcut */}
        <Link
          href="/cases/TX-48291"
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-2 hover:bg-zinc-800 border border-border-subtle text-zinc-300 text-xs font-mono transition-colors"
        >
          <span>Case #TX-48291</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-500" />
        </Link>
      </div>
    </header>
  );
}

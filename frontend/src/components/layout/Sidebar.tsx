"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  GitFork,
  SlidersHorizontal,
  FlaskConical,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Command Center",
    href: "/",
    icon: LayoutDashboard,
    badge: null
  },
  {
    name: "Investigation Queue",
    href: "/cases",
    icon: ShieldAlert,
    badge: "17"
  },
  {
    name: "Investigation Studio",
    href: "/cases/TX-48291",
    icon: GitFork,
    badge: "Active"
  },
  {
    name: "Counterfactual Sandbox",
    href: "/sandbox",
    icon: SlidersHorizontal,
    badge: null
  },
  {
    name: "Scenario Lab & Validation",
    href: "/scenarios",
    icon: FlaskConical,
    badge: "7 Tests"
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-border-subtle bg-surface-1 flex flex-col justify-between py-3 shrink-0 hidden md:flex select-none">
      <div>
        <div className="px-4 mb-2">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Platform Modules
          </p>
        </div>

        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors group",
                  isActive
                    ? "bg-surface-2 text-white font-medium border border-border-strong/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-surface-2/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-zinc-400 border border-border-subtle">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Institutional Compliance & Audit Session Footer */}
      <div className="px-3 pt-3 border-t border-border-subtle">
        <div className="p-2.5 rounded bg-surface-2/40 border border-border-subtle text-[11px] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-medium text-zinc-300">Auditor Session</span>
            <span className="text-[10px] font-mono text-zinc-500">FIU-IND</span>
          </div>
          <p className="text-zinc-400 truncate">
            Reviewer: V. Malvankar
          </p>
          <p className="text-[10px] text-zinc-600 font-mono">
            Role: Lead Forensic Reviewer
          </p>
        </div>
      </div>
    </aside>
  );
}

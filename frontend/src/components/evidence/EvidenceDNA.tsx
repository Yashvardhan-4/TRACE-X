"use client";

import React from "react";
import { EvidenceDNA as EvidenceDNAType } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  dna: EvidenceDNAType;
  compact?: boolean;
}

const DNA_DIMENSIONS = [
  { key: "insider_risk", label: "Insider activity" },
  { key: "privilege_exposure", label: "Privilege exposure" },
  { key: "structuring", label: "Structuring pattern" },
  { key: "network_anomaly", label: "Network relationship" },
  { key: "temporal_correlation", label: "Temporal proximity" },
  { key: "profile_deviation", label: "Profile baseline deviation" },
  { key: "device_anomaly", label: "Device & access anomaly" },
] as const;

export function EvidenceDNA({ dna, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-1" title="Evidence signal distribution">
        {DNA_DIMENSIONS.map((dim) => {
          const val = dna[dim.key as keyof EvidenceDNAType] || 0;
          return (
            <div
              key={dim.key}
              title={`${dim.label}: ${val}%`}
              className={cn(
                "h-3 w-1.5 rounded-xs transition-colors",
                val >= 80
                  ? "bg-red-400"
                  : val >= 50
                  ? "bg-amber-400"
                  : "bg-zinc-700"
              )}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-300">
          Evidence Signal Vector
        </span>
        <span className="text-zinc-500 font-mono text-[11px]">7 Correlated Dimensions</span>
      </div>

      <div className="space-y-2">
        {DNA_DIMENSIONS.map((dim) => {
          const score = dna[dim.key as keyof EvidenceDNAType] || 0;
          const isHigh = score >= 80;
          const isMedium = score >= 50 && score < 80;

          return (
            <div key={dim.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">{dim.label}</span>
                <span className={cn(
                  "font-mono font-medium",
                  isHigh ? "text-red-400" : isMedium ? "text-amber-400" : "text-zinc-400"
                )}>
                  {score}%
                </span>
              </div>
              <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isHigh
                      ? "bg-red-500/80"
                      : isMedium
                      ? "bg-amber-500/80"
                      : "bg-zinc-600"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

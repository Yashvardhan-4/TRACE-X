"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  evidenceItems: EvidenceItem[];
}

export function EvidenceCards({ evidenceItems }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {evidenceItems.map((item) => {
        const isExpanded = expandedId === item.evidence_id;

        return (
          <div
            key={item.evidence_id}
            className="rounded border border-border-subtle bg-surface-1 transition-colors hover:border-zinc-700 overflow-hidden"
          >
            <div
              onClick={() => toggleExpand(item.evidence_id)}
              className="p-3 flex items-start justify-between cursor-pointer select-none"
            >
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {item.engine_name}
                  </span>
                  {item.deviation_factor && (
                    <span className="text-[10px] font-mono px-1 rounded bg-zinc-800 text-amber-300">
                      {item.deviation_factor}x baseline
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                  {item.claim}
                </p>
              </div>

              <button className="text-zinc-500 hover:text-zinc-300 pt-0.5">
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable Audit Payload */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-2 border-t border-border-subtle bg-surface-2/40 space-y-1.5 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Source Event:</span>
                  <span className="text-zinc-200">{item.source_event_id} ({item.source_event_type})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Detection Model/Rule:</span>
                  <span className="text-zinc-300">{item.rule_or_model_ref}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recorded Timestamp:</span>
                  <span className="text-zinc-400">{new Date(item.event_timestamp).toLocaleTimeString("en-IN")} IST</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

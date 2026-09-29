"use client";

import React from "react";
import { TimelineEvent } from "@/types";
import { Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  events: TimelineEvent[];
  activeEventId?: string;
  onSelectEvent?: (eventId: string) => void;
}

export function AttackTimeline({ events, activeEventId, onSelectEvent }: Props) {
  return (
    <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
      {events.map((event) => {
        const isSelected = activeEventId === event.event_id;

        return (
          <div
            key={event.event_id}
            onClick={() => onSelectEvent?.(event.event_id)}
            className={cn(
              "relative cursor-pointer transition-colors rounded p-3 border text-xs",
              isSelected
                ? "bg-surface-2 border-zinc-600"
                : "bg-surface-1 border-border-subtle hover:border-zinc-700"
            )}
          >
            {/* Timeline Dot */}
            <div
              className={cn(
                "absolute -left-[24px] top-3.5 w-2 h-2 rounded-full border border-background",
                event.is_privileged
                  ? "bg-amber-400"
                  : event.severity === "CRITICAL"
                  ? "bg-red-400"
                  : "bg-zinc-500"
              )}
            />

            {/* Event Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-white text-[11px]">
                  {event.formatted_time}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  +{event.delta_minutes}m
                </span>
              </div>

              {event.is_privileged && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  <Key className="w-2.5 h-2.5" />
                  <span>Privilege ({event.permission_code || "Override"})</span>
                </span>
              )}
            </div>

            {/* Actor and Action */}
            <div className="flex items-center gap-1.5 text-[11px] mb-1">
              <span className="font-medium text-zinc-300">
                {event.actor_name}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 text-[10px] font-mono">
                {event.action_type}
              </span>
            </div>

            {/* Summary */}
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {event.summary}
            </p>

            {/* Event Reference Tag */}
            <div className="mt-2 pt-1.5 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Event ID: {event.source_event_id}</span>
              <span className="capitalize">{event.severity.toLowerCase()} priority</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { queryCopilot } from "@/lib/api";
import { Bot, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  evidenceIds?: string[];
}

const PROMPT_SUGGESTIONS = [
  "Why was this case flagged?",
  "What privilege did Employee E104 use?",
  "Trace the downstream mule accounts",
  "Explain counterfactual analysis result"
];

export function CopilotDrawer({ caseId, isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Investigator Copilot active for Case #${caseId}. Answers are generated strictly from verified audit events in the case evidence store without external extrapolation.`,
      evidenceIds: ["EV_TX-48291_EVT_4487"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await queryCopilot(caseId, q);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: res.answer,
          evidenceIds: res.grounded_evidence_ids
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to retrieve evidence items from the data store.",
          evidenceIds: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface-1 border-l border-border-strong shadow-popover z-50 flex flex-col">
      {/* Header */}
      <div className="p-3.5 border-b border-border-subtle flex items-center justify-between bg-surface-2/30">
        <div>
          <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
            <span>Investigator Copilot</span>
            <span className="text-[10px] font-mono px-1 rounded bg-zinc-800 text-zinc-400 font-normal">
              Evidence Store Grounded
            </span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Case #{caseId}</p>
        </div>

        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white p-1 rounded hover:bg-surface-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded p-2.5 text-xs leading-relaxed max-w-[92%]",
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-surface-2 border border-border-subtle text-zinc-300"
            )}
          >
            <p className="font-sans">{m.content}</p>
            {m.evidenceIds && m.evidenceIds.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-border-subtle flex flex-wrap gap-1">
                {m.evidenceIds.map((id) => (
                  <span
                    key={id}
                    className="text-[9px] font-mono px-1 py-0.2 rounded bg-surface-1 text-zinc-400 border border-border-subtle"
                  >
                    REF: {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-surface-2 border border-border-subtle text-zinc-400 rounded p-2.5 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
            <span>Querying verified evidence store...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-3.5 py-2 border-t border-border-subtle bg-surface-2/20 flex flex-wrap gap-1">
        {PROMPT_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[10px] px-2 py-0.5 rounded bg-surface-1 border border-border-subtle text-zinc-400 hover:text-zinc-200 hover:bg-surface-2 transition-colors text-left"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-subtle bg-surface-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask question regarding evidence..."
            className="flex-1 bg-surface-2 border border-border-subtle rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors text-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

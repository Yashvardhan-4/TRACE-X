"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  fetchCaseDetail,
  fetchCaseGraph,
  fetchCaseTimeline,
  simulateCounterfactual
} from "@/lib/api";
import { CaseDetail, InvestigationGraph as GraphType, TimelineResponse } from "@/types";
import { formatINR } from "@/lib/utils";
import { InvestigationGraph } from "@/components/graph/InvestigationGraph";
import { AttackTimeline } from "@/components/timeline/AttackTimeline";
import { EvidenceDNA } from "@/components/evidence/EvidenceDNA";
import { EvidenceCards } from "@/components/evidence/EvidenceCards";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";
import { AuditDossierModal } from "@/components/dossier/AuditDossierModal";
import {
  ArrowLeft,
  SlidersHorizontal,
  FileText,
  Bot,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaseInvestigationStudioPage() {
  const params = useParams();
  const caseId = (params?.id as string) || "TX-48291";

  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [graphData, setGraphData] = useState<GraphType | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"evidence" | "timeline" | "copilot">("evidence");

  // Counterfactual Sandbox state
  const [isCounterfactual, setIsCounterfactual] = useState(false);
  const [counterfactualResult, setCounterfactualResult] = useState<any>(null);

  // Modals & Drawers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  useEffect(() => {
    fetchCaseDetail(caseId).then(setCaseDetail);
    fetchCaseGraph(caseId).then(setGraphData);
    fetchCaseTimeline(caseId).then(setTimelineData);
  }, [caseId]);

  const handleToggleCounterfactual = async () => {
    const nextState = !isCounterfactual;
    setIsCounterfactual(nextState);
    const res = await simulateCounterfactual(caseId, nextState);
    setCounterfactualResult(res);
  };

  if (!caseDetail || !graphData || !timelineData) {
    return (
      <div className="h-[calc(100vh-3rem)] flex items-center justify-center font-mono text-xs text-zinc-500">
        <span>Loading investigation studio for Case #{caseId}...</span>
      </div>
    );
  }

  const currentRisk = isCounterfactual
    ? counterfactualResult?.counterfactual_risk_score ?? 11.5
    : caseDetail.composite_risk_score;

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col overflow-hidden bg-background">
      {/* Studio Header Bar */}
      <div className="h-12 border-b border-border-subtle bg-surface-1 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left: Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/cases"
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-baseline gap-2">
            <span className="text-xs font-mono font-medium text-white">
              Case #{caseDetail.case_id}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-300 font-medium">
              {caseDetail.typology}
            </span>
            <span className="text-[10px] font-mono px-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
              {caseDetail.severity} RISK
            </span>
          </div>
        </div>

        {/* Center: Risk Score Display */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Risk Assessment:</span>
          <span className={cn(
            "font-semibold text-sm",
            currentRisk >= 75 ? "text-red-400" : "text-emerald-400"
          )}>
            {currentRisk}%
          </span>
          {isCounterfactual && (
            <span className="text-[11px] text-emerald-400 font-medium">
              (&Delta; -82.7% under intervention removal)
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Counterfactual Toggle */}
          <button
            onClick={handleToggleCounterfactual}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 border",
              isCounterfactual
                ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                : "bg-surface-2 hover:bg-surface-elevated text-zinc-300 border-border-subtle"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isCounterfactual ? "Counterfactual Active" : "Counterfactual Test"}</span>
          </button>

          {/* Dossier Modal */}
          <button
            onClick={() => setIsDossierOpen(true)}
            className="px-2.5 py-1 rounded bg-surface-2 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-border-subtle transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Export Dossier</span>
          </button>

          {/* Copilot Assistant */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="p-1 rounded bg-surface-2 hover:bg-zinc-800 text-zinc-300 border border-border-subtle transition-colors"
            title="Investigator Copilot"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Counterfactual Alert Notification */}
      {isCounterfactual && (
        <div className="bg-surface-2 border-b border-zinc-700 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-zinc-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>
              Counterfactual analysis: Employee E104 intervention removed. Beneficiary B992 cooling bypass is invalidated; downstream transfer TX-99182 cannot disburse. Risk drops to 11.5%.
            </span>
          </div>
          <button
            onClick={handleToggleCounterfactual}
            className="text-[11px] text-zinc-400 hover:text-white underline"
          >
            Reset
          </button>
        </div>
      )}

      {/* Main Studio Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left 65%: The Visual Centerpiece (Graph Canvas) */}
        <div className="flex-[65] h-full p-3 relative">
          <InvestigationGraph
            initialNodes={graphData.nodes}
            initialEdges={graphData.edges}
            isCounterfactualMode={isCounterfactual}
          />
        </div>

        {/* Right 35%: Calm Editorial Cockpit */}
        <div className="flex-[35] h-full border-l border-border-subtle bg-surface-1 flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex items-center border-b border-border-subtle px-3 shrink-0 bg-surface-2/20">
            <button
              onClick={() => setActiveTab("evidence")}
              className={cn(
                "py-2.5 px-3 text-xs font-medium transition-colors border-b-2",
                activeTab === "evidence"
                  ? "border-blue-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              )}
            >
              Evidence Ledger
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={cn(
                "py-2.5 px-3 text-xs font-medium transition-colors border-b-2",
                activeTab === "timeline"
                  ? "border-blue-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              )}
            >
              Attack Sequence
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="py-2.5 px-3 text-xs font-mono text-zinc-400 hover:text-white ml-auto flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copilot Q&amp;A</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeTab === "evidence" && (
              <div className="space-y-5">
                {/* Evidence DNA Vector */}
                <div className="p-3.5 rounded bg-surface-2/30 border border-border-subtle">
                  <EvidenceDNA dna={caseDetail.evidence_dna} />
                </div>

                {/* Narrative Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    Attack Chain Summary
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-surface-2/20 p-2.5 rounded border border-border-subtle">
                    {caseDetail.attack_chain_summary}
                  </p>
                </div>

                {/* Evidence Items */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    Audit Evidence Ledger ({caseDetail.evidence_items.length} Signals)
                  </h4>
                  <EvidenceCards evidenceItems={caseDetail.evidence_items} />
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-1 border-b border-border-subtle">
                  <span>Chronological Sequence</span>
                  <span>Duration: {timelineData.total_duration_minutes}m</span>
                </div>
                <AttackTimeline events={timelineData.events} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copilot Drawer */}
      <CopilotDrawer
        caseId={caseId}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Compliance Audit Dossier Modal */}
      <AuditDossierModal
        caseData={caseDetail}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
}

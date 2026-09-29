"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { simulateCounterfactual, fetchCaseGraph } from "@/lib/api";
import { CounterfactualResponse, InvestigationGraph as GraphType } from "@/types";
import { InvestigationGraph } from "@/components/graph/InvestigationGraph";
import {
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CounterfactualSandboxPage() {
  const [caseId, setCaseId] = useState("TX-48291");
  const [removeEmployee, setRemoveEmployee] = useState(true);
  const [result, setResult] = useState<CounterfactualResponse | null>(null);
  const [graphData, setGraphData] = useState<GraphType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchCaseGraph(caseId),
      simulateCounterfactual(caseId, removeEmployee)
    ]).then(([graph, res]) => {
      setGraphData(graph);
      setResult(res);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [caseId, removeEmployee]);

  const handleToggle = () => {
    setRemoveEmployee(prev => !prev);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202226] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">
              Counterfactual Analysis Sandbox
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Structural Dependency
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Evaluate structural necessity under graph perturbation G&apos; = G \ &#123;e_insider&#125; to determine if insider intervention was indispensable to laundering execution.
          </p>
        </div>

        <Link
          href={`/cases/${caseId}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#111214] hover:bg-[#18191C] text-slate-300 text-xs font-mono border border-[#202226] hover:border-[#2E3138] transition-colors"
        >
          <span>Studio #{caseId}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Perturbation Controls & Findings (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Perturbation Control Card */}
          <div className="p-5 rounded-lg bg-[#111214] border border-[#202226] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                Graph Perturbation Control
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                G&apos; Mode
              </span>
            </div>

            <div className="p-4 rounded-md bg-[#090A0B] border border-[#202226] flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-medium text-slate-200">
                  Sever Employee E104 Action Edge
                </h4>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-relaxed">
                  Simulates enforcement of 24-hr cooling period on cooling override
                </p>
              </div>

              {/* Clean Institutional Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={removeEmployee}
                onClick={handleToggle}
                className={cn(
                  "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-500",
                  removeEmployee ? "bg-blue-600" : "bg-[#202226]"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                    removeEmployee ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Differential Metrics */}
            {result && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-[#090A0B] border border-[#202226]">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">
                      Observed Risk (G)
                    </span>
                    <span className="text-xl font-semibold font-mono tabular-nums text-red-400 mt-1 block">
                      {result.original_risk_score}%
                    </span>
                    <span className="text-[10px] text-slate-600 font-sans block mt-0.5">
                      Unperturbed baseline
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#090A0B] border border-[#202226]">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">
                      Perturbed Risk (G&apos;)
                    </span>
                    <span className="text-xl font-semibold font-mono tabular-nums text-emerald-400 mt-1 block">
                      {result.counterfactual_risk_score}%
                    </span>
                    <span className="text-[10px] text-slate-600 font-sans block mt-0.5">
                      Intervention removed
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400 font-sans text-[11px]">Risk Differential:</span>
                  <span className="font-semibold tabular-nums">Δ -{result.risk_delta}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Structural Dependency Findings */}
          {result && (
            <div className="p-5 rounded-lg bg-[#111214] border border-[#202226] space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Counterfactual Dependency Assessment</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {result.structural_dependency_proof}
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-[#202226]">
                <span className="text-slate-500">Severed dependency:</span>{" "}
                <span className="text-blue-400 font-medium">{result.broken_step_label}</span>
              </div>
            </div>
          )}

          {/* Methodology Card */}
          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Audit Methodology Note</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
              Structural dependency is computed using graph reachability and multi-factor risk recalculation when insider-privileged actions are isolated from the heterogeneous attack graph.
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Graph Visualizer (8 cols) */}
        <div className="lg:col-span-8 h-[640px] rounded-lg border border-[#202226] bg-[#090A0B] p-4 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#202226] mb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-300">
                Topology Visualizer ({removeEmployee ? "Perturbed G'" : "Observed G"})
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Severed
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative">
            {graphData ? (
              <InvestigationGraph
                initialNodes={graphData.nodes}
                initialEdges={graphData.edges}
                isCounterfactualMode={removeEmployee}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-500">
                Loading counterfactual graph topology...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

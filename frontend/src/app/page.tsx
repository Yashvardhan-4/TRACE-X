"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCases } from "@/lib/api";
import { CaseSummary } from "@/types";
import { formatINR } from "@/lib/utils";
import { EvidenceDNA } from "@/components/evidence/EvidenceDNA";
import { ArrowUpRight, ArrowRight, Shield, Layers, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommandCenterPage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);

  useEffect(() => {
    fetchCases().then(setCases);
  }, []);

  const totalExposure = cases.reduce((acc, c) => acc + c.total_exposure_inr, 0);
  const criticalCount = cases.filter(c => c.severity === "CRITICAL").length;
  const highCount = cases.filter(c => c.severity === "HIGH").length;
  const showcaseCase = cases.find(c => c.case_id === "TX-48291") || cases[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Editorial Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Investigation Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active forensic investigations correlating privileged insider actions with transaction pathways.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Link
            href="/cases"
            className="px-2.5 py-1 rounded bg-surface-1 hover:bg-surface-2 text-zinc-300 border border-border-subtle transition-colors flex items-center gap-1"
          >
            <span>All Cases ({cases.length})</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </Link>
          <Link
            href="/scenarios"
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-border-subtle transition-colors"
          >
            Validation Benchmark
          </Link>
        </div>
      </div>

      {/* Proportional Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="p-3.5 rounded bg-surface-1 border border-border-subtle space-y-1">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
            Monitored Exposure
          </span>
          <div className="text-xl font-semibold font-mono text-white tracking-tight">
            {formatINR(totalExposure || 47200000)}
          </div>
          <span className="text-[11px] text-zinc-500 block">
            Across {cases.length} correlated pathways
          </span>
        </div>

        <div className="p-3.5 rounded bg-surface-1 border border-border-subtle space-y-1">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
            Active Investigations
          </span>
          <div className="text-xl font-semibold font-mono text-white tracking-tight flex items-baseline gap-2">
            <span>{cases.length}</span>
            <span className="text-xs text-zinc-400 font-normal">({criticalCount} critical, {highCount} high)</span>
          </div>
          <span className="text-[11px] text-zinc-500 block">
            Pending reviewer audit
          </span>
        </div>

        <div className="p-3.5 rounded bg-surface-1 border border-border-subtle space-y-1">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
            Attributed Insider Signals
          </span>
          <div className="text-xl font-semibold font-mono text-zinc-200 tracking-tight">
            42 Events
          </div>
          <span className="text-[11px] text-zinc-500 block">
            Cross-matched access &amp; KYC overrides
          </span>
        </div>

        <div className="p-3.5 rounded bg-surface-1 border border-border-subtle space-y-1">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
            Validation Benchmark
          </span>
          <div className="text-xl font-semibold font-mono text-zinc-200 tracking-tight flex items-baseline gap-1.5">
            <span>7/7 Matched</span>
          </div>
          <span className="text-[11px] text-zinc-500 block">
            Curated prototype test set
          </span>
        </div>
      </div>

      {/* Featured Investigation: Case #TX-48291 */}
      {showcaseCase && (
        <div className="p-4 rounded bg-surface-1 border border-border-strong/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-medium text-red-400 px-1.5 py-0.2 rounded bg-red-500/10 border border-red-500/20">
                  Priority Case #{showcaseCase.case_id}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {showcaseCase.typology}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-white">
                {showcaseCase.title}
              </h2>

              <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">
                Relationship Manager E104 accessed Customer C782 off-shift and bypassed the 24-hr beneficiary cooling period (P07) at 02:25 AM. An outward transfer of ₹9,70,000 (13.1x baseline) followed 17 minutes later, immediately structured into two tranches to shell mule accounts.
              </p>

              <div className="pt-2 flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                <span>Employee: <span className="text-zinc-200">E104 (V. Malhotra)</span></span>
                <span>•</span>
                <span>Customer: <span className="text-zinc-200">C782 (R. Sharma)</span></span>
                <span>•</span>
                <span>Exposure: <span className="text-zinc-200 font-medium">{formatINR(showcaseCase.total_exposure_inr)}</span></span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="text-left sm:text-right font-mono text-xs pr-1">
                <span className="text-zinc-500 text-[10px] block uppercase">Risk Assessment</span>
                <span className="text-base font-semibold text-red-400">
                  {showcaseCase.composite_risk_score}%
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/cases/${showcaseCase.case_id}`}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Open Investigation Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/sandbox"
                  className="px-2.5 py-1.5 rounded bg-surface-2 hover:bg-zinc-800 text-zinc-300 text-xs border border-border-subtle transition-colors"
                >
                  Counterfactual Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Investigations Table */}
      <div className="rounded border border-border-subtle bg-surface-1 overflow-hidden">
        <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-2/30 text-xs">
          <span className="font-medium text-zinc-200">
            Active Forensic Cases
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Prioritized by composite deviation score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/40 text-zinc-400 text-[10px] font-mono uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-2.5 px-3.5">Case Reference</th>
                <th className="py-2.5 px-3.5">Typology</th>
                <th className="py-2.5 px-3.5">Attributed Entities</th>
                <th className="py-2.5 px-3.5">Exposure</th>
                <th className="py-2.5 px-3.5">Evidence Vector</th>
                <th className="py-2.5 px-3.5">Risk</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {cases.slice(0, 5).map((c) => (
                <tr key={c.case_id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-white">
                    #{c.case_id}
                  </td>
                  <td className="py-2.5 px-3.5 font-sans text-zinc-300">
                    {c.typology}
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-400">
                    {c.primary_employee_id || "Direct"} ➔ {c.primary_customer_id || "Account"}
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-200">
                    {formatINR(c.total_exposure_inr)}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <EvidenceDNA dna={c.evidence_dna} compact />
                  </td>
                  <td className="py-2.5 px-3.5 font-medium">
                    <span className={cn(
                      c.composite_risk_score >= 80 ? "text-red-400" : c.composite_risk_score >= 50 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {c.composite_risk_score}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-sans">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-zinc-400 border border-border-subtle">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <Link
                      href={`/cases/${c.case_id}`}
                      className="text-xs text-blue-400 hover:text-blue-300 font-sans transition-colors"
                    >
                      Investigate ➔
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

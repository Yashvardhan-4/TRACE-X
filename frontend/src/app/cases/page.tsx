"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCases } from "@/lib/api";
import { CaseSummary } from "@/types";
import { formatINR } from "@/lib/utils";
import { EvidenceDNA } from "@/components/evidence/EvidenceDNA";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvestigationQueuePage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  useEffect(() => {
    fetchCases().then(setCases);
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.case_id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.typology.toLowerCase().includes(search.toLowerCase()) ||
      (c.primary_employee_id && c.primary_employee_id.toLowerCase().includes(search.toLowerCase())) ||
      (c.primary_customer_id && c.primary_customer_id.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = selectedSeverity === "ALL" || c.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border-subtle pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Investigation Queue
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {filteredCases.length} prioritized cases awaiting forensic review and regulatory filing.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-surface-2 border border-border-subtle rounded px-2.5 py-1 text-xs text-zinc-300 w-56 focus-within:border-zinc-600 transition-colors">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search case, entity, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-surface-2 border border-border-subtle rounded px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-surface-2 border border-border-subtle rounded px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="CLOSED_FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded border border-border-subtle bg-surface-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2/40 text-zinc-400 text-[10px] font-mono uppercase tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-2.5 px-3.5">Case Reference</th>
                <th className="py-2.5 px-3.5">Typology &amp; Details</th>
                <th className="py-2.5 px-3.5">Attributed Employee</th>
                <th className="py-2.5 px-3.5">Customer Account</th>
                <th className="py-2.5 px-3.5">Exposure</th>
                <th className="py-2.5 px-3.5">Evidence Vector</th>
                <th className="py-2.5 px-3.5">Risk Score</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {filteredCases.map((c) => (
                <tr key={c.case_id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-white">
                    #{c.case_id}
                  </td>
                  <td className="py-3 px-3.5 font-sans">
                    <span className="font-medium text-zinc-200 block text-xs">{c.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{c.typology}</span>
                  </td>
                  <td className="py-3 px-3.5 text-zinc-300">
                    {c.primary_employee_id ? (
                      <span className="text-zinc-200">{c.primary_employee_id}</span>
                    ) : (
                      <span className="text-zinc-500">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-zinc-300">
                    {c.primary_customer_id || "Direct Transfer"}
                  </td>
                  <td className="py-3 px-3.5 text-zinc-200 font-medium">
                    {formatINR(c.total_exposure_inr)}
                  </td>
                  <td className="py-3 px-3.5">
                    <EvidenceDNA dna={c.evidence_dna} compact />
                  </td>
                  <td className="py-3 px-3.5 font-medium">
                    <span
                      className={cn(
                        c.composite_risk_score >= 80
                          ? "text-red-400"
                          : c.composite_risk_score >= 50
                          ? "text-amber-400"
                          : "text-emerald-400"
                      )}
                    >
                      {c.composite_risk_score}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-sans">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-zinc-400 border border-border-subtle">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <Link
                      href={`/cases/${c.case_id}`}
                      className="text-xs text-blue-400 hover:text-blue-300 font-sans transition-colors"
                    >
                      Open Studio ➔
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    No cases match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

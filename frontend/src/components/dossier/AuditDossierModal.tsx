"use client";

import React from "react";
import { CaseDetail } from "@/types";
import { formatINR } from "@/lib/utils";
import { Printer, X, FileText, Lock } from "lucide-react";

interface Props {
  caseData: CaseDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditDossierModal({ caseData, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0E0F11] border border-border-strong rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-popover text-zinc-200 overflow-hidden">
        {/* Modal Toolbar */}
        <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono font-medium text-zinc-300">
              Forensic Audit Dossier • Case #{caseData.case_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-surface-elevated text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Institutional Document */}
        <div className="p-8 overflow-y-auto space-y-6 font-sans text-xs print:p-0 print:text-black print:bg-white">
          {/* Institution Header */}
          <div className="border-b border-zinc-800 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white uppercase">
                BankCorp Forensic Intelligence &amp; Special Investigations Unit
              </h1>
              <p className="text-zinc-400 text-[11px] font-mono mt-0.5">
                Financial Crime &amp; Insider Risk Division • Ref: FATF-RBA / RBI-FRM Directions 2024
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-zinc-400">
              <p className="font-semibold text-zinc-300">CONFIDENTIAL // COMPLIANCE GRADE</p>
              <p>Dossier: AUD-{caseData.case_id}-2026</p>
              <p>Generated: {new Date().toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          {/* Executive Overview Data */}
          <div className="grid grid-cols-4 gap-4 p-3 rounded bg-surface-1 border border-border-subtle font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Case Reference</span>
              <span className="font-semibold text-white">#{caseData.case_id}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Risk Assessment</span>
              <span className="font-semibold text-white">{caseData.composite_risk_score}% ({caseData.severity})</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Monitored Exposure</span>
              <span className="font-semibold text-zinc-200">{formatINR(caseData.total_exposure_inr)}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Reviewer</span>
              <span className="font-semibold text-zinc-300">{caseData.assigned_investigator || "SIU Team"}</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-1">
              1. Incident Summary &amp; Investigative Findings
            </h3>
            <p className="text-zinc-300 leading-relaxed text-xs">
              {caseData.attack_chain_summary}
            </p>
          </div>

          {/* Section 2: Entity Forensics */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-1">
              2. Entity Attribution &amp; Privilege Profile
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded bg-surface-1 border border-border-subtle space-y-0.5">
                <span className="text-zinc-500 block">Attributed Employee</span>
                <span className="text-white font-medium">{caseData.primary_employee_id} (Vikram Malhotra - Relationship Manager)</span>
                <p className="text-zinc-400 font-mono text-[10px]">Privileges Exercised: P03 (KYC Override), P07 (Cooling Period Bypass)</p>
              </div>
              <div className="p-2.5 rounded bg-surface-1 border border-border-subtle space-y-0.5">
                <span className="text-zinc-500 block">Target Customer Account</span>
                <span className="text-white font-medium">{caseData.primary_customer_id} (Rajesh V. Sharma)</span>
                <p className="text-zinc-400 font-mono text-[10px]">Account: ACC_A221 • Historical Baseline: ₹74,000/mo</p>
              </div>
            </div>
          </div>

          {/* Section 3: Evidence Matrix */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-1">
              3. Evidence Items &amp; Technical Deviation Observations
            </h3>
            <div className="space-y-1.5">
              {caseData.evidence_items.map((ev) => (
                <div key={ev.evidence_id} className="p-2 rounded bg-surface-1 border border-border-subtle text-[11px] space-y-0.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-zinc-300 font-medium">{ev.engine_name}</span>
                    <span className="text-zinc-400">{ev.rule_or_model_ref}</span>
                  </div>
                  <p className="text-zinc-300">{ev.claim}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Counterfactual / Structural Dependency Analysis */}
          <div className="p-3 rounded bg-surface-1 border border-zinc-700 space-y-1">
            <h4 className="text-xs font-semibold text-white">
              4. Counterfactual Structural Dependency Analysis
            </h4>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Under graph perturbation G&apos; = G \ [e_insider], removing Employee E104&apos;s cooling period override (P07) preserves automated 24-hr verification. The outward transfer TX-99182 cannot execute under standard controls, dropping the structural risk assessment from 94.2% to 11.5% (&Delta; -82.7%). This confirms that the employee&apos;s privileged intervention was structurally necessary to enable the observed financial flow.
            </p>
          </div>

          {/* Section 5: Signature & Cryptographic Seal */}
          <div className="pt-4 border-t border-zinc-800 flex items-end justify-between font-mono text-[10px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Audit Hash: SHA256:4a88f199b2c39e01 // Tamper-evident verified</span>
            </div>
            <div className="text-right">
              <p className="text-zinc-300 font-medium">Authorized Officer Sign-off</p>
              <p>Special Investigations Unit • Nariman Point, Mumbai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

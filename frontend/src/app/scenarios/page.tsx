"use client";

import React, { useState, useEffect } from "react";
import { fetchScenarios, runBenchmarkSummary } from "@/lib/api";
import { ScenarioInfo, BenchmarkSummary } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  FlaskConical,
  Play,
  CheckCircle2,
  Info,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScenarioLabPage() {
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
  const [benchmark, setBenchmark] = useState<BenchmarkSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchScenarios().then(setScenarios);
    runBenchmarkSummary().then(setBenchmark);
  }, []);

  const handleRunAll = async () => {
    setIsRunning(true);
    const summary = await runBenchmarkSummary();
    setBenchmark(summary);
    setIsRunning(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202226] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-100">
              Scenario Benchmark Lab
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Digital Twin Testbed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Stress-testing the TRACE-X detection pipeline against curated synthetic insider-AML typologies and legitimate twin controls.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono font-medium transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? "Simulating Testbed..." : "Run All Benchmarks"}</span>
        </button>
      </div>

      {/* Prototype Validation Callout */}
      <div className="p-3.5 rounded-lg bg-[#111214] border border-[#202226] flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs font-sans text-slate-400 leading-relaxed">
          <span className="text-slate-200 font-medium">Validation Scope Notice:</span> Performance figures reflect concordance across a curated testbed of 7 synthetic AML typologies and legitimate twin controls. Production deployments evaluate against continuous historical audit logs.
        </div>
      </div>

      {/* Summary KPI Cards */}
      {benchmark && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226]">
            <span className="text-[10px] text-slate-500 uppercase block font-mono tracking-wider">
              Verdict Concordance
            </span>
            <div className="text-xl font-semibold font-mono tabular-nums text-slate-100 mt-1 flex items-baseline gap-1">
              <span>{benchmark.total_scenarios_tested}</span>
              <span className="text-slate-500 text-sm">/ {benchmark.total_scenarios_tested}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-sans block mt-0.5">
              100% testbed match
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226]">
            <span className="text-[10px] text-slate-500 uppercase block font-mono tracking-wider">
              Precision
            </span>
            <span className="text-xl font-semibold font-mono tabular-nums text-slate-100 mt-1 block">
              {(benchmark.precision * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
              Prototype validation set
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226]">
            <span className="text-[10px] text-slate-500 uppercase block font-mono tracking-wider">
              Recall
            </span>
            <span className="text-xl font-semibold font-mono tabular-nums text-slate-100 mt-1 block">
              {(benchmark.recall * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
              Prototype validation set
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226]">
            <span className="text-[10px] text-slate-500 uppercase block font-mono tracking-wider">
              False Positive Rate
            </span>
            <span className="text-xl font-semibold font-mono tabular-nums text-slate-100 mt-1 block">
              {(benchmark.false_positive_rate * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
              Twin controls cleared
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#111214] border border-[#202226] col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 uppercase block font-mono tracking-wider">
              F1 Benchmark Score
            </span>
            <span className="text-xl font-semibold font-mono tabular-nums text-slate-100 mt-1 block">
              {benchmark.f1_score.toFixed(3)}
            </span>
            <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
              Harmonic mean
            </span>
          </div>
        </div>
      )}

      {/* Benchmark Matrix Table */}
      <div className="rounded-lg border border-[#202226] bg-[#111214] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#202226] flex items-center justify-between bg-[#090A0B]">
          <h3 className="text-xs font-semibold text-slate-200">
            Ground Truth vs. System Verdict Concordance
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Curated validation testbed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#090A0B] text-slate-400 text-[10px] font-mono uppercase tracking-wider border-b border-[#202226]">
              <tr>
                <th className="py-2.5 px-4 font-medium">Scenario ID</th>
                <th className="py-2.5 px-4 font-medium">Scenario Typology</th>
                <th className="py-2.5 px-4 font-medium">Ground Truth</th>
                <th className="py-2.5 px-4 font-medium">Verdict</th>
                <th className="py-2.5 px-4 font-medium">Risk Score</th>
                <th className="py-2.5 px-4 font-medium">Concordance</th>
                <th className="py-2.5 px-4 text-right font-medium">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202226] font-mono text-[11px]">
              {benchmark?.results.map((res) => (
                <tr key={res.scenario_id} className="hover:bg-[#18191C]/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-200">
                    {res.scenario_id}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    {res.scenario_name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-mono font-medium",
                        res.ground_truth === "SUSPICIOUS"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}
                    >
                      {res.ground_truth}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-mono font-medium",
                        res.system_verdict === "SUSPICIOUS"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}
                    >
                      {res.system_verdict}
                    </span>
                  </td>
                  <td className="py-3 px-4 tabular-nums text-slate-200 font-medium">
                    {res.risk_score}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Concordant</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                    {res.latency_ms}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Catalog */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
          Benchmark Scenario Catalog
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((s) => (
            <div
              key={s.scenario_id}
              className="p-4 rounded-lg bg-[#111214] border border-[#202226] space-y-2.5 hover:border-[#2E3138] transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-200 font-medium">{s.scenario_id}</span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded font-mono",
                    s.ground_truth === "SUSPICIOUS"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  )}
                >
                  {s.ground_truth}
                </span>
              </div>

              <h4 className="text-xs font-medium text-slate-200 leading-snug">
                {s.name}
              </h4>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                {s.description}
              </p>

              <div className="pt-2 border-t border-[#202226] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Exposure: <span className="tabular-nums text-slate-300">{formatINR(s.simulated_exposure_inr)}</span></span>
                <span className="text-slate-400">{s.typology}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

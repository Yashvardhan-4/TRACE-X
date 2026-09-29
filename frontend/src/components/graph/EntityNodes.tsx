"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export const EmployeeNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-1 border transition-colors min-w-[200px] text-xs shadow-card",
        selected
          ? "border-blue-500 ring-1 ring-blue-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-medium">
          Employee
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          E104
        </span>
      </div>
      <div className="font-medium text-white text-xs leading-snug">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      {Boolean(data.off_hours) && (
        <div className="mt-2 text-[10px] font-mono text-amber-400/90 flex items-center justify-between pt-1.5 border-t border-zinc-800">
          <span>Off-shift action:</span>
          <span>02:11 AM</span>
        </div>
      )}
    </div>
  );
});
EmployeeNode.displayName = "EmployeeNode";

export const CustomerNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-1 border transition-colors min-w-[200px] text-xs shadow-card",
        selected
          ? "border-zinc-500 ring-1 ring-zinc-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
          Customer
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          C782
        </span>
      </div>
      <div className="font-medium text-white text-xs leading-snug">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-800">
        <span>Hist. avg: ₹74k/mo</span>
        <span className="text-amber-400 font-medium">KYC override</span>
      </div>
    </div>
  );
});
CustomerNode.displayName = "CustomerNode";

export const BeneficiaryNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-1 border transition-colors min-w-[200px] text-xs shadow-card",
        selected
          ? "border-amber-500 ring-1 ring-amber-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="target" position={Position.Bottom} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
          Beneficiary
        </span>
        <span className="text-[10px] font-mono text-amber-400 font-medium">
          Cooling bypassed
        </span>
      </div>
      <div className="font-medium text-white text-xs leading-snug">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-800">
        <span>Added by E104</span>
        <span>02:25 AM</span>
      </div>
    </div>
  );
});
BeneficiaryNode.displayName = "BeneficiaryNode";

export const AccountNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-1 border transition-colors min-w-[190px] text-xs shadow-card",
        selected
          ? "border-zinc-500 ring-1 ring-zinc-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
          Account
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          A221
        </span>
      </div>
      <div className="font-medium text-white text-xs leading-snug">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      <div className="mt-2 text-[10px] font-mono text-zinc-300 pt-1.5 border-t border-zinc-800">
        Balance: {data.balance as string}
      </div>
    </div>
  );
});
AccountNode.displayName = "AccountNode";

export const TransactionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-2 border transition-colors min-w-[190px] text-xs shadow-card",
        selected
          ? "border-amber-500 ring-1 ring-amber-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Top} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
          Transfer
        </span>
        <span className="text-[10px] font-mono px-1 rounded bg-zinc-800 text-zinc-300 font-medium">
          {data.status as string}
        </span>
      </div>
      <div className="text-sm font-semibold font-mono text-white tracking-tight">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      {Boolean(data.deviation) && (
        <div className="mt-2 text-[10px] font-mono text-amber-400 pt-1.5 border-t border-zinc-800">
          Deviation: {data.deviation as string}
        </div>
      )}
    </div>
  );
});
TransactionNode.displayName = "TransactionNode";

export const MuleNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded bg-surface-1 border transition-colors min-w-[200px] text-xs shadow-card",
        selected
          ? "border-red-500 ring-1 ring-red-500/30"
          : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-zinc-400 !w-2 !h-2 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-medium">
          Recipient (Mule)
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          Flagged Cluster
        </span>
      </div>
      <div className="font-medium text-white text-xs leading-snug">
        {data.label as string}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {data.sublabel as string}
      </p>
      <div className="mt-2 text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1.5 border-t border-zinc-800">
        <span>Off-ramp:</span>
        <span className="text-zinc-200">{data.cash_out as string}</span>
      </div>
    </div>
  );
});
MuleNode.displayName = "MuleNode";

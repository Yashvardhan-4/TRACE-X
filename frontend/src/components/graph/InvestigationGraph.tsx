"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  EmployeeNode,
  CustomerNode,
  BeneficiaryNode,
  AccountNode,
  TransactionNode,
  MuleNode
} from "./EntityNodes";
import { GraphNode, GraphEdge } from "@/types";

interface Props {
  initialNodes: GraphNode[];
  initialEdges: GraphEdge[];
  onNodeClick?: (nodeId: string) => void;
  isCounterfactualMode?: boolean;
}

export function InvestigationGraph({
  initialNodes,
  initialEdges,
  onNodeClick,
  isCounterfactualMode = false
}: Props) {
  const nodeTypes = useMemo(
    () => ({
      employee: EmployeeNode,
      customer: CustomerNode,
      beneficiary: BeneficiaryNode,
      account: AccountNode,
      transaction: TransactionNode,
      mule: MuleNode
    }),
    []
  );

  // Convert schema GraphNodes to React Flow Nodes
  const formattedNodes: Node[] = useMemo(() => {
    return initialNodes.map((n) => {
      const isSevered = isCounterfactualMode && (n.id === "EMP_E104" || n.id === "BEN_B992");
      return {
        id: n.id,
        type: n.type,
        position: n.position,
        data: { ...n.data, label: n.label, sublabel: n.sublabel },
        className: isSevered ? "opacity-30 border-dashed border-red-500/60" : ""
      };
    });
  }, [initialNodes, isCounterfactualMode]);

  // Convert schema GraphEdges to React Flow Edges
  const formattedEdges: Edge[] = useMemo(() => {
    return initialEdges.map((e) => {
      const isSevered = isCounterfactualMode && (e.source === "EMP_E104" || e.target === "BEN_B992" || e.source === "BEN_B992");
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: isSevered ? "Path Severed" : e.label,
        animated: isSevered ? false : e.animated,
        style: {
          stroke: isSevered ? "#DC2626" : "#64748B",
          strokeWidth: isSevered ? 1.5 : 1.5,
          strokeDasharray: isSevered ? "4,4" : undefined,
          opacity: isSevered ? 0.6 : 0.9
        },
        labelStyle: {
          fill: isSevered ? "#EF4444" : "#CBD5E1",
          fontSize: 10,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500
        },
        labelBgStyle: {
          fill: "#111214",
          fillOpacity: 0.9
        },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 3,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isSevered ? "#DC2626" : "#64748B",
          width: 12,
          height: 12
        }
      };
    });
  }, [initialEdges, isCounterfactualMode]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-border-subtle bg-[#090A0B]">
      <ReactFlow
        nodes={formattedNodes}
        edges={formattedEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.5}
        className="bg-transparent"
      >
        <Background color="#1E2024" gap={20} size={1} />
        <Controls
          className="!bg-surface-1 !border-border-subtle !rounded !text-zinc-400 !shadow-subtle"
        />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "employee": return "#3B82F6";
              case "customer": return "#71717A";
              case "beneficiary": return "#F59E0B";
              case "transaction": return "#E2E8F0";
              case "mule": return "#EF4444";
              default: return "#52525B";
            }
          }}
          className="!bg-surface-1 !border-border-subtle !rounded !shadow-subtle"
          maskColor="rgba(9, 10, 11, 0.75)"
        />
      </ReactFlow>

      {/* Floating Canvas Tag */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-surface-1 border border-border-subtle shadow-subtle flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
        <span className="text-[11px] font-mono text-zinc-300">
          Investigation Graph • {initialNodes.length} Entities, {initialEdges.length} Links
        </span>
      </div>
    </div>
  );
}

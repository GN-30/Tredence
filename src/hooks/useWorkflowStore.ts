/**
 * Zustand store — single source of truth for the entire workflow state.
 * Manages nodes, edges, selection, simulation, and validation.
 */

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { NodeData, SimulationLog, ValidationError } from '../types';
import { validateWorkflow } from '../utils/graphHelpers';

interface WorkflowState {
  // Canvas state
  nodes: Node[];
  edges: Edge[];

  // Selection
  selectedNodeId: string | null;

  // Simulation
  simulationLogs: SimulationLog[];
  isSimulating: boolean;
  showSimPanel: boolean;

  // Validation
  validationErrors: ValidationError[];

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSimulationLogs: (logs: SimulationLog[]) => void;
  setIsSimulating: (v: boolean) => void;
  setShowSimPanel: (v: boolean) => void;
  runValidation: () => void;
  resetWorkflow: () => void;
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationLogs: [],
  isSimulating: false,
  showSimPanel: false,
  validationErrors: [],

  // ── Canvas Change Handlers (React Flow built-in) ───────────────────────────
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
    // Re-validate after structural changes
    setTimeout(() => get().runValidation(), 50);
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    setTimeout(() => get().runValidation(), 50);
  },

  // ── Node Actions ───────────────────────────────────────────────────────────
  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }));
    setTimeout(() => get().runValidation(), 50);
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
    setTimeout(() => get().runValidation(), 50);
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
    setTimeout(() => get().runValidation(), 50);
  },

  // ── Edge Actions ───────────────────────────────────────────────────────────
  setEdges: (edges) => {
    set({ edges });
    setTimeout(() => get().runValidation(), 50);
  },

  addEdge: (edge) => {
    set((state) => ({ edges: [...state.edges, edge] }));
    setTimeout(() => get().runValidation(), 50);
  },

  // ── Selection ──────────────────────────────────────────────────────────────
  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  // ── Simulation ─────────────────────────────────────────────────────────────
  setSimulationLogs: (logs) => set({ simulationLogs: logs }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  setShowSimPanel: (v) => set({ showSimPanel: v }),

  // ── Validation ─────────────────────────────────────────────────────────────
  runValidation: () => {
    const { nodes, edges } = get();
    const errors = validateWorkflow(nodes, edges);
    set({ validationErrors: errors });
  },

  // ── Reset / Load ───────────────────────────────────────────────────────────
  resetWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      simulationLogs: [],
      validationErrors: [],
    }),

  loadWorkflow: (nodes, edges) => {
    set({ nodes, edges, selectedNodeId: null });
    setTimeout(() => get().runValidation(), 50);
  },
}));

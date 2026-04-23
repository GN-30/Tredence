// ─── Node Data Types ────────────────────────────────────────────────────────

export interface MetadataEntry {
  key: string;
  value: string;
}

export interface StartNodeData {
  title: string;
  metadata: MetadataEntry[];
}

export interface TaskNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
}

export interface ApprovalNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  title: string;
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  showSummary: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type NodeType =
  | 'startNode'
  | 'taskNode'
  | 'approvalNode'
  | 'automatedNode'
  | 'endNode';

// ─── API Types ───────────────────────────────────────────────────────────────

export interface AutomationParamSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[]; // for select type
}

export interface AutomationAction {
  id: string;
  label: string;
  description: string;
  params: AutomationParamSchema[];
}

// ─── Simulation Types ────────────────────────────────────────────────────────

export type LogStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

export interface SimulationLog {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  status: LogStatus;
  message: string;
  timestamp: string;
}

// ─── Validation Types ────────────────────────────────────────────────────────

export interface ValidationError {
  nodeId: string | null; // null = global error
  message: string;
  severity: 'error' | 'warning';
}

// ─── Sidebar Node Definition ─────────────────────────────────────────────────

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  color: string;        // Tailwind color class stem
  bgFrom: string;
  bgTo: string;
  iconName: string;
}

import type { Node, Edge } from '@xyflow/react';
import type { NodeType, NodeData } from '../types';

/**
 * Serialize workflow to JSON string for export
 */
export function exportWorkflowJSON(nodes: Node[], edges: Edge[]): string {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    nodes,
    edges,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Trigger browser download with workflow JSON
 */
export function downloadWorkflow(nodes: Node[], edges: Edge[]): void {
  const json = exportWorkflowJSON(nodes, edges);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hr-workflow-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse imported JSON file and return nodes + edges
 */
export async function importWorkflowFile(
  file: File
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed.nodes || !parsed.edges) {
          reject(new Error('Invalid workflow file: missing nodes or edges'));
          return;
        }
        resolve({ nodes: parsed.nodes, edges: parsed.edges });
      } catch {
        reject(new Error('Failed to parse workflow JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generate a unique node ID
 */
export function generateNodeId(type: NodeType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Get default data for each node type
 */
export function getDefaultNodeData(type: NodeType): NodeData {
  switch (type) {
    case 'startNode':
      return { title: 'Start', metadata: [] };
    case 'taskNode':
      return { title: 'New Task', description: '', assignee: '', dueDate: '' };
    case 'approvalNode':
      return { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automatedNode':
      return { title: 'Automation', actionId: '', parameters: {} };
    case 'endNode':
      return { endMessage: 'Workflow Complete', showSummary: true };
  }
}

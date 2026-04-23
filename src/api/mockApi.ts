/**
 * Mock API module simulating backend services.
 * In a real app, these would be actual HTTP calls.
 */

import type { AutomationAction, SimulationLog, NodeType } from '../types';
import type { Node, Edge } from '@xyflow/react';

// Simulate network latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── GET /automations ─────────────────────────────────────────────────────────

const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Send an automated email notification',
    params: [
      { key: 'to', label: 'Recipient Email', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'template', label: 'Template', type: 'select', options: ['Onboarding', 'Reminder', 'Rejection', 'Offer Letter'] },
    ],
  },
  {
    id: 'update_hris',
    label: 'Update HRIS Record',
    description: 'Update employee record in HRIS system',
    params: [
      { key: 'field', label: 'Field to Update', type: 'select', options: ['Status', 'Department', 'Role', 'Manager'] },
      { key: 'value', label: 'New Value', type: 'text' },
    ],
  },
  {
    id: 'slack_notify',
    label: 'Slack Notification',
    description: 'Send a Slack message to a channel',
    params: [
      { key: 'channel', label: 'Channel', type: 'text' },
      { key: 'message', label: 'Message', type: 'text' },
    ],
  },
  {
    id: 'schedule_interview',
    label: 'Schedule Interview',
    description: 'Automatically schedule a calendar event',
    params: [
      { key: 'interviewer', label: 'Interviewer Email', type: 'text' },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'type', label: 'Interview Type', type: 'select', options: ['Technical', 'HR', 'Manager', 'Panel'] },
    ],
  },
  {
    id: 'background_check',
    label: 'Background Check',
    description: 'Trigger background verification process',
    params: [
      { key: 'level', label: 'Check Level', type: 'select', options: ['Basic', 'Standard', 'Enhanced'] },
      { key: 'provider', label: 'Provider', type: 'select', options: ['Checkr', 'Sterling', 'HireRight'] },
    ],
  },
];

/**
 * Mock GET /automations
 * Returns list of available automation actions
 */
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(400); // Simulate network delay
  return [...AUTOMATION_ACTIONS];
}

// ─── POST /simulate ───────────────────────────────────────────────────────────

const NODE_MESSAGES: Record<NodeType, string[]> = {
  startNode: ['Workflow initiated', 'Process context loaded', 'Trigger conditions met'],
  taskNode: ['Task assigned to team member', 'Task created in project board', 'Notification sent to assignee'],
  approvalNode: ['Approval request dispatched', 'Waiting for approver response', 'Escalation rules applied'],
  automatedNode: ['Automation action triggered', 'Integration API called', 'Response received and processed'],
  endNode: ['All steps completed', 'Workflow state persisted', 'Summary email dispatched'],
};

/**
 * Mock POST /simulate
 * Accepts workflow JSON and returns step-by-step execution logs
 */
export async function simulateWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<SimulationLog[]> {
  await delay(600);

  // Build adjacency list for topological ordering
  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach((n) => {
    adjacency[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    adjacency[e.source]?.push(e.target);
    if (inDegree[e.target] !== undefined) {
      inDegree[e.target]++;
    }
  });

  // Kahn's topological sort
  const queue: string[] = [];
  nodes.forEach((n) => {
    if (inDegree[n.id] === 0) queue.push(n.id);
  });

  const ordered: string[] = [];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    ordered.push(nodeId);
    adjacency[nodeId].forEach((neighbor) => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    });
  }

  // Generate logs for each node in topological order
  const logs: SimulationLog[] = ordered.map((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    const nodeType = (node?.type ?? 'taskNode') as NodeType;
    const messages = NODE_MESSAGES[nodeType] ?? ['Processing...'];
    const label =
      (node?.data as { title?: string; endMessage?: string })?.title ||
      (node?.data as { endMessage?: string })?.endMessage ||
      nodeType;

    // 90% success rate for simulation realism
    const isSuccess = Math.random() > 0.1;

    return {
      nodeId,
      nodeType,
      nodeLabel: String(label),
      status: isSuccess ? 'success' : 'error',
      message: isSuccess
        ? messages[Math.floor(Math.random() * messages.length)]
        : 'Step failed: dependency not met or timeout',
      timestamp: new Date().toISOString(),
    };
  });

  return logs;
}

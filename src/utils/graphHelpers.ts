import type { Node, Edge } from '@xyflow/react';
import type { ValidationError, NodeType } from '../types';

/**
 * Validates the workflow graph and returns a list of errors/warnings.
 * Rules:
 * 1. Must have exactly one Start node
 * 2. Must have at least one End node
 * 3. All nodes must be connected (reachable from Start)
 * 4. Start node cannot have incoming edges
 * 5. End node cannot have outgoing edges
 * 6. Task nodes must have a title
 */
export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (nodes.length === 0) return errors;

  // Rule 1: Exactly one Start node
  const startNodes = nodes.filter((n) => n.type === 'startNode');
  if (startNodes.length === 0) {
    errors.push({ nodeId: null, message: 'Workflow must have a Start node', severity: 'error' });
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Only one Start node is allowed', severity: 'error' })
    );
  }

  // Rule 2: At least one End node
  const endNodes = nodes.filter((n) => n.type === 'endNode');
  if (endNodes.length === 0) {
    errors.push({ nodeId: null, message: 'Workflow must have an End node', severity: 'error' });
  }

  // Rule 3: Reachability from Start using BFS
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const adjacency: Record<string, string[]> = {};
    nodes.forEach((n) => (adjacency[n.id] = []));
    edges.forEach((e) => {
      if (adjacency[e.source]) adjacency[e.source].push(e.target);
    });

    const visited = new Set<string>();
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.add(current);
      adjacency[current].forEach((neighbor) => {
        if (!visited.has(neighbor)) queue.push(neighbor);
      });
    }

    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        errors.push({
          nodeId: n.id,
          message: 'Node is disconnected from the workflow',
          severity: 'warning',
        });
      }
    });
  }

  // Rule 4: Start node has no incoming edges
  startNodes.forEach((n) => {
    const hasIncoming = edges.some((e) => e.target === n.id);
    if (hasIncoming) {
      errors.push({ nodeId: n.id, message: 'Start node cannot have incoming connections', severity: 'error' });
    }
  });

  // Rule 5: End node has no outgoing edges
  endNodes.forEach((n) => {
    const hasOutgoing = edges.some((e) => e.source === n.id);
    if (hasOutgoing) {
      errors.push({ nodeId: n.id, message: 'End node cannot have outgoing connections', severity: 'error' });
    }
  });

  // Rule 6: Task nodes must have a title
  nodes
    .filter((n) => n.type === 'taskNode')
    .forEach((n) => {
      const data = n.data as { title?: string };
      if (!data.title?.trim()) {
        errors.push({ nodeId: n.id, message: 'Task node requires a title', severity: 'error' });
      }
    });

  return errors;
}

/**
 * Get errors/warnings for a specific node ID
 */
export function getNodeErrors(nodeId: string, errors: ValidationError[]): ValidationError[] {
  return errors.filter((e) => e.nodeId === nodeId);
}

/**
 * Check if a connection is valid before creating it
 * (called by React Flow's isValidConnection)
 */
export function isValidConnection(
  sourceType: NodeType | undefined,
  targetType: NodeType | undefined
): boolean {
  // End nodes cannot have outgoing edges
  if (sourceType === 'endNode') return false;
  // Start nodes cannot have incoming edges
  if (targetType === 'startNode') return false;
  return true;
}

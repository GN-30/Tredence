import { Settings, X, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedNodeForm } from './forms/AutomatedNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';
import type { NodeData } from '../types';

export function ConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData, setSelectedNode, deleteNode } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-[var(--config-width)] h-full bg-[#1e1e2e] border-l border-[#2d2d44] flex flex-col items-center justify-center p-6 text-center z-10 shrink-0">
        <div className="w-16 h-16 rounded-full bg-[#2d2d44] flex items-center justify-center mb-4 text-slate-500">
          <Settings className="w-8 h-8" />
        </div>
        <h3 className="text-slate-300 font-medium mb-2">No Node Selected</h3>
        <p className="text-xs text-slate-500">Click on a node in the canvas to view and edit its properties.</p>
      </aside>
    );
  }

  const handleDataChange = (newData: Partial<NodeData>) => {
    updateNodeData(selectedNode.id, newData);
  };

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'startNode':
        return <StartNodeForm data={selectedNode.data as any} onChange={handleDataChange} />;
      case 'taskNode':
        return <TaskNodeForm data={selectedNode.data as any} onChange={handleDataChange} />;
      case 'approvalNode':
        return <ApprovalNodeForm data={selectedNode.data as any} onChange={handleDataChange} />;
      case 'automatedNode':
        return <AutomatedNodeForm data={selectedNode.data as any} onChange={handleDataChange} />;
      case 'endNode':
        return <EndNodeForm data={selectedNode.data as any} onChange={handleDataChange} />;
      default:
        return <div className="text-slate-500 text-sm">Unknown node type</div>;
    }
  };

  return (
    <aside className="w-[var(--config-width)] h-full bg-[#1e1e2e] border-l border-[#2d2d44] flex flex-col z-10 shrink-0 animate-slide-in-right shadow-2xl">
      <div className="h-[var(--toolbar-height)] px-4 border-b border-[#2d2d44] flex items-center justify-between shrink-0 bg-[#161623]">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-400" />
          Configuration
        </h2>
        <button
          onClick={() => setSelectedNode(null)}
          className="p-1.5 rounded-md hover:bg-[#2d2d44] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-6 pb-4 border-b border-[#2d2d44] flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 mb-1">Node ID</div>
            <div className="font-mono text-xs text-slate-400 bg-[#1a1a27] p-2 rounded border border-[#2d2d44] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedNode.id}
            </div>
          </div>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shrink-0"
            title="Delete this node"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {renderForm()}
      </div>
    </aside>
  );
}

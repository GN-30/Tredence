import { Play, UserCheck, Gavel, Zap, Flag } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { generateNodeId, getDefaultNodeData } from '../utils/exportImport';
import type { NodeDefinition, NodeType } from '../types';

const NODE_TYPES: NodeDefinition[] = [
  {
    type: 'startNode',
    label: 'Start Event',
    description: 'Triggers the workflow',
    color: 'text-emerald-400',
    bgFrom: 'from-emerald-500/20',
    bgTo: 'to-emerald-600/5',
    iconName: 'Play',
  },
  {
    type: 'taskNode',
    label: 'Manual Task',
    description: 'Assigned to a person',
    color: 'text-blue-400',
    bgFrom: 'from-blue-500/20',
    bgTo: 'to-blue-600/5',
    iconName: 'UserCheck',
  },
  {
    type: 'approvalNode',
    label: 'Approval',
    description: 'Requires sign-off',
    color: 'text-amber-400',
    bgFrom: 'from-amber-500/20',
    bgTo: 'to-amber-600/5',
    iconName: 'Gavel',
  },
  {
    type: 'automatedNode',
    label: 'Automation',
    description: 'System action/API',
    color: 'text-purple-400',
    bgFrom: 'from-purple-500/20',
    bgTo: 'to-purple-600/5',
    iconName: 'Zap',
  },
  {
    type: 'endNode',
    label: 'End Event',
    description: 'Concludes workflow',
    color: 'text-rose-400',
    bgFrom: 'from-rose-500/20',
    bgTo: 'to-rose-600/5',
    iconName: 'Flag',
  },
];

const ICONS = {
  Play,
  UserCheck,
  Gavel,
  Zap,
  Flag,
};

export function Sidebar() {
  const { addNode, setSelectedNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    
    if (event.target instanceof HTMLElement) {
       event.target.classList.add('drag-node-preview');
       setTimeout(() => event.target instanceof HTMLElement && event.target.classList.remove('drag-node-preview'), 0);
    }
  };

  const onAddClick = (nodeType: string) => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id: generateNodeId(nodeType as NodeType),
      type: nodeType,
      position,
      data: getDefaultNodeData(nodeType as NodeType),
    } as any;

    addNode(newNode);
    setSelectedNode(newNode.id);
  };

  return (
    <aside className="w-[var(--sidebar-width)] h-full bg-[#1e1e2e] border-r border-[#2d2d44] flex flex-col z-10 shrink-0">
      <div className="p-4 border-b border-[#2d2d44]">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Node Library</h2>
        <p className="text-xs text-slate-500 mt-1">Drag items to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {NODE_TYPES.map((def) => {
          const Icon = ICONS[def.iconName as keyof typeof ICONS];
          
          return (
            <div
              key={def.type}
              className={`bg-gradient-to-br ${def.bgFrom} ${def.bgTo} border border-[#2d2d44] rounded-lg p-3 cursor-grab hover:border-slate-500 transition-colors group relative`}
              onDragStart={(e) => onDragStart(e, def.type)}
              onClick={() => onAddClick(def.type)}
              draggable={true}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-[#1e1e2e] border border-[#2d2d44] group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${def.color}`} />
                </div>
                <div>
                  <div className={`text-sm font-medium ${def.color}`}>{def.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{def.description}</div>
                </div>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs text-slate-500 hidden sm:block">
                Click+
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

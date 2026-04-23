import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../../types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { getNodeErrors } from '../../utils/graphHelpers';
import { ValidationBadge } from '../ValidationBadge';

interface StartNodeProps {
  id: string;
  data: StartNodeData;
}

export function StartNode({ id, data }: StartNodeProps) {
  const { validationErrors } = useWorkflowStore();
  const errors = getNodeErrors(id, validationErrors);
  const hasError = errors.length > 0;

  return (
    <div className={`relative bg-[#1e1e2e] border ${hasError ? 'border-red-500 node-error' : 'border-[#2d2d44]'} rounded-xl shadow-lg w-[240px] transition-all hover:border-[#6366f1]`}>
      <ValidationBadge errors={errors} />
      
      <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 p-3 rounded-t-xl border-b border-[#2d2d44] flex items-center gap-2">
        <div className="bg-emerald-500/20 p-1.5 rounded-md">
          <Play className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="font-semibold text-emerald-400">Start Node</div>
      </div>
      
      <div className="p-4">
        <div className="text-sm font-medium text-slate-200">{data.title || 'Start'}</div>
        <div className="text-xs text-slate-500 mt-1">
          {data.metadata?.length || 0} Context keys
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-500" />
    </div>
  );
}

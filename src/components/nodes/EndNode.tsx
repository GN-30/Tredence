import { Handle, Position } from '@xyflow/react';
import { Flag } from 'lucide-react';
import type { EndNodeData } from '../../types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { getNodeErrors } from '../../utils/graphHelpers';
import { ValidationBadge } from '../ValidationBadge';

interface EndNodeProps {
  id: string;
  data: EndNodeData;
}

export function EndNode({ id, data }: EndNodeProps) {
  const { validationErrors } = useWorkflowStore();
  const errors = getNodeErrors(id, validationErrors);
  const hasError = errors.length > 0;

  return (
    <div className={`relative bg-[#1e1e2e] border ${hasError ? 'border-red-500 node-error' : 'border-[#2d2d44]'} rounded-xl shadow-lg w-[240px] transition-all hover:border-[#6366f1]`}>
      <ValidationBadge errors={errors} />
      
      <div className="bg-gradient-to-r from-rose-500/20 to-rose-600/10 p-3 rounded-t-xl border-b border-[#2d2d44] flex items-center gap-2">
        <div className="bg-rose-500/20 p-1.5 rounded-md">
          <Flag className="w-4 h-4 text-rose-400" />
        </div>
        <div className="font-semibold text-rose-400">End Node</div>
      </div>
      
      <div className="p-4">
        <div className="text-sm font-medium text-slate-200">{data.endMessage || 'End'}</div>
        {data.showSummary && (
          <div className="text-xs text-slate-500 mt-1">Summary generated</div>
        )}
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
    </div>
  );
}

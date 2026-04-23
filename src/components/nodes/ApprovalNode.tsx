import { Handle, Position } from '@xyflow/react';
import { Gavel } from 'lucide-react';
import type { ApprovalNodeData } from '../../types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { getNodeErrors } from '../../utils/graphHelpers';
import { ValidationBadge } from '../ValidationBadge';

interface ApprovalNodeProps {
  id: string;
  data: ApprovalNodeData;
}

export function ApprovalNode({ id, data }: ApprovalNodeProps) {
  const { validationErrors } = useWorkflowStore();
  const errors = getNodeErrors(id, validationErrors);
  const hasError = errors.length > 0;

  return (
    <div className={`relative bg-[#1e1e2e] border ${hasError ? 'border-red-500 node-error' : 'border-[#2d2d44]'} rounded-xl shadow-lg w-[240px] transition-all hover:border-[#6366f1]`}>
      <ValidationBadge errors={errors} />
      
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-3 rounded-t-xl border-b border-[#2d2d44] flex items-center gap-2">
        <div className="bg-amber-500/20 p-1.5 rounded-md">
          <Gavel className="w-4 h-4 text-amber-400" />
        </div>
        <div className="font-semibold text-amber-400">Approval Node</div>
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <div className="text-sm font-medium text-slate-200">{data.title || 'Require Approval'}</div>
        <div className="text-xs text-slate-400 flex justify-between">
          <span>Role: {data.approverRole || 'Unassigned'}</span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500" />
    </div>
  );
}

import type { ApprovalNodeData } from '../../types';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

export function ApprovalNodeForm({ data, onChange }: ApprovalNodeFormProps) {
  const roles = ['Manager', 'Director', 'HR Business Partner', 'Finance', 'Legal'];

  return (
    <div className="flex flex-col gap-5">
      <div className="form-field">
        <label className="form-label">Approval Step Title</label>
        <input
          type="text"
          className="form-input"
          value={data.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Offer Letter Approval"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Approver Role</label>
        <select
          className="form-select"
          value={data.approverRole || 'Manager'}
          onChange={(e) => onChange({ approverRole: e.target.value })}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-[#2d2d44] pt-5 form-field">
        <label className="form-label flex justify-between items-center">
          <span>Auto-Approve Threshold ($)</span>
          <span className="text-xs font-mono bg-[#2d2d44] px-1.5 py-0.5 rounded text-amber-300">
            {data.autoApproveThreshold || 0}
          </span>
        </label>
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={data.autoApproveThreshold || 0}
            onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$0 (Always require)</span>
            <span>$10,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

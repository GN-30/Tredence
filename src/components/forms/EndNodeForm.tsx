import type { EndNodeData } from '../../types';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export function EndNodeForm({ data, onChange }: EndNodeFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="form-field">
        <label className="form-label">End State / Message</label>
        <input
          type="text"
          className="form-input"
          value={data.endMessage || ''}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="e.g. Employee Rejection Workflow Complete"
        />
      </div>

      <div className="form-field mt-2 border border-[#2d2d44] p-4 rounded-lg bg-[#1a1a27]">
        <label className="flex items-center cursor-pointer justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Execution Summary</span>
            <span className="text-xs text-slate-500">Send an email summary report to the initiator when this end state is reached.</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={data.showSummary || false}
              onChange={(e) => onChange({ showSummary: e.target.checked })}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${data.showSummary ? 'bg-rose-500' : 'bg-[#2d2d44]'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.showSummary ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
}

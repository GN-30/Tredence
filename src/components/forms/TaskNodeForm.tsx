import type { TaskNodeData } from '../../types';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export function TaskNodeForm({ data, onChange }: TaskNodeFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="form-field">
        <label className="form-label flex justify-between">
          Task Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          className={`form-input ${!data.title?.trim() ? 'border-red-500' : ''}`}
          value={data.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Setting up IT hardware"
          required
        />
        {!data.title?.trim() && (
          <span className="text-[10px] text-red-500">Title is required for validation</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea h-24"
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Provide detail about what needs to be done..."
        />
      </div>

      <div className="flex gap-3">
        <div className="form-field flex-1">
          <label className="form-label">Assignee</label>
          <input
            type="text"
            className="form-input"
            value={data.assignee || ''}
            onChange={(e) => onChange({ assignee: e.target.value })}
            placeholder="e.g. IT Dept"
          />
        </div>
        
        <div className="form-field flex-1">
          <label className="form-label">Due By</label>
          <input
            type="text"
            className="form-input"
            value={data.dueDate || ''}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            placeholder="e.g. +2 days"
          />
        </div>
      </div>
    </div>
  );
}

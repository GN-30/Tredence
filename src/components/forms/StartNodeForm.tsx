import { Plus, Trash2 } from 'lucide-react';
import type { StartNodeData } from '../../types';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export function StartNodeForm({ data, onChange }: StartNodeFormProps) {
  const addMetadata = () => {
    onChange({ metadata: [...(data.metadata || []), { key: '', value: '' }] });
  };

  const updateMetadata = (index: number, field: 'key' | 'value', value: string) => {
    const newMetadata = [...(data.metadata || [])];
    newMetadata[index][field] = value;
    onChange({ metadata: newMetadata });
  };

  const removeMetadata = (index: number) => {
    const newMetadata = [...(data.metadata || [])];
    newMetadata.splice(index, 1);
    onChange({ metadata: newMetadata });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="form-field">
        <label className="form-label">Workflow Title</label>
        <input
          type="text"
          className="form-input text-lg font-medium"
          value={data.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Employee Onboarding"
        />
      </div>

      <div className="border-t border-[#2d2d44] pt-5">
        <div className="flex justify-between items-center mb-3">
          <label className="form-label mb-0">Initial Context (Metadata)</label>
          <button
            onClick={addMetadata}
            className="p-1 rounded hover:bg-[#2d2d44] text-slate-400 hover:text-emerald-400 transition-colors"
            title="Add Context Variable"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {data.metadata?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                className="form-input w-1/3 text-xs"
                placeholder="Key"
                value={item.key}
                onChange={(e) => updateMetadata(i, 'key', e.target.value)}
              />
              <span className="text-slate-500">=</span>
              <input
                type="text"
                className="form-input flex-1 text-xs"
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateMetadata(i, 'value', e.target.value)}
              />
              <button
                onClick={() => removeMetadata(i)}
                className="p-1.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {(!data.metadata || data.metadata.length === 0) && (
            <div className="text-xs text-slate-500 italic text-center py-4 bg-[#1a1a27] rounded-lg border border-dashed border-[#2d2d44]">
              No context variables added
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

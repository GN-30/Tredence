import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { AutomatedNodeData, AutomationAction } from '../../types';
import { getAutomations } from '../../api/mockApi';

interface AutomatedNodeFormProps {
  data: AutomatedNodeData;
  onChange: (data: Partial<AutomatedNodeData>) => void;
}

export function AutomatedNodeForm({ data, onChange }: AutomatedNodeFormProps) {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAutomations()
      .then((res) => {
        if (mounted) {
          setActions(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    onChange({ actionId, parameters: {} }); // Reset params when action changes
  };

  const handleParamChange = (key: string, value: string) => {
    onChange({
      parameters: {
        ...(data.parameters || {}),
        [key]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        <span className="text-sm">Loading available actions...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 border-[#2d2d44]">
      <div className="form-field">
        <label className="form-label flex justify-between">
          Integration Action <span className="text-red-400">*</span>
        </label>
        <select
          className={`form-select ${!data.actionId ? 'border-red-500' : ''}`}
          value={data.actionId || ''}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          <option value="" disabled>
            Select an action...
          </option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
        {!data.actionId && (
          <span className="text-[10px] text-red-500">Must select an action</span>
        )}
      </div>

      {selectedAction && (
        <div className="mt-2 bg-[#1a1a27] border border-[#2d2d44] rounded-lg p-4 animate-fade-in shadow-inner">
          <div className="text-xs text-purple-400 mb-4 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            Action Configuration
          </div>
          <div className="flex flex-col gap-4">
            {selectedAction.params.map((param) => (
              <div key={param.key} className="form-field">
                <label className="form-label !text-slate-300 capitalize">{param.label}</label>
                {param.type === 'select' ? (
                  <select
                    className="form-select text-sm py-1.5 bg-[#1e1e2e]"
                    value={data.parameters?.[param.key] || ''}
                    onChange={(e) => handleParamChange(param.key, e.target.value)}
                  >
                    <option value="" disabled>Select {param.label}</option>
                    {param.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={param.type === 'number' ? 'number' : 'text'}
                    className="form-input text-sm py-1.5 bg-[#1e1e2e]"
                    value={data.parameters?.[param.key] || ''}
                    onChange={(e) => handleParamChange(param.key, e.target.value)}
                    placeholder={`Enter ${param.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

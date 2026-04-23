import { useEffect, useRef } from 'react';
import { X, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import type { SimulationLog } from '../types';

export function SimulationPanel() {
  const { simulationLogs, isSimulating, showSimPanel, setShowSimPanel } = useWorkflowStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simulationLogs]);

  if (!showSimPanel) return null;

  const renderIcon = (status: SimulationLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-brand-400 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="absolute top-[var(--toolbar-height)] bottom-0 right-0 w-[400px] bg-[#1e1e2e]/95 backdrop-blur-md border-l border-[#2d2d44] shadow-2xl z-50 flex flex-col animate-slide-in-right">
      <div className="px-5 py-4 border-b border-[#2d2d44] flex items-center justify-between bg-[#161623]/80">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            Execution Logs
            {isSimulating && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSimulating ? 'Workflow is running...' : 'Simulation complete'}
          </p>
        </div>
        <button
          onClick={() => setShowSimPanel(false)}
          className="p-1.5 rounded-md hover:bg-[#2d2d44] text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-10">
        {simulationLogs.length === 0 && isSimulating && (
          <div className="text-center text-slate-500 text-sm py-10 animate-pulse">
            Initializing workflow engine...
          </div>
        )}

        <div className="relative border-l border-[#2d2d44] ml-3 pb-4">
          {simulationLogs.map((log, i) => (
            <div key={i} className="mb-6 ml-6 relative animate-fade-in">
              <span className="absolute -left-10 top-1 bg-[#1e1e2e] p-1 rounded-full outline outline-4 outline-[#1e1e2e] shadow-sm">
                {renderIcon(log.status)}
              </span>
              
              <div className={`p-4 rounded-xl border relative shadow-md transition-all ${
                log.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                log.status === 'error' ? 'bg-red-500/10 border-red-500/20' :
                'bg-[#2d2d44]/50 border-[#2d2d44]'
              }`}>
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-sm font-semibold text-slate-200 break-words">
                    {log.nodeLabel}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap pt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className={`text-sm ${
                   log.status === 'error' ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {log.message}
                </p>
                
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider">
                  <span>{log.nodeType}</span>
                  <span className="font-mono text-slate-600 truncate max-w-[120px]">{log.nodeId}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}

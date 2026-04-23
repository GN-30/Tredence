import { useRef } from 'react';
import { Play, Download, Upload, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import { useSimulation } from '../hooks/useSimulation';
import { downloadWorkflow, importWorkflowFile } from '../utils/exportImport';

export function Toolbar() {
  const { nodes, edges, validationErrors, isSimulating, loadWorkflow } = useWorkflowStore();
  const { runSimulation } = useSimulation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errors = validationErrors.filter((e) => e.severity === 'error');
  const warnings = validationErrors.filter((e) => e.severity === 'warning');

  const handleExport = () => {
    downloadWorkflow(nodes, edges);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { nodes: newNodes, edges: newEdges } = await importWorkflowFile(file);
      loadWorkflow(newNodes, newEdges);
    } catch (err) {
      alert('Failed to import workflow: ' + (err as Error).message);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="h-[var(--toolbar-height)] bg-[#1e1e2e] border-b border-[#2d2d44] flex items-center justify-between px-4 z-20 shrink-0 shadow-sm relative">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <h1 className="text-base font-semibold tracking-wide flex flex-col">
          <span>FlowDesigner</span>
          <span className="text-[10px] text-brand-400 font-normal leading-none -mt-0.5">HR Automation</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Validation Status */}
        <div className="flex items-center gap-2 text-sm bg-[#161623] px-3 py-1.5 rounded-full border border-[#2d2d44]">
          {errors.length > 0 ? (
            <div className="flex items-center gap-1.5 text-red-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>{errors.length} {errors.length === 1 ? 'Error' : 'Errors'}</span>
            </div>
          ) : warnings.length > 0 ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>{warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Valid Graph</span>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#2d2d44]"></div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            title="Import JSON"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Import</span>
          </button>
          
          <button
            onClick={handleExport}
            className="btn-secondary"
            title="Export JSON"
            disabled={nodes.length === 0}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Export</span>
          </button>

          <button
            onClick={runSimulation}
            disabled={isSimulating || errors.length > 0 || nodes.length === 0}
            className={`btn-primary ml-2 ${
               errors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''} fill-white`} />
            <span className="text-sm font-medium">
              {isSimulating ? 'Simulating...' : 'Run Workflow'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

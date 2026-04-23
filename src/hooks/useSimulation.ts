import { useWorkflowStore } from './useWorkflowStore';
import { simulateWorkflow } from '../api/mockApi';

export function useSimulation() {
  const { nodes, edges, setSimulationLogs, setIsSimulating, setShowSimPanel } = useWorkflowStore();

  const runSimulation = async () => {
    setIsSimulating(true);
    setShowSimPanel(true);
    setSimulationLogs([]); // Reset logs

    try {
      const executionLogs = await simulateWorkflow(nodes, edges);
      
      // Reveal logs one by one for visual effect
      for (let i = 0; i < executionLogs.length; i++) {
        await new Promise((r) => setTimeout(r, 600)); // Delay between log entries
        setSimulationLogs(executionLogs.slice(0, i + 1));
      }
    } catch (e) {
      console.error('Simulation failed', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return { runSimulation };
}

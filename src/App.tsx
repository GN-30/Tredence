import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from './hooks/useWorkflowStore';
import { Sidebar } from './components/Sidebar';
import { ConfigPanel } from './components/ConfigPanel';
import { Toolbar } from './components/Toolbar';
import { SimulationPanel } from './components/SimulationPanel';

import { StartNode } from './components/nodes/StartNode';
import { TaskNode } from './components/nodes/TaskNode';
import { ApprovalNode } from './components/nodes/ApprovalNode';
import { AutomatedNode } from './components/nodes/AutomatedNode';
import { EndNode } from './components/nodes/EndNode';

import { generateNodeId, getDefaultNodeData } from './utils/exportImport';
import { isValidConnection } from './utils/graphHelpers';
import type { NodeType } from './types';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

function FlowDesigner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    setEdges,
    setSelectedNode,
    deleteNode,
  } = useWorkflowStore();

  const onConnect = useCallback(
    (params: Connection) => {
      // Find source and target nodes to validate connection types
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      
      if (isValidConnection(sourceNode?.type as NodeType, targetNode?.type as NodeType)) {
        setEdges(addEdge({ ...params, animated: true }, edges));
      }
    },
    [nodes, edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = (event.dataTransfer.getData('application/reactflow') || event.dataTransfer.getData('text/plain')) as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: generateNodeId(type),
        type,
        position,
        data: getDefaultNodeData(type),
      } as unknown as Node;

      addNode(newNode);
      setSelectedNode(newNode.id);
    },
    [screenToFlowPosition, addNode, setSelectedNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => setSelectedNode(node.id), [setSelectedNode]);
  const onPaneClick = useCallback(() => setSelectedNode(null), [setSelectedNode]);
  const onNodesDelete = useCallback((deleted: any[]) => {
    deleted.forEach(node => deleteNode(node.id));
  }, [deleteNode]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0f0f1a] overflow-hidden text-slate-200">
      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesDelete={onNodesDelete}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            deleteKeyCode={['Backspace', 'Delete']}
            className="react-flow-custom"
          >
            <Background gap={24} size={2} color="#2d2d44" variant={"dots" as any} />
            <Controls className="bg-[#1e1e2e] border-[#2d2d44] fill-slate-400" />
            <MiniMap 
              nodeStrokeColor="#4f46e5"
              nodeColor="#1e1e2e"
              maskColor="rgba(15, 15, 26, 0.7)"
              className="bg-[#1e1e2e] border-[#2d2d44]"
            />
          </ReactFlow>
          
          <SimulationPanel />
        </main>

        <ConfigPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowDesigner />
    </ReactFlowProvider>
  );
}

import React from 'react';
import ReactFlow, {ReactFlowProvider, Background, Controls} from 'reactflow';
 
import 'reactflow/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: '1' } },
  { id: '2', position: { x: 100, y: 500 }, data: { label: '2' } },
  { id: '3', position: { x: 200, y: 600 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3', animated: true }];
 
 function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
}

export default function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
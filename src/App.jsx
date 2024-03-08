import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import ReactFlow, {ReactFlowProvider, Background, Controls, useEdgesState, useNodesState, addEdge, Panel, useReactFlow} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './components/sideBar.jsx';
import CustomNode from './components/customNode.jsx';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';

// Key for local storage
const flowKey = "flow-key";

// Initial node setup
const initialNodes = [
  {
    id: "1",
    type: "textnode",
    data: { label: "test message 1" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `node_${id++}`;
 
 function App() {

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const { setViewport } = useReactFlow();

  const nodeTypes = useMemo(() => ({
      textnode: CustomNode,
    }), []);

    useEffect(() => {
      if (selectedElements.length > 0) {
        setNodes((nodes) =>
          nodes.map((node) => {
            if (node.id === selectedElements[0]?.id) {
              node.data = {
                ...node.data,
                label: nodeName,
              };
            }
            return node;
          })
        );
      } else {
        setNodeName(""); // Clear nodeName when no node is selected
      }
    }, [nodeName, selectedElements, setNodes]);

    const onConnect = useCallback(
      (params) => {
        console.log("New Edge -- ", params);
        setEdges((eds) => addEdge(params, eds));
      },
      [setEdges]
    );

    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
      (event) => {
        event.preventDefault();
  
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
  
        if (typeof type === "undefined" || !type) {
          return;
        }
  
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${type}` },
        };
  
        console.log("Node created: ", newNode);
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance]
    );

    const onNodeClick = useCallback((event, node) => {
      setSelectedElements([node]);
      setNodeName(node.data.label);
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    }, []);

    const checkEmptyTargetHandles = () => {
      let emptyTargetHandles = 0;
      edges.forEach((edge) => {
        if (!edge.targetHandle) {
          emptyTargetHandles++;
        }
      });
      return emptyTargetHandles;
    };

    const isNodeUnconnected = useCallback(() => {
      let unconnectedNodes = nodes.filter(
        (node) =>
          !edges.find(
            (edge) => edge.source === node.id || edge.target === node.id
          )
      );
  
      return unconnectedNodes.length > 0;
    }, [nodes, edges]);

    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        const emptyTargetHandles = checkEmptyTargetHandles();
  
        if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
          toast.error('Cannot save Flow');
        } else {
          const flow = reactFlowInstance.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
          toast.success("Flow saved successfully!"); // Provide feedback when save is successful
        }
      }
    }, [reactFlowInstance, nodes, isNodeUnconnected]);

    const bg = {
      backgroundColor: '#ffffff'
    }

  return (
    <div className='app'>
      <ToastContainer position="top" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ maxWidth: "320px" }}/>
      <div className="flow" ref={reactFlowWrapper}>
      
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={bg}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]); // Reset selected elements when clicking on pane
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: false, // Reset selected state of nodes when clicking on pane
              }))
            );
          }}
          fitView
        >
          <Background variant="dots" gap={10} size={1} />
          <Panel position="top-left">
            <button
              onClick={onSave}
            >
              save flow
            </button>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
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
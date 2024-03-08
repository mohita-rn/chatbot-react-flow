import React, {useCallback, useState, useEffect, useRef, useMemo} from 'react';
import ReactFlow, {ReactFlowProvider, Background, Controls, useEdgesState, useNodesState, addEdge, Panel, useReactFlow} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './components/sideBar.jsx';
import CustomNode from './components/customNode.jsx';
import './App.css';

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

  //setting up references, states and hooks
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const { setViewport } = useReactFlow();

  //memoizing node types
  const nodeTypes = useMemo(() => ({
      textnode: CustomNode,
    }), []);

    //setting selected element to the first node so that it can be passed to sidebar component 
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

    //setting and adding edges when connecting nodes
    const onConnect = useCallback(
      (params) => {
        console.log("New Edge -- ", params);
        setEdges((eds) => addEdge(params, eds));
      },
      [setEdges]
    );

    //setting up drag and drop functionality
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
  
        console.log("New node- ", newNode);
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance]
    );

    //setting up node click functionality
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

    //checking for empty target handles
    const checkEmptyTargetHandles = () => {
      let emptyTargetHandles = 0;
      edges.forEach((edge) => {
        if (!edge.targetHandle) {
          emptyTargetHandles++;
        }
      });
      return emptyTargetHandles;
    };

    //checking for unconnected nodes
    const isNodeUnconnected = useCallback(() => {
      let unconnectedNodes = nodes.filter(
        (node) =>
          !edges.find(
            (edge) => edge.source === node.id || edge.target === node.id
          )
      );
  
      return unconnectedNodes.length > 0;
    }, [nodes, edges]);

    //saving flow to local storage
    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        const emptyTargetHandles = checkEmptyTargetHandles();
  
        if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
          alert('Cannot save Flow');
        } else {
          const flow = reactFlowInstance.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
          alert("Flow saved successfully!"); // Provide feedback when save is successful
        }
      }
    }, [reactFlowInstance, nodes, isNodeUnconnected]);

    const bg = {
      backgroundColor: '#ffffff'
    }

  return (
    <div className='app'>
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
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowInstance,
} from 'react-flow-renderer';

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance);

const Flow = ({
  initialNodes,
  initialEdges,
  height,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  height?: number;
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  //@ts-ignore
  const onConnect = params => setEdges(eds => addEdge(params, eds));

  return (
    <div className={`w-full h-[${height || '800px'}]`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap
          //@ts-ignore
          nodeStrokeColor={n => {
            if (n.style?.background) return n.style.background;
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            if (n.type === 'default') return '#1a192b';

            return '#eee';
          }}
          //@ts-ignore
          nodeColor={n => {
            if (n.style?.background) return n.style.background;

            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default Flow;

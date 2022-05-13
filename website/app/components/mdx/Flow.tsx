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
  ReactFlowProps,
} from 'react-flow-renderer';

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance);

const Flow = ({
  initialNodes,
  initialEdges,
  height,
  minimap,
  controls,
  caption,
  reactFlowProps,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  height?: number;
  minimap?: boolean;
  controls?: boolean;
  caption?: string;
  reactFlowProps: ReactFlowProps;
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  //@ts-ignore
  const onConnect = params => setEdges(eds => addEdge(params, eds));

  const containerClassName = height ? `w-full h-[${height}]` : `w-full h-[800px]`;

  return (
    <figure className={containerClassName}>
      <ReactFlow
        {...reactFlowProps}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
      >
        {minimap && (
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
        )}

        {controls && <Controls />}
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      <figcaption className="my-3 text-center text-sm italic dark:text-white">{caption}</figcaption>
    </figure>
  );
};

export default Flow;

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

import cx from 'classnames';

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance);

const Flow = ({
  initialNodes,
  initialEdges,
  height,
  width,
  minimap,
  controls,
  caption,
  reactFlowProps,
  enablePanAndZoom,
  enableNodeDragging,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  height?: string;
  width?: string;
  minimap?: boolean;
  controls?: boolean;
  caption?: string;
  reactFlowProps: ReactFlowProps;
  enablePanAndZoom?: boolean;
  enableNodeDragging?: boolean;
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  //@ts-ignore
  const onConnect = params => setEdges(eds => addEdge(params, eds));

  let props = reactFlowProps;
  if (!enablePanAndZoom) {
    props = {
      ...props,
      zoomOnDoubleClick: false,
      zoomOnPinch: false,
      zoomOnScroll: false,
      panOnDrag: false,
    };
  }

  const reactFlowStyle = {
    width,
    height,
    borderRadius: '12px',
    border: 'solid',
  };

  return (
    <figure
      className={cx(
        `my-16 w-full h-[${
          height || '800px'
        }] flex flex-col justify-center overflow-hidden rounded`,
        {
          'no-drag': !enableNodeDragging,
        },
      )}
    >
      <ReactFlow
        style={reactFlowStyle}
        {...props}
        nodes={nodes}
        edges={edges}
        onNodesChange={enableNodeDragging ? onNodesChange : () => null}
        onEdgesChange={enableNodeDragging ? onEdgesChange : () => null}
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

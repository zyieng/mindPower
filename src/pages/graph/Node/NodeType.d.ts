interface NodeType {
  id: string;
  label: string;
  size: number;
  cluster: string;
  x: number;
  y: number;
  shape: string;
  type: string;
  style: {
    fill: string;
    stroke: string;
  };
}

interface EdgeType {
  id: string;
  source: string;
  target: string;
}

export { NodeType, EdgeType };

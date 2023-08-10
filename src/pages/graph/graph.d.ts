interface AddNodeFormParams {
  target: HTMLElement;
  graph: any;
  point: any;
  nodeId: string;
  model: any;
  setStatus: Function;
}

interface EditNodeFormParams {
  target: HTMLElement;
  graph: any;
  point: any;
  nodeId: string;
  model: any;
  setStatus: Function;
}

export { AddNodeFormParams, EditNodeFormParams };

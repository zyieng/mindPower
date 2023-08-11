const { v4: uuidv4 } = require('uuid');
export class NodeElement {
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
  // 根据cluster的不同，节点的颜色也不同
  constructor({ id, label, size, cluster, x, y , style }: {
    id: string | undefined;
    label: string;
    size: number;
    cluster: string;
    x: number;
    y: number;
    style: any;
  }) {
    // 不同cluster对应的样式配置，如果未输入cluster，则默认为a
    const clusterMap = new Map([
      ['a', { fill: '#BDD2FD', stroke: '#5B8FF9' }],
      ['b', { fill: '#BDEFDB', stroke: '#5AD8A6' }],
      ['c', { fill: '#C2C8D5', stroke: '#5D7092' }],
    ]);

    this.id = id || uuidv4();
    this.label = label || '';
    this.size = size || 50;
    this.cluster = cluster || 'a';
    this.x = x || 0;
    this.y = y || 0;
    this.shape = 'circle';
    this.type = 'node';
    this.style = {
      ...clusterMap.get(this.cluster),
      ...style,
    };
  }

  // opacity 0.5
  makeTransparent() {
    this.style = {
      ...this.style,
      fillOpacity: 0.5,
      opacity: 0.5,
    };
  }

  // opacity 1
  makeOpaque() {
    this.style = {
      ...this.style,
      fillOpacity: 1,
      opacity: 1,
    };
  }

  getNodeId() {
    return this.id;
  }

  getNode() {
    return {
      id: this.id,
      label: this.label,
      x: this.x,
      y: this.y,
      size: this.size,
      shape: this.shape,
      type: this.type,
      style: this.style,
    }
  }
}


import G6 from '@antv/g6';

interface Node {
  id: string;
  size: number;
  label: number;
  cluster?: string;
  style?: {
    fill?: string;
    stroke?: string;
  };
}
interface Edge {
  id: string;
  source: string;
  target: string;
}

export class BrainGraph {
  // The container to render the graph
  container: HTMLElement | null;
  nodes: Node[];
  edges: Edge[];
  showAddModal: Function;
  showEditModal: Function;
  colors = [
    '#BDD2FD',
    '#BDEFDB',
    '#C2C8D5',
    '#FBE5A2',
    '#F6C3B7',
    '#B6E3F5',
    '#D3C6EA',
    '#FFD8B8',
    '#AAD8D8',
    '#FFD6E7',
  ];
  strokes = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ];

  // Instantiate G6 Graph
  constructor(parameters: {
    container: HTMLElement | null;
    nodes: Node[];
    edges: Edge[];
    showAddModal: Function;
    showEditModal: Function;
  }) {
    this.container = parameters.container;
    this.nodes = parameters.nodes || [];
    this.edges = parameters.edges || [];
    this.showAddModal = parameters.showAddModal;
    this.showEditModal = parameters.showEditModal;
  }

  addNode(node: Node) {
    this.nodes.push(node);
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
  }

  removeBtns(nodeId) {
    const addBtn = document.getElementById('add-btn-' + nodeId);
    const deleteBtn = document.getElementById('delete-btn-' + nodeId);
    addBtn && addBtn.parentNode.removeChild(addBtn);
    deleteBtn && deleteBtn.parentNode.removeChild(deleteBtn);
  }

  draw() {
    if (!this.container) {
      return
    }
    const width = this.container.scrollWidth;
    const height = this.container.scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: (d) => {
          if (d.source.id === 'node0') {
            return 100;
          }
          return 30;
        },
        nodeStrength: (d) => {
          if (d.isLeaf) {
            return -50;
          }
          return -10;
        },
        edgeStrength: (d) => {
          if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
            return 0.7;
          }
          return 0.1;
        },
      },
      defaultNode: {
        color: '#5B8FF9',
      },
      modes: {
        default: ['drag-canvas'],
      },
    });

    const nodes = this.nodes;
    const clusterMap = new Map();
    let clusterId = 0;
    nodes.forEach( (node) => {
      // cluster
      if (node.cluster && clusterMap.get(node.cluster) === undefined) {
        clusterMap.set(node.cluster, clusterId);
        clusterId++;
      }
      const cid = clusterMap.get(node.cluster);
      if (!node.style) {
        node.style = {};
      }
      node.style.fill = this.colors[cid % this.colors.length];
      node.style.stroke = this.strokes[cid % this.strokes.length];
    });
    graph.data({
      nodes,
      edges: this.edges.map(function (edge, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    /*
    1.点击节点时，该节点以及相关的边高亮，其他节点和边变透明
    2.节点选中，且按下‘a’键，新增节点
    3.节点选中，且按下‘d’键，删除节点
    4.节点选中，且按下‘r’键，修改节点内容
    */
    graph.on('node:click', (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const nodeId = model.id;
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        if (edge.getSource().getModel().id === nodeId || edge.getTarget().getModel().id === nodeId) {
          edge.toFront();
          edge.update({
            style: {
              strokeOpacity: 1,
            },
          });
        } else {
          edge.update({
            style: {
              strokeOpacity: 0.1,
            },
          });
        }
      });
      const nodes = graph.getNodes();
      nodes.forEach((node) => {
        if (node.getModel().id === nodeId) {
          node.toFront();
          node.update({
            style: {
              opacity: 1,
            },
          });
        } else {
          node.update({
            style: {
              opacity: 0.1,
            },
          });
        }
      });
      // 按下键盘按键
      document.onkeydown = (e) => {
        const keyCode = e.keyCode;
        const key = e.key;
        if (e.key === 'a') {
          // 按下‘a’键，新增节点
          this.showAddModal()

        } else if (e.key === 's') {
          console.log('delete node')
          // 按下‘d’键，删除节点
          graph.removeItem(item);
          graph.updateLayout();
        } else if (keyCode === 82) {
          // 按下‘r’键，修改节点内容
          const label = prompt('请输入新的节点内容', 'new label');
          graph.updateItem(item, {
            label,
          });
        }
      }
    });

    // 编辑节点-双击节点修改node内容和节点的cluster
    graph.on('node:dblclick', (evt) => {
      const { item } = evt;
      // 返回节点的内容、大小、cluster
      const { label, size, cluster } = item.getModel();
      this.showEditModal({label, size, cluster})
      // graph.updateItem(item, {
      //   label,
      //   cluster,
      //   size,
      // });
    });


    // 点击空白处取消高亮，恢复正常
    graph.on('canvas:click', () => {
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        edge.update({
          style: {
            strokeOpacity: 1,
          },
        });
      });
      const nodes = graph.getNodes();
      nodes.forEach((node) => {
        node.update({
          style: {
            opacity: 1,
          },
        });
      });
    });

    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
      e.item.get('model').fx = null;
      e.item.get('model').fy = null;
    });

    graph.on('node:contextmenu', (evt) => {
      const { item, canvasX, canvasY } = evt;

      // 创建自定义下拉框 DOM 元素
      const dropdown = document.createElement('div');
      dropdown.className = 'custom-dropdown';
      dropdown.style.left = canvasX + 'px';
      dropdown.style.top = canvasY + 'px';
      dropdown.innerHTML = `
        <ul>
          <li>选项1</li>
          <li>选项2</li>
          <!-- 更多选项... -->
        </ul>
      `;

      // 将下拉框插入到图的容器中
      graph.get('container').appendChild(dropdown);

      dropdown.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'LI') {
          const option = target.textContent;
          // 处理选项的操作
          if (option === '选项1') {
            // 执行展开节点等操作
          }
          // ...
        }
      });
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!this.container || !this.container.scrollWidth || !this.container.scrollHeight) return;
        graph.changeSize(this.container.scrollWidth, this.container.scrollHeight);
      };

    function refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
  }
}

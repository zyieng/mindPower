import G6 from '@antv/g6';

interface Node {
  id: string;
  size: number;
  label: number;
}
interface Edge {
  source: string;
  target: string;
}

export class BrainGraph {
  // The container to render the graph
  container: HTMLElement | null;
  nodes: Node[];
  edges: Edge[];

  // Instantiate G6 Graph
  constructor(parameters: {
    container: HTMLElement | null;
    nodes: Node[];
    edges: Edge[];
  }) {
    this.container = parameters.container;
    this.nodes = parameters.nodes || [];
    this.edges = parameters.edges || [];
  }

  addNode(node: Node) {
    this.nodes.push(node);
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
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
    graph.data({
      nodes,
      edges: this.edges.map(function (edge, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    // 监听鼠标进入节点，在该节点的位置附近展示删除按钮和添加按钮，点击删除按钮删除节点且跟当前节点相连接，点击添加按钮添加子节点
    graph.on('node:mouseenter', (evt) => {
      console.log('node:mouseenter', evt);
      const { item } = evt;
      const model = item.getModel();
      const nodeId = model.id;
      const addBtn = document.createElement('div');
      addBtn.className = 'add-btn';
      addBtn.innerHTML = '+';
      addBtn.id = 'add-btn-' + nodeId;
      const deleteBtn = document.createElement('div');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '-';
      deleteBtn.id = 'delete-btn-' + nodeId;
      const left = evt.item.getBBox().minX;
      const top = evt.item.getBBox().minY;
      addBtn.style.position = 'absolute';
      addBtn.style.left = left + 10 + 'px';
      addBtn.style.top = top + 10 + 'px';
      deleteBtn.style.position = 'absolute';
      deleteBtn.style.left = left + 10 + 'px';
      deleteBtn.style.top = top - 10 + 'px';
      graph.get('container').appendChild(addBtn);
      graph.get('container').appendChild(deleteBtn);
      graph.paint();
      addBtn.addEventListener('click', () => {
        const node = {
          id: 'node-' + Date.now(),
          label: 'new node',
          size: 50,
          x: evt.item.getModel().x + 30,
          y: evt.item.getModel().y,
        };
        graph.addItem('node', node);
        graph.addItem('edge', {
          source: nodeId,
          target: node.id,
        });
        graph.updateLayout();
      }
      );
      deleteBtn.addEventListener('click', () => {
        graph.removeItem(item);
        graph.updateLayout();
      }
      );
    });

    // 鼠标移出节点时，删除按钮和添加按钮消失
    graph.on('node:mouseover', (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const nodeId = model.id;
      const addBtn = document.getElementById('add-btn-' + nodeId);
      const deleteBtn = document.getElementById('delete-btn-' + nodeId);
      addBtn && addBtn.parentNode.removeChild(addBtn);
      deleteBtn && deleteBtn.parentNode.removeChild(deleteBtn);
    });

    graph.on('node:click', (evt) => {
      const item = evt.item; // 被操作的节点 item
      const target = evt.target; // 被操作的具体图形
      console.log('node:click', item, target);
      // ...
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

import G6 from '@antv/g6';
import { addNodeForm } from './addNodeForm';
import { editNodeForm } from './editNodeForm';
import { NodeElement } from './Node';
import {NodeType, EdgeType} from './Node/NodeType';

export class BrainGraph {
  // The container to render the graph
  status: 'addNode' | 'delete' | 'editNode' | 'normal' = 'normal';
  container: HTMLElement | null;
  nodes: NodeType[];
  edges: EdgeType[];

  // Instantiate G6 Graph
  constructor(parameters: {
    container: HTMLElement | null;
    nodes: NodeType[];
    edges: EdgeType[];
    operateArea: HTMLElement | null;
  }) {
    this.container = parameters.container;
    this.nodes = parameters.nodes.map(item => new NodeElement(item).getNode());
    this.edges = parameters.edges || [];
    this.status = 'normal';
  }

  setStatus(status: 'addNode' | 'delete' | 'editNode' | 'normal') {
    this.status = status;
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
      return;
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
          if (
            d.source.id === 'node1' ||
            d.source.id === 'node2' ||
            d.source.id === 'node3'
          ) {
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

    graph.data({
      nodes: this.nodes,
      edges: this.edges,
    });

    graph.render();

    /*
    1.点击节点时，该节点以及相关的边高亮，其他节点和边变透明
    2.节点选中，且按下‘a’键，新增节点
    3.节点选中，且按下‘s’键，删除节点
    */
    graph.on('node:click', (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const nodeId = model.id;
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        if (
          edge.getSource().getModel().id === nodeId ||
          edge.getTarget().getModel().id === nodeId
        ) {
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
      this.nodes = graph.getNodes().map((node) => {
        const currentNode = new NodeElement(node.getModel());
        if ( currentNode.getNodeId()=== nodeId) {
          currentNode.makeOpaque();
        } else {
          currentNode.makeTransparent();
        }
        graph.updateItem(node, currentNode.getNode())
        return currentNode.getNode()
      });
      graph.changeData({
        nodes: this.nodes,
        edges: this.edges,
      });

      // 按下键盘按键
      document.onkeydown = async (e) => {
        const keyCode = e.keyCode;
        const key = e.key;
        /* TODO 按下‘a’键*/
        if (e.key === 'a') {
          if (this.status !== 'normal') return;
          this.status = 'addNode';
          const point = {
            x: evt.x,
            y: evt.y,
          };
          await addNodeForm({
            graph,
            point,
            model,
            nodeId,
            addNode: this.addNode.bind(this),
            addEdge: this.addEdge.bind(this),
            setStatus: this.setStatus.bind(this),
          });
        } else if (e.key === 's') {
          console.log('delete node');
          // 按下‘s’键，删除节点
          graph.removeItem(item);
          graph.updateLayout();
        }
      };
    });

    // 编辑节点-双击节点修改node内容和节点的cluster
    graph.on('node:dblclick', (evt) => {
      if (this.status !== 'normal') return;
      this.status = 'editNode';
      const { item } = evt;
      const model = item.getModel();
      const nodeId = model.id;
      // 编辑节点内容、尺寸、cluster
      editNodeForm({
        target: item,
        graph,
        nodeId,
        setStatus: this.setStatus.bind(this),
      });
      graph.updateLayout();
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
      this.nodes = graph.getNodes().map((node) => {
        const currentNode = new NodeElement(node.getModel());
        currentNode.makeOpaque();
        graph.updateItem(node, currentNode.getNode())
        return currentNode.getNode()
      });
      graph.changeData({
        nodes: this.nodes,
        edges: this.edges,
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

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (
          !this.container ||
          !this.container.scrollWidth ||
          !this.container.scrollHeight
        )
          return;
        graph.changeSize(
          this.container.scrollWidth,
          this.container.scrollHeight,
        );
      };

    function refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
  }
}

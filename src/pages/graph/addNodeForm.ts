import { addformHtml } from './form';
const { v4: uuidv4 } = require('uuid');
import { AddNodeFormParams } from './graph.d';

export const addNodeForm = ({
  graph,
  nodeId,
  model,
  setStatus,
}: AddNodeFormParams) => {
  // 气泡内有表单，表单里面需要输入节点名字、节点大小和节点cluster
  const addDiv = document.createElement('div');
  addDiv.id = 'add-btn-' + nodeId;
  addDiv.innerHTML = addformHtml({ title: '新增', nodeId });
  // 点击确认按钮，新增节点
  const confirmBtn: HTMLElement | null = addDiv.querySelector(
    '#confirm-btn-' + nodeId,
  );
  const operateArea = document.getElementById('operateArea');
  if (!confirmBtn) return;
  confirmBtn.onclick = () => {
    setStatus('normal');
    const name = document.querySelector('#node-name-' + nodeId)?.value;
    const size = document.querySelector('#node-size-' + nodeId)?.value;
    const cluster = document.querySelector('#node-cluster-' + nodeId)?.value;
    const newNode = {
      id: uuidv4(),
      label: name,
      size,
      cluster,
      x: model.x + 100,
      y: model.y + 100,
    };
    // 以当前被点击的元素为中心，新增一个节点
    graph.addItem('node', newNode);
    // 以当前被点击的元素为中心，新增一条边
    graph.addItem('edge', {
      source: model.id,
      target: newNode.id,
    });
    operateArea.removeChild(addDiv);
  };
  // 点击取消按钮，删除气泡
  const cancelBtn = addDiv.querySelector('#cancel-btn-' + nodeId);
  cancelBtn.onclick = () => {
    operateArea.removeChild(addDiv);
    setStatus('normal');
  };
  operateArea.appendChild(addDiv);
};

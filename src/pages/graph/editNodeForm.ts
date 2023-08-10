import { editformHtml } from './form';
const { v4: uuidv4 } = require('uuid');
import { EditNodeFormParams } from './graph';

export const editNodeForm = ({ target, graph, nodeId, setStatus }) => {
  // 获取当前节点的内容、尺寸和cluster
  const model = target.getModel();
  const { label, size, cluster } = model;

  // 气泡内有表单，表单里面需要输入节点名字、节点大小和节点cluster
  const addDiv = document.createElement('div');
  addDiv.id = 'add-btn-' + nodeId;
  addDiv.innerHTML = editformHtml({ nodeId, label, size, cluster });
  // 点击确认按钮，编辑节点
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
    // 更新当前节点内容、尺寸和cluster
    target.update({
      label: name,
      size,
      cluster,
    });
    graph.updateItem(target, {
      label: name,
      size,
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

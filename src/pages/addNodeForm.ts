const { v4: uuidv4 } = require('uuid');
export const addNodeForm = ({graph, point, nodeId, model, setStatus}) => {
  // 在该节点附近绘制气泡
  const container = graph.get('container');
  const canvasPoint = graph.getCanvasByPoint(point.x, point.y);
  const bbox = container.getBoundingClientRect();
  const canvasOffsetLeft = canvasPoint.x + 25;
  const canvasOffsetTop = canvasPoint.y + 25;

  // 气泡内有表单，表单里面需要输入节点名字、节点大小和节点cluster
  const addDiv = document.createElement('div');
  addDiv.id = 'add-btn-' + nodeId;
  addDiv.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; border-radius: 5px; box-shadow: 0 0 10px #ccc;">
              <div style="padding: 10px;">
                <div style="margin-bottom: 10px;">
                  <span>节点名字：</span>
                  <input id="node-name-${nodeId}" type="text" placeholder="请输入节点名字" />
                </div>
                <div style="margin-bottom: 10px;">
                  <span>节点大小：</span>
                  <input id="node-size-${nodeId}" type="text" placeholder="请输入节点大小" />
                </div>
                <div style="margin-bottom: 10px;">
                  <span>节点cluster：</span>
                  <input id="node-cluster-${nodeId}" type="text" placeholder="请输入节点cluster" />
                </div>
                <div style="text-align: right;">
                  <button id="confirm-btn-${nodeId}" style="margin-right: 10px;">确认</button>
                  <button id="cancel-btn-${nodeId}">取消</button>
                </div>
              </div>
            </div>
          `;
  // 点击确认按钮，新增节点
  const confirmBtn = addDiv.querySelector('#confirm-btn-' + nodeId);
  confirmBtn.onclick = () => {
    setStatus('default');
    const name = document.querySelector('#node-name-' + nodeId).value;
    const size = document.querySelector('#node-size-' + nodeId).value;
    const cluster = document.querySelector('#node-cluster-' + nodeId).value;
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
    container.removeChild(addDiv);
  };
  // 点击取消按钮，删除气泡
  const cancelBtn = addDiv.querySelector('#cancel-btn-' + nodeId);
  cancelBtn.onclick = () => {
    container.removeChild(addDiv);
    setStatus('default');
  };
  container.appendChild(addDiv);
  addDiv.style.position = 'absolute';
  addDiv.style.left = canvasOffsetLeft + 'px';
  addDiv.style.top = canvasOffsetTop + 'px';
  addDiv.style.width = '200px';
  addDiv.style.height = '200px';
  addDiv.style.zIndex = 100;
  //  气泡支持拖拽
  // addDiv.onmousedown = (e) => {
  //   const startX = e.clientX - bbox.left;
  //   const startY = e.clientY - bbox.top;
  //   const onDrag = (e) => {
  //     const newX = e.clientX - bbox.left;
  //     const newY = e.clientY - bbox.top;
  //     const diffX = newX - startX;
  //     const diffY = newY - startY;
  //     addDiv.style.left = canvasOffsetLeft + diffX + 'px';
  //     addDiv.style.top = canvasOffsetTop + diffY + 'px';
  //   };
  //   const onDragEnd = () => {
  //     document.removeEventListener('mousemove', onDrag);
  //     document.removeEventListener('mouseup', onDragEnd);
  //   };
  //   document.addEventListener('mousemove', onDrag);
  //   document.addEventListener('mouseup', onDragEnd);
  // }
}

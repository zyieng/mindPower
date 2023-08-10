const addformHtml = ({ nodeId }) => {
  return `
        <div>
            <div>
                <h1>新增</h1>
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
};

const editformHtml = ({ nodeId, label, size, cluster }) => {
  return `
        <div>
            <div>
                <h1>编辑</h1>
                <div style="margin-bottom: 10px;">
                <span>节点名字：</span>
                <input id="node-name-${nodeId}" type="text" value="${label}" />
                </div>
                <div style="margin-bottom: 10px;">
                <span>节点大小：</span>
                <input id="node-size-${nodeId}" type="text" value="${size}" />
                </div>
                <div style="margin-bottom: 10px;">
                <span>节点cluster：</span>
                <input id="node-cluster-${nodeId}" type="text" value="${cluster}" />
                </div>
                <div style="text-align: right;">
                <button id="confirm-btn-${nodeId}" style="margin-right: 10px;">确认</button>
                <button id="cancel-btn-${nodeId}">取消</button>
                </div>
            </div>
        </div>
    `;
};

export { addformHtml, editformHtml };

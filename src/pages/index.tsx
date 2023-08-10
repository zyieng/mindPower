import { useEffect, useRef } from 'react';
import styles from './index.less';
import { BrainGraph } from './graph/index';
import React from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Card,
  Popover,
} from 'antd';
import '@/styles/index.less';

export default function IndexPage() {
  let brainGraph;
  const nodes = [
    { id: 'node0', size: 70, label: 1, cluster: 'a' },
    { id: 'node1', size: 40, label: 2, cluster: 'a' },
    { id: 'node2', size: 40, label: 3, cluster: 'a' },
    { id: 'node3', size: 40, label: 4, cluster: 'a' },
    { id: 'node4', size: 30, isLeaf: true, label: 5, cluster: 'b' },
    { id: 'node5', size: 30, isLeaf: true, label: 6, cluster: 'b' },
    { id: 'node6', size: 20, isLeaf: true, label: 7, cluster: 'b' },
    { id: 'node7', size: 20, isLeaf: true, label: 8, cluster: 'b' },
    { id: 'node8', size: 20, isLeaf: true, label: 9, cluster: 'b' },
    { id: 'node9', size: 20, isLeaf: true, label: 10, cluster: 'c' },
    { id: 'node10', size: 40, isLeaf: true, label: 11, cluster: 'c' },
    { id: 'node11', size: 40, isLeaf: true, label: 12, cluster: 'c' },
    { id: 'node12', size: 40, isLeaf: true, label: 13, cluster: 'c' },
    { id: 'node13', size: 40, isLeaf: true, label: 14, cluster: 'c' },
    { id: 'node14', size: 30, isLeaf: true, label: 15, cluster: 'c' },
    { id: 'node15', size: 30, isLeaf: true, label: 16, cluster: 'c' },
    { id: 'node16', size: 30, isLeaf: true, label: 17, cluster: 'c' },
  ];
  const edges = [
    { source: 'node0', target: 'node1' },
    { source: 'node0', target: 'node2' },
    { source: 'node0', target: 'node3' },
    { source: 'node0', target: 'node4' },
    { source: 'node0', target: 'node5' },
    { source: 'node1', target: 'node6' },
    { source: 'node1', target: 'node7' },
    { source: 'node2', target: 'node8' },
    { source: 'node2', target: 'node9' },
    { source: 'node2', target: 'node10' },
    { source: 'node2', target: 'node11' },
    { source: 'node2', target: 'node12' },
    { source: 'node2', target: 'node13' },
    { source: 'node3', target: 'node14' },
    { source: 'node3', target: 'node15' },
    { source: 'node3', target: 'node16' },
  ];

  useEffect(() => {
    const container = document.getElementById('container');
    brainGraph = new BrainGraph({
      container,
      nodes,
      edges,
    });
    brainGraph.draw();
  }, []);
  return (
    <>
      <Row>
        <Col flex="250px">
          <Card title="使用说明">
            <p>点击元素-按下'a'键添加按钮</p>
            <p>点击元素-按下's'键删除按钮</p>
            <p>双击元素-编辑节点</p>
          </Card>
          <Card title="操作区">
            <div id="operateArea"></div>
          </Card>
          <div />
        </Col>
        <Col flex="auto">
          <div className={styles.abc} id="container" />
        </Col>
      </Row>
    </>
  );
}

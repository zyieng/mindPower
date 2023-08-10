import { useEffect } from 'react';
import styles from './index.less';
import { BrainGraph } from './graph';
import React from 'react';
import { Modal, Button, Form, Input, InputNumber } from 'antd';
import '@/styles/index.less'


export default function IndexPage() {
  let brainGraph
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
  ]
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
  ]
  const [visibleAdd, setVisible] = React.useState(false);
  const [form] = Form.useForm();
  const showAddModal = (value: {
    id: string;
    size: number;
    label: number;
  }) => {
    form.setFieldsValue(value);
    console.log('showModal', value);
    setVisible(true);
  };
  const onAddOk = () => {
    console.log(form.getFieldsValue());
    setVisible(false);
  };

  const [visibleEdit, setVisibleEdit] = React.useState(false);

  useEffect(() => {
    const container = document.getElementById('container');
    brainGraph = new BrainGraph({
      container,
      nodes,
      edges,
      showAddModal
    });
    brainGraph.draw()
  }, []);
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <div className={styles.abc} id="container" />
      {/* antd弹框，用来新增节点的内容、cluster和大小 */}
      <Modal
        title="新增节点"
        open={visibleAdd}
        okText="添加"
        cancelText="取消"
        onOk={onAddOk}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ size: 20, cluster: 'default' }}
        >
          <Form.Item
            label="节点内容"
            name="label"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          {/* 节点大小, 如果没有填写则默认20 */}
          <Form.Item label="节点大小" name="size">
            <InputNumber min={20} max={100} />
          </Form.Item>
          {/* 节点cluster, 如果没有填写则为‘default’ */}
          <Form.Item label="节点cluster" name="cluster">
            <Input/>
          </Form.Item>
        </Form>
      </Modal>

      {/* antd弹框，用来编辑节点的内容、cluster和大小 */}
      <Modal
        title="新增/编辑节点"
        open={visibleEdit}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ size: 20, cluster: 'default' }}
        >
          <Form.Item
            label="节点内容"
            name="label"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          {/* 节点大小, 如果没有填写则默认20 */}
          <Form.Item label="节点大小" name="size">
            <InputNumber min={20} max={100} />
          </Form.Item>
          {/* 节点cluster, 如果没有填写则为‘default’ */}
          <Form.Item label="节点cluster" name="cluster">
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

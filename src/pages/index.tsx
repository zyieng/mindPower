import { useEffect } from 'react';
import styles from './index.less';
import { BrainGraph } from './graph';

export default function IndexPage() {
  const nodes = [
    { id: 'node0', size: 70, label: 1 },
    { id: 'node1', size: 40, label: 2 },
    { id: 'node2', size: 40, label: 3 },
    { id: 'node3', size: 40, label: 4 },
    { id: 'node4', size: 30, isLeaf: true, label: 5 },
    { id: 'node5', size: 30, isLeaf: true, label: 6 },
    { id: 'node6', size: 20, isLeaf: true, label: 7 },
    { id: 'node7', size: 20, isLeaf: true, label: 8 },
    { id: 'node8', size: 20, isLeaf: true, label: 9 },
    { id: 'node9', size: 20, isLeaf: true, label: 10 },
    { id: 'node10', size: 40, isLeaf: true, label: 11 },
    { id: 'node11', size: 40, isLeaf: true, label: 12 },
    { id: 'node12', size: 40, isLeaf: true, label: 13 },
    { id: 'node13', size: 40, isLeaf: true, label: 14 },
    { id: 'node14', size: 30, isLeaf: true, label: 15 },
    { id: 'node15', size: 30, isLeaf: true, label: 16 },
    { id: 'node16', size: 30, isLeaf: true, label: 17 },
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
  useEffect(() => {
    const container = document.getElementById('container');
    const brainGraph = new BrainGraph({
      container,
      nodes,
      edges,
    });
    brainGraph.draw()
  }, []);
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <div className={styles.abc} id="container" />
    </div>
  );
}

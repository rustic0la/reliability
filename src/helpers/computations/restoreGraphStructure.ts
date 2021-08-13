import { mxCell } from 'mxgraph';

const filterData = (data: any) => {
  const propsToFilter = [
    'TRANSLATE_CONTROL_POINTS',
    'alternateBounds',
    'offset',
    'relative',
    'connectable',
    'visible',
    'collapsed',
    'mxTransient',
  ];

  for (let i of data) {
    for (let prop in i) {
      if (propsToFilter.includes(prop)) {
        delete i[prop];
      }
    }
  }
  return data;
};

export const restoreGraphStructure = (
  graphStructureNodes: any,
  subGraphs: any,
) => {
  filterData(graphStructureNodes);

  for (let subGraph of subGraphs) {
    const [id, graph] = subGraph;
    for (let layerGraph of subGraphs.map((i: any) => i[1])) {
      const cell = layerGraph.find((cell: mxCell) => cell.mxObjectId === id);
      if (cell) {
        cell.children = graph;
      }
    }
  }

  for (let i of graphStructureNodes) {
    for (let subGraph of subGraphs) {
      const [id, data] = subGraph;

      if (i.mxObjectId === id) {
        i.children = data;
      }
    }
  }

  return graphStructureNodes;
};

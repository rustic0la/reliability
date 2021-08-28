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

  for (const i of data) {
    for (const prop in i) {
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

  for (const subGraph of subGraphs) {
    const [id, graph] = subGraph;
    for (const layerGraph of subGraphs.map((i: any) => i[1])) {
      const cell = layerGraph.find((cell: mxCell) => cell.mxObjectId === id);
      if (cell) {
        cell.children = graph;
      }
    }
  }

  for (const i of graphStructureNodes) {
    for (const subGraph of subGraphs) {
      const [id, data] = subGraph;

      if (i.mxObjectId === id) {
        i.children = data;
      }
    }
  }

  return graphStructureNodes;
};

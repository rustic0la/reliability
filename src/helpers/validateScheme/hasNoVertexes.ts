import { mxCell } from 'mxgraph';

export const hasNoVertexes = (graph: mxCell[]): boolean => {
  const main = graph.filter((v) => v.style === 'rectangle').length > 0;

  return !main;
};

import { mxCell } from 'mxgraph';

export const isNoRectangles = (graph: mxCell[]): boolean => {
  const main = graph.filter((v) => v.style === 'rectangle').length > 0;

  return !main;
};

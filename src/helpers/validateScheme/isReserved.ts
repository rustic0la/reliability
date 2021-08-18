import { mxCell } from 'mxgraph';

export const isReserved = (graph: mxCell[]): boolean => {
  const main = graph.filter((cell) => cell.style === 'loaded').length > 0;

  return main;
};

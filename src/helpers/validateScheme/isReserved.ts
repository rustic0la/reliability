import { mxCell } from 'mxgraph';

export const isReserved = (graph: mxCell[]): boolean => {
  return graph.filter((cell) => cell.style === 'loaded').length > 0;
};

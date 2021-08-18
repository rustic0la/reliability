import { mxCell } from 'mxgraph';

export const hasSwitcher = (graph: mxCell[]): boolean => {
  return graph.filter((cell) => cell.style === 'switcher').length > 0;
};

import { mxCell } from 'mxgraph';

export const isSwitcher = (graph: mxCell[]): boolean => {
  const main = graph.filter((cell) => cell.style === 'switcher').length > 0;

  return main;
};

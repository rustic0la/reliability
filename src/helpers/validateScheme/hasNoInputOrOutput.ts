import { mxCell } from 'mxgraph';

export const hasNoInputOrOutput = (graph: mxCell[]): boolean => {
  const main =
    graph.filter((cell) => cell.style === 'input').length === 1 &&
    graph.filter((cell) => cell.style === 'output').length === 1;

  return !main;
};

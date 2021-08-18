import { mxCell } from 'mxgraph';

export const hasIncorrectMOfN = (graph: mxCell[]): boolean => {
  const reMOfn = /^\d+\/\d+$/;
  const mOfn = graph
    .filter((cell) => cell.style === 'mOfn')
    .every((cell) => reMOfn.test(cell.value));

  return !mOfn;
};

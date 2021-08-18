import { mxCell } from 'mxgraph';
import { isReservedWithSwitcher } from '../defineSchemeType';

export const isSwitcherSchemeCorrect = (graph: mxCell[]): boolean => {
  const main = isReservedWithSwitcher(graph);

  return !main;
};

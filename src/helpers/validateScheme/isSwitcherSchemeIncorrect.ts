import { mxCell } from 'mxgraph';
import { isReservedWithSwitcher } from '../defineSchemeType';

export const isSwitcherSchemeIncorrect = (graph: mxCell[]): boolean => {
  const main = isReservedWithSwitcher(graph);

  return !main;
};

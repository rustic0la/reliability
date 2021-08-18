import { mxCell } from 'mxgraph';
import { isTwoMajorities, isMajority } from '../defineSchemeType';
import { getInputId, getOutputId } from '../commonUtils';

export const hasMajority = (graph: mxCell[]): boolean => {
  const inputId = getInputId(graph);
  const outputId = getOutputId(graph);

  return (
    isMajority(graph, inputId, outputId) ||
    isTwoMajorities(graph, inputId, outputId)
  );
};

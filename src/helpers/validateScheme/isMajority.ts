import { mxCell } from 'mxgraph';
import { isTwoMajorities, isMajority } from '../defineSchemeType';

export const hasMajority = (graph: mxCell[]): boolean => {
  const inputId =
    graph.find((node) => node.style === 'input') &&
    graph.find((node) => node.style === 'input')?.id;
  const outputId =
    graph.find((node) => node.style === 'output') &&
    graph.find((node) => node.style === 'output')?.id;
  const main =
    isMajority(graph, inputId, outputId) ||
    isTwoMajorities(graph, inputId, outputId);

  return main;
};

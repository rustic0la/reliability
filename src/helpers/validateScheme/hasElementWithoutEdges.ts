import { mxCell } from 'mxgraph';

export const hasElementWithoutEdges = (graph: mxCell[]): boolean => {
  const graphVertexes = graph
    .filter(
      (cell) =>
        cell.vertex && cell.style !== 'input' && cell.style !== 'output',
    )
    .every((cell) => cell.edges && cell.edges.length >= 2);

  return !graphVertexes;
};

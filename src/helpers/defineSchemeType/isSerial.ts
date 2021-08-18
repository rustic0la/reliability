import { mxCell } from 'mxgraph';
import {
  getVertexes,
  isEdgeConnectedToInAndOut,
  isEdgeConnectedToRect,
} from '../commonUtils';

/** схема - последовательная */
export const isSerial = (
  nodes: mxCell[],
  inputId: string,
  outputId: string,
): boolean => {
  const vertexes = getVertexes(nodes);
  if (vertexes.length === 1) return true;
  if (vertexes.some((v) => v.edges.length > 2)) return false;

  let list = [...vertexes];
  for (const vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      ((vert.edges.filter((e) =>
        isEdgeConnectedToInAndOut(vert.id, e, inputId, outputId),
      ).length === 1 &&
        vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
          1) ||
        vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
          2)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  const input = nodes.filter((v) => v.style === 'input')[0];
  const output = nodes.filter((v) => v.style === 'output')[0];
  return (
    list.length === 0 && input.edges.length === 1 && output.edges.length === 1
  );
};

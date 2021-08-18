import { mxCell } from 'mxgraph';
import {
  getVertexes,
  isEdgeConnectedToInAndOut,
  isEdgeConnectedToRect,
} from '../commonUtils';

/** схема - две мажоритарные */
export const isTwoMajorities = (
  nodes: mxCell[],
  inputId: string,
  outputId: string,
): boolean => {
  const vertexes = getVertexes(nodes);
  if (vertexes.length !== 6) return false;

  let list = [...vertexes];
  for (const vert of vertexes) {
    if (
      (vert.edges.length === 3 &&
        vert.edges.filter((e) =>
          isEdgeConnectedToInAndOut(vert.id, e, inputId, outputId),
        ).length === 1 &&
        vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
          2) ||
      (vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
        3 &&
        list.includes(vert))
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
    if (
      vert.edges.length === 2 &&
      vert.edges.every((e) => isEdgeConnectedToRect(vert.id, e)) &&
      list.includes(vert)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  return list.length === 0;
};

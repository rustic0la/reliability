import {
  getVertexes,
  isEdgeConnectedToInAndOut,
  isEdgeConnectedToRect,
} from '../commonUtils';
import { mxCell } from 'mxgraph';

/** схема - мажоритарная */
export const isMajority = (
  nodes: mxCell[],
  inputId: string,
  outputId: string,
): boolean => {
  const vertexes = getVertexes(nodes);
  if (vertexes.length !== 4) return false;

  let list = [...vertexes];
  for (const vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      vert.edges.filter((e) =>
        isEdgeConnectedToInAndOut(vert.id, e, inputId, outputId),
      ).length === 1 &&
      vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length === 1
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
    if (
      vert.edges.length === 3 &&
      ((vert.edges.filter((e) =>
        isEdgeConnectedToInAndOut(vert.id, e, inputId, outputId),
      ).length === 1 &&
        vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
          2 &&
        list.includes(vert)) ||
        vert.edges.filter((e) => isEdgeConnectedToRect(vert.id, e)).length ===
          3)
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

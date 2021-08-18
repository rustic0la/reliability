import { mxCell } from 'mxgraph';
import {
  getVertexes,
  isEdgeConnectedToIn,
  isEdgeConnectedToOut,
} from './commonUtils';

/** схема - параллельная */
export const isParallel = (
  nodes: mxCell[],
  inputId: string,
  outputId: string,
): boolean => {
  const vertexes = getVertexes(nodes);

  let list = [...vertexes];
  for (const vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      vert.edges.filter((e) => isEdgeConnectedToIn(vert.id, e, inputId))
        .length === 1 &&
      vert.edges.filter((e) => isEdgeConnectedToOut(vert.id, e, outputId))
        .length === 1
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  return list.length === 0;
};

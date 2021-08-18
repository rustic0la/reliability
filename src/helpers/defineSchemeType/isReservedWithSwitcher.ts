import { mxCell } from 'mxgraph';
import { isEdgeConnectedTo } from '../commonUtils';

/** схема - резервированная с переключателем */
export const isReservedWithSwitcher = (vertexes: mxCell[]): boolean => {
  const switcher = vertexes.find((v) => v.style === 'switcher');
  if (!switcher) return false;

  if (
    switcher.edges.length >= 3 &&
    switcher.edges.filter((e) => isEdgeConnectedTo(e, 'rectangle')).length ===
      1 &&
    switcher.edges.filter((e) => isEdgeConnectedTo(e, 'loaded')).length >= 2
  ) {
    const edgeId = switcher.edges.filter((e) =>
      isEdgeConnectedTo(e, 'rectangle'),
    )[0].id;
    const rectangleId = vertexes.filter(
      (v) =>
        v.style === 'rectangle' &&
        v.edges.filter((e) => e.id === edgeId).length === 1,
    )[0].id;

    const loadeds = vertexes.filter((v) => v.style === 'loaded');
    if (loadeds.length === 0) return false;

    let list = [...loadeds];
    for (const loaded of loadeds) {
      if (
        loaded.edges.length === 2 &&
        list.includes(loaded) &&
        loaded.edges.filter((e) => isEdgeConnectedTo(e, 'switcher')).length ===
          1 &&
        loaded.edges.filter(
          (e) => e.source.id === rectangleId || e.target.id === rectangleId,
        ).length === 1
      ) {
        list = [...list].filter((v) => v.id !== loaded.id);
      }
    }
    return list.length === 0;
  }
  return false;
};

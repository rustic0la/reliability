import { mxCell } from 'mxgraph';

export function sum(a: any, b: any) {
  return a + b;
}

/** схема - резервированная с переключателем */
export const isReservedWithSwitcher = (vertexes: mxCell[]) => {
  const switcher = vertexes.find((v) => v.style === 'switcher');
  if (switcher) {
    if (
      switcher.edges.length >= 3 &&
      switcher.edges.filter(
        (e) => e.source.style === 'rectangle' || e.target.style === 'rectangle',
      ).length === 1 &&
      switcher.edges.filter(
        (e) => e.target.style === 'loaded' || e.source.style === 'loaded',
      ).length >= 2
    ) {
      const edgeId = switcher.edges.filter(
        (e) => e.target.style === 'rectangle' || e.source.style === 'rectangle',
      )[0].id;
      const rectangleId = vertexes.filter(
        (v) =>
          v.style === 'rectangle' &&
          v.edges.filter((e) => e.id === edgeId).length === 1,
      )[0].id;

      const loadeds = vertexes.filter((v) => v.style === 'loaded');
      let list = [...loadeds];
      if (loadeds.length === 0) return false;
      for (let loaded of loadeds) {
        if (
          loaded.edges.length === 2 &&
          list.includes(loaded) &&
          loaded.edges.filter(
            (e) =>
              e.source.style === 'switcher' || e.target.style === 'switcher',
          ).length === 1 &&
          loaded.edges.filter(
            (e) => e.source.id === rectangleId || e.target.id === rectangleId,
          ).length === 1
        ) {
          list = [...list].filter((v) => v.id !== loaded.id);
        }
      }
      return list.length === 0;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

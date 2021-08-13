import { mxCell } from 'mxgraph';

export function sum(a: any, b: any) {
  return a + b;
}

/** схема - последовательная */
export const isSerial = (nodes: mxCell[], inputId: any, outputId: any) => {
  const vertexes = nodes.filter(
    (v) => v.vertex && v.style !== 'input' && v.style !== 'output',
  );
  if (vertexes.length === 1) return true;
  if (vertexes.some((v) => v.edges.length > 2)) return false;

  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      ((vert.edges.filter(
        (e) =>
          ((e.source.id === inputId || e.source.id === outputId) &&
            e.target.id === vert.id) ||
          ((e.target.id === inputId || e.target.id === outputId) &&
            e.source.id === vert.id),
      ).length === 1 &&
        vert.edges.filter(
          (e) =>
            (e.target.id === vert.id && e.source.style === 'rectangle') ||
            (e.source.id === vert.id && e.target.style === 'rectangle'),
        ).length === 1) ||
        vert.edges.filter(
          (e) =>
            (e.target.id === vert.id && e.source.style === 'rectangle') ||
            (e.source.id === vert.id && e.target.style === 'rectangle'),
        ).length === 2)
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

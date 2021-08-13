import { mxCell } from 'mxgraph';

export function sum(a: any, b: any) {
  return a + b;
}
// prettier-ignore
/** схема - параллельная */
export const isParallel = (nodes: mxCell[], inputId: any, outputId: any) => {
    const vertexes = nodes.filter(
        (v) => v.vertex && v.style !== 'input' && v.style !== 'output',
    );
    let list = [...vertexes];
    for (let vert of vertexes) {
        if (
            vert.edges.length === 2 &&
            list.includes(vert) &&
            vert.edges.filter(
                (e) =>

                    (
                        (e.source.id === vert.id && e.target.id === inputId) ||
                        (e.target.id === vert.id && e.source.id === inputId)
                        // @ts-ignore
                    ).length === 1 &&
                    (
                        (e.source.id === vert.id && e.target.id === outputId) ||
                        (e.target.id === vert.id && e.source.id === outputId)
                        // @ts-ignore
                    ).length === 1,
            )
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
    }
    return list.length === 0;
};

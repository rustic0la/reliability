import { mxCell } from 'mxgraph';

export function sum(a: any, b: any) {
    return a + b;
}

/** схема - мажоритарная */
export const isMajority = (nodes: mxCell[], inputId: any, outputId: any) => {
    const vertexes = nodes.filter(
        (v: any) => v.vertex && v.style !== 'input' && v.style !== 'output',
    );
    if (vertexes.length !== 4) return false;
    let list = [...vertexes];
    for (let vert of vertexes) {
        if (
            vert.edges.length === 2 &&
            list.includes(vert) &&
            vert.edges.filter(
                (e) =>
                    ((e.source.id === inputId || e.source.id === outputId) &&
                        e.target.id === vert.id) ||
                    ((e.target.id === inputId || e.target.id === outputId) &&
                        e.source.id === vert.id),
            ).length === 1 &&
            vert.edges.filter(
                (e) =>
                    (e.target.id === vert.id &&
                        e.source.style === 'rectangle') ||
                    (e.source.id === vert.id && e.target.style === 'rectangle'),
            ).length === 1
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
        if (
            vert.edges.length === 3 &&
            ((vert.edges.filter(
                (e) =>
                    ((e.source.id === inputId || e.source.id === outputId) &&
                        e.target.id === vert.id) ||
                    ((e.target.id === inputId || e.target.id === outputId) &&
                        e.source.id === vert.id),
            ).length === 1 &&
                vert.edges.filter(
                    (e) =>
                        (e.target.id === vert.id &&
                            e.source.style === 'rectangle') ||
                        (e.source.id === vert.id &&
                            e.target.style === 'rectangle'),
                ).length === 2 &&
                list.includes(vert)) ||
                vert.edges.filter(
                    (e) =>
                        (e.target.id === vert.id &&
                            e.source.style === 'rectangle') ||
                        (e.source.id === vert.id &&
                            e.target.style === 'rectangle'),
                ).length === 3)
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
        if (
            vert.edges.length === 2 &&
            vert.edges.every(
                (e) =>
                    (e.source.id === vert.id &&
                        e.target.style === 'rectangle') ||
                    (e.target.id === vert.id && e.source.style === 'rectangle'),
            ) &&
            list.includes(vert)
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
    }
    return list.length === 0;
};

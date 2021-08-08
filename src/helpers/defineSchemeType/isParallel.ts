export function sum(a, b) {
    return a + b;
}

/** схема - параллельная */
export const isParallel = (nodes, inputId, outputId) => {
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
                    ).length === 1 &&
                    (
                        (e.source.id === vert.id && e.target.id === outputId) ||
                        (e.target.id === vert.id && e.source.id === outputId)
                    ).length === 1,
            )
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
    }
    return list.length === 0;
};

/** схема - две мажоритарные */
export const isTwoMajorities = (nodes, inputId, outputId) => {
    const vertexes = nodes.filter(
        (v) => v.vertex && v.style !== "input" && v.style !== "output"
    );
    if (vertexes.length !== 6) return false;
    let list = [...vertexes];
    for (let vert of vertexes) {
        if (
            (vert.edges.length === 3 &&
                vert.edges.filter(
                    (e) =>
                        ((e.source.id === inputId || e.source.id === outputId) &&
                            e.target.id === vert.id) ||
                        ((e.target.id === inputId || e.target.id === outputId) &&
                            e.source.id === vert.id)
                ).length === 1 &&
                vert.edges.filter(
                    (e) =>
                        (e.target.id === vert.id && e.source.style === "rectangle") ||
                        (e.source.id === vert.id && e.target.style === "rectangle")
                ).length === 2) ||
            (vert.edges.filter(
                (e) =>
                    (e.target.id === vert.id && e.source.style === "rectangle") ||
                    (e.source.id === vert.id && e.target.style === "rectangle")
                ).length === 3 &&
                list.includes(vert))
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
        if (
            vert.edges.length === 2 &&
            vert.edges.every(
                (e) =>
                    (e.source.id === vert.id && e.target.style === "rectangle") ||
                    (e.target.id === vert.id && e.source.style === "rectangle")
            ) &&
            list.includes(vert)
        ) {
            list = [...list].filter((v) => v.id !== vert.id);
        }
    }
    return list.length === 0;
};

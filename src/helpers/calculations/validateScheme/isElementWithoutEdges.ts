export const isElementWithoutEdges = (graph, childLayers) => {
    const graphVertexes = graph
        .filter(
            (cell) => cell.vertex && cell.style !== "input" && cell.style !== "output"
        )
        .every((cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2);

    const childVertexes =
        childLayers && childLayers.length > 0
            ? childLayers
                .map((ch) => ch.scheme)
                .map((layer) =>
                    layer
                        .filter(
                            (cell) =>
                                cell.vertex &&
                                cell.style !== "input" &&
                                cell.style !== "output"
                        )
                        .every(
                            (cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2
                        )
                )
            : true;

    const res =
        childVertexes === true
            ? childVertexes
            : childVertexes.every((layer) => layer);

    return !graphVertexes || !res;
};

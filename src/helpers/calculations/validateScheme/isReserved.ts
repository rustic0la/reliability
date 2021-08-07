export const isReserved = (graph, childLayers) => {
    const main = graph.filter((cell) => cell.style === "loaded").length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                .map((ch) => ch.scheme)
                .map(
                    (layer) =>
                        layer.filter((cell) => cell.style === "loaded").length > 0
                )
            : false;

    const res = children;

    return main || res;
};
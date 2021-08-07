export const isNoRectangles = (graph, childLayers) => {
    const main = graph.filter((v) => v.style === "rectangle").length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                .map((ch) => ch.scheme)
                .map(
                    (layer) =>
                        layer.filter((cell) => cell.style === "rectangle").length > 0
                )
            : true;

    const res = children === true ? children : children.every((layer) => layer);

    return !main || !res;
};
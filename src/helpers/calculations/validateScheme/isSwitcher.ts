export const isSwitcher = (graph, childLayers) => {
    const main = graph.filter((cell) => cell.style === "switcher").length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                .map((ch) => ch.scheme)
                .map(
                    (layer) =>
                        layer.filter((cell) => cell.style === "switcher").length > 0
                )
            : false;

    const res = children === false ? children : children.every((layer) => layer);

    return main || res;
};
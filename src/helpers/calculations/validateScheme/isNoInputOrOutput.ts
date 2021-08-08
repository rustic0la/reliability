export const isNoInputOrOutput = (graph, childLayers) => {
    const main =
        graph.filter((cell) => cell.style === 'input').length === 1 &&
        graph.filter((cell) => cell.style === 'output').length === 1;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch) => ch.scheme)
                  .map(
                      (layer) =>
                          layer.filter((cell) => cell.style === 'input')
                              .length === 1 &&
                          layer.filter((cell) => cell.style === 'output')
                              .length === 1,
                  )
            : true;

    const res = children === true ? children : children.every((layer) => layer);
    return !main || !res;
};

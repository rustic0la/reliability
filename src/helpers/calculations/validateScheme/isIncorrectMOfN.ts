export const isIncorrectMOfN = (graph, childLayers) => {
    const reMOfn = /^\d+\/\d+$/;
    const mOfn = graph
        .filter((cell) => cell.style === 'mOfn')
        .every((cell) => reMOfn.test(cell.value));

    const childMOfn =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch) => ch.scheme)
                  .map((layer) =>
                      layer
                          .filter((cell) => cell.style === 'mOfn')
                          .every((cell) => reMOfn.test(cell.value)),
                  )
            : true;

    const res =
        childMOfn === true ? childMOfn : childMOfn.every((layer) => layer);

    return !mOfn || !res;
};

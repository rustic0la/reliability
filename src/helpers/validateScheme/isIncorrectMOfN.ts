export const isIncorrectMOfN = (graph: any, childLayers: any) => {
  const reMOfn = /^\d+\/\d+$/;
  const mOfn = graph
    .filter((cell: any) => cell.style === 'mOfn')
    .every((cell: any) => reMOfn.test(cell.value));

  const childMOfn =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch: any) => ch.scheme)
          .map((layer: any) =>
            layer
              .filter((cell: any) => cell.style === 'mOfn')
              .every((cell: any) => reMOfn.test(cell.value)),
          )
      : true;

  const res =
    childMOfn === true ? childMOfn : childMOfn.every((layer: any) => layer);

  return !mOfn || !res;
};

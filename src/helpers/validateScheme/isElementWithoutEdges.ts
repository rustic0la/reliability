export const isElementWithoutEdges = (graph: any, childLayers: any) => {
  const graphVertexes = graph
    .filter(
      (cell: any) =>
        cell.vertex && cell.style !== 'input' && cell.style !== 'output',
    )
    .every(
      (cell: any) => cell.hasOwnProperty('edges') && cell.edges.length >= 2,
    );

  const childVertexes =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch: any) => ch.scheme)
          .map((layer: any) =>
            layer
              .filter(
                (cell: any) =>
                  cell.vertex &&
                  cell.style !== 'input' &&
                  cell.style !== 'output',
              )
              .every(
                (cell: any) =>
                  cell.hasOwnProperty('edges') && cell.edges.length >= 2,
              ),
          )
      : true;

  const res =
    childVertexes === true
      ? childVertexes
      : childVertexes.every((layer: any) => layer);

  return !graphVertexes || !res;
};

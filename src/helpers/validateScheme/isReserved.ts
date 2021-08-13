import { mxCell } from 'mxgraph';

export const isReserved = (graph: mxCell[], childLayers: any) => {
    const main = graph.filter(cell => cell.style === 'loaded').length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch: any) => ch.scheme)
                  .map(
                      (layer: any) =>
                          layer.filter((cell: any) => cell.style === 'loaded')
                              .length > 0,
                  )
            : false;

    return main || children;
};

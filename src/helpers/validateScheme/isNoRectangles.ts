import { mxCell } from 'mxgraph';

export const isNoRectangles = (graph: mxCell[], childLayers: any) => {
    const main = graph.filter((v) => v.style === 'rectangle').length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch: any) => ch.scheme)
                  .map(
                      (layer: any) =>
                          layer.filter(
                              (cell: any) => cell.style === 'rectangle',
                          ).length > 0,
                  )
            : true;

    const res =
        children === true ? children : children.every((layer: any) => layer);

    return !main || !res;
};

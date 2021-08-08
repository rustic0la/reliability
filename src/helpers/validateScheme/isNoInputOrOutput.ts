import { mxCell } from 'mxgraph';

export const isNoInputOrOutput = (graph: mxCell[], childLayers: any) => {
    const main =
        graph.filter((cell) => cell.style === 'input').length === 1 &&
        graph.filter((cell) => cell.style === 'output').length === 1;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch: any) => ch.scheme)
                  .map(
                      (layer: any) =>
                          layer.filter((cell: any) => cell.style === 'input')
                              .length === 1 &&
                          layer.filter((cell: any) => cell.style === 'output')
                              .length === 1,
                  )
            : true;

    const res =
        children === true ? children : children.every((layer: any) => layer);
    return !main || !res;
};

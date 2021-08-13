import { mxCell } from 'mxgraph';

export const isSwitcher = (graph: mxCell[], childLayers: any) => {
    const main = graph.filter(cell => cell.style === 'switcher').length > 0;

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch: any) => ch.scheme)
                  .map(
                      (layer: any) =>
                          layer.filter((cell: any) => cell.style === 'switcher')
                              .length > 0,
                  )
            : false;

    const res =
        children === false ? children : children.every((layer: any) => layer);

    return main || res;
};

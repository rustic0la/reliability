import { isReservedWithSwitcher } from '../../defineSchemeType';

export const isSwitcherSchemeCorrect = (graph, childLayers) => {
    const main = isReservedWithSwitcher(graph);

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch) => ch.scheme)
                  .map((layer) => isReservedWithSwitcher(layer))
            : true;

    const res = children === true ? children : children.every((layer) => layer);

    return !main || !res;
};

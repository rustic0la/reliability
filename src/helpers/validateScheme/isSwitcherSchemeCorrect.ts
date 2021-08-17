import { mxCell } from 'mxgraph';
import { isReservedWithSwitcher } from '../defineSchemeType';

export const isSwitcherSchemeCorrect = (graph: mxCell[], childLayers: any) => {
  const main = isReservedWithSwitcher(graph);

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch: any) => ch.scheme)
          .map((layer: any) => isReservedWithSwitcher(layer))
      : true;

  const res =
    children === true ? children : children.every((layer: any) => layer);

  return !main || !res;
};

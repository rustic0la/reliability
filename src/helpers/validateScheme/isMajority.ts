import { mxCell } from 'mxgraph';
import { isTwoMajorities, isMajority } from '../defineSchemeType';

export const checkIsMajority = (graph: mxCell[], childLayers: any) => {
  const inputId =
    graph.find((node) => node.style === 'input') &&
    graph.find((node) => node.style === 'input')?.id;
  const outputId =
    graph.find((node) => node.style === 'output') &&
    graph.find((node) => node.style === 'output')?.id;
  const main =
    isMajority(graph, inputId, outputId) ||
    isTwoMajorities(graph, inputId, outputId);

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch: any) => ch.scheme)
          .map((layer: any) => {
            const inputId =
              layer.find((node: any) => node.style === 'input') &&
              layer.find((node: any) => node.style === 'input').id;
            const outputId =
              layer.find((node: any) => node.style === 'output') &&
              layer.find((node: any) => node.style === 'output').id;
            return (
              isMajority(layer, inputId, outputId) ||
              isTwoMajorities(layer, inputId, outputId)
            );
          })
      : false;

  const res =
    children === false ? children : children.every((layer: any) => layer);

  return main || res;
};

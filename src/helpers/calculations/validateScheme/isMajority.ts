import { isTwoMajorities, isMajority } from '../../defineSchemeType';

export const checkIsMajority = (graph, childLayers) => {
    const inputId =
        graph.find((node) => node.style === 'input') &&
        graph.find((node) => node.style === 'input').id;
    const outputId =
        graph.find((node) => node.style === 'output') &&
        graph.find((node) => node.style === 'output').id;
    const main =
        isMajority(graph, inputId, outputId) ||
        isTwoMajorities(graph, inputId, outputId);

    const children =
        childLayers && childLayers.length > 0
            ? childLayers
                  .map((ch) => ch.scheme)
                  .map((layer) => {
                      const inputId =
                          layer.find((node) => node.style === 'input') &&
                          layer.find((node) => node.style === 'input').id;
                      const outputId =
                          layer.find((node) => node.style === 'output') &&
                          layer.find((node) => node.style === 'output').id;
                      return (
                          isMajority(layer, inputId, outputId) ||
                          isTwoMajorities(layer, inputId, outputId)
                      );
                  })
            : false;

    const res =
        children === false ? children : children.every((layer) => layer);

    return main || res;
};

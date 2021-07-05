import {
  checkReservedWithSwitcher,
  checkMajority,
  checkTwoMajorities,
} from "./types";

export const isEmptyGraph = (graph) => graph.length === 0;

export const isNoRectangles = (graph, childLayers) => {
  const main = graph.filter((v) => v.style === "rectangle").length > 0;

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map(
            (layer) =>
              layer.filter((cell) => cell.style === "rectangle").length > 0
          )
      : true;

  const res = children === true ? children : children.every((layer) => layer);

  return !main || !res;
};

export const isSchemeIsReserved = (graph, childLayers) => {
  const main = graph.filter((cell) => cell.style === "loaded").length > 0;

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map(
            (layer) =>
              layer.filter((cell) => cell.style === "loaded").length > 0
          )
      : false;

  const res = children;

  return main || res;
};

export const checkIsSwitcher = (graph, childLayers) => {
  const main = graph.filter((cell) => cell.style === "switcher").length > 0;

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map(
            (layer) =>
              layer.filter((cell) => cell.style === "switcher").length > 0
          )
      : false;

  const res = children === false ? children : children.every((layer) => layer);

  return main || res;
};

export const checkIsMajority = (graph, childLayers) => {
  const inputId =
    graph.find((node) => node.style === "input") &&
    graph.find((node) => node.style === "input").id;
  const outputId =
    graph.find((node) => node.style === "output") &&
    graph.find((node) => node.style === "output").id;
  const main =
    checkMajority(graph, inputId, outputId) ||
    checkTwoMajorities(graph, inputId, outputId);

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map((layer) => {
            const inputId =
              layer.find((node) => node.style === "input") &&
              layer.find((node) => node.style === "input").id;
            const outputId =
              layer.find((node) => node.style === "output") &&
              layer.find((node) => node.style === "output").id;
            return (
              checkMajority(layer, inputId, outputId) ||
              checkTwoMajorities(layer, inputId, outputId)
            );
          })
      : false;

  const res = children === false ? children : children.every((layer) => layer);

  return main || res;
};

export const checkIsSwitcherSchemeCorrect = (graph, childLayers) => {
  const main = checkReservedWithSwitcher(graph);

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map((layer) => checkReservedWithSwitcher(layer))
      : true;

  const res = children === true ? children : children.every((layer) => layer);

  return !main || !res;
};

export const isIncorrectMOfN = (graph, childLayers) => {
  const reMOfn = /^\d+\/\d+$/;
  const mOfn = graph
    .filter((cell) => cell.style === "mOfn")
    .every((cell) => reMOfn.test(cell.value));

  const childMOfn =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map((layer) =>
            layer
              .filter((cell) => cell.style === "mOfn")
              .every((cell) => reMOfn.test(cell.value))
          )
      : true;

  const res =
    childMOfn === true ? childMOfn : childMOfn.every((layer) => layer);

  return !mOfn || !res;
};

export const isNoInputOrOutput = (graph, childLayers) => {
  const main =
    graph.filter((cell) => cell.style === "input").length === 1 &&
    graph.filter((cell) => cell.style === "output").length === 1;

  const children =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map(
            (layer) =>
              layer.filter((cell) => cell.style === "input").length === 1 &&
              layer.filter((cell) => cell.style === "output").length === 1
          )
      : true;

  const res = children === true ? children : children.every((layer) => layer);
  return !main || !res;
};

export const isElementWithoutEdges = (graph, childLayers) => {
  const graphVertexes = graph
    .filter(
      (cell) => cell.vertex && cell.style !== "input" && cell.style !== "output"
    )
    .every((cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2);

  const childVertexes =
    childLayers && childLayers.length > 0
      ? childLayers
          .map((ch) => ch.scheme)
          .map((layer) =>
            layer
              .filter(
                (cell) =>
                  cell.vertex &&
                  cell.style !== "input" &&
                  cell.style !== "output"
              )
              .every(
                (cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2
              )
          )
      : true;

  const res =
    childVertexes === true
      ? childVertexes
      : childVertexes.every((layer) => layer);

  return !graphVertexes || !res;
};

import { mxCell } from 'mxgraph';

export const getVertexes = (graphNodes: mxCell[]): mxCell[] =>
  graphNodes.filter(
    (v) => v.vertex && v.style !== 'input' && v.style !== 'output',
  );

export const isEdgeConnectedToInAndOut = (
  vertexId: string,
  edge: mxCell,
  inputId: string,
  outputId: string,
): boolean => {
  const { target, source } = edge;
  return (
    ((source.id === inputId || source.id === outputId) &&
      target.id === vertexId) ||
    ((target.id === inputId || target.id === outputId) &&
      source.id === vertexId)
  );
};

export const isEdgeConnectedToRect = (
  vertexId: string,
  edge: mxCell,
): boolean => {
  const { target, source } = edge;
  return (
    (target.id === vertexId && source.style === 'rectangle') ||
    (source.id === vertexId && target.style === 'rectangle')
  );
};

export const isEdgeConnectedToIn = (
  vertexId: string,
  edge: mxCell,
  inputId: string,
): boolean => {
  const { target, source } = edge;
  return (
    (source.id === vertexId && target.id === inputId) ||
    (target.id === vertexId && source.id === inputId)
  );
};

export const isEdgeConnectedToOut = (
  vertexId: string,
  edge: mxCell,
  outputId: string,
): boolean => {
  const { target, source } = edge;
  return (
    (source.id === vertexId && target.id === outputId) ||
    (target.id === vertexId && source.id === outputId)
  );
};

export const isEdgeConnectedTo = (edge: mxCell, nodeType: string): boolean => {
  const { target, source } = edge;
  return target.style === nodeType || source.style === nodeType;
};

export const getInputId = (graph: mxCell[]): string => {
  return (
    (graph.find((node) => node.style === 'input') &&
      graph.find((node) => node.style === 'input')?.id) ||
    ''
  );
};

export const getOutputId = (graph: mxCell[]): string => {
  return (
    (graph.find((node) => node.style === 'output') &&
      graph.find((node) => node.style === 'output')?.id) ||
    ''
  );
};

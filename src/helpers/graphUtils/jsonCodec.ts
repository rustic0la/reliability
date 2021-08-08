import mx from '../../mxgraph';
import { mxGraph, mxGraphModel, mxCell } from 'mxgraph';

class JsonCodec extends mx.mxObjectCodec {
    constructor() {
        super((value: any) => {});
    }
    decodeModel(model: mxGraphModel) {
        return Object.keys(model.cells)
            .map((iCell) => {
                const currentCell = model.getCell(iCell);
                return currentCell.value !== undefined ? currentCell : null;
            })
            .filter((item) => item === null) as mxCell[];
    }
}

export const getJsonModel = (graph: mxGraph): mxCell[] => {
    const encoder = new JsonCodec();
    return encoder.decodeModel(graph.getModel());
};

export const stringifyWithoutCircular = (json: string) => {
    const iter = (data: any) =>
        JSON.stringify(
            data,
            (key, value) => {
                if (
                    (key === 'parent' ||
                        key === 'source' ||
                        key === 'target') &&
                    value !== null
                ) {
                    return { id: value.id, style: value.style };
                } else if (
                    key === 'value' &&
                    value !== null &&
                    value.localName
                ) {
                    let results = {};
                    Object.keys(value.attributes).forEach((attrKey) => {
                        const attribute = value.attributes[attrKey];
                        // @ts-ignore
                        results[attribute.nodeName] = attribute.nodeValue;
                    });
                    return results;
                } else if (key === 'children' && value !== null) {
                    iter(value);
                }
                return value;
            },
            4,
        );
    return iter(json);
};

export const renderJSON = (dataModel: any, graph: any) => {
    let vertices = {};
    const parent = graph.getDefaultParent();
    graph.getModel().beginUpdate(); // Adds cells to the model in a single step
    try {
        dataModel &&
            // eslint-disable-next-line array-callback-return
            dataModel.map((node: any) => {
                if (node.vertex) {
                    // @ts-ignore
                    vertices[node.id] = graph.insertVertex(
                        parent,
                        null,
                        node.value,
                        node.geometry.x,
                        node.geometry.y,
                        node.geometry.width,
                        node.geometry.height,
                        node.style,
                    );
                    // @ts-ignore
                    vertices[node.id].mxObjectId = node.mxObjectId;
                } else if (node.edge) {
                    graph.insertEdge(
                        parent,
                        null,
                        null,
                        // @ts-ignore
                        vertices[node.source && node.source.id],
                        // @ts-ignore
                        vertices[node.target && node.target.id],
                        node.style,
                    );
                }
            });
    } finally {
        graph.getModel().endUpdate();
    }
};

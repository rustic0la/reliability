import { mxObjectCodec } from 'mxgraph-js';

class JsonCodec extends mxObjectCodec {
	constructor() {
		super((value) => {});
	}
	decode(model) {
		return Object.keys(model.cells)
			.map((iCell) => {
				const currentCell = model.getCell(iCell);
				return currentCell.value !== undefined ? currentCell : null;
			})
			.filter((item) => item !== null);
	}
}

export const getJsonModel = (graph) => {
	const encoder = new JsonCodec();
	const jsonModel = encoder.decode(graph.getModel());
	return jsonModel;
};

export const stringifyWithoutCircular = (json) => {
	const iter = (data) =>
		JSON.stringify(
			data,
			(key, value) => {
				if (
					(key === 'parent' || key === 'source' || key === 'target') &&
					value !== null
				) {
					return value.id;
				} else if (key === 'value' && value !== null && value.localName) {
					let results = {};
					Object.keys(value.attributes).forEach((attrKey) => {
						const attribute = value.attributes[attrKey];
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

export const renderJSON = (dataModel, graph) => {
	let vertices = {};
	const parent = graph.getDefaultParent();
	graph.getModel().beginUpdate(); // Adds cells to the model in a single step
	try {
		dataModel &&
			// eslint-disable-next-line array-callback-return
			dataModel.map((node) => {
				if (node.vertex) {
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
					vertices[node.id].mxObjectId = node.mxObjectId;
				} else if (node.edge) {
					graph.insertEdge(
						parent,
						null,
						null,
						vertices[node.source],
						vertices[node.target],
						node.style,
					);
				}
			});
	} finally {
		graph.getModel().endUpdate();
	}
};

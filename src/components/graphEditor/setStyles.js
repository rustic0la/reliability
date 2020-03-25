import {
	mxConstants,
	mxPerimeter,
	mxEdgeStyle,
	mxKeyHandler,
	mxGraphHandler,
	mxEdgeHandler,
} from 'mxgraph-js';

import inp from '../../assets/images/inp.png';
import outp from '../../assets/images/outp.png';
import loaded from '../../assets/images/loaded.png';

export const setGraphStyle = (graph, undoManager) => {
	graph.setConnectable(true);
	graph.setCellsEditable(true);
	graph.setEnabled(true);
	graph.dropEnabled = true;
	graph.centerZoom = true;
	graph.setAllowDanglingEdges(false);
	graph.gridSize = 5;
	graph.setMultigraph = false;

	mxEdgeHandler.prototype.parentHighlightEnabled = true;

	// Creates the graph inside the given container
	graph.setDropEnabled(true);

	const keyHandler = new mxKeyHandler(graph);
	keyHandler.bindKey(46, function(evt) {
		graph.removeCells();
	});

	keyHandler.bindControlKey(65, function(evt) {
		graph.selectAll();
	});

	keyHandler.bindControlKey(90, function(evt) {
		undoManager.undo();
	});

	keyHandler.bindControlKey(89, function(evt) {
		undoManager.redo();
	});

	mxGraphHandler.prototype.guidesEnabled = true;
};

export const setDefaultCellsStyle = graph => {
	//////////////////////////// EDGES STYLE
	const edgeStyle = {};
	edgeStyle[mxConstants.STYLE_STROKECOLOR] = '#000';
	edgeStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
	edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
	edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
	edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_NONE;
	edgeStyle[mxConstants.STYLE_FONTSIZE] = '16';
	edgeStyle[mxConstants.VALID_COLOR] = '#000';
	graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

	//////////////////////////// VERTEX STYLES
	const defaultStyle = {};
	defaultStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	defaultStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	defaultStyle[mxConstants.STYLE_FONTSIZE] = '16';
	defaultStyle[mxConstants.STYLE_FONTCOLOR] = '#000';
	defaultStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	defaultStyle[mxConstants.STYLE_FILLCOLOR] = '#FFF';
	defaultStyle[mxConstants.STYLE_STROKECOLOR] = '#000';
	defaultStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
	defaultStyle[mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
	defaultStyle[mxConstants.STYLE_IMAGE_WIDTH] = '48';
	defaultStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
	graph.getStylesheet().putDefaultVertexStyle(defaultStyle);
};

export const setVertexStyles = graph => {
	const rectangleStyle = {};
	rectangleStyle[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
	rectangleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
	graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);

	const mOfNStyle = {};
	mOfNStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
	mOfNStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
	graph.getStylesheet().putCellStyle('mOfn', mOfNStyle);

	const jointStyle = {};
	jointStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
	jointStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
	jointStyle[mxConstants.STYLE_FILLCOLOR] = '#000';
	graph.getStylesheet().putCellStyle('joint', jointStyle);

	const inputStyle = {};
	inputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
	inputStyle[mxConstants.STYLE_IMAGE] = inp;
	inputStyle[mxConstants.STYLE_EDITABLE] = 0;
	graph.getStylesheet().putCellStyle('input', inputStyle);

	const outputStyle = {};
	outputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
	outputStyle[mxConstants.STYLE_IMAGE] = outp;
	outputStyle[mxConstants.STYLE_EDITABLE] = 0;
	graph.getStylesheet().putCellStyle('output', outputStyle);

	const loadedStyle = {};
	loadedStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
	loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
	loadedStyle[mxConstants.STYLE_FONTSIZE] = '13';
	graph.getStylesheet().putCellStyle('loaded', loadedStyle);
	////////////////////////////////////////////////

	const columnStyle = {};
	columnStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
	columnStyle[mxConstants.STYLE_STROKECOLOR] = 'none';
	columnStyle[mxConstants.STYLE_FILLCOLOR] = 'none';
	columnStyle[mxConstants.STYLE_FOLDABLE] = false;
	graph.getStylesheet().putCellStyle('column', columnStyle);
};

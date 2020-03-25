import {
	setGraphStyle,
	setVertexStyles,
	setDefaultCellsStyle,
} from './setStyles';
import {
	mxGraph,
	mxEvent,
	mxEdgeHandler,
	mxConstants,
	mxUndoManager,
} from 'mxgraph-js';
import executeLayout from './layout';
import createPopupMenu from './createPopupMenu';
import addVertex from './addVertex';
import addToolbarButton from './addToolbar';
import undo from '../../assets/images/undo.png';
import redo from '../../assets/images/redo.png';
import zoom_in from '../../assets/images/zoomin.png';
import zoom_out from '../../assets/images/zoomout.png';
import del from '../../assets/images/delete.png';
import actual from '../../assets/images/actual.png';
import rectangle from '../../assets/images/rectangle.png';
import output from '../../assets/images/output.png';
import mOfn from '../../assets/images/mofn.png';
import input from '../../assets/images/input.png';
import loaded from '../../assets/images/loaded.png';
import joint from '../../assets/images/joint.png';

const setBaseConfig = (graph, tbContainer, sidebar, layout) => {
	const undoManager = new mxUndoManager();
	const listener = function(sender, evt) {
		undoManager.undoableEditHappened(evt.getProperty('edit'));
	};
	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);

	setGraphStyle(graph, undoManager);

	addToolbarButton(null, graph, tbContainer, 'delete', del);
	addToolbarButton(null, graph, tbContainer, 'zoomIn', zoom_in);
	addToolbarButton(null, graph, tbContainer, 'zoomOut', zoom_out);
	addToolbarButton(null, graph, tbContainer, 'zoomActual', actual);
	addToolbarButton(undoManager, graph, tbContainer, 'undo', undo);
	addToolbarButton(undoManager, graph, tbContainer, 'redo', redo);

	setDefaultCellsStyle(graph);
	setVertexStyles(graph);

	addVertex(graph, sidebar, rectangle, 60, 42, 'rectangle', 'rectangle');
	addVertex(graph, sidebar, joint, 10, 10, 'joint', 'joint');
	addVertex(graph, sidebar, mOfn, 45, 45, 'mOfn', 'mOfn');
	addVertex(graph, sidebar, input, 35, 35, 'input');
	addVertex(graph, sidebar, output, 35, 35, 'output');
	addVertex(graph, sidebar, loaded, 80, 56, 'loaded', 'loaded');

	mxConstants.ENTITY_SEGMENT = 20;

	graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
		if (cell.style === 'rectangle') {
			return createPopupMenu(graph, menu, cell, evt);
		}
	};

	/////////////////////////////////////////////////////
	const edgeHandleConnect = mxEdgeHandler.prototype.connect;
	mxEdgeHandler.prototype.connect = function(
		edge,
		terminal,
		isSource,
		isClone,
		me,
	) {
		edgeHandleConnect.apply(this, arguments);
		executeLayout(graph, layout);
	};

	graph.resizeCell = function() {
		mxGraph.prototype.resizeCell.apply(this, arguments);
		executeLayout(graph, layout);
	};

	graph.connectionHandler.addListener(mxEvent.CONNECT, function() {
		executeLayout(graph, layout);
	});
};

export default setBaseConfig;

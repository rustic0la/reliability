import {
	mxEvent,
	mxWindow,
	mxGraph,
	mxUndoManager,
	mxToolbar,
} from 'mxgraph-js';

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
import addVertex from './addVertex';
import {
	setDefaultCellsStyle,
	setVertexStyles,
	setGraphStyle,
} from './setStyles';
import addToolbarButton from './addToolbar';

const showModalWindow = (graph, title, content, width, height, cell) => {
	var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
	var y = Math.max(
		10,
		document.body.scrollHeight || document.documentElement.scrollHeight,
	);

	var wnd = new mxWindow(title, content, x, y, width, height, false, true);
	wnd.setClosable(true);

	console.log(cell.id);

	//TODO: optimize - add funct
	const tbCont = document.createElement('div');
	tbCont.className = 'tbContainer';
	tbCont.id = 'tbCont';
	document.getElementById('graphContainer').appendChild(tbCont);

	const sdbar = document.createElement('div');
	sdbar.className = 'sbContainer';
	sdbar.id = 'sdbar';
	document.getElementById('graphContainer').appendChild(sdbar);
	const sdb = new mxToolbar(sdbar);

	const gr = new mxGraph(content);
	const undoManager = new mxUndoManager();
	const listener = function(sender, evt) {
		undoManager.undoableEditHappened(evt.getProperty('edit'));
	};
	gr.getModel().addListener(mxEvent.UNDO, listener);
	gr.getView().addListener(mxEvent.UNDO, listener);

	setGraphStyle(gr, undoManager);

	addToolbarButton(null, gr, tbCont, 'delete', del);
	addToolbarButton(null, gr, tbCont, 'zoomIn', zoom_in);
	addToolbarButton(null, gr, tbCont, 'zoomOut', zoom_out);
	addToolbarButton(null, gr, tbCont, 'zoomActual', actual);
	addToolbarButton(undoManager, gr, tbCont, 'undo', undo);
	addToolbarButton(undoManager, gr, tbCont, 'redo', redo);

	setDefaultCellsStyle(gr);
	setVertexStyles(gr);

	addVertex(gr, sdb, rectangle, 60, 42, 'rectangle', 'rectangle');
	addVertex(gr, sdb, joint, 10, 10, 'joint', 'joint');
	addVertex(gr, sdb, mOfn, 45, 45, 'mOfn', 'mOfn');
	addVertex(gr, sdb, input, 35, 35, 'input');
	addVertex(gr, sdb, output, 35, 35, 'output');
	addVertex(gr, sdb, loaded, 80, 56, 'loaded', 'loaded');

	// Fades the background out after after the window has been closed
	wnd.addListener(mxEvent.DESTROY, function(evt) {
		const parent = document.getElementById('graphContainer');
		const tb = document.getElementById('tbCont');
		const sb = document.getElementById('sdbar');
		parent.removeChild(tb);
		parent.removeChild(sb);
		graph.setEnabled(true);
	});

	graph.setEnabled(false);
	graph.tooltipHandler.hide();
	wnd.setVisible(true);
};

export default showModalWindow;

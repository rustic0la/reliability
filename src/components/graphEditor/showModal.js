import {
	mxEvent,
	mxWindow,
	mxGraph,
	mxToolbar,
	mxHierarchicalLayout,
	mxConstants,
} from 'mxgraph-js';

import setBaseConfig from './setBaseConfig';

const showModalWindow = (graph, title, content, width, height, cell) => {
	var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
	var y = Math.max(
		10,
		document.body.scrollHeight || document.documentElement.scrollHeight,
	);

	var wnd = new mxWindow(title, content, x, y, width, height, false, true);
	wnd.setClosable(true);

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

	const layout = new mxHierarchicalLayout(gr, mxConstants.DIRECTION_WEST);

	setBaseConfig(gr, tbCont, sdb, layout);

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

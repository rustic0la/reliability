import {
	mxEvent,
	mxWindow,
	mxGraph,
	mxToolbar,
	mxHierarchicalLayout,
	mxConstants,
} from 'mxgraph-js';

import setBaseConfig from './setBaseConfig';
import {
	getJsonModel,
	stringifyWithoutCircular,
	renderJSON,
} from './jsonCodec';
import { findNodeByPropAndItsValue } from '../math/utils';
import executeLayout from './layout';

const showModalWindow = (graph, title, content, width, height, cell) => {
	const id = cell.mxObjectId;

	var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
	var y = Math.max(
		10,
		document.body.scrollHeight || document.documentElement.scrollHeight,
	);

	var wnd = new mxWindow(title, content, x, y, width, height, false, true);
	wnd.setClosable(true);

	const tbCont = document.createElement('div');
	tbCont.className = 'tbContainer';
	tbCont.id = `tbCont${id}`;
	document.getElementById('graphContainer').appendChild(tbCont);

	const sdbar = document.createElement('div');
	sdbar.className = 'sbContainer';
	sdbar.id = `sdbar${id}`;
	document.getElementById('graphContainer').appendChild(sdbar);

	const sdb = new mxToolbar(sdbar);
	const gr = new mxGraph(content);

	const layout = new mxHierarchicalLayout(gr, mxConstants.DIRECTION_WEST);
	setBaseConfig(gr, tbCont, sdb, layout);

	if (localStorage.getItem(`id ${id}`) !== '') {
		renderJSON(JSON.parse(localStorage.getItem(`id ${id}`)), gr);
		executeLayout(gr, layout);
	}

	wnd.addListener(mxEvent.DESTROY, function (evt) {
		const currentChildren = getJsonModel(gr);
		const jsonStr = stringifyWithoutCircular(currentChildren);
		localStorage.setItem(`id ${id}`, jsonStr);

		const parent = document.getElementById('graphContainer');
		const tb = document.getElementById(`tbCont${id}`);
		const sb = document.getElementById(`sdbar${id}`);
		parent.removeChild(tb);
		parent.removeChild(sb);
		graph.setEnabled(true);
	});

	graph.setEnabled(false);
	graph.tooltipHandler.hide();
	wnd.setVisible(true);
};

export default showModalWindow;

import {
	mxEvent,
	mxWindow,
	mxGraph,
	mxToolbar,
	mxCodec,
} from 'mxgraph-js';

import setBaseConfig from './setGraphConfig';
import {
	getJsonModel,
	stringifyWithoutCircular,
	renderJSON,
} from './jsonCodec';

const childCellModal = (graph, title, content, width, height, cell) => {
	
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
	const gr = new mxGraph(content, );

	setBaseConfig(gr, tbCont, sdb);
	if (cell.child && cell.child.length > 0) {
		gr.addCells(cell.child, cell)
	}
	/*
	if (localStorage.getItem(`${id}`) !== '') {
		renderJSON(JSON.parse(localStorage.getItem(`${id}`)), gr);
	}*/

	wnd.addListener(mxEvent.DESTROY, (evt) => {
		const currentChildren = getJsonModel(gr);
		if (currentChildren.length > 0) {
			cell.setValue('*');
			cell.child = currentChildren;
            console.log("cell", cell)
			
			const jsonStr = stringifyWithoutCircular(currentChildren);
			localStorage.setItem(`${id}`, jsonStr);
		}

		const enc = new mxCodec();
		const node = enc.encode(gr.getModel());
        console.log("node", node)

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

export default childCellModal;

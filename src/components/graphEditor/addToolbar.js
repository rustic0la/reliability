import { mxEvent, mxUtils } from 'mxgraph-js';

const addToolbarButton = (
	undoManager,
	graph,
	toolbar,
	action,
	image,
	label = '',
) => {
	const button = document.createElement('button');
	button.style.fontSize = '10';
	button.style.marginRight = '5px';
	if (image !== null) {
		const img = document.createElement('img');
		img.setAttribute('src', image);
		img.style.width = '16px';
		img.style.height = '16px';
		img.style.verticalAlign = 'middle';
		img.style.marginRight = '2px';
		button.appendChild(img);
	}
	mxEvent.addListener(button, 'click', function() {
		switch (action) {
			case 'delete':
				graph.removeCells();
				break;
			case 'zoomIn':
				graph.zoomIn();
				break;
			case 'zoomOut':
				graph.zoomOut();
				break;
			case 'zoomActual':
				graph.zoomActual();
				break;
			case 'undo':
				undoManager.undo();
				break;
			case 'redo':
				undoManager.redo();
				break;
			default:
				break;
		}
	});
	mxUtils.write(button, label);
	toolbar.appendChild(button);
};

export default addToolbarButton;

import { mxEvent } from 'mxgraph-js';
import showModalWindow from './showModal';

const createPopupMenu = (graph, menu, cell, evt) => {
	if (cell) {
		if (cell.edge === true) {
			menu.addItem('Delete connection', null, function() {
				graph.removeCells([cell]);
				mxEvent.consume(evt);
			});
		} else {
			menu.addItem('Edit child node', null, function() {
				if (
					graph.isEnabled() &&
					!mxEvent.isConsumed(evt) &&
					cell != null &&
					graph.isCellEditable(cell)
				) {
					if (graph.model.isEdge(cell)) {
						graph.startEditingAtCell(cell);
					} else {
						const modalCont = document.createElement('div');
						modalCont.id = 'modal';
						modalCont.className = 'modalCont';

						showModalWindow(
							graph,
							`Child nodes of Cell ${cell.getId()}`,
							modalCont,
							400,
							300,
							cell,
						);
					}
				}
			});
			menu.addItem('Delete child node', null, function() {
				graph.removeCells([cell]);
				mxEvent.consume(evt);
			});
		}
	}
};

export default createPopupMenu;

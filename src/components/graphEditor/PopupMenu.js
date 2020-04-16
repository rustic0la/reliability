import { mxEvent } from 'mxgraph-js';
import showModalWindow from './childCellModal';

const createPopupMenu = (graph, menu, cell, evt) => {
	if (cell) {
		if (cell.edge === true) {
			graph.setCellsEditable(true);
			menu.addItem('Delete connection', null, () => {
				graph.removeCells([cell]);
				mxEvent.consume(evt);
			});
		} else {
			menu.addItem('Edit child node', null, () => {
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
							`Child nodes of ${cell.mxObjectId}`,
							modalCont,
							400,
							300,
							cell,
						);
					}
				}
			});
			menu.addItem('Delete child node', null, () => {
				graph.removeCells([cell]);
				mxEvent.consume(evt);
			});
		}
	}
};

export default createPopupMenu;

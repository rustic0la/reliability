import childCellModal from './childCellModal';
import mx from '../../mxgraph';
import { mxCell, mxGraph, mxMouseEvent, mxPopupMenu } from 'mxgraph';

const CreatePopupMenu = (
  graph: mxGraph,
  menu: mxPopupMenu,
  cell: mxCell,
  evt: mxMouseEvent,
) => {
  if (cell && (cell.style === 'rectangle' || cell.style === 'loaded')) {
    if (cell.style === 'rectangle') {
      if (cell.edge) {
        graph.setCellsEditable(true);
        menu.addItem('Удалить соединение', undefined, () => {
          graph.removeCells([cell]);
          mx.mxEvent.consume(evt as unknown as Event);
        });
      } else {
        menu.addItem('Добавить/изменить дочерний компонент', undefined, () => {
          if (
            graph.isEnabled() &&
            !mx.mxEvent.isConsumed(evt) &&
            cell != null &&
            graph.isCellEditable(cell)
          ) {
            if (graph.model.isEdge(cell)) {
              graph.startEditingAtCell(cell);
            } else {
              const modalCont = document.createElement('div');
              modalCont.id = 'modal';
              modalCont.className = 'modalCont';

              childCellModal(
                graph,
                `Дочерние компоненты блока ${cell.mxObjectId}`,
                modalCont,
                cell,
              );
            }
          }
        });
        menu.addItem('Удалить блок', undefined, () => {
          graph.removeCells([cell]);
          mx.mxEvent.consume(evt as unknown as Event);
        });
      }
    }
  }
};

export default CreatePopupMenu;

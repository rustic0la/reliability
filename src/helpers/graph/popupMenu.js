import { mxEvent } from "mxgraph-js";
import showModalWindow from "./childCellModal";

const createPopupMenu = (graph, menu, cell, evt) => {
  if (cell && ((cell.style === "rectangle") || cell.style === "loaded")) {
    if (cell.style === "rectangle") {
      if (cell.edge === true) {
        graph.setCellsEditable(true);
        menu.addItem("Удалить соединение", null, () => {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      } else {
        menu.addItem("Добавить дочерний компонент", null, () => {
          if (
            graph.isEnabled() &&
            !mxEvent.isConsumed(evt) &&
            cell != null &&
            graph.isCellEditable(cell)
          ) {
            if (graph.model.isEdge(cell)) {
              graph.startEditingAtCell(cell);
            } else {
              const modalCont = document.createElement("div");
              modalCont.id = "modal";
              modalCont.className = "modalCont";

              showModalWindow(
                graph,
                `Дочерние компоненты блока ${cell.mxObjectId}`,
                modalCont,
                400,
                300,
                cell
              );
            }
          }
        });
        menu.addItem("Удалить блок", null, () => {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      }
    }
  }
};

export default createPopupMenu;

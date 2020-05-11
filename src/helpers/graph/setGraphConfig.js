import {
  setVertexStyles,
  setDefaultCellsStyle,
} from "./setStyles";

import {
  mxEvent,
  mxUndoManager,
  mxKeyHandler,
  mxGraphHandler,
  mxEdgeHandler,
  mxConnectionConstraint,
  mxPoint,
  mxConnectionHandler,
  mxUtils,
  mxConstraintHandler,
  mxRubberband,
} from "mxgraph-js";

import createPopupMenu from "./popupMenu";
import addVertex from "./addVertex";
import addToolbarButton from "./addToolbar";
import undo from "../../assets/images/undo.png";
import redo from "../../assets/images/redo.png";
import zoom_in from "../../assets/images/zoomin.png";
import zoom_out from "../../assets/images/zoomout.png";
import del from "../../assets/images/delete.png";
import actual from "../../assets/images/actual.png";
import rectangle from "../../assets/images/rectangle.png";
import output from "../../assets/images/output.png";
import mOfn from "../../assets/images/mofn.png";
import input from "../../assets/images/input.png";
import loaded from "../../assets/images/loaded.png";
import joint from "../../assets/images/joint.png";
import toggle from "../../assets/images/toggle.png";
import copy from '../../assets/images/copy.png';
import paste from '../../assets/images/paste.png';
import vertical from "../../assets/images/vertical.png";
import horizontal from "../../assets/images/horizontal.png";

const setGraphConfig = (graph, tbContainer, sidebar, setGraphNodes) => {
  const undoManager = new mxUndoManager(); // реализация функций undo, redo
  const listener = (sender, evt) => {
    undoManager.undoableEditHappened(evt.getProperty("edit"));
  };
  graph.getModel().addListener(mxEvent.UNDO, listener);
  graph.getView().addListener(mxEvent.UNDO, listener);

  graph.setConnectable(true);
  graph.setCellsEditable(true);
  graph.setEnabled(true);
  graph.dropEnabled = true;
  graph.centerZoom = true;
  graph.setAllowDanglingEdges(false);
  graph.gridEnabled = true;
  graph.gridSize = 30;
  graph.setMultigraph = true;
  graph.setDropEnabled(true);
  graph.setTooltips(true);
  graph.autoSizeCells = true;

  graph.getTooltip = (state) => {
    const cell = state.cell;
    return cell.mxObjectId;
  };

  graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
    return createPopupMenu(graph, menu, cell, evt, setGraphNodes);
  };

  new mxRubberband(graph);

  mxEdgeHandler.prototype.parentHighlightEnabled = true;

  mxConstraintHandler.prototype.intersects = function (
    icon,
    point,
    source,
    existingEdge
  ) {
    return !source || existingEdge || mxUtils.intersects(icon.bounds, point);
  };

  const mxConnectionHandlerUpdateEdgeState =
    mxConnectionHandler.prototype.updateEdgeState;
  mxConnectionHandler.prototype.updateEdgeState =  function (pt, constraint) {
    if (pt != null && this.previous != null) {
      const constraints = this.graph.getAllConnectionConstraints(this.previous);
      const nearestConstraint = null;
      const dist = null;

      for (let i = 0; i < constraints.length; i++) {
        const cp = this.graph.getConnectionPoint(this.previous, constraints[i]);

        if (cp != null) {
          const tmp =
            (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);

          if (dist == null || tmp < dist) {
            nearestConstraint = constraints[i];
            dist = tmp;
          }
        }
      }

      if (nearestConstraint != null) {
        this.sourceConstraint = nearestConstraint;
      }
    }

    mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
  };

  if (graph.connectionHandler.connectImage == null) {
    graph.connectionHandler.isConnectableCell = function (cell) {
      return false;
    };
    mxEdgeHandler.prototype.isConnectableCell = function (cell) {
      return graph.connectionHandler.isConnectableCell(cell);
    };
  }

  graph.getAllConnectionConstraints = function (terminal) {
    if (terminal != null && this.model.isVertex(terminal.cell)) {
      return [
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      ];
	}
  };
  
  // обработка нажатий на клавиатуре
  const keyHandler = new mxKeyHandler(graph);
  keyHandler.bindKey(46, (evt) => {
    graph.removeCells();
  });

  keyHandler.bindControlKey(65, (evt) => {
    graph.selectAll();
  });

  keyHandler.bindControlKey(90, (evt) => {
    undoManager.undo();
  });

  keyHandler.bindControlKey(89, (evt) => {
    undoManager.redo();
  });

  mxGraphHandler.prototype.guidesEnabled = true;

  // добавление кнопок на тулбар
  addToolbarButton(null, graph, tbContainer, "delete", del);
  addToolbarButton(null, graph, tbContainer, "zoomIn", zoom_in);
  addToolbarButton(null, graph, tbContainer, "zoomOut", zoom_out);
  addToolbarButton(null, graph, tbContainer, "zoomActual", actual);
  addToolbarButton(undoManager, graph, tbContainer, "undo", undo);
  addToolbarButton(undoManager, graph, tbContainer, "redo", redo);
  addToolbarButton(null, graph, tbContainer, "copy", copy);
  addToolbarButton(null, graph, tbContainer, "paste", paste);
  addToolbarButton(null, graph, tbContainer, "vertical", vertical);
  addToolbarButton(null, graph, tbContainer, "horizontal", horizontal);

  setDefaultCellsStyle(graph); // дефолтные стили вершин и ребер
  setVertexStyles(graph); // стили блоков

  // добавление блоков на сайдбар
  addVertex(graph, sidebar, rectangle, 55, 40, "rectangle", "rectangle");
  addVertex(graph, sidebar, joint, 15, 15, "node", "node");
  addVertex(graph, sidebar, toggle, 40, 40, "toggle");
  addVertex(graph, sidebar, mOfn, 35, 35, "mOfn", "mOfn");
  addVertex(graph, sidebar, input, 30, 30, "input");
  addVertex(graph, sidebar, output, 30, 30, "output");
  addVertex(graph, sidebar, loaded, 55, 42, "loaded", "loaded");
};

export default setGraphConfig;

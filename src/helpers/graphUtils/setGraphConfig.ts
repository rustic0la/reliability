import { setVertexStyles, setDefaultCellsStyle } from './setStyles';
import mx from '../../mxgraph';

import createPopupMenu from './popupMenu';
import addVertex from './addVertex';
import addToolbarButton from './addToolbar';
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
import switcher from '../../assets/images/switcher.png';
import copy from '../../assets/images/copy.png';
import paste from '../../assets/images/paste.png';
import vertical from '../../assets/images/vertical.png';
import horizontal from '../../assets/images/horizontal.png';

const setGraphConfig = (
    graph: any,
    tbContainer: any,
    sidebar: any,
    setGraphNodes: any,
) => {
    const undoManager = new mx.mxUndoManager();
    const listener = (sender: any, evt: any) => {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mx.mxEvent.UNDO, listener);
    graph.getView().addListener(mx.mxEvent.UNDO, listener);

    /** свойства графа */
    graph.setConnectable(true);
    graph.setCellsEditable(true);
    graph.setEnabled(true);
    graph.dropEnabled = true;
    graph.centerZoom = true;
    graph.setAllowDanglingEdges(false);
    graph.gridEnabled = true;
    graph.gridSize = 10;
    graph.setMultigraph = true;
    graph.setDropEnabled(true);
    graph.setTooltips(true);

    graph.getTooltip = (state: any) => {
        const cell = state.cell;
        return cell.mxObjectId;
    };

    graph.popupMenuHandler.factoryMethod = function (
        menu: any,
        cell: any,
        evt: any,
    ) {
        return createPopupMenu(graph, menu, cell, evt, setGraphNodes);
    };

    /** выделение */
    new mx.mxRubberband(graph);

    mx.mxEdgeHandler.prototype.parentHighlightEnabled = true;

    /** модификация способа соединения элементов */
    // @ts-ignore
    mx.mxConstraintHandler.prototype.intersects = function (
        icon,
        point,
        source,
        existingEdge,
    ) {
        return (
            !source || existingEdge || mx.mxUtils.intersects(icon.bounds, point)
        );
    };

    const mxConnectionHandlerUpdateEdgeState =
        mx.mxConnectionHandler.prototype.updateEdgeState;
    mx.mxConnectionHandler.prototype.updateEdgeState = function (
        pt,
        constraint,
    ) {
        // @ts-ignore
        if (pt != null && this.previous != null) {
            const constraints = this.graph.getAllConnectionConstraints(
                // @ts-ignore
                this.previous,
            );
            let nearestConstraint = null;
            let dist = null;

            for (let i = 0; i < constraints.length; i++) {
                const cp = this.graph.getConnectionPoint(
                    // @ts-ignore
                    this.previous,
                    constraints[i],
                );

                if (cp != null) {
                    const tmp =
                        (cp.x - pt.x) * (cp.x - pt.x) +
                        (cp.y - pt.y) * (cp.y - pt.y);

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

        // @ts-ignore
        mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
    };

    if (graph.connectionHandler.connectImage == null) {
        graph.connectionHandler.isConnectableCell = function (cell: any) {
            return false;
        };
        mx.mxEdgeHandler.prototype.isConnectableCell = function (cell: any) {
            return graph.connectionHandler.isConnectableCell(cell);
        };
    }

    graph.getAllConnectionConstraints = function (terminal: any) {
        if (terminal != null && this.model.isVertex(terminal.cell)) {
            return [
                new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), true),
                new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.5), true),
                new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.5), true),
                new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 1), true),
            ];
        }
    };

    mx.mxGraphHandler.prototype.guidesEnabled = true;

    // добавление кнопок на тулбар
    addToolbarButton(null, graph, tbContainer, 'delete', del);
    addToolbarButton(null, graph, tbContainer, 'zoomIn', zoom_in);
    addToolbarButton(null, graph, tbContainer, 'zoomOut', zoom_out);
    addToolbarButton(null, graph, tbContainer, 'zoomActual', actual);
    addToolbarButton(undoManager, graph, tbContainer, 'undo', undo);
    addToolbarButton(undoManager, graph, tbContainer, 'redo', redo);
    addToolbarButton(null, graph, tbContainer, 'copy', copy);
    addToolbarButton(null, graph, tbContainer, 'paste', paste);
    addToolbarButton(null, graph, tbContainer, 'vertical', vertical);
    addToolbarButton(null, graph, tbContainer, 'horizontal', horizontal);

    setDefaultCellsStyle(graph); // дефолтные стили вершин и ребер
    setVertexStyles(graph); // стили блоков

    // добавление блоков на сайдбар
    addVertex(graph, sidebar, rectangle, 55, 40, 'rectangle', 'rectangle');
    addVertex(graph, sidebar, loaded, 55, 42, 'loaded', 'loaded');
    addVertex(graph, sidebar, switcher, 40, 40, 'switcher', 'switcher');
    addVertex(graph, sidebar, input, 30, 30, 'input', 'input');
    addVertex(graph, sidebar, output, 30, 30, 'output', 'input');
    addVertex(graph, sidebar, mOfn, 35, 35, 'mOfn', 'mOfn');
};

export default setGraphConfig;

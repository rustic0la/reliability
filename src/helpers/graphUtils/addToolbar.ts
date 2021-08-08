import { mxCell } from 'mxgraph';
import mx from '../../mxgraph';

const addToolbarButton = (
    undoManager: any,
    graph: any,
    toolbar: any,
    action: any,
    image: any,
    label = '',
) => {
    const button = document.createElement('button');
    button.style.fontSize = '10';
    button.style.marginRight = '10px';
    button.style.borderRadius = '18%';
    button.style.padding = '3px 8px';
    if (image !== null) {
        const img = document.createElement('img');
        img.setAttribute('src', image);
        img.style.width = '20px';
        img.style.height = '20px';
        img.style.verticalAlign = 'middle';
        img.style.marginRight = '2px';
        button.appendChild(img);
    }
    mx.mxEvent.addListener(button, 'click', () => {
        switch (action) {
            case 'delete':
                graph.removeCells();
                graph.refresh();
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
                graph.refresh();
                break;
            case 'redo':
                undoManager.redo();
                graph.refresh();
                break;
            case 'copy':
                const cells = graph.getSelectionCells();
                mx.mxClipboard.copy(graph, cells);
                break;
            case 'paste':
                mx.mxClipboard.paste(graph);
                break;
            case 'vertical':
                const alignVerticallyCells: mxCell[] =
                    graph.getSelectionCells();
                const maxWidth = Math.max(
                    // @ts-ignore
                    alignVerticallyCells.map((c) => c.geometry.width),
                );
                const x = alignVerticallyCells[0].geometry.x;
                const centerX = x + maxWidth / 2;
                alignVerticallyCells.map(
                    (cell) =>
                        (cell.geometry.x = centerX - cell.geometry.width / 2),
                );
                graph.refresh();
                break;
            case 'horizontal':
                const alignHorizontallyCells: mxCell[] =
                    graph.getSelectionCells();
                const maxHeight = Math.max(
                    // @ts-ignore
                    alignHorizontallyCells.map((c) => c.geometry.height),
                );
                const y = alignHorizontallyCells[0].geometry.y;
                const centerY = y + maxHeight / 2;
                alignHorizontallyCells.map(
                    (cell) =>
                        (cell.geometry.y = centerY - cell.geometry.height / 2),
                );
                graph.refresh();
                break;
            default:
                break;
        }
    });

    mx.mxUtils.write(button, label);
    toolbar.appendChild(button);
};

export default addToolbarButton;

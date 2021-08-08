import mx from '../../mxgraph';

import setBaseConfig from './setGraphConfig';
import {
    getJsonModel,
    stringifyWithoutCircular,
    renderJSON,
} from './jsonCodec';

const childCellModal = (graph, title, content, width, height, cell) => {
    /** id родительского элемента */
    const id = cell.mxObjectId;
    const coord = +id.split('#')[1];

    /** положение окна */
    var x = Math.max(0, document.body.scrollWidth / 2 - width / 2) + coord * 5;
    var y =
        Math.max(
            10,
            document.body.scrollHeight || document.documentElement.scrollHeight,
        ) +
        coord * 5;

    var wnd = new mx.mxWindow(title, content, x, y, width, height, false, true);
    wnd.setClosable(true);

    /** дублируем панели инструментов и элементов для текущего окна */
    const tbCont = document.createElement('div');
    tbCont.className = 'tbContainer';
    tbCont.id = `tbCont${id}`;
    document.getElementById('graphContainer').appendChild(tbCont);

    const sdbar = document.createElement('div');
    sdbar.className = 'sbContainer';
    sdbar.id = `sdbar${id}`;
    document.getElementById('graphContainer').appendChild(sdbar);

    const sdb = new mx.mxToolbar(sdbar);
    const gr = new mx.mxGraph(content);

    setBaseConfig(gr, tbCont, sdb);
    if (cell.child && cell.child.length > 0) {
        gr.addCells(cell.child, cell);
    }

    /** если у данного элемента в памяти найдены дети - загружаем из памяти */
    if (localStorage.getItem(`${id}`) !== '') {
        renderJSON(JSON.parse(localStorage.getItem(`${id}`)), gr);
    }

    /** перед закрытием окна */
    wnd.addListener(mx.mxEvent.DESTROY, (evt) => {
        const currentChildren = getJsonModel(gr);
        if (currentChildren.length > 0) {
            cell.setValue('*');
            graph.refresh();
            const jsonStr = stringifyWithoutCircular(currentChildren);
            localStorage.setItem(`${id}`, jsonStr);
        }

        const parent = document.getElementById('graphContainer');
        parent.removeChild(tbCont);
        parent.removeChild(sdbar);
        graph.setEnabled(true);
    });

    graph.setEnabled(false);
    graph.tooltipHandler.hide();
    wnd.setVisible(true);
};

export default childCellModal;

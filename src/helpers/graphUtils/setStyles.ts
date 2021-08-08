import mx from '../../mxgraph';
import inp from '../../assets/images/inp.png';
import outp from '../../assets/images/outp.png';
import loaded from '../../assets/images/loaded.png';
import switcher from '../../assets/images/switcher.png';

export const setDefaultCellsStyle = (graph) => {
    /////////////////////////// EDGES STYLE
    const edgeStyle = {};
    edgeStyle[mx.mxConstants.STYLE_STROKECOLOR] = '#000';
    edgeStyle[mx.mxConstants.STYLE_STROKEWIDTH] = '2';
    edgeStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_CONNECTOR;
    edgeStyle[mx.mxConstants.STYLE_EDGE] = mx.mxEdgeStyle.ElbowConnector;
    graph.alternateEdgeStyle = 'elbow=vertical';
    edgeStyle[mx.mxConstants.STYLE_ENDARROW] = mx.mxConstants.ARROW_NONE;
    edgeStyle[mx.mxConstants.STYLE_FONTSIZE] = '16';
    edgeStyle[mx.mxConstants.VALID_COLOR] = '#000';
    graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

    graph.connectionHandler.addListener(mx.mxEvent.CONNECT, (sender, evt) => {
        const edge = evt.getProperty('cell');
        const edgeSource = Object.values(graph.model.cells).find(
            (c) => c.id === edge.source.id,
        );

        const entryX = edge.style
            .split(';')
            .find((s) => s.substr(0, 6) === 'entryX')
            .split('=')[1];
        const entryY = edge.style
            .split(';')
            .find((s) => s.substr(0, 6) === 'entryY')
            .split('=')[1];

        if (
            entryX === '0.5' &&
            entryY === '1' &&
            edgeSource.style === 'rectangle' &&
            edge.target.style === 'rectangle'
        ) {
            const newStyle = graph.stylesheet.getCellStyle(
                'edgeStyle="";endArrow=openThin;',
            );
            let array = [];
            for (let prop in newStyle) array.push(prop + '=' + newStyle[prop]);
            edge.style = array.join(';');
        }

        const edgeFromSwitcher = edgeSource.edges.filter(
            (e) =>
                (e.source.id === edgeSource.id &&
                    e.target.style === 'switcher') ||
                (e.target.id === edgeSource.id &&
                    e.source.style === 'switcher'),
        )[0];

        if (
            edge.target.style === 'mOfn' ||
            (!edgeFromSwitcher &&
                edge.target.style === 'rectangle' &&
                edge.source.style === 'loaded' &&
                !(entryX === '0' && entryY === '0.5') &&
                !(entryX === '1' && entryY === '0.5'))
        ) {
            const newStyle = graph.stylesheet.getCellStyle(
                'edgeStyle="";endArrow=openThin;',
            );
            let array = [];
            for (var prop in newStyle) array.push(prop + '=' + newStyle[prop]);
            edge.style = array.join(';');
        }
    });

    //////////////////////////// VERTEX STYLES
    const defaultStyle = {};
    defaultStyle[mx.mxConstants.STYLE_VERTICAL_ALIGN] =
        mx.mxConstants.ALIGN_MIDDLE;
    defaultStyle[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_CENTER;
    defaultStyle[mx.mxConstants.STYLE_FONTSIZE] = '16';
    defaultStyle[mx.mxConstants.STYLE_FONTCOLOR] = '#000';
    defaultStyle[mx.mxConstants.STYLE_PERIMETER] =
        mx.mxPerimeter.RectanglePerimeter;
    defaultStyle[mx.mxConstants.STYLE_FILLCOLOR] = '#FFF';
    defaultStyle[mx.mxConstants.STYLE_STROKECOLOR] = '#000';
    defaultStyle[mx.mxConstants.STYLE_STROKEWIDTH] = '1.5';
    defaultStyle[mx.mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
    defaultStyle[mx.mxConstants.STYLE_IMAGE_WIDTH] = '48';
    defaultStyle[mx.mxConstants.STYLE_IMAGE_HEIGHT] = '48';
    graph.getStylesheet().putDefaultVertexStyle(defaultStyle);
};

export const setVertexStyles = (graph) => {
    const rectangleStyle = {};
    rectangleStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_RECTANGLE;
    graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);

    /** стили блоков */
    /** m из n */
    const mOfnStyle = {};
    mOfnStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_ELLIPSE;
    mOfnStyle[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.EllipsePerimeter;
    graph.getStylesheet().putCellStyle('mOfn', mOfnStyle);

    /** переключатель */
    const switcherStyle = {};
    switcherStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
    switcherStyle[mx.mxConstants.STYLE_IMAGE] = switcher;
    switcherStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
    graph.getStylesheet().putCellStyle('switcher', switcherStyle);

    /** вход */
    const inputStyle = {};
    inputStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
    inputStyle[mx.mxConstants.STYLE_IMAGE] = inp;
    inputStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
    graph.getStylesheet().putCellStyle('input', inputStyle);

    /** выход */
    const outputStyle = {};
    outputStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
    outputStyle[mx.mxConstants.STYLE_IMAGE] = outp;
    outputStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
    graph.getStylesheet().putCellStyle('output', outputStyle);

    /** резервный элемент */
    const loadedStyle = {};
    loadedStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
    loadedStyle[mx.mxConstants.STYLE_IMAGE] = loaded;
    loadedStyle[mx.mxConstants.STYLE_FONTSIZE] = '13';
    graph.getStylesheet().putCellStyle('loaded', loadedStyle);
};

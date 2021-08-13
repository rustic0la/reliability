import mx from '../../mxgraph';
import inp from '../../assets/images/inp.png';
import outp from '../../assets/images/outp.png';
import loaded from '../../assets/images/loaded.png';
import switcher from '../../assets/images/switcher.png';

export const setDefaultCellsStyle = (graph: any) => {
  /////////////////////////// EDGES STYLE
  const edgeStyle = {};
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_STROKECOLOR] = '#000';
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_STROKEWIDTH] = '2';
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_CONNECTOR;
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_EDGE] = mx.mxEdgeStyle.ElbowConnector;
  graph.alternateEdgeStyle = 'elbow=vertical';
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_ENDARROW] = mx.mxConstants.ARROW_NONE;
  // @ts-ignore
  edgeStyle[mx.mxConstants.STYLE_FONTSIZE] = '16';
  // @ts-ignore
  edgeStyle[mx.mxConstants.VALID_COLOR] = '#000';
  graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

  graph.connectionHandler.addListener(
    mx.mxEvent.CONNECT,
    (sender: any, evt: any) => {
      const edge = evt.getProperty('cell');
      const edgeSource = Object.values(graph.model.cells).find(
        // @ts-ignore
        (c) => c.id === edge.source.id,
      );

      const entryX = edge.style
        .split(';')
        .find((s: any) => s.substr(0, 6) === 'entryX')
        .split('=')[1];
      const entryY = edge.style
        .split(';')
        .find((s: any) => s.substr(0, 6) === 'entryY')
        .split('=')[1];

      if (
        entryX === '0.5' &&
        entryY === '1' &&
        // @ts-ignore
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

      // @ts-ignore
      const edgeFromSwitcher = edgeSource.edges.filter(
        (e: any) =>
          // @ts-ignore
          (e.source.id === edgeSource.id && e.target.style === 'switcher') ||
          // @ts-ignore
          (e.target.id === edgeSource.id && e.source.style === 'switcher'),
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
    },
  );

  //////////////////////////// VERTEX STYLES
  const defaultStyle = {};
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_VERTICAL_ALIGN] =
    mx.mxConstants.ALIGN_MIDDLE;
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_CENTER;
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_FONTSIZE] = '16';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_FONTCOLOR] = '#000';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_PERIMETER] =
    mx.mxPerimeter.RectanglePerimeter;
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_FILLCOLOR] = '#FFF';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_STROKECOLOR] = '#000';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_STROKEWIDTH] = '1.5';
  // @ts-ignore
  defaultStyle[mx.mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_IMAGE_WIDTH] = '48';
  // @ts-ignore
  defaultStyle[mx.mxConstants.STYLE_IMAGE_HEIGHT] = '48';
  graph.getStylesheet().putDefaultVertexStyle(defaultStyle);
};

export const setVertexStyles = (graph: any) => {
  const rectangleStyle = {};
  // @ts-ignore
  rectangleStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_RECTANGLE;
  graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);

  /** стили блоков */
  /** m из n */
  const mOfnStyle = {};
  // @ts-ignore
  mOfnStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_ELLIPSE;
  // @ts-ignore
  mOfnStyle[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.EllipsePerimeter;
  graph.getStylesheet().putCellStyle('mOfn', mOfnStyle);

  /** переключатель */
  const switcherStyle = {};
  // @ts-ignore
  switcherStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
  // @ts-ignore
  switcherStyle[mx.mxConstants.STYLE_IMAGE] = switcher;
  // @ts-ignore
  switcherStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle('switcher', switcherStyle);

  /** вход */
  const inputStyle = {};
  // @ts-ignore
  inputStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
  // @ts-ignore
  inputStyle[mx.mxConstants.STYLE_IMAGE] = inp;
  // @ts-ignore
  inputStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle('input', inputStyle);

  /** выход */
  const outputStyle = {};
  // @ts-ignore
  outputStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
  // @ts-ignore
  outputStyle[mx.mxConstants.STYLE_IMAGE] = outp;
  // @ts-ignore
  outputStyle[mx.mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle('output', outputStyle);

  /** резервный элемент */
  const loadedStyle = {};
  // @ts-ignore
  loadedStyle[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_IMAGE;
  // @ts-ignore
  loadedStyle[mx.mxConstants.STYLE_IMAGE] = loaded;
  // @ts-ignore
  loadedStyle[mx.mxConstants.STYLE_FONTSIZE] = '13';
  graph.getStylesheet().putCellStyle('loaded', loadedStyle);
};

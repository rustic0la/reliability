import { mxConstants, mxPerimeter, mxEdgeStyle, mxEvent } from "mxgraph-js";

import inp from "../../assets/images/inp.png";
import outp from "../../assets/images/outp.png";
import loaded from "../../assets/images/loaded.png";
import switcher from "../../assets/images/switcher.png";

export const setDefaultCellsStyle = (graph) => {
  /////////////////////////// EDGES STYLE
  const edgeStyle = {};
  edgeStyle[mxConstants.STYLE_STROKECOLOR] = "#000";
  edgeStyle[mxConstants.STYLE_STROKEWIDTH] = "2";
  edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
  edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
  graph.alternateEdgeStyle = "elbow=vertical";
  edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_NONE;
  edgeStyle[mxConstants.STYLE_FONTSIZE] = "16";
  edgeStyle[mxConstants.VALID_COLOR] = "#000";
  graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

  graph.connectionHandler.addListener(mxEvent.CONNECT, (sender, evt) => {
    const edge = evt.getProperty("cell");
    const edgeSource = Object.values(graph.model.cells).find(
      (c) => c.id === edge.source.id
    );
    const edgeFromSwitcher = edgeSource.edges.filter(
      (e) =>
        (e.source.id === edgeSource.id && e.target.style === "switcher") ||
        (e.target.id === edgeSource.id && e.source.style === "switcher")
    )[0];

    if (
      edge.target.style === "mOfn" ||
      (!edgeFromSwitcher && edge.target.style === "rectangle" && edge.source.style === "loaded")
    ) {
      const newStyle = graph.stylesheet.getCellStyle(
        'edgeStyle="";endArrow=openThin;'
      );
      let array = [];
      for (var prop in newStyle) array.push(prop + "=" + newStyle[prop]);
      edge.style = array.join(";");
    }
  });

  //////////////////////////// VERTEX STYLES
  const defaultStyle = {};
  defaultStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  defaultStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  defaultStyle[mxConstants.STYLE_FONTSIZE] = "16";
  defaultStyle[mxConstants.STYLE_FONTCOLOR] = "#000";
  defaultStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  defaultStyle[mxConstants.STYLE_FILLCOLOR] = "#FFF";
  defaultStyle[mxConstants.STYLE_STROKECOLOR] = "#000";
  defaultStyle[mxConstants.STYLE_STROKEWIDTH] = "1.5";
  defaultStyle[mxConstants.HANDLE_FILLCOLOR] = "#80c6ee";
  defaultStyle[mxConstants.STYLE_IMAGE_WIDTH] = "48";
  defaultStyle[mxConstants.STYLE_IMAGE_HEIGHT] = "48";
  graph.getStylesheet().putDefaultVertexStyle(defaultStyle);
};

export const setVertexStyles = (graph) => {
  const rectangleStyle = {};
  rectangleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  graph.getStylesheet().putCellStyle("rectangle", rectangleStyle);

  /** стили блоков */
  /** m из n */
  const mOfnStyle = {};
  mOfnStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  mOfnStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  graph.getStylesheet().putCellStyle("mOfn", mOfnStyle);

  /** переключатель */
  const switcherStyle = {};
  switcherStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  switcherStyle[mxConstants.STYLE_IMAGE] = switcher;
  switcherStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("switcher", switcherStyle);

  /** вход */
  const inputStyle = {};
  inputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  inputStyle[mxConstants.STYLE_IMAGE] = inp;
  inputStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("input", inputStyle);

  /** выход */
  const outputStyle = {};
  outputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  outputStyle[mxConstants.STYLE_IMAGE] = outp;
  outputStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("output", outputStyle);

  /** резервный элемент */
  const loadedStyle = {};
  loadedStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
  loadedStyle[mxConstants.STYLE_FONTSIZE] = "13";
  graph.getStylesheet().putCellStyle("loaded", loadedStyle);
};

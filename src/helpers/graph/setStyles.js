import {
  mxConstants,
  mxPerimeter,
  mxEdgeStyle,
  mxEvent,
} from "mxgraph-js";

import inp from "../../assets/images/inp.png";
import outp from "../../assets/images/outp.png";
import loaded from "../../assets/images/loaded.png";
import toggle from "../../assets/images/toggle.png";

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
    if (edge.target.style === "mOfn" || (edge.source.style === "loaded" && edge.target.style !== "loaded")) {
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
  rectangleStyle[mxConstants.STYLE_FILLCOLOR] = "#ffffff";
  rectangleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  graph.getStylesheet().putCellStyle("rectangle", rectangleStyle);

  const mOfnStyle = {};
  mOfnStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  mOfnStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  graph.getStylesheet().putCellStyle("mOfn", mOfnStyle);

  const nodeStyle = {};
  nodeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
  nodeStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
  nodeStyle[mxConstants.STYLE_FILLCOLOR] = "#000";
  graph.getStylesheet().putCellStyle("node", nodeStyle);

  const toggleStyle = {};
  toggleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  toggleStyle[mxConstants.STYLE_IMAGE] = toggle;
  toggleStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("toggle", toggleStyle);

  const inputStyle = {};
  inputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  inputStyle[mxConstants.STYLE_IMAGE] = inp;
  inputStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("input", inputStyle);

  const outputStyle = {};
  outputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  outputStyle[mxConstants.STYLE_IMAGE] = outp;
  outputStyle[mxConstants.STYLE_EDITABLE] = 0;
  graph.getStylesheet().putCellStyle("output", outputStyle);

  const loadedStyle = {};
  loadedStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
  loadedStyle[mxConstants.STYLE_FONTSIZE] = "13";
  graph.getStylesheet().putCellStyle("loaded", loadedStyle);
};

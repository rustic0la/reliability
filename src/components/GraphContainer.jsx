import React, { useEffect } from "react";
import {
  mxGraph,
  mxOutline,
  mxToolbar,
} from "mxgraph-js";

import "../helpers/graph/style.css";
import setGraphConfig from "../helpers/graph/setGraphConfig";

const GraphContainer = ({ setGraphNodes }) => {

  useEffect(() => {
    loadGraph();
  }, []);

  useEffect(() => {
    return () => {
      const window = document.querySelector(".mxWindow");
      if (window) {
        window.remove();
      }
    };
  }, []);

  const loadGraph = () => {
    const container = document.getElementById("container");
    const tbContainer = document.getElementById("tbContainer");
    const outlineContainer = document.getElementById("outlineContainer");
    const sbContainer = document.getElementById("sbContainer");

    const graph = new mxGraph(container);
    const sidebar = new mxToolbar(sbContainer);

    setGraphConfig(graph, tbContainer, sidebar, setGraphNodes);

    new mxOutline(graph, outlineContainer);
  };

  return (
    <div id="graphContainer">
      <div className="container" id="container" />
      <div className="tbContainer" id="tbContainer" />
      <div className="sbContainer" id="sbContainer" />
      <div className="outlineContainer" id="outlineContainer" />
    </div>
  );
};

export default GraphContainer;

import React, { useEffect } from "react";
import {
  mxGraph,
  mxOutline,
  mxToolbar,
  mxEvent,
} from "mxgraph-js";

import "../helpers/graph/style.css";
import setGraphConfig from "../helpers/graph/setGraphConfig";
import { getJsonModel } from "../helpers/graph/jsonCodec";

const GraphContainer = ({ setGraphNodes }) => {

  useEffect(() => {
    loadGraph();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    /** получение div-элементов из DOM */
    const container = document.getElementById("container");
    const tbContainer = document.getElementById("tbContainer");
    const outlineContainer = document.getElementById("outlineContainer");
    const sbContainer = document.getElementById("sbContainer");

    /** инициализация графа */
    const graph = new mxGraph(container);
    const sidebar = new mxToolbar(sbContainer);

    /** сеттинг конфигурации графа */
    setGraphConfig(graph, tbContainer, sidebar, setGraphNodes);

    new mxOutline(graph, outlineContainer);

    /** при изменении графа происходит его сохранение в graphNodes */
    graph.model.addListener(mxEvent.CHANGE, () => {
      const jsonNodes = getJsonModel(graph);
      setGraphNodes(jsonNodes);
    });
  };
  /** структура основного контейнера, внутри которого элементы 
   * тулбара, сайдбара, поля редактора */
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

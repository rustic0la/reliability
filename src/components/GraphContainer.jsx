import React, { useState, useEffect } from "react";
import {
  mxGraph,
  mxOutline,
  mxToolbar,
  mxRubberband,
  mxEvent,
  mxUtils,
  mxGraphModel,
  mxCodec,
  mxClipboard,
  mxClient,
} from "mxgraph-js";

import "../helpers/graph/style.css";
import setGraphConfig from "../helpers/graph/setGraphConfig";
import { getJsonModel, stringifyWithoutCircular } from "../helpers/graph/jsonCodec";

// todo align vertically and horizontally
// todo show children sign

const GraphContainer = ({ setGraphStructure }) => {

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

    setGraphConfig(graph, tbContainer, sidebar);

    new mxOutline(graph, outlineContainer);
    new mxRubberband(graph);

    ////////////////!

    mxEvent.disableContextMenu(container);

    // Public helper method for shared clipboard.
    mxClipboard.cellsToString = (cells) => {
      console.log("mxClipboard.cellsToString -> cells", cells);
      const codec = new mxCodec();
      const model = new mxGraphModel();
      const parent = model.getChildAt(model.getRoot(), 0);

      for (let i = 0; i < cells.length; i++) {
        model.add(parent, cells[i]);
      }
      console.log("mxClipboard.cellsToString -> model", model);

      return mxUtils.getXml(codec.encode(model));
    };

    // Focused but invisible textarea during control or meta key events
    const textInput = document.createElement("textarea");

    mxUtils.setOpacity(textInput, 0);
    textInput.style.width = "1px";
    textInput.style.height = "1px";
    const restoreFocus = false;
    const gs = graph.gridSize;
    const lastPaste = null;
    let dx = 0;
    let dy = 0;
    //console.log("Graph -> textInput", textInput);

    // Shows a textare when control/cmd is pressed to handle native clipboard actions
    mxEvent.addListener(document, "keydown", (evt) => {
      console.log("Graph -> keydown", evt);
      // No dialog visible
      const source = mxEvent.getSource(evt);

      if (
        graph.isEnabled() &&
        !graph.isMouseDown &&
        !graph.isEditing() &&
        source.nodeName !== "INPUT"
      ) {
        if (
          evt.keyCode === 224 ||
          (!mxClient.IS_MAC && evt.keyCode === 17) ||
          (mxClient.IS_MAC && evt.keyCode === 91)
        ) {
          // Cannot use parentNode for check in IE
          if (!restoreFocus) {
            // Avoid autoscroll but allow handling of events
            textInput.style.position = "absolute";
            textInput.style.left = graph.container.scrollLeft + 10 + "px";
            textInput.style.top = graph.container.scrollTop + 10 + "px";
            graph.container.appendChild(textInput);

            restoreFocus = true;
            textInput.focus();
            textInput.select();
          }
        }
      }
    });

    // Restores focus on graph container and removes text input from DOM
    mxEvent.addListener(document, "keyup", (evt) => {
      console.log("Graph -> keyup", evt);
      if (
        restoreFocus &&
        (evt.keyCode === 224 || evt.keyCode === 17 || evt.keyCode === 91)
      ) {
        restoreFocus = false;

        if (!graph.isEditing()) {
          graph.container.focus();
        }

        textInput.parentNode.removeChild(textInput);
      }
    });

    // Inserts the XML for the given cells into the text input for copy
    const copyCells = (graph, cells) => {
      console.log("copyCells -> cells", cells);
      if (cells.length > 0) {
        const clones = graph.cloneCells(cells);

        // Checks for orphaned relative children and makes absolute
        for (let i = 0; i < clones.length; i++) {
          const state = graph.view.getState(cells[i]);

          if (state !== null) {
            const geo = graph.getCellGeometry(clones[i]);

            if (geo !== null && geo.relative) {
              geo.relative = false;
              geo.x = state.x / state.view.scale - state.view.translate.x;
              geo.y = state.y / state.view.scale - state.view.translate.y;
            }
          }
        }

        textInput.value = mxClipboard.cellsToString(clones);
      }

      textInput.select();
      lastPaste = textInput.value;
    };

    // Handles copy event by putting XML for current selection into text input
    mxEvent.addListener(
      textInput,
      "copy",
      mxUtils.bind(this, (evt) => {
        console.log("Graph -> copy", this);
        if (graph.isEnabled() && !graph.isSelectionEmpty()) {
          copyCells(
            graph,
            mxUtils.sortCells(
              graph.model.getTopmostCells(graph.getSelectionCells())
            )
          );
          dx = 0;
          dy = 0;
        }
      })
    );

    // Merges XML into existing graph and layers
    const importXml = (xml, dx, dy) => {
      console.log("importXml -> xml", xml);
      dx = dx !== null ? dx : 0;
      dy = dy !== null ? dy : 0;
      const cells = [];

      try {
        const doc = mxUtils.parseXml(xml);
        const node = doc.documentElement;

        if (node !== null) {
          const model = new mxGraphModel();
          const codec = new mxCodec(node.ownerDocument);
          codec.decode(node, model);

          const childCount = model.getChildCount(model.getRoot());
          const targetChildCount = graph.model.getChildCount(
            graph.model.getRoot()
          );

          // Merges existing layers and adds new layers
          graph.model.beginUpdate();
          try {
            for (let i = 0; i < childCount; i++) {
              const parent = model.getChildAt(model.getRoot(), i);

              // Adds cells to existing layers if not locked
              if (targetChildCount > i) {
                // Inserts into active layer if only one layer is being pasted
                const target =
                  childCount === 1
                    ? graph.getDefaultParent()
                    : graph.model.getChildAt(graph.model.getRoot(), i);

                if (!graph.isCellLocked(target)) {
                  const children = model.getChildren(parent);
                  cells = cells.concat(
                    graph.importCells(children, dx, dy, target)
                  );
                }
              } else {
                // Delta is non cascading, needs separate move for layers
                parent = graph.importCells(
                  [parent],
                  0,
                  0,
                  graph.model.getRoot()
                )[0];
                const children = graph.model.getChildren(parent);
                graph.moveCells(children, dx, dy);
                cells = cells.concat(children);
              }
            }
          } finally {
            graph.model.endUpdate();
          }
        }
      } catch (e) {
        alert(e);
        throw e;
      }

      return cells;
    };

    // Parses and inserts XML into graph
    const pasteText = (text) => {
      console.log("pasteText -> graph", graph);
      const xml = mxUtils.trim(text);
      console.log("pasteText -> xml", xml);
      const x =
        graph.container.scrollLeft / graph.view.scale - graph.view.translate.x;
      const y =
        graph.container.scrollTop / graph.view.scale - graph.view.translate.y;

      if (xml.length > 0) {
        if (lastPaste !== xml) {
          lastPaste = xml;
          dx = 0;
          dy = 0;
        } else {
          dx += gs;
          dy += gs;
        }

        // Standard paste via control-v
        if (xml.substring(0, 14) === "<mxGraphModel>") {
          graph.setSelectionCells(importXml(xml, dx, dy));
          graph.scrollCellToVisible(graph.getSelectionCell());
        }
      }
    };

    // Cross-browser function to fetch text from paste events
    const extractGraphModelFromEvent = (evt) => {
      const data = null;

      console.log("extractGraphModelFromEvent -> evt", evt);

      if (evt != null) {
        const provider =
          evt.dataTransfer != null ? evt.dataTransfer : evt.clipboardData;

        if (provider != null) {
          if (document.documentMode === 10 || document.documentMode === 11) {
            data = provider.getData("Text");
          } else {
            data =
              mxUtils.indexOf(provider.types, "text/html") >= 0
                ? provider.getData("text/html")
                : null;

            if (
              mxUtils.indexOf(
                provider.types,
                "text/plain" && (data === null || data.length === 0)
              )
            ) {
              data = provider.getData("text/plain");
            }
          }
        }
      }

      return data;
    };

    mxEvent.addListener(textInput, "paste", (evt) => {
      //textInput.value = "";
      console.log("Graph -> textInput, paste", textInput);

      if (graph.isEnabled()) {
        const xml = extractGraphModelFromEvent(evt);

        if (xml !== null && xml.length > 0) {
          pasteText(xml);
        } else {
          // Timeout for new value to appear
          mxUtils.bind(this, () => {
            pasteText(textInput.value);
          })
        }
      }

      textInput.select();
    });
/*
    const parent = graph.getDefaultParent();

    graph.getModel().beginUpdate();
    try {
      const v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
      const v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
      const v3 = graph.insertVertex(parent, null, "", 400, 150, 80, 30);
      const e1 = graph.insertEdge(parent, null, "", v1, v2);
    } finally {
      graph.getModel().endUpdate();
    }*/

    graph.model.addListener(mxEvent.CHANGE, () => {
      const jsonNodes = getJsonModel(graph);
      const jsonStr = stringifyWithoutCircular(jsonNodes);
      setGraphStructure(jsonStr);
    });
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

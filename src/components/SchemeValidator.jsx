import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import ConditionsFormContent from "./ConditionsForm";
import { checkReservedWithSwitcher } from "../helpers/calc/helpers";

const EMPTY_GRAPH = "emptyGraph";
const NO_RECTANGLES = "noRectangles";
// const BLOCKS_NOT_INITIALIZED = "blocksNotInitialized";
// const VALUES_NOT_NUMERIC = "valuesNotNumeric";
const NO_INPUT_OR_OUTPUT = "noInputOrOutput";
const ELEMENT_WITHOUT_EDGES = "elementWithoutEdges";
const M_OF_N = "mOfN";
const SWITCHER = "switcher";

const ShemeValidator = ({ graphNodes }) => {
  const [show, setShow] = useState(false);

  const [isReserved, setIsReserved] = useState(false);
  const [isSwitcher, setIsSwitcher] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    checkValidity();
    setShow(true);
  };

  const [error, setError] = useState(null);

  const checkValidity = () => {
    const subGraphsJSON = Object.entries(localStorage).filter((item) =>
      item[0].includes("mxCell")
    );
    const subGraphs = subGraphsJSON.reduce(
      (acc, [, value]) => [...acc, JSON.parse(value)],
      []
    );
    if (isEmptyGraph(graphNodes)) {
      setError(EMPTY_GRAPH);
      return;
    }

    if (isNoRectangles(graphNodes, subGraphs)) {
      setError(NO_RECTANGLES);
      return;
    }

    if (isNoInputOrOutput(graphNodes, subGraphs)) {
      setError(NO_INPUT_OR_OUTPUT);
      return;
    }

    if (isElementWithoutEdges(graphNodes, subGraphs)) {
      setError(ELEMENT_WITHOUT_EDGES);
      return;
    }

    if (isSchemeIsReserved(graphNodes, subGraphs)) {
      setIsReserved(true);
    }

    const [isError, isSwitcher] = checkSwitcher(graphNodes, subGraphs);

    if (isSwitcher) {
      setIsSwitcher(true);
      if (isError) {
        setError(SWITCHER);
        return;
      }
    }
    /*
    if (areBlocksNotInitialized(graphNodes, subGraphs)) {
      setError(BLOCKS_NOT_INITIALIZED);
      return;
    }
    if (areValuesNotNumeric(graphNodes, subGraphs)) {
      setError(VALUES_NOT_NUMERIC);
      return;
    }
*/
    if (isIncorrectMOfN(graphNodes, subGraphs)) {
      setError(M_OF_N);
      return;
    }

    setError(null);
    return;
  };

  const isEmptyGraph = (graph) => graph.length === 0;

  const isNoRectangles = (graph, childLayers) => {
    const main = graph.filter((v) => v.style === "rectangle").length > 0;

    const children =
      childLayers && childLayers.length > 0
        ? childLayers.map(
            (layer) =>
              layer.filter((cell) => cell.style === "rectangle").length > 0
          )
        : true;

    const res = children === true ? children : children.every((layer) => layer);

    return !main || !res;
  };
  /*
  const areBlocksNotInitialized = (graph, childLayers) => {
    const graphVertexes = graph
      .filter((cell) => ["rectangle", "mOfn", "loaded"].includes(cell.style))
      .every((cell) => cell.value);

    const children =
      childLayers && childLayers.length > 0
        ? childLayers.map((layer) =>
            layer
              .filter((cell) =>
                ["rectangle", "mOfn", "loaded"].includes(cell.style)
              )
              .every((cell) => cell.value)
          )
        : true;

    const res = children === true ? children : children.every((layer) => layer);

    return !graphVertexes || !res;
  };
*/
  /*
  const areValuesNotNumeric = (graph, childLayers) => {
    const reNum = /^(0\.\d+)$|^1$/;

    const graphVertexes = graph
      .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
      .every((cell) => reNum.test(cell.value) || cell.value === "*");

    const childVertexes =
      childLayers && childLayers.length > 0
        ? childLayers.map((layer) =>
            layer
              .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
              .every((cell) => reNum.test(cell.value) || cell.value === "*")
          )
        : true;

    const res =
      childVertexes === true
        ? childVertexes
        : childVertexes.every((layer) => layer);

    return !graphVertexes || !res;
  };
*/

  const isSchemeIsReserved = (graph, childLayers) => {
    const main = graph.filter((cell) => cell.style === "loaded").length > 0;

    const children =
      childLayers && childLayers.length > 0
        ? childLayers.map(
            (layer) =>
              layer.filter((cell) => cell.style === "loaded").length > 0
          )
        : false;

    const res =
      children === false ? children : children.every((layer) => layer);

    return main || res;
  };

  // todo func checkIsSwitcher + checkIsCorectSwitcherScheme

  const checkSwitcher = (graph, childLayers) => {
    debugger;
    const main = checkReservedWithSwitcher(graph);

    const children =
      childLayers && childLayers.length > 0
        ? childLayers.map((layer) => checkReservedWithSwitcher(layer))
        : true;

    const res = children === true ? children : children.every((layer) => layer);

    let flag = false;
    const isSwitcherOnChildScheme = childLayers && childLayers.length > 0 ? childLayers.map((layer) =>
      layer.find((cell) => cell.style === "switcher")
    ) : [];
    
    if (
      (graph.find((v) => v.style === "switcher") ||
        (isSwitcherOnChildScheme.length > 0 &&
          isSwitcherOnChildScheme.some((layer) => layer))) &&
      (!main || !res)
    )
      flag = true;

    return [flag, !main || !res];
  };

  const isIncorrectMOfN = (graph, childLayers) => {
    const reMOfn = /^\d+\/\d+$/;
    const mOfn = graph
      .filter((cell) => cell.style === "mOfn")
      .every((cell) => reMOfn.test(cell.value));

    const childMOfn =
      childLayers && childLayers.length > 0
        ? childLayers.map((layer) =>
            layer
              .filter((cell) => cell.style === "mOfn")
              .every((cell) => reMOfn.test(cell.value))
          )
        : true;

    const res =
      childMOfn === true ? childMOfn : childMOfn.every((layer) => layer);

    return !mOfn || !res;
  };

  const isNoInputOrOutput = (graph, childLayers) => {
    const main =
      graph.filter((cell) => cell.style === "input").length === 1 &&
      graph.filter((cell) => cell.style === "output").length === 1;

    const children =
      childLayers && childLayers.length > 0
        ? childLayers.map(
            (layer) =>
              layer.filter((cell) => cell.style === "input").length === 1 &&
              layer.filter((cell) => cell.style === "output").length === 1
          )
        : true;

    const res = children === true ? children : children.every((layer) => layer);
    return !main || !res;
  };

  const isElementWithoutEdges = (graph, childLayers) => {
    const graphVertexes = graph
      .filter(
        (cell) =>
          cell.vertex && cell.style !== "input" && cell.style !== "output"
      )
      .every((cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2);

    const childVertexes =
      childLayers && childLayers.length > 0
        ? childLayers.map((layer) =>
            layer
              .filter(
                (cell) =>
                  cell.vertex &&
                  cell.style !== "input" &&
                  cell.style !== "output"
              )
              .every(
                (cell) => cell.hasOwnProperty("edges") && cell.edges.length >= 2
              )
          )
        : true;

    const res =
      childVertexes === true
        ? childVertexes
        : childVertexes.every((layer) => layer);

    return !graphVertexes || !res;
  };

  const renderEmptyGraph = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Отсутствует структурная схема
      </Modal.Body>
    </>
  );

  const renderNoRectangles = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Отсутствуют основные блоки
      </Modal.Body>
    </>
  );
  /*
  const renderBlocksNotInitialized = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Необходимо, чтобы каждый блок, включая дочерние, обладал значением
        интенсивности отказов
      </Modal.Body>
    </>
  );
*/
  /*
  const renderValuesNotNumeric = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Каждое значение интенсивности отказов должно быть в диапазоне от 0 до 1
        и относиться к типу Float
      </Modal.Body>
    </>
  );
*/
  const renderMOfN = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Значения элементов типа m из n должны записываться в формате m/n
      </Modal.Body>
    </>
  );

  const renderNoInputOrOutput = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Схема должна содержать входной и выходной элементы
      </Modal.Body>
    </>
  );

  const renderElementWithoutEdges = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Схема не должна содержать элементы без соединения
      </Modal.Body>
    </>
  );

  const renderSwitcherWrongScheme = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "10px" }}>
        Переключатель должен соединять основные элементы с резервными (минимум с двумя)
      </Modal.Body>
    </>
  );

  return (
    <>
      <Button
        onClick={handleShow}
        style={{
          fontSize: "16px",
          padding: "3px",
          position: "absolute",
          top: "3px",
          right: "15px",
          marginTop: "2px",
          background: "rgb(82, 74, 228)",
          color: "#fff",
        }}
      >
        Рассчитать
      </Button>
      <Modal show={show} onHide={handleClose}>
        {error === EMPTY_GRAPH && renderEmptyGraph()}
        {error === NO_RECTANGLES && renderNoRectangles()}
        {/* error === BLOCKS_NOT_INITIALIZED && renderBlocksNotInitialized() */}
        {/* error === VALUES_NOT_NUMERIC && renderValuesNotNumeric() */}
        {error === M_OF_N && renderMOfN()}
        {error === NO_INPUT_OR_OUTPUT && renderNoInputOrOutput()}
        {error === ELEMENT_WITHOUT_EDGES && renderElementWithoutEdges()}
        {error === SWITCHER && renderSwitcherWrongScheme()}
        {error === null && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Параметры эксплуатации</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "0", paddingBottom: "20px" }}>
              <ConditionsFormContent
                scheme={graphNodes}
                isReserved={isReserved}
                isSwitcher={isSwitcher}
              />
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default ShemeValidator;

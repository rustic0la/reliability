import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import ConditionsFormContent from "./ConditionsFormContent";

const EMPTY_GRAPH = "emptyGraph";
const BLOCKS_NOT_INITIALIZED = "blocksNotInitialized";
const VALUES_NOT_NUMERIC = "valuesNotNumeric";
const NO_INPUT_OR_OUTPUT = "noInputOrOutput";
const ELEMENT_WITHOUT_EDGES = "elementWithoutEdges";
const M_OF_N = "mOfN";

const ModalWin = ({ graphNodes }) => {
  const [show, setShow] = useState(false);

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

    if (isNoInputOrOutput(graphNodes)) {
      setError(NO_INPUT_OR_OUTPUT);
      return;
    }

    if (isElementWithoutEdges(graphNodes, subGraphs)) {
      setError(ELEMENT_WITHOUT_EDGES);
      return;
    }

    if (areBlocksNotInitialized(graphNodes, subGraphs)) {
      setError(BLOCKS_NOT_INITIALIZED);
      return;
    }
    if (areValuesNotNumeric(graphNodes, subGraphs)) {
      setError(VALUES_NOT_NUMERIC);
      return;
    }

    if (isIncorrectMOfN(graphNodes, subGraphs)) {
      setError(M_OF_N);
      return;
    }

    setError(null);
    return;
  };

  /**
   * @empty
   * @no_value + children
   * @not_numeric_value + children
   * @input @output
   * @element_without_edges + children
   */

  const isEmptyGraph = (graph) => graph.length === 0;

  const areBlocksNotInitialized = (graph, childNodes) => {
    const graphVertexes = graph
      .filter((cell) => ["rectangle", "mOfn", "loaded"].includes(cell.style))
      .every((cell) => cell.value);

    const children =
      childNodes[0].length > 0
        ? childNodes[0]
            .filter((cell) =>
              ["rectangle", "mOfn", "loaded"].includes(cell.style)
            )
            .every((cell) => cell.value)
        : false;

    return !graphVertexes || !children;
  };

  const areValuesNotNumeric = (graph, childNodes) => {
    const reNum = /^(0\.\d+)$|^1$/;

    const graphVertexes = graph
      .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
      .every((cell) => reNum.test(cell.value) || cell.value === "*");

    const childVertexes =
      childNodes[0].length > 0
        ? childNodes[0]
            .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
            .every((cell) => reNum.test(cell.value))
        : false;

    return !graphVertexes || !childVertexes;
  };

  const isIncorrectMOfN = (graph, childNodes) => {
    const reMOfn = /^\d+\/\d+$/;
    const mOfn = graph
      .filter((cell) => cell.style === "mOfn")
      .every((cell) => reMOfn.test(cell.value));

    const childMOfn =
      childNodes[0].length > 0
        ? childNodes[0]
            .filter((cell) => cell.style === "mOfn")
            .every((cell) => reMOfn.test(cell.value))
        : false;

    return !mOfn || !childMOfn;
  };

  const isNoInputOrOutput = (graph) => {
    return !(
      graph.filter((cell) => cell.style === "input").length === 1 &&
      graph.filter((cell) => cell.style === "output").length === 1
    );
  };

  const isElementWithoutEdges = (graph, childNodes) => {
    const graphVertexes = graph
      .filter((cell) => cell.vertex)
      .every((cell) => cell.hasOwnProperty("edges"));

    const childVertexes =
      childNodes[0].length > 0
        ? childNodes[0]
            .filter((cell) => cell.vertex)
            .filter((cell) => !cell.hasOwnProperty("edges")).length <= 1
        : false;

    return !graphVertexes || !childVertexes;
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
        {error === BLOCKS_NOT_INITIALIZED && renderBlocksNotInitialized()}
        {error === VALUES_NOT_NUMERIC && renderValuesNotNumeric()}
        {error === M_OF_N && renderMOfN()}
        {error === NO_INPUT_OR_OUTPUT && renderNoInputOrOutput()}
        {error === ELEMENT_WITHOUT_EDGES && renderElementWithoutEdges()}
        {error === null && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Параметры эксплуатации</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "0", paddingBottom: "20px" }}>
              <ConditionsFormContent />
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalWin;

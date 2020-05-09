import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

import ConditionsFormContent from "./ConditionsFormContent";

const ModalWin = ({ graphStructure }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  let subGraphs = [];

  //! FIX
  const [isEmptyGraph, setIsEmptyGraph] = useState(null);
  const [areBlocksNotInitialized, setAreBlocksNotInitialized] = useState(null);
  const [areValuesNotNumeric, setAreValuesNotNumeric] = useState(null);


/*
  useEffect(() => {
    graphStructureNodes = JSON.parse(localStorage.getItem("json"));
    console.log(
      "ValidInputChecker -> graphStructureNodes",
      graphStructureNodes
    );
  }, [localStorage]);

  const checkForBlocksNotInitialized = () => {
    const graphVertexes = graphStructureNodes
      .filter((cell) => ["rectangle", "mOfn", "loaded"].includes(cell.style))
      .every((cell) => cell.value);

    const children =
      subGraphs.length > 0
        ? subGraphs
            .filter((cell) =>
              ["rectangle", "mOfn", "loaded"].includes(cell.style)
            )
            .every((cell) => cell.value)
        : false;

    return !graphVertexes || !children;
  };

  const checkForValuesNotNumeric = () => {
    const reNum = /^(0\.\d+)$|^1$/gm;
    const graphVertexes = graphStructureNodes
      .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
      .every((cell) => reNum.test(cell.value));

    const childrenVertexes =
      subGraphs.length > 0
        ? subGraphs
            .filter((cell) => ["rectangle", "loaded"].includes(cell.style))
            .every((cell) => reNum.test(cell.value))
        : false;

    const reMOfn = /^\d+\/\d+$/gm;
    const mOfn = graphStructureNodes
      .filter((cell) => cell.style === "mOfn")
      .every((cell) => reMOfn.test(cell.value));

    const childrenMOfn =
      subGraphs.length > 0
        ? subGraphs
            .filter((cell) => cell.style === "mOfn")
            .every((cell) => reMOfn.test(cell.value))
        : false;

    return !graphVertexes || !mOfn || !childrenVertexes || !childrenMOfn;
  };

  setIsEmptyGraph(!graphStructureNodes);

  if (!isEmptyGraph) {
    setAreBlocksNotInitialized(checkForBlocksNotInitialized());

    if (!areBlocksNotInitialized) {
      setAreValuesNotNumeric(checkForValuesNotNumeric());
    }
  }

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
        Каждое значение интенсивности отказов должно относиться к типу Float
      </Modal.Body>
    </>
  );
*/
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
        {/*isEmptyGraph ? (
          renderEmptyGraph()
        ) : areBlocksNotInitialized ? (
          renderBlocksNotInitialized()
        ) : areValuesNotNumeric ? (
          renderValuesNotNumeric()
        ) : (*/}
          <>
            <Modal.Header closeButton>
              <Modal.Title>Параметры эксплуатации</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "0", paddingBottom: "20px" }}>
              <ConditionsFormContent />
            </Modal.Body>
          </>
        
      </Modal>
    </>
  );
};

export default ModalWin;

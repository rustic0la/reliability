import React from "react";
import { Modal } from "react-bootstrap";

import ConditionsFormContent from "./ConditionsForm";
import { getTypes } from "../helpers/calculations/utils/utils";
import {
  isEmptyGraph,
} from "../helpers/calculations/validateScheme/isEmptyGraph";

import {isElementWithoutEdges } from '../helpers/calculations/validateScheme/isElementWithoutEdges';
import { isNoInputOrOutput } from '../helpers/calculations/validateScheme/isNoInputOrOutput';
import { isIncorrectMOfN } from '../helpers/calculations/validateScheme/isIncorrectMOfN';
import { isSwitcherSchemeCorrect } from '../helpers/calculations/validateScheme/isSwitcherSchemeCorrect';
import { isSwitcher } from '../helpers/calculations/validateScheme/isSwitcher';
import { isNoRectangles } from '../helpers/calculations/validateScheme/isNoRectangles'



const SchemeValidator = ({ graphNodes, show, onHide }) => {
  const subGraphsJSON = Object.entries(localStorage).filter((item) =>
    item[0].includes("mxCell")
  );
  const subGraphs = subGraphsJSON.reduce(
    (acc, [key, value]) => [...acc, { key, scheme: JSON.parse(value) }],
    []
  );
  if (isEmptyGraph(graphNodes)) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Отсутствует структурная схема
        </Modal.Body>
      </Modal>
    );
  }

  if (isNoRectangles(graphNodes, subGraphs)) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Отсутствуют основные блоки
        </Modal.Body>
      </Modal>
    );
  }

  if (isNoInputOrOutput(graphNodes, subGraphs)) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Схема должна содержать входной и выходной элементы
        </Modal.Body>
      </Modal>
    );
  }

  if (isElementWithoutEdges(graphNodes, subGraphs)) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Схема не должна содержать элементы без соединения
        </Modal.Body>
      </Modal>
    );
  }

  if (isSwitcher(graphNodes, subGraphs)) {
    if (isSwitcherSchemeCorrect(graphNodes, subGraphs)) {
      return (
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "10px" }}>
            Переключатель должен соединять основные элементы с резервными
            (минимум с двумя)
          </Modal.Body>
        </Modal>
      );
    }
  }

  if (isIncorrectMOfN(graphNodes, subGraphs)) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Значения элементов типа m из n должны записываться в формате m/n
        </Modal.Body>
      </Modal>
    );
  }

  const [main, children] = getTypes(graphNodes, subGraphs);
  if (!main.mainType || (children && children.length > 0 && children.some((ch) => !ch.childType) )) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          Тип схемы не определен
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <ConditionsFormContent mainTyped={main} childrenTyped={children} />
    </Modal>
  );
};
export default SchemeValidator;

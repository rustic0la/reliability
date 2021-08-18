import React, { FC } from 'react';
import { Modal } from 'react-bootstrap';

import ConditionsFormContent from './ConditionsForm';
import { defineSchemeType } from '../helpers/computations/defineSchemeType';

import {
  hasElementWithoutEdges,
  hasNoInputOrOutput,
  hasIncorrectMOfN,
  isSwitcherSchemeIncorrect,
  hasSwitcher,
  hasNoVertexes,
  isEmptyGraph,
} from '../helpers/validateScheme';
import { mxCell } from 'mxgraph';
import { ERROR_TYPES } from '../constants';

interface SchemeValidatorProps {
  graphNodes: mxCell[];
  show: boolean;
  onHide: () => void;
}

const SchemeValidator: FC<SchemeValidatorProps> = ({
  graphNodes,
  show,
  onHide,
}) => {
  let errorText = null;
  if (isEmptyGraph(graphNodes)) {
    errorText = ERROR_TYPES.graphIsEmpty;
  }

  if (hasNoVertexes(graphNodes)) {
    errorText = ERROR_TYPES.noVertexes;
  }

  if (hasNoInputOrOutput(graphNodes)) {
    errorText = ERROR_TYPES.noInputOrOutput;
  }

  if (hasElementWithoutEdges(graphNodes)) {
    errorText = ERROR_TYPES.elementWithoutEdges;
  }

  if (hasSwitcher(graphNodes) && isSwitcherSchemeIncorrect(graphNodes)) {
    errorText = ERROR_TYPES.switcherSchemeIsIncorrect;
  }

  if (hasIncorrectMOfN(graphNodes)) {
    errorText = ERROR_TYPES.incorrectMOfN;
  }

  const main = defineSchemeType(graphNodes);
  if (!main.mainType) {
    errorText = ERROR_TYPES.noType;
  }

  if (errorText) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Невозможно выполнить вычисление</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '10px' }}>{errorText}</Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <ConditionsFormContent mainTyped={main} />
    </Modal>
  );
};
export default SchemeValidator;

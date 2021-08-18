import React, { FC, useState } from 'react';
import { Button } from 'react-bootstrap';
import { mxCell } from 'mxgraph';

import GraphContainer from './GraphContainer';
import SchemeValidator from './SchemeValidator';

const Editor: FC = () => {
  const [graphNodes, setGraphNodes] = useState<mxCell[]>([]);
  const [showValidator, setShowValidator] = useState(false);

  const handleCalcClick = () => {
    setShowValidator(true);
  };

  const handleHide = () => {
    setShowValidator(false);
  };

  return (
    <>
      <GraphContainer setGraphNodes={setGraphNodes} />
      <Button
        style={{
          fontSize: '16px',
          padding: '3px',
          position: 'absolute',
          top: '3px',
          right: '15px',
          marginTop: '2px',
          background: 'rgb(82, 74, 228)',
          color: '#fff',
        }}
        onClick={handleCalcClick}
      >
        Рассчитать
      </Button>
      {showValidator && (
        <SchemeValidator
          graphNodes={graphNodes}
          show={showValidator}
          onHide={handleHide}
        />
      )}
    </>
  );
};

export default Editor;

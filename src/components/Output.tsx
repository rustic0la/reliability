import React, { FC } from 'react';
import { InputGroup, FormControl, Modal } from 'react-bootstrap';

export interface ResultType {
  Pt: number;
  To: number;
  Tv?: number;
  Kg?: number;
  Kog?: number;
}

interface OutputProps {
  result: ResultType;
  show: boolean;
  onHide: () => void;
}

const Output: FC<OutputProps> = ({ result, show, onHide }) => {
  const { Pt, To, Tv = null, Kg = null, Kog = null } = result;

  return (
    <Modal
      show={show}
      onHide={onHide}
      style={{ backgroundColor: 'rgba(1, 1, 1, 0.5)' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Полученные показатели надежности</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Pt && (
          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Вероятность безотказной работы
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ backgroundColor: '#fff' }}
                value={Pt}
                disabled={true}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="text"
              />
            </InputGroup>
          </div>
        )}
        {To && (
          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Время наработки на отказ
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ backgroundColor: '#fff' }}
                value={To}
                disabled={true}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="text"
              />
            </InputGroup>
          </div>
        )}
        {Tv && (
          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Время восстановления
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ backgroundColor: '#fff' }}
                value={Tv}
                disabled={true}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="text"
              />
            </InputGroup>
          </div>
        )}
        {Kg && (
          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Коэффициент готовности
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ backgroundColor: '#fff' }}
                value={Kg}
                disabled={true}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="text"
              />
            </InputGroup>
          </div>
        )}
        {Kog && (
          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Коэффициент оперативной готовности
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                style={{ backgroundColor: '#fff' }}
                value={Kog}
                disabled={true}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="text"
              />
            </InputGroup>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Output;

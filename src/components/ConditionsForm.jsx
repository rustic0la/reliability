import React, { useState, useCallback } from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import { compute } from "../helpers/calc/helpers";
import Output from "./Output";

const LOADED = "loaded";
const UNLOADED = "unloaded";
const LIGHTWEIGHT = "lightweight";

const ConditionsFormContent = ({ scheme, isReserved, isSwitcher }) => {
  const [recoverable, setRecoverable] = useState(false);
  const [failureRate, setFailureRate] = useState(null);
  const [showFailureRate] = useState(true);

  const [tve, setTve] = useState(null);
  const [reservedMode, setReservedMode] = useState(LOADED);
  const [switcherFailureRate, ] = useState(null);

  const [exploitationTime, setExploitationTime] = useState(0);
  const [output, setOutput] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setOutput(null);
    setShow(false);
  };

  const handleToggleRecoverable = () => {
    setRecoverable(!recoverable);
  };

  const handleFailureRateChange = (e) => {
    setFailureRate(e.target.value);
  };

  const handleTveChange = (e) => {
    setTve(e.target.value);
  };
/*
  const handleSwitcherFailureRateChange = (e) => {
    setSwitcherFailureRate(e.target.value);
  };
*/
  const handleChangeReserve = (e) => {
    setReservedMode(e.target.value);
  };

  const handleExploitationTimeChange = (e) => {
    setExploitationTime(e.target.value);
  };

  const handleCalculateClick = useCallback(() => {
    setShow(true);
    setOutput(
      compute(
        scheme,
        recoverable,
        reservedMode,
        failureRate,
        tve,
        switcherFailureRate,
        exploitationTime
      )
    );
  }, [
    scheme,
    recoverable,
    reservedMode,
    failureRate,
    tve,
    switcherFailureRate,
    exploitationTime,
  ]);

  const data = {
    recovery: [
      { value: "невосстанавливаемые", text: "Невосстанавливаемые" },
      { value: "восстанавливаемые", text: "Восстанавливаемые" },
    ],
    reserve: [
      { value: LOADED, text: "Нагруженный" },
      { value: UNLOADED, text: "Ненагруженный" },
      { value: LIGHTWEIGHT, text: "Облегченный" },
    ],
  };

  return (
    <>
      <div style={{ margin: "20px 50px 0px 20px" }}>
        <div className="form-group">
          <div className="form-item">
            Восстановление работоспособного состояния после отказа:
            <select
              className="form-control"
              id={"recovery"}
              onChange={handleToggleRecoverable}
            >
              {data["recovery"].map(({ value, text }) => (
                <option value={value} key={value}>
                  {text}
                </option>
              ))}
            </select>
            <br />
          </div>

          {showFailureRate && (
            <div className="form-item">
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-md">
                    Интенсивность отказов элемента (число от 0 до 1)
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  onChange={handleFailureRateChange}
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-md"
                  type="number"
                  min="0"
                  required
                />
              </InputGroup>
            </div>
          )}

          {recoverable === true && (
            <div className="form-item">
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-md">
                    Среднее время восстановления элемента ССН
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  onChange={handleTveChange}
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-md"
                  type="number"
                  min="0"
                  required
                />
              </InputGroup>
            </div>
          )}

          {/*isSwitcher && (
            <div className="form-item">
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-md">
                    Интенсивность отказов переключателя (число от 0 до 1)
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  onChange={handleSwitcherFailureRateChange}
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-md"
                  type="number"
                  min="0"
                  required
                />
              </InputGroup>
            </div>
          )*/}

          {isReserved && (
            <div className="form-item">
              Режим резерва:
              <select
                className="form-control"
                id={"recovery"}
                onChange={handleChangeReserve}
              >
                {data["reserve"].map(({ value, text }) => (
                  <option value={value} key={value}>
                    {text}
                  </option>
                ))}
              </select>
              <br />
            </div>
          )}

          <div className="form-item">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Срок эксплуатации (в часах)
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={handleExploitationTimeChange}
                aria-label="Small"
                aria-describedby="inputGroup-sizing-md"
                type="number"
                min="1"
                required
              />
            </InputGroup>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={handleCalculateClick}
          style={{ width: "94%" }}
        >
          Рассчитать
        </Button>
        <Modal
          show={show}
          onHide={handleClose}
          style={{ backgroundColor: "rgba(1, 1, 1, 0.5)" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Полученные показатели надежности</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Output result={output} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ConditionsFormContent;

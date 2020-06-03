import React, { useState, useCallback } from "react";
import { InputGroup, FormControl, Modal, Button } from "react-bootstrap";
import { compute } from "../helpers/calc/helpers";
import Output from "./Output";

const LOADED = "loaded";
const UNLOADED = "unloaded";
const LIGHTWEIGHT = "lightweight";

const ConditionsForm = ({ scheme, isReserved, isSwitcher, isMajority }) => {
  const [isRecoverable, setIsRecoverable] = useState(false);
  const [failureRate, setFailureRate] = useState(null);
  // const [showFailureRate, ] = useState(true);

  const [tve, setTve] = useState(null);
  const [loadedLambda, setLoadedLambda] = useState(null);
  const [reservedMode, setReservedMode] = useState(null);
  const [switcherFailureRate, setSwitcherFailureRate] = useState(null);

  const [firstMajority, setFirstMajority] = useState(null);
  const [secondMajority, setSecondMajority] = useState(null);

  const [exploitationTime, setExploitationTime] = useState(0);
  const [output, setOutput] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setOutput(null);
    setShow(false);
  };

  const handleToggleRecoverable = () => {
    setIsRecoverable(!isRecoverable);
  };

  const handleFailureRateChange = (e) => {
    setFailureRate(e.target.value);
  };

  const handleTveChange = (e) => {
    setTve(e.target.value);
  };

  const handleLoadedLambda = (e) => {
    setLoadedLambda(e.target.value);
  };

  const handleSwitcherFailureRateChange = (e) => {
    setSwitcherFailureRate(e.target.value);
  };

  const handleFirstMajorityChange = (e) => {
    setFirstMajority(e.target.value);
  };

  const handleSecondMajorityChange = (e) => {
    setSecondMajority(e.target.value);
  };

  const handleChangeReserve = (e) => {
    setReservedMode(e.target.value);
  };

  const handleExploitationTimeChange = (e) => {
    setExploitationTime(e.target.value);
  };

  const handleCalculateClick = useCallback(() => {
    setShow(true);
    setOutput(
      compute({
        scheme,
        isRecoverable,
        reservedMode,
        failureRate,
        tve,
        switcherFailureRate,
        exploitationTime,
        loadedLambda,
        firstMajority,
        secondMajority,
      })
    );
  }, [
    scheme,
    isRecoverable,
    reservedMode,
    failureRate,
    tve,
    switcherFailureRate,
    exploitationTime,
    loadedLambda,
    firstMajority,
    secondMajority,
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
      <Modal.Header closeButton>
        <Modal.Title>Параметры эксплуатации</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "0", paddingBottom: "20px" }}>
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

              {isMajority ? (
                <>
                  <div className="form-item">
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-md">
                          Интенсивность отказов элементов 1
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        onChange={handleFirstMajorityChange}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-md"
                        type="number"
                        min="0"
                        required
                      />
                    </InputGroup>
                  </div>
                  <div className="form-item">
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-md">
                          Интенсивность отказов элементов 2
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        onChange={handleSecondMajorityChange}
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-md"
                        type="number"
                        min="0"
                        required
                      />
                    </InputGroup>
                  </div>
                </>
              ) : (
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

              {isRecoverable === true && (
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

              {isSwitcher && (
                <div className="form-item">
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-md">
                        Интенсивность отказов переключателя (число от 0 до 1)
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      onChange={handleSwitcherFailureRateChange}
                      placeholder="0"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-md"
                      type="number"
                      min="0"
                      required={true}
                    />
                  </InputGroup>
                </div>
              )}

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
              {isReserved && reservedMode === LIGHTWEIGHT && (
                <div className="form-item">
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-md">
                        Инт. отказов элементов ССН в нагруженном режиме
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      onChange={handleLoadedLambda}
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-md"
                      type="number"
                      min="0"
                      required
                    />
                  </InputGroup>
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
            {show && (
              <Output result={output} show={show} onHide={handleClose} />
            )}
          </div>

      </Modal.Body>
    </>
  );
};

export default ConditionsForm;

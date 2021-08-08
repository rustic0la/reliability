import React, { useState, useCallback, FC, SyntheticEvent } from 'react';
import { InputGroup, FormControl, Modal, Button } from 'react-bootstrap';
import Output, { ResultType } from './Output';
import FormItem from './FormItem';
import { LOADED } from '../helpers/computations/constants';
import { computeCharacteristics } from '../helpers/computations/computeCharacteristics';

interface ConditionsFormProps {
    mainTyped: any;
    childrenTyped: any;
}

const ConditionsForm: FC<ConditionsFormProps> = ({
    mainTyped,
    childrenTyped,
}) => {
    const [isRecoverable, setIsRecoverable] = useState(false);
    const [failureRate, setFailureRate] = useState({});

    const [tve, setTve] = useState({});
    const [loadedLambda, setLoadedLambda] = useState({});
    const [reservedMode, setReservedMode] = useState({ main: LOADED });
    const [switcherFailureRate, setSwitcherFailureRate] = useState({});

    const [firstMajority, setFirstMajority] = useState({});
    const [secondMajority, setSecondMajority] = useState({});

    const [exploitationTime, setExploitationTime] = useState(0);
    const [output, setOutput] = useState<ResultType | null>(null);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setOutput(null);
        setShow(false);
    };

    const handleToggleRecoverable = () => {
        setIsRecoverable(!isRecoverable);
    };

    const handleExploitationTimeChange = (e: SyntheticEvent) => {
        // @ts-ignore
        setExploitationTime(e.target.value);
    };

    const handleCalculateClick = useCallback(() => {
        setShow(true);
        setOutput(
            computeCharacteristics({
                mainTyped,
                isRecoverable,
                reservedMode,
                failureRate,
                tve,
                switcherFailureRate,
                exploitationTime,
                loadedLambda,
                firstMajority,
                secondMajority,
            }),
        );
    }, [
        mainTyped,
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
            { value: 'невосстанавливаемые', text: 'Невосстанавливаемые' },
            { value: 'восстанавливаемые', text: 'Восстанавливаемые' },
        ],
    };
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Параметры эксплуатации</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '0', paddingBottom: '20px' }}>
                <div style={{ margin: '20px 50px 0px 20px' }}>
                    <div className="form-group">
                        <div className="form-item">
                            Восстановление работоспособного состояния после
                            отказа:
                            <select
                                className="form-control"
                                id={'recovery'}
                                onChange={handleToggleRecoverable}
                            >
                                {data['recovery'].map(({ value, text }) => (
                                    <option value={value} key={value}>
                                        {text}
                                    </option>
                                ))}
                            </select>
                            <br />
                        </div>
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
                    <FormItem
                        id={'main'}
                        type={mainTyped.mainType}
                        failureRate={failureRate}
                        setFailureRate={setFailureRate}
                        loadedLambda={loadedLambda}
                        setLoadedLambda={setLoadedLambda}
                        reservedMode={reservedMode}
                        setReservedMode={setReservedMode}
                        isRecoverable={isRecoverable}
                        firstMajority={firstMajority}
                        setFirstMajority={setFirstMajority}
                        secondMajority={secondMajority}
                        setSecondMajority={setSecondMajority}
                        switcherFailureRate={switcherFailureRate}
                        setSwitcherFailureRate={setSwitcherFailureRate}
                        tve={tve}
                        setTve={setTve}
                    />
                    {childrenTyped.length > 0 &&
                        childrenTyped.map((childScheme: any) => (
                            <FormItem
                                id={childScheme.child.key}
                                type={childScheme.childType}
                                failureRate={failureRate}
                                setFailureRate={setFailureRate}
                                loadedLambda={loadedLambda}
                                setLoadedLambda={setLoadedLambda}
                                reservedMode={reservedMode}
                                setReservedMode={setReservedMode}
                                isRecoverable={isRecoverable}
                                firstMajority={firstMajority}
                                setFirstMajority={setFirstMajority}
                                secondMajority={secondMajority}
                                setSecondMajority={setSecondMajority}
                                switcherFailureRate={switcherFailureRate}
                                setSwitcherFailureRate={setSwitcherFailureRate}
                                tve={tve}
                                setTve={setTve}
                            />
                        ))}

                    <Button
                        variant="secondary"
                        onClick={handleCalculateClick}
                        style={{ width: '94%' }}
                    >
                        Рассчитать
                    </Button>
                    {show && output && (
                        <Output
                            result={output}
                            show={show}
                            onHide={handleClose}
                        />
                    )}
                </div>
            </Modal.Body>
        </>
    );
};

export default ConditionsForm;

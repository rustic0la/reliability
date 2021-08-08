import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { types } from '../helpers/calculations/utils/utils';

const LOADED = 'loaded';
const UNLOADED = 'unloaded';
const LIGHTWEIGHT = 'lightweight';

const typesRus = {
    serial: 'последовательная',
    parallel: 'параллельная',
    reserved_loaded: 'резервированная нагруженная',
    reserved_unloaded: 'резервированная ненагруженная',
    reserved_lightweight: 'резервированная облегченная',
    majority: 'мажоритарная',
    two_majorities: 'последовательная из двух мажоритарных',
    reserved_with_switcher: 'резервированная с переключателем',
    reserved: 'резервированнная',
};

const FormItem = ({
    id,
    type,
    failureRate,
    setFailureRate,
    loadedLambda,
    setLoadedLambda,
    reservedMode,
    setReservedMode,
    isRecoverable,
    firstMajority,
    setFirstMajority,
    secondMajority,
    setSecondMajority,
    switcherFailureRate,
    setSwitcherFailureRate,
    tve,
    setTve,
}) => {
    const handleFailureRateChange = (e) => {
        setFailureRate({ ...failureRate, [id]: e.target.value });
    };

    const handleTveChange = (e) => {
        setTve({ ...tve, [id]: e.target.value });
    };

    const handleLoadedLambda = (e) => {
        setLoadedLambda({ ...loadedLambda, [id]: e.target.value });
    };

    const handleSwitcherFailureRateChange = (e) => {
        setSwitcherFailureRate({
            ...switcherFailureRate,
            [id]: e.target.value,
        });
    };

    const handleFirstMajorityChange = (e) => {
        setFirstMajority({ ...firstMajority, [id]: e.target.value });
    };

    const handleSecondMajorityChange = (e) => {
        setSecondMajority({ ...secondMajority, [id]: e.target.value });
    };

    const handleChangeReserve = (e) => {
        setReservedMode({ ...reservedMode, [id]: e.target.value });
    };

    const data = {
        reserve: [
            { value: LOADED, text: 'Нагруженный' },
            { value: UNLOADED, text: 'Ненагруженный' },
            { value: LIGHTWEIGHT, text: 'Облегченный' },
        ],
    };
    return (
        <div>
            <hr></hr>
            {id !== '0' ? (
                <h6>
                    Вложенная схема элемента {id} ({typesRus[type]})
                </h6>
            ) : (
                <h6>Основная схема ({typesRus[type]})</h6>
            )}
            {type === types.MAJORITY && (
                <div>
                    <div className="form-item">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-md">
                                    Интенсивность отказов элементов 1 (1/ч)
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
                                    Интенсивность отказов элементов 2 (1/ч)
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
                </div>
            )}
            <div className="form-item">
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-md">
                            Интенсивность отказов элемента (1/ч)
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
            {isRecoverable === true && (
                <div className="form-item">
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-md">
                                Среднее время восстановления элемента ССН (ч)
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
            {type === types.RESERVED_WITH_SWITCHER && (
                <div className="form-item">
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-md">
                                Интенсивность отказов переключателя (1/ч)
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            onChange={handleSwitcherFailureRateChange}
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-md"
                            type="number"
                            min="0"
                            required={true}
                        />
                    </InputGroup>
                </div>
            )}
            {type === types.RESERVED && (
                <div className="form-item">
                    Режим резерва:
                    <select
                        className="form-control"
                        id={'recovery'}
                        onChange={handleChangeReserve}
                    >
                        {data['reserve'].map(({ value, text }) => (
                            <option value={value} key={value}>
                                {text}
                            </option>
                        ))}
                    </select>
                    <br />
                </div>
            )}
            {type === types.RESERVED && reservedMode[id] === LIGHTWEIGHT && (
                <div className="form-item">
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-md">
                                Инт. отказов эл-тов ССН в нагруженном режиме
                                (1/ч)
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
        </div>
    );
};

export default FormItem;

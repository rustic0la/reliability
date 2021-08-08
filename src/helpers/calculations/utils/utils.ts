import { recoverable } from '../formulas/recoverableSchemeType';
import { unrecoverable } from '../formulas/unrecoverableSchemeType';

import { isParallel } from '../../defineSchemeType/types';
import {
    isReservedWithSwitcher,
    isTwoMajorities,
    isMajority,
    isSerial,
} from '../../defineSchemeType';

export const LOADED = 'loaded';
const UNLOADED = 'unloaded';
const LIGHTWEIGHT = 'lightweight';

export const types = {
    SERIAL: 'serial',
    PARALLEL: 'parallel',
    RESERVED: 'reserved',
    RESERVED_LOADED: 'reserved_loaded',
    RESERVED_UNLOADED: 'reserved_unloaded',
    RESERVED_LIGHTWEIGHT: 'reserved_lightweight',
    MAJORITY: 'majority',
    TWO_MAJORITIES: 'two_majorities',
    RESERVED_WITH_SWITCHER: 'reserved_with_switcher',
};

export enum SCHEME_TYPE {
    SERIAL,
    PARALLEL,
    RESERVED,
    RESERVED_LOADED,
    RESERVED_UNLOADED,
    RESERVED_LIGHTWEIGHT,
    MAJORITY,
    TWO_MAJORITIES,
    RESERVED_WITH_SWITCHER,
}

const filterData = (data) => {
    const propsToFilter = [
        'TRANSLATE_CONTROL_POINTS',
        'alternateBounds',
        'offset',
        'relative',
        'connectable',
        'visible',
        'collapsed',
        'mxTransient',
    ];

    for (let i of data) {
        for (let prop in i) {
            if (propsToFilter.includes(prop)) {
                delete i[prop];
            }
        }
    }
    return data;
};

const restoreGraphStructure = (graphStructureNodes, subGraphs) => {
    filterData(graphStructureNodes);

    for (let subGraph of subGraphs) {
        const [id, graph] = subGraph;
        for (let layerGraph of subGraphs.map((i) => i[1])) {
            const cell = layerGraph.find((cell) => cell.mxObjectId === id);
            if (cell) {
                cell.children = graph;
            }
        }
    }

    for (let i of graphStructureNodes) {
        for (let subGraph of subGraphs) {
            const [id, data] = subGraph;

            if (i.mxObjectId === id) {
                i.children = data;
            }
        }
    }

    return graphStructureNodes;
};

/** определяем тип схемы */
const getType = (schemeObj, schemeType) => {
    const scheme = schemeType === 'children' ? schemeObj.scheme : schemeObj;
    const inputId =
        scheme.find((node) => node.style === 'input') &&
        scheme.find((node) => node.style === 'input').id;
    const outputId =
        scheme.find((node) => node.style === 'output') &&
        scheme.find((node) => node.style === 'output').id;

    const types = {
        SERIAL: 'serial',
        PARALLEL: 'parallel',
        RESERVED: 'reserved',
        MAJORITY: 'majority',
        TWO_MAJORITIES: 'two_majorities',
        RESERVED_WITH_SWITCHER: 'reserved_with_switcher',
    };

    if (isSerial(scheme, inputId, outputId)) {
        console.log(types.SERIAL);
        return types.SERIAL;
    }

    if (isParallel(scheme, inputId, outputId)) {
        console.log(types.PARALLEL);
        return types.PARALLEL;
    }

    if (isMajority(scheme, inputId, outputId)) {
        console.log(types.MAJORITY);
        return types.MAJORITY;
    }

    if (isTwoMajorities(scheme, inputId, outputId)) {
        console.log(types.TWO_MAJORITIES);
        return types.TWO_MAJORITIES;
    }

    if (isReservedWithSwitcher(scheme)) {
        console.log(types.RESERVED_WITH_SWITCHER);
        return types.RESERVED_WITH_SWITCHER;
    }

    const vertexes = scheme
        .filter((node) => node.vertex)
        .filter((node) => node.style !== 'input' && node.style !== 'output');

    /** резервированная */
    if (vertexes.find((v) => v.style === 'loaded')) {
        console.log(types.RESERVED);
        return types.RESERVED;
    }

    return null;
};

/** пытаемся получить данные о типе основного и дочерних графов */
export const getTypes = (mainScheme, childSchemes, reservedMode) => {
    const type = getType(mainScheme, 'main', reservedMode);
    const main = {
        main: mainScheme,
        mainType: type,
    };

    const children =
        childSchemes &&
        childSchemes.length > 0 &&
        childSchemes.map((layer) => {
            const type = getType(layer, 'children', reservedMode);
            return {
                child: layer,
                childType: type,
            };
        });

    return [main, children];
};

export const compute = ({
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
}) => {
    let mainWithReserveMode;
    let typeReserved;
    if (mainTyped.mainType === types.RESERVED) {
        switch (reservedMode.main) {
            case LOADED:
                typeReserved = types.RESERVED_LOADED;
                break;
            case UNLOADED:
                typeReserved = types.RESERVED_UNLOADED;
                break;
            case LIGHTWEIGHT:
                typeReserved = types.RESERVED_LIGHTWEIGHT;
                break;
            default:
                break;
        }
        mainWithReserveMode = {
            main: mainTyped.main,
            mainType: typeReserved,
        };
    } else {
        mainWithReserveMode = mainTyped;
    }

    const maxFailureRate = Math.max(
        Object.values(failureRate).map((v) => Number(v)),
    );

    const { main, mainType } = mainWithReserveMode;
    const rectNum: number = main.filter((v) => v.style === 'rectangle').length;
    const loadedNum: number = main.filter((v) => v.style === 'loaded').length;
    const loadedLambdaMain = loadedLambda.main;
    if (!isRecoverable) {
        let args = [];

        switch (mainType) {
            case types.SERIAL:
                args = [rectNum, maxFailureRate, +exploitationTime];
                break;
            case types.PARALLEL:
                args = [rectNum, maxFailureRate, +exploitationTime];
                break;
            case types.RESERVED_LOADED:
                args = [rectNum, loadedNum, maxFailureRate, +exploitationTime];
                break;
            case types.RESERVED_UNLOADED:
                args = [rectNum, loadedNum, maxFailureRate, +exploitationTime];
                break;
            case types.RESERVED_LIGHTWEIGHT:
                args = [
                    rectNum,
                    loadedNum,
                    maxFailureRate,
                    maxFailureRate / +loadedLambdaMain,
                    exploitationTime,
                ];
                break;
            case types.MAJORITY:
                args = [+firstMajority, +secondMajority, +exploitationTime];
                break;
            case types.TWO_MAJORITIES:
                args = [+firstMajority, +secondMajority, +exploitationTime];
                break;
            case types.RESERVED_WITH_SWITCHER:
                args = [
                    rectNum,
                    loadedNum,
                    maxFailureRate,
                    +switcherFailureRate,
                    +exploitationTime,
                ];
                break;
            default:
                break;
        }
        return {
            Pt: Number(unrecoverable[mainType].p(...args)).toFixed(15),
            To: Number(
                unrecoverable[mainType].to(...args.slice(0, -1)),
            ).toFixed(15),
        };
    } else {
        let kgArgs = [];
        let toArgs = [];
        let tvArgs = [];
        let pArgs = [];
        let kogArgs = [];
        let to = null;
        let kg = null;
        let tv = null;
        switch (mainType) {
            case types.SERIAL:
                kgArgs = [rectNum, maxFailureRate, +tve[0]];
                toArgs = [rectNum, maxFailureRate];
                kg = recoverable.serial.kg(...kgArgs);
                to = recoverable.serial.to(...toArgs);
                tvArgs = [kg, to];
                pArgs = [rectNum, maxFailureRate, +exploitationTime];
                kogArgs = [rectNum, maxFailureRate, +tve[0], +exploitationTime];
                break;
            case types.PARALLEL:
                kgArgs = [rectNum, maxFailureRate, +tve[0]];
                toArgs = [rectNum, maxFailureRate];
                kg = recoverable.parallel.kg(...kgArgs);
                to = recoverable.parallel.to(...toArgs);
                tvArgs = [kg, to];
                pArgs = [rectNum, maxFailureRate, +exploitationTime];
                kogArgs = [rectNum, maxFailureRate, +tve[0], +exploitationTime];
                break;
            case types.RESERVED_LOADED:
                toArgs = [rectNum, loadedNum, maxFailureRate, +tve[0]];
                to = recoverable.reserved_loaded.to(...toArgs);
                tvArgs = [+tve[0], loadedNum];
                tv = recoverable.reserved_loaded.tv(...tvArgs);
                kgArgs = [tv, to];
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            case types.RESERVED_UNLOADED:
                tvArgs = [+tve[0], loadedNum];
                tv = recoverable.reserved_unloaded.tv(...tvArgs);
                toArgs = [rectNum, loadedNum, maxFailureRate, +tve[0]];
                to = recoverable.reserved_unloaded.to(...toArgs);
                kgArgs = [tv, to];
                kg = recoverable.reserved_unloaded.kg(...kgArgs);
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            case types.RESERVED_LIGHTWEIGHT:
                tvArgs = [+tve[0], loadedNum];
                tv = recoverable.reserved_lightweight.tv(...tvArgs);
                toArgs = [
                    rectNum,
                    loadedNum,
                    maxFailureRate,
                    +tve[0],
                    maxFailureRate / +loadedLambdaMain,
                ];
                to = recoverable.reserved_lightweight.to(...toArgs);
                kgArgs = [tv, to];
                kg = recoverable.reserved_lightweight.kg(...kgArgs);
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            case types.MAJORITY:
                toArgs = [+firstMajority, +secondMajority, +tve[0]];
                to = recoverable.majority.to(...toArgs);
                tvArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
                tv = recoverable.majority.tv(...tvArgs);
                kgArgs = [tv, to];
                kg = recoverable.majority.kg(...kgArgs);
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            case types.TWO_MAJORITIES:
                toArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
                to = recoverable.two_majorities.to(...toArgs);
                tvArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
                tv = recoverable.two_majorities.tv(...tvArgs);
                kgArgs = [tv, to];
                kg = recoverable.two_majorities.kg(...kgArgs);
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            case types.RESERVED_WITH_SWITCHER:
                kgArgs = [
                    rectNum,
                    loadedNum,
                    maxFailureRate,
                    +switcherFailureRate,
                    +tve[0],
                ];
                toArgs = [
                    rectNum,
                    loadedNum,
                    maxFailureRate,
                    +switcherFailureRate,
                    +tve[0],
                ];
                kg = recoverable.reserved_with_switcher.kg(...kgArgs);
                to = recoverable.reserved_with_switcher.to(...toArgs);
                tvArgs = [to, kg];
                pArgs = [to, +exploitationTime];
                kogArgs = [kg, +exploitationTime, to];
                break;
            default:
                break;
        }
        return {
            Pt: Number(recoverable[mainType].p(...pArgs)).toFixed(15),
            To: Number(recoverable[mainType].to(...toArgs)).toFixed(15),
            Tv: Number(recoverable[mainType].tv(...tvArgs)).toFixed(15),
            Kg: Number(recoverable[mainType].kg(...kgArgs)).toFixed(15),
            Kog: Number(recoverable[mainType].kog(...kogArgs)).toFixed(15),
        };
    }
};

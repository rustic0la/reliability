import { unrecoverable } from '../formulas/unrecoverableSchemeType';
import { recoverable } from '../formulas/recoverableSchemeType';
import { LIGHTWEIGHT, LOADED, types, UNLOADED } from './constants';
import { mxCell } from 'mxgraph';

interface ComputeCharacteristicsProps {
  mainTyped: {
    main: mxCell[];
    mainType: string;
  };
  isRecoverable: boolean;
  reservedMode: any;
  failureRate: any;
  tve: any;
  switcherFailureRate: any;
  exploitationTime: number;
  loadedLambda: any;
  firstMajority: any;
  secondMajority: any;
}

export interface ComputeCharacteristicsRes {
  Pt: number;
  To: number;
  Tv?: number;
  Kg?: number;
  Kog?: number;
}

export const computeCharacteristics = ({
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
}: ComputeCharacteristicsProps): ComputeCharacteristicsRes => {
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
    ...Object.values(failureRate).map((v) => Number(v)),
  );

  const { main, mainType } = mainWithReserveMode;
  const rectNum: number = main.filter(
    (vertex: mxCell) => vertex.style === 'rectangle',
  ).length;
  const loadedNum: number = main.filter(
    (vertex: mxCell) => vertex.style === 'loaded',
  ).length;
  const loadedLambdaMain = loadedLambda.main;
  if (!isRecoverable) {
    let args: string | any[] = [];

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
      // @ts-ignore
      Pt: +Number(unrecoverable[mainType].p(...args)).toFixed(15),
      To: +Number(
        // @ts-ignore
        unrecoverable[mainType].to(...args.slice(0, -1)),
      ).toFixed(15),
    };
  } else {
    let kgArgs: number[] = [];
    let toArgs: number[] = [];
    let tvArgs: number[] = [];
    let pArgs: number[] = [];
    let kogArgs: (number | null)[] = [];
    let to = null;
    let kg = null;
    let tv = null;
    switch (mainType) {
      case types.SERIAL:
        kgArgs = [rectNum, maxFailureRate, +tve[0]];
        toArgs = [rectNum, maxFailureRate];
        // @ts-ignore
        kg = recoverable.serial.kg(...kgArgs);
        // @ts-ignore
        to = recoverable.serial.to(...toArgs);
        tvArgs = [kg, to];
        pArgs = [rectNum, maxFailureRate, +exploitationTime];
        kogArgs = [rectNum, maxFailureRate, +tve[0], +exploitationTime];
        break;
      case types.PARALLEL:
        kgArgs = [rectNum, maxFailureRate, +tve[0]];
        toArgs = [rectNum, maxFailureRate];
        // @ts-ignore
        kg = recoverable.parallel.kg(...kgArgs);
        // @ts-ignore
        to = recoverable.parallel.to(...toArgs);
        tvArgs = [kg, to];
        pArgs = [rectNum, maxFailureRate, +exploitationTime];
        kogArgs = [rectNum, maxFailureRate, +tve[0], +exploitationTime];
        break;
      case types.RESERVED_LOADED:
        toArgs = [rectNum, loadedNum, maxFailureRate, +tve[0]];
        // @ts-ignore
        to = recoverable.reserved_loaded.to(...toArgs);
        tvArgs = [+tve[0], loadedNum];
        // @ts-ignore
        tv = recoverable.reserved_loaded.tv(...tvArgs);
        kgArgs = [tv, to];
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.RESERVED_UNLOADED:
        tvArgs = [+tve[0], loadedNum];
        // @ts-ignore
        tv = recoverable.reserved_unloaded.tv(...tvArgs);
        toArgs = [rectNum, loadedNum, maxFailureRate, +tve[0]];
        // @ts-ignore
        to = recoverable.reserved_unloaded.to(...toArgs);
        kgArgs = [tv, to];
        // @ts-ignore
        kg = recoverable.reserved_unloaded.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.RESERVED_LIGHTWEIGHT:
        tvArgs = [+tve[0], loadedNum];
        // @ts-ignore
        tv = recoverable.reserved_lightweight.tv(...tvArgs);
        toArgs = [
          rectNum,
          loadedNum,
          maxFailureRate,
          +tve[0],
          maxFailureRate / +loadedLambdaMain,
        ];
        // @ts-ignore
        to = recoverable.reserved_lightweight.to(...toArgs);
        kgArgs = [tv, to];
        // @ts-ignore
        kg = recoverable.reserved_lightweight.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.MAJORITY:
        toArgs = [+firstMajority, +secondMajority, +tve[0]];
        // @ts-ignore
        to = recoverable.majority.to(...toArgs);
        tvArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
        // @ts-ignore
        tv = recoverable.majority.tv(...tvArgs);
        kgArgs = [tv, to];
        // @ts-ignore
        kg = recoverable.majority.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.TWO_MAJORITIES:
        toArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
        // @ts-ignore
        to = recoverable.two_majorities.to(...toArgs);
        tvArgs = [+firstMajority, +secondMajority, +tve[0], +tve[0]];
        // @ts-ignore
        tv = recoverable.two_majorities.tv(...tvArgs);
        kgArgs = [tv, to];
        // @ts-ignore
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
        // @ts-ignore
        kg = recoverable.reserved_with_switcher.kg(...kgArgs);
        // @ts-ignore
        to = recoverable.reserved_with_switcher.to(...toArgs);
        tvArgs = [to, kg];
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      default:
        break;
    }
    return {
      // @ts-ignore
      Pt: +Number(recoverable[mainType].p(...pArgs)).toFixed(15),
      // @ts-ignore
      To: +Number(recoverable[mainType].to(...toArgs)).toFixed(15),
      // @ts-ignore
      Tv: +Number(recoverable[mainType].tv(...tvArgs)).toFixed(15),
      // @ts-ignore
      Kg: +Number(recoverable[mainType].kg(...kgArgs)).toFixed(15),
      // @ts-ignore
      Kog: +Number(recoverable[mainType].kog(...kogArgs)).toFixed(15),
    };
  }
};

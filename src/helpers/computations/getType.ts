import { mxCell } from 'mxgraph';

import {
  isMajority,
  isParallel,
  isReservedWithSwitcher,
  isSerial,
  isTwoMajorities,
} from '../defineSchemeType';

const types = {
  SERIAL: 'serial',
  PARALLEL: 'parallel',
  RESERVED: 'reserved',
  MAJORITY: 'majority',
  TWO_MAJORITIES: 'two_majorities',
  RESERVED_WITH_SWITCHER: 'reserved_with_switcher',
};

/** определяем тип схемы */
export const getType = (
  schemeObj: mxCell[],
  schemeType: string,
): string | null => {
  const scheme: mxCell[] =
    // @ts-ignore
    schemeType === 'children' ? schemeObj.scheme : schemeObj;
  const inputId =
    scheme.find((node) => node.style === 'input') &&
    scheme.find((node) => node.style === 'input')?.id;
  const outputId =
    scheme.find((node) => node.style === 'output') &&
    scheme.find((node) => node.style === 'output')?.id;

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

export const LOADED = 'loaded';
export const UNLOADED = 'unloaded';
export const LIGHTWEIGHT = 'lightweight';

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

export const ERROR_TYPES = {
  graphIsEmpty: 'Отсутствует структурная схема',
  noVertexes: 'Отсутствуют основные блоки',
  noInputOrOutput: 'Схема должна содержать входной и выходной элементы',
  elementWithoutEdges: 'Схема не должна содержать элементы без соединения',
  switcherSchemeIsIncorrect:
    'Переключатель должен соединять основные элементы с резервными (минимум с двумя)',
  incorrectMOfN:
    'Значения элементов типа m из n должны записываться в формате m/n',
  noType: 'Тип схемы не определен',
};

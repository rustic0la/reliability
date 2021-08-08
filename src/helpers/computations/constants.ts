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

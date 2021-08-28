import * as fn from './unrecoverableTypes';

export const unrecoverable = {
  /** Последовательная РЭА из n элементов */
  serial: {
    p: (n: number, lamb: number, t: number): number =>
      fn.getSerialP(n, lamb, t),
    to: (n: number, lamb: number): number => fn.getSerialTo(n, lamb),
  },
  /** Параллельная РЭА из n элементов */
  parallel: {
    p: (n: number, lamb: number, t: number): number =>
      fn.getParallelP(n, lamb, t),
    to: (n: number, lamb: number): number => fn.getParallelTo(n, lamb),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв нагруженный */
  reserved_loaded: {
    p: (n: number, m: number, lambda: number, t: number): number =>
      fn.getReservedLoadedP(n, m, lambda, t),
    to: (n: number, m: number, lambda: number): number =>
      fn.getReservedLoadedTo(n, m, lambda),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв ненагруженный */
  reserved_lightweight: {
    p: (
      n: number,
      m: number,
      lambda: number,
      alpha: number,
      t: number,
    ): number => fn.getReservedLightweightP(n, m, lambda, alpha, t),
    to: (n: number, m: number, lambda: number, alpha: number): number =>
      fn.getReservedLightweightTo(n, m, lambda, alpha),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв облегченный */
  reserved_unloaded: {
    p: (n: number, m: number, lambda: number, t: number): number =>
      fn.getReservedUnloadedP(n, m, lambda, t),
    to: (n: number, m: number, lambda: number): number =>
      fn.getReservedUnloadedTo(n, m, lambda),
  },
  /** Резерв нагруженный, элементы ССН одинаковые, ненадежный переключатель */
  reserved_with_switcher: {
    p: (
      n: number,
      m: number,
      lambda: number,
      switcher: number,
      t: number,
    ): number => fn.getReservedWithSwitcherP(n, m, lambda, switcher, t),
    to: (n: number, m: number, lambda: number, switcher: number): number =>
      fn.getReservedWithSwitcherTo(n, m, lambda, switcher),
  },
  /** Мажоритарная схема, работающая по условию “2 из 3” */
  majority: {
    p: (lambda1: number, lambda2: number, t: number): number =>
      fn.getMajorityP(lambda1, lambda2, t),
    to: (lambda1: number, lambda2: number): number =>
      fn.getMajorityTo(lambda1, lambda2),
  },
  /** Последовательное включение двух мажоритарных схем, работающих по условию “2 из 3” */
  two_majorities: {
    p: (lambda1: number, lambda2: number, t: number): number =>
      fn.getTwoMajoritiesP(lambda1, lambda2, t),
    to: (lambda1: number, lambda2: number): number =>
      fn.getTwoMajoritiesTo(lambda1, lambda2),
  },
};

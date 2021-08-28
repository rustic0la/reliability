import * as fn from './recoverableTypes';

export const recoverable = {
  /** Последовательная РЭА из n элементов */
  serial: {
    kg: (n: number, lamb: number, tve: number): number =>
      fn.getSerialKg(n, lamb, tve),
    to: (n: number, lamb: number): number => fn.getSerialTo(n, lamb),
    tv: (kg: number, to: number): number => fn.getSerialTv(kg, to),
    p: (n: number, lamb: number, t: number): number => fn.getSerialP(n, lamb, t),
    kog: (n: number, lamb: number, tve: number, t: number): number =>
      fn.getSerialKog(n, lamb, tve, t),
  },
  /** Параллельная РЭА из n элементов */
  parallel: {
    kg: (n: number, lamb: number, tve: number): number =>
      fn.getSerialKg(n, lamb, tve),
    to: (n: number, lamb: number): number => fn.getParallelTo(n, lamb),
    tv: (kg: number, to: number): number => fn.getParallelTv(kg, to),
    p: (n: number, lamb: number, t: number): number => fn.getParallelP(n, lamb, t),
    kog: (n: number, lamb: number, tve: number, t: number): number =>
      fn.getParallelKog(n, lamb, tve, t),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв нагруженный */
  reserved_loaded: {
    kg: (tv: number, to: number): number => fn.getReservedLoadedKg(tv, to),
    to: (n: number, m: number, lambda: number, tve: number): number =>
      fn.getReservedLoadedTo(n, m, lambda, tve),
    tv: (tve: number, m: number): number => fn.getReservedLoadedTv(tve, m),
    p: (to: number, t: number): number => fn.getReservedLoadedP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      fn.getReservedLoadedKog(kg, t, to),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв ненагруженный */
  reserved_unloaded: {
    kg: (tv: number, to: number): number => fn.getReservedUnloadedKg(tv, to),
    to: (n: number, m: number, lambda: number, tve: number): number =>
      fn.getReservedUnloadedTo(n, m, lambda, tve),
    tv: (tve: number, m: number): number => fn.getReservedUnloadedTv(tve, m),
    p: (to: number, t: number): number => fn.getReservedUnloadedP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      fn.getReservedUnloadedKog(kg, t, to),
  },
  /** Резервированная РЭА из n основных и m резервных элементов. Резерв облегченный */
  reserved_lightweight: {
    kg: (tv: number, to: number): number => gerReservedLightweightKg(tv, to),
    to: (
      n: number,
      m: number,
      lambda: number,
      tve: number,
      alpha: number,
    ): number => gerReservedLightweightTo(n, m, lambda, tve, alpha),
    tv: (tve: number, m: number): number => gerReservedLightweightTv(tve, m),
    p: (to: number, t: number): number => gerReservedLightweightP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      gerReservedLightweightKog(kg, t, to),
  },
  /** Резерв нагруженный, элементы ССН одинаковые, ненадежный переключатель */
  reserved_with_switcher: {
    kg: (
      n: number,
      m: number,
      lambda: number,
      switcher: number,
      tve: number,
    ): number => fn.getReservedWithSwitcherKg(n, m, lambda, switcher, tve),
    to: (
      n: number,
      m: number,
      lambda: number,
      switcher: number,
      tve: number,
    ): number => fn.getReservedWithSwitcherTo(n, m, lambda, switcher, tve),
    tv: (to: number, kg: number): number => fn.getReservedWithSwitcherTv(to, kg),
    p: (to: number, t: number): number => fn.getReservedWithSwitcherP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      fn.getReservedWithSwitcherKog(kg, t, to),
  },
  /** Мажоритарная схема, работающая по условию “2 из 3” */
  majority: {
    kg: (tv: number, to: number): number => fn.getMajorityKg(tv, to),
    to: (lambda1: number, lambda2: number, tve1: number): number =>
      fn.getMajorityTo(lambda1, lambda2, tve1),
    tv: (
      lambda1: number,
      lambda2: number,
      tve1: number,
      tve2: number,
    ): number => fn.getMajorityTv(lambda1, lambda2, tve1, tve2),
    p: (to: number, t: number): number => fn.getMajorityP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      fn.getMajorityKog(kg, t, to),
  },
  /** Последовательное включение двух мажоритарных схем, работающих по условию “2 из 3” */
  two_majorities: {
    kg: (tv: number, to: number): number => fn.getTwoMajoritiesKg(tv, to),
    to: (
      lambda1: number,
      lambda2: number,
      tve1: number,
      tve2: number,
    ): number => fn.getTwoMajoritiesTo(lambda1, lambda2, tve1, tve2),
    tv: (
      lambda1: number,
      lambda2: number,
      tve1: number,
      tve2: number,
    ): number => fn.getTwoMajoritiesTv(lambda1, lambda2, tve1, tve2),
    p: (to: number, t: number): number => fn.getTwoMajoritiesP(to, t),
    kog: (kg: number, t: number, to: number): number =>
      fn.getTwoMajoritiesKog(kg, t, to),
  },
};

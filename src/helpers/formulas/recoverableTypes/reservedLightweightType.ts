import { factorial } from "../helpers";

/** Коэффициент готовности */
export const gerReservedLightweightKg = (tv: number, to: number): number =>
  1 / (1 + tv / to);

/** Средняя наработка до отказа */
export const gerReservedLightweightTo = (
  n: number,
  m: number,
  lambda: number,
  tve: number,
  alpha: number,
): number => {
  let sum1 = 0;
  for (let i = 1; i <= m; i += 1) {
    let prod1 = 1;
    for (let r = 1; r < i; r += 1) {
      prod1 *= n + (m + 1 - r) * alpha;
    }
    sum1 += ((lambda * tve) ** i / factorial(i)) * prod1;
  }
  let prod2 = 1;
  for (let r = 0; r < m + 1; r += 1) {
    prod2 *= n + (m + 1 - r) * alpha;
  }
  return (((factorial(m) / lambda) * (1 + sum1)) / prod2) * (lambda * tve) ** m;
};

/** Среднее время восстановления  */
export const gerReservedLightweightTv = (tve: number, m: number): number =>
  tve / (m + 1);

/** Вероятность безотказный работы */
export const gerReservedLightweightP = (to: number, t: number): number =>
  Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const gerReservedLightweightKog = (
  kg: number,
  t: number,
  to: number,
): number => kg * Math.exp(-t / to);

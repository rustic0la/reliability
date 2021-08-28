import { combine } from "../helpers";

/** Коэффициент готовности */
export const getReservedLoadedKg = (tv: number, to: number): number =>
  1 / (1 + tv / to);

/** Средняя наработка до отказа */
export const getReservedLoadedTo = (
  n: number,
  m: number,
  lambda: number,
  tve: number,
): number => {
  let sum1 = 0;
  for (let i = 1; i <= m; i += 1) {
    sum1 += combine(n + m, i) * (lambda * tve) ** i;
  }
  return (
    ((1 / (n * lambda)) * sum1) / (combine(n + m, m) * (lambda * tve) ** m)
  );
};

/** Среднее время восстановления  */
export const getReservedLoadedTv = (tve: number, m: number): number =>
  tve / (m + 1);

/** Вероятность безотказный работы */
export const getReservedLoadedP = (to: number, t: number): number =>
  Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const getReservedLoadedKog = (
  kg: number,
  t: number,
  to: number,
): number => kg * Math.exp(-t / to);

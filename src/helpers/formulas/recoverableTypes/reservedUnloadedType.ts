import { combine, factorial } from "../helpers";

/** Коэффициент готовности */
export const getReservedUnloadedKg = (tv: number, to: number): number =>
  1 / (1 + tv / to);

/** Средняя наработка до отказа */
export const getReservedUnloadedTo = (
  n: number,
  m: number,
  lambda: number,
  tve: number,
): number => {
  let sum1 = 0;
  for (let i = 0; i < m; i += 1) {
    sum1 += (combine(m, i) * factorial(i)) / (n * lambda * tve) ** i;
  }
  return (1 / (n * lambda)) * sum1;
};

/** Среднее время восстановления  */
export const getReservedUnloadedTv = (tve: number, m: number): number => tve / (m + 1);

/** Вероятность безотказный работы */
export const getReservedUnloadedP = (to: number, t: number): number => Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const getReservedUnloadedKog = (kg: number, t: number, to: number): number => kg * Math.exp(-t / to);

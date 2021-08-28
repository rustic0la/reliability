import { factorial } from "../helpers";

/** Средняя наработка до отказа */
export const getReservedUnloadedTo = (
  n: number,
  m: number,
  lambda: number,
): number => (m + 1) / (n * lambda);

/** Вероятность безотказный работы */
export const getReservedUnloadedP = (
  n: number,
  m: number,
  lambda: number,
  t: number,
): number => {
  let summ = 0;
  for (let i = 1; i < m; i += 1) {
    summ += (n * lambda * t) ** i / factorial(i);
  }
  return Math.exp(-n * lambda * t) * summ;
};

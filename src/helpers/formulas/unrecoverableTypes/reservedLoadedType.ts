import { combine } from '../helpers';

/** Средняя наработка до отказа */
export const getReservedLoadedTo = (
  n: number,
  m: number,
  lambda: number,
): number => {
  let res = 0;
  for (let i = 0; i <= m; i += 1) {
    res += 1 / (n + m - i);
  }
  return res * (1 / lambda);
};

/** Вероятность безотказный работы */
export const getReservedLoadedP = (
  n: number,
  m: number,
  lambda: number,
  t: number,
): number => {
  let res = 0;
  for (let i = 0; i <= m; i += 1) {
    res +=
      combine(n + m, i) *
      Math.exp(-(n + m - i) * lambda * t) *
      (1 - Math.exp(-lambda * t)) ** i;
  }
  return res;
};

import { combine, factorial } from "../helpers";

/** Средняя наработка до отказа */
export const getReservedLightweightTo = (
  n: number,
  m: number,
  lambda: number,
  alpha: number,
): number => {
  let res = 0;
  for (let i = 0; i <= m; i += 1) {
    res += 1 / (n + i * alpha);
    i += 1;
  }
  return 1 / lambda + res;
};

/** Вероятность безотказный работы */
export const getReservedLightweightP = (
  n: number,
  m: number,
  lambda: number,
  alpha: number,
  t: number,
): number => {
  let summ = 0;
  let prod = 1;
  for (let j = 0; j < m; j += 1) {
    prod *= n + j * alpha;
  }
  prod = prod / (alpha ** m * factorial(m));

  for (let i = 0; i <= m; i += 1) {
    summ +=
      (-1) ** i *
      (combine(m, i) / (n + i * alpha)) *
      Math.exp(-(n + i * alpha) * lambda * t);
  }
  return prod * summ;
};

import { combine, factorial } from '../helpers';

/** Коэффициент готовности */
export const getReservedWithSwitcherKg = (
  n: number,
  m: number,
  lambda: number,
  switcher: number,
  tve: number,
): number => {
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 1; i <= m - 1; i += 1) {
    const a = combine(n + m, i);
    const b = (lambda * tve) ** i;
    const c = 1 + (switcher * tve) / (i + 1);
    sum1 += a * b * c;
    const e = combine(n + m, i);
    const d = lambda ** i;
    const f = tve ** (i + 1);
    const g =
      1 / (i + 1) + ((n * factorial(i)) / factorial(i + 2)) * lambda * tve;
    sum2 += e * d * f * g;
  }
  return (
    (combine(n + m, m) * (lambda * tve) ** m + sum1) /
    ((1 + lambda * tve) ** (n + m) + sum2)
  );
};

/** Средняя наработка до отказа */
export const getReservedWithSwitcherTo = (
  n: number,
  m: number,
  lambda: number,
  switcher: number,
  tve: number,
): number => {
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 1; i <= m - 1; i += 1) {
    const a = combine(n + m, i);
    const b = (lambda * tve) ** i;
    const c = (switcher * tve) / (i + 1);
    const d = combine(n + m, m) * (lambda * tve) ** m;
    sum1 += a * b * (1 + c + d);
    const e = combine(n + m, i);
    const f = (lambda * tve) ** i;
    const g = 1 / (i + 1);
    sum2 += e * f * g;
  }
  return (
    ((1 / (n * lambda)) * sum1) /
    (combine(n + m, m) * (lambda * tve) ** m + switcher * tve * sum2)
  );
};

/** Среднее время восстановления  */
export const getReservedWithSwitcherTv = (to: number, kg: number): number =>
  (to * (1 - kg)) / kg;

/** Вероятность безотказный работы */
export const getReservedWithSwitcherP = (to: number, t: number): number =>
  Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const getReservedWithSwitcherKog = (
  kg: number,
  t: number,
  to: number,
): number => kg * Math.exp(-t / to);

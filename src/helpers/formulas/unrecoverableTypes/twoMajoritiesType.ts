/** Средняя наработка до отказа */
export const getTwoMajoritiesTo = (lambda1: number, lambda2: number): number =>
  35 / (6 * (lambda1 + lambda2)) -
  6 / (2 * lambda1 + 3 * lambda2) -
  6 / (3 * lambda1 + 2 * lambda2);

/** Вероятность безотказный работы */
export const getTwoMajoritiesP = (
  lambda1: number,
  lambda2: number,
  t: number,
): number => {
  const prod1 = 3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t));
  const sum1 = Math.exp(-3 * lambda1 * t) + prod1;
  const prod2 = 3 * Math.exp(-2 * lambda2 * t) * (1 - Math.exp(-lambda2 * t));
  const sum2 = Math.exp(-3 * lambda2 * t) + prod2;
  return sum1 * sum2;
};

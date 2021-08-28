/** Средняя наработка до отказа */
export const getMajorityTo = (lambda1: number, lambda2: number): number =>
  3 / (2 * lambda1 + lambda2) - 2 / (3 * lambda1 + lambda2);

/** Вероятность безотказный работы */
export const getMajorityP = (
  lambda1: number,
  lambda2: number,
  t: number,
): number => {
  const res =
    (Math.exp(-3 * lambda1 * t) +
      3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t))) *
    Math.exp(-lambda2 * t);
  return res;
};

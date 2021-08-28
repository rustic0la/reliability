/** Коэффициент готовности */
export const getTwoMajoritiesKg = (tv: number, to: number): number =>
  1 / (1 + tv / to);

/** Средняя наработка до отказа */
export const getTwoMajoritiesTo = (
  lambda1: number,
  lambda2: number,
  tve1: number,
  tve2: number,
): number =>
  ((1 + 3 * lambda1 * tve1) * (1 + 3 * lambda2 * tve2)) /
  (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
    6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1));

/** Среднее время восстановления  */
export const getTwoMajoritiesTv = (
  lambda1: number,
  lambda2: number,
  tve1: number,
  tve2: number,
): number =>
  (3 * lambda1 ** 2 * tve1 ** 2 * (1 + 3 * lambda2 * tve2) +
    3 * lambda2 ** 2 * tve2 ** 2 * (1 + 3 * lambda1 * tve1)) /
  (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
    6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1));

/** Вероятность безотказный работы */
export const getTwoMajoritiesP = (to: number, t: number): number =>
  Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const getTwoMajoritiesKog = (
  kg: number,
  t: number,
  to: number,
): number => kg * Math.exp(-t / to);

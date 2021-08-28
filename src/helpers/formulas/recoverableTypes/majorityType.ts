/** Коэффициент готовности */
export const getMajorityKg = (tv: number, to: number): number =>
  1 / (1 + tv / to);

/** Средняя наработка до отказа */
export const getMajorityTo = (
  lambda1: number,
  lambda2: number,
  tve1: number,
): number =>
  (1 + 3 * lambda1 * tve1) /
  (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2);

/** Среднее время восстановления  */
export const getMajorityTv = (
  lambda1: number,
  lambda2: number,
  tve1: number,
  tve2: number,
): number =>
  ((1 + 3 * lambda1 * tve1) * lambda2 * tve2 + 3 * lambda1 ** 2 * tve1 ** 2) /
  (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2);

/** Вероятность безотказный работы */
export const getMajorityP = (to: number, t: number): number =>
  Math.exp(-t / to);

/** Коэффициент оперативной готовности */
export const getMajorityKog = (kg: number, t: number, to: number): number =>
  kg * Math.exp(-t / to);

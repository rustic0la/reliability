/** Коэффициент готовности */
export const getParallelKg = (n: number, lamb: number, tve: number): number => {
  let prod = 1;
  let sum = 0;
  for (let i = 1; i < n; i += 1) {
    prod *= 1 / (1 + lamb * tve);
    sum += 1 / (1 + lamb * tve);
  }
  return sum - prod;
};

/** Средняя наработка до отказа */
export const getParallelTo = (n: number, lamb: number): number => {
  let prod = 1;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    prod *= lamb;
    sum += lamb;
  }
  return 1 / (sum - prod);
};

/** Среднее время восстановления  */
export const getParallelTv = (kg: number, to: number): number =>
  (to * (1 - kg)) / kg;

/** Вероятность безотказный работы */
export const getParallelP = (n: number, lamb: number, t: number): number => {
  let prod = 1;
  for (let i = 1; i < n; i += 1) {
    prod *= Math.exp(-lamb * t);
  }
  return prod;
};

/** Коэффициент оперативной готовности */
export const getParallelKog = (
  n: number,
  lamb: number,
  tve: number,
  t: number,
): number => {
  let prod = 1;
  for (let i = 1; i < n; i += 1) {
    prod *= (1 / (1 + lamb * tve)) * Math.exp(-lamb * t);
  }
  return prod;
};

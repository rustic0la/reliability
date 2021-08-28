/** Коэффициент готовности */
export const getSerialKg = (n: number, lamb: number, tve: number): number => {
  let prod = 1;
  for (let i = 1; i < n; i += 1) {
    prod *= 1 / (1 + lamb * tve);
  }
  return prod;
};

/** Средняя наработка до отказа */
export const getSerialTo = (n: number, lamb: number): number => {
  let sum = 0;
  for (let i = 1; i < n; i += 1) {
    sum += lamb;
  }
  return 1 / sum;
};

/** Среднее время восстановления  */
export const getSerialTv = (kg: number, to: number): number =>
  (to * (1 - kg)) / kg;

/** Вероятность безотказный работы */
export const getSerialP = (n: number, lamb: number, t: number): number => {
  let prod = 1;
  for (let i = 1; i < n; i += 1) {
    prod *= Math.exp(-lamb * t);
  }
  return prod;
};

/** Коэффициент оперативной готовности */
export const getSerialKog = (
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

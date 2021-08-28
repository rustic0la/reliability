/** Средняя наработка до отказа */
export const getSerialTo = (n: number, lamb: number): number => {
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    sum += lamb;
  }
  return 1 / sum;
};

/** Вероятность безотказный работы */
export const getSerialP = (n: number, lamb: number, t: number): number => {
  let prod = 1;
  for (let i = 1; i < n; i += 1) {
    prod *= Math.exp(-lamb * t);
  }
  return prod;
};

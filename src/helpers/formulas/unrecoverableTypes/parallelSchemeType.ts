/** Средняя наработка до отказа */
export const getParallelTo = (n: number, lamb: number): number => {
  let prod = 1;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    prod *= 1 / lamb;
    sum += 1 / lamb;
  }
  return sum - prod;
};

/** Вероятность безотказный работы */
export const getParallelP = (n: number, lamb: number, t: number): number => {
  let prod = 1;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    prod *= Math.exp(-lamb * t);
    sum += Math.exp(-lamb * t);
  }
  return sum - prod;
};

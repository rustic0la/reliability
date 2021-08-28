/** Средняя наработка до отказа */
export const getReservedWithSwitcherTo = (
  n: number,
  m: number,
  lambda: number,
  switcher: number,
): number => {
  const a = ((n * lambda) / (n + m)) * lambda + switcher;
  const b = ((n + m) * lambda) / ((n + m) * lambda + switcher);
  const e = (n + m) / (m * lambda + switcher);
  const c = switcher / ((n + m) * lambda + switcher);
  const d = 1 / (n * lambda) + (n + m) / (m * lambda + switcher);
  return a + b * e + c * d;
};

/** Вероятность безотказный работы */
export const getReservedWithSwitcherP = (
  n: number,
  m: number,
  lambda: number,
  switcher: number,
  t: number,
): number => {
  const s1 = ((n + m) * lambda) / (n * lambda + switcher);
  const s2 = Math.exp(-n * lambda * t) - Math.exp(-(m * lambda + switcher) * t);
  const s3 = (1 / m) * lambda + switcher;
  const s4 =
    switcher * Math.exp(-n * lambda * t) +
    n * lambda * Math.exp(-(n + m) * lambda + switcher) * t;
  return s1 * s2 + s3 * s4;
};

export function sum(a: any, b: any) {
  return a + b;
}

export const factorial = (m: number): number =>
  m === 0 ? 1 : m < 2 ? m : m * factorial(m - 1);

export const combine = (n: number, k: number): number =>
  (factorial(n) / factorial(n - k)) * factorial(k);

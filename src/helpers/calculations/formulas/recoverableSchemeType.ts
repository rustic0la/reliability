import { factorial, combine } from './helpers'

//! восстанавливавемые
export const recoverable = {
    serial: {
      kg: (n: number, lamb: number, tve: number) => {
        let prod = 1;
        for (let i = 1; i < n; i += 1) {
          prod *= 1 / (1 + lamb * tve);
        }
        return prod;
      },
      to: (n: number, lamb: number) => {
        let sum = 0;
        for (let i = 1; i < n; i += 1) {
          sum += lamb;
        }
        return 1 / sum;
      },
      tv: (kg: number, to: number) => (to * (1 - kg)) / kg,
      p: (n: number, lamb: number, t: number) => {
        let prod = 1;
        for (let i = 1; i < n; i += 1) {
          prod *= Math.exp(-lamb * t);
        }
        return prod;
      },
      kog: (n: number, lamb: number, tve: number, t: number) => {
        let prod = 1;
        for (let i = 1; i < n; i += 1) {
          prod *= (1 / (1 + lamb * tve)) * Math.exp(-lamb * t);
        }
        return prod;
      },
    },
    parallel: {
      kg: (n: number, lamb: number, tve: number) => {
        let prod = 1;
        let sum = 0;
        for (let i = 1; i < n; i += 1) {
          prod *= 1 / (1 + lamb * tve);
          sum += 1 / (1 + lamb * tve);
        }
        return sum - prod;
      },
      to: (n: number, lamb: number) => {
        let prod = 1;
        let sum = 0;
        for (let i = 0; i < n; i += 1) {
          prod *= lamb;
          sum += lamb;
        }
        return 1 / (sum - prod);
      },
      tv: (kg: number, to: number) => (to * (1 - kg)) / kg,
      p: (n: number, lamb: number, t: number) => {
        let prod = 1;
        for (let i = 1; i < n; i += 1) {
          prod *= Math.exp(-lamb * t);
        }
        return prod;
      },
      kog: (n: number, lamb: number, tve: number, t: number) => {
        let prod = 1;
        for (let i = 1; i < n; i += 1) {
          prod *= (1 / (1 + lamb * tve)) * Math.exp(-lamb * t);
        }
        return prod;
      },
    },
    reserved_loaded: {
      kg: (tv: number, to: number) => 1 / (1 + tv / to),
      to: (n: number, m: number, lambda: number, tve: number) => {
        let sum1 = 0;
        for (let i = 1; i <= m; i += 1) {
          sum1 += combine(n + m, i) * (lambda * tve) ** i;
        }
        return (
          ((1 / (n * lambda)) * sum1) / (combine(n + m, m) * (lambda * tve) ** m)
        );
      },
      tv: (tve: number, m: number) => tve / (m + 1),
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
    reserved_unloaded: {
      kg: (tv: number, to: number) => 1 / (1 + tv / to),
      to: (n: number, m: number, lambda: number, tve: number) => {
        let sum1 = 0;
        for (let i = 0; i < m; i += 1) {
          sum1 += (combine(m, i) * factorial(i)) / (n * lambda * tve) ** i;
        }
        return (1 / (n * lambda)) * sum1;
      },
      tv: (tve: number, m: number) => tve / (m + 1),
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
    reserved_lightweight: {
      kg: (tv: number, to: number) => 1 / (1 + tv / to),
      to: (n: number, m: number, lambda: number, tve: number, alpha: number) => {
        let sum1 = 0;
        for (let i = 1; i <= m; i += 1) {
          let prod1 = 1;
          for (let r = 1; r < i; r += 1) {
            prod1 *= n + (m + 1 - r) * alpha;
          }
          sum1 += ((lambda * tve) ** i / factorial(i)) * prod1;
        }
        let prod2 = 1;
        for (let r = 0; r < m + 1; r += 1) {
          prod2 *= n + (m + 1 - r) * alpha;
        }
        return (
          (((factorial(m) / lambda) * (1 + sum1)) / prod2) * (lambda * tve) ** m
        );
      },
      tv: (tve: number, m: number) => tve / (m + 1),
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
    reserved_with_switcher: {
      kg: (n: number, m: number, lambda: number, switcher: number, tve: number) => {
        let sum1 = 0;
        let sum2 = 0;
        for (let i = 1; i <= m - 1; i += 1) {
          const a = combine(n + m, i);
          const b = (lambda * tve) ** i;
          const c = (1 + (switcher * tve) / (i + 1));
          sum1 += a * b * c;
          const e = combine(n + m, i);
          const d = lambda ** i;
          const f = tve ** (i + 1);
          const g = 1 / (i + 1) + ((n * factorial(i)) / factorial(i + 2)) * lambda * tve;
          sum2 += e * d * f * g;
        }
        return (
          (combine(n + m, m) * (lambda * tve) ** m + sum1) /
          ((1 + lambda * tve) ** (n + m) + sum2)
        );
      },
      to: (n: number, m: number, lambda: number, switcher: number, tve: number) => {
        let sum1 = 0;
        let sum2 = 0;
        for (let i = 1; i <= m - 1; i += 1) {
          const a = combine(n + m, i);
          const b = (lambda * tve) ** i;
          const c = (switcher * tve) / (i + 1);
          const d = combine(n + m, m) * (lambda * tve) ** m;
          sum1 += a * b * (1 + c + d);
          const e = combine(n + m, i);
          const f = (lambda * tve) ** i; 
          const g = 1 / (i + 1);
          sum2 += e * f * g;
        }
        return (
          ((1 / (n * lambda)) * sum1) /
          (combine(n + m, m) * (lambda * tve) ** m + switcher * tve * sum2)
        );
      },
      tv: (to: number, kg: number) => (to * (1 - kg)) / kg,
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
    majority: {
      kg: (tv: number, to: number) => 1 / (1 + tv / to),
      to: (lambda1: number, lambda2: number, tve1: number) =>
        (1 + 3 * lambda1 * tve1) /
        (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2),
      tv: (lambda1: number, lambda2: number, tve1: number, tve2: number) =>
        ((1 + 3 * lambda1 * tve1) * lambda2 * tve2 +
          3 * lambda1 ** 2 * tve1 ** 2) /
        (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2),
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
    two_majorities: {
      kg: (tv: number, to: number) => 1 / (1 + tv / to),
      to: (lambda1: number, lambda2: number, tve1: number, tve2: number) =>
        ((1 + 3 * lambda1 * tve1) * (1 + 3 * lambda2 * tve2)) /
        (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
          6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1)),
      tv: (lambda1: number, lambda2: number, tve1: number, tve2: number) =>
        (3 * lambda1 ** 2 * tve1 ** 2 * (1 + 3 * lambda2 * tve2) +
          3 * lambda2 ** 2 * tve2 ** 2 * (1 + 3 * lambda1 * tve1)) /
        (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
          6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1)),
      p: (to: number, t: number) => Math.exp(-t / to),
      kog: (kg: number, t: number, to: number) => kg * Math.exp(-t / to),
    },
  };
  
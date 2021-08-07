import { factorial, combine } from './helpers'

//! Невосстанавливавемые
export const unrecoverable = {
    serial: {
      p: (n: number, lamb: number, t: number) => {
        let prod = 1;
        for (let i = 0; i < n; i += 1) {
          prod *= Math.exp(-lamb * t);
        }
        return prod;
      },
      to: (n: number, lamb: number) => {
        let sum = 0;
        for (let i = 0; i < n; i += 1) {
          sum += lamb;
        }
        return 1 / sum;
      },
    },
    parallel: {
      p: (n: number, lamb: number, t: number) => {
        let prod = 1;
        let sum = 0;
        for (let i = 0; i < n; i += 1) {
          prod *= Math.exp(-lamb * t);
          sum += Math.exp(-lamb * t);
        }
        return sum - prod;
      },
      to: (n: number, lamb: number) => {
        let prod = 1;
        let sum = 0;
        for (let i = 0; i < n; i += 1) {
          prod *= 1 / lamb;
          sum += 1 / lamb;
        }
        return sum - prod;
      },
    },
    reserved_loaded: {
      p: (n: number, m: number, lambda: number, t: number) => {
        let res = 0;
        for (let i = 0; i <= m; i += 1) {
          res +=
            combine(n + m, i) *
            Math.exp(-(n + m - i) * lambda * t) *
            (1 - Math.exp(-lambda * t)) ** i;
        }
        return res;
      },
      to: (n: number, m: number, lambda: number) => {
        let res = 0;
        for (let i = 0; i <= m; i += 1) {
          res += 1 / (n + m - i);
        }
        return res * (1 / lambda);
      },
    },
    reserved_lightweight: {
      p: (n: number, m: number, lambda: number, alpha: number, t: number) => {
        let summ = 0;
        let prod = 1;
        for (let j = 0; j < m; j += 1) {
          prod *= n + j * alpha;
          console.log("prod", j, prod);
        }
        prod = prod / (alpha ** m * factorial(m));
  
        for (let i = 0; i <= m; i += 1) {
          summ +=
            ((-1) ** i) *
            (combine(m, i) / (n + i * alpha)) *
            Math.exp(-(n + i * alpha) * lambda * t);
          console.log("summ", i, summ);
        }
        return prod * summ;
      },
      to: (n: number, m: number, lambda: number, alpha: number) => {
        let res = 0;
        for (let i = 0; i <= m; i += 1) {
          res += 1 / (n + i * alpha);
          i += 1;
        }
        return 1 / lambda + res;
      },
    },
    reserved_unloaded: {
      p: (n: number, m: number, lambda: number, t: number) => {
        let summ = 0;
        for (let i = 1; i < m; i += 1) {
          summ += (n * lambda * t) ** i / factorial(i);
        }
        return Math.exp(-n * lambda * t) * summ;
      },
      to: (n: number, m: number, lambda: number) => {
        return (m + 1) / (n * lambda);
      },
    },
  
    reserved_with_switcher: {
      p: (n: number, m: number, lambda: number, switcher: number, t: number) => {
        const s1 = ((n + m) * lambda) / (n * lambda + switcher);
        const s2 =
          Math.exp(-n * lambda * t) - Math.exp(-(m * lambda + switcher) * t);
        const s3 = (1 / m) * lambda + switcher;
        const s4 =
          switcher * Math.exp(-n * lambda * t) +
          n * lambda * Math.exp(-(n + m) * lambda + switcher) * t;
        return s1 * s2 + s3 * s4;
      },
      to: (n: number, m: number, lambda: number, switcher: number) => {
        const a = ((n * lambda) / (n + m)) * lambda + switcher;
        const b = ((n + m) * lambda) / ((n + m) * lambda + switcher);
        const e = (n + m) / (m * lambda + switcher);
        const c = switcher / ((n + m) * lambda + switcher);
        const d = 1 / (n * lambda) + (n + m) / (m * lambda + switcher);
        return a + b * e + c * d;
      },
    },
    majority: {
      p: (lambda1: number, lambda2: number, t: number) => {
        const res = (Math.exp(-3 * lambda1 * t) +
          3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t))) *
        Math.exp(-lambda2 * t);
        return res
      },
      to: (lambda1: number, lambda2: number) =>
        3 / (2 * lambda1 + lambda2) - 2 / (3 * lambda1 + lambda2),
    },
    two_majorities: {
      p: (lambda1: number, lambda2: number, t: number) => {
        const prod1 =
          3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t));
        const sum1 = Math.exp(-3 * lambda1 * t) + prod1;
        const prod2 =
          3 * Math.exp(-2 * lambda2 * t) * (1 - Math.exp(-lambda2 * t));
        const sum2 = Math.exp(-3 * lambda2 * t) + prod2;
        return sum1 * sum2;
      },
      to: (lambda1: number, lambda2: number) => {
        return (
          35 / (6 * (lambda1 + lambda2)) -
          6 / (2 * lambda1 + 3 * lambda2) -
          6 / (3 * lambda1 + 2 * lambda2)
        );
      },
    },
  };

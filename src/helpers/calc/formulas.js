const integrate = (fn, a, b) => {
  let area = 0;
  const dx = 0.0001;
  for (let x = a; x < b; x += dx) {
    area += fn(x) * dx;
  }
  return area;
};

const factorial = (m) => (m < 2 ? m : m * factorial(m - 1));

const combine = (n, k) => (factorial(n) / factorial(n - k)) * factorial(k);

//! Невосстанавливавемые

const unrecoverable = {
  sequent: {
    p: (n, lamb, t) => {
      let prod = 1;
      for (let i = 1; i < n; i += 1) {
        prod *= Math.exp(-lamb * t);
      }
      return prod;
    },
    to: (n, lamb) => {
      let sum = 0;
      for (let i = 1; i < n; i += 1) {
        sum += lamb;
      }
      return 1 / sum;
    },
  },
  reserve: {
    loaded: {
      p: (n, m, lambda, t) => {
        let res = 0;
        for (let i = 1; i < m; i += 1) {
          res +=
            combine(n + m, i) *
            Math.exp(-(n + m - i) * lambda * t) *
            (1 - Math.exp(-lambda * t)) ** i;
            console.log(i, res)
        }
        return res;
      },
      to: (n, m, lambda) => {
        let res = 0;
        for (let i = 0; i <= m; i += 1) {
          res += 1 / (n + m - i);
        }
        return (1 / lambda) * res;
      },
    },
    lightweight: {
      p: (n, m, lambda, alpha, t) => {
        let summ = 0;
        let prod = 1;
        for (let i = 0; i <= m; i += 1) {
          prod *= n + i * alpha;
          summ +=
            (-1) ** i *
            (combine(m, i) / (n + i * alpha)) *
            Math.exp(-(n + i * alpha) * lambda * t);
        }
        return (prod / (alpha ** m * factorial(m))) * summ;
      },
      to: (n, m, lambda, alpha) => {
        let res = 0;
        for (let i = 0; i <= m; i += 1) {
          res += 1 / (n + i * alpha);
          i += 1;
        }
        return 1 / lambda + res;
      },
    },
    unloaded: {
      p: (n, m, lambda, t) => {
        let summ = 0;
        for (let i = 0; i < m; i += 1) {
          summ += (n ** i * (lambda * t) ** i) / factorial(i);
        }
        return Math.exp(-n * lambda * t) * summ;
      },
      to: (n, m, lambda) => {
        return (m + 1) / (n * lambda);
      },
    },
  },
  reserveWithSwitcher: {
    p: (n, m, lambda, switcher, t) => {
      const s1 = ((n + m) * lambda) / (n * lambda + switcher);
      const s2 =
        Math.exp(-n * lambda * t) - Math.exp(-(m * lambda + switcher) * t);
      const s3 = (1 / m) * lambda + switcher;
      const s4 =
        switcher * Math.exp(-n * lambda * t) +
        n * lambda * Math.exp(-(n + m) * lambda + switcher) * t;
      return s1 * s2 + s3 * s4;
    },
    to: (pt) => {
      return integrate(pt, 0, 10000);
    },
  },
  majority: {
    p: (lambda1, lambda2, t) =>
      (Math.exp(-3 * lambda1 * t) +
        3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t))) *
      Math.exp(-lambda2 * t),
    to: (lambda1, lambda2) =>
      3 / (2 * lambda1 + lambda2) - 2 / (3 * lambda1 + lambda2),
  },
  twoMajorities: {
    p: (lambda1, lambda2, t) => {
      const prod1 =
        3 * Math.exp(-2 * lambda1 * t) * (1 - Math.exp(-lambda1 * t));
      const sum1 = Math.exp(-3 * lambda1 * t) + prod1;
      const prod2 =
        3 * Math.exp(-2 * lambda2 * t) * (1 - Math.exp(-lambda2 * t));
      const sum2 = Math.exp(-3 * lambda2 * t) + prod2;
      return sum1 * sum2;
    },
    t: (lambda1, lambda2) =>
      (35 / 6) * (lambda1 + lambda2) -
      6 / (2 * lambda1 + 3 * lambda2) -
      6 / (3 * lambda1 + 2 * lambda2),
  },
};

console.log(unrecoverable.reserve.lightweight.p(4, 3, 0.0001, 10))

//! восстанавливавемые
const recoverable = {
  sequent: {
    kg: (n, lamb, tve) => {
      let prod = 1;
      for (let i = 1; i < n; i += 1) {
        prod *= 1 / (1 + lamb * tve);
      }
      return prod;
    },
    to: (n, lamb) => {
      let sum = 0;
      for (let i = 1; i < n; i += 1) {
        sum += lamb;
      }
      return 1 / sum;
    },
    tv: (kg, to) => (to * (1 - kg)) / kg,
    p: (n, lamb, t) => {
      let prod = 1;
      for (let i = 1; i < n; i += 1) {
        prod *= Math.exp(-lamb * t);
      }
      return prod;
    },
    kog: (n, lamb, tve, t) => {
      let prod = 1;
      for (let i = 1; i < n; i += 1) {
        prod *= (1 / (1 + lamb * tve)) * Math.exp(-lamb * t);
      }
      return prod;
    },
  },
  reserve: {
    loaded: {
      kg: (tv, to) => 1 / (1 + tv / to),
      to: (n, m, lambda, tve) => {
        let sum1 = 0;
        for (let i = 0; i < m; i += 1) {
          sum1 += combine(i, n + m) * (lambda, tve) ** i;
        }
        return (
          ((1 / (n * lambda)) * sum1) /
          (combine(m, n + m) * (lambda * tve) ** m)
        );
      },
      tv: (tve, m) => tve / (m + 1),
      p: (to, t) => Math.exp(-t / to),
      kog: (kg, t, to) => kg * Math.exp(-t / to),
    },
    lightweight: {
      kg: (tv, to) => 1 / (1 + tv / to),
      to: (n, m, lambda, tve, alpha) => {
        let sum1 = 0;
        for (let i = 0; i < m; i += 1) {
          let prod1 = 1;
          for (let r = 1; r < i; r += 1) {
            prod1 *= n + (m + 1 - r) * alpha;
          }
          sum1 += ((lambda * tve) ** i / factorial(i)) * prod1;
        }
        let prod2 = 1;
        for (let r = 1; r < m + 1; r += 1) {
          prod2 *= n + (m + 1 - r) * alpha;
        }
        return (
          (((factorial(m) / lambda) * (1 + sum1)) / prod2) * (lambda * tve) ** m
        );
      },
      tv: (tve, m) => tve / (m + 1),
      p: (to, t) => Math.exp(-t / to),
      kog: (kg, t, to) => kg * Math.exp(-t / to),
    },
    unloaded: {
      kg: (tv, to) => 1 / (1 + tv / to),
      to: (n, m, lambda, tve) => {
        let sum1 = 0;
        for (let i = 0; i < m; i += 1) {
          sum1 += (combine(i, m) * factorial(i)) / (n * lambda * tve) ** i;
        }
        return (1 / (n * lambda)) * sum1;
      },
      tv: (tve, m) => tve / (m + 1),
      p: (to, t) => Math.exp(-t / to),
      kog: (kg, t, to) => kg * Math.exp(-t / to),
    },
  },
  reserveWithSwitcher: {
    kg: (n, m, lambda, switcher, tve) => {
      let sum1 = 0;
      let sum2 = 0;
      for (let i = 0; i < m - 1; i += 1) {
        sum1 +=
          combine(i, n + m) *
          (lambda * tve) ** i *
          (1 + (switcher * tve) / (i + 1));
        sum2 +=
          combine(i, n + m) *
          lambda ** i *
          switcher *
          tve ** (i + 1) *
          (1 / (i + 1) +
            ((n * factorial(i)) / factorial(i + 2)) * lambda * tve);
      }
      return (
        (combine(m, n + m) * (lambda * tve) ** m + sum1) /
        ((1 + lambda * tve) ** (n + m) + sum2)
      );
    },
    to: (n, m, lambda, switcher, tve) => {
      let sum1 = 0;
      let sum2 = 0;
      for (let i = 0; i < m - 1; i += 1) {
        sum1 +=
          combine(i, n + m) *
          (lambda * tve) ** i *
          (1 +
            (switcher * tve) / (i + 1) +
            combine(m, n + m) * (lambda * tve) ** m);
        sum2 += combine(i, n + m) * (lambda * tve) ** i * (1 / (i + 1));
      }
      return (
        ((1 / (n * lambda)) * sum1) /
        (combine(m, n + m) * (lambda * tve) ** m + switcher * tve * sum2)
      );
    },
    tv: (to, kg) => (to * (1 - kg)) / kg,
    p: (to, t) => Math.exp(-t / to),
    kog: (kg, t, to) => kg * Math.exp(-t / to),
  },
  oneMainManyReserve: {
    // m + 1 = N
    kg: (m, lambdas, tves) => {
      let prod1 = 1;
      for (let j = 0; j < m + 1; j += 1) {
        prod1 *= (lambdas[j] * tves[j]) / (1 + lambdas[j] * tves[j]);
      }
      return 1 - prod1;
    },
    to: (m, lambdas, tves) => {
      let prod1 = 1;
      let prod2 = 1;
      let prod3 = 1;
      let prod4 = 1;
      for (let j = 1; j < m + 1; j += 1) {
        prod1 *= 1 + lambdas[j] * tves[j];
        prod2 *= lambdas[j] * tves[j];
        prod3 *= 1 / tves[j];
        prod4 *= lambdas[j] * tves[j];
      }
      return (prod1 - prod2) / (prod3 * prod4);
    },
    tv: (m, tves) => {
      let sum1 = 0;
      for (let j = 0; j < m + 1; j += 1) {
        sum1 += 1 / tves[j];
      }
      return 1 / sum1;
    },
    p: (to, t) => Math.exp(-t / to),
    kog: (kg, t, to) => kg * Math.exp(-t / to),
  },
  majority: {
    kg: (tv, to) => 1 / (1 + tv / to),
    to: (lambda1, lambda2, tve1) =>
      (1 + 3 * lambda1 * tve1) /
      (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2),
    tv: (lambda1, lambda2, tve1, tve2) =>
      ((1 + 3 * lambda1 * tve1) * lambda2 * tve2 +
        3 * lambda1 ** 2 * tve1 ** 2) /
      (6 * lambda1 ** 2 * tve1 + (1 + 3 * lambda1 * tve1) * lambda2),
    p: (to, t) => Math.exp(-t / to),
    kog: (kg, t, to) => kg * Math.exp(-t / to),
  },
  twoMajorities: {
    kg: (tv, to) => 1 / (1 + tv / to),
    to: (lambda1, lambda2, tve1, tve2) =>
      ((1 + 3 * lambda1 * tve1) * (1 + 3 * lambda2 * tve2)) /
      (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
        6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1)),
    tv: (lambda1, lambda2, tve1, tve2) =>
      (3 * lambda1 ** 2 * tve1 ** 2 * (1 + 3 * lambda2 * tve2) +
        3 * lambda2 ** 2 * tve2 ** 2 * (1 + 3 * lambda1 * tve1)) /
      (6 * lambda1 ** 2 * tve1 * (1 + 3 * lambda2 * tve2) +
        6 * lambda2 ** 2 * tve2 * (1 + 3 * lambda1 * tve1)),
    p: (to, t) => Math.exp(-t / to),
    kog: (kg, t, to) => kg * Math.exp(-t / to),
  },
};

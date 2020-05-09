export const integrate = (fn, a, b) => {
	let area = 0;
	const dx = 0.0001;
	for (let x = a; x < b; x += dx) {
		area += fn(x) * dx;
	}
	return area;
};

const factorial = m => m < 2 ? m :  m * factorial(m - 1);	

const combine = (n, k) => factorial(n) / factorial(n - k) * factorial(k);

export const product = (fn, args) => args.reduce((acc, i) => fn(i) * acc, 1);

export const sum = (fn, args) => args.reduce((acc, i) => fn(i) + acc, 0);

export const parall = (blocks) => {
	const sum = blocks.reduce((acc, i) => Number(i.value) + acc, 0);
	const product = blocks.reduce((acc, i) => Number(i.value) * acc, 1);
	return sum - product;
};

export const consequent = (blocks) => blocks.reduce((acc, i) => Number(i.value * acc), 1);

//! Невосстанавливавемые
/*
//? Последовательная
const p = (lambdas, t) => lambdas.reduce((lambda, acc) => acc * Math.exp(-lambda * t), 1);

const to = (lambdas) => 1 / (lambdas.reduce((lambda, acc) => acc + lambda, 0));

//? Резерв нагруженный
const p = (n, m, lambdas, t) => {
	// const lambda = lambdas.reduce(lambda, acc) => ) // todo: как считаетсо
	const lamda = lambdas[0];
	let res = 0;
	for (let i of m) {
		res += combine(n + m, i) * Math.exp(-(n + m - i) * lambda * t) * (1 - Math.exp(-lambda * t))**i
	}
	return res;
}

const to = (n, m, lambdas) => {
	const lambda = lambdas[0];
	let res = 0;
	for (let i of m) {
		res += 1 / (n + m - i)
	}
	return 1 / lambda * res;
}

//? Резерв облегченныый
const p = (n, m, lambdas, alpha, t) => {
	const lambda = lambdas[0];
	let summ = 0;
    let prod = 1;
    for (let i of m) {
		prod *= n + i * alpha;
		summ += (-1)**i * (combine(m, i) / (n + i * alpha)) * Math.exp(-(n + i * alpha) * lamb * t);
	}
    return prod / ((alpha ** m) * factorial(m)) * summ;
}

const to = (m, n, lambdas, alpha) => {
	const lambda = lambdas[0];
	let res = 0;
    for (let i of m) {
        res += 1 / (n + i * alpha);
		i += 1;
	}
    return 1 / lamb + res;
}
    
//? Резерв ненагруженный
const p = (n, m, lambdas, alpha, t) => {
	const lambda = lambdas[0];
	let summ = 0;
    let prod = 1;
    for (let i of m) {
		prod *= n + i * alpha;
		summ += (-1) ** i * (combine(m, i) / (n + i * alpha)) * Math.exp(-(n + i * alpha) * lamb * t);
	}
    return prod / ((alpha ** m) * factorial(m)) * summ;
}

const to = (m, n, lambdas, alpha) => {
	const lambda = lambdas[0];
	let res = 0;
    for (let i of m) {
        res += 1 / (n + i * alpha);
		i += 1;
	}
    return 1 / lamb + res;
}
*/
//? Резервированная РЭА из одного основного и двух резервных элементов с учетом переключателя

/**
def reliability(main, addit, lamb, switch, t):
    both = main + addit
    first = (3*both*lamb/(main*lamb + switch)) * (np.exp(-main*lamb*t) - np.exp(-(addit*lamb + switch)*t))
    second = (main/(addit*lamb + switch)) * (switch*np.exp(-main*lamb*t) - addit*lamb*np.exp(-(both*lamb + switch)*t))
    return first + second

	def to(main, addit, lamb, switch):
    both = main + addit
    first = (main*lamb/(both*lamb + switch))
    second = both*both*lamb/((both*lamb + switch)*(both*lamb + switch))
    third = switch/(both*lamb + switch)
    fourth = main/lamb + both/(addit*lamb + switch)
    return first + second + third*fourth

*/
/*
const p = (add, lambdas, toggle, t) => {
	const lambda = lambdas[0];
	const 
} */
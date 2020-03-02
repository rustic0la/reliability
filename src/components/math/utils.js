export const integrate = (fn, a, b) => {
	let area = 0;
	const dx = 0.0001;
	for (let x = a; x < b; x += dx) {
		area += fn(x) * dx;
	}
	return area;
};

export const product = (fn, args) => args.reduce((acc, i) => fn(i) * acc, 1);

export const sum = (fn, args) => args.reduce((acc, i) => fn(i) + acc, 0);

export const parall = blocks => {
	const sum = blocks.reduce((acc, i) => i + acc, 0);
	const product = blocks.reduce((acc, i) => i * acc, 1);
	return sum - product;
};

export const consequent = blocks => blocks.reduce((acc, i) => i * acc, 1);

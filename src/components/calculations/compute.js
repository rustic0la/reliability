/*
const findId = (data, value) => {
	let res = null;
	const search = (data, idVal) => {
		for (let i of data) {
			if (idVal === i.val) {
				res = i;
			} else {
				if (i.ch.length > 0) {
					search(i.ch, idVal);
				}
			}
		}
	};
	search(data, value);
	return res;
};

console.log(findId(a, 6));
*/
export const compute = () => {
	return restoreGraphStructure();
};

const filterData = (data) => {
	const propsToFilter = [
		'TRANSLATE_CONTROL_POINTS',
		'alternateBounds',
		'offset',
		'relative',
		'connectable',
		'visible',
		'collapsed',
		'mxTransient',
	];
	let res = [];
	const search = (data) => {
		for (let i of data) {
		}
	};
	search(data);
	return res;
};

const restoreGraphStructure = () => {
	const graphStructure = JSON.parse(localStorage.getItem('json'));

	const subGraphs = Object.entries(localStorage).filter((item) =>
		item[0].includes('id'),
	);

	for (let i of jsonNodes) {
		for (let subGraph of subGraphs) {
			const [key, value] = subGraph;
			if (key.includes(i.mxObjectId)) {
				i.children = JSON.parse(value);
			}
		}
	}
};

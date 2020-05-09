import { isEmpty } from "lodash";
import { parall, consequent } from './formulas';

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

export const findNodeByPropAndItsValue = (data, prop, value) => {
	let res = null;
	const search = (data, val) => {
		for (let i of data) {
			if (val === i[prop]) {
				res = i;
			} else {
				if (i.hasOwnProperty('children') && i.children.length > 0) {
					search(i.children, val);
				}
			}
		}
	};
	search(data, value);
	return res;
};

const restoreGraphStructure = () => {
  const graphStructureNodes = JSON.parse(localStorage.getItem("json"));
  if (!graphStructureNodes) {
    return 'No data';
  }

  filterData(graphStructureNodes);

  const subGraphs = Object.entries(localStorage)
    .filter((item) => item[0].includes("mxCell"))
    .map((item) => [item[0], filterData(JSON.parse(item[1]))]);

  for (let i of graphStructureNodes) {
    for (let subGraph of subGraphs) {
      const [id, data] = subGraph;

      if (i.mxObjectId === id) {
        i.children = data;
      }
    }
  }
  console.log("restoreGraphStructure -> graphStructureNodes", graphStructureNodes)
  return graphStructureNodes;
};


export const compute = () => {
  const data = restoreGraphStructure();
  // console.log(data)

  const rectangles = data.filter((node) => node.style === "rectangle");

  const mOfn = data.find((node) => node.style === "mOfn");
  if (mOfn) {                                                             // m из n
    return 'qwrt'
  } 

  if (rectangles.every((v) => v.geometry.x === rectangles[0].geometry.x)) { // параллельное
    const res = parall(rectangles);
    return res;
  }
  if (rectangles.every((v) => v.geometry.y === rectangles[0].geometry.y)) { // последовательное
    const res = consequent(rectangles);
    return res;
  }
};

const filterData = (data) => {
  const propsToFilter = [
    "TRANSLATE_CONTROL_POINTS",
    "alternateBounds",
    "offset",
    "relative",
    "connectable",
    "visible",
    "collapsed",
    "mxTransient",
  ];

  for (let i of data) {
    for (let prop in i) {
      if (propsToFilter.includes(prop)) {
        delete i[prop];
      }
    }
  }
  return data;
};

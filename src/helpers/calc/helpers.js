import { isEmpty } from "lodash";

const LOADED = "loaded";
const UNLOADED = "unloaded";
const LIGHTWEIGHT = "lightweight";

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

/*
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
*/

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

const restoreGraphStructure = (graphStructureNodes, subGraphs) => {
  filterData(graphStructureNodes);

  for (let subGraph of subGraphs) {
    const [id, graph] = subGraph;
    for (let layerGraph of subGraphs.map((i) => i[1])) {
      const cell = layerGraph.find((cell) => cell.mxObjectId === id);
      if (cell) {
        cell.children = graph;
      }
    }
  }

  for (let i of graphStructureNodes) {
    for (let subGraph of subGraphs) {
      const [id, data] = subGraph;

      if (i.mxObjectId === id) {
        i.children = data;
      }
    }
  }

  return graphStructureNodes;
};

/** схема - параллельная */
const checkParallel = (vertexes, inputId, outputId) => {
  if (
    vertexes.find((v) => v.style !== "rectangle") &&
    vertexes.find((v) => v.style !== "rectangle").length > 0
  )
    return false;
  return vertexes.every(
    (vertex) =>
      vertex.edges.length === 2 &&
      ((((vertex.edges[0].target.id === inputId &&
        vertex.edges[0].source.id === vertex.id) ||
        (vertex.edges[0].target.id === vertex.id &&
          vertex.edges[0].source.id === inputId)) &&
        ((vertex.edges[1].target.id === outputId &&
          vertex.edges[1].source.id === vertex.id) ||
          (vertex.edges[1].target.id === vertex.id &&
            vertex.edges[1].source.id === outputId))) ||
        (((vertex.edges[1].target.id === inputId &&
          vertex.edges[1].source.id === vertex.id) ||
          (vertex.edges[1].target.id === vertex.id &&
            vertex.edges[1].source.id === inputId)) &&
          ((vertex.edges[0].target.id === outputId &&
            vertex.edges[0].source.id === vertex.id) ||
            (vertex.edges[0].target.id === vertex.id &&
              vertex.edges[0].source.id === outputId))))
  );
};

/** схема - последовательная */
const checkConsequent = (vertexes, outputId) => {
  if (vertexes.length === 1) return true;
  if (
    vertexes.find((v) => v.style !== "rectangle") &&
    vertexes.find((v) => v.style !== "rectangle").length > 0
  )
    return false;
  if (vertexes.some((v) => v.edges.length > 2)) return false;
  let current = vertexes[0];
  let list = [...vertexes].filter((v) => v.id !== current.id);
  while (current && current.id !== outputId) {
    const id = current.id;
    const edge = current.edges.filter((e) => e.source.id === id)[0];
    if (edge.target.id === outputId && list.length === 0) return true;
    if (list.includes(edge.target)) {
      current = edge.target;
      const i = current.id;
      list = [...list].filter((v) => v.id !== i);
    } else {
      return false;
    }
  }
  return false;
};

/** схема - мажоритарная */
const checkMajority = (vertexes, inputId, outputId) => {
  if (vertexes.length !== 3) return false;
  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      vert.edges.length === 3 &&
      vert.edges.filter(
        (e) =>
          ((e.source.id === inputId || e.source.id === outputId) &&
            e.target.id === vert.id) ||
          ((e.target.id === inputId || e.target.id === outputId) &&
            e.source.id === vert.id)
      ).length === 1 &&
      vert.edges.filter(
        (e) =>
          (e.target.id === vert.id && e.source.style === "rectangle") ||
          (e.source.id === vert.id && e.target.style === "rectangle")
      ).length === 2 &&
      list.includes(vert)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
    if (
      vert.edges.length === 2 &&
      vert.edges.every(
        (e) =>
          (e.source.id === vert.id && e.target.style === "rectangle") ||
          (e.target.id === vert.id && e.source.style === "rectangle")
      ) &&
      list.includes(vert)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  return list.length === 0;
};

/** схема - две мажоритарные */
const checkTwoMajorities = (vertexes, inputId, outputId) => {
  if (vertexes.length !== 6) return false;
  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      (vert.edges.length === 3 &&
        vert.edges.filter(
          (e) =>
            ((e.source.id === inputId || e.source.id === outputId) &&
              e.target.id === vert.id) ||
            ((e.target.id === inputId || e.target.id === outputId) &&
              e.source.id === vert.id)
        ).length === 1 &&
        vert.edges.filter(
          (e) =>
            (e.target.id === vert.id && e.source.style === "rectangle") ||
            (e.source.id === vert.id && e.target.style === "rectangle")
        ).length === 2) ||
      (vert.edges.filter(
        (e) =>
          (e.target.id === vert.id && e.source.style === "rectangle") ||
          (e.source.id === vert.id && e.target.style === "rectangle")
      ).length === 3 &&
        list.includes(vert))
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
    if (
      vert.edges.length === 2 &&
      vert.edges.every(
        (e) =>
          (e.source.id === vert.id && e.target.style === "rectangle") ||
          (e.target.id === vert.id && e.source.style === "rectangle")
      ) &&
      list.includes(vert)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  return list.length === 0;
};

/** схема - резервированная с переключателем */
export const checkReservedWithSwitcher = (vertexes) => {
  const switcher = vertexes.find((v) => v.style === "switcher");
  if (switcher) {
    if (
      switcher.edges.length >= 3 &&
      switcher.edges.filter(
        (e) => e.source.style === "rectangle" || e.target.style === "rectangle"
      ).length === 1 &&
      switcher.edges.filter(
        (e) => e.target.style === "loaded" || e.source.style === "loaded"
      ).length >= 2
    )
      return true;
    return false;
  }
  return false;
};

/** определяем тип схемы */
const getType = (scheme, reservedType) => {
  const inputId =
    scheme.find((node) => node.style === "input") &&
    scheme.find((node) => node.style === "input").id;
  const outputId =
    scheme.find((node) => node.style === "output") &&
    scheme.find((node) => node.style === "output").id;

  const vertexes = scheme
    .filter((node) => node.vertex)
    .filter((node) => node.style !== "input" && node.style !== "output");
  console.log("getType -> vertexes", vertexes);

  const types = {
    CONSEQUENT: "consequent",
    PARALLEL: "parallel",
    RESERVED_LOADED: "reserved_loaded",
    RESERVED_UNLOADED: "reserved_unloaded",
    RESERVED_LIGHTWEIGHT: "reserved_lightweight",
    MAJORITY: "majority",
    TWO_MAJORITIES: "two_majorities",
    RESERVED_WITH_SWITCHER: "reserved_with_switcher",
    ONE_MAIN_MANY_RESERVED: "one_main_many_reserved",
  };

  if (checkConsequent(vertexes, outputId)) {
    return types.CONSEQUENT;
  }

  if (checkParallel(vertexes, inputId, outputId)) {
    return types.PARALLEL;
  }

  /** резервированная и режим - нагруженная */
  if (vertexes.find((v) => v.style === "loaded") && reservedType === LOADED) {
    return types.RESERVED_LOADED;
  }

  /** резервированная и режим - ненагруженная */
  if (vertexes.find((v) => v.style === "loaded") && reservedType === UNLOADED) {
    return types.RESERVED_UNLOADED;
  }

  /** резервированная и режим - облегченная */
  if (
    vertexes.find((v) => v.style === "loaded") &&
    reservedType === LIGHTWEIGHT
  ) {
    return types.RESERVED_LIGHTWEIGHT;
  }

  if (checkMajority(vertexes, inputId, outputId)) {
    return types.MAJORITY;
  }

  if (checkTwoMajorities(vertexes, inputId, outputId)) {
    return types.TWO_MAJORITIES;
  }

  if (checkReservedWithSwitcher(vertexes)) {
    return types.RESERVED_WITH_SWITCHER;
  }

  /** один основной - несколько резервных элементов */
  if (
    vertexes.find((v) => v.style === "loaded") &&
    vertexes.find((v) => v.style === "loaded").length > 1 &&
    vertexes.find((v) => v.style === "rectangle") &&
    vertexes.find((v) => v.style === "rectangle").length === 1
  ) {
    return types.ONE_MAIN_MANY_RESERVED;
  }

  return "not_defined";
};

/** пытаемся получить данные о типе основного и дочерних графов */
const getTypes = (mainScheme, childScheme, reservedMode) => {
  const main = {
    graph: mainScheme,
    type: getType(mainScheme, false, reservedMode),
  };

  const children =
    childScheme &&
    childScheme.length > 0 &&
    childScheme.map((layer) => ({
      graph: layer,
      type: getType(layer, true, reservedMode),
    }));

  return [main, children];
};

export const compute = (
  scheme,
  recoverable,
  reservedMode,
  failureRate,
  tve,
  switcherFailureRate,
  exploitationTime
) => {
  const filteredMain = filterData(scheme);

  const filteredChildren = Object.entries(localStorage)
    .filter((item) => item[0].includes("mxCell"))
    .map((item) => [item[0], filterData(JSON.parse(item[1]))]);

  const [mainTyped, childrenTyped] = getTypes(
    filteredMain,
    filteredChildren,
    reservedMode
  );

  console.log("mainTyped", mainTyped, childrenTyped);

  // const restoredStructure = restoreGraphStructure(scheme, childGraphs);

  if (recoverable) {
    return {
      Pt: null,
      To: null,
      Tv: null,
      Kg: null,
      Kog: null,
    };
  }

  return {
    Pt: null,
    To: null,
  };
};

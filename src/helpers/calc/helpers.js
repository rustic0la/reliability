import { recoverable, unrecoverable } from "./formulas";

const LOADED = "loaded";
const UNLOADED = "unloaded";
const LIGHTWEIGHT = "lightweight";

const types = {
  SEQUENT: "sequent",
  PARALLEL: "parallel",
  RESERVED: "reserved",
  RESERVED_LOADED: "reserved_loaded",
  RESERVED_UNLOADED: "reserved_unloaded",
  RESERVED_LIGHTWEIGHT: "reserved_lightweight",
  MAJORITY: "majority",
  TWO_MAJORITIES: "two_majorities",
  RESERVED_WITH_SWITCHER: "reserved_with_switcher",
  ONE_MAIN_MANY_RESERVED: "one_main_many_reserved",
};

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
/*
const checkParallel = (nodes, inputId, outputId) => {
  const vertexes = nodes.filter((v) => v.style !== "input" && v.style !== 'output');
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
*/
/** схема - последовательная */
const checkConsequent = (nodes, inputId, outputId) => {
  const vertexes = nodes.filter(
    (v) => v.vertex && v.style !== "input" && v.style !== "output"
  );
  if (vertexes.length === 1) return true;
  if (vertexes.some((v) => v.edges.length > 2)) return false;

  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      ((vert.edges.filter(
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
        ).length === 1) ||
        vert.edges.filter(
          (e) =>
            (e.target.id === vert.id && e.source.style === "rectangle") ||
            (e.source.id === vert.id && e.target.style === "rectangle")
        ).length === 2)
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  const input = nodes.filter((v) => v.style === "input")[0];
  const output = nodes.filter((v) => v.style === "output")[0];
  return (
    list.length === 0 && input.edges.length === 1 && output.edges.length === 1
  );
};

/** схема - мажоритарная */
export const checkMajority = (nodes, inputId, outputId) => {
  const vertexes = nodes.filter(
    (v) => v.vertex && v.style !== "input" && v.style !== "output"
  );
  if (vertexes.length !== 4) return false;
  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
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
      ).length === 1
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
    if (
      vert.edges.length === 3 &&
      ((vert.edges.filter(
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
        list.includes(vert)) ||
        vert.edges.filter(
          (e) =>
            (e.target.id === vert.id && e.source.style === "rectangle") ||
            (e.source.id === vert.id && e.target.style === "rectangle")
        ).length === 3)
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
export const checkTwoMajorities = (nodes, inputId, outputId) => {
  const vertexes = nodes.filter(
    (v) => v.vertex && v.style !== "input" && v.style !== "output"
  );
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
    ) {
      const edgeId = switcher.edges.filter(
        (e) => e.target.style === "rectangle" || e.source.style === "rectangle"
      )[0].id;
      const rectangleId = vertexes.filter(
        (v) =>
          v.style === "rectangle" &&
          v.edges.filter((e) => e.id === edgeId).length === 1
      )[0].id;

      const loadeds = vertexes.filter((v) => v.style === "loaded");
      let list = [...loadeds];
      if (loadeds.length === 0) return false;
      for (let loaded of loadeds) {
        if (
          loaded.edges.length === 2 &&
          list.includes(loaded) &&
          loaded.edges.filter(
            (e) =>
              e.source.style === "switcher" || e.target.style === "switcher"
          ).length === 1 &&
          loaded.edges.filter(
            (e) => e.source.id === rectangleId || e.target.id === rectangleId
          ).length === 1
        ) {
          list = [...list].filter((v) => v.id !== loaded.id);
        }
      }
      return list.length === 0;

    } else {
      return false;
    }
  } else {
    return false;
  }
};

/** определяем тип схемы */
const getType = (scheme) => {
  const inputId =
    scheme.find((node) => node.style === "input") &&
    scheme.find((node) => node.style === "input").id;
  const outputId =
    scheme.find((node) => node.style === "output") &&
    scheme.find((node) => node.style === "output").id;

  const types = {
    SEQUENT: "sequent",
    PARALLEL: "parallel",
    RESERVED: "reserved",
    MAJORITY: "majority",
    TWO_MAJORITIES: "two_majorities",
    RESERVED_WITH_SWITCHER: "reserved_with_switcher",
    ONE_MAIN_MANY_RESERVED: "one_main_many_reserved",
  };

  if (checkConsequent(scheme, inputId, outputId)) {
    console.log(types.SEQUENT);
    return types.SEQUENT;
  }
  /*
  if (checkParallel(scheme, inputId, outputId)) {
    console.log(types.PARALLEL);
    return types.PARALLEL;
  }*/

  if (checkMajority(scheme, inputId, outputId)) {
    console.log(types.MAJORITY);
    return types.MAJORITY;
  }

  if (checkTwoMajorities(scheme, inputId, outputId)) {
    console.log(types.TWO_MAJORITIES);
    return types.TWO_MAJORITIES;
  }

  if (checkReservedWithSwitcher(scheme)) {
    console.log(types.RESERVED_WITH_SWITCHER);
    return types.RESERVED_WITH_SWITCHER;
  }

  const vertexes = scheme
    .filter((node) => node.vertex)
    .filter((node) => node.style !== "input" && node.style !== "output");

  /** резервированная */
  if (vertexes.find((v) => v.style === "loaded")) {
    console.log(types.RESERVED);
    return types.RESERVED;
  }

  /** один основной - несколько резервных элементов */
  if (
    vertexes.find((v) => v.style === "loaded") &&
    vertexes.find((v) => v.style === "loaded").length > 1 &&
    vertexes.find((v) => v.style === "rectangle") &&
    vertexes.find((v) => v.style === "rectangle").length === 1
  ) {
    console.log(types.ONE_MAIN_MANY_RESERVED);
    return types.ONE_MAIN_MANY_RESERVED;
  }

  return null;
};

/** пытаемся получить данные о типе основного и дочерних графов */
export const getTypes = (mainScheme, childSchemes, reservedMode) => {
    const type = getType(mainScheme, reservedMode);
    const main = {
      graph: mainScheme,
      type,
    };
  
    const children =
      childSchemes &&
      childSchemes.length > 0 &&
      childSchemes.map((layer) => {
        const type = getType(layer, reservedMode);
        return {
          graph: layer,
          type,
        };
      });
  
    return [main, children];
  };
/*
  const schemesWithoutParentId = childSchemes.map(([, scheme]) => scheme);

  const children =
    schemesWithoutParentId &&
    schemesWithoutParentId.length > 0 &&
    schemesWithoutParentId.map((layer) => {
      const type = getType(layer, reservedMode);
      let children1 = null;
      if (type === types.RESERVED) {
        let reservedType = null;
        switch (reservedMode) {
          case "loaded":
            reservedType = types.RESERVED_LOADED;
            break;
          case "unloaded":
            reservedType = types.RESERVED_UNLOADED;
            break;
          case "lightweight":
            reservedType = types.RESERVED_LIGHTWEIGHT;
            break;
          default:
            break;
        }
        return (children1 = {
          children: mainScheme,
          mainType: reservedType,
        });
      } else {
        return (children1 = {
          children: mainScheme,
          mainType: type,
        });
      }
    });
  

  return [main, 'children'];
};
*/
export const compute = ({
  scheme,
  isRecoverable,
  reservedMode,
  failureRate,
  tve,
  switcherFailureRate,
  exploitationTime,
  loadedLambda,
  firstMajority,
  secondMajority,
}) => {
  const filteredMain = filterData(scheme);
  const filteredChildren = Object.entries(localStorage)
    .filter((item) => item[0].includes("mxCell"))
    .map((item) => [item[0], filterData(JSON.parse(item[1]))]);

  const [mainTyped, childrenTyped] = getTypes(
    filteredMain,
    filteredChildren,
    reservedMode
  );
  /*
  const childrenWithValues = childrenTyped.reduce((acc, layer) => {
    const { children, childrenType } = layer;
    if (!isRecoverable) {

    } else {
      return 1 / +failureRate;
    }
    console.log(layer)
  }, []);*/

  const { main, mainType } = mainTyped;
  const rectNum = main.filter((v) => v.style === "rectangle").length;
  const loadedNum = main.filter((v) => v.style === "loaded").length;
  if (!isRecoverable) {
    let args = [];
  
    switch (mainType) {
      case types.SEQUENT:
        args = [rectNum, +failureRate, +exploitationTime];
        break;
      case types.RESERVED_LOADED:
        args = [rectNum, loadedNum, +failureRate, +exploitationTime];
        break;
      case types.RESERVED_UNLOADED:
        args = [rectNum, loadedNum, +failureRate, +exploitationTime];
        break;
      case types.RESERVED_LIGHTWEIGHT:
        args = [
          rectNum,
          loadedNum,
          +failureRate,
          +failureRate / +loadedLambda,
          exploitationTime,
        ];
        break;
      case types.MAJORITY:
        args = [+firstMajority, +secondMajority, +exploitationTime];
        break;
      case types.TWO_MAJORITIES:
        args = [+firstMajority, +secondMajority, +exploitationTime];
        break;
      case types.RESERVED_WITH_SWITCHER:
        args = [
          rectNum,
          loadedNum,
          +failureRate,
          +switcherFailureRate,
          +exploitationTime,
        ];
        break;
      case types.ONE_MAIN_MANY_RESERVED:
        break;
      default:
        break;
    }
    return {
      Pt: Number(unrecoverable[mainType].p(...args)).toFixed(15),
      To: Number(unrecoverable[mainType].to(...args.slice(0, -1))).toFixed(15),
    };
  } else {
    let kgArgs = [];
    let toArgs = [];
    let tvArgs = [];
    let pArgs = [];
    let kogArgs = [];
    let to = null;
    let kg = null;
    let tv = null;
    switch (mainType) {
      case types.SEQUENT:
        kgArgs = [rectNum, +failureRate, +tve];
        toArgs = [rectNum, +failureRate];
        kg = recoverable.sequent.kg(...kgArgs);
        to = recoverable.sequent.to(...toArgs);
        tvArgs = [kg, to];
        pArgs = [rectNum, +failureRate, +exploitationTime];
        kogArgs = [rectNum, +failureRate, +tve, +exploitationTime];
        break;
      case types.RESERVED_LOADED:
        toArgs = [rectNum, loadedNum, +failureRate, +tve];
        to = recoverable.reserved_loaded.to(...toArgs);
        tvArgs = [+tve, loadedNum];
        tv = recoverable.reserved_loaded.tv(...tvArgs);
        kgArgs = [tv, to];
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.RESERVED_UNLOADED:
        tvArgs = [+tve, loadedNum];
        tv = recoverable.reserved_unloaded.tv(...tvArgs);
        toArgs = [rectNum, loadedNum, +failureRate, +tve];
        to = recoverable.reserved_unloaded.to(...toArgs);
        kgArgs = [tv, to];
        kg = recoverable.reserved_unloaded.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.RESERVED_LIGHTWEIGHT:
        tvArgs = [+tve, loadedNum];
        tv = recoverable.reserved_lightweight.tv(...tvArgs);
        toArgs = [
          rectNum,
          loadedNum,
          +failureRate,
          +tve,
          +failureRate / +loadedLambda,
        ];
        to = recoverable.reserved_lightweight.to(...toArgs);
        kgArgs = [tv, to];
        kg = recoverable.reserved_lightweight.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.MAJORITY:
        toArgs = [+firstMajority, +secondMajority, +tve];
        to = recoverable.majority.to(...toArgs);
        tvArgs = [+firstMajority, +secondMajority, +tve, +tve];
        tv = recoverable.majority.tv(...tvArgs);
        kgArgs = [tv, to];
        kg = recoverable.majority.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.TWO_MAJORITIES:
        toArgs = [+firstMajority, +secondMajority, +tve, +tve];
        to = recoverable.two_majorities.to(...toArgs);
        tvArgs = [+firstMajority, +secondMajority, +tve, +tve];
        tv = recoverable.two_majorities.tv(...tvArgs);
        kgArgs = [tv, to];
        kg = recoverable.two_majorities.kg(...kgArgs);
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.RESERVED_WITH_SWITCHER:
        kgArgs = [rectNum, loadedNum, +failureRate, +switcherFailureRate, +tve];
        toArgs = [rectNum, loadedNum, +failureRate, +switcherFailureRate, +tve];
        kg = recoverable.reserved_with_switcher.kg(...kgArgs);
        to = recoverable.reserved_with_switcher.to(...toArgs);
        tvArgs = [to, kg];
        pArgs = [to, +exploitationTime];
        kogArgs = [kg, +exploitationTime, to];
        break;
      case types.ONE_MAIN_MANY_RESERVED:
        tvArgs = [loadedNum, +tve];
        toArgs = [loadedNum, +failureRate, +tve];
        to = recoverable.one_main_many_reserved.to(...toArgs);
        tvArgs = [loadedNum, +tve];
        pArgs = [to, +exploitationTime];
        kgArgs = [loadedNum, +failureRate, +tve];
        kg = recoverable.one_main_many_reserved.kg(...kgArgs);
        kogArgs = [kg, +exploitationTime, to];
        break;
      default:
        break;
    }
    return {
      Pt: Number(recoverable[mainType].p(...pArgs)).toFixed(15),
      To: Number(recoverable[mainType].to(...toArgs)).toFixed(15),
      Tv: Number(recoverable[mainType].tv(...tvArgs)).toFixed(15),
      Kg: Number(recoverable[mainType].kg(...kgArgs)).toFixed(15),
      Kog: Number(recoverable[mainType].kog(...kogArgs)).toFixed(15),
    };
  }
  // const restoredStructure = restoreGraphStructure(scheme, childGraphs);
};

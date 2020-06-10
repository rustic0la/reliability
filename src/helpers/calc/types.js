/** схема - параллельная */
export const checkParallel = (nodes, inputId, outputId) => {
  const vertexes = nodes.filter(
    (v) => v.vertex && v.style !== "input" && v.style !== "output"
  );
  let list = [...vertexes];
  for (let vert of vertexes) {
    if (
      vert.edges.length === 2 &&
      list.includes(vert) &&
      vert.edges.filter(
        (e) =>
          (
            (e.source.id === vert.id && e.target.id === inputId) ||
            (e.target.id === vert.id && e.source.id === inputId)
          ).length === 1 &&
          (
            (e.source.id === vert.id && e.target.id === outputId) ||
            (e.target.id === vert.id && e.source.id === outputId)
          ).length === 1
      )
    ) {
      list = [...list].filter((v) => v.id !== vert.id);
    }
  }
  return list.length === 0;
};

/** схема - последовательная */
export const checkSerial = (nodes, inputId, outputId) => {
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

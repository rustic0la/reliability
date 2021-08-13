import { getType } from './getType';
import { mxCell } from 'mxgraph';

interface DefineSchemeTypeRes {
  main: {
    main: any;
    mainType: string;
  };
  children: {
    child: any;
    childType: string;
  };
}
/** пытаемся получить данные о типе основного и дочерних графов */
export const defineSchemeType = (
  mainScheme: mxCell[],
  childSchemes: mxCell[],
  reservedMode?: string,
): DefineSchemeTypeRes => {
  const type = getType(mainScheme, 'main' /*, reservedMode */);
  const main = {
    main: mainScheme,
    mainType: type,
  };

  const children =
    childSchemes &&
    childSchemes.length > 0 &&
    childSchemes.map((layer) => {
      // @ts-ignore
      const type = getType(layer, 'children' /*, reservedMode */);
      return {
        child: layer,
        childType: type,
      };
    });

  // @ts-ignore
  return { main, children };
};

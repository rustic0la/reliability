import { getType } from './getType';
import { mxCell } from 'mxgraph';

interface DefineSchemeTypeRes {
  main: mxCell[];
  mainType: string | null;
}
/** пытаемся получить данные о типе графов */
export const defineSchemeType = (mainScheme: mxCell[]): DefineSchemeTypeRes => {
  const type = getType(mainScheme);

  // soon here will be children notes types defined

  return {
    main: mainScheme,
    mainType: type,
  };
};

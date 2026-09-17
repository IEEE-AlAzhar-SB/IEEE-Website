import { routeImports } from "../routeImports";

export function usePrefetchRoute(key: keyof typeof routeImports) {
  return {
    onMouseEnter: () => {
      routeImports[key]();
    },
    onFocus: () => {
      routeImports[key]();
    },
  };
}

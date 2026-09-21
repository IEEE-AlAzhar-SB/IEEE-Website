import { routeImports } from "../routeImports";

export function usePrefetchRoute(key: keyof typeof routeImports | undefined) {
  return {
    onMouseEnter: () => {
      if (key) routeImports[key]();
    },
    onFocus: () => {
      if (key) routeImports[key]();
    },
  };
}

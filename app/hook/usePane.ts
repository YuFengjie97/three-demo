import { Pane } from "tweakpane";
import { useEffect, useMemo } from "react";

// 1. 将实例移出 Hook 作用域，变成模块私有变量
let globalInstance: Pane | null = null;

export function usePane() {
  const pane = useMemo(() => {
    // if (typeof window === "undefined") {
    //   return null; // 适配 SSR
    // }
    if (!globalInstance) {
      globalInstance = new Pane();
    }
    return globalInstance;
  }, []);

  const dispose = () => {
    pane.dispose()
    globalInstance = null
  }

  return { pane, dispose };
}


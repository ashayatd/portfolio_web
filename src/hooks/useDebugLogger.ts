import { useContext } from "react";
import { DebugContext } from "@/providers/DebugProvider";

export function useDebugLogger() {
  const context = useContext(DebugContext);
  if (!context) {
    console.warn("useDebugLogger must be used within DebugProvider");
    return {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {},
      clear: () => {},
    };
  }
  return context;
}

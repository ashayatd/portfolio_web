"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

export interface LogEntry {
  id: string;
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: number;
}

export interface DebugContextValue {
  logs: LogEntry[];
  log: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  clear: () => void;
}

export const DebugContext = createContext<DebugContextValue | null>(null);

export function DebugProvider({ children }: PropsWithChildren) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback(
    (type: "log" | "error" | "warn" | "info", message: string) => {
      setLogs((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          type,
          message,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  const clear = useCallback(() => {
    setLogs([]);
  }, []);


  const value: DebugContextValue = {
    logs,
    log: (msg) => addLog("log", msg),
    error: (msg) => addLog("error", msg),
    warn: (msg) => addLog("warn", msg),
    info: (msg) => addLog("info", msg),
    clear,
  };

  return (
    <DebugContext.Provider value={value}>{children}</DebugContext.Provider>
  );
}

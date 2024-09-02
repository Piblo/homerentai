"use client";

import { createContext, useContext, useState } from "react";

type LoggerContextType = {
  push: (message: string) => void;
};

const LoggerContext = createContext<LoggerContextType | null>(null);

type LoggerProps = {
  children: React.ReactNode;
};

export const Logger = ({ children }: LoggerProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  return (
    <LoggerContext.Provider
      value={{
        push: (message) => setLogs((logs) => [...logs, message]),
      }}
    >
      {children}
      {logs.map((log, i) => (
        <pre key={i}>{log}</pre>
      ))}
    </LoggerContext.Provider>
  );
};

export function useLogger() {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }

  return context;
}

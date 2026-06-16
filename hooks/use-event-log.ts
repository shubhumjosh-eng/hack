'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  detail?: string;
}

const MAX_LOGS = 100;

export function useEventLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const idRef = useRef(0);

  const addLog = useCallback((type: LogEntry['type'], message: string, detail?: string) => {
    idRef.current += 1;
    const entry: LogEntry = {
      id: `log-${idRef.current}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      detail,
    };
    setLogs(prev => [entry, ...prev].slice(0, MAX_LOGS));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
}

import { useState, useCallback, useRef, useEffect } from "react";

export type CollaborationState = "SOLO" | "TANDEM" | "TEAM" | "CLOSED";
export type InputState = "AVAILABLE" | "PROCESSING";

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  emoji: string;
}

export interface AgentProcessState {
  collaboration: CollaborationState;
  inputState: InputState;
  agents: AIAgent[];
  logs: string[];
}

const AGENT_POOL: AIAgent[] = [
  { id: "mgr", name: "Менеджер Учёта", role: "Координатор", emoji: "🤖" },
  { id: "analyst", name: "Аналитик Клиентов", role: "Аналитика", emoji: "📊" },
  { id: "finance", name: "Финансист", role: "Финансы", emoji: "💰" },
  { id: "warehouse", name: "Складовщик", role: "Склад", emoji: "📦" },
];

const LOG_LINES = [
  "Анализирую запрос...",
  "Поиск релевантных данных...",
  "Подключаю модуль аналитики...",
  "Обработка таблиц...",
  "Сверяю финансовые записи...",
  "Генерация отчёта...",
  "Формирую ответ...",
  "Проверка данных склада...",
  "Агрегация результатов...",
];

const initial: AgentProcessState = {
  collaboration: "CLOSED",
  inputState: "AVAILABLE",
  agents: [],
  logs: [],
};

export function useAgentProcess() {
  const [state, setState] = useState<AgentProcessState>(initial);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIndexRef = useRef(0);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current);
      logIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => clearAllTimers, [clearAllTimers]);

  const startLogStream = useCallback(() => {
    logIndexRef.current = 0;
    logIntervalRef.current = setInterval(() => {
      const line = LOG_LINES[logIndexRef.current % LOG_LINES.length];
      logIndexRef.current++;
      setState((prev) => ({
        ...prev,
        logs: [...prev.logs.slice(-4), line],
      }));
    }, 1200);
  }, []);

  const startProcessing = useCallback(() => {
    clearAllTimers();

    // Phase 1: SOLO
    setState({
      collaboration: "SOLO",
      inputState: "PROCESSING",
      agents: [AGENT_POOL[0]],
      logs: ["Принимаю задачу..."],
    });

    startLogStream();

    // Phase 2: TANDEM after 1.5s
    const t1 = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        collaboration: "TANDEM",
        agents: [AGENT_POOL[0], AGENT_POOL[1]],
      }));
    }, 1500);

    // Phase 3: TEAM after 3.5s
    const t2 = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        collaboration: "TEAM",
        agents: [AGENT_POOL[0], AGENT_POOL[1], AGENT_POOL[2]],
      }));
    }, 3500);

    // Phase 4: CLOSED after 7s (simulated completion)
    const t3 = setTimeout(() => {
      clearAllTimers();
      setState((prev) => ({
        ...prev,
        collaboration: "CLOSED",
        inputState: "AVAILABLE",
        logs: [...prev.logs.slice(-2), "✓ Задача выполнена"],
      }));
    }, 7000);

    timersRef.current = [t1, t2, t3];
  }, [clearAllTimers, startLogStream]);

  const stopProcessing = useCallback(() => {
    clearAllTimers();
    setState((prev) => ({
      ...prev,
      collaboration: "CLOSED",
      inputState: "AVAILABLE",
      logs: [...prev.logs.slice(-2), "⛔ Процесс остановлен"],
    }));
  }, [clearAllTimers]);

  return { state, startProcessing, stopProcessing };
}

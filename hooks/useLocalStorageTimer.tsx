import { useState, useCallback, useSyncExternalStore } from 'react';

// --- 1. ログ記録用フック ---
export type PomodoroLog = {
  id: string;
  timestamp: string;
  type: 'focus' | 'break';
  durationMinutes: number;
  round: number;
};

const LOGS_STORAGE_KEY = 'pomodoro_logs';

export const usePomodoroStorage = () => {
  const [logs, setLogs] = useState<PomodoroLog[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedData = localStorage.getItem(LOGS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Failed to load logs from localStorage:', error);
      return [];
    }
  });

  const addLog = (logData: Omit<PomodoroLog, 'id' | 'timestamp'>) => {
    const newEntry: PomodoroLog = {
      ...logData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    setLogs((prevLogs) => {
      const updatedLogs = [...prevLogs, newEntry];
      try {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
      } catch (error) {
        console.error('Failed to save log to localStorage:', error);
      }
      return updatedLogs;
    });
  };

  const clearLogs = () => {
    try {
      localStorage.removeItem(LOGS_STORAGE_KEY);
      setLogs([]);
    } catch (error) {
      console.error('Failed to clear logs from localStorage:', error);
    }
  };

  return { logs, addLog, clearLogs };
};

// --- 2. タイマー状態管理用フック ---
export type Mode = 'focus' | 'break';

export type TimerState = {
  focusInput: number;
  breakInput: number;
  maxRounds: number;
  mode: Mode;
  currentRound: number;
  timeLeft: number;
  isRunning: boolean;
  lastUpdated: number;
};

const TIMER_STATE_KEY = 'pomodoro_timer_state';

const DEFAULT_STATE: TimerState = {
  focusInput: 40,
  breakInput: 10,
  maxRounds: 3,
  mode: 'focus',
  currentRound: 1,
  timeLeft: 40 * 60,
  isRunning: false,
  lastUpdated: Date.now(),
};

const emptySubscribe = () => () => {};

export const usePomodoroTimerState = () => {
  // useSyncExternalStoreでハイドレーションエラーを防止（setIsMountedの代わり）
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // 初期値の復元は useState 内で同期的におこなう（useEffect不要）
  const [timerState, setTimerState] = useState<TimerState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;

    try {
      const saved = localStorage.getItem(TIMER_STATE_KEY);
      if (!saved) return DEFAULT_STATE;

      const parsed: TimerState = JSON.parse(saved);

      if (parsed.isRunning) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - parsed.lastUpdated) / 1000);
        const newTimeLeft = parsed.timeLeft - elapsedSeconds;

        if (newTimeLeft > 0) {
          parsed.timeLeft = newTimeLeft;
        } else {
          parsed.timeLeft = 0;
          parsed.isRunning = false;
        }
      }
      return parsed;
    } catch (e) {
      console.error('Failed to restore timer state:', e);
      return DEFAULT_STATE;
    }
  });

  const saveTimerState = useCallback((updates: Partial<TimerState>) => {
    setTimerState((prev) => {
      const nextState = {
        ...prev,
        ...updates,
        lastUpdated: Date.now(),
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(nextState));
        } catch (e) {
          console.error('Failed to save timer state:', e);
        }
      }
      return nextState;
    });
  }, []);

  const updateFocusInput = (minutes: number) => {
    const val = Math.min(60, Math.max(1, minutes));
    if (!timerState.isRunning && timerState.mode === 'focus') {
      saveTimerState({ focusInput: val, timeLeft: val * 60 });
    } else {
      saveTimerState({ focusInput: val });
    }
  };

  const updateBreakInput = (minutes: number) => {
    const val = Math.min(60, Math.max(1, minutes));
    if (!timerState.isRunning && timerState.mode === 'break') {
      saveTimerState({ breakInput: val, timeLeft: val * 60 });
    } else {
      saveTimerState({ breakInput: val });
    }
  };

  const updateMaxRounds = (rounds: number) => {
    const val = Math.min(10, Math.max(1, rounds));
    saveTimerState({ maxRounds: val });
  };

  const toggleIsRunning = () => {
    setTimerState((prev) => {
      // 全ラウンド終了状態（timeLeftが0かつ最終ラウンド以上）でStartを押した場合のリセット再スタート
      const isFinished = prev.timeLeft === 0 && prev.currentRound >= prev.maxRounds;

      const nextState = isFinished && !prev.isRunning
        ? {
            ...prev,
            isRunning: true,
            mode: 'focus' as Mode,
            currentRound: 1,
            timeLeft: prev.focusInput * 60,
            lastUpdated: Date.now(),
          }
        : {
            ...prev,
            isRunning: !prev.isRunning,
            lastUpdated: Date.now(),
          };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(nextState));
        } catch (e) {
          console.error('Failed to save timer state:', e);
        }
      }
      return nextState;
    });
  };

  const resetTimer = () => {
    const resetTime = timerState.focusInput * 60;
    saveTimerState({
      isRunning: false,
      mode: 'focus',
      currentRound: 1,
      timeLeft: resetTime,
    });
  };

  return {
    isMounted,
    timerState,
    saveTimerState,
    updateFocusInput,
    updateBreakInput,
    updateMaxRounds,
    toggleIsRunning,
    resetTimer,
  };
};

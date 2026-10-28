'use client';

import React, { useEffect } from 'react';
import { usePomodoroStorage } from '@/hooks/useLocalStorageTimer';
import { usePomodoroTimerState } from '@/hooks/useLocalStorageTimer';

export function PomodoroTimer() {
  const { addLog } = usePomodoroStorage();
  const {
    isMounted,
    timerState,
    saveTimerState,
    updateFocusInput,
    updateBreakInput,
    updateMaxRounds,
    toggleIsRunning,
    resetTimer,
  } = usePomodoroTimerState();


  const {
    focusInput,
    breakInput,
    maxRounds,
    mode,
    currentRound,
    timeLeft,
    isRunning,
  } = timerState;

  /* --- カウントダウン & 自動記録 --- */
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      // 現在の最新状態を元に残り時間を計算
      saveTimerState({}); // lastUpdated の更新用

      if (timeLeft > 1) {
        saveTimerState({ timeLeft: timeLeft - 1 });
      } else {
        // --- タイマー終了時のカウント切り替え ---
        if (mode === 'focus') {
          addLog({
            type: 'focus',
            durationMinutes: focusInput,
            round: currentRound,
          });

          if (currentRound < maxRounds) {
            saveTimerState({ mode: 'break', timeLeft: breakInput * 60 });
          } else {
            // すべてのラウンドが完了した時の処理
            saveTimerState({
              isRunning: false,
              mode: 'focus',
              currentRound: 1,
              timeLeft: focusInput*60
            });
            alert('すべてのラウンドが完了しました！お疲れ様でした。');
          }
        } else {
          addLog({
            type: 'break',
            durationMinutes: breakInput,
            round: currentRound,
          });

          saveTimerState({
            mode: 'focus',
            currentRound: currentRound + 1,
            timeLeft: focusInput * 60,
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isRunning,
    timeLeft,
    mode,
    currentRound,
    maxRounds,
    focusInput,
    breakInput,
    addLog,
    saveTimerState,
  ]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
  };

   // マウント前（SSR時）は描画しないことでハイドレーションエラーを防止
  if (!isMounted) return null;

  return (
    <div>
      <h2 className="text-base font-bold mb-3 text-[#5c988e]">Pomodoro Timer</h2>
        <div className="font-sans w-full max-w-sm mx-auto flex flex-col items-center justify-center py-2">


        {/* 1. 時間設定エリア（上部にまとめてスッキリ配置） */}
        <div className="w-full space-y-2 mb-6">
          {/* Focus Time */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl transition-colors text-sm ${
              mode === 'focus' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {mode === 'focus' && <span className="w-2 h-2 rounded-full bg-[#5c988e]" />}
              <span>Focus Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={60}
                value={focusInput}
                onChange={(e) => updateFocusInput(Number(e.target.value) || 1)}
                disabled={isRunning}
                className="w-12 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
              />
              <span className="text-xs font-normal text-gray-500">min</span>
            </div>
          </div>

          {/* Break Time */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-xl transition-colors text-sm ${
              mode === 'break' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {mode === 'break' && <span className="w-2 h-2 rounded-full bg-[#5c988e]" />}
              <span>Break Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={60}
                value={breakInput}
                onChange={(e) => updateBreakInput(Number(e.target.value) || 1)}
                disabled={isRunning}
                className="w-12 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
              />
              <span className="text-xs font-normal text-gray-500">min</span>
            </div>
          </div>

          {/* Rounds */}
          <div className="flex items-center justify-between p-2.5 text-gray-700 bg-slate-50 rounded-xl text-xs">
            <span>Rounds</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">({currentRound} /</span>
              <input
                type="number"
                min={1}
                max={10}
                value={maxRounds}
                onChange={(e) => updateMaxRounds(Number(e.target.value) || 1)}
                disabled={isRunning}
                className="w-8 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
              />
              <span className="text-gray-400">)</span>
            </div>
          </div>
        </div>

        {/* 2. カウントダウン表示 ＆ 操作ボタンエリア（下部にまとめてスッキリ） */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-6xl font-bold tracking-tight text-slate-800 font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleIsRunning}
              className="px-10 py-3 rounded-full bg-[#5c988e] text-white text-base font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

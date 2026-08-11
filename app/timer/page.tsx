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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <h1 className="text-3xl tracking-wide font-normal text-[#5c988e] mb-6">
        Pomodoro timer
      </h1>

      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="grid grid-cols-3 gap-4 items-center mb-8">
          <div className="col-span-2 space-y-4 text-left">
            {/* Focus Time */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                mode === 'focus' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {mode === 'focus' && <span className="w-2 h-2 rounded-full bg-[#5c988e]" />}
                <span>Focus Time</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={focusInput}
                  onChange={(e) => updateFocusInput(Number(e.target.value) || 1)}
                  disabled={isRunning}
                  className="w-12 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
                />
                <span className="text-sm font-normal text-gray-500">min</span>
              </div>
            </div>

            {/* Break Time */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                mode === 'break' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {mode === 'break' && <span className="w-2 h-2 rounded-full bg-[#5c988e]" />}
                <span>Break Time</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakInput}
                  onChange={(e) => updateBreakInput(Number(e.target.value) || 1)}
                  disabled={isRunning}
                  className="w-12 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
                />
                <span className="text-sm font-normal text-gray-500">min</span>
              </div>
            </div>

            {/* Rounds */}
            <div className="flex items-center justify-between p-2 text-gray-700">
              <span>Rounds</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">({currentRound} / </span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxRounds}
                  onChange={(e) => updateMaxRounds(Number(e.target.value) || 1)}
                  disabled={isRunning}
                  className="w-8 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
                />
                <span className="text-xs text-gray-400">)</span>
              </div>
            </div>
          </div>

          {/* 操作ボタン */}
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={toggleIsRunning}
              className="w-24 h-24 rounded-full bg-[#5c988e] text-white text-lg font-medium hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* カウントダウン表示 */}
        <div className="text-center mt-4">
          <div className="text-6xl font-bold tracking-tight text-black font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
}

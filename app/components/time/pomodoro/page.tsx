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
    <div className="font-sans flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      {/* タイトル */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <span className="font-bold text-[#5c988e] text-sm">ポモドーロタイマー</span>
      </div>

      {/* 1. 時間設定・ラウンド設定エリア */}
      <div className="w-full space-y-1.5 mb-2 shrink-0">
        {/* Focus Time */}
        <div
          className={`flex items-center justify-between p-2 rounded-xl transition-colors text-xs ${
            mode === 'focus' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {mode === 'focus' && <span className="w-1.5 h-1.5 rounded-full bg-[#5c988e]" />}
            <span>Focus Time</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={60}
              value={focusInput}
              onChange={(e) => updateFocusInput(Number(e.target.value) || 1)}
              disabled={isRunning}
              className="w-10 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
            />
            <span className="text-[10px] font-normal text-gray-500">min</span>
          </div>
        </div>

        {/* Break Time */}
        <div
          className={`flex items-center justify-between p-2 rounded-xl transition-colors text-xs ${
            mode === 'break' ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-700 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {mode === 'break' && <span className="w-1.5 h-1.5 rounded-full bg-[#5c988e]" />}
            <span>Break Time</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={60}
              value={breakInput}
              onChange={(e) => updateBreakInput(Number(e.target.value) || 1)}
              disabled={isRunning}
              className="w-10 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
            />
            <span className="text-[10px] font-normal text-gray-500">min</span>
          </div>
        </div>

        {/* Rounds */}
        <div className="flex items-center justify-between p-2 text-gray-700 bg-slate-50 rounded-xl text-xs">
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
              className="w-7 text-right bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#5c988e]"
            />
            <span className="text-gray-400">)</span>
          </div>
        </div>
      </div>

      {/* 2. カウントダウン表示エリア（ストップウォッチと全く同じサイズ感・中央配置） */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-gray-100 my-1">
        <div className="text-3xl font-mono font-bold text-slate-800 tracking-wider">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* 3. 操作ボタンエリア（ストップウォッチと共通のデザイン） */}
      <div className="flex gap-2 shrink-0 mt-2">
        <button
          type="button"
          onClick={toggleIsRunning}
          className={`flex-1 py-2 rounded-lg text-xs font-medium text-white transition-opacity cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600' // 実行中なら一時停止用にオレンジ系
              : 'bg-[#5c988e] hover:opacity-95'    // 停止中ならスタート用にブランドカラー
          }`}
        >
          {isRunning ? '一時停止' : 'スタート'}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
        >
          リセット
        </button>
      </div>
    </div>
  );
}

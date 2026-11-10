import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Stopwatch = () => {

  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 辞書ライブラリ
    const {t} = useTranslation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);


  const handleMainButtonClick = () => {
    if(!isRunning && !isPaused) {
      // 停止状態からスタート
      setIsRunning(true);
      setIsPaused(false);
    } else if (isRunning) {
      // 動作中→一時停止中(Pause)
      setIsRunning(false);
      setIsPaused(true);
    } else if (!isRunning && isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }

  // リセット処理
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  }

  // 秒数を「時間：分：秒」のフォーマット（00:00:00）に変換する関数
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 足りない桁を0埋めする
    const pad = (num: number) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div className="font-sans flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      {/* タイトル */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <span className="font-bold text-[#5c988e] text-sm">{t('time.stopWatch')}</span>
      </div>

      {/* 時間表示エリア */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-gray-100 mb-2">
        <div className="lg:text-3xl text-5xl font-mono font-bold text-slate-800 tracking-wider">
          {formatTime(time)}
        </div>
      </div>

      {/* 操作ボタンエリア */}
      <div className="flex gap-2 shrink-0 mt-2">
        {/* メインボタン（Start / Pause / Resume が切り替わる） */}
        <button
          type="button"
          onClick={handleMainButtonClick}
          className={`flex-1 py-2 rounded-lg text-xs font-medium text-white transition-opacity cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600' // 実行中なら一時停止用にオレンジ系
              : 'bg-[#5c988e] hover:opacity-95'    // 停止中・一時停止中ならスタート用にブランドカラー
          }`}
        >
          {isRunning ? t('timeButtons.stop') : isPaused ? t('timeButtons.resume') : t('timeButtons.start')}
        </button>

        {/* リセットボタン（動いている時や一時停止中に出す） */}
        {(isRunning || isPaused || time > 0) && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
          >
            {t('timeButtons.reset')}
          </button>
        )}
      </div>
    </div>
  );

}
export default Stopwatch;

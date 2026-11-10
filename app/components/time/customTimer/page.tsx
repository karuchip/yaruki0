import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomTimer = () => {

  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 辞書ライブラリ
    const {t} = useTranslation();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (interval) {
              clearInterval(interval);
            }
            setIsRunning(false);
            alert(`${inputMinutes}分が経過しました`);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, inputMinutes]);


  const handleTimeChange = () => {

    if(!isRunning && !isPaused){
      // 初回だけ秒数に直す
      const totalSeconds = inputMinutes * 60;
      if(totalSeconds <= 0) {
        alert("0より大きい時間を設定してください");
        return;
      }
      setSeconds(totalSeconds);
      setIsRunning(true);
      setIsPaused(false);
    }else if(isRunning) {
      setIsRunning(false);
      setIsPaused(true);
    }else if(!isRunning && isPaused) {
      setIsRunning(true);
      setIsPaused(false);
    }
  }

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setInputMinutes(0);
  }


  // 秒数を「分：秒」に変換する
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="font-sans flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      {/* タイトル */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <span className="font-bold text-[#5c988e] text-sm">{t('time.timer')}</span>
      </div>

      {/* 時間表示・入力エリア */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-gray-100 mb-2 py-4">
        {!isRunning && !isPaused ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={120}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              className="w-20 text-center bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-[#5c988e] font-mono text-3xl font-bold text-slate-800"
            />
            <span className="text-sm text-gray-500 font-medium">分</span>
          </div>
        ) : (
          <div className="lg:text-3xl text-5xl font-mono font-bold text-slate-800 tracking-wider">
            {formatTime(seconds)}
          </div>
        )}
      </div>

      {/* 操作ボタンエリア */}
      <div className="flex gap-2 shrink-0 mt-2">
        <button
          type="button"
          onClick={handleTimeChange}
          className={`flex-1 py-2 rounded-lg text-xs font-medium text-white transition-opacity cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-[#5c988e] hover:opacity-95'
          }`}
        >
          {isRunning ? t('timeButtons.stop') : isPaused ? t('timeButtons.resume') : t('timeButtons.start')}
        </button>

        {(isRunning || isPaused) && (
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

export default CustomTimer;

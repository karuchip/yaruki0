import { useEffect, useState } from "react";

const CustomTimer = () => {

  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);


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
    <div className="font-sans flex flex-col items-center p-4">
      {!isRunning && !isPaused && (
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            min={1}
            max={120}
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            className="w-20 text-center bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-[#5c988e] font-mono text-lg font-bold text-slate-800"
          />
          <span className="text-xs text-gray-500 font-medium">分</span>
        </div>
      )}

      {(isRunning || isPaused) && (
        <p className="text-3xl font-mono font-bold text-slate-800 tracking-wider mb-4">{formatTime(seconds)}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleTimeChange}
          className="px-4 py-2 bg-[#5c988e] hover:opacity-95 text-white text-xs font-medium rounded-lg transition-all cursor-pointer shadow-sm"
        >
          {isRunning ? "一時停止" : isPaused ? "再開" : "開始"}
        </button>

        {(isRunning || isPaused) && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomTimer;

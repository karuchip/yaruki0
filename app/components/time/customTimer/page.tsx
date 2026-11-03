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
        <div>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            className="border p-1 rounded mb-2"
          />
          <span> 分</span>
        </div>
      )}

      {(isRunning || isPaused) && (
        <p className="text-2xl font-bold mb-2">{formatTime(seconds)}</p>
      )}

      <div className="flex gap-2">
        <button onClick={handleTimeChange} className="px-3 py-1 bg-[#5c988e] text-white rounded">
          {isRunning ? "一時停止" : isPaused ? "再開" : "開始"}
        </button>

        {(isRunning || isPaused) && (
          <button onClick={handleReset} className="px-3 py-1 bg-gray-200 rounded">
            リセット
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomTimer;

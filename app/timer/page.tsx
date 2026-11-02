import { useState } from "react";
import { PomodoroTimer } from "../components/time/pomodoro/page";
import Stopwatch from "../components/time/stopwatch/page";

type timerGenreType = "stopWatch" | "pomodoro";

const TimerComponent = () => {

  const [timerGenre, setTimerGenre] = useState<timerGenreType>("stopWatch");

  // タブを切り替えるときの関数
  const handleTabChange = (nextGenre: 'stopWatch' | 'pomodoro') => {

    // すでに開いているタブを開いた場合：何もしない
    if(timerGenre === nextGenre) return;

    else {
      const isConfiremed = window.confirm("計測中の時間はリセットされます、タイマーを切り替えてよろしいですか？")

      // 「いいえ」が押されたら何もしない
      if(!isConfiremed) {
        return;
      }

      setTimerGenre(nextGenre)
    }
  }

    return (
      <div className="font-sans flex flex-col h-full">
        {/* タブ切り替えボタンのエリア */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <span className="font-bold text-[#5c988e] text-sm">BGM Player</span>

          {/* ピル型タブボタン */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-gray-200 gap-1">
            <button
              type="button"
              onClick={() => handleTabChange("stopWatch")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timerGenre === "stopWatch"
                  ? "bg-[#5c988e] text-white shadow-sm"
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              ストップウォッチ
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("pomodoro")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timerGenre === "pomodoro"
                  ? "bg-[#5c988e] text-white shadow-sm"
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              ポモドーロ
            </button>
          </div>
        </div>

        {/* プレイヤー切り替え表示エリア */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {timerGenre === "stopWatch" && <Stopwatch />}
          {timerGenre === "pomodoro" && <PomodoroTimer />}
        </div>
      </div>
    );
  }


export default TimerComponent;

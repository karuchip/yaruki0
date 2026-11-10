import { Dispatch, SetStateAction, useState } from "react";
import { PomodoroTimer } from "../components/time/pomodoro/page";
import Stopwatch from "../components/time/stopwatch/page";
import CustomTimer from "../components/time/customTimer/page";
import { useTranslation } from "react-i18next";

type timerGenreType = "stopWatch" | "timer" | "pomodoro";

type PropType = {
  timerGenre: string,
  setTimerGenre: Dispatch<SetStateAction<timerGenreType>>
}

const TimerComponent = ({timerGenre, setTimerGenre}:PropType) => {

  // 辞書ライブラリ
  const {t} = useTranslation();


  // タブを切り替えるときの関数
  const handleTabChange = (nextGenre: 'stopWatch'| 'timer' | 'pomodoro') => {

    // すでに開いているタブを開いた場合：何もしない
    if(timerGenre === nextGenre) return;

    else {
      const isConfirmed = window.confirm("計測中の時間はリセットされます、タイマーを切り替えてよろしいですか？")

      // 「いいえ」が押されたら何もしない
      if(!isConfirmed) {
        return;
      }

      setTimerGenre(nextGenre)
    }
  }

    return (
      <div className="font-sans flex flex-col h-full">
        {/* タブ切り替えボタンのエリア */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <span className="font-bold text-[#5c988e] text-sm text-[16px]">{t('time.title')}</span>

          {/* ピル型タブボタン */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-gray-200 gap-1">
            <button
              type="button"
              onClick={() => handleTabChange("stopWatch")}
              className={`w-18 lg:w-auto px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timerGenre === "stopWatch"
                  ? "bg-[#5c988e] text-white shadow-sm"
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              {t('time.stopWatch')}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("timer")}
              className={`w-18 lg:w-auto px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timerGenre === "timer"
                  ? "bg-[#5c988e] text-white shadow-sm"
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              {t('time.timer')}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("pomodoro")}
              className={`w-18 lg:w-auto px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timerGenre === "pomodoro"
                  ? "bg-[#5c988e] text-white shadow-sm"
                  : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
              }`}
            >
              {t('time.pomodoro')}
            </button>
          </div>
        </div>

        {/* プレイヤー切り替え表示エリア */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {timerGenre === "stopWatch" && <Stopwatch />}
          {timerGenre === "timer" && <CustomTimer />}
          {timerGenre === "pomodoro" && <PomodoroTimer />}
        </div>
      </div>
    );
  }


export default TimerComponent;

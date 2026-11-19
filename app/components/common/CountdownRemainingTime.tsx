import { useState, useEffect } from 'react';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

type CountdownTimerProps = {
  expiresAt: number;
};

export function CountdownRemainingTime({ expiresAt }: CountdownTimerProps) {

  // 現在時刻から見た「残り時間」を計算する関数
  const getRemaining = () => Math.max(0, expiresAt - Date.now());

  const [remainingTime, setRemainingTime] = useState<number>(0);

  // 期限が変わったりマウントし直されたりしても、expiresAtが同じなら正しい残り時間から再スタートできる！
  useEffect(() => {
    const setState = () => {
      setRemainingTime(getRemaining());
    }
    setState()

    const timer = setInterval(() => {
      const left = getRemaining();
      setRemainingTime(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);



  // 残り時間のフォーマット関数
  const formatTime = (ms: number) => {
    if (ms <= 0) return '期限切れ';

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}時間 ${minutes}分`;
    } else if (minutes > 0) {
      return `${minutes}分 ${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  // 進捗率（0% 〜 100%）の計算
  const percentage = Math.min(100, Math.max(0, (remainingTime / TWENTY_FOUR_HOURS) * 100));

  // 残り時間に応じたバーの色変化（例：残り3時間未満で警告カラー）
  const isUrgent = remainingTime < 3 * 60 * 60 * 1000;
  const barColor = isUrgent ? 'bg-red-500' : 'bg-indigo-500';
  const textColor = isUrgent ? 'text-red-600 font-bold' : 'text-gray-700';

  return (
    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm mx-3">
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <span className="text-gray-500 font-medium">データ自動削除まで</span>
        <span className={textColor}>{formatTime(remainingTime)}</span>
      </div>

      {/* プログレスバーの本体 */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

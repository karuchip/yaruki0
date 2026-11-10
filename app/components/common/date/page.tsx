import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ja'; // 日本語ロケール
import 'dayjs/locale/en'; // 英語ロケール

export default function ShowDate() {
  const { i18n } = useTranslation();

  // 現在の言語（'ja' または 'en'）をdayjsに適用
  dayjs.locale(i18n.language);

  // 言語ごとにフォーマットを出し分ける
  const today =
    i18n.language === 'en'
      ? dayjs().format('MMMM D, YYYY (ddd)') // 例: November 10, 2026 (Tue)
      : dayjs().format('YYYY年M月D日（dd）');   // 例: 2026年11月10日（火）

  return <div className="text-sm font-medium">{today}</div>;
}

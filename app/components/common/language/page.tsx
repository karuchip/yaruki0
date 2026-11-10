import React from 'react';
import { useTranslation } from "react-i18next";

const ChangeLanguage = () => {
  const { i18n } = useTranslation();

  // 現在の言語を取得（'en' か 'ja'）
  const currentLang = i18n.language;

  // 指定した言語に切り替える関数
  const setLanguage = (lang: string) => {
    if (currentLang !== lang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div className="w-fit flex bg-slate-100 p-1 rounded-full border border-gray-200 gap-1 inline-flex items-center">
      {/* 日本語ボタン */}
      <button
        type="button"
        onClick={() => setLanguage("ja")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
          currentLang === "ja"
            ? "bg-[#5c988e] text-white shadow-sm"
            : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
        }`}
      >
        Ja
      </button>

      {/* 英語ボタン */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
          currentLang === "en"
            ? "bg-[#5c988e] text-white shadow-sm"
            : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
        }`}
      >
        En
      </button>
    </div>
  );
};

export default ChangeLanguage;

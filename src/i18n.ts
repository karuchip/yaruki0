// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next) // react-i18nextと連携
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: 'ja', // 初期言語
    fallbackLng: 'ja', // 翻訳が見つからない場合の言語
    interpolation: {
      escapeValue: false, // ReactはデフォルトでXSS対策されているためfalse
    },
  });

export default i18n;

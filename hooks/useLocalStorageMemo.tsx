import { useState, useEffect } from 'react';

const STORAGE_KEY = 'memo_dashboard_data';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface StorageData {
  htmlContent: string;
  createdAt: number;
}

export function useLocalStorageMemo() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 最初の1回だけローカルストレージからデータを復元
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data: StorageData = JSON.parse(raw);
        // 24時間経過していたら削除、そうでなければ復元
        if (Date.now() - data.createdAt > TWENTY_FOUR_HOURS) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setHtmlContent(data.htmlContent);
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // 2. メモの内容が更新されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    const raw = localStorage.getItem(STORAGE_KEY);
    let createdAt = Date.now();

    if (raw) {
      try {
        const data: StorageData = JSON.parse(raw);
        createdAt = data.createdAt;
      } catch (e) {}
    }

    const dataToSave: StorageData = { htmlContent, createdAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [htmlContent, isLoaded]);

  return [htmlContent, setHtmlContent, isLoaded] as const;
}

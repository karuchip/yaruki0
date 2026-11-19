// ユーザー入力項目をlocalStorageにセット/24時間経過後に削除するコードです

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'dashboard_app_data';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  minutes: number;
}

interface DashboardStorageData {
  memo: {
    htmlContent: string;
    createdAt: number;
  };
  todo: {
    todos: Todo[];
    createdAt: number;
  };
}

export function useDashboardData() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 初回マウント時の自動保存を防ぐためのフラグ
  const initialMount = useRef(true);

  // 1. 初期化時にローカルストレージから復元
  const [data, setData] = useState<DashboardStorageData>(() => {

    const now = Date.now();
    const defaultData = {
      memo: { htmlContent: '', createdAt: now },
      todo: { todos: [], createdAt: now },
    };

    // もし今windowが存在しない(サーバー側で実行されている)のなら、localStorageを参照せず空のdefaultデータを返す
    if (typeof window === 'undefined') return defaultData;

    // localStorageからデータを取得
    const raw = localStorage.getItem(STORAGE_KEY);

    // もしlocalStorageにデータがなければ、空のdefaultデータを返す
    if (!raw) return defaultData;

    try {

      // parsedは、ただの文字列をオブジェクト形式に復元したもの。localStorageには文字列しか保存できない
      const parsed: DashboardStorageData = JSON.parse(raw);
      const memoCreatedAt = parsed.memo?.createdAt || 0;
      const todoCreatedAt = parsed.todo?.createdAt || 0;
      const latestCreatedAt = Math.max(memoCreatedAt, todoCreatedAt);

      // データが全くない（両方0）場合
      if (latestCreatedAt === 0) return defaultData;

      // 24時間経っていたら削除
      if (now - latestCreatedAt > TWENTY_FOUR_HOURS) {
        localStorage.removeItem(STORAGE_KEY);
        return defaultData;
      }

      // ローカルストレージにある当時の createdAt をそのまま返す！
      return {
        memo: {
          htmlContent: parsed.memo?.htmlContent || '',
          createdAt: memoCreatedAt || now,
        },
        todo: {
          todos: parsed.todo?.todos || [],
          createdAt: todoCreatedAt || now,
        },
      };
    } catch (e) {
      return defaultData;
    }
  });

  // マウント時のタイマー設定
  useEffect(() => {
    const setState = () => {
      setIsLoaded(true);
    }
    setState();
  }, []);

  // 2. データが更新されたらローカルストレージに保存
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    // 画面が開いたばかりの「初回」の時は、ストレージを上書き保存しない！
    if(initialMount.current) {
      initialMount.current = false;
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, isLoaded]);

  // --- メモ用のセッター ---
  const setMemo = (val: string | ((prev: string) => string)) => {
    setData((prev) => {
      const newContent = typeof val === 'function' ? val(prev.memo.htmlContent) : val;

      // もし中身のテキストが直前と同じなら、createdAtを絶対に更新しない！
      const isContentChanged = newContent !== prev.memo.htmlContent;

      return {
        ...prev,
        memo: {
          htmlContent: newContent,
          // 変更があった時だけ現在時刻にする。なければ古いcreatedAtを死守する！
          createdAt: isContentChanged ? Date.now() : prev.memo.createdAt,
        },
      };
    });
  };

  // --- TODO用のセッター ---
  const setTodos = (val: Todo[] | ((prev: Todo[]) => Todo[])) => {
    setData((prev) => {
      const newTodos = typeof val === 'function' ? val(prev.todo.todos) : val;
      return {
        ...prev,
        todo: {
          todos: newTodos,
          // Todoが変更されたときだけ、このTodoの作成日時を今に更新
          createdAt: Date.now(),
        },
      };
    });
  };

  // 期限の計算（一番直近のアクティビティを基準にする）
  const latestCreatedAt = Math.max(data.memo.createdAt, data.todo.createdAt);
  const expiresAt = latestCreatedAt + TWENTY_FOUR_HOURS;

  return {
    memo: data.memo.htmlContent,
    setMemo,
    todos: data.todo.todos,
    setTodos,
    isLoaded,
    expiresAt,
  };
}

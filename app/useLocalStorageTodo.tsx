import { useState, useEffect } from 'react';

const STORAGE_KEY = 'todo_dashboard_data';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  minutes: number;
}

interface StorageData {
  todos: Todo[];
  createdAt: number;
}

export function useLocalStorageTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // ブラウザでの読み込みが完了したかどうかのフラグ
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 最初の1回だけローカルストレージからデータを復元
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data: StorageData = JSON.parse(raw);
        if (Date.now() - data.createdAt > TWENTY_FOUR_HOURS) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setTodos(data.todos);
        }
      } catch (error) {
        console.error('Failed to parse localStorage', error);
      }
    }
    // 読み込みが完了したことをマーク
    setIsLoaded(true);
  }, []);

  // 2. todosが更新されたらローカルストレージに保存
  useEffect(() => {
    // データの読み込みがまだ終わっていない（isLoadedがfalse）なら、空配列で上書き保存するのを防ぐ
    if (!isLoaded) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    let createdAt = Date.now();

    if (raw) {
      try {
        const data: StorageData = JSON.parse(raw);
        createdAt = data.createdAt;
      } catch (error) {
        console.error('Failed to parse localStorage', error);
      }
    }

    const dataToSave: StorageData = { todos, createdAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [todos, isLoaded]); // isLoadedも監視対象に入れる

  // 画面側で「読み込み中かどうか」を判定できるように、isLoadedも一緒に返してあげます
  return [todos, setTodos, isLoaded] as const;
}

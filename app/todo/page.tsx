import React, { useMemo, useState } from 'react';
import { useLocalStorageTodo, Todo } from '@/hooks/useLocalStorageTodo';

export default function TodoDashboard() {
  const [todos, setTodos, isLoaded] = useLocalStorageTodo();
  const [newText, setNewText] = useState('');

  // 1. ToDoの新規追加
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: newText,
      completed: false,
      minutes: 0,
    };

    setTodos([...todos, newTodo]);
    setNewText('');
  };

  // 2. チェックボックスの切り替え
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. 後から作業時間を変更する
  const updateMinutes = (id: string, minutes: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, minutes: Math.max(0, minutes) } : todo
      )
    );
  };

  // 4. 作業時間の合計を自動計算
  const totalMinutes = useMemo(() => {
    return todos.reduce((sum, todo) => sum + todo.minutes, 0);
  }, [todos]);

  // 分を「時間と分」に変換
  const formatTime = (totalMin: number) => {
    const hours = Math.floor(totalMin / 60);
    const min = totalMin % 60;
    return hours > 0 ? `${hours}時間 ${min}分` : `${min}分`;
  };

  // 5. タスクの削除
  const deleteTask = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 6. タスクの編集
  const updateTask = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  if(!isLoaded) {
    return<p>読み込み中...</p>
  }

  return (
    <div id="dashboard-view" className="font-sans h-full flex flex-col">
      <h2 className="text-base font-bold mb-3 text-[#5c988e]">作業ダッシュボード (ToDo)</h2>
      {/* 登録フォーム（ToDo内容のみ） */}
      <div className="shrink-0">
        <form onSubmit={addTodo} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="新しいToDoを入力..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-grow p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5c988e]"
          />
          <button type="submit" className="px-4 py-2 bg-[#5c988e] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0">追加</button>
        </form>
      </div>

      {/* ToDoリストの一覧 */}
      <ul className="list-none p-0 space-y-2 overflow-y-auto flex-1 min-h-0 pr-1 my-1">
        {[...todos].reverse().map((todo) => (
          <li key={todo.id} className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg text-sm border border-gray-100">
            {/* チェックボックス */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 accent-[#5c988e] cursor-pointer"
            />

            {/* ToDoテキスト */}
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateTask(todo.id, e.target.value)}
              className={`flex-grow bg-transparent focus:outline-none ${todo.completed ? 'line-through text-gray-400' : 'text-slate-800'}`}
            />

            {/* 後から入力できる作業時間インプット */}
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={todo.minutes || ''}
                onChange={(e) => updateMinutes(todo.id, Number(e.target.value))}
                className="w-12 p-1 text-right bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#5c988e]"
              />
              <span className="text-xs text-gray-400">分</span>
            </div>

            {/* 削除ボタン */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => deleteTask(todo.id)}
                className="p-1 cursor-pointer text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 合計時間の表示 */}
      <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-sm text-slate-700 shrink-0 mt-auto">
        <span>合計作業時間</span>
        <span className="text-[#5c988e] font-mono">{formatTime(totalMinutes)}</span>
      </div>
    </div>
  );
}

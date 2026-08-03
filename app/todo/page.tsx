import React, { useMemo, useState } from 'react';
import { useLocalStorageTodo, Todo } from '@/app/useLocalStorageTodo';

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
    <div id="dashboard-view" className="p-5 max-w-2xl font-sans">
      <h2>作業ダッシュボード (ToDo)</h2>

      {/* 登録フォーム（ToDo内容のみ） */}
      <form onSubmit={addTodo} className="mb-5 flex gap-2.5">
        <input
          type="text"
          placeholder="新しいToDoを入力..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-grow p-2"
        />
        <button type="submit" className="px-4 py-2">追加</button>
      </form>

      {/* ToDoリストの一覧 */}
      <ul className="list-none p-0">
        {todos.map((todo) => (
          <li key={todo.id} className="mb-3 flex items-center gap-3">
            {/* チェックボックス */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-[18px] h-[18px]"
            />

            {/* ToDoテキスト */}
            <input
              type="text"
              value={todo.text}
              onChange={(e) => updateTask(todo.id, e.target.value)}
              className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-black'}`}
            />

            {/* 後から入力できる作業時間インプット */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={todo.minutes || ''}
                onChange={(e) => updateMinutes(todo.id, Number(e.target.value))}
                className="w-[60px] p-1 text-right"
              />
              <span className="text-sm text-gray-500">分</span>
            </div>

            {/* 削除ボタン */}
            <div>
              <button
                onClick={() => deleteTask(todo.id)}
                className="p-1 cursor-pointer text-red-500"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 合計時間の表示 */}
      <div className="mt-5 pt-4 border-t-2 border-gray-300 flex justify-between font-bold text-lg">
        <span>合計作業時間</span>
        <span>{formatTime(totalMinutes)}</span>
      </div>
    </div>
  );
}

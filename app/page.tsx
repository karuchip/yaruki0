"use client"

import { useState } from "react"
import MemoEditor from "./memo/page"
import { PomodoroTimer } from "./timer/page"
import TodoDashboard from "./todo/page"

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'todo' | 'memo'

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden">
      {/* アプリケーションヘッダー */}
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#5c988e]" />
          <h1 className="text-xl font-bold tracking-wide text-[#5c988e]">Yaruki</h1>
        </div>

        {/* モバイル・タブレット用 タブ切替ボタン (lg以上では非表示) */}
        <nav className="flex lg:hidden bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timer' ? 'bg-white text-[#5c988e] shadow-sm font-bold' : 'text-gray-500'
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'todo' ? 'bg-white text-[#5c988e] shadow-sm font-bold' : 'text-gray-500'
            }`}
          >
            ToDo
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'memo' ? 'bg-white text-[#5c988e] shadow-sm font-bold' : 'text-gray-500'
            }`}
          >
            Memo
          </button>
        </nav>
      </header>

      {/* メインコンテンツエリア */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        {/* === PC表示 (デスクトップ：lg以上) === */}
        <div className="hidden lg:grid grid-cols-12 gap-6 h-full max-w-7xl mx-auto">
          {/* 左カラム：タイマー & ToDo */}
          <div className="col-span-5 flex flex-col gap-6 h-full overflow-hidden">
            <div className="shrink-0 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <PomodoroTimer />
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm overflow-y-auto">
              <TodoDashboard />
            </div>
          </div>

          {/* 右カラム：メモエディタ */}
          <div className="col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full overflow-hidden">
            <MemoEditor />
          </div>
        </div>

        {/* === スマホ・タブレット表示 (lg未満) === */}
        <div className="block lg:hidden h-full overflow-y-auto bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          {activeTab === 'timer' && <PomodoroTimer />}
          {activeTab === 'todo' && <TodoDashboard />}
          {activeTab === 'memo' && <MemoEditor />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard

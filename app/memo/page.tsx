'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLocalStorageMemo } from '@/hooks/useLocalStorageMemo';

export default function MemoEditor() {
  const [htmlContent, setHtmlContent, isLoaded] = useLocalStorageMemo();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
    ],
    // ユーザーが入力を進めるたびに、最新のHTMLをStateに格納（自動保存へ連動）
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  // ローカルストレージからの読み込みが完了したら、エディタに初期値をセットする
  useEffect(() => {
    if (isLoaded && editor && htmlContent) {
      // 現在のエディタの中身とストレージの中身が違う場合のみセット（無限ループ防止）
      if (editor.getHTML() !== htmlContent) {
        editor.commands.setContent(htmlContent);
      }
    }
  }, [isLoaded, editor, htmlContent]);

  // Next.jsのハイドレーションエラー防止：クライアント側での準備ができるまでは何も出さない
  if (!isLoaded || !editor) {
    return <div className="p-5 max-w-2xl font-sans text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="font-sans flex flex-col h-full">
      {/* メニューバー */}
      <div className="flex gap-3 mb-3 text-sm items-center justify-between border-b border-gray-100 pb-2 shrink-0">
        <span className="font-bold text-[#5c988e] text-base">Memo</span>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`cursor-pointer px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive('bold') ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Bold
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`cursor-pointer px-2 py-1 rounded text-xs transition-colors ${
              editor.isActive('bulletList') ? 'bg-[#5c988e]/10 text-[#5c988e] font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            • List
          </button>
        </div>
      </div>

      {/* エディタ本体 */}
      <div
        onClick={() => editor?.chain().focus().run()}
        className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex-1 overflow-y-auto cursor-text"
      >
        <EditorContent
          editor={editor}
          className="focus:outline-none min-h-full text-sm text-slate-700 [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:ring-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
        />
      </div>

      {/* 補足メッセージ */}
      <p className="text-[11px] text-gray-400 mt-2 shrink-0">
        ※ 箇条書き中に Tab で右インデント、Shift + Tab で左インデントができます。
      </p>
    </div>
  );
}

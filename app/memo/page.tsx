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
    <div id="dashboard-view" className="p-5 max-w-2xl font-sans">
      {/* メニューバー（上部のプレーンな操作ボタン） */}
      <div className="flex gap-4 mb-3 text-sm justify-end text-gray-600">
        <span className="font-bold text-teal-600 mr-auto text-lg">Memo</span>

        {/* 太字ボタン */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`cursor-pointer ${editor.isActive('bold') ? 'font-bold text-black' : 'text-gray-400'}`}
        >
          Bold
        </button>

        {/* リストボタン */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`cursor-pointer ${editor.isActive('bulletList') ? 'font-bold text-black' : 'text-gray-400'}`}
        >
          • List
        </button>
      </div>

      {/* エディタ本体（インラインスタイルなし、最低限のプレーンなスタイル） */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <EditorContent
          editor={editor}
          className="focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
        />
      </div>

      {/* キーボード操作の補足 */}
      <p className="text-xs text-gray-400 mt-2">
        ※ 箇条書き中に Tab キーで右インデント、Shift + Tab キーで左インデントができます。
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function YoutubePlayer() {

  // 辞書ライブラリ
    const {t} = useTranslation();

  // 初期値にお気に入りの作業用BGMなどのYouTube IDを設定しておくと便利！
  const [inputUrl, setInputUrl] = useState('');
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // デフォルト動画ID (例: Lofi Girl)

  // YouTubeの各種URL形式から「動画ID」だけを綺麗に抽出する関数
  const extractVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url; // 11桁のID直接入力にも対応
  };

  const handleSetVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const extractedId = extractVideoId(inputUrl.trim());
    if (extractedId) {
      setVideoId(extractedId);
      setInputUrl(''); // 入力欄をクリア
    } else {
      alert('有効なYouTubeのURLまたは動画IDを入力してください');
    }
  };

  return (
    <div className="font-sans flex flex-col h-full">
      {/* ヘッダーエリア */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <span className="font-bold text-[#5c988e] text-sm"></span>
      </div>

      {/* URL / ID 入力フォーム */}
      <form onSubmit={handleSetVideo} className="flex gap-2 mb-3 shrink-0">
        <input
          type="text"
          placeholder={t('BGM.description')}
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-grow p-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#5c988e] bg-slate-50"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#5c988e] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          {t('BGM.load')}
        </button>
      </form>

      {/* 埋め込みプレイヤー表示エリア */}
      <div className="bg-slate-50 p-1.5 rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden h-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube BGM Player"
          className="w-full flex-1 rounded-lg h-full lg:h-[152px]"
        />
      </div>
    </div>
  );
}

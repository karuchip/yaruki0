import React, { useState } from 'react';

// 各ジャンルごとのSpotifyプレイリストID（例）
const spotifyPlaylists = {
  piano: '37i9dQZF1DX4sWSpwq3LiO',     // 実際のSpotifyのプレイリストIDに置き換え
  acoustic: '37i9dQZF1DXc8kgYqQLMfH',
  classical: '37i9dQZF1DWWEJlAGA9gs0',
  jazz: '37i9dQZF1DXbITWG1ZJKYt',
  hawaiian: 'YOUR_HAWAIIAN_PLAYLIST_ID', // ハワイアンのプレイリストID
};

export default function SpotifyPlayer() {
  const [genre, setGenre] = useState<keyof typeof spotifyPlaylists>('piano');

  return (
    <div className="font-sans flex flex-col h-full">
      {/* ヘルパー部分（ヘッダーとジャンルボタン） */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <span className="font-bold text-[#5c988e] text-sm">BGM</span>

        {/* ジャンル選択ボタン */}
        <div className="flex gap-1 overflow-x-auto text-xs">
          {Object.keys(spotifyPlaylists).map((key) => (
            <button
              key={key}
              onClick={() => setGenre(key as keyof typeof spotifyPlaylists)}
              className={`px-2 py-0.5 rounded-md capitalize transition-colors cursor-pointer ${
                genre === key ? 'bg-[#5c988e] text-white font-bold' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Spotify iFrame 埋め込みエリア */}
      {/* スマホ(lg未満)では flex-1 で残り領域いっぱい、PC(lg以上)では h-[152px] に固定 */}
      <div className="bg-slate-50 p-1.5 rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden h-full">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${spotifyPlaylists[genre]}?utm_source=generator&theme=0`}
          width="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify ${genre} playlist`}
          className="w-full rounded-lg h-full"
        />
      </div>
    </div>
  );
}

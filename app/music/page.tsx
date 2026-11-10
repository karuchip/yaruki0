import { useState } from "react"
import SpotifyPlayer from "../components/spotifyPlayer/page"
import YoutubePlayer from "../components/youtubePlayer/page"
import { useTranslation } from "react-i18next";

type MusicGenreType = "spotify" | "youtube";

const Music = () => {

  const [musicGenre, setMusicGenre] = useState<MusicGenreType>("youtube");

    // 辞書ライブラリ
    const {t} = useTranslation();


  return (
    <div className="font-sans flex flex-col h-full">
      {/* タブ切り替えボタンのエリア */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <span className="font-bold text-[#5c988e] text-[16px]">{t('BGM.title')}</span>

        {/* ピル型タブボタン */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-gray-200 gap-1">
          <button
            type="button"
            onClick={() => setMusicGenre("spotify")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              musicGenre === "spotify"
                ? "bg-[#5c988e] text-white shadow-sm"
                : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
            }`}
          >
            Spotify
          </button>

          <button
            type="button"
            onClick={() => setMusicGenre("youtube")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              musicGenre === "youtube"
                ? "bg-[#5c988e] text-white shadow-sm"
                : "text-gray-500 hover:text-slate-800 hover:bg-slate-200/60"
            }`}
          >
            YouTube
          </button>
        </div>
      </div>

      {/* プレイヤー切り替え表示エリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {musicGenre === "spotify" && <SpotifyPlayer />}
        {musicGenre === "youtube" && <YoutubePlayer />}
      </div>
    </div>
  );
}

export default Music

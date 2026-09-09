import React from 'react';
import { Sparkles, Trophy, Languages } from 'lucide-react';
import { getIconAccentColor } from '../App';

interface EnglishGamesHubProps {
  onClose: () => void;
  onOpenWordGame: () => void;
  playMp3?: (src: string, onEnded?: () => void) => void;
}

export const EnglishGamesHub: React.FC<EnglishGamesHubProps> = ({
  onClose,
  onOpenWordGame,
  playMp3
}) => {
  const triggerSound = (src: string) => {
    if (playMp3) {
      playMp3(src);
    }
  };

  const games = [
    {
      id: 'kelime_oyunlari',
      title: 'Kelime Oyunları',
      subtitle: '1, 2 ve 3 Kişilik Türkçe - İngilizce Eşleştirme & Kelime Kapışması',
      icon: '/MENUIKON/grid_icon_14.png',
      sound: '/coin.mp3',
      action: onOpenWordGame,
      badge: 'ÇOKLU OYUNCU',
      badgeColor: 'bg-emerald-500 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-sans select-none overflow-hidden bg-slate-900 text-white">
      {/* 1. CINEMATIC BACKGROUND IMAGE */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/dere3.jpg"
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* 2. TOP HEADER BAR */}
      <header className="relative z-30 bg-[#0b1328]/95 backdrop-blur-md border-b border-slate-700/80 px-2 sm:px-4 py-1.5 flex items-center justify-between shadow-lg shrink-0">
        <button
          onClick={() => {
            triggerSound('/op.mp3');
            onClose();
          }}
          title="Ana Sayfaya Dön"
          className="group relative w-[88px] h-[30px] sm:w-[110px] sm:h-[38px] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/butt.png')` }}
          />
          <span className="relative z-10 text-white font-black text-[9px] sm:text-xs tracking-wider [text-shadow:0_2px_0_#000,0_3px_6px_rgba(0,0,0,0.8)] uppercase select-none -translate-y-[1px]">
            ANA MENÜ
          </span>
        </button>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#121c2e] text-slate-300 font-bold text-[8px] sm:text-[10px] tracking-wider uppercase border border-slate-700">
            <Languages size={11} className="text-sky-400 shrink-0" />
            <span>6. BÖLÜM</span>
            <Sparkles size={11} className="text-sky-400 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-100 tracking-wide uppercase mt-0.5">
            İngilizce Oyunlar
          </h1>
        </div>

        <div className="w-12 sm:w-16 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
            <Trophy size={16} />
          </div>
        </div>
      </header>

      {/* 3. GAMES CONTAINER */}
      <main className="relative z-10 flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2 sm:gap-2.5 pt-3 sm:pt-4 md:pt-5">
        {/* GLOWING HEADER BADGE - 6. İNGİLİZCE OYUNLAR */}
        <div className="flex flex-col items-center justify-center mt-0.5 sm:mt-1 mb-1.5 sm:mb-2 max-w-2xl w-full mx-auto shrink-0 py-0.5">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-600/30 via-cyan-500/35 to-emerald-600/30 border-2 border-teal-400/80 shadow-[0_4px_20px_rgba(20,184,166,0.4)] backdrop-blur-xs">
            <img src="/icon_6.png" alt="6. İngilizce Oyunlar" className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter drop-shadow-sm shrink-0" />
            <span className="text-xs sm:text-sm md:text-base font-black text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              6. İNGİLİZCE OYUNLAR
            </span>
            <span className="text-slate-400 font-bold">•</span>
            <span className="text-[10px] sm:text-xs md:text-sm font-black text-teal-300 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              OYUNUNU SEÇ VE BAŞLA
            </span>
            <span className="text-amber-300 text-xs sm:text-sm animate-pulse">✨</span>
          </div>
        </div>

        <div className="w-full text-center py-0.5 mb-1 sm:mb-1.5">
          <p className="text-xs sm:text-sm font-medium text-slate-400 flex items-center justify-center gap-2">
            <span>🎮</span>
            <span>Oynamak istediğin İngilizce oyununu seç ve başla!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
          {games.map(game => {
            const accent = getIconAccentColor(game.icon);
            return (
              <button
                key={game.id}
                onClick={() => {
                  triggerSound(game.sound);
                  game.action();
                }}
                className={`group relative w-full bg-[#121c2e] hover:bg-[#18263e] active:bg-[#0e1726] border-2 border-slate-700/80 border-l-4 ${accent.border} ${accent.hover} rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-4 min-h-[78px] sm:min-h-[88px] md:min-h-[96px] flex items-center gap-3 sm:gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer overflow-hidden text-left`}
              >
                {/* 3D Icon */}
                <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 -my-1">
                  <img
                    src={game.icon}
                    alt={game.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] group-hover:scale-115 group-hover:-rotate-3 transition-transform select-none pointer-events-none"
                  />
                </div>

                {/* Text Area - FULL TITLE */}
                <div className="flex-1 min-w-0 py-0.5 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-800 text-sky-300 border border-slate-600 shadow-xs">
                      {game.badge}
                    </span>
                  </div>
                  <h4 className="font-black text-sm sm:text-base md:text-lg text-slate-100 group-hover:text-white transition-colors leading-snug uppercase tracking-wide break-words">
                    {game.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5 leading-snug break-words">
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} inline-block shrink-0`} />
                    <span>{game.subtitle}</span>
                  </p>
                </div>

                {/* 3D "OYNA" image */}
                <div className="relative shrink-0 w-[84px] h-[38px] sm:w-[104px] sm:h-[46px] md:w-[118px] md:h-[52px] group-hover:scale-105 transition-transform filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                    style={{ backgroundImage: `url('/ply.png')` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

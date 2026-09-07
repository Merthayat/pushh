import React from 'react';
import { Sparkles, Trophy, Languages } from 'lucide-react';

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
      <header className="relative z-30 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b-3 border-sky-400 dark:border-sky-500/80 px-2 sm:px-4 py-1.5 flex items-center justify-between shadow-lg shrink-0">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-blue-950 font-black text-[8px] sm:text-[10px] tracking-wider uppercase shadow-xs border border-white">
            <Languages size={11} className="text-blue-950 shrink-0" />
            <span>6. BÖLÜM</span>
            <Sparkles size={11} className="text-blue-950 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-amber-950 dark:text-amber-300 tracking-wide uppercase drop-shadow-sm leading-tight mt-0.5">
            İngilizce Oyunlar
          </h1>
        </div>

        <div className="w-12 sm:w-16 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Trophy size={16} />
          </div>
        </div>
      </header>

      {/* 3. GAMES CONTAINER */}
      <main className="relative z-10 flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2 sm:gap-2.5 pt-3 sm:pt-4 md:pt-5">
        {/* COMPACT CATEGORY HEADER BADGE (MATCHING ALL OTHER GRADES) */}
        <div className="flex flex-col items-center justify-center mt-1 sm:mt-1.5 mb-1.5 sm:mb-2 max-w-4xl w-full mx-auto shrink-0 py-0.5">
          <div className="z-10 flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-blue-950 px-4 sm:px-7 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 sm:border-2.5 border-white shadow-[0_3px_10px_rgba(0,0,0,0.5)] font-black text-xs sm:text-sm md:text-base uppercase tracking-wider max-w-full shrink-0">
            <div className="relative shrink-0 flex items-center justify-center">
              <img src="/icon_6.png" alt="6. İngilizce Oyunlar" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
            </div>
            <span className="drop-shadow-xs break-words">6. İngilizce Oyunlar</span>
            <img src="/icon_6.png" alt="6. Bölüm" className="h-6 sm:h-7 md:h-8 w-auto object-contain shrink-0 filter drop-shadow-xs ml-1" />
          </div>
        </div>

        <div className="w-full text-center py-0.5">
          <p className="text-xs sm:text-sm md:text-base font-bold text-sky-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
            <span>🎮</span>
            <span>Oynamak istediğin İngilizce oyununu seç ve başla!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => {
                triggerSound(game.sound);
                game.action();
              }}
              className="group relative w-full bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900 border-2 border-white dark:border-sky-300 ring-2 ring-sky-300/80 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-4 min-h-[78px] sm:min-h-[88px] md:min-h-[96px] flex items-center gap-3 sm:gap-4 shadow-[0_4px_0_#1e3a8a,0_6px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_#1e3a8a,0_10px_20px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#1e3a8a] transition-all cursor-pointer overflow-hidden text-left"
            >
              {/* Glossy top shine */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-2xl" />

              {/* 3D Icon */}
              <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22">
                <img
                  src={game.icon}
                  alt={game.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-2 transition-transform select-none pointer-events-none"
                />
              </div>

              {/* Text Area - FULL TITLE, NO ELLIPSIS */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${game.badgeColor} shadow-xs`}>
                    {game.badge}
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base md:text-lg text-white group-hover:text-yellow-300 transition-colors leading-snug drop-shadow-xs uppercase tracking-wide break-words">
                  {game.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-sky-200 font-bold mt-1 uppercase tracking-wider drop-shadow-xs flex items-start gap-1.5 leading-snug whitespace-normal break-words">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0 mt-1" />
                  <span>{game.subtitle}</span>
                </p>
              </div>

              {/* 3D "OYNA" image */}
              <div className="relative shrink-0 w-[84px] h-[38px] sm:w-[104px] sm:h-[46px] md:w-[118px] md:h-[52px] group-hover:scale-105 transition-transform filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                  style={{ backgroundImage: `url('/ply.png')` }}
                />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

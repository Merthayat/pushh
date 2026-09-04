import React from 'react';
import { Sparkles, ArrowLeft, Swords, BookOpen, Brain, Play, Star, Flame, Trophy } from 'lucide-react';

interface OtherGamesHubProps {
  onClose: () => void;
  onOpenXOX: () => void;
  onOpenZitAnlam: () => void;
  onOpenEsAnlam: () => void;
  onOpen3DLab?: () => void;
  onOpenGeoboard?: () => void;
  playMp3?: (src: string, onEnded?: () => void) => void;
}

export const OtherGamesHub: React.FC<OtherGamesHubProps> = ({
  onClose,
  onOpenXOX,
  onOpenZitAnlam,
  onOpenEsAnlam,
  onOpen3DLab,
  onOpenGeoboard,
  playMp3
}) => {
  const triggerSound = (src: string) => {
    if (playMp3) {
      playMp3(src);
    }
  };

  const games = [
    {
      id: 'xox',
      title: 'XOX & Zeka Düellosu',
      subtitle: 'Tic-Tac-Toe & Bot/Arkadaş Meydan Okuması',
      icon: '/MENUIKON/grid_icon_32.png',
      sound: '/coin.mp3',
      action: onOpenXOX,
    },
    {
      id: 'zit_anlam',
      title: 'Zıt Anlamlı Kelimeler',
      subtitle: '1, 2 ve 3 Kişilik Yarış & Hafıza Kartları',
      icon: '/MENUIKON/grid_icon_27.png',
      sound: '/farklilvl.mp3',
      action: onOpenZitAnlam,
    },
    {
      id: 'es_anlam',
      title: 'Eş Anlamlı Kelimeler',
      subtitle: '1, 2 ve 3 Kişilik Anlamdaş Kelime Kapışması',
      icon: '/MENUIKON/grid_icon_21.png',
      sound: '/para.mp3',
      action: onOpenEsAnlam,
    },
    {
      id: 'lab3d',
      title: '3D Geometri & Şekil Laboratuvarı',
      subtitle: '3 Boyutlu Cisimler, Döndürme & Yüzey Keşfi',
      icon: '/MENUIKON/grid_icon_39.png',
      sound: '/coin.mp3',
      action: () => {
        if (onOpen3DLab) onOpen3DLab();
      },
    },
    {
      id: 'geoboard',
      title: 'Geometri Tahtası',
      subtitle: 'Noktalı Tahta & Parmakla Şekil Çizimi',
      icon: '/MENUIKON/grid_icon_29.png',
      sound: '/coin.mp3',
      action: () => {
        if (onOpenGeoboard) onOpenGeoboard();
      },
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col font-sans select-none overflow-hidden bg-slate-900 text-white">
      {/* 1. SAME BACKGROUND IMAGE AS OTHER CLASSROOM ACTIVITIES (/intro2.png) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/intro2.png" 
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* 2. TOP HEADER BAR */}
      <header className="relative z-30 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b-3 border-yellow-400 dark:border-yellow-500/80 px-2 sm:px-4 py-1.5 flex items-center justify-between shadow-lg shrink-0">
        <button
          onClick={onClose}
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
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-blue-950 font-black text-[8px] sm:text-[10px] tracking-wider uppercase shadow-xs border border-white">
            <Sparkles size={10} className="text-blue-950 shrink-0" />
            <span>5. BÖLÜM</span>
            <Sparkles size={10} className="text-blue-950 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-amber-950 dark:text-amber-300 tracking-wide uppercase drop-shadow-sm leading-tight mt-0.5">
            Diğer Oyunlar
          </h1>
        </div>

        <div className="w-12 sm:w-16 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
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
              <img src="/icon_5.png" alt="5. Diğer Oyunlar" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
            </div>
            <span className="drop-shadow-xs break-words">5. Diğer Oyunlar</span>
            <img src="/icon_5.png" alt="5. Bölüm" className="h-6 sm:h-7 md:h-8 w-auto object-contain shrink-0 filter drop-shadow-xs ml-1" />
          </div>
        </div>

        <div className="w-full text-center py-0.5">
          <p className="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            🎮 Oynamak istediğin oyuna dokun ve kapışmaya başla!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => {
                triggerSound(game.sound);
                game.action();
              }}
              className={`group relative w-full bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900 border-2 border-white dark:border-amber-300 ring-1 ring-amber-300/80 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 pr-3 sm:pr-4 min-h-[74px] sm:min-h-[84px] md:min-h-[90px] flex items-center gap-3 sm:gap-4 shadow-[0_3px_0_#1e3a8a,0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_0_#1e3a8a,0_8px_16px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#1e3a8a] transition-all cursor-pointer overflow-hidden text-left ${
                index === games.length - 1 && games.length % 2 === 1 ? 'sm:col-span-2 sm:max-w-xl sm:mx-auto' : ''
              }`}
            >
              {/* Glossy top shine */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-xl sm:rounded-t-2xl" />

              {/* Pure 3D borderless icon without box */}
              <div className="relative shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18">
                <img
                  src={game.icon}
                  alt={game.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-2 transition-transform select-none pointer-events-none"
                />
              </div>

              {/* Text Area - Full title, subtitle wraps cleanly */}
              <div className="flex-1 min-w-0 py-0.5">
                <h4 className="font-black text-xs sm:text-sm md:text-[15px] text-white group-hover:text-yellow-300 transition-colors leading-snug drop-shadow-xs uppercase tracking-wide break-words">
                  {game.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-yellow-300 font-extrabold mt-0.5 uppercase tracking-wider drop-shadow-xs flex items-start gap-1 leading-snug whitespace-normal break-words">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0 mt-1" />
                  <span>{game.subtitle}</span>
                </p>
              </div>

              {/* 3D Green "OYNA" image */}
              <div className="relative shrink-0 w-[76px] h-[34px] sm:w-[90px] sm:h-[40px] md:w-[104px] md:h-[46px] group-hover:scale-105 transition-transform filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

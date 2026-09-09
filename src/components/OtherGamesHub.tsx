import React from 'react';
import { Sparkles, ArrowLeft, Swords, BookOpen, Brain, Play, Star, Flame, Trophy } from 'lucide-react';
import { getIconAccentColor } from '../App';

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
      {/* 1. SAME BACKGROUND IMAGE AS OTHER CLASSROOM ACTIVITIES (/dere3.jpg) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/dere3.jpg" 
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* 2. TOP HEADER BAR */}
      <header className="relative z-30 bg-[#0b1328]/95 backdrop-blur-md border-b border-slate-700/80 px-2 sm:px-4 py-1.5 flex items-center justify-between shadow-lg shrink-0">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#121c2e] text-slate-300 font-bold text-[8px] sm:text-[10px] tracking-wider uppercase border border-slate-700">
            <Sparkles size={10} className="text-amber-400 shrink-0" />
            <span>5. BÖLÜM</span>
            <Sparkles size={10} className="text-amber-400 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-100 tracking-wide uppercase mt-0.5">
            Diğer Oyunlar
          </h1>
        </div>

        <div className="w-12 sm:w-16 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <Trophy size={16} />
          </div>
        </div>
      </header>

      {/* 3. GAMES CONTAINER */}
      <main className="relative z-10 flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2 sm:gap-2.5 pt-3 sm:pt-4 md:pt-5">
        {/* GLOWING HEADER BADGE - 5. DİĞER OYUNLAR */}
        <div className="flex flex-col items-center justify-center mt-0.5 sm:mt-1 mb-1.5 sm:mb-2 max-w-2xl w-full mx-auto shrink-0 py-0.5">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-fuchsia-600/30 via-pink-500/35 to-purple-600/30 border-2 border-fuchsia-400/80 shadow-[0_4px_20px_rgba(217,70,239,0.4)] backdrop-blur-xs">
            <img src="/icon_5.png" alt="5. Diğer Oyunlar" className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter drop-shadow-sm shrink-0" />
            <span className="text-xs sm:text-sm md:text-base font-black text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              5. DİĞER OYUNLAR
            </span>
            <span className="text-slate-400 font-bold">•</span>
            <span className="text-[10px] sm:text-xs md:text-sm font-black text-fuchsia-300 tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
              OYUNUNU SEÇ VE BAŞLA
            </span>
            <span className="text-amber-300 text-xs sm:text-sm animate-pulse">✨</span>
          </div>
        </div>

        <div className="w-full text-center py-0.5 mb-1 sm:mb-1.5">
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            🎮 Oynamak istediğin oyuna dokun ve kapışmaya başla!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
          {games.map((game, index) => {
            const accent = getIconAccentColor(game.icon);
            return (
              <button
                key={game.id}
                onClick={() => {
                  triggerSound(game.sound);
                  game.action();
                }}
                className={`group relative w-full bg-[#121c2e] hover:bg-[#18263e] active:bg-[#0e1726] border-2 border-slate-700/80 border-l-4 ${accent.border} ${accent.hover} rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 pr-3.5 min-h-[76px] sm:min-h-[86px] md:min-h-[96px] flex items-center gap-2.5 sm:gap-3.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer overflow-hidden text-left ${
                  index === games.length - 1 && games.length % 2 === 1 ? 'sm:col-span-2 sm:max-w-xl sm:mx-auto' : ''
                }`}
              >
                {/* Pure 3D borderless icon without box */}
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 -my-1">
                  <img
                    src={game.icon}
                    alt={game.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] group-hover:scale-115 group-hover:-rotate-3 transition-transform select-none pointer-events-none"
                  />
                </div>

                {/* Text Area - Full title, subtitle wraps cleanly */}
                <div className="flex-1 min-w-0 py-0.5 z-10">
                  <h4 className="font-black text-xs sm:text-sm md:text-base text-slate-100 group-hover:text-white transition-colors leading-snug uppercase tracking-wide break-words">
                    {game.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1 leading-snug break-words">
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} inline-block shrink-0`} />
                    <span>{game.subtitle}</span>
                  </p>
                </div>

                {/* 3D Green "OYNA" image */}
                <div className="relative shrink-0 w-[84px] h-[38px] sm:w-[98px] sm:h-[44px] md:w-[112px] md:h-[50px] group-hover:scale-105 transition-transform filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

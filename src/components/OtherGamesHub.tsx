import React from 'react';
import { Sparkles, ArrowLeft, Swords, BookOpen, Brain, Play, Star, Flame, Trophy } from 'lucide-react';

interface OtherGamesHubProps {
  onClose: () => void;
  onOpenXOX: () => void;
  onOpenZitAnlam: () => void;
  onOpenEsAnlam: () => void;
  onOpenIngilizce?: () => void;
  playMp3?: (src: string, onEnded?: () => void) => void;
}

export const OtherGamesHub: React.FC<OtherGamesHubProps> = ({
  onClose,
  onOpenXOX,
  onOpenZitAnlam,
  onOpenEsAnlam,
  onOpenIngilizce,
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
      subtitle: 'Tic-Tac-Toe & Matematik Meydan Okuması',
      desc: '3x3 Tahta üzerinde Bot veya Arkadaşınla yarış! Hamle yaparken matematik sorularını çözerek ekstra avantaj yakala.',
      badge: '🤖 BOT & 👥 2 OYUNCU',
      badgeColor: 'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40',
      gradient: 'from-purple-600 via-indigo-600 to-blue-700',
      borderColor: 'border-purple-300',
      iconEmoji: '🎮',
      iconBg: 'from-fuchsia-500 to-purple-700',
      sound: '/coin.mp3',
      action: onOpenXOX,
      features: ['Kolay/Orta/Zor Bot', 'Matematik Sorulu Hamle', 'Puan & Seri Takibi']
    },
    {
      id: 'ingilizce',
      title: 'İngilizce Oyunlar',
      subtitle: '2., 3. ve 4. Sınıflar İçin Kelime Yarışması',
      desc: 'Renkler, Hayvanlar, Vücudumuz, Meslekler ve Günlük Eylemler! 2 ve 3 Kişilik Kapışma, Test ve Hafıza kartları.',
      badge: '🇬🇧 2., 3. & 4. SINIF',
      badgeColor: 'bg-sky-500/30 text-sky-200 border-sky-400/40',
      gradient: 'from-sky-500 via-blue-600 to-indigo-700',
      borderColor: 'border-sky-300',
      iconEmoji: '🌍',
      iconBg: 'from-sky-400 to-blue-600',
      sound: '/coin.mp3',
      action: onOpenIngilizce || onOpenZitAnlam,
      features: ['İngilizce - Türkçe Eşleme', '2 & 3 Kişilik Yarış', 'Hafıza Kartları']
    },
    {
      id: 'zit_anlam',
      title: 'Zıt Anlamlı Kelimeler',
      subtitle: '4 Şıklı & 2-3 Kişilik Yarış Modu',
      desc: 'Sıcak-Soğuk, Büyük-Küçük gibi zıt anlamlı kelimeleri eğlenerek öğren! ⚔️ 2 ve 3 Kişilik Yarış, 🎯 4 Şıklı Test ve 🧩 Hafıza kartları.',
      badge: '👑 1, 2 & 3 OYUNCU MODU',
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/40',
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      borderColor: 'border-amber-300',
      iconEmoji: '⚡',
      iconBg: 'from-amber-400 to-orange-600',
      sound: '/farklilvl.mp3',
      action: onOpenZitAnlam,
      features: ['2 & 3 Kişilik Farklı Sorular', '3 Hata Yapan Elenir', 'Hafıza Kartı Eşleştirme']
    },
    {
      id: 'es_anlam',
      title: 'Eş Anlamlı Kelimeler',
      subtitle: '4 Şıklı Anlamdaş Kelime Kapışması',
      desc: 'Okul-Mektep, Hediye-Armağan gibi anlamdaş sözcükleri keşfet! Herkesin sorusu farklı, 3 hata yapanın elendiği heyecan dolu kapışma.',
      badge: '🌸 1, 2 & 3 OYUNCU MODU',
      badgeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40',
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      borderColor: 'border-emerald-300',
      iconEmoji: '📖',
      iconBg: 'from-emerald-400 to-teal-600',
      sound: '/para.mp3',
      action: onOpenEsAnlam,
      features: ['2 & 3 Kişilik Canlı Yarış', '3 Hata Yapan Elenir', '4 Şıklı Kelime Testi']
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col font-sans select-none overflow-hidden bg-slate-900 text-white">
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
            <span>5. BÖLÜM & EĞLENCELİ OYUNLAR</span>
            <Sparkles size={10} className="text-blue-950 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-amber-950 dark:text-amber-300 tracking-wide uppercase drop-shadow-sm leading-tight mt-0.5">
            Diğer Oyunlar & Zeka Düelloları
          </h1>
        </div>

        <div className="w-12 sm:w-16 flex justify-end">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Trophy size={16} />
          </div>
        </div>
      </header>

      {/* 3. GAMES CONTAINER */}
      <main className="relative z-10 flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar flex flex-col justify-center gap-2.5 sm:gap-3.5 my-auto">
        <div className="w-full text-center py-1">
          <p className="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            🎮 Oynamak istediğin oyuna dokun ve kapışmaya başla!
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => {
                triggerSound(game.sound);
                game.action();
              }}
              className={`group relative w-full bg-gradient-to-r ${game.gradient} rounded-2xl p-2.5 sm:p-3.5 border-2 sm:border-3 ${game.borderColor} shadow-[0_6px_20px_rgba(0,0,0,0.35),0_2px_0_rgba(0,0,0,0.25)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 overflow-hidden cursor-pointer ring-2 ring-white/20`}
            >
              {/* Radial Highlight */}
              <div className="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_70%)] pointer-events-none" />

              {/* Left Column: Icon + Text Details */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0 z-10">
                {/* 3D Emoji Icon Frame */}
                <div className={`shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${game.iconBg} border-2 sm:border-3 border-white shadow-md flex items-center justify-center p-1 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <span className="text-xl sm:text-2xl filter drop-shadow-md">{game.iconEmoji}</span>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wide border ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-xs sm:text-base md:text-lg text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                    {game.title}
                  </h3>
                  <p className="text-[9px] sm:text-xs font-extrabold text-white/90 mt-0.5 drop-shadow-xs line-clamp-2">
                    {game.desc}
                  </p>
                </div>
              </div>

              {/* Right Column: Features Pill + Play Button */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 z-10 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/15">
                <div className="hidden md:flex flex-col gap-0.5 text-[9px] font-bold text-white/80 text-right pr-2">
                  {game.features.map((f, i) => (
                    <span key={i} className="flex items-center justify-end gap-1">
                      <Star size={10} className="text-yellow-300" />
                      {f}
                    </span>
                  ))}
                </div>

                <div className="relative w-[65px] h-[26px] sm:w-[84px] sm:h-[34px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] flex items-center justify-center ml-auto sm:ml-0">
                  <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

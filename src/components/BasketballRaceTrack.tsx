import React from 'react';

export interface RaceTrackPlayer {
  id: number;
  score: number;
  name?: string;
  [key: string]: any;
}

interface BasketballRaceTrackProps {
  players: RaceTrackPlayer[];
  playerCountMode: number;
  targetScore?: number;
}

interface MascotConfig {
  playerIndex: number;
  groupName: string;
  character: string;
  img: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  centerYPercent: number; // Exact optical lane center in par2.png / par3.png
}

export const BasketballRaceTrack: React.FC<BasketballRaceTrackProps> = ({
  players,
  playerCountMode,
  targetScore = 10
}) => {
  const activeCount = Math.min(playerCountMode, players.length, 3);
  if (activeCount <= 1) return null;

  // Exact lane centers calculated directly from user's par2.png and par3.png (1792 x 592):
  // par2.png (2 Players):
  // - Lane 1 (Top - 2. GRUP): y center = 204.5px (34.5%)
  // - Lane 2 (Bottom - 1. GRUP): y center = 386.5px (65.3%)
  //
  // par3.png (3 Players):
  // - Lane 1 (Top - 3. GRUP): y center = 175px (29.5%)
  // - Lane 2 (Middle - 2. GRUP): y center = 296.5px (50.1%)
  // - Lane 3 (Bottom - 1. GRUP): y center = 417.5px (70.5%)
  const laneConfigs: MascotConfig[] = activeCount === 2
    ? [
        {
          playerIndex: 1, // 2. GRUP (Top Lane - Red/Ejderha)
          groupName: '2. GRUP',
          character: 'EJDERHA',
          img: '/ejd.png',
          badgeBg: 'from-rose-500 to-pink-600',
          borderColor: 'border-pink-300',
          glowColor: 'shadow-[0_0_8px_rgba(244,63,94,0.7)]',
          centerYPercent: 34.5
        },
        {
          playerIndex: 0, // 1. GRUP (Bottom Lane - Blue/Kaplan)
          groupName: '1. GRUP',
          character: 'KAPLAN',
          img: '/kap.png',
          badgeBg: 'from-blue-500 to-indigo-600',
          borderColor: 'border-cyan-300',
          glowColor: 'shadow-[0_0_8px_rgba(6,182,212,0.7)]',
          centerYPercent: 65.3
        }
      ]
    : [
        {
          playerIndex: 2, // 3. GRUP (Top Lane - Green/Savaşçı)
          groupName: '3. GRUP',
          character: 'SAVAŞÇI',
          img: '/balta.png',
          badgeBg: 'from-emerald-500 to-teal-600',
          borderColor: 'border-emerald-300',
          glowColor: 'shadow-[0_0_8px_rgba(16,185,129,0.7)]',
          centerYPercent: 29.5
        },
        {
          playerIndex: 1, // 2. GRUP (Middle Lane - Red/Ejderha)
          groupName: '2. GRUP',
          character: 'EJDERHA',
          img: '/ejd.png',
          badgeBg: 'from-rose-500 to-pink-600',
          borderColor: 'border-pink-300',
          glowColor: 'shadow-[0_0_8px_rgba(244,63,94,0.7)]',
          centerYPercent: 50.1
        },
        {
          playerIndex: 0, // 1. GRUP (Bottom Lane - Blue/Kaplan)
          groupName: '1. GRUP',
          character: 'KAPLAN',
          img: '/kap.png',
          badgeBg: 'from-blue-500 to-indigo-600',
          borderColor: 'border-cyan-300',
          glowColor: 'shadow-[0_0_8px_rgba(6,182,212,0.7)]',
          centerYPercent: 70.5
        }
      ];

  const trackSrc = activeCount === 2 ? '/par2.png' : '/par3.png';

  return (
    <div className="w-full flex justify-center mb-0.5 shrink-0 select-none px-1">
      {/* 
        BASKETBALL COURT CONTAINER:
        - Kompakt genişlik (max-w-[360px] sm:max-w-[390px]) ile dikey yükseklik sadece ~65-75px kaplar.
        - Soru metinleri ve görseller için dikey alan genişletilmiştir.
      */}
      <div 
        style={{ aspectRatio: '1792 / 592' }}
        className="relative w-full max-w-[360px] sm:max-w-[390px] rounded-lg overflow-hidden bg-transparent"
      >
        {/* PAR2.PNG (2 Players) OR PAR3.PNG (3 Players) */}
        <img
          key={`track-img-${activeCount}`}
          src={trackSrc}
          alt={activeCount === 2 ? '2 Kişilik Basketbol Parkuru' : '3 Kişilik Basketbol Parkuru'}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />

        {/* OVERLAY WITH RUNNING MASCOTS AND DRIBBLING BASKETBALL */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {laneConfigs.map((cfg) => {
            const player = players[cfg.playerIndex];
            const currentScore = Math.max(0, Math.min(targetScore, player?.score || 0));
            const progressRatio = currentScore / targetScore;
            const isWinner = currentScore >= targetScore;

            // Compact mascot sizing to match half-width track
            const mascotSize = activeCount === 2 
              ? 'w-5 h-5 sm:w-6 sm:h-6' 
              : 'w-4 h-4 sm:w-5 sm:h-5';

            return (
              <div
                key={cfg.groupName}
                className="absolute flex items-center transition-all duration-700 ease-out z-30"
                style={{
                  // Travels from start chevron (~13%) to basket hoop (~87%)
                  left: `calc(13% + ${progressRatio} * 74%)`,
                  top: `${cfg.centerYPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative flex items-center">
                  {/* MASCOT CIRCLE */}
                  <div
                    className={`relative ${mascotSize} rounded-full bg-slate-900/90 p-0.5 border border-white/90 ${cfg.glowColor} shadow-sm flex items-center justify-center shrink-0 ${
                      isWinner ? 'scale-125 animate-bounce ring-2 ring-amber-300' : ''
                    }`}
                  >
                    <img
                      src={cfg.img}
                      alt={cfg.character}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      loading="eager"
                      decoding="async"
                    />

                    {/* SCORE BADGE */}
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 font-black text-[6px] sm:text-[7px] px-0.5 rounded-full border border-white leading-none shadow-xs">
                      {currentScore}
                    </span>
                  </div>

                  {/* BOUNCING BASKETBALL 🏀 */}
                  <div className="relative -ml-0.5 -mt-0.5 text-[8px] sm:text-[9px] animate-bounce duration-300 filter drop-shadow-sm select-none">
                    🏀
                  </div>

                  {/* WINNER SLAM DUNK BADGE */}
                  {isWinner && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-blue-950 font-black text-[7px] sm:text-[8px] px-1 py-0.2 rounded-full border border-white shadow-sm animate-pulse uppercase tracking-wider">
                      BASKET! 🎯
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

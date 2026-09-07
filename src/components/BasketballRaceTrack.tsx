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
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  showVictoryVideo?: boolean;
  victoryVideoSrc?: string;
  winnerTitle?: string;
  winnerImg?: string;
  winnerBadgeBg?: string;
  winnerBorderColor?: string;
  winnerGlowColor?: string;
  onVictoryVideoEnd?: () => void;
  soundEnabled?: boolean;
}

interface MascotConfig {
  playerIndex: number;
  groupName: string;
  character: string;
  img: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  centerPercent: number; // In vertical: X center percent (horizontal position in lane)
}

export const BasketballRaceTrack: React.FC<BasketballRaceTrackProps> = ({
  players,
  playerCountMode,
  targetScore = 10,
  orientation = 'vertical',
  className = '',
  showVictoryVideo = false,
  victoryVideoSrc = '/kap.mp4',
  winnerTitle = '1. GRUP ŞAMPİYON! 🏆',
  winnerImg = '/kap.png',
  winnerBadgeBg = 'from-blue-600 via-cyan-500 to-indigo-600',
  winnerBorderColor = 'border-cyan-400',
  winnerGlowColor = 'shadow-[0_0_35px_rgba(6,182,212,0.95)]',
  onVictoryVideoEnd,
  soundEnabled = true
}) => {
  const activeCount = Math.min(playerCountMode, players.length, 3);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (showVictoryVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = !soundEnabled;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay with sound prevented, falling back to muted:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [showVictoryVideo, soundEnabled, victoryVideoSrc]);

  React.useEffect(() => {
    if (showVictoryVideo) {
      // Victory videos are ~2-4s. Safety fallback to advance after 6.0s
      const timer = setTimeout(() => {
        onVictoryVideoEnd?.();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showVictoryVideo, onVictoryVideoEnd]);

  if (activeCount <= 1) return null;

  // Lane configurations matching player groups left-to-right (1. GRUP, 2. GRUP, 3. GRUP)
  const laneConfigs: MascotConfig[] = activeCount === 2
    ? [
        {
          playerIndex: 0, // 1. GRUP (Left Lane - Blue/Kaplumbağa)
          groupName: '1. GRUP',
          character: 'KAPLUMBAĞA',
          img: '/kap1.png',
          badgeBg: 'from-blue-500 to-indigo-600',
          borderColor: 'border-cyan-300',
          glowColor: 'shadow-[0_0_10px_rgba(6,182,212,0.8)]',
          centerPercent: 30.0
        },
        {
          playerIndex: 1, // 2. GRUP (Right Lane - Red/Ejderha)
          groupName: '2. GRUP',
          character: 'EJDERHA',
          img: '/ejd1.png',
          badgeBg: 'from-rose-500 to-pink-600',
          borderColor: 'border-pink-300',
          glowColor: 'shadow-[0_0_10px_rgba(244,63,94,0.8)]',
          centerPercent: 70.0
        }
      ]
    : [
        {
          playerIndex: 0, // 1. GRUP (Left Lane - Blue/Kaplumbağa)
          groupName: '1. GRUP',
          character: 'KAPLUMBAĞA',
          img: '/kap1.png',
          badgeBg: 'from-blue-500 to-indigo-600',
          borderColor: 'border-cyan-300',
          glowColor: 'shadow-[0_0_10px_rgba(6,182,212,0.8)]',
          centerPercent: 21.3
        },
        {
          playerIndex: 1, // 2. GRUP (Middle Lane - Red/Ejderha)
          groupName: '2. GRUP',
          character: 'EJDERHA',
          img: '/ejd1.png',
          badgeBg: 'from-rose-500 to-pink-600',
          borderColor: 'border-pink-300',
          glowColor: 'shadow-[0_0_10px_rgba(244,63,94,0.8)]',
          centerPercent: 50.0
        },
        {
          playerIndex: 2, // 3. GRUP (Right Lane - Green/Savaşçı)
          groupName: '3. GRUP',
          character: 'SAVAŞÇI',
          img: '/balta1.png',
          badgeBg: 'from-emerald-500 to-teal-600',
          borderColor: 'border-emerald-300',
          glowColor: 'shadow-[0_0_10px_rgba(16,185,129,0.8)]',
          centerPercent: 78.7
        }
      ];

  if (orientation === 'vertical') {
    const verticalTrackSrc = activeCount === 2 ? '/park2.png' : '/park3.png';
    // 3 kişilik modda parkur görselinin genişliği %20 daraltıldı (883 * 0.8 = 706.4)
    const trackAspectRatio = activeCount === 2 ? '567 / 1208' : `${883 * 0.8} / 1415`;

    return (
      <div className={`h-full flex flex-col items-center justify-center shrink-0 select-none ${className}`}>
        {/* VERTICAL COURT CONTAINER - Direct image at full frame height without background frame */}
        <div 
          style={{ aspectRatio: trackAspectRatio }}
          className="relative h-full max-h-full w-auto"
        >
          {/* TRACK BACKGROUND IMAGE (Hoop at Top, Start at Bottom) */}
          <img
            key={`track-v-${activeCount}`}
            src={verticalTrackSrc}
            alt={activeCount === 2 ? '2 Kişilik Dikey Parkur' : '3 Kişilik Dikey Parkur'}
            className={`absolute inset-0 w-full h-full ${activeCount === 3 ? 'object-fill' : 'object-contain'} pointer-events-none select-none filter drop-shadow-xl`}
            loading="eager"
            decoding="async"
          />

          {/* OVERLAY WITH ASCENDING MASCOTS TOWARDS TOP BASKET */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {laneConfigs.map((cfg) => {
              const player = players[cfg.playerIndex];
              const currentScore = Math.max(0, Math.min(targetScore, player?.score || 0));
              const progressRatio = currentScore / targetScore;
              const isWinner = currentScore >= targetScore;

              // Mascot sizing without circular frame (larger and arcade-like, tailored for lane widths)
              const mascotSize = activeCount === 2 
                ? 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14' 
                : 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10';

              return (
                <div
                  key={cfg.groupName}
                  className="absolute flex items-center justify-center transition-all duration-500 ease-out z-30 will-change-[top,transform]"
                  style={{
                    // Travels upward from bottom start chevron (~87%) to top basket hoop (~13%)
                    left: `${cfg.centerPercent}%`,
                    top: `calc(87% - ${progressRatio} * 74%)`,
                    transform: 'translate3d(-50%, -50%, 0)',
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* WINNER SLAM DUNK BADGE AT HOOP */}
                    {isWinner && (
                      <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-slate-950 font-black text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full border border-white shadow-md animate-bounce uppercase tracking-wider z-40">
                        BASKET! 🎯
                      </div>
                    )}

                    {/* CHARACTER IMAGE (FRAMELSS & ENLARGED) */}
                    <div
                      className={`relative ${mascotSize} flex items-center justify-center shrink-0 transition-transform ${
                        isWinner ? 'scale-125 animate-pulse' : ''
                      }`}
                    >
                      <img
                        src={cfg.img}
                        alt={cfg.character}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                        loading="eager"
                        decoding="async"
                      />

                      {/* SCORE BADGE */}
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full border border-white leading-none shadow-md z-10">
                        {currentScore}
                      </span>
                    </div>

                    {/* STATIC BASKETBALL (SABİT TOP) */}
                    <div className="text-[11px] sm:text-[13px] filter drop-shadow-md select-none -mt-1.5">
                      🏀
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* GROUP VICTORY VIDEO (kap.mp4 for Kaplan, ejd.mp4 for Ejderha, sog.mp4 for Balta) */}
          {showVictoryVideo && (
            <div 
              id="track-victory-video"
              className={`absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl overflow-hidden ${winnerGlowColor} border-2 ${winnerBorderColor} bg-black pointer-events-auto animate-in zoom-in-95 duration-300`}
            >
              <video
                ref={videoRef}
                key={victoryVideoSrc}
                src={victoryVideoSrc}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onEnded={onVictoryVideoEnd}
                onError={() => {
                  console.log('Video load/play error, advancing to results');
                  onVictoryVideoEnd?.();
                }}
              />

              {/* TOP CELEBRATION BADGE */}
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r ${winnerBadgeBg} text-white font-black text-[9px] sm:text-[11px] px-2.5 py-0.5 rounded-full border border-white/60 shadow-lg flex items-center gap-1 z-30 pointer-events-none`}>
                <img src={winnerImg} alt="Şampiyon" className="w-4 h-4 object-contain" />
                <span>{winnerTitle}</span>
              </div>

              {/* SKIP / VIEW RESULTS BUTTON */}
              {onVictoryVideoEnd && (
                <button
                  type="button"
                  onClick={onVictoryVideoEnd}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full border border-white shadow-xl transition cursor-pointer z-30 flex items-center gap-1"
                >
                  <span>Sonuçları Gör</span>
                  <span>⏩</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback Horizontal Track
  const trackSrc = activeCount === 2 ? '/park2.png' : '/park3.png';
  return (
    <div className={`w-full flex justify-center mb-1 shrink-0 select-none px-1 ${className}`}>
      <div 
        style={{ aspectRatio: '1792 / 592' }}
        className="relative w-full max-w-[360px] sm:max-w-[390px] rounded-lg overflow-hidden bg-transparent"
      >
        <img
          key={`track-img-${activeCount}`}
          src={trackSrc}
          alt={activeCount === 2 ? '2 Kişilik Basketbol Parkuru' : '3 Kişilik Basketbol Parkuru'}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 z-20 pointer-events-none">
          {laneConfigs.map((cfg) => {
            const player = players[cfg.playerIndex];
            const currentScore = Math.max(0, Math.min(targetScore, player?.score || 0));
            const progressRatio = currentScore / targetScore;
            const isWinner = currentScore >= targetScore;
            const mascotSize = activeCount === 2 ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-9 sm:h-9';

            return (
              <div
                key={cfg.groupName}
                className="absolute flex items-center transition-all duration-700 ease-out z-30"
                style={{
                  left: `calc(13% + ${progressRatio} * 74%)`,
                  top: `${cfg.centerPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative flex items-center">
                  <div className={`relative ${mascotSize} flex items-center justify-center shrink-0 ${isWinner ? 'scale-125 animate-pulse' : ''}`}>
                    <img src={cfg.img} alt={cfg.character} className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" loading="eager" decoding="async" />
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-blue-950 font-black text-[7px] sm:text-[8px] px-1 py-0.5 rounded-full border border-white leading-none shadow-xs">
                      {currentScore}
                    </span>
                  </div>
                  <div className="relative -ml-1 text-[10px] sm:text-[12px] filter drop-shadow-sm select-none">
                    🏀
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface SingleBasketballTrackProps {
  playerIndex: number; // 0: 1. Grup (Kaplumbağa), 1: 2. Grup (Ejderha), 2: 3. Grup (Savaşçı)
  score: number;
  targetScore?: number;
  isWinner?: boolean;
  className?: string;
}

const SINGLE_TRACK_CONFIGS = [
  {
    trackSrc: '/p1.png',
    groupName: '1. GRUP',
    character: 'KAPLUMBAĞA',
    img: '/kap1.png',
    badgeBg: 'from-blue-500 to-indigo-600',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-[0_0_12px_rgba(6,182,212,0.6)]',
  },
  {
    trackSrc: '/p2.png',
    groupName: '2. GRUP',
    character: 'EJDERHA',
    img: '/ejd1.png',
    badgeBg: 'from-rose-500 to-pink-600',
    borderColor: 'border-pink-300',
    glowColor: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
  },
  {
    trackSrc: '/p3.png',
    groupName: '3. GRUP',
    character: 'SAVAŞÇI',
    img: '/balta1.png',
    badgeBg: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300',
    glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]',
  },
];

export const SingleBasketballTrack: React.FC<SingleBasketballTrackProps> = ({
  playerIndex,
  score,
  targetScore = 10,
  isWinner = false,
  className = '',
}) => {
  const cfg = SINGLE_TRACK_CONFIGS[playerIndex] || SINGLE_TRACK_CONFIGS[0];
  const currentScore = Math.max(0, Math.min(targetScore, score));
  const progressRatio = currentScore / targetScore;
  const reachedGoal = currentScore >= targetScore || isWinner;

  return (
    <div className={`h-full flex flex-col items-center justify-center shrink-0 select-none ${className}`}>
      {/* 271 / 1335 aspect ratio for single lane track */}
      <div 
        style={{ aspectRatio: '271 / 1335' }}
        className="relative h-full max-h-full w-auto"
      >
        {/* Track Image */}
        <img
          src={cfg.trackSrc}
          alt={`${cfg.groupName} Parkuru`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none filter drop-shadow-xl"
          loading="eager"
          decoding="async"
        />

        {/* Mascot moving upwards towards basket */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div
            className="absolute flex flex-col items-center transition-all duration-500 ease-out z-30 will-change-[top,transform]"
            style={{
              left: '50%',
              top: `calc(87% - ${progressRatio} * 73%)`,
              transform: 'translate3d(-50%, -50%, 0)',
            }}
          >
            {/* Basket! indicator when target reached */}
            {reachedGoal && (
              <div className="animate-bounce -mb-1 px-1.5 py-0.5 rounded-full bg-yellow-400 border border-white text-slate-950 font-black text-[8px] sm:text-[9px] shadow-lg whitespace-nowrap">
                BASKET! 🎯
              </div>
            )}

            {/* Mascot Character with score pill */}
            <div className="relative flex flex-col items-center">
              <div className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 ${reachedGoal ? 'scale-125 animate-pulse' : ''}`}>
                <img
                  src={cfg.img}
                  alt={cfg.character}
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                  loading="eager"
                  decoding="async"
                />
                {/* Score badge */}
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[8px] sm:text-[9px] px-1 py-0.5 rounded-full border border-white leading-none shadow-md z-10">
                  {currentScore}
                </span>
              </div>

              {/* Basketball emoji under mascot feet */}
              <div className="text-[10px] sm:text-[12px] filter drop-shadow-sm select-none leading-none -mt-0.5">
                🏀
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

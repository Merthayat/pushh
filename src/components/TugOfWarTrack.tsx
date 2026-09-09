import React, { useEffect, useState, useRef } from 'react';
import { RaceTrackPlayer } from './BasketballRaceTrack';
import { TransparentVideo } from './TransparentVideo';

interface TugOfWarTrackProps {
  players: RaceTrackPlayer[];
  targetScore?: number;
  duelWinnerIndex?: number | null;
  soundEnabled?: boolean;
  className?: string;
  onVideoComplete?: () => void;
}

export const TugOfWarTrack: React.FC<TugOfWarTrackProps> = ({
  players,
  targetScore = 10,
  duelWinnerIndex = null,
  soundEnabled = true,
  className = '',
  onVideoComplete
}) => {
  const p1Score = players[0]?.score || 0;
  const p2Score = players[1]?.score || 0;

  // Track previous scores to trigger pull animation
  const [lastPullTeam, setLastPullTeam] = useState<'p1' | 'p2' | null>(null);
  const [pullAnimKey, setPullAnimKey] = useState(0);
  const [isWinnerVideoDismissed, setIsWinnerVideoDismissed] = useState(false);
  const winnerVideoRef = useRef<HTMLVideoElement | null>(null);

  const prevScoresRef = React.useRef({ p1: p1Score, p2: p2Score });

  useEffect(() => {
    if (p1Score > prevScoresRef.current.p1) {
      setLastPullTeam('p1');
      setPullAnimKey(k => k + 1);
    } else if (p2Score > prevScoresRef.current.p2) {
      setLastPullTeam('p2');
      setPullAnimKey(k => k + 1);
    }
    prevScoresRef.current = { p1: p1Score, p2: p2Score };
  }, [p1Score, p2Score]);

  // Calculate rope offset percentage:
  // Center is 50%. Max pull left is 15%, Max pull right is 85%.
  // Difference range: -targetScore to +targetScore (-10 to +10)
  const scoreDiff = p1Score - p2Score;
  const maxDiff = Math.max(targetScore, 8);
  // clamped diff between -maxDiff and +maxDiff
  const clampedDiff = Math.max(-maxDiff, Math.min(maxDiff, scoreDiff));
  // P1 is on the left: if scoreDiff > 0 (P1 leads), ribbon moves left (towards 15%)
  // If scoreDiff < 0 (P2 leads), ribbon moves right (towards 85%)
  const ribbonCenterPercent = 50 - (clampedDiff / maxDiff) * 35;

  const isP1Leading = p1Score > p2Score;
  const isP2Leading = p2Score > p1Score;
  const isTied = p1Score === p2Score;

  const isP1Won = p1Score >= targetScore || duelWinnerIndex === 0;
  const isP2Won = p2Score >= targetScore || duelWinnerIndex === 1;
  const isGameOver = isP1Won || isP2Won || duelWinnerIndex !== null;

  // KULLANICI TALEBİ: Halat çekme oyunlarında sadece KAZANAN tarafın videosunu göster (ortadaki alanda)
  // 1. Grup (Kaplumbağa) kazandıysa -> /kap.mp4
  // 2. Grup (Ejderha) kazandıysa -> /ejd.mp4
  const winnerVideoSrc = isP1Won ? '/kap.mp4' : isP2Won ? '/ejd.mp4' : null;
  const winnerTitle = isP1Won ? '1. GRUP (KAPLUMBAĞA) KAZANDI! 🏆' : isP2Won ? '2. GRUP (EJDERHA) KAZANDI! 🏆' : '';
  const winnerBadgeBg = isP1Won ? 'from-blue-600 via-cyan-500 to-indigo-600' : 'from-rose-600 via-pink-500 to-red-600';
  const winnerImg = isP1Won ? '/kap1.png' : '/ejd1.png';

  // Reset dismissal if game resets or winner changes
  useEffect(() => {
    setIsWinnerVideoDismissed(false);
  }, [isGameOver, duelWinnerIndex, p1Score, p2Score]);

  // Handle winner video autoplay and sound
  useEffect(() => {
    if (winnerVideoRef.current && winnerVideoSrc && !isWinnerVideoDismissed) {
      winnerVideoRef.current.currentTime = 0;
      winnerVideoRef.current.muted = !soundEnabled;
      const playPromise = winnerVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If unmuted autoplay blocked by browser policy, fallback to muted
          if (winnerVideoRef.current) {
            winnerVideoRef.current.muted = true;
            winnerVideoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [winnerVideoSrc, soundEnabled, isWinnerVideoDismissed]);

  return (
    <div
      id="tug-of-war-arena"
      className={`relative flex flex-col items-center justify-between h-full w-[280px] xs:w-[320px] sm:w-[400px] md:w-[480px] lg:w-[580px] xl:w-[700px] 2xl:w-[820px] rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#121c2e] via-[#1b2b48] to-[#121c2e] border-2 border-amber-400/90 shadow-[0_0_30px_rgba(245,158,11,0.35)] border-l-4 border-l-amber-400 p-2 sm:p-2.5 overflow-hidden select-none ${className}`}
    >
      {/* BACKGROUND FIELD DECORATION */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* FULL-FRAME WINNER VIDEO: HALAT ÇEKMEDE ORTADAKİ ALANDA SADECE KAZANAN TARAFIN VİDEOSU GÖSTERİLİR */}
      {winnerVideoSrc && !isWinnerVideoDismissed && (
        <div className="absolute inset-0 z-50 rounded-2xl sm:rounded-3xl overflow-hidden bg-black flex items-center justify-center pointer-events-auto animate-in fade-in duration-300">
          <video
            ref={winnerVideoRef}
            src={winnerVideoSrc}
            autoPlay
            playsInline
            muted={!soundEnabled}
            className="w-full h-full object-cover"
            onEnded={() => {
              if (onVideoComplete) {
                onVideoComplete();
              }
            }}
          />

          {/* Winner banner on top of video */}
          <div className={`absolute top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r ${winnerBadgeBg} text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-full border border-white shadow-xl flex items-center gap-1.5 z-20 pointer-events-none drop-shadow-md animate-pulse`}>
            <img src={winnerImg} alt="Şampiyon" className="w-4 h-4 object-contain" />
            <span>{winnerTitle}</span>
          </div>

          {/* Bottom Action: Sonuçları Gör button */}
          <button
            type="button"
            onClick={() => {
              setIsWinnerVideoDismissed(true);
              if (onVideoComplete) {
                onVideoComplete();
              }
            }}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full border border-white shadow-2xl transition cursor-pointer z-20 flex items-center gap-1"
          >
            <span>Sonuçları Gör</span>
            <span>⏩</span>
          </button>

          {/* Subtle translucent close icon */}
          <button
            type="button"
            onClick={() => setIsWinnerVideoDismissed(true)}
            className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs font-bold border border-white/30 shadow-lg backdrop-blur-xs transition-colors cursor-pointer"
            title="Kapat"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* TOP: HALAT ÇEKME TITLE CAPSULE */}
      <div className="relative z-10 w-full flex flex-col items-center gap-0.5 shrink-0">
        <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl border border-white/90 shadow-[0_2px_8px_rgba(245,158,11,0.5)] uppercase tracking-wider">
          <span className="text-base sm:text-lg">🪢</span>
          <span>HALAT ÇEKME DÜELLOSU</span>
        </div>
        <div className="text-[9.5px] sm:text-[11px] font-black text-amber-300/90 tracking-wide uppercase">
          🎯 HEDEF: {targetScore} PUAN
        </div>
      </div>

      {/* SCORE HEADER (P1 vs P2) WITH CHARACTER MINI ICONS */}
      <div className="relative z-10 w-full grid grid-cols-2 gap-1.5 sm:gap-2 my-1 shrink-0">
        {/* P1 SCORE BADGE (KAPLUMBAĞA) */}
        <div className={`flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all ${isP1Leading ? 'border-cyan-400 bg-blue-900/80 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-102' : 'border-blue-600/40 bg-blue-950/50'}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <img src="/kap.png" alt="Kaplumbağa" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black text-cyan-300 uppercase leading-none truncate">1. GRUP</span>
              <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-blue-200 uppercase leading-none mt-0.5">KAPLUMBAĞA</span>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ml-1">
            {p1Score}
          </span>
        </div>

        {/* P2 SCORE BADGE (EJDERHA) */}
        <div className={`flex items-center justify-between px-2 py-1 rounded-xl border-2 transition-all ${isP2Leading ? 'border-rose-400 bg-rose-900/80 shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-102' : 'border-pink-600/40 bg-pink-950/50'}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <img src="/ejd.png" alt="Ejderha" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 filter drop-shadow-sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black text-pink-300 uppercase leading-none truncate">2. GRUP</span>
              <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-rose-200 uppercase leading-none mt-0.5">EJDERHA</span>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ml-1">
            {p2Score}
          </span>
        </div>
      </div>

      {/* MIDDLE: THE DYNAMIC TUG OF WAR ARENA (BASKETBOL SAHASI ZEMİNİ VE ÇİZGİLERİ) */}
      <div
        className="relative z-10 flex-1 w-full flex flex-col items-center justify-center min-h-[230px] sm:min-h-[270px] md:min-h-[300px] my-1 rounded-2xl border-2 border-white/80 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.85),inset_0_0_20px_rgba(0,0,0,0.7)]"
        style={{
          backgroundColor: '#351806',
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 12px, transparent 12px, transparent 24px),
            repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 24px, transparent 24px, transparent 48px),
            linear-gradient(180deg, #261105 0%, #3e1b08 50%, #261105 100%)
          `
        }}
      >
        {/* BASKETBALL COURT FLOOR SHEEN / LIGHTING */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* COURT BOUNDARY INSET LINE */}
        <div className="absolute inset-1.5 border border-white/50 rounded-xl pointer-events-none" />

        {/* CENTER HALF-COURT LINE (ORTA SAHA ÇİZGİSİ) */}
        <div className="absolute top-1.5 bottom-1.5 left-1/2 -translate-x-1/2 w-1 bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)] pointer-events-none" />
        
        {/* CENTER JUMP-BALL CIRCLE (SANTRAL ÇEMBERİ) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-white/80 flex items-center justify-center pointer-events-none">
          {/* INNER JUMP-BALL CIRCLE */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/60 bg-white/10 flex items-center justify-center shadow-inner" />
        </div>

        {/* LEFT BASKETBALL RESTRICTION AREA / KEY & 3-PT (KAPLUMBAĞA SAHASI) */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-28 sm:h-36 border-r-2 border-y-2 border-white/70 bg-blue-600/20 rounded-r-lg pointer-events-none flex items-center justify-end">
          {/* FREE THROW CIRCLE ARC */}
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/60 -mr-6" />
        </div>
        {/* LEFT 3-POINT ARC */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-24 sm:w-32 h-44 sm:h-52 border-r-2 border-white/40 rounded-r-full pointer-events-none" />
        {/* LEFT BACKBOARD & HOOP */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
          <div className="w-1 h-10 sm:h-12 bg-white rounded-sm shadow-md" />
          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-amber-500 bg-amber-500/20 -ml-0.5" />
        </div>

        {/* RIGHT BASKETBALL RESTRICTION AREA / KEY & 3-PT (EJDERHA SAHASI) */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-12 sm:w-16 h-28 sm:h-36 border-l-2 border-y-2 border-white/70 bg-rose-600/20 rounded-l-lg pointer-events-none flex items-center justify-start">
          {/* FREE THROW CIRCLE ARC */}
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/60 -ml-6" />
        </div>
        {/* RIGHT 3-POINT ARC */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-24 sm:w-32 h-44 sm:h-52 border-l-2 border-white/40 rounded-l-full pointer-events-none" />
        {/* RIGHT BACKBOARD & HOOP */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center pointer-events-none z-10">
          <div className="w-1 h-10 sm:h-12 bg-white rounded-sm shadow-md" />
          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-amber-500 bg-amber-500/20 -mr-0.5" />
        </div>

        {/* PULL STADIUM MASCOTS & ROPE STAGE: Covers the entire court with absolute coordinates */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          
          {/* THE ROPE (VİDEODAKİ HALAT İLE BİREBİR AYNI RENK, DOKU VE HİZADA - SAHANIN VE KARAKTERLERİN ÜSTÜNDE) */}
          <div
            className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[6px] sm:h-[8px] md:h-[10px] rounded-full transition-all duration-500 ease-out z-30 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(-45deg, #4a341e 0px, #4a341e 2px, #8c6742 2px, #b8936b 3.5px, #cfab83 4.5px, #8c6742 6px, #4a341e 7.5px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 1px rgba(0,0,0,0.5)',
              borderTop: '1px solid rgba(184, 147, 107, 0.55)',
              borderBottom: '1px solid rgba(58, 40, 23, 0.85)'
            }}
          >
            {/* ROPE TEXTURE SHINE */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/35 rounded-full pointer-events-none" />
          </div>

          {/* CENTER BASKETBALL MARKER: Hem yatayda hem dikeyde tam ortalanmış (-translate-x-1/2 & -translate-y-1/2) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-40 flex items-center justify-center pointer-events-none"
            style={{ left: `${ribbonCenterPercent}%` }}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              <span className="text-2xl sm:text-3xl md:text-4xl select-none leading-none">
                🏀
              </span>
            </div>
          </div>

          {/* LEFT MASCOT: KAPLUMBAĞA (hakap.mp4 VİDEO - ELİ TAM HALATIN ÜZERİNDE) */}
          <div
            className="absolute left-1.5 sm:left-3 md:left-4 top-1/2 z-20 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-auto"
            style={{
              transform: `translateY(-48.5%) ${
                lastPullTeam === 'p1'
                  ? 'translateX(-6px) scale(1.05)'
                  : isP1Won
                  ? 'translateY(-8px) scale(1.1)'
                  : 'scale(1)'
              }`
            }}
          >
            {/* WINNER CROWN FOR KAPLUMBAĞA */}
            {isP1Won && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl sm:text-2xl filter drop-shadow-lg animate-bounce z-30 pointer-events-none">
                👑
              </div>
            )}
            {/* LOSER DIZZY STARS */}
            {isP2Won && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm sm:text-base filter drop-shadow-md animate-spin z-30 pointer-events-none">
                💫
              </div>
            )}

            {/* Video container with 9:16 aspect ratio */}
            <div className="relative w-[70px] h-[124px] sm:w-[86px] sm:h-[153px] md:w-[102px] md:h-[181px] lg:w-[118px] lg:h-[210px] flex items-center justify-center">
              <TransparentVideo
                src="/hakap.mp4"
                fallbackImg="/kap1.png"
                alt="1. Grup Kaplumbağa"
                isPaused={isGameOver}
                className="w-full h-full object-contain"
              />

              {/* Strain / pull dust clouds on Kaplumbağa */}
              {lastPullTeam === 'p1' && (
                <div className="absolute -left-2 sm:-left-3 bottom-2 text-sm sm:text-base animate-ping pointer-events-none">
                  💨
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MASCOT: EJDERHA (haej.mp4 VİDEO - ELİ TAM HALATIN ÜZERİNDE) */}
          <div
            className="absolute right-1.5 sm:right-3 md:right-4 top-1/2 z-20 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-auto"
            style={{
              transform: `translateY(-48.5%) ${
                lastPullTeam === 'p2'
                  ? 'translateX(6px) scale(1.05)'
                  : isP2Won
                  ? 'translateY(-8px) scale(1.1)'
                  : 'scale(1)'
              }`
            }}
          >
            {/* WINNER CROWN FOR EJDERHA */}
            {isP2Won && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl sm:text-2xl filter drop-shadow-lg animate-bounce z-30 pointer-events-none">
                👑
              </div>
            )}
            {/* LOSER DIZZY STARS */}
            {isP1Won && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm sm:text-base filter drop-shadow-md animate-spin z-30 pointer-events-none">
                💫
              </div>
            )}

            {/* Video container with 9:16 aspect ratio */}
            <div className="relative w-[70px] h-[124px] sm:w-[86px] sm:h-[153px] md:w-[102px] md:h-[181px] lg:w-[118px] lg:h-[210px] flex items-center justify-center">
              <TransparentVideo
                src="/haej.mp4"
                fallbackImg="/ejd1.png"
                alt="2. Grup Ejderha"
                isPaused={isGameOver}
                className="w-full h-full object-contain"
              />

              {/* Strain / pull dust clouds on Ejderha */}
              {lastPullTeam === 'p2' && (
                <div className="absolute -right-2 sm:-right-3 bottom-2 text-sm sm:text-base animate-ping pointer-events-none">
                  💨
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DYNAMIC STATUS BANNER: Pinned to bottom of the court */}
        <div className="absolute bottom-2 left-2 right-2 text-center z-20 pointer-events-none">
          {isP1Won ? (
            <div className="px-2 py-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-black text-[11px] sm:text-xs rounded-xl border border-white shadow-lg flex items-center justify-center gap-1.5 animate-bounce">
              <span>🏆 1. GRUP HALATI KAZANDI!</span>
              {isWinnerVideoDismissed && (
                <button
                  type="button"
                  onClick={() => setIsWinnerVideoDismissed(false)}
                  className="px-1.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[9px] rounded font-bold border border-white/60 pointer-events-auto cursor-pointer shadow ml-1"
                >
                  🎬 Şampiyon Videosu
                </button>
              )}
            </div>
          ) : isP2Won ? (
            <div className="px-2 py-1 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white font-black text-[11px] sm:text-xs rounded-xl border border-white shadow-lg flex items-center justify-center gap-1.5 animate-bounce">
              <span>🏆 2. GRUP HALATI KAZANDI!</span>
              {isWinnerVideoDismissed && (
                <button
                  type="button"
                  onClick={() => setIsWinnerVideoDismissed(false)}
                  className="px-1.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[9px] rounded font-bold border border-white/60 pointer-events-auto cursor-pointer shadow ml-1"
                >
                  🎬 Şampiyon Videosu
                </button>
              )}
            </div>
          ) : isP1Leading ? (
            <div className="px-2 py-1 bg-blue-900/80 text-cyan-200 font-black text-[10px] sm:text-[11px] rounded-lg border border-cyan-400/50 shadow-sm flex items-center justify-center gap-1">
              <span>⬅️ 1. Grup</span>
              <span className="text-amber-300">{p1Score - p2Score} farkla</span>
              <span>çekiyor!</span>
            </div>
          ) : isP2Leading ? (
            <div className="px-2 py-1 bg-pink-900/80 text-pink-200 font-black text-[10px] sm:text-[11px] rounded-lg border border-pink-400/50 shadow-sm flex items-center justify-center gap-1">
              <span>2. Grup</span>
              <span className="text-amber-300">{p2Score - p1Score} farkla</span>
              <span>çekiyor! ➡️</span>
            </div>
          ) : (
            <div className="px-2 py-1 bg-slate-800/80 text-amber-300 font-black text-[10px] sm:text-[11px] rounded-lg border border-amber-400/40 shadow-sm">
              ⚖️ Eşit Çekişme! Hızlı Cevapla!
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM: TUG TENSION METER */}
      <div className="relative z-10 w-full flex flex-col gap-1 shrink-0 mt-1">
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black text-slate-300 px-1">
          <span className="text-cyan-300">1. GRUP</span>
          <span className="text-amber-400 font-bold">HALAT GERİLİMİ</span>
          <span className="text-pink-300">2. GRUP</span>
        </div>
        
        {/* TENSION BAR */}
        <div className="relative w-full h-3 sm:h-3.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden flex shadow-inner">
          {/* LEFT HALF (P1) */}
          <div className="relative w-1/2 h-full bg-slate-900 flex justify-end">
            <div
              className="h-full bg-gradient-to-l from-cyan-400 to-blue-600 transition-all duration-500 rounded-l-full"
              style={{ width: `${Math.min(100, (p1Score / targetScore) * 100)}%` }}
            />
          </div>
          {/* CENTER SPLIT */}
          <div className="w-0.5 h-full bg-white z-10 shrink-0" />
          {/* RIGHT HALF (P2) */}
          <div className="relative w-1/2 h-full bg-slate-900 flex justify-start">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-600 transition-all duration-500 rounded-r-full"
              style={{ width: `${Math.min(100, (p2Score / targetScore) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-bold text-slate-400 px-1">
          <span>{p1Score}/{targetScore}</span>
          <span className="text-amber-400/80 text-[8px]">KAZANMAK İÇİN {targetScore}</span>
          <span>{p2Score}/{targetScore}</span>
        </div>
      </div>
    </div>
  );
};

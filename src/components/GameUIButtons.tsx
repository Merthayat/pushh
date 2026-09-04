import React from 'react';
import { Home, RotateCcw, Check, Play, X, Star } from 'lucide-react';

/* 
  Custom Glossy 3D Game UI Buttons & Success Card
  Matching the candy/jelly glossy game UI art style from the reference image.
*/

// Chunky Glossy Screen Rotate / Orientation Icon (Phone/Screen Flip)
export const GlossyScreenRotateIcon: React.FC<{ isLandscape?: boolean; size?: number; className?: string }> = ({
  isLandscape = false,
  size = 20,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] shrink-0 transition-transform duration-300 ${isLandscape ? 'rotate-90' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="phoneScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Outer Phone Frame */}
      <rect
        x="12"
        y="6"
        width="16"
        height="28"
        rx="4"
        fill="#1e293b"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Inner Screen */}
      <rect
        x="14"
        y="9"
        width="12"
        height="22"
        rx="2"
        fill="url(#phoneScreenGrad)"
      />

      {/* Rotation Arrow Overlay */}
      <path
        d="M 6 20 C 6 12 12 6 20 6 M 34 20 C 34 28 28 34 20 34"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="20,2 25,6 20,10" fill="#38bdf8" />
      <polygon points="20,30 15,34 20,38" fill="#38bdf8" />
    </svg>
  );
};

// Chunky Glossy 3D Arrow Icon matching user reference image
export const GlossyArrowIcon: React.FC<{ direction?: 'left' | 'right'; size?: number; className?: string }> = ({
  direction = 'left',
  size = 28,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${direction === 'left' ? 'scale-x-[-1]' : ''} drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] shrink-0 ${className}`}
    >
      <defs>
        {/* Glossy White/Light Silver Arrow Gradient */}
        <linearGradient id="arrowGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Chunky 3D Arrow Path */}
      <path
        d="M 7 15.5 C 7 13.2 8.8 11.5 11 11.5 L 21 11.5 L 21 6.5 C 21 4.2 23.7 3.0 25.4 4.7 L 36.5 15.8 C 37.5 16.8 37.5 18.4 36.5 19.4 L 25.4 30.5 C 23.7 32.2 21 31.0 21 28.7 L 21 23.7 L 11 23.7 C 8.8 23.7 7 22.0 7 19.7 Z"
        fill="url(#arrowGlossGrad)"
        stroke="#c2410c"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Top Gloss Curve on Arrow Body */}
      <path
        d="M 10 13.5 L 21 13.5 L 21 9 L 32 20"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

// Glossy Round Button Base
interface GlossyRoundButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  color?: 'green' | 'orange' | 'yellow' | 'blue' | 'red';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

export const GlossyRoundButton: React.FC<GlossyRoundButtonProps> = ({
  onClick,
  icon,
  color = 'orange',
  size = 'md',
  className = '',
  title
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8 sm:w-8.5 sm:h-8.5 border-[1.5px] text-xs',
    sm: 'w-9 h-9 sm:w-10 sm:h-10 border-2 text-sm',
    md: 'w-14 h-14 border-[3px] text-xl',
    lg: 'w-18 h-18 sm:w-20 sm:h-20 border-4 text-2xl sm:text-3xl'
  }[size];

  const shadowClasses = {
    xs: 'shadow-[0_2.5px_0_#c2410c,0_3px_6px_rgba(0,0,0,0.3)]',
    sm: 'shadow-[0_3.5px_0_#c2410c,0_4px_8px_rgba(0,0,0,0.3)]',
    md: 'shadow-[0_6px_0_#c2410c,0_10px_15px_rgba(0,0,0,0.4)]',
    lg: 'shadow-[0_6px_0_#c2410c,0_10px_15px_rgba(0,0,0,0.4)]'
  }[size];

  const colorGradients = {
    green: `from-lime-400 via-emerald-500 to-green-700 border-cyan-200 text-white ${shadowClasses}`,
    orange: `from-yellow-300 via-amber-400 to-orange-600 border-cyan-200 text-white ${shadowClasses}`,
    yellow: `from-amber-200 via-yellow-400 to-amber-600 border-yellow-100 text-amber-950 ${shadowClasses}`,
    blue: `from-sky-300 via-cyan-500 to-blue-600 border-cyan-100 text-white ${shadowClasses}`,
    red: `from-rose-300 via-red-500 to-rose-700 border-rose-100 text-white ${shadowClasses}`,
  }[color];

  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative group rounded-full bg-gradient-to-b ${colorGradients} ${sizeClasses} flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 shrink-0 ${className}`}
    >
      {/* Top Gloss Highlight */}
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-[82%] h-[42%] bg-gradient-to-b from-white/80 via-white/20 to-transparent rounded-t-full pointer-events-none" />
      
      {/* Outer Cyan Rim Glow */}
      <div className="absolute -inset-1 rounded-full border-2 border-cyan-300/80 pointer-events-none opacity-90 group-hover:opacity-100 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      
      {/* Inner Icon */}
      <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center font-black">
        {icon}
      </div>
    </button>
  );
};

// Glossy Pill Button
interface GlossyPillButtonProps {
  onClick?: () => void;
  text: string;
  icon?: React.ReactNode;
  color?: 'green' | 'orange' | 'blue' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GlossyPillButton: React.FC<GlossyPillButtonProps> = ({
  onClick,
  text,
  icon,
  color = 'orange',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs sm:text-sm border-2 rounded-full min-w-[100px]',
    md: 'px-6 py-2.5 sm:py-3 text-sm sm:text-base border-3 rounded-full min-w-[140px]',
    lg: 'px-8 py-3.5 sm:py-4 text-base sm:text-xl border-4 rounded-full min-w-[180px]'
  }[size];

  const colorGradients = {
    green: 'from-lime-400 via-emerald-500 to-green-700 border-cyan-200 text-white shadow-[0_6px_0_#15803d,0_10px_20px_rgba(0,0,0,0.4)]',
    orange: 'from-yellow-300 via-orange-500 to-amber-600 border-amber-100 text-white shadow-[0_6px_0_#c2410c,0_10px_20px_rgba(0,0,0,0.4)]',
    blue: 'from-sky-300 via-cyan-500 to-blue-600 border-cyan-100 text-white shadow-[0_6px_0_#1d4ed8,0_10px_20px_rgba(0,0,0,0.4)]',
    yellow: 'from-amber-200 via-yellow-400 to-amber-600 border-yellow-100 text-amber-950 shadow-[0_6px_0_#b45309,0_10px_20px_rgba(0,0,0,0.4)]',
    red: 'from-rose-300 via-red-500 to-rose-700 border-rose-100 text-white shadow-[0_6px_0_#be123c,0_10px_20px_rgba(0,0,0,0.4)]',
  }[color];

  return (
    <button
      onClick={onClick}
      className={`relative group bg-gradient-to-b ${colorGradients} ${sizeClasses} font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 active:translate-y-1 shrink-0 ${className}`}
    >
      {/* Top Gloss Reflection */}
      <div className="absolute top-0.5 left-2 right-2 h-[45%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
      
      {/* Outer Glow */}
      <div className="absolute -inset-1 rounded-full border-2 border-cyan-300/50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        {icon}
        <span>{text}</span>
      </div>
    </button>
  );
};

// MODERN 3D STAR COMPONENT (Multi-layered gold gradients, facets & glow)
export const Modern3DStar: React.FC<{ sizePx?: number; isActive?: boolean; isCenter?: boolean }> = ({
  sizePx = 54,
  isActive = true,
  isCenter = false,
}) => {
  const starId = React.useId();
  const width = isCenter ? sizePx * 1.25 : sizePx;
  const height = width;

  if (!isActive) {
    return (
      <div className="relative flex items-center justify-center opacity-30">
        <svg width={width} height={height} viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 64,36 98,39 72,61 80,95 50,77 20,95 28,61 2,39 36,36" fill="#334155" stroke="#1E293B" strokeWidth="4" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${
        isCenter ? '-translate-y-2 sm:-translate-y-3 scale-110 z-20' : 'z-10'
      }`}
    >
      {/* Glowing Ambient Aura */}
      <div
        className="absolute inset-0 rounded-full bg-amber-400/50 blur-xl animate-pulse"
        style={{ transform: 'scale(1.3)' }}
      />

      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        className="relative z-10 filter drop-shadow-[0_10px_18px_rgba(180,83,9,0.85)]"
      >
        <defs>
          <linearGradient id={`goldGradMain_${starId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id={`goldGradFacetLight_${starId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#FCD34D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id={`goldGradFacetDark_${starId}`} x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#451A03" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#B45309" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id={`goldStroke_${starId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* 3D Depth Shadow */}
        <polygon
          points="50,9 63,37 94,40 70,61 77,92 50,75 23,92 30,61 6,40 37,37"
          fill="#3B1202"
          transform="translate(0, 5)"
        />

        {/* Main Star Body */}
        <polygon
          points="50,5 64,36 98,39 72,61 80,95 50,77 20,95 28,61 2,39 36,36"
          fill={`url(#goldGradMain_${starId})`}
          stroke={`url(#goldStroke_${starId})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 3D Facet Bevel Highlights */}
        <polygon points="50,5 50,77 64,36" fill={`url(#goldGradFacetLight_${starId})`} />
        <polygon points="98,39 50,77 72,61" fill={`url(#goldGradFacetDark_${starId})`} />
        <polygon points="80,95 50,77 50,95" fill={`url(#goldGradFacetDark_${starId})`} />
        <polygon points="20,95 50,77 28,61" fill={`url(#goldGradFacetLight_${starId})`} />
        <polygon points="2,39 50,77 36,36" fill={`url(#goldGradFacetLight_${starId})`} />

        {/* Specular Sparkle Dot */}
        <circle cx="50" cy="48" r="3.5" fill="#FFFFFF" opacity="0.9" filter="blur(0.5px)" />
      </svg>
    </div>
  );
};

// GLOSSY COMPLETE / SUCCESS HEADER (Frameless 3D modern header without light green box)
interface GlossyCompleteCardProps {
  title?: string;
  subtitle?: string;
  starsCount?: number;
  onHomeClick?: () => void;
  onNextClick?: () => void;
  className?: string;
}

export const GlossyCompleteCard: React.FC<GlossyCompleteCardProps> = ({
  title = "TEBRİKLER!",
  subtitle = "Görevi Başarıyla Tamamladın!",
  starsCount = 3,
  onHomeClick,
  onNextClick,
  className = ''
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-1 sm:p-2 my-1 w-full max-w-md mx-auto ${className}`}>
      
      {/* 3 MODERN 3D STARS (No background green card) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5 z-20">
        {[1, 2, 3].map((starIndex) => {
          const isActive = starIndex <= starsCount;
          return (
            <Modern3DStar
              key={starIndex}
              sizePx={48}
              isActive={isActive}
              isCenter={starIndex === 2}
            />
          );
        })}
      </div>

      {/* MODERN GLOSSY TITLE BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-yellow-200 rounded-full px-6 sm:px-8 py-2 shadow-[0_8px_20px_rgba(245,158,11,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] z-10">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wider uppercase drop-shadow-xs">
          {title}
        </h3>
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-md z-10 mt-1.5 max-w-xs text-center">
          {subtitle}
        </p>
      )}

      {/* Optional attached action buttons if passed */}
      {(onHomeClick || onNextClick) && (
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-3 z-30">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              title="Ana Sayfaya Dön"
              className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
            >
              <img 
                src="/ana.png" 
                alt="Ana Sayfa" 
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain pointer-events-none" 
              />
            </button>
          )}

          {onNextClick && (
            <button
              onClick={onNextClick}
              title="Sonraki / İleri"
              className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
            >
              <img 
                src="/ileri.png" 
                alt="Sonraki / İleri" 
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain pointer-events-none" 
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface GoldCoinDisplayCardProps {
  sessionCoins: number;
  totalCoins: number;
  compact?: boolean;
}

export const GoldCoinDisplayCard: React.FC<GoldCoinDisplayCardProps> = ({ sessionCoins, totalCoins, compact = true }) => {
  const [displayCoins, setDisplayCoins] = React.useState(() => Math.max(0, totalCoins - sessionCoins));

  React.useEffect(() => {
    const startCoins = Math.max(0, totalCoins - sessionCoins);
    const endCoins = totalCoins;
    if (startCoins === endCoins) return;

    let current = startCoins;
    const step = Math.max(1, Math.ceil((endCoins - startCoins) / 15));
    const timer = setInterval(() => {
      current += step;
      if (current >= endCoins) {
        current = endCoins;
        clearInterval(timer);
      }
      setDisplayCoins(current);
    }, 60);

    return () => clearInterval(timer);
  }, [sessionCoins, totalCoins]);

  return (
    <div className={`flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 z-30 w-full max-w-sm sm:max-w-md mx-auto relative ${compact ? 'my-1' : 'my-2'}`}>
      {/* Session Earned Coin Pill */}
      {sessionCoins > 0 && (
        <div
          style={{ backgroundImage: `url('/butt.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
          className="relative text-white font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 shrink-0 min-w-[130px] sm:min-w-[160px] min-h-[40px] sm:min-h-[46px]"
        >
          {/* 3D Coin Icon */}
          <div className="text-lg sm:text-2xl filter drop-shadow-md shrink-0">
            🪙
          </div>

          <div className="flex flex-col items-start text-left min-w-0">
            <span className="text-[9px] sm:text-[11px] font-black text-amber-200 uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap leading-tight">
              ALTIN KAZANDIN
            </span>
            <span className="text-xs sm:text-base font-black text-white tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] font-mono leading-none whitespace-nowrap">
              +{sessionCoins} <span className="text-[9px] sm:text-xs text-amber-200 font-extrabold">ALTIN</span>
            </span>
          </div>
        </div>
      )}

      {/* Cumulative Total Coins Box */}
      <div
        style={{ backgroundImage: `url('/butt.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        className="relative text-white font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 shrink-0 min-w-[130px] sm:min-w-[160px] min-h-[40px] sm:min-h-[46px]"
      >
        {/* 3D Coin Icon */}
        <div className="text-lg sm:text-2xl filter drop-shadow-md animate-pulse shrink-0">
          🪙
        </div>

        <div className="flex flex-col items-start text-left min-w-0">
          <span className="text-[9px] sm:text-[11px] font-black text-amber-200 uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap leading-tight">
            TOPLAM ALTININ
          </span>
          <span className="text-xs sm:text-base font-black text-white tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] font-mono leading-none whitespace-nowrap">
            {displayCoins} <span className="text-[9px] sm:text-xs text-amber-200 font-extrabold">ALTIN</span>
          </span>
        </div>
      </div>
    </div>
  );
};


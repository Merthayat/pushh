import React, { useState } from 'react';
import { 
  Play, Lock, Star, Sparkles, Trophy, CheckCircle2, ChevronRight, X, 
  RotateCcw, Compass, MapPin, Award, Layers, Box, Info
} from 'lucide-react';
import { StatRecord } from '../types';

export interface AdventureLevelItem {
  id: string;
  topicKey: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  isSpecialLab?: boolean;
  coords: {
    // Relative positioning percentage on the map (x: 0-100%, y: 0-100%)
    // 1 is at bottom, 6 is at top
    x: number;
    y: number;
  };
}

// 1. Konu: Nesnelerin Geometrisi Seviye Haritası Verisi
export const GEOMETRI_LEVELS: AdventureLevelItem[] = [
  {
    id: 'lvl_1',
    topicKey: 'geometrik_sekil_cisim',
    levelNumber: 1,
    title: 'Geometrik Şekil ve Cisimler',
    subtitle: 'Küp, Küre, Silindir & Prizmalar',
    desc: 'Çevrendeki nesnelerin geometrik cisim ve şekillerini tanı!',
    icon: '/MENUIKON/grid_icon_10.png',
    coords: { x: 28, y: 88 } // Bottom left start
  },
  {
    id: 'lvl_2',
    topicKey: 'yuz_ayrit_kose',
    levelNumber: 2,
    title: 'Yüz, Ayrıt ve Köşe',
    subtitle: 'Cisimlerin Özellikleri',
    desc: 'Geometrik cisimlerin kaç yüzü, ayrıtı ve köşesi olduğunu keşfet!',
    icon: '/MENUIKON/grid_icon_14.png',
    coords: { x: 38, y: 74 } // Mid-left upward
  },
  {
    id: 'lvl_3',
    topicKey: 'geometrik_oruntu',
    levelNumber: 3,
    title: 'Geometrik Örüntüler',
    subtitle: 'Kuralı Bul ve Tamamla',
    desc: 'Şekil ve cisim örüntülerindeki gizli kuralı çöz!',
    icon: '/MENUIKON/grid_icon_18.png',
    coords: { x: 62, y: 62 } // Crossing towards right near cottage
  },
  {
    id: 'lvl_4',
    topicKey: 'uzamsal_iliskiler_simetri',
    levelNumber: 4,
    title: 'Uzamsal İlişkiler & Simetri',
    subtitle: 'Ayna Görüntüsü & Konum',
    desc: 'Sağ-sol, ön-arka ve simetri ekseniyle görsel zekanı geliştir!',
    icon: '/MENUIKON/grid_icon_20.png',
    coords: { x: 82, y: 48 } // Right side path
  },
  {
    id: 'lvl_5',
    topicKey: 'sivi_olcme',
    levelNumber: 5,
    title: 'Sıvı Ölçme',
    subtitle: 'Bardak, Sürahi ve Kova',
    desc: 'Sıvı miktarlarını standart olmayan birimlerle karşılaştır ve tahmin et!',
    icon: '/MENUIKON/grid_icon_22.png',
    coords: { x: 74, y: 32 } // Upper right winding left
  },
  {
    id: 'lvl_6',
    topicKey: 'tartma_olcme',
    levelNumber: 6,
    title: 'Tartma ve Kütle Ölçme',
    subtitle: 'Ağır, Hafif & Eşit Kollu Terazi',
    desc: 'Nesnelerin kütlelerini terazi ve standart ölçülerle tart!',
    icon: '/MENUIKON/grid_icon_23.png',
    coords: { x: 38, y: 20 } // Upper left
  },
  {
    id: 'lvl_7',
    topicKey: '3d_lab',
    levelNumber: 7,
    title: '3D Geometri Zirvesi',
    subtitle: '360° Dokunma & İnceleme Labı',
    desc: 'Tüm cisimleri 3 boyutlu döndürerek şampiyonluğunu taçlandır!',
    icon: '/MENUIKON/grid_icon_14.png',
    isSpecialLab: true,
    coords: { x: 58, y: 7 } // Peak top
  }
];

interface AdventureMapProps {
  statsData: Record<string, StatRecord>;
  onSelectTopic: (topicKey: string) => void;
  onOpen3DLab: () => void;
  onBackToCategories: () => void;
  onToggleViewMode: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  statsData,
  onSelectTopic,
  onOpen3DLab,
  onBackToCategories,
  onToggleViewMode
}) => {
  const [selectedLevel, setSelectedLevel] = useState<AdventureLevelItem | null>(null);
  const [unlockAll, setUnlockAll] = useState<boolean>(true); // Varsayılan tüm kilitler açık (eğitim rahatlığı için)

  // Calculate star & completion status for each level
  const getLevelStatus = (level: AdventureLevelItem, index: number) => {
    if (level.isSpecialLab) {
      const prevLevelsCompleted = GEOMETRI_LEVELS.slice(0, 6).every(lvl => {
        const stat = statsData[lvl.topicKey];
        return (stat?.dogru || 0) >= 3;
      });
      const isUnlocked = unlockAll || prevLevelsCompleted;
      return {
        isCompleted: prevLevelsCompleted,
        stars: prevLevelsCompleted ? 3 : 0,
        isUnlocked,
        isCurrent: isUnlocked && !prevLevelsCompleted,
        correctCount: 0,
        wrongCount: 0
      };
    }

    const stat = statsData[level.topicKey];
    const correct = stat?.dogru || 0;
    const wrong = stat?.yanlis || 0;

    let stars = 0;
    if (correct >= 10) stars = 3;
    else if (correct >= 5) stars = 2;
    else if (correct >= 1) stars = 1;

    const isCompleted = correct >= 3;

    // Previous level condition
    let isUnlocked = unlockAll || index === 0;
    if (!unlockAll && index > 0) {
      const prevLevel = GEOMETRI_LEVELS[index - 1];
      const prevStat = statsData[prevLevel.topicKey];
      isUnlocked = (prevStat?.dogru || 0) >= 1;
    }

    // Is this the first incomplete but unlocked level?
    const isCurrent = isUnlocked && !isCompleted;

    return {
      isCompleted,
      stars,
      isUnlocked,
      isCurrent,
      correctCount: correct,
      wrongCount: wrong
    };
  };

  // Find overall progress
  let totalStarsEarned = 0;
  let completedLevelsCount = 0;
  GEOMETRI_LEVELS.forEach((lvl, idx) => {
    const st = getLevelStatus(lvl, idx);
    totalStarsEarned += st.stars;
    if (st.isCompleted) completedLevelsCount++;
  });

  const handleLevelClick = (level: AdventureLevelItem, status: ReturnType<typeof getLevelStatus>) => {
    if (!status.isUnlocked && !unlockAll) {
      setSelectedLevel(level);
      return;
    }
    setSelectedLevel(level);
  };

  const handleStartLevel = (level: AdventureLevelItem) => {
    if (level.isSpecialLab) {
      onOpen3DLab();
    } else {
      onSelectTopic(level.topicKey);
    }
    setSelectedLevel(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none animate-fadeIn">
      {/* TOP HEADER CONTROLS BAR */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-2 border-amber-400/80 rounded-2xl p-2.5 sm:p-3 mb-2 flex items-center justify-between shadow-xl gap-2 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToCategories}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-blue-950 font-black text-xs sm:text-sm shadow-md border border-white flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Konu Seçimine Dön"
          >
            <span>◀</span>
            <span className="hidden xs:inline">Konular</span>
          </button>

          <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/50 rounded-xl px-2.5 py-1">
            <Compass className="text-amber-400 w-4 h-4 animate-spin-slow" />
            <span className="text-white font-black text-xs sm:text-sm uppercase tracking-wide">
              1. Geometri Macera Haritası
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TOTAL STARS BADGE */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-blue-950 px-2.5 sm:px-3 py-1 rounded-xl font-black text-xs sm:text-sm shadow-md border border-white">
            <Star className="w-4 h-4 fill-amber-900 text-amber-900 animate-pulse" />
            <span>{totalStarsEarned} ⭐</span>
          </div>

          {/* VIEW SWITCH BUTTON (MAP vs LIST) */}
          <button
            onClick={onToggleViewMode}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-bold text-xs shadow-md border border-blue-300 flex items-center gap-1 cursor-pointer transition-all"
            title="Klasik Liste Görünümüne Geç"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Liste Görünümü</span>
          </button>
        </div>
      </div>

      {/* MAP CONTAINER CANVAS (FANTASY GAME ART STYLE WITH SVG PATH & ILLUSTRATIONS) */}
      <div className="relative w-full aspect-[9/14] max-h-[820px] rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.6)] border-4 border-amber-500/90 bg-[#5ca832] flex flex-col justify-between">
        
        {/* SVG BACKGROUND ARTWORK (VIBRANT GREEN HILLS, WINDING DIRT PATH, STREAM, TREES, COTTAGE) */}
        <svg 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
          viewBox="0 0 450 700" 
          preserveAspectRatio="none"
        >
          <defs>
            {/* Green Hill Gradients */}
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7ad03a" />
              <stop offset="100%" stopColor="#4a9420" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8be242" />
              <stop offset="100%" stopColor="#5aa828" />
            </linearGradient>
            <linearGradient id="hillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#63b629" />
              <stop offset="100%" stopColor="#3b7a15" />
            </linearGradient>

            {/* Winding Dirt Path Gradient */}
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8c792" />
              <stop offset="50%" stopColor="#d2a970" />
              <stop offset="100%" stopColor="#bf945b" />
            </linearGradient>

            {/* Path Border / Shadow Gradient */}
            <linearGradient id="pathBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#966d3b" />
              <stop offset="100%" stopColor="#704e25" />
            </linearGradient>

            {/* Stone Stepping Pedestal Radial Gradients */}
            <radialGradient id="blueStoneGloss" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="40%" stopColor="#06b6d4" />
              <stop offset="85%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            <radialGradient id="goldStoneGloss" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>

            <radialGradient id="grayStoneGloss" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="90%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            <filter id="dropShadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* BACKGROUND ROLLING HILL LAYERS */}
          {/* Base Layer */}
          <rect width="450" height="700" fill="url(#hillGrad1)" />

          {/* Hill Tier 1 (Top) */}
          <path d="M 0,0 L 450,0 L 450,160 Q 340,110 220,150 Q 100,190 0,130 Z" fill="url(#hillGrad3)" />
          <path d="M 0,0 L 450,0 L 450,90 Q 300,60 180,100 Q 80,120 0,70 Z" fill="#4d9a1f" opacity="0.6" />

          {/* Hill Tier 2 (Mid-Upper) */}
          <path d="M 0,220 Q 120,180 250,230 Q 380,280 450,240 L 450,420 Q 320,460 180,410 Q 70,380 0,440 Z" fill="url(#hillGrad2)" opacity="0.85" />

          {/* Hill Tier 3 (Mid-Lower) */}
          <path d="M 0,430 Q 150,380 300,450 Q 390,490 450,470 L 450,700 L 0,700 Z" fill="url(#hillGrad1)" />

          {/* Decorative Cliff / Rock Ledges */}
          <path d="M 380,80 Q 430,90 450,120 L 450,160 Q 410,140 370,110 Z" fill="#8d99ae" opacity="0.6" />
          <path d="M 0,320 Q 50,310 90,340 L 80,360 Q 40,340 0,350 Z" fill="#8d99ae" opacity="0.6" />
          <path d="M 390,560 Q 425,540 450,570 L 450,600 Q 410,580 380,590 Z" fill="#8d99ae" opacity="0.6" />

          {/* WINDING DIRT PATHWAY (Thick curved stroke from Bottom 1 to Top 7) */}
          {/* Path Outer Border / Shadow */}
          <path 
            d="M 126,620 
               C 130,570 160,530 171,518 
               C 210,480 280,450 279,434 
               C 340,390 380,360 369,336 
               C 360,290 350,240 333,224 
               C 290,180 180,180 171,140 
               C 160,100 240,70 261,49"
            fill="none" 
            stroke="url(#pathBorderGrad)" 
            strokeWidth="56" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Path Inner Dirt Surface */}
          <path 
            d="M 126,620 
               C 130,570 160,530 171,518 
               C 210,480 280,450 279,434 
               C 340,390 380,360 369,336 
               C 360,290 350,240 333,224 
               C 290,180 180,180 171,140 
               C 160,100 240,70 261,49"
            fill="none" 
            stroke="url(#pathGrad)" 
            strokeWidth="44" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Small Path Texture Pebbles */}
          <circle cx="140" cy="580" r="3" fill="#9e7846" opacity="0.7" />
          <circle cx="185" cy="495" r="2.5" fill="#9e7846" opacity="0.7" />
          <circle cx="295" cy="415" r="3.5" fill="#9e7846" opacity="0.7" />
          <circle cx="355" cy="310" r="3" fill="#9e7846" opacity="0.7" />
          <circle cx="300" cy="210" r="2.5" fill="#9e7846" opacity="0.7" />
          <circle cx="195" cy="130" r="3" fill="#9e7846" opacity="0.7" />

          {/* DECORATIVE COTTAGE HOUSE (Cozy Medieval House near Level 3 & 4) */}
          <g transform="translate(60, 240) scale(0.9)" filter="url(#dropShadowGlow)">
            {/* House Shadow */}
            <ellipse cx="65" cy="95" rx="60" ry="18" fill="#2d5e16" opacity="0.6" />
            
            {/* Wooden Base Walls */}
            <polygon points="15,45 115,45 120,90 10,90" fill="#eed9b3" stroke="#78350f" strokeWidth="2" />
            
            {/* Timber Beams */}
            <line x1="20" y1="45" x2="15" y2="90" stroke="#78350f" strokeWidth="3" />
            <line x1="110" y1="45" x2="115" y2="90" stroke="#78350f" strokeWidth="3" />
            <line x1="65" y1="45" x2="65" y2="90" stroke="#78350f" strokeWidth="3" />
            <line x1="15" y1="68" x2="118" y2="68" stroke="#78350f" strokeWidth="2.5" />

            {/* Cozy Wooden Door */}
            <rect x="52" y="60" width="22" height="30" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="2" />
            <circle cx="70" cy="76" r="2" fill="#fef08a" />

            {/* Cute Windows with Yellow Warm Light */}
            <rect x="25" y="55" width="18" height="18" rx="2" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
            <line x1="34" y1="55" x2="34" y2="73" stroke="#78350f" strokeWidth="1.5" />
            <line x1="25" y1="64" x2="43" y2="64" stroke="#78350f" strokeWidth="1.5" />

            <rect x="85" y="55" width="18" height="18" rx="2" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
            <line x1="94" y1="55" x2="94" y2="73" stroke="#78350f" strokeWidth="1.5" />
            <line x1="85" y1="64" x2="103" y2="64" stroke="#78350f" strokeWidth="1.5" />

            {/* Vibrant Blue Slate Roof */}
            <polygon points="65,10 135,45 -5,45" fill="#1e40af" stroke="#172554" strokeWidth="3" />
            <polygon points="65,10 130,45 65,45" fill="#2563eb" />
            <polygon points="65,10 0,45 65,45" fill="#1d4ed8" />
            
            {/* Roof Shingle Texture Lines */}
            <path d="M 20,35 Q 35,40 50,35 Q 65,40 80,35 Q 95,40 110,35" stroke="#93c5fd" strokeWidth="1.5" fill="none" />
            <path d="M 35,25 Q 50,28 65,25 Q 80,28 95,25" stroke="#93c5fd" strokeWidth="1.5" fill="none" />

            {/* Wooden Picnic Table & Bench outside */}
            <g transform="translate(10, 96)">
              <rect x="0" y="2" width="26" height="5" rx="1" fill="#92400e" stroke="#451a03" strokeWidth="1" />
              <line x1="4" y1="7" x2="2" y2="15" stroke="#451a03" strokeWidth="2" />
              <line x1="22" y1="7" x2="24" y2="15" stroke="#451a03" strokeWidth="2" />
            </g>
          </g>

          {/* CARTOON PINE TREES & BUSHES SCATTERED */}
          {/* Tree Top Right */}
          <g transform="translate(370, 40)" filter="url(#dropShadowGlow)">
            <ellipse cx="20" cy="70" rx="18" ry="6" fill="#1e3a10" opacity="0.4" />
            <rect x="17" y="55" width="6" height="15" fill="#78350f" />
            <polygon points="20,10 38,40 2,40" fill="#15803d" />
            <polygon points="20,25 42,55 -2,55" fill="#166534" />
          </g>

          {/* Tree Mid Right */}
          <g transform="translate(365, 430)" filter="url(#dropShadowGlow)">
            <ellipse cx="20" cy="80" rx="20" ry="7" fill="#1e3a10" opacity="0.4" />
            <rect x="17" y="65" width="7" height="18" fill="#78350f" />
            <polygon points="20,10 40,40 0,40" fill="#22c55e" />
            <polygon points="20,25 44,58 -4,58" fill="#16a34a" />
            <polygon points="20,40 48,72 -8,72" fill="#15803d" />
          </g>

          {/* Tree Bottom Center */}
          <g transform="translate(200, 560)" filter="url(#dropShadowGlow)">
            <ellipse cx="20" cy="75" rx="18" ry="6" fill="#1e3a10" opacity="0.4" />
            <rect x="17" y="60" width="6" height="16" fill="#78350f" />
            <polygon points="20,15 38,42 2,42" fill="#22c55e" />
            <polygon points="20,30 42,62 -2,62" fill="#16a34a" />
          </g>

          {/* Tree Left Mid */}
          <g transform="translate(20, 100)" filter="url(#dropShadowGlow)">
            <ellipse cx="20" cy="70" rx="18" ry="6" fill="#1e3a10" opacity="0.4" />
            <rect x="17" y="55" width="6" height="15" fill="#78350f" />
            <polygon points="20,10 38,38 2,38" fill="#16a34a" />
            <polygon points="20,25 42,55 -2,55" fill="#15803d" />
          </g>

          {/* Cute Flower Clusters */}
          <g transform="translate(18, 580)">
            <circle cx="0" cy="0" r="3" fill="#f43f5e" />
            <circle cx="5" cy="-2" r="3" fill="#fbbf24" />
            <circle cx="-4" cy="3" r="3" fill="#f43f5e" />
            <circle cx="3" cy="4" r="3" fill="#fbbf24" />
          </g>

          <g transform="translate(340, 200)">
            <circle cx="0" cy="0" r="3" fill="#a855f7" />
            <circle cx="6" cy="-1" r="3" fill="#ec4899" />
            <circle cx="-3" cy="4" r="3" fill="#fbbf24" />
          </g>

          {/* Wooden Split-Rail Fences */}
          <g transform="translate(380, 180) rotate(15)">
            <line x1="0" y1="0" x2="35" y2="0" stroke="#78350f" strokeWidth="2.5" />
            <line x1="0" y1="6" x2="35" y2="6" stroke="#78350f" strokeWidth="2" />
            <line x1="5" y1="-3" x2="5" y2="12" stroke="#5c2406" strokeWidth="3" />
            <line x1="30" y1="-3" x2="30" y2="12" stroke="#5c2406" strokeWidth="3" />
          </g>

          <g transform="translate(25, 490) rotate(-20)">
            <line x1="0" y1="0" x2="35" y2="0" stroke="#78350f" strokeWidth="2.5" />
            <line x1="0" y1="6" x2="35" y2="6" stroke="#78350f" strokeWidth="2" />
            <line x1="5" y1="-3" x2="5" y2="12" stroke="#5c2406" strokeWidth="3" />
            <line x1="30" y1="-3" x2="30" y2="12" stroke="#5c2406" strokeWidth="3" />
          </g>
        </svg>

        {/* INTERACTIVE STEPPING STONE BUTTONS LAYER (POSITIONED EXACTLY ON PATH COORDS) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {GEOMETRI_LEVELS.map((level, idx) => {
            const status = getLevelStatus(level, idx);
            const { x, y } = level.coords;

            return (
              <div
                key={level.id}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer"
                onClick={() => handleLevelClick(level, status)}
              >
                {/* FLOATING 3 STARS ABOVE COMPLETED / UNLOCKED STONES */}
                {status.stars > 0 && (
                  <div className="flex items-center gap-0.5 -mb-1 z-20 animate-bounce-gentle filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {[1, 2, 3].map(starNum => {
                      const isFilled = starNum <= status.stars;
                      return (
                        <span
                          key={starNum}
                          className={`text-sm sm:text-base transition-transform ${
                            isFilled
                              ? 'text-yellow-300 fill-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]'
                              : 'text-slate-400/80'
                          } ${starNum === 2 ? '-translate-y-1 scale-110' : ''}`}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* CURRENT ACTIVE LEVEL FLOATING "BAŞLA / BURADASIN" CUTE TAG */}
                {status.isCurrent && (
                  <div className="mb-0.5 z-20 animate-bounce">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-950 font-black text-[10px] sm:text-xs rounded-full border border-white shadow-lg uppercase tracking-wider">
                      ŞİMDİ OYNA ▶
                    </span>
                  </div>
                )}

                {/* 3D STEPPED STONE PEDESTAL BUTTON */}
                <div className="relative flex flex-col items-center">
                  {/* Outer Pulsing Glow for Current Active Level */}
                  {status.isCurrent && (
                    <div className="absolute -inset-2.5 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                  )}

                  {/* Stone Base Layer (Stepped Granite Pedestal) */}
                  <div className="relative w-14 h-11 xs:w-16 xs:h-13 sm:w-20 sm:h-15 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                    
                    {/* Bottom Stone Shadow */}
                    <div className="absolute bottom-0 w-[95%] h-5 bg-slate-900/50 rounded-full blur-[2px]" />
                    
                    {/* Lower Stone Cylinder Rim */}
                    <div className="absolute bottom-1 w-full h-8 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-[50%] border-2 border-slate-700 shadow-md" />
                    
                    {/* Upper Stone Cylinder Step */}
                    <div className="absolute bottom-2.5 w-[88%] h-7 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-500 rounded-[50%] border-2 border-slate-600 shadow-inner" />

                    {/* TOP INTERACTIVE GLOSSY BUTTON SURFACE */}
                    <div
                      className={`absolute top-0 w-[78%] h-7 xs:h-8 sm:h-9 rounded-[50%] flex items-center justify-center border-2 border-white/90 shadow-[inset_0_3px_6px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.4)] ${
                        level.isSpecialLab
                          ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 text-white'
                          : status.isCompleted
                          ? 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-300 text-white ring-2 ring-cyan-300'
                          : status.isUnlocked
                          ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 text-white ring-2 ring-yellow-300 animate-pulse'
                          : 'bg-gradient-to-tr from-slate-400 via-slate-500 to-slate-600 text-slate-300'
                      }`}
                    >
                      {/* Top Specular Shine */}
                      <div className="absolute top-1 left-[15%] right-[15%] h-2 bg-white/50 rounded-full pointer-events-none" />

                      {/* Number or Icon inside Button */}
                      {level.isSpecialLab ? (
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200 fill-yellow-300 drop-shadow-md" />
                      ) : !status.isUnlocked && !unlockAll ? (
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      ) : (
                        <span className="font-black text-sm xs:text-base sm:text-lg text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tight">
                          {level.levelNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* MINI TITLE LABEL UNDER PEDESTAL */}
                <div className="mt-0.5 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/40 shadow-md max-w-[110px] sm:max-w-[130px] text-center pointer-events-none group-hover:scale-105 transition-transform">
                  <p className="text-[9px] sm:text-[10px] font-black text-white truncate drop-shadow-xs">
                    {level.isSpecialLab ? '🏆 3D Labı' : `${level.levelNumber}. ${level.title.split(' ')[0]}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM QUICK STATS FOOTER */}
        <div className="relative z-20 bg-gradient-to-t from-slate-950/95 via-slate-900/90 to-transparent p-3 pt-6 flex items-center justify-between gap-2 border-t border-amber-400/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 text-sm font-black">
              {completedLevelsCount}/6
            </div>
            <div>
              <div className="text-xs font-black text-white">Harita İlerlemesi</div>
              <div className="text-[10px] text-amber-300 font-bold">
                {completedLevelsCount === 6 ? 'Tüm Geometri Seviyeleri Tamamlandı! 🎉' : `${6 - completedLevelsCount} Seviye Kaldı`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* TEACHER UNLOCK TOGGLE */}
            <button
              onClick={() => setUnlockAll(!unlockAll)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                unlockAll 
                  ? 'bg-emerald-600/90 text-white border-emerald-300 shadow-sm' 
                  : 'bg-slate-800 text-slate-300 border-slate-600'
              }`}
              title="Öğretmen Modu: Tüm kilitleri anında aç veya kilitli tut"
            >
              {unlockAll ? '🔓 Tüm Kilitler Açık' : '🔒 Adım Adım Kilit'}
            </button>
          </div>
        </div>
      </div>

      {/* LEVEL PREVIEW & LAUNCH MODAL DIALOG */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-3 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] text-center animate-scaleUp overflow-hidden">
            
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedLevel(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-600 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {/* Level Icon with 3D Gloss Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-1 border-2 border-white shadow-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src={selectedLevel.icon} 
                alt={selectedLevel.title} 
                className="w-full h-full object-cover scale-[1.4] filter drop-shadow-md" 
              />
            </div>

            {/* Level Number & Subtitle */}
            <div className="inline-block px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs uppercase tracking-widest mb-1.5">
              {selectedLevel.isSpecialLab ? 'ZİRVE ETKİNLİĞİ' : `${selectedLevel.levelNumber}. SEVİYE`}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-1 drop-shadow-sm">
              {selectedLevel.title}
            </h3>

            <p className="text-xs sm:text-sm font-bold text-yellow-300 mb-2">
              {selectedLevel.subtitle}
            </p>

            <p className="text-xs text-slate-300 font-medium bg-slate-800/80 rounded-xl p-2.5 border border-slate-700 mb-4 leading-relaxed">
              {selectedLevel.desc}
            </p>

            {/* STATS RECORD FOR THIS LEVEL */}
            {(() => {
              const st = getLevelStatus(selectedLevel, selectedLevel.levelNumber - 1);
              return (
                <div className="flex items-center justify-center gap-4 bg-slate-950/70 rounded-xl p-2 mb-4 border border-slate-800">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-bold">Yıldız:</span>
                    <span className="text-amber-400 font-black text-sm">
                      {st.stars > 0 ? '⭐'.repeat(st.stars) : '☆☆☆'}
                    </span>
                  </div>
                  {!selectedLevel.isSpecialLab && (
                    <>
                      <div className="w-px h-4 bg-slate-700" />
                      <div className="text-xs text-emerald-400 font-black">
                        Doğru: {st.correctCount}
                      </div>
                      <div className="w-px h-4 bg-slate-700" />
                      <div className="text-xs text-rose-400 font-black">
                        Yanlış: {st.wrongCount}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* BIG 3D PLAY ACTION BUTTON */}
            <button
              onClick={() => handleStartLevel(selectedLevel)}
              className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-400 hover:to-green-400 text-white font-black text-base sm:text-lg border-2 border-white shadow-[0_6px_0_#065f46,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Play className="fill-white w-5 h-5" />
              <span>ETKİNLİĞE BAŞLA</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, RotateCcw, Trash2, CheckCircle2, Volume2, VolumeX,
  Lightbulb, Sparkles, Award, RefreshCw, X, Play, Info, ChevronRight, HelpCircle
} from 'lucide-react';
import { Cute3DStarMascotSVG } from './ModernStatsView';

// ==========================================
// 1. TEMEL VERİ TİPLERİ VE GÖREV LİSTESİ
// ==========================================

export interface Point {
  x: number;
  y: number;
}

export interface ShapeMission {
  id: number;
  targetType: 'kare' | 'ucgen' | 'dikdortgen' | 'cokgen' | 'herhangi';
  title: string;
  instruction: string;
  speechText: string;
  icon: string;
  color: string;
  sampleGhostPoints: Point[];
}

export const GRID_SIZE = 5; // 5x5 Noktalı Tahta
export const MARGIN = 12; // Grid padding yüzde oranı
export const STEP = (100 - 2 * MARGIN) / (GRID_SIZE - 1);

export const MISSIONS: ShapeMission[] = [
  {
    id: 1,
    targetType: 'kare',
    title: 'Kare Oluştur',
    instruction: 'Noktaları parmağınla birleştirerek 4 eşit kenarlı bir KARE çiz!',
    speechText: 'Noktaları parmağınla birleştirerek dört eşit kenarlı bir kare çiz!',
    icon: '🟧',
    color: 'from-amber-500 to-orange-600',
    sampleGhostPoints: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 1 }
    ]
  },
  {
    id: 2,
    targetType: 'ucgen',
    title: 'Üçgen Oluştur',
    instruction: 'Noktaları birleştirerek 3 köşeli ve 3 kenarlı bir ÜÇGEN çiz!',
    speechText: 'Noktaları birleştirerek üç köşeli ve üç kenarlı bir üçgen çiz!',
    icon: '🔺',
    color: 'from-emerald-500 to-teal-600',
    sampleGhostPoints: [
      { x: 2, y: 1 }, { x: 4, y: 3 }, { x: 0, y: 3 }, { x: 2, y: 1 }
    ]
  },
  {
    id: 3,
    targetType: 'dikdortgen',
    title: 'Dikdörtgen Oluştur',
    instruction: 'Karşılıklı kenarları birbirine eşit olan bir DİKDÖRTGEN çiz!',
    speechText: 'Karşılıklı kenarları birbirine eşit olan bir dikdörtgen çiz!',
    icon: '🟨',
    color: 'from-blue-500 to-indigo-600',
    sampleGhostPoints: [
      { x: 0, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 3 }, { x: 0, y: 3 }, { x: 0, y: 1 }
    ]
  },
  {
    id: 4,
    targetType: 'ucgen',
    title: 'Sivri Üçgen Oluştur',
    instruction: 'Noktaları birleştirerek 3 köşeli ve 3 kenarlı bir ÜÇGEN çiz!',
    speechText: 'Noktaları birleştirerek üç köşeli ve üç kenarlı bir üçgen çiz!',
    icon: '📐',
    color: 'from-purple-500 to-indigo-600',
    sampleGhostPoints: [
      { x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 4 }, { x: 1, y: 1 }
    ]
  },
  {
    id: 5,
    targetType: 'kare',
    title: 'Küçük Kare',
    instruction: 'Tahta üzerinde 2x2 boyutunda minik bir KARE oluştur!',
    speechText: 'Tahta üzerinde ikiye iki boyutunda minik bir kare oluştur!',
    icon: '🔲',
    color: 'from-rose-500 to-pink-600',
    sampleGhostPoints: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 2 }
    ]
  },
  {
    id: 6,
    targetType: 'dikdortgen',
    title: 'Dikey Dikdörtgen',
    instruction: 'Ayakta duran kapı şeklinde dikey bir DİKDÖRTGEN çiz!',
    speechText: 'Ayakta duran kapı şeklinde dikey bir dikdörtgen çiz!',
    icon: '🚪',
    color: 'from-cyan-500 to-blue-600',
    sampleGhostPoints: [
      { x: 1, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 0 }
    ]
  },
  {
    id: 7,
    targetType: 'kare',
    title: 'Büyük Kare',
    instruction: 'Tahtanın en dış noktalarını birleştirerek DEV BİR KARE çiz!',
    speechText: 'Tahtanın en dış noktalarını birleştirerek dev bir kare çiz!',
    icon: '🟫',
    color: 'from-amber-600 to-yellow-600',
    sampleGhostPoints: [
      { x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }, { x: 0, y: 0 }
    ]
  },
  {
    id: 8,
    targetType: 'ucgen',
    title: 'Geniş Çadır Üçgen',
    instruction: 'Tepesi yukarıda, tabanı geniş bir ÇADIR ÜÇGEN çiz!',
    speechText: 'Tepesi yukarıda, tabanı geniş bir çadır üçgen çiz!',
    icon: '⛺',
    color: 'from-teal-500 to-emerald-600',
    sampleGhostPoints: [
      { x: 2, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }, { x: 2, y: 0 }
    ]
  },
  {
    id: 9,
    targetType: 'cokgen',
    title: 'Beşgen / Altıgen Çiz',
    instruction: '5 veya 6 noktayı birleştirerek harika bir ÇOKGEN oluştur!',
    speechText: 'Beş veya altı noktayı birleştirerek harika bir çokgen oluştur!',
    icon: '⬡',
    color: 'from-violet-500 to-fuchsia-600',
    sampleGhostPoints: [
      { x: 2, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 3 }, { x: 2, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 1 }, { x: 2, y: 0 }
    ]
  },
  {
    id: 10,
    targetType: 'herhangi',
    title: 'Serbest Çizim Ustası',
    instruction: 'İstediğin geometrik şekli özgürce tahta üzerine çiz!',
    speechText: 'İstediğin geometrik şekli özgürce tahta üzerine çiz!',
    icon: '🎨',
    color: 'from-fuchsia-500 to-pink-600',
    sampleGhostPoints: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 3 }, { x: 0, y: 3 }, { x: 1, y: 1 }
    ]
  }
];

export const MISSIONS_GRADE_1: ShapeMission[] = [
  MISSIONS[0], // Kare Oluştur
  MISSIONS[1], // Üçgen Oluştur
  MISSIONS[2], // Dikdörtgen Oluştur
  MISSIONS[3], // Sivri Üçgen Oluştur
  MISSIONS[4], // Küçük Kare
  MISSIONS[5], // Dikey Dikdörtgen
  MISSIONS[6], // Büyük Kare
  MISSIONS[7], // Geniş Çadır Üçgen
  {
    id: 9,
    targetType: 'dikdortgen',
    title: 'Geniş Dikdörtgen',
    instruction: 'Noktaları birleştirerek geniş bir DİKDÖRTGEN çiz!',
    speechText: 'Noktaları birleştirerek geniş bir dikdörtgen çiz!',
    icon: '🟨',
    color: 'from-violet-500 to-fuchsia-600',
    sampleGhostPoints: [
      { x: 0, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 3 }, { x: 0, y: 3 }, { x: 0, y: 1 }
    ]
  },
  {
    id: 10,
    targetType: 'herhangi',
    title: 'Serbest Çizim Ustası',
    instruction: 'İstediğin geometrik şekli (kare, üçgen veya dikdörtgen) özgürce tahta üzerine çiz!',
    speechText: 'İstediğin geometrik şekli tahta üzerine çiz!',
    icon: '🎨',
    color: 'from-fuchsia-500 to-pink-600',
    sampleGhostPoints: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 1 }
    ]
  }
];

export const COLOR_PALETTE = [
  { name: 'Sarı', hex: '#fbbf24', glow: 'rgba(251,191,36,0.7)', bg: 'from-amber-400 to-yellow-500' },
  { name: 'Yeşil', hex: '#22c55e', glow: 'rgba(34,197,94,0.7)', bg: 'from-emerald-400 to-green-600' },
  { name: 'Mavi', hex: '#06b6d4', glow: 'rgba(6,182,212,0.7)', bg: 'from-cyan-400 to-blue-600' },
  { name: 'Kırmızı', hex: '#f43f5e', glow: 'rgba(244,63,94,0.7)', bg: 'from-rose-400 to-pink-600' },
  { name: 'Mor', hex: '#a855f7', glow: 'rgba(168,85,247,0.7)', bg: 'from-purple-400 to-indigo-600' },
  { name: 'Turuncu', hex: '#f97316', glow: 'rgba(249,115,22,0.7)', bg: 'from-orange-400 to-amber-600' }
];

// ==========================================
// 2. GEOMETRİK ŞEKİL VE KÖŞE ANALİZ MOTORU
// ==========================================

// Doğrusal ara noktaları temizleyip sadece gerçek köşe noktalarını bırakır
export function simplifyPolygon(rawPoints: Point[]): Point[] {
  if (rawPoints.length < 3) return [];

  const points: Point[] = [];
  for (const p of rawPoints) {
    if (points.length === 0 || points[points.length - 1].x !== p.x || points[points.length - 1].y !== p.y) {
      points.push({ x: p.x, y: p.y });
    }
  }
  if (points.length < 3) return [];

  // Doğrusal ara noktaları (collinear pegs) kaldırarak yalnızca gerçek KÖŞELERİ bırak
  let current = points;
  let changed = true;
  let iterations = 0;
  while (changed && current.length >= 3 && iterations < 20) {
    changed = false;
    iterations++;
    const simplified: Point[] = [];
    const len = current.length;
    for (let i = 0; i < len; i++) {
      const prev = current[(i - 1 + len) % len];
      const curr = current[i];
      const next = current[(i + 1) % len];

      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;
      const cross = dx1 * dy2 - dy1 * dx2;
      const dot = dx1 * dx2 + dy1 * dy2;

      // Çapraz çarpım 0 ise noktalar aynı doğru üzerindedir (aradaki nokta elenir)
      if (cross === 0 && dot > 0) {
        changed = true;
      } else {
        simplified.push(curr);
      }
    }
    current = simplified;
  }
  return current;
}

// Şeklin Kare / Üçgen / Dikdörtgen olup olmadığını analiz eden fonksiyon
export function analyzeShape(rawPoints: Point[]) {
  if (rawPoints.length < 3) {
    return { type: 'gecersiz', corners: 0, name: 'Çizgi / Açık Şekil', desc: 'En az 3 nokta birleştirmelisin', isClosed: false };
  }

  // İlk ve son nokta birleşmiş mi kontrolü
  const isEndClosed = rawPoints[0].x === rawPoints[rawPoints.length - 1].x && rawPoints[0].y === rawPoints[rawPoints.length - 1].y;
  
  const polygonPoints = isEndClosed ? rawPoints.slice(0, -1) : rawPoints;
  const corners = simplifyPolygon(polygonPoints);
  const n = corners.length;

  if (n < 3) {
    return { type: 'gecersiz', corners: n, name: 'Doğru Parçası', desc: 'Noktalar aynı hizada, şekil oluşmadı', isClosed: isEndClosed };
  }

  if (n === 3) {
    return { type: 'ucgen', corners: 3, name: 'Üçgen', desc: '3 Kenar ve 3 Köşe', isClosed: isEndClosed, cornersList: corners };
  }

  if (n === 4) {
    const p = corners;
    const distSq = (p1: Point, p2: Point) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    const d01 = distSq(p[0], p[1]);
    const d12 = distSq(p[1], p[2]);
    const d23 = distSq(p[2], p[3]);
    const d30 = distSq(p[3], p[0]);

    // Nokta çarpımı (Dot Product) ile 90 derecelik diklik kontrolü
    const dot0 = (p[1].x - p[0].x) * (p[3].x - p[0].x) + (p[1].y - p[0].y) * (p[3].y - p[0].y);
    const dot1 = (p[2].x - p[1].x) * (p[0].x - p[1].x) + (p[2].y - p[1].y) * (p[0].y - p[1].y);
    const dot2 = (p[3].x - p[2].x) * (p[1].x - p[2].x) + (p[3].y - p[2].y) * (p[1].y - p[2].y);
    const dot3 = (p[0].x - p[3].x) * (p[2].x - p[3].x) + (p[0].y - p[3].y) * (p[2].y - p[3].y);

    const isRightAngled = dot0 === 0 && dot1 === 0 && dot2 === 0 && dot3 === 0;

    if (isRightAngled) {
      if (d01 === d12 && d12 === d23 && d23 === d30) {
        return { type: 'kare', corners: 4, name: 'Kare', desc: '4 Eşit Kenar ve 4 Dik Köşe', isClosed: isEndClosed, cornersList: corners };
      }
      if (d01 === d23 && d12 === d30) {
        return { type: 'dikdortgen', corners: 4, name: 'Dikdörtgen', desc: 'Karşılıklı Kenarları Eşit, 4 Dik Köşe', isClosed: isEndClosed, cornersList: corners };
      }
    }
    return { type: 'dortgen', corners: 4, name: 'Dörtgen', desc: '4 Kenar ve 4 Köşe', isClosed: isEndClosed, cornersList: corners };
  }

  return { type: 'cokgen', corners: n, name: `${n}'gen`, desc: `${n} Kenar ve ${n} Köşe`, isClosed: isEndClosed, cornersList: corners };
}

// Ara noktaları (collinear) ızgara adımları olarak doldurma
export function getLinePegs(p1: Point, p2: Point): Point[] {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (dx === 0 && dy === 0) return [];
  
  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const g = gcd(dx, dy);
  const stepX = dx / g;
  const stepY = dy / g;

  const result: Point[] = [];
  for (let i = 1; i <= g; i++) {
    result.push({
      x: p1.x + stepX * i,
      y: p1.y + stepY * i
    });
  }
  return result;
}

export const getPegPositionPercent = (gx: number, gy: number) => ({
  x: MARGIN + gx * STEP,
  y: MARGIN + gy * STEP
});

// Ses Sentezleyici
export const playTone = (freq: number, duration: number = 0.08, type: OscillatorType = 'sine', delay: number = 0, volume: number = 0.15) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    // Audio context error ignore
  }
};

// ==========================================
// 3. BİLEŞEN: GeoboardShapeDrawingGame
// ==========================================

export interface GeoboardShapeDrawingGameProps {
  grade?: 1 | 2 | 3 | 4;
  onClose?: () => void;
  playMp3?: (sound: string) => void;
}

export const GeoboardShapeDrawingGame: React.FC<GeoboardShapeDrawingGameProps> = ({
  grade = 1,
  onClose,
  playMp3
}) => {
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragCurrentCoord, setDragCurrentCoord] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPeg, setHoveredPeg] = useState<Point | null>(null);
  const [history, setHistory] = useState<Point[][]>([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [showGhostHint, setShowGhostHint] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const activeMissions = grade === 1 ? MISSIONS_GRADE_1 : MISSIONS;
  const currentMission = activeMissions[missionIndex] || activeMissions[0];
  const selectedColor = COLOR_PALETTE[selectedColorIndex] || COLOR_PALETTE[0];

  // Görev değiştiğinde temizle
  useEffect(() => {
    setDrawnPoints([]);
    setHistory([]);
    setHoveredPeg(null);
    setShowGhostHint(false);
    setStatusMessage(null);
  }, [missionIndex, currentMission]);

  // Canlı Şekil Analizi
  const analysis = useMemo(() => {
    return analyzeShape(drawnPoints);
  }, [drawnPoints]);

  const isClosed = useMemo(() => {
    if (drawnPoints.length < 3) return false;
    const first = drawnPoints[0];
    const last = drawnPoints[drawnPoints.length - 1];
    return first.x === last.x && first.y === last.y;
  }, [drawnPoints]);

  // Manyetik Nokta Yakalama
  // Not: STEP = 19%, 12% yakalama yarıçapı komşu noktalara taşmadan hedef noktayı net yakalar
  const getNearestPeg = useCallback((clientX: number, clientY: number): Point | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;

    let closestPoint: Point | null = null;
    let minDistance = 7.5; // % yakalama yarıçapı (komşu noktalara taşmadan hedef noktayı net yakalar)

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const pegPos = getPegPositionPercent(gx, gy);
        const dist = Math.hypot(relX - pegPos.x, relY - pegPos.y);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = { x: gx, y: gy };
        }
      }
    }
    return closestPoint;
  }, []);

  // Dokunma / Tıklama veya Parmağı Kaldırma ile Nokta Bağlama
  const handlePegTap = useCallback((gx: number, gy: number) => {
    if (isClosed) return; // Şekil kapatıldıysa tahtaya rastgele tıklama şekli bozmasın

    setDrawnPoints(prev => {
      if (prev.length === 0) {
        if (soundEnabled) playTone(480, 0.08, 'triangle', 0, 0.2);
        setHistory([]);
        return [{ x: gx, y: gy }];
      }

      const first = prev[0];
      const last = prev[prev.length - 1];

      // Eğer ilk noktaya tekrar dokunuluyorsa ve en az 3 nokta varsa şekli kapat
      if (gx === first.x && gy === first.y && prev.length >= 3) {
        if (soundEnabled) {
          playTone(520, 0.08, 'sine', 0, 0.25);
          playTone(680, 0.15, 'sine', 0.08, 0.25);
        }
        setHistory(h => [...h, prev]);
        return [...prev, { x: gx, y: gy }];
      }

      // Aynı noktaya tekrar basıldığında işlem yapma
      if (last.x === gx && last.y === gy) return prev;

      if (soundEnabled) playTone(440 + (gx + gy) * 35, 0.06, 'sine', 0, 0.2);
      setHistory(h => [...h, prev]);
      return [...prev, { x: gx, y: gy }];
    });
  }, [isClosed, soundEnabled]);

  // Pointer Down (Sürüklemeye veya Dokunmaya Başlama)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isClosed) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    try {
      (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const peg = getNearestPeg(e.clientX, e.clientY);
    setIsDragging(true);

    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      setDragCurrentCoord({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (peg) {
      setHoveredPeg(peg);
      // Eğer tahtada henüz hiç nokta yoksa, ilk başlangıç noktası olarak ata
      if (drawnPoints.length === 0) {
        setDrawnPoints([{ x: peg.x, y: peg.y }]);
        if (soundEnabled) playTone(480, 0.08, 'triangle', 0, 0.2);
      }
    } else {
      setHoveredPeg(null);
    }
  };

  // Pointer Move (Sürükleme - DİKKAT: Parmak kalkmadan KESİNLİKLE ara nokta bağlanmaz!)
  // Çapraz üçgen gibi şekillerde aradaki komşu noktalara atlamaması için parmak havadayken sadece önizleme yapılır
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isClosed || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    setDragCurrentCoord({ x: curX, y: curY });

    const peg = getNearestPeg(e.clientX, e.clientY);
    setHoveredPeg(peg);
  };

  // Pointer Up (Parmağı Kaldırma - NOKTA TAM BU ANDA BAĞLANIR)
  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!isDragging || isClosed) {
      setIsDragging(false);
      setDragCurrentCoord(null);
      setHoveredPeg(null);
      return;
    }

    const peg = getNearestPeg(e.clientX, e.clientY);
    setIsDragging(false);
    setDragCurrentCoord(null);
    setHoveredPeg(null);

    if (!peg) {
      // Parmak boşlukta bırakıldıysa hiçbir çizim yapılmaz, ara noktaya atlamaz
      return;
    }

    // Hedef noktaya YALNIZCA parmak kaldırıldığında bağlanır!
    handlePegTap(peg.x, peg.y);
  };

  // Pointer Cancel (Beklenmeyen jest/dokunma kesintilerinde güvenli sıfırlama)
  const handlePointerCancel = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
    setDragCurrentCoord(null);
    setHoveredPeg(null);
  };

  // Şekli Doğrulama / Onaylama
  const handleVerify = () => {
    if (drawnPoints.length < 3) {
      setStatusMessage({ type: 'error', text: 'Önce en az 3 nokta birleştirerek bir şekil oluştur!' });
      if (soundEnabled) playTone(220, 0.2, 'sawtooth', 0, 0.25);
      return;
    }

    if (!isClosed) {
      setStatusMessage({ type: 'error', text: 'Şekli tamamlamak için başladığın ilk noktaya dokunup lastiği bağla!' });
      if (soundEnabled) playTone(240, 0.18, 'sawtooth', 0, 0.25);
      return;
    }

    const isMatch = 
      currentMission.targetType === 'herhangi' ||
      (currentMission.targetType === 'kare' && analysis.type === 'kare') ||
      (currentMission.targetType === 'dikdortgen' && (analysis.type === 'dikdortgen' || analysis.type === 'kare')) ||
      (currentMission.targetType === 'ucgen' && analysis.type === 'ucgen') ||
      (currentMission.targetType === 'cokgen' && (analysis.type === 'cokgen' || analysis.corners >= 5));

    if (isMatch) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (soundEnabled) {
        playTone(523.25, 0.1, 'sine', 0, 0.3);
        playTone(659.25, 0.1, 'sine', 0.1, 0.3);
        playTone(783.99, 0.2, 'sine', 0.2, 0.3);
      }
      if (playMp3) playMp3('correct');

      setScore(s => s + 100 + streak * 20);
      setStreak(st => st + 1);
      setCompletedMissions(prev => Array.from(new Set([...prev, currentMission.id])));
      setStatusMessage({
        type: 'success',
        text: `Harika! Kusursuz bir ${analysis.name} çizdin! (${analysis.desc})`
      });

      // 1.8 sn sonra sonraki göreve geç
      setTimeout(() => {
        if (missionIndex < activeMissions.length - 1) {
          setMissionIndex(m => m + 1);
        } else {
          setIsGameCompleted(true);
        }
      }, 1800);
    } else {
      setStreak(0);
      setStatusMessage({
        type: 'error',
        text: `Çizdiğin şekil: ${analysis.name} (${analysis.desc}). Görev ise bir ${currentMission.title} çizmekti. Tekrar dene veya İpucu al!`
      });
      if (soundEnabled) playTone(200, 0.25, 'sawtooth', 0, 0.3);
      if (playMp3) playMp3('wrong');
    }
  };

  // Temizle
  const handleClear = () => {
    setDrawnPoints([]);
    setHistory([]);
    setStatusMessage(null);
    if (soundEnabled) playTone(300, 0.08, 'sine', 0, 0.2);
  };

  // Geri Al
  const handleUndo = () => {
    if (history.length > 0) {
      const prevPoints = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setDrawnPoints(prevPoints);
    } else {
      setDrawnPoints([]);
    }
    setStatusMessage(null);
    if (soundEnabled) playTone(350, 0.06, 'sine', 0, 0.2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-4 text-white select-none overflow-y-auto">
      {/* ÜST BAŞLIK VE SKOR ÇUBUĞU */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-2 shrink-0 py-1">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent flex items-center gap-1.5">
            📐 Geometri Tahtası
          </span>
          <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
            {grade}. Sınıf
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled 
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'Sesleri Kapat' : 'Sesleri Aç'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center gap-1 text-xs font-black text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>{score} Puan</span>
          </div>
        </div>
      </div>

      {/* GÖREV VE TALİMAT KARTI */}
      <div className="relative z-20 w-full max-w-md my-1 sm:my-2 p-3 rounded-2xl bg-gradient-to-r from-[#121c2e] via-[#1b2b48] to-[#121c2e] border-2 border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.3)] border-l-4 border-l-amber-400 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{currentMission.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>GÖREV {missionIndex + 1}/{activeMissions.length}</span>
                {completedMissions.includes(currentMission.id) && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                {currentMission.title}
              </h2>
            </div>
          </div>

          {/* SESLİ İKONUNUN YERİNE X İLE KAPATMA BUTONU */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/40 text-rose-300 hover:text-white font-bold transition-all active:scale-95 shadow-md flex items-center justify-center shrink-0 cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-200 font-medium">
          {currentMission.instruction}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-semibold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-400/20">
          <span>💡</span>
          <span>Noktaya kadar sürükleyip parmağını kaldır veya noktalara dokunarak çiz!</span>
        </div>

        {/* Canlı Şekil Tanıma Rozeti */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Şu anki şekil:</span>
            <span className={`px-2 py-0.5 rounded-md font-extrabold ${
              analysis.type !== 'gecersiz' 
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {analysis.name}
            </span>
          </div>
          <span className="text-amber-300/90">{analysis.desc}</span>
        </div>
      </div>

      {/* NOKTALI TAHTA VE LASTİK BANT ÇİZİM ALANI */}
      <div className="relative w-full flex items-center justify-center my-auto p-1">
        <div
          ref={boardRef}
          className="relative w-full aspect-square max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] bg-gradient-to-br from-[#2a1b12] via-[#1c120c] to-[#120b08] rounded-3xl border-4 border-amber-700/60 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)] p-4 select-none touch-none overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {/* Tahta Dokusu & Izgara Çizgileri */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* SVG Filtresi (Glow & 3D Rubber Band) */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="rubberGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* SVG Lastik Bantlar / Çizilen Kenarlar */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* İpucu Hayalet Çizgiler (Ghost Hint) */}
            {showGhostHint && currentMission.sampleGhostPoints.map((pt, i) => {
              if (i === 0) return null;
              const p1 = getPegPositionPercent(currentMission.sampleGhostPoints[i - 1].x, currentMission.sampleGhostPoints[i - 1].y);
              const p2 = getPegPositionPercent(pt.x, pt.y);
              return (
                <line
                  key={`hint-${i}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="#fbbf24"
                  strokeWidth="6"
                  strokeDasharray="6,6"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              );
            })}

            {/* Çizilen Sabit Lastik Bant Kenarları */}
            {drawnPoints.map((pt, i) => {
              if (i === 0) return null;
              const p1 = getPegPositionPercent(drawnPoints[i - 1].x, drawnPoints[i - 1].y);
              const p2 = getPegPositionPercent(pt.x, pt.y);
              return (
                <g key={`drawn-${i}`}>
                  {/* Dış Işıltı Katmanı */}
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={selectedColor.hex}
                    strokeWidth="18"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                  {/* Ana Lastik Gövdesi */}
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={selectedColor.hex}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#rubberGlow)"
                  />
                  {/* 3D Işık Parlaması */}
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeOpacity="0.8"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Sürükleme Esnasındaki Dinamik Lastik Çizgisi */}
            {isDragging && !isClosed && drawnPoints.length > 0 && dragCurrentCoord && boardRef.current && (() => {
              const last = drawnPoints[drawnPoints.length - 1];
              const p1 = getPegPositionPercent(last.x, last.y);
              const rect = boardRef.current.getBoundingClientRect();

              // Eğer hoveredPeg varsa ve son noktadan farklıysa lastik ucu o noktaya manyetik yapışır
              const p2 = hoveredPeg && (hoveredPeg.x !== last.x || hoveredPeg.y !== last.y)
                ? getPegPositionPercent(hoveredPeg.x, hoveredPeg.y)
                : {
                    x: (dragCurrentCoord.x / rect.width) * 100,
                    y: (dragCurrentCoord.y / rect.height) * 100
                  };

              return (
                <g>
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={selectedColor.hex}
                    strokeWidth="16"
                    strokeOpacity="0.35"
                    strokeLinecap="round"
                  />
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={selectedColor.hex}
                    strokeWidth="11"
                    strokeLinecap="round"
                    filter="url(#rubberGlow)"
                  />
                  <line
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                    strokeOpacity="0.85"
                  />
                </g>
              );
            })()}
          </svg>

          {/* 5x5 Noktalar / Metalik Pinler */}
          {Array.from({ length: GRID_SIZE }).map((_, gy) =>
            Array.from({ length: GRID_SIZE }).map((_, gx) => {
              const pos = getPegPositionPercent(gx, gy);
              const isSelected = drawnPoints.some(p => p.x === gx && p.y === gy);
              const isFirst = drawnPoints.length > 0 && drawnPoints[0].x === gx && drawnPoints[0].y === gy;
              const isLast = drawnPoints.length > 0 && drawnPoints[drawnPoints.length - 1].x === gx && drawnPoints[drawnPoints.length - 1].y === gy;
              const isHovered = isDragging && hoveredPeg && hoveredPeg.x === gx && hoveredPeg.y === gy;
              const canCloseHover = isHovered && isFirst && drawnPoints.length >= 3;

              return (
                <div
                  key={`${gx}-${gy}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 z-20 pointer-events-none`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* İlk noktayı kapatma yönlendiricisi */}
                    {isFirst && !isClosed && drawnPoints.length >= 3 && (
                      <span className={`absolute -top-5 text-[9px] font-black ${
                        canCloseHover ? 'bg-cyan-400 text-slate-950 scale-110' : 'bg-emerald-500 text-white'
                      } px-1.5 py-0.5 rounded shadow-md animate-bounce pointer-events-none whitespace-nowrap z-30 transition-transform`}>
                        KAPAT
                      </span>
                    )}

                    {/* Dış Pin Gövdesi */}
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center transition-all duration-150 ${
                        canCloseHover
                          ? 'bg-emerald-300 ring-4 ring-emerald-400 shadow-[0_0_16px_rgba(52,211,153,1)] scale-130 animate-pulse'
                          : isHovered && !isLast
                          ? 'bg-amber-200 ring-4 ring-cyan-400 shadow-[0_0_16px_rgba(34,211,238,1)] scale-130 animate-pulse'
                          : isSelected 
                          ? 'bg-white ring-4 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-110' 
                          : 'bg-gradient-to-br from-amber-300 via-amber-600 to-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                      }`}
                    >
                      {/* İç Metalik Çekirdek */}
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          canCloseHover ? 'bg-emerald-700' : isHovered ? 'bg-cyan-700' : isSelected ? 'bg-amber-600' : 'bg-slate-950/80'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* GERİ BİLDİRİM VE DURUM MESAJI */}
      {statusMessage && (
        <div className={`w-full max-w-md px-3 py-1.5 rounded-xl text-center text-xs font-bold shrink-0 animate-in fade-in slide-in-from-bottom-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
            : statusMessage.type === 'error'
            ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
            : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* ALT KONTROL PANELİ (Renk Paleti, İpucu, Geri Al, Temizle, Kontrol Et) */}
      <div className="w-full max-w-md flex flex-col gap-2 shrink-0 py-1">
        {/* Renk Seçimi ve İpucu Butonu */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-300">Lastik:</span>
            <div className="flex items-center gap-1">
              {COLOR_PALETTE.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColorIndex(idx)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform ${
                    selectedColorIndex === idx 
                      ? 'ring-2 ring-white scale-125 shadow-lg' 
                      : 'opacity-70 hover:opacity-100 hover:scale-110'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowGhostHint(!showGhostHint)}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
              showGhostHint 
                ? 'bg-amber-400 text-slate-950 border-white' 
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-amber-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showGhostHint ? 'İpucunu Gizle' : 'İpucu Gör'}</span>
          </button>
        </div>

        {/* Aksiyon Butonları (Geri Al, Temizle, Kontrol Et) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleUndo}
            disabled={drawnPoints.length === 0}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none border border-white/20 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>Geri Al</span>
          </button>

          <button
            onClick={handleClear}
            disabled={drawnPoints.length === 0}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none border border-white/20 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Temizle</span>
          </button>

          <button
            onClick={handleVerify}
            className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border border-emerald-300/40 text-xs sm:text-sm font-black text-white shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Kontrol Et</span>
          </button>
        </div>
      </div>

      {/* TÜM GÖREVLER BİTTİĞİNDE TEBRİK MODALI */}
      {isGameCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 to-orange-600/20 border-2 border-amber-400/50 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-4">
            <span className="text-6xl animate-bounce">🏆</span>
            <h2 className="text-2xl font-black text-amber-300">
              Tebrikler Şekil Ustası!
            </h2>
            <p className="text-sm text-slate-200">
              Geometri tahtasındaki tüm görevleri başarıyla tamamladın ve <b>{score}</b> puan kazandın!
            </p>
            <div className="flex gap-2 w-full pt-2">
              <button
                onClick={() => {
                  setIsGameCompleted(false);
                  setMissionIndex(0);
                  setDrawnPoints([]);
                  setScore(0);
                }}
                className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-transform active:scale-95"
              >
                Yeniden Oyna
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-transform active:scale-95"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Volume2, VolumeX, Trophy, Heart, Flame, RotateCcw, Home, BarChart2,
  ChevronDown, ChevronRight, Play, Sparkles, X, Trash2, ArrowLeft, Grid, Check, Image, Plus,
  Award, Lock, ShieldCheck, Medal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionData, StatRecord, PlayerData, GroupStatsRecord } from './types';
import { BADGES, BadgeItem, getBadgeRepeatCount } from './badges';
import { AslanSVG } from './components/Mascot';
import { Geometry3DLab } from './components/Geometry3DLab';
import { XOXGame } from './components/XOXGame';
import { OtherGamesHub } from './components/OtherGamesHub';
import { WordGameModal } from './components/WordGameModal';
import { GlossyRoundButton, GlossyPillButton, GlossyCompleteCard, GlossyArrowIcon, GlossyScreenRotateIcon, GoldCoinDisplayCard } from './components/GameUIButtons';
import { ModernStatsView, Cute3DStarMascotSVG } from './components/ModernStatsView';
import { ChromaKeyVideo } from './components/ChromaKeyVideo';
import { topics1stGrade } from './data/topics1stGrade';
import { topics2ndGrade } from './data/topics2ndGrade';
import { topics3rdGrade } from './data/topics3rdGrade';
import { topics4thGrade } from './data/topics4thGrade';

// --- SVG & IMAGE DATA & HELPERS ---
const SINIF_OGRENCILERI = [
  "AYBÜKE", "BETÜL SARE", "BUĞLEM", "ÇINAR EYMEN", "DERİN DEFNE", "EFEKAN",
  "ELİF SU", "ESLEM", "EYMEN", "GÜNEŞ", "HARUN", "MİRAÇ", "MUHAMMED EYMEN",
  "OSMAN EMİR", "ÖMER ASAF", "ÖMER FARUK", "RAVZA", "SUDEM", "UMUT", "ZEYNEP",
  "ZİLAN", "ÖYKÜ LİYA", "HARUN ALİ"
];

function toTitleCaseTR(str: string): string {
  return str
    .split(' ')
    .map(word => {
      if (!word) return '';
      const lower = word.toLocaleLowerCase('tr-TR');
      return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
    })
    .join(' ');
}

function getRastgeleOgrenci(): string {
  const raw = SINIF_OGRENCILERI[Math.floor(Math.random() * SINIF_OGRENCILERI.length)];
  return toTitleCaseTR(raw);
}

const CISIM_SVG: Record<string, string> = {
  kup: '<img src="/geos/kups.png" alt="Küp" class="w-full h-full object-contain filter drop-shadow-md" />',
  kure: '<img src="/geos/kures.png" alt="Küre" class="w-full h-full object-contain filter drop-shadow-md" />',
  silindir: '<img src="/geos/slndrs.png" alt="Silindir" class="w-full h-full object-contain filter drop-shadow-md" />',
  dikdortgen_prizma: '<img src="/geos/dikdprz.png" alt="Dikdörtgenler Prizması" class="w-full h-full object-contain filter drop-shadow-md" />',
  kare_prizma: '<img src="/geos/kareprz.png" alt="Kare Prizma" class="w-full h-full object-contain filter drop-shadow-md" />',
  ucgen_prizma: '<img src="/geos/ucgenprz.png" alt="Üçgen Prizma" class="w-full h-full object-contain filter drop-shadow-md" />'
};

const CISIM_OZELLIK: Record<string, { ad: string; yüz: number; ayrıt: number; köşe: number }> = {
  kup: { ad: 'Küp', yüz: 6, ayrıt: 12, köşe: 8 },
  kure: { ad: 'Küre', yüz: 1, ayrıt: 0, köşe: 0 },
  silindir: { ad: 'Silindir', yüz: 3, ayrıt: 0, köşe: 0 },
  dikdortgen_prizma: { ad: 'Dikdörtgenler Prizması', yüz: 6, ayrıt: 12, köşe: 8 },
  kare_prizma: { ad: 'Kare Prizma', yüz: 6, ayrıt: 12, köşe: 8 },
  ucgen_prizma: { ad: 'Üçgen Prizma', yüz: 5, ayrıt: 9, köşe: 6 }
};

function getCisimTamlayan(ad: string): string {
  switch (ad) {
    case 'Küp': return "Küp'ün";
    case 'Küre': return "Kürenin";
    case 'Silindir': return "Silindirin";
    case 'Dikdörtgenler Prizması': return "Dikdörtgenler Prizmasının";
    case 'Kare Prizma': return "Kare Prizmasının";
    case 'Üçgen Prizma': return "Üçgen Prizmanın";
    default: return `${ad}'nin`;
  }
}

function getIsimTamlayan(isim: string): string {
  const clean = toTitleCaseTR(isim.trim());
  if (!clean) return isim;

  // "Su" istisnası (ör. Elif Su -> Elif Su'yun)
  if (clean.endsWith("Su")) {
    return `${clean}'yun`;
  }

  const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
  const lastChar = clean.slice(-1).toLowerCase();
  const isVowel = vowels.includes(lastChar);

  let lastVowel = 'i';
  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i].toLowerCase();
    if (vowels.includes(char)) {
      lastVowel = char;
      break;
    }
  }

  let suffix = '';
  if (['a', 'ı'].includes(lastVowel)) suffix = isVowel ? 'nın' : 'ın';
  else if (['e', 'i'].includes(lastVowel)) suffix = isVowel ? 'nin' : 'in';
  else if (['o', 'u'].includes(lastVowel)) suffix = isVowel ? 'nun' : 'un';
  else if (['ö', 'ü'].includes(lastVowel)) suffix = isVowel ? 'nün' : 'ün';

  return `${clean}'${suffix}`;
}

// Cins isimlerde kesme işareti KULLANILMAZ ve ünsüz yumuşaması/ses uyumları uygulanır
function getNesneBelirtme(nesne: string): string {
  const dict: Record<string, string> = {
    "kitap": "kitabı",
    "oyuncak": "oyuncağı",
    "kalem": "kalemi",
    "defter": "defteri",
    "top": "topu",
    "şapka": "şapkayı",
    "çanta": "çantayı",
    "kalemlik": "kalemliği",
    "silgi": "silgiyi",
    "elma": "elmayı",
    "karpuz": "karpuzu",
    "domates": "domatesi",
    "pizza": "pizzayı",
    "waffle": "waffle'ı",
    "biber": "biberi",
    "portakal": "portakalı",
    "kivi": "kiviyi",
    "armut": "armudu",
    "çilek": "çileği",
    "cilek": "çileği",
    "muz": "muzu",
    "limon": "limonu",
    "üzüm": "üzümü",
    "uzum": "üzümü",
    "şeftali": "şeftaliyi",
    "seftali": "şeftaliyi",
    "ananas": "ananası",
    "kiraz": "kirazı",
    "kavun": "kavunu",
    "mandalina": "mandalinayı",
    "erik": "eriği",
    "kurabiye": "kurabiyeyi",
    "donut": "donutu",
    "ceviz": "cevizi",
    "fındık": "fındığı",
    "bilye": "bilyeyi",
    "balon": "balonu",
    "çıkartma": "çıkartmayı",
    "ekmek": "ekmeği",
    "pasta": "pastayı"
  };
  const key = nesne.toLowerCase().trim();
  if (dict[key]) return dict[key];

  const clean = nesne.trim();
  const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
  const lastChar = clean.slice(-1).toLowerCase();
  const isVowel = vowels.includes(lastChar);

  let stem = clean;
  if (!isVowel) {
    if (stem.endsWith('k') || stem.endsWith('K')) stem = stem.slice(0, -1) + 'ğ';
    else if (stem.endsWith('p') || stem.endsWith('P')) stem = stem.slice(0, -1) + 'b';
    else if (stem.endsWith('ç') || stem.endsWith('Ç')) stem = stem.slice(0, -1) + 'c';
    else if (stem.endsWith('t') || stem.endsWith('T')) stem = stem.slice(0, -1) + 'd';
  }

  let lastVowel = 'i';
  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i].toLowerCase();
    if (vowels.includes(char)) {
      lastVowel = char;
      break;
    }
  }

  let suffix = '';
  if (['a', 'ı'].includes(lastVowel)) suffix = isVowel ? 'yı' : 'ı';
  else if (['e', 'i'].includes(lastVowel)) suffix = isVowel ? 'yi' : 'i';
  else if (['o', 'u'].includes(lastVowel)) suffix = isVowel ? 'yu' : 'u';
  else if (['ö', 'ü'].includes(lastVowel)) suffix = isVowel ? 'yü' : 'ü';

  return stem + suffix;
}

function getNesneAyrilma(nesne: string): string {
  const dict: Record<string, string> = {
    "kitap": "kitaptan",
    "oyuncak": "oyuncaktan",
    "kalem": "kalemden",
    "defter": "defterden",
    "top": "toptan",
    "şapka": "şapkadan",
    "çanta": "çantadan",
    "kalemlik": "kalemlikten",
    "silgi": "silgiden",
    "elma": "elmadan",
    "karpuz": "karpuzdan",
    "domates": "domatesten",
    "pizza": "pizzadan",
    "waffle": "waffle'dan",
    "biber": "biberden",
    "portakal": "portakaldan",
    "kivi": "kividen",
    "armut": "armuttan",
    "çilek": "çilekten",
    "cilek": "çilekten",
    "muz": "muzdan",
    "limon": "limondan",
    "üzüm": "üzümden",
    "uzum": "üzümden",
    "şeftali": "şeftaliden",
    "seftali": "şeftaliden",
    "ananas": "ananasdan",
    "kiraz": "kirazdan",
    "kavun": "kavundan",
    "mandalina": "mandalinadan",
    "erik": "erikten",
    "kurabiye": "kurabiyeden",
    "donut": "donuttan",
    "ceviz": "cevizden",
    "fındık": "fındıktan",
    "bilye": "bilyeden",
    "balon": "balondan",
    "çıkartma": "çıkartmadan"
  };
  const key = nesne.toLowerCase().trim();
  if (dict[key]) return dict[key];

  const clean = nesne.trim();
  const fistikci = ['f', 's', 't', 'k', 'ç', 'ş', 'h', 'p'];
  const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
  const lastChar = clean.slice(-1).toLowerCase();

  let lastVowel = 'i';
  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i].toLowerCase();
    if (vowels.includes(char)) {
      lastVowel = char;
      break;
    }
  }

  const startChar = fistikci.includes(lastChar) ? 't' : 'd';
  const endChar = ['a', 'ı', 'o', 'u'].includes(lastVowel) ? 'an' : 'en';

  return clean + startChar + endChar;
}

function getNesneYonelme(nesne: string): string {
  const dict: Record<string, string> = {
    "kitap": "kitaba",
    "oyuncak": "oyuncağa",
    "kalem": "kaleme",
    "defter": "deftere",
    "top": "topa",
    "şapka": "şapkaya",
    "çanta": "çantaya",
    "kalemlik": "kalemliğe",
    "silgi": "silgiye",
    "elma": "elmaya",
    "karpuz": "karpuza",
    "domates": "domatese",
    "pizza": "pizzaya",
    "waffle": "waffle'a",
    "biber": "bibere",
    "portakal": "portakala",
    "kivi": "kiviye",
    "armut": "armuda",
    "çilek": "çileğe",
    "cilek": "çileğe",
    "muz": "muza",
    "limon": "limona",
    "üzüm": "üzüme",
    "uzum": "üzüme",
    "şeftali": "şeftaliye",
    "seftali": "şeftaliye",
    "ananas": "ananasa",
    "kiraz": "kiraza",
    "kavun": "kavuna",
    "mandalina": "mandalinaya",
    "erik": "eriğe",
    "kurabiye": "kurabiyeye",
    "donut": "donuta",
    "ceviz": "cevize",
    "fındık": "fındığa",
    "bilye": "bilyeye",
    "balon": "balona"
  };
  const key = nesne.toLowerCase().trim();
  if (dict[key]) return dict[key];

  const clean = nesne.trim();
  const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
  const lastChar = clean.slice(-1).toLowerCase();
  const isVowel = vowels.includes(lastChar);

  let stem = clean;
  if (!isVowel) {
    if (stem.endsWith('k') || stem.endsWith('K')) stem = stem.slice(0, -1) + 'ğ';
    else if (stem.endsWith('p') || stem.endsWith('P')) stem = stem.slice(0, -1) + 'b';
    else if (stem.endsWith('ç') || stem.endsWith('Ç')) stem = stem.slice(0, -1) + 'c';
    else if (stem.endsWith('t') || stem.endsWith('T')) stem = stem.slice(0, -1) + 'd';
  }

  let lastVowel = 'i';
  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i].toLowerCase();
    if (vowels.includes(char)) {
      lastVowel = char;
      break;
    }
  }

  const suffix = ['a', 'ı', 'o', 'u'].includes(lastVowel) ? (isVowel ? 'ya' : 'a') : (isVowel ? 'ye' : 'e');
  return stem + suffix;
}

function getNesneIyelik(nesne: string): string {
  const dict: Record<string, string> = {
    "bilye": "bilyesi",
    "fındık": "fındığı",
    "kalem": "kalemi",
    "çıkartma": "çıkartması",
    "balon": "balonu",
    "elma": "elması",
    "karpuz": "karpuzu",
    "domates": "domatesi",
    "pizza": "pizzası",
    "waffle": "waffle'ı",
    "biber": "biberi",
    "portakal": "portakalı",
    "kivi": "kivisi",
    "armut": "armudu",
    "çilek": "çileği",
    "cilek": "çileği",
    "muz": "muzu",
    "limon": "limonu",
    "üzüm": "üzümü",
    "uzum": "üzümü",
    "şeftali": "şeftalisi",
    "seftali": "şeftalisi",
    "ananas": "ananası",
    "kiraz": "kirazı",
    "kavun": "kavunu",
    "mandalina": "mandalinası",
    "erik": "eriği",
    "kurabiye": "kurabiyesi",
    "donut": "donutu",
    "ceviz": "cevizi",
    "oyuncak": "oyuncağı",
    "top": "topu",
    "kitap": "kitabı",
    "silgi": "silgisi",
    "kalemlik": "kalemliği"
  };
  const key = nesne.toLowerCase().trim();
  if (dict[key]) return dict[key];

  const clean = nesne.trim();
  const vowels = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü'];
  const lastChar = clean.slice(-1).toLowerCase();
  const isVowel = vowels.includes(lastChar);

  let stem = clean;
  if (stem.endsWith('k') || stem.endsWith('K')) {
    stem = stem.slice(0, -1) + 'ğ';
  } else if (stem.endsWith('p') || stem.endsWith('P')) {
    stem = stem.slice(0, -1) + 'b';
  } else if (stem.endsWith('ç') || stem.endsWith('Ç')) {
    stem = stem.slice(0, -1) + 'c';
  } else if (stem.endsWith('t') || stem.endsWith('T')) {
    stem = stem.slice(0, -1) + 'd';
  }

  let lastVowel = 'i';
  for (let i = clean.length - 1; i >= 0; i--) {
    const char = clean[i].toLowerCase();
    if (vowels.includes(char)) {
      lastVowel = char;
      break;
    }
  }

  let suffix = '';
  if (['a', 'ı'].includes(lastVowel)) suffix = isVowel ? 'sı' : 'ı';
  else if (['e', 'i'].includes(lastVowel)) suffix = isVowel ? 'si' : 'i';
  else if (['o', 'u'].includes(lastVowel)) suffix = isVowel ? 'su' : 'u';
  else if (['ö', 'ü'].includes(lastVowel)) suffix = isVowel ? 'sü' : 'ü';

  return stem + suffix;
}

const OZELLIK_EK: Record<string, { buyuk: string; kucuk: string }> = {
  yüz: { buyuk: 'YÜZÜ', kucuk: 'yüzü' },
  ayrıt: { buyuk: 'AYRITI', kucuk: 'ayrıtı' },
  köşe: { buyuk: 'KÖŞESİ', kucuk: 'köşesi' }
};

function generateClockSVG(hour: number, minute: number): string {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const hRad = (hourAngle - 90) * (Math.PI / 180);
  const mRad = (minuteAngle - 90) * (Math.PI / 180);

  const hX = 50 + 22 * Math.cos(hRad);
  const hY = 50 + 22 * Math.sin(hRad);

  const mX = 50 + 32 * Math.cos(mRad);
  const mY = 50 + 32 * Math.sin(mRad);

  let numbersHTML = '';
  for (let h = 1; h <= 12; h++) {
    const angleRad = (h * 30 - 90) * (Math.PI / 180);
    const nx = 50 + 36 * Math.cos(angleRad);
    const ny = 50 + 36 * Math.sin(angleRad);
    numbersHTML += `<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="7.5" font-weight="900" fill="#1E293B">${h}</text>`;
  }

  let ticksHTML = '';
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue;
    const angleRad = (m * 6 - 90) * (Math.PI / 180);
    const x1 = 50 + 44 * Math.cos(angleRad);
    const y1 = 50 + 44 * Math.sin(angleRad);
    const x2 = 50 + 46 * Math.cos(angleRad);
    const y2 = 50 + 46 * Math.sin(angleRad);
    ticksHTML += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#94A3B8" stroke-width="0.8" />`;
  }

  return `
    <svg viewBox="0 0 100 100" class="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 drop-shadow-md mx-auto">
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
      <circle cx="50" cy="50" r="44" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      ${ticksHTML}
      ${numbersHTML}
      <!-- Akrep (Hour Hand - Red) -->
      <line x1="50" y1="50" x2="${hX.toFixed(1)}" y2="${hY.toFixed(1)}" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round" />
      <!-- Yelkovan (Minute Hand - Blue) -->
      <line x1="50" y1="50" x2="${mX.toFixed(1)}" y2="${mY.toFixed(1)}" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="50" cy="50" r="3" fill="#1E293B" stroke="#FFFFFF" stroke-width="1" />
      <circle cx="50" cy="50" r="1.2" fill="#F59E0B" />
    </svg>
  `;
}

function benzersizYanlislar(correct: number, adaylar: number[], minVal = 0): number[] {
  const sonuc: number[] = [];
  const gorulen = new Set<number>([correct]);
  for (const aday of adaylar) {
    if (sonuc.length === 3) break;
    if (!gorulen.has(aday) && aday >= minVal) {
      gorulen.add(aday);
      sonuc.push(aday);
    }
  }
  let ek = 1;
  while (sonuc.length < 3) {
    const aday = correct + 10 + ek;
    if (!gorulen.has(aday) && aday >= minVal) {
      gorulen.add(aday);
      sonuc.push(aday);
    }
    ek++;
  }
  return sonuc;
}

const MEYVE_KESIR_LISTESI = [
  { key: 'elma', ad: 'elma' },
  { key: 'karpuz', ad: 'karpuz' },
  { key: 'portakal', ad: 'portakal' },
  { key: 'armut', ad: 'armut' },
  { key: 'kivi', ad: 'kivi' },
  { key: 'cilek', ad: 'çilek' },
  { key: 'muz', ad: 'muz' },
  { key: 'limon', ad: 'limon' },
  { key: 'uzum', ad: 'üzüm' },
  { key: 'seftali', ad: 'şeftali' },
  { key: 'ananas', ad: 'ananas' },
  { key: 'kiraz', ad: 'kiraz' },
  { key: 'kavun', ad: 'kavun' },
  { key: 'mandalina', ad: 'mandalina' },
  { key: 'erik', ad: 'erik' },
  { key: 'pizza', ad: 'pizza' },
  { key: 'kurabiye', ad: 'kurabiye' },
  { key: 'donut', ad: 'donut' },
  { key: 'waffle', ad: 'waffle' },
  { key: 'domates', ad: 'domates' },
  { key: 'biber', ad: 'biber' }
];

function benzersizYanlislarString(correctStr: string, adaylar: string[]): string[] {
  const sonuc: string[] = [];
  const gorulen = new Set<string>([correctStr]);
  for (const aday of adaylar) {
    if (sonuc.length === 3) break;
    if (aday && !gorulen.has(aday)) {
      gorulen.add(aday);
      sonuc.push(aday);
    }
  }
  let fallbackCount = 1;
  while (sonuc.length < 3) {
    const fallback = `${fallbackCount} Bütün`;
    if (!gorulen.has(fallback)) {
      gorulen.add(fallback);
      sonuc.push(fallback);
    }
    fallbackCount++;
  }
  return sonuc;
}

function getMeyveKesirSVG(key: string, durum: 'bütün' | 'yarım' | 'çeyrek', size = 80): string {
  const s = size;
  const wrap = (content: string) => `
    <svg width="${s}" height="${s}" viewBox="0 0 100 100" class="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform inline-block" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `;

  switch (key) {
    case 'elma':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 50 22 C 40 10, 18 15, 18 45 C 18 78, 42 90, 50 88 C 58 90, 82 78, 82 45 C 82 15, 60 10, 50 22 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 22 Q 52 10 58 6" stroke="#5a3825" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M 56 10 Q 70 8 68 18 Q 58 18 56 10 Z" fill="#38a169"/>
          <ellipse cx="32" cy="35" rx="5" ry="12" fill="#ffffff" opacity="0.35" transform="rotate(-20 32 35)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 15 C 20 15, 18 50, 20 85 L 50 85 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 17 L 50 83 C 25 83, 23 50, 50 17 Z" fill="#fefcbf" stroke="#e53e3e" stroke-width="1.5"/>
          <ellipse cx="38" cy="45" rx="2" ry="4" fill="#4a2e19" transform="rotate(-15 38 45)"/>
          <ellipse cx="42" cy="55" rx="2" ry="4" fill="#4a2e19" transform="rotate(-10 42 55)"/>
          <path d="M 50 17 Q 52 10 56 7" stroke="#5a3825" stroke-width="3" fill="none"/>
        `);
      } else {
        return wrap(`
          <path d="M 50 20 C 35 25, 25 45, 30 75 L 50 75 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 22 L 50 73 L 34 73 C 30 50, 38 32, 50 22 Z" fill="#fefcbf" stroke="#e53e3e" stroke-width="1.5"/>
          <ellipse cx="42" cy="50" rx="2" ry="3.5" fill="#4a2e19" transform="rotate(-15 42 50)"/>
        `);
      }

    case 'karpuz':
      if (durum === 'bütün') {
        return wrap(`
          <ellipse cx="50" cy="50" rx="42" ry="38" fill="#276749" stroke="#1c4532" stroke-width="2"/>
          <path d="M 20 20 Q 25 50 20 80" stroke="#1c4532" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 38 14 Q 42 50 38 86" stroke="#1c4532" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 62 14 Q 58 50 62 86" stroke="#1c4532" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 80 20 Q 75 50 80 80" stroke="#1c4532" stroke-width="5" fill="none" stroke-linecap="round"/>
          <ellipse cx="32" cy="32" rx="4" ry="10" fill="#ffffff" opacity="0.25" transform="rotate(-25 32 32)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#276749" stroke="#1c4532" stroke-width="2"/>
          <path d="M 15 50 A 35 35 0 0 0 85 50 Z" fill="#f0fff4"/>
          <path d="M 18 50 A 32 32 0 0 0 82 50 Z" fill="#e53e3e"/>
          <ellipse cx="32" cy="62" rx="2" ry="3.5" fill="#1a202c" transform="rotate(-15 32 62)"/>
          <ellipse cx="45" cy="70" rx="2" ry="3.5" fill="#1a202c" transform="rotate(-5 45 70)"/>
          <ellipse cx="58" cy="70" rx="2" ry="3.5" fill="#1a202c" transform="rotate(5 58 70)"/>
          <ellipse cx="70" cy="62" rx="2" ry="3.5" fill="#1a202c" transform="rotate(15 70 62)"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#276749"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#f0fff4"/>
          <path d="M 27 73 L 73 73 A 46 46 0 0 0 27 27 Z" fill="#e53e3e"/>
          <ellipse cx="42" cy="55" rx="2" ry="3.5" fill="#1a202c" transform="rotate(-25 42 55)"/>
          <ellipse cx="55" cy="65" rx="2" ry="3.5" fill="#1a202c" transform="rotate(10 55 65)"/>
        `);
      }

    case 'portakal':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="52" r="38" fill="#ed8936" stroke="#c05621" stroke-width="2"/>
          <path d="M 50 14 Q 52 8 58 4" stroke="#5a3825" stroke-width="3" fill="none"/>
          <path d="M 56 8 Q 70 6 66 16 Q 56 16 56 8 Z" fill="#38a169"/>
          <circle cx="35" cy="38" r="1.5" fill="#c05621"/>
          <circle cx="65" cy="42" r="1.5" fill="#c05621"/>
          <circle cx="48" cy="68" r="1.5" fill="#c05621"/>
          <ellipse cx="36" cy="36" rx="4" ry="9" fill="#ffffff" opacity="0.3" transform="rotate(-20 36 36)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#fbd38d"/>
          <circle cx="50" cy="50" r="31" fill="#ed8936"/>
          <circle cx="50" cy="50" r="4" fill="#fbd38d"/>
          <line x1="50" y1="19" x2="50" y2="81" stroke="#fbd38d" stroke-width="2"/>
          <line x1="19" y1="50" x2="81" y2="50" stroke="#fbd38d" stroke-width="2"/>
          <line x1="28" y1="28" x2="72" y2="72" stroke="#fbd38d" stroke-width="2"/>
          <line x1="28" y1="72" x2="72" y2="28" stroke="#fbd38d" stroke-width="2"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#dd6b20"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#fbd38d"/>
          <path d="M 27 73 L 73 73 A 46 46 0 0 0 27 27 Z" fill="#ed8936"/>
          <line x1="27" y1="73" x2="62" y2="38" stroke="#fbd38d" stroke-width="2"/>
        `);
      }

    case 'kivi':
      if (durum === 'bütün') {
        return wrap(`
          <ellipse cx="50" cy="50" rx="42" ry="32" fill="#744210" stroke="#4a2e19" stroke-width="2"/>
          <ellipse cx="50" cy="50" rx="40" ry="30" fill="#975a16" opacity="0.6"/>
          <circle cx="30" cy="40" r="1" fill="#4a2e19"/>
          <circle cx="65" cy="55" r="1" fill="#4a2e19"/>
          <circle cx="45" cy="62" r="1" fill="#4a2e19"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#744210" stroke="#4a2e19" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#48bb78"/>
          <ellipse cx="50" cy="50" rx="10" ry="14" fill="#fefcbf"/>
          <circle cx="50" cy="32" r="1.5" fill="#1a202c"/>
          <circle cx="63" cy="37" r="1.5" fill="#1a202c"/>
          <circle cx="68" cy="50" r="1.5" fill="#1a202c"/>
          <circle cx="63" cy="63" r="1.5" fill="#1a202c"/>
          <circle cx="50" cy="68" r="1.5" fill="#1a202c"/>
          <circle cx="37" cy="63" r="1.5" fill="#1a202c"/>
          <circle cx="32" cy="50" r="1.5" fill="#1a202c"/>
          <circle cx="37" cy="37" r="1.5" fill="#1a202c"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#744210"/>
          <path d="M 25 75 L 75 75 A 50 50 0 0 0 25 25 Z" fill="#48bb78"/>
          <path d="M 25 75 L 42 75 A 17 17 0 0 0 25 58 Z" fill="#fefcbf"/>
          <circle cx="38" cy="58" r="1.5" fill="#1a202c"/>
          <circle cx="48" cy="65" r="1.5" fill="#1a202c"/>
          <circle cx="32" cy="48" r="1.5" fill="#1a202c"/>
        `);
      }

    case 'armut':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 50 18 C 42 18, 38 32, 28 48 C 18 64, 22 86, 50 86 C 78 86, 82 64, 72 48 C 62 32, 58 18, 50 18 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 50 18 Q 52 10 58 6" stroke="#5a3825" stroke-width="3" fill="none"/>
          <path d="M 56 10 Q 70 8 66 18 Q 56 18 56 10 Z" fill="#38a169"/>
          <ellipse cx="36" cy="58" rx="4" ry="10" fill="#ffffff" opacity="0.3" transform="rotate(-15 36 58)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 18 C 38 18, 22 50, 22 84 L 50 84 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 50 20 L 50 82 C 26 82, 26 50, 48 20 Z" fill="#fefcbf" stroke="#d69e2e" stroke-width="1.5"/>
          <ellipse cx="38" cy="58" rx="2" ry="4" fill="#4a2e19" transform="rotate(-10 38 58)"/>
          <path d="M 50 20 Q 52 12 56 8" stroke="#5a3825" stroke-width="3" fill="none"/>
        `);
      } else {
        return wrap(`
          <path d="M 50 25 C 38 32, 28 55, 30 80 L 50 80 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 50 27 L 50 78 L 34 78 C 32 58, 40 36, 50 27 Z" fill="#fefcbf" stroke="#d69e2e" stroke-width="1.5"/>
          <ellipse cx="42" cy="60" rx="2" ry="3.5" fill="#4a2e19" transform="rotate(-10 42 60)"/>
        `);
      }

    case 'cilek':
    case 'çilek':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 50 25 C 20 25 15 55 35 85 C 45 95 55 95 65 85 C 85 55 80 25 50 25 Z" fill="#e53e3e" stroke="#c53030" stroke-width="2"/>
          <path d="M 50 25 L 42 12 L 50 18 L 58 12 Z" fill="#38a169"/>
          <path d="M 38 25 L 28 15 L 36 22 Z" fill="#38a169"/>
          <path d="M 62 25 L 72 15 L 64 22 Z" fill="#38a169"/>
          <circle cx="35" cy="40" r="1.5" fill="#f6e05e"/>
          <circle cx="50" cy="45" r="1.5" fill="#f6e05e"/>
          <circle cx="65" cy="40" r="1.5" fill="#f6e05e"/>
          <circle cx="40" cy="60" r="1.5" fill="#f6e05e"/>
          <circle cx="60" cy="60" r="1.5" fill="#f6e05e"/>
          <circle cx="50" cy="75" r="1.5" fill="#f6e05e"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 25 C 20 25 15 55 35 85 C 45 95 50 95 50 95 L 50 25 Z" fill="#e53e3e" stroke="#c53030" stroke-width="2"/>
          <path d="M 50 27 L 50 90 C 42 90 22 60 22 30 C 22 27 35 27 50 27 Z" fill="#fff5f5"/>
          <path d="M 50 35 Q 35 50 50 75 Z" fill="#fed7d7"/>
          <circle cx="35" cy="42" r="1.5" fill="#f6e05e"/>
          <circle cx="38" cy="62" r="1.5" fill="#f6e05e"/>
          <path d="M 50 25 L 42 12 L 50 18 Z" fill="#38a169"/>
        `);
      } else {
        return wrap(`
          <path d="M 50 25 C 30 28 20 50 30 80 L 50 80 Z" fill="#e53e3e" stroke="#c53030" stroke-width="2"/>
          <path d="M 50 28 L 50 78 L 33 78 C 26 55 35 32 50 28 Z" fill="#fff5f5"/>
          <circle cx="38" cy="50" r="1.5" fill="#f6e05e"/>
        `);
      }

    case 'muz':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 20 30 Q 30 80 80 70 Q 50 90 15 40 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 80 70 L 86 68" stroke="#744210" stroke-width="4" stroke-linecap="round"/>
          <path d="M 20 30 L 15 22" stroke="#744210" stroke-width="4" stroke-linecap="round"/>
          <path d="M 22 35 Q 32 75 75 68" stroke="#d69e2e" stroke-width="1.5" fill="none"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 20 30 Q 30 75 50 75 L 50 50 Q 25 45 20 30 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 50 50 L 50 75 C 38 75 28 58 20 30 Z" fill="#fefcbf"/>
          <circle cx="42" cy="60" r="2" fill="#744210"/>
        `);
      } else {
        return wrap(`
          <path d="M 25 35 Q 30 65 50 65 L 50 50 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 50 50 L 50 65 C 38 65 30 52 25 35 Z" fill="#fefcbf"/>
        `);
      }

    case 'limon':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 15 50 C 15 25 35 18 50 18 C 65 18 85 25 85 50 C 85 75 65 82 50 82 C 35 82 15 75 15 50 Z" fill="#f6e05e" stroke="#d69e2e" stroke-width="2"/>
          <path d="M 12 50 C 10 45 10 55 12 50 Z" stroke="#d69e2e" stroke-width="3"/>
          <path d="M 88 50 C 90 45 90 55 88 50 Z" stroke="#d69e2e" stroke-width="3"/>
          <ellipse cx="38" cy="38" rx="5" ry="10" fill="#ffffff" opacity="0.3" transform="rotate(-20 38 38)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#fefcbf"/>
          <circle cx="50" cy="50" r="31" fill="#f6e05e"/>
          <circle cx="50" cy="50" r="4" fill="#fefcbf"/>
          <line x1="50" y1="19" x2="50" y2="81" stroke="#fefcbf" stroke-width="2"/>
          <line x1="19" y1="50" x2="81" y2="50" stroke="#fefcbf" stroke-width="2"/>
          <line x1="28" y1="28" x2="72" y2="72" stroke="#fefcbf" stroke-width="2"/>
          <line x1="28" y1="72" x2="72" y2="28" stroke="#fefcbf" stroke-width="2"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#d69e2e"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#fefcbf"/>
          <path d="M 27 73 L 73 73 A 46 46 0 0 0 27 27 Z" fill="#f6e05e"/>
          <line x1="27" y1="73" x2="62" y2="38" stroke="#fefcbf" stroke-width="2"/>
        `);
      }

    case 'uzum':
    case 'üzüm':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 50 20 Q 52 10 58 5" stroke="#5a3825" stroke-width="3" fill="none"/>
          <path d="M 55 8 Q 70 5 65 18 Z" fill="#38a169"/>
          <circle cx="38" cy="35" r="11" fill="#805ad5"/>
          <circle cx="62" cy="35" r="11" fill="#805ad5"/>
          <circle cx="50" cy="32" r="12" fill="#6b46c1"/>
          <circle cx="40" cy="52" r="11" fill="#6b46c1"/>
          <circle cx="60" cy="52" r="11" fill="#6b46c1"/>
          <circle cx="50" cy="55" r="11" fill="#553c9a"/>
          <circle cx="45" cy="70" r="10" fill="#553c9a"/>
          <circle cx="55" cy="70" r="10" fill="#553c9a"/>
          <circle cx="50" cy="83" r="8" fill="#44337a"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 20 Q 52 10 58 5" stroke="#5a3825" stroke-width="3" fill="none"/>
          <circle cx="38" cy="35" r="11" fill="#805ad5"/>
          <circle cx="50" cy="32" r="12" fill="#6b46c1"/>
          <circle cx="40" cy="52" r="11" fill="#6b46c1"/>
          <circle cx="50" cy="55" r="11" fill="#553c9a"/>
          <circle cx="45" cy="70" r="10" fill="#553c9a"/>
          <line x1="50" y1="15" x2="50" y2="85" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 3"/>
        `);
      } else {
        return wrap(`
          <circle cx="40" cy="52" r="11" fill="#6b46c1"/>
          <circle cx="50" cy="55" r="11" fill="#553c9a"/>
          <circle cx="45" cy="70" r="10" fill="#553c9a"/>
        `);
      }

    case 'seftali':
    case 'şeftali':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="52" r="38" fill="#ed8936" stroke="#dd6b20" stroke-width="2"/>
          <path d="M 50 14 C 38 25 38 75 50 88" stroke="#c05621" stroke-width="2.5" fill="none"/>
          <path d="M 50 14 Q 52 8 58 4" stroke="#5a3825" stroke-width="3" fill="none"/>
          <path d="M 56 8 Q 70 6 66 16 Q 56 16 56 8 Z" fill="#38a169"/>
          <ellipse cx="34" cy="38" rx="5" ry="12" fill="#ffffff" opacity="0.3" transform="rotate(-20 34 38)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#feebc8"/>
          <circle cx="50" cy="50" r="28" fill="#fbd38d"/>
          <ellipse cx="50" cy="50" rx="10" ry="14" fill="#744210"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#dd6b20"/>
          <path d="M 25 75 L 75 75 A 50 50 0 0 0 25 25 Z" fill="#fbd38d"/>
          <ellipse cx="40" cy="60" rx="7" ry="10" fill="#744210" transform="rotate(-20 40 60)"/>
        `);
      }

    case 'ananas':
      if (durum === 'bütün') {
        return wrap(`
          <ellipse cx="50" cy="60" rx="32" ry="32" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <!-- Spiky crown -->
          <path d="M 50 30 L 40 5 L 48 20 L 50 0 L 52 20 L 60 5 L 50 30 Z" fill="#2f855a"/>
          <path d="M 42 30 L 30 12 L 40 22 Z" fill="#38a169"/>
          <path d="M 58 30 L 70 12 L 60 22 Z" fill="#38a169"/>
          <!-- Pattern -->
          <path d="M 25 50 L 75 70 M 20 62 L 72 80 M 28 40 L 78 60" stroke="#b7791f" stroke-width="2"/>
          <path d="M 75 50 L 25 70 M 80 62 L 28 80 M 72 40 L 22 60" stroke="#b7791f" stroke-width="2"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 30 C 25 30 20 50 20 85 L 50 85 Z" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <path d="M 50 32 L 50 83 C 25 83 25 50 48 32 Z" fill="#fefcbf"/>
          <line x1="50" y1="32" x2="50" y2="83" stroke="#d69e2e" stroke-width="3"/>
          <path d="M 50 30 L 40 5 L 48 20 L 50 0 Z" fill="#2f855a"/>
        `);
      } else {
        return wrap(`
          <path d="M 50 35 C 32 40 25 60 28 80 L 50 80 Z" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <path d="M 50 38 L 50 78 L 33 78 C 30 60 38 42 50 38 Z" fill="#fefcbf"/>
        `);
      }

    case 'kiraz':
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 50 10 Q 30 25 32 50" stroke="#2f855a" stroke-width="3" fill="none"/>
          <path d="M 50 10 Q 70 25 68 50" stroke="#2f855a" stroke-width="3" fill="none"/>
          <circle cx="50" cy="10" r="3" fill="#2f855a"/>
          <circle cx="30" cy="62" r="18" fill="#9b2c2c" stroke="#742a2a" stroke-width="2"/>
          <circle cx="70" cy="62" r="18" fill="#9b2c2c" stroke="#742a2a" stroke-width="2"/>
          <ellipse cx="24" cy="55" rx="3" ry="6" fill="#ffffff" opacity="0.35" transform="rotate(-20 24 55)"/>
          <ellipse cx="64" cy="55" rx="3" ry="6" fill="#ffffff" opacity="0.35" transform="rotate(-20 64 55)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 10 Q 30 25 32 50" stroke="#2f855a" stroke-width="3" fill="none"/>
          <circle cx="30" cy="62" r="18" fill="#9b2c2c" stroke="#742a2a" stroke-width="2"/>
          <circle cx="30" cy="62" r="14" fill="#e53e3e"/>
          <circle cx="30" cy="62" r="5" fill="#744210"/>
        `);
      } else {
        return wrap(`
          <path d="M 30 80 L 70 80 A 40 40 0 0 0 30 40 Z" fill="#9b2c2c"/>
          <path d="M 33 77 L 67 77 A 34 34 0 0 0 33 43 Z" fill="#e53e3e"/>
          <circle cx="45" cy="68" r="4" fill="#744210"/>
        `);
      }

    case 'kavun':
      if (durum === 'bütün') {
        return wrap(`
          <ellipse cx="50" cy="52" rx="42" ry="34" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <ellipse cx="50" cy="52" rx="39" ry="31" fill="#ecc94b" opacity="0.7"/>
          <path d="M 20 35 Q 50 40 80 35 M 15 52 Q 50 58 85 52 M 20 70 Q 50 75 80 70" stroke="#fefcbf" stroke-width="1.5" stroke-dasharray="4 2" fill="none"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <path d="M 15 50 A 35 35 0 0 0 85 50 Z" fill="#fefcbf"/>
          <path d="M 20 50 A 30 30 0 0 0 80 50 Z" fill="#feebc8"/>
          <ellipse cx="50" cy="60" rx="15" ry="6" fill="#d69e2e"/>
          <circle cx="42" cy="60" r="1.5" fill="#744210"/>
          <circle cx="50" cy="61" r="1.5" fill="#744210"/>
          <circle cx="58" cy="60" r="1.5" fill="#744210"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#d69e2e"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#feebc8"/>
          <circle cx="40" cy="60" r="1.5" fill="#744210"/>
          <circle cx="48" cy="65" r="1.5" fill="#744210"/>
        `);
      }

    case 'mandalina':
      if (durum === 'bütün') {
        return wrap(`
          <ellipse cx="50" cy="54" rx="40" ry="32" fill="#ed8936" stroke="#dd6b20" stroke-width="2"/>
          <path d="M 50 22 Q 52 14 58 8" stroke="#5a3825" stroke-width="3" fill="none"/>
          <path d="M 56 12 Q 70 10 66 20 Q 56 20 56 12 Z" fill="#38a169"/>
          <circle cx="35" cy="42" r="1" fill="#c05621"/>
          <circle cx="65" cy="46" r="1" fill="#c05621"/>
          <circle cx="48" cy="68" r="1" fill="#c05621"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#feebc8"/>
          <circle cx="50" cy="50" r="31" fill="#ed8936"/>
          <circle cx="50" cy="50" r="4" fill="#feebc8"/>
          <line x1="50" y1="19" x2="50" y2="81" stroke="#feebc8" stroke-width="2"/>
          <line x1="19" y1="50" x2="81" y2="50" stroke="#feebc8" stroke-width="2"/>
          <line x1="28" y1="28" x2="72" y2="72" stroke="#feebc8" stroke-width="2"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#dd6b20"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#feebc8"/>
          <path d="M 27 73 L 73 73 A 46 46 0 0 0 27 27 Z" fill="#ed8936"/>
        `);
      }

    case 'erik':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="52" r="38" fill="#553c9a" stroke="#322659" stroke-width="2"/>
          <path d="M 50 14 C 40 25 40 75 50 88" stroke="#322659" stroke-width="2" fill="none"/>
          <ellipse cx="34" cy="38" rx="5" ry="12" fill="#ffffff" opacity="0.3" transform="rotate(-20 34 38)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#553c9a" stroke="#322659" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#feebc8"/>
          <circle cx="50" cy="50" r="28" fill="#d69e2e"/>
          <ellipse cx="50" cy="50" rx="9" ry="12" fill="#744210"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#553c9a"/>
          <path d="M 25 75 L 75 75 A 50 50 0 0 0 25 25 Z" fill="#d69e2e"/>
        `);
      }

    case 'pizza':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="50" r="42" fill="#d69e2e" stroke="#b7791f" stroke-width="3"/>
          <circle cx="50" cy="50" r="36" fill="#ecc94b"/>
          <circle cx="35" cy="35" r="7" fill="#c53030"/>
          <circle cx="65" cy="35" r="7" fill="#c53030"/>
          <circle cx="50" cy="55" r="7" fill="#c53030"/>
          <circle cx="32" cy="62" r="6" fill="#c53030"/>
          <circle cx="68" cy="62" r="6" fill="#c53030"/>
          <circle cx="48" cy="38" r="2" fill="#2f855a"/>
          <circle cx="58" cy="48" r="2" fill="#2f855a"/>
          <circle cx="40" cy="50" r="2" fill="#2f855a"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <path d="M 14 50 A 36 36 0 0 0 86 50 Z" fill="#ecc94b"/>
          <circle cx="35" cy="65" r="6.5" fill="#c53030"/>
          <circle cx="65" cy="65" r="6.5" fill="#c53030"/>
          <circle cx="50" cy="72" r="6.5" fill="#c53030"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#d69e2e"/>
          <path d="M 24 76 L 76 76 A 52 52 0 0 0 24 24 Z" fill="#ecc94b"/>
          <circle cx="42" cy="58" r="6" fill="#c53030"/>
          <circle cx="58" cy="68" r="6" fill="#c53030"/>
        `);
      }

    case 'kurabiye':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="32" cy="38" r="4.5" fill="#2d3748"/>
          <circle cx="55" cy="32" r="4" fill="#2d3748"/>
          <circle cx="65" cy="52" r="4.5" fill="#2d3748"/>
          <circle cx="42" cy="58" r="5" fill="#2d3748"/>
          <circle cx="55" cy="68" r="4" fill="#2d3748"/>
          <circle cx="30" cy="62" r="3.5" fill="#2d3748"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="32" cy="62" r="4.5" fill="#2d3748"/>
          <circle cx="50" cy="70" r="5" fill="#2d3748"/>
          <circle cx="68" cy="62" r="4.5" fill="#2d3748"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#dd6b20"/>
          <circle cx="42" cy="60" r="4.5" fill="#2d3748"/>
          <circle cx="58" cy="68" r="4" fill="#2d3748"/>
        `);
      }

    case 'donut':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="50" r="40" fill="#dd6b20" stroke="#c05621" stroke-width="2"/>
          <circle cx="50" cy="50" r="34" fill="#ed64a6"/>
          <circle cx="50" cy="50" r="14" fill="#1a202c"/>
          <rect x="30" y="30" width="6" height="2" fill="#ffffff" rx="1" transform="rotate(20 30 30)"/>
          <rect x="62" y="32" width="6" height="2" fill="#f6ad55" rx="1" transform="rotate(-30 62 32)"/>
          <rect x="32" y="65" width="6" height="2" fill="#63b3ed" rx="1" transform="rotate(45 32 65)"/>
          <rect x="65" y="62" width="6" height="2" fill="#68d391" rx="1" transform="rotate(-15 65 62)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 L 64 50 A 14 14 0 0 1 36 50 Z" fill="#ed64a6" stroke="#c05621" stroke-width="2"/>
          <rect x="28" y="62" width="6" height="2" fill="#ffffff" rx="1" transform="rotate(20 28 62)"/>
          <rect x="50" y="72" width="6" height="2" fill="#f6ad55" rx="1" transform="rotate(-30 50 72)"/>
          <rect x="70" y="62" width="6" height="2" fill="#68d391" rx="1" transform="rotate(-15 70 62)"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 L 20 50 A 30 30 0 0 1 50 80 Z" fill="#ed64a6"/>
          <rect x="42" y="62" width="6" height="2" fill="#ffffff" rx="1" transform="rotate(20 42 62)"/>
          <rect x="62" y="70" width="6" height="2" fill="#68d391" rx="1" transform="rotate(-15 62 70)"/>
        `);
      }

    case 'waffle':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="50" r="40" fill="#d69e2e" stroke="#b7791f" stroke-width="3"/>
          <path d="M 25 25 H 75 M 25 38 H 75 M 25 50 H 75 M 25 62 H 75 M 25 75 H 75" stroke="#b7791f" stroke-width="2"/>
          <path d="M 25 25 V 75 M 38 25 V 75 M 50 25 V 75 M 62 25 V 75 M 75 25 V 75" stroke="#b7791f" stroke-width="2"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#d69e2e" stroke="#b7791f" stroke-width="2"/>
          <path d="M 20 62 H 80 M 25 75 H 75" stroke="#b7791f" stroke-width="2"/>
          <path d="M 32 50 V 78 M 50 50 V 90 M 68 50 V 78" stroke="#b7791f" stroke-width="2"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#d69e2e"/>
          <path d="M 20 62 H 72 M 20 42 H 58" stroke="#b7791f" stroke-width="2"/>
          <path d="M 38 80 V 28 M 58 80 V 42" stroke="#b7791f" stroke-width="2"/>
        `);
      }

    case 'domates':
      if (durum === 'bütün') {
        return wrap(`
          <circle cx="50" cy="52" r="38" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 14 L 46 22 L 36 16 L 42 24 L 32 28 L 44 28 L 50 14 Z" fill="#38a169"/>
          <path d="M 50 14 L 54 22 L 64 16 L 58 24 L 68 28 L 56 28 L 50 14 Z" fill="#38a169"/>
          <ellipse cx="34" cy="38" rx="4" ry="10" fill="#ffffff" opacity="0.35" transform="rotate(-20 34 38)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <circle cx="50" cy="50" r="38" fill="#c53030" stroke="#9b1c1c" stroke-width="2"/>
          <circle cx="50" cy="50" r="33" fill="#e53e3e"/>
          <circle cx="36" cy="42" r="8" fill="#9b1c1c"/>
          <circle cx="64" cy="42" r="8" fill="#9b1c1c"/>
          <circle cx="50" cy="65" r="9" fill="#9b1c1c"/>
          <circle cx="36" cy="42" r="1.5" fill="#ecc94b"/>
          <circle cx="64" cy="42" r="1.5" fill="#ecc94b"/>
          <circle cx="50" cy="65" r="1.5" fill="#ecc94b"/>
        `);
      } else {
        return wrap(`
          <path d="M 20 80 L 80 80 A 60 60 0 0 0 20 20 Z" fill="#c53030"/>
          <path d="M 25 75 L 75 75 A 50 50 0 0 0 25 25 Z" fill="#e53e3e"/>
          <circle cx="45" cy="58" r="7" fill="#9b1c1c"/>
          <circle cx="45" cy="58" r="1.5" fill="#ecc94b"/>
        `);
      }

    case 'biber':
    default:
      if (durum === 'bütün') {
        return wrap(`
          <path d="M 30 25 C 20 30, 20 75, 32 85 C 40 90, 48 82, 50 82 C 52 82, 60 90, 68 85 C 80 75, 80 30, 70 25 C 60 20, 40 20, 30 25 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 22 L 50 10 C 50 8, 58 6, 56 12 Z" stroke="#2f855a" stroke-width="4" fill="none"/>
          <ellipse cx="36" cy="42" rx="4" ry="12" fill="#ffffff" opacity="0.3" transform="rotate(-15 36 42)"/>
        `);
      } else if (durum === 'yarım') {
        return wrap(`
          <path d="M 50 20 C 25 20, 20 50, 22 84 L 50 84 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 23 L 50 82 C 28 82, 28 50, 46 23 Z" fill="#feb2b2"/>
          <circle cx="42" cy="45" r="4" fill="#ffffff"/>
          <circle cx="42" cy="45" r="1.5" fill="#d69e2e"/>
        `);
      } else {
        return wrap(`
          <path d="M 50 25 C 38 32, 28 55, 30 80 L 50 80 Z" fill="#e53e3e" stroke="#9b1c1c" stroke-width="2"/>
          <path d="M 50 28 L 50 78 L 34 78 C 32 58, 40 36, 50 28 Z" fill="#feb2b2"/>
        `);
      }
  }
}

function rastgeleSec<T>(dizi: T[], adet: number): T[] {
  const kopya = [...dizi];
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
  }
  return kopya.slice(0, adet);
}

const RITMIK_KARE_RENKLERI = [
  { emoji: '🟥', ad: 'kırmızı kare', bgClass: 'from-rose-500 via-red-500 to-rose-600 border-rose-200' },
  { emoji: '🟦', ad: 'mavi kare', bgClass: 'from-blue-500 via-indigo-500 to-sky-600 border-blue-200' },
  { emoji: '🟩', ad: 'yeşil kare', bgClass: 'from-emerald-500 via-green-500 to-teal-600 border-emerald-200' },
  { emoji: '🟧', ad: 'turuncu kare', bgClass: 'from-amber-500 via-orange-500 to-amber-600 border-amber-200' },
  { emoji: '🟪', ad: 'mor kare', bgClass: 'from-purple-500 via-fuchsia-500 to-violet-600 border-purple-200' },
];

function ritmikIleriUret(adim: number, ustSinir: number): QuestionData {
  const maxBaslangicKati = Math.max(Math.floor((ustSinir - adim * 4) / adim), 1);
  const kat = Math.floor(Math.random() * maxBaslangicKati) + 1;
  const baslangic = kat * adim;
  const dizi = [baslangic, baslangic + adim, baslangic + adim * 2, baslangic + adim * 3, baslangic + adim * 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];
  
  const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
  const gosterilecek = [...dizi];
  (gosterilecek as (number | string)[])[boslukIndex] = secilenKare.emoji;

  const sequenceHTML = dizi.map((val, idx) => {
    if (idx === boslukIndex) {
      return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-lg ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>`;
    }
    return `<div class="px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-600/90 via-indigo-700/90 to-slate-800/90 border border-blue-300/80 text-white font-black text-[11px] xs:text-xs sm:text-sm md:text-base shadow-sm shrink-0 min-w-[22px] xs:min-w-[26px] sm:min-w-[32px] text-center">${val}</div>`;
  }).join('<span class="text-amber-300 font-extrabold text-[9px] xs:text-[11px] sm:text-xs md:text-sm mx-0.5 shrink-0">-</span>');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-nowrap max-w-full px-0.5">
      ${sequenceHTML}
    </div>
  </div>`;

  return {
    question: `Aşağıdaki ritmik sayma zincirinde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi sayı gelmelidir?\n\n ${gosterilecek.join(" - ")}`,
    questionHTML: soruHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + adim, dogruCevap - adim, dogruCevap + 1, dogruCevap - 1, dogruCevap + adim * 2], 1),
    isLong: true
  };
}

function ritmikGeriUret(adim: number): QuestionData {
  const minBaslangic = adim * 4 + adim;
  const baslangicKati = Math.floor(Math.random() * Math.floor((100 - minBaslangic) / adim + 1)) + Math.ceil(minBaslangic / adim);
  const baslangic = Math.min(baslangicKati * adim, 100);
  const dizi = [baslangic, baslangic - adim, baslangic - adim * 2, baslangic - adim * 3, baslangic - adim * 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
  const gosterilecek = [...dizi];
  (gosterilecek as (number | string)[])[boslukIndex] = secilenKare.emoji;

  const sequenceHTML = dizi.map((val, idx) => {
    if (idx === boslukIndex) {
      return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-lg ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>`;
    }
    return `<div class="px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-600/90 via-indigo-700/90 to-slate-800/90 border border-blue-300/80 text-white font-black text-[11px] xs:text-xs sm:text-sm md:text-base shadow-sm shrink-0 min-w-[22px] xs:min-w-[26px] sm:min-w-[32px] text-center">${val}</div>`;
  }).join('<span class="text-amber-300 font-extrabold text-[9px] xs:text-[11px] sm:text-xs md:text-sm mx-0.5 shrink-0">-</span>');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki geriye ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-nowrap max-w-full px-0.5">
      ${sequenceHTML}
    </div>
  </div>`;

  return {
    question: `Aşağıdaki geriye ritmik sayma zincirinde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi sayı gelmelidir?\n\n ${gosterilecek.join(" - ")}`,
    questionHTML: soruHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + adim, dogruCevap - adim, dogruCevap - 1, dogruCevap + 1, dogruCevap - adim * 2], 0),
    isLong: true
  };
}

function toplamaUret(minToplam: number, maxToplam: number, eldeli: boolean) {
  let s1 = 0, s2 = 0, correct = 0, deneme = 0;
  do {
    s1 = Math.floor(Math.random() * 80) + 10;
    s2 = Math.floor(Math.random() * 80) + 10;
    correct = s1 + s2;
    deneme++;
  } while (deneme < 1500 && (
    correct < minToplam || correct > maxToplam ||
    (eldeli ? ((s1 % 10 + s2 % 10) < 10) : ((s1 % 10 + s2 % 10) >= 10))
  ));
  return { s1, s2, correct };
}

function cikarmaUret(minEksilen: number, maxEksilen: number, onlukBoz: boolean) {
  let s1 = 0, s2 = 0, correct = 0, deneme = 0;
  do {
    s1 = Math.floor(Math.random() * (maxEksilen - minEksilen + 1)) + minEksilen;
    s2 = Math.floor(Math.random() * 40) + 10;
    correct = s1 - s2;
    deneme++;
  } while (deneme < 1500 && (
    correct <= 0 ||
    (onlukBoz ? ((s1 % 10) >= (s2 % 10)) : ((s1 % 10) < (s2 % 10)))
  ));
  return { s1, s2, correct };
}

function ritmikIleri1Uret(): QuestionData {
  const baslangic = Math.floor(Math.random() * 46) + 1; // 1..46 (en fazla 50)
  const dizi = [baslangic, baslangic + 1, baslangic + 2, baslangic + 3, baslangic + 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
  const gosterilecek = [...dizi];
  (gosterilecek as (number | string)[])[boslukIndex] = secilenKare.emoji;

  const sequenceHTML = dizi.map((val, idx) => {
    if (idx === boslukIndex) {
      return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-lg ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>`;
    }
    return `<div class="px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-600/90 via-indigo-700/90 to-slate-800/90 border border-blue-300/80 text-white font-black text-[11px] xs:text-xs sm:text-sm md:text-base shadow-sm shrink-0 min-w-[22px] xs:min-w-[26px] sm:min-w-[32px] text-center">${val}</div>`;
  }).join('<span class="text-amber-300 font-extrabold text-[9px] xs:text-[11px] sm:text-xs md:text-sm mx-0.5 shrink-0">-</span>');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-nowrap max-w-full px-0.5">
      ${sequenceHTML}
    </div>
  </div>`;

  return {
    question: `Aşağıdaki ritmik sayma zincirinde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi sayı gelmelidir?\n\n ${gosterilecek.join(" - ")}`,
    questionHTML: soruHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + 1, dogruCevap - 1, dogruCevap + 2, dogruCevap - 2], 1),
    isLong: true
  };
}

function ritmikGeri1Uret(): QuestionData {
  const baslangic = Math.floor(Math.random() * 16) + 5; // 5..20 (20'den geriye 1'erli)
  const dizi = [baslangic, baslangic - 1, baslangic - 2, baslangic - 3, baslangic - 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
  const gosterilecek = [...dizi];
  (gosterilecek as (number | string)[])[boslukIndex] = secilenKare.emoji;

  const sequenceHTML = dizi.map((val, idx) => {
    if (idx === boslukIndex) {
      return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-lg ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>`;
    }
    return `<div class="px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-600/90 via-indigo-700/90 to-slate-800/90 border border-blue-300/80 text-white font-black text-[11px] xs:text-xs sm:text-sm md:text-base shadow-sm shrink-0 min-w-[22px] xs:min-w-[26px] sm:min-w-[32px] text-center">${val}</div>`;
  }).join('<span class="text-amber-300 font-extrabold text-[9px] xs:text-[11px] sm:text-xs md:text-sm mx-0.5 shrink-0">-</span>');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki geriye ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-nowrap max-w-full px-0.5">
      ${sequenceHTML}
    </div>
  </div>`;

  return {
    question: `Aşağıdaki geriye ritmik sayma zincirinde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi sayı gelmelidir?\n\n ${gosterilecek.join(" - ")}`,
    questionHTML: soruHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + 1, dogruCevap - 1, dogruCevap + 2, dogruCevap - 2], 0),
    isLong: true
  };
}

const CATEGORY_MAP = [
  {
    id: 'geometri',
    name: "1. Nesnelerin Geometrisi",
    shortName: "Geometri",
    icon: "/iconn/s21.png",
    keys: ["uzamsal_iliskiler", "es_nesneler", "geometrik_sekil_cisim", "yuz_ayrit_kose", "geometrik_oruntu", "uzamsal_iliskiler_simetri", "sivi_olcme", "tartma_olcme"]
  },
  {
    id: 'sayilar',
    name: "2. Sayılar ve Nicelikler",
    shortName: "Sayılar",
    icon: "/iconn/s19.png",
    keys: [
      "nesne_sayisi", "sira_sayilari", "cok_az_esit", "sayi_basamak_degeri", "deste_duzine", "kesirler",
      "ritmik_ileri_1", "ritmik_ileri_2", "ritmik_ileri_3", "ritmik_ileri_4", "ritmik_ileri_5", "ritmik_ileri_10",
      "ritmik_geri_1", "ritmik_geri_2", "ritmik_geri_10",
      "sayi_karsilastirma", "paralarimiz", "zaman_olcme",
      "saat_tam", "saat_yarim", "saat_ceyrek_gece", "saat_ceyrek_kala", "uzunluk_olcme", "tartma", "sayi_sekil_oruntusu"
    ]
  },
  {
    id: 'islemler',
    name: "3. İşlemlerden Cebirsel Düşünmeye",
    shortName: "İşlemler ve Cebir",
    icon: "/iconn/s6.png",
    keys: [
      "tek_islem_toplama_problemleri", "iki_islem_toplama_problemleri",
      "toplama_eldesiz_50", "toplama_eldeli_50", "verilmeyen_toplanani_bul",
      "tek_islem_cikarma_problemleri", "iki_islem_cikarma_problemleri", "toplama_cikarma_problemleri",
      "cikarma_onluksuz_50", "cikarma_onluklu_50",
      "zihinden_toplama", "zihinden_cikarma",
      "ardisik_toplama", "ritmik_carpim", "esit_paylastirma", "ardisik_cikarma", "kalansiz_bolme"
    ]
  },
  {
    id: 'olcme',
    name: "4. Veri İşleme & Ölçme",
    shortName: "Veri ve Ölçme",
    icon: "/iconn/s15.png",
    keys: ["veri_grafik", "takvim_olcme"]
  },
  {
    id: 'diger_oyunlar',
    name: "5. Diğer Oyunlar",
    shortName: "Diğer Oyunlar",
    icon: "/iconn/s1.png",
    keys: [
      "sureli_toplama_cikarma",
      "sureli_carpma_bolme",
      "balon_patlatma_mat",
      "matematik_hafiza",
      "hizli_islem_carki",
      "sayi_dedektifi",
      "ritim_labirent",
      "geometri_eslestirme"
    ]
  },
  // 3. Sınıf Müfredatı 4 Ana Tema
  {
    id: 'g3_tema1',
    name: "1. Sayılar ve Nicelikler (1)",
    shortName: "Sayılar (1)",
    icon: "/iconn/s19.png",
    keys: [
      "g3_uc_basamakli_okuma_yazma",
      "g3_sayi_cozumleme",
      "g3_sayi_siralama_karsilastirma",
      "g3_en_yakin_onluga_yuvarlama_100",
      "g3_en_yakin_onluga_yuvarlama",
      "g3_en_yakin_yuzluge_yuvarlama",
      "g3_ritmik_6",
      "g3_ritmik_7",
      "g3_ritmik_8",
      "g3_ritmik_9",
      "g3_ritmik_10",
      "g3_ritmik_100",
      "g3_tek_cift_20ye_kadar_islemler",
      "g3_tek_cift_sayilar",
      "g3_sayi_sekil_oruntuleri",
      "g3_nesne_tahmin_karsilastirma"
    ]
  },
  {
    id: 'g3_tema2',
    name: "2. Sayılar ve Nicelikler (2)",
    shortName: "Sayılar (2)",
    icon: "/iconn/s15.png",
    keys: [
      "g3_birim_kesirler",
      "g3_pay_payda_modelleme",
      "g3_payda_10_100_kesir",
      "g3_zaman_olcme",
      "g3_uzunluk_kutle_sivi",
      "g3_paralarimiz_lira_kurus"
    ]
  },
  {
    id: 'g3_tema3',
    name: "3. İşlemlerden Cebirsel Düşünmeye",
    shortName: "İşlemler ve Cebir",
    icon: "/iconn/s6.png",
    keys: [
      "g3_zihinden_toplama_cikarma_tahmin",
      "g3_toplama_cikarma_problemleri",
      "g3_carpma_bolme_pratik",
      "g3_verilmeyen_ogeyi_bulma"
    ]
  },
  {
    id: 'g3_tema4',
    name: "4. Nesnelerin Geometrisi ve Ölçme",
    shortName: "Geometri ve Ölçme",
    icon: "/iconn/s21.png",
    keys: [
      "g3_geometrik_cisimler_ozellikleri",
      "g3_temel_geometri_kavramlari",
      "g3_cevre_ve_olculebilir_nitelikler"
    ]
  },

  // 4. Sınıf Müfredatı 4 Ana Tema
  {
    id: 'g4_tema1',
    name: "1. Sayılar ve Nicelikler (1)",
    shortName: "Sayılar (1)",
    icon: "/iconn/s19.png",
    keys: [
      "g4_sayi_okuma_yazma",
      "g4_basamak_ve_cozumleme",
      "g4_sayi_siralama",
      "g4_en_yakin_onluk_yuzluk",
      "g4_ritmik_yuzer_biner",
      "g4_sayi_sekil_oruntuleri"
    ]
  },
  {
    id: 'g4_tema2',
    name: "2. Sayılar ve Nicelikler (2)",
    shortName: "Sayılar (2)",
    icon: "/iconn/s15.png",
    keys: [
      "g4_kesir_cesitleri_modelleme",
      "g4_birim_kesirler_karsilastirma",
      "g4_paydalari_esit_kesir_islemleri",
      "g4_uzunluk_olculeri_donusum",
      "g4_kutle_olculeri_ton_kg_g"
    ]
  },
  {
    id: 'g4_tema3',
    name: "3. İşlemlerden Cebirsel Düşünmeye",
    shortName: "İşlemler ve Cebir",
    icon: "/iconn/s6.png",
    keys: [
      "g4_dort_islem_toplama_cikarma",
      "g4_carpma_islemi_3basamakli",
      "g4_bolme_islemi_4basamakli",
      "g4_zihinden_carpma_bolme_10_100_1000",
      "g4_esitlik_ve_verilmeyen_deger"
    ]
  },
  {
    id: 'g4_tema4',
    name: "4. Geometri, Veri ve Olasılık",
    shortName: "Geometri ve Veri",
    icon: "/iconn/s21.png",
    keys: [
      "g4_geometrik_cisimler",
      "g4_cevre_uzunlugu",
      "g4_alan_tahmini_ve_birim_kare",
      "g4_dogru_isin_dogru_parcasi_acilar",
      "g4_simetri_dogrulari",
      "g4_sutun_grafigi_ve_tablolar",
      "g4_olaylarin_olasiligi"
    ]
  }
];

const getTopicIconVisual = (key: string) => {
  if (key.includes('geometrik_sekil_cisim') || key.includes('yuz_ayrit')) {
    return { emoji: '📐', bg: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500' };
  }
  if (key.includes('oruntu')) {
    return { emoji: '🔷', bg: 'bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500' };
  }
  if (key.includes('simetri')) {
    return { emoji: '🪞', bg: 'bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-500' };
  }
  if (key.includes('sivi')) {
    return { emoji: '🧪', bg: 'bg-gradient-to-br from-teal-300 via-emerald-400 to-cyan-500' };
  }
  if (key.includes('tartma')) {
    return { emoji: '⚖️', bg: 'bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500' };
  }
  if (key.includes('ritmik')) {
    return { emoji: '🔢', bg: 'bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500' };
  }
  if (key.includes('saat') || key.includes('zaman')) {
    return { emoji: '⏰', bg: 'bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500' };
  }
  if (key.includes('para')) {
    return { emoji: '🪙', bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500' };
  }
  if (key.includes('kesir')) {
    return { emoji: '🍕', bg: 'bg-gradient-to-br from-rose-400 via-red-400 to-amber-400' };
  }
  if (key.includes('toplama')) {
    return { emoji: '➕', bg: 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500' };
  }
  if (key.includes('cikarma')) {
    return { emoji: '➖', bg: 'bg-gradient-to-br from-rose-400 via-pink-400 to-red-500' };
  }
  if (key.includes('carp') || key.includes('bol') || key.includes('paylas')) {
    return { emoji: '✖️', bg: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600' };
  }
  if (key.includes('veri') || key.includes('grafik')) {
    return { emoji: '📊', bg: 'bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400' };
  }
  if (key.includes('uzunluk')) {
    return { emoji: '📏', bg: 'bg-gradient-to-br from-yellow-300 via-lime-400 to-emerald-400' };
  }
  if (key.includes('basamak') || key.includes('deste') || key.includes('nesne')) {
    return { emoji: '🔢', bg: 'bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500' };
  }
  return { emoji: '⭐', bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400' };
};

const getTopicEmoji = (key: string) => getTopicIconVisual(key).emoji;

const getCategoryIdForTopic = (topicKey: string): string => {
  for (const cat of CATEGORY_MAP) {
    if (cat.keys.includes(topicKey)) {
      return cat.id;
    }
  }
  return 'geometri';
};

const TOPIC_3D_ICONS: Record<string, string> = {
  // 1. Nesnelerin Geometrisi
  uzamsal_iliskiler: '/iconn/s3.png',
  es_nesneler: '/iconn/s2.png',
  geometrik_sekil_cisim: '/iconn/s10.png',
  yuz_ayrit_kose: '/iconn/s1.png',
  geometrik_oruntu: '/iconn/s2.png',
  uzamsal_iliskiler_simetri: '/iconn/s3.png',
  sivi_olcme: '/iconn/s4.png',
  tartma_olcme: '/iconn/s5.png',

  // 2. Sayılar ve Nicelikler
  nesne_sayisi: '/iconn/s6.png',
  en_yakin_onluk: '/iconn/s6.png',
  sira_sayilari: '/iconn/s15.png',
  cok_az_esit: '/iconn/s11.png',
  sayi_basamak_degeri: '/iconn/s7.png',
  deste_duzine: '/iconn/s8.png',
  kesirler: '/iconn/s9.png',
  sayi_karsilastirma: '/iconn/s11.png',
  paralarimiz: '/iconn/s12.png',
  zaman_olcme: '/iconn/s13.png',
  uzunluk_olcme: '/iconn/s14.png',
  tartma: '/iconn/s5.png',
  takvim_olcme: '/iconn/s16.png',
  sayi_sekil_oruntusu: '/iconn/s16.png',

  // Ritmik Saymalar
  ritmik_ileri_1: '/iconn/s17.png',
  ritmik_ileri_2: '/iconn/s18.png',
  ritmik_ileri_3: '/iconn/s18.png',
  ritmik_ileri_4: '/iconn/s19.png',
  ritmik_ileri_5: '/iconn/s20.png',
  ritmik_ileri_10: '/iconn/s21.png',
  ritmik_geri_1: '/iconn/s22.png',
  ritmik_geri_2: '/iconn/s23.png',
  ritmik_geri_10: '/iconn/s24.png',

  // Saati Okuma
  saat_tam: '/iconn/s24.png',
  saat_yarim: '/iconn/s25.png',
  saat_ceyrek_gece: '/iconn/s26.png',
  saat_ceyrek_kala: '/iconn/s27.png',

  // 3. İşlemler ve Cebir - Toplama
  toplama_20_ici: '/iconn/s28.png',
  toplama_onluk: '/iconn/s29.png',
  verilmeyen_toplanan: '/iconn/s30.png',
  toplama_eldesiz_50: '/iconn/s28.png',
  toplama_eldeli_50: '/iconn/s29.png',
  verilmeyen_toplanani_bul: '/iconn/s28.png',
  zihinden_toplama: '/iconn/s30.png',
  tek_islem_toplama_problemleri: '/iconn/s31.png',
  iki_islem_toplama_problemleri: '/iconn/s32.png',

  // Çıkarma
  cikarma_20_ici: '/iconn/s34.png',
  cikarma_onluk: '/iconn/s35.png',
  cikarma_onluksuz_50: '/iconn/s33.png',
  cikarma_onluklu_50: '/iconn/s34.png',
  zihinden_cikarma: '/iconn/s35.png',
  tek_islem_cikarma_problemleri: '/iconn/s36.png',
  iki_islem_cikarma_problemleri: '/iconn/s37.png',

  // Karma / Çarpma / Bölme
  toplama_cikarma_problemleri: '/iconn/s38.png',
  ardisik_toplama: '/iconn/s39.png',
  ritmik_carpim: '/iconn/s6.png',
  esit_paylastirma: '/iconn/s8.png',
  ardisik_cikarma: '/iconn/s12.png',
  kalansiz_bolme: '/iconn/s14.png',

  // 4. Veri İşleme
  veri_grafik: '/iconn/s21.png',

  // 5. Diğer Oyunlar
  sureli_toplama_cikarma: '/iconn/s28.png',
  sureli_on_tamamlama: '/iconn/s20.png',
  sureli_carpma_bolme: '/iconn/s6.png',
  balon_patlatma_mat: '/iconn/s1.png',
  matematik_hafiza: '/iconn/s16.png',
  hizli_islem_carki: '/iconn/s27.png',
  sayi_dedektifi: '/iconn/s20.png',
  ritim_labirent: '/iconn/s22.png',
  geometri_eslestirme: '/iconn/s2.png',

  // 3. Sınıf Tema 1 (Sayılar ve Nicelikler 1)
  g3_uc_basamakli_okuma_yazma: '/iconn/s6.png',
  g3_sayi_cozumleme: '/iconn/s7.png',
  g3_sayi_siralama_karsilastirma: '/iconn/s11.png',
  g3_en_yakin_onluga_yuvarlama: '/iconn/s26.png',
  g3_en_yakin_yuzluge_yuvarlama: '/iconn/s27.png',
  g3_ritmik_6_7: '/iconn/s17.png',
  g3_ritmik_8_9: '/iconn/s18.png',
  g3_ritmik_10: '/iconn/s19.png',
  g3_ritmik_100: '/iconn/s22.png',
  g3_ritmik_saymalar: '/iconn/s17.png',
  g3_tek_cift_nesne_toplami: '/iconn/s8.png',
  g3_tek_cift_20ye_kadar_islemler: '/iconn/s28.png',
  g3_tek_cift_sayilar: '/iconn/s8.png',
  g3_tek_cift_islemler: '/iconn/s33.png',
  g3_sayi_sekil_oruntuleri: '/iconn/s2.png',
  g3_nesne_tahmin_karsilastirma: '/iconn/s20.png',

  // 3. Sınıf Tema 2 (Sayılar ve Nicelikler 2)
  g3_birim_kesirler: '/iconn/s9.png',
  g3_pay_payda_modelleme: '/iconn/s9.png',
  g3_payda_10_100_kesir: '/iconn/s15.png',
  g3_zaman_olcme: '/iconn/s13.png',
  g3_uzunluk_kutle_sivi: '/iconn/s14.png',
  g3_paralarimiz_lira_kurus: '/iconn/s12.png',

  // 3. Sınıf Tema 3 (İşlemlerden Cebirsel Düşünmeye)
  g3_zihinden_toplama_cikarma_tahmin: '/iconn/s30.png',
  g3_toplama_cikarma_problemleri: '/iconn/s31.png',
  g3_carpma_bolme_pratik: '/iconn/s39.png',
  g3_verilmeyen_ogeyi_bulma: '/iconn/s28.png',

  // 3. Sınıf Tema 4 (Nesnelerin Geometrisi ve Ölçme)
  g3_geometrik_cisimler_ozellikleri: '/iconn/s10.png',
  g3_temel_geometri_kavramlari: '/iconn/s21.png',
  g3_cevre_ve_olculebilir_nitelikler: '/iconn/s14.png',

  // 4. Sınıf Tema 1 (Sayılar ve Nicelikler 1)
  g4_sayi_okuma_yazma: '/iconn/s6.png',
  g4_basamak_ve_cozumleme: '/iconn/s7.png',
  g4_sayi_siralama: '/iconn/s11.png',
  g4_en_yakin_onluk_yuzluk: '/iconn/s27.png',
  g4_ritmik_yuzer_biner: '/iconn/s17.png',
  g4_sayi_sekil_oruntuleri: '/iconn/s2.png',

  // 4. Sınıf Tema 2 (Sayılar ve Nicelikler 2)
  g4_kesir_cesitleri_modelleme: '/iconn/s9.png',
  g4_birim_kesirler_karsilastirma: '/iconn/s9.png',
  g4_paydalari_esit_kesir_islemleri: '/iconn/s15.png',
  g4_uzunluk_olculeri_donusum: '/iconn/s14.png',
  g4_kutle_olculeri_ton_kg_g: '/iconn/s5.png',

  // 4. Sınıf Tema 3 (İşlemlerden Cebirsel Düşünmeye)
  g4_dort_islem_toplama_cikarma: '/iconn/s28.png',
  g4_carpma_islemi_3basamakli: '/iconn/s39.png',
  g4_bolme_islemi_4basamakli: '/iconn/s14.png',
  g4_zihinden_carpma_bolme_10_100_1000: '/iconn/s30.png',
  g4_esitlik_ve_verilmeyen_deger: '/iconn/s28.png',

  // 4. Sınıf Tema 4 (Geometri, Veri ve Olasılık)
  g4_geometrik_cisimler: '/iconn/s10.png',
  g4_cevre_uzunlugu: '/iconn/s14.png',
  g4_alan_tahmini_ve_birim_kare: '/iconn/s1.png',
  g4_dogru_isin_dogru_parcasi_acilar: '/iconn/s21.png',
  g4_simetri_dogrulari: '/iconn/s3.png',
  g4_sutun_grafigi_ve_tablolar: '/iconn/s21.png',
  g4_olaylarin_olasiligi: '/iconn/s20.png',
};

// Reference 3D Cartoon Game UI Style (Pill Buttons)
const getTopicBadgeGradient = (topicKey: string) => {
  if (topicKey === 'sureli_toplama_cikarma') {
    return 'from-rose-500 via-red-500 to-amber-500';
  }
  if (topicKey === 'sureli_on_tamamlama') {
    return 'from-amber-500 via-orange-500 to-red-600';
  }
  if (topicKey === 'sureli_carpma_bolme') {
    return 'from-amber-500 via-orange-500 to-red-600';
  }
  if (topicKey.includes('balon') || topicKey.includes('carki')) {
    return 'from-fuchsia-400 via-purple-500 to-pink-500';
  }
  if (topicKey.includes('hafiza') || topicKey.includes('dedektifi')) {
    return 'from-violet-400 via-indigo-500 to-purple-600';
  }
  if (topicKey.includes('labirent') || topicKey.includes('eslestirme')) {
    return 'from-cyan-400 via-teal-500 to-blue-600';
  }
  if (topicKey.includes('geometrik') || topicKey.includes('yuz') || topicKey.includes('oruntu')) {
    return 'from-teal-400 via-emerald-400 to-cyan-500';
  }
  if (topicKey.includes('ritmik') || topicKey.includes('nesne') || topicKey.includes('basamak')) {
    return 'from-amber-400 via-orange-400 to-rose-500';
  }
  if (topicKey.includes('toplama')) {
    return 'from-blue-500 via-indigo-500 to-purple-600';
  }
  if (topicKey.includes('cikarma')) {
    return 'from-pink-500 via-rose-500 to-red-500';
  }
  if (topicKey.includes('saat') || topicKey.includes('zaman')) {
    return 'from-yellow-400 via-amber-400 to-amber-600';
  }
  if (topicKey.includes('kesir') || topicKey.includes('para') || topicKey.includes('deste')) {
    return 'from-emerald-400 via-teal-500 to-cyan-600';
  }
  if (topicKey.includes('veri') || topicKey.includes('grafik') || topicKey.includes('tartma')) {
    return 'from-violet-500 via-purple-600 to-indigo-700';
  }
  return 'from-sky-400 via-blue-500 to-indigo-600';
};

const TopicButtonReferenceStyle: React.FC<{
  topicKey: string;
  title: string;
  onClick: () => void;
  compact?: boolean;
}> = ({ topicKey, title, onClick, compact }) => {
  const iconUrl = TOPIC_3D_ICONS[topicKey] || '/iconn/s1.png';
  const badgeGradient = getTopicBadgeGradient(topicKey);

  return (
    <button
      onClick={onClick}
      className="group relative w-full bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900 border-3 border-white dark:border-amber-300 ring-2 ring-amber-300/60 rounded-full p-2 pr-3.5 sm:pr-5 flex items-center gap-2.5 sm:gap-3.5 shadow-[0_5px_0_#1e3a8a,0_8px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_7px_0_#1e3a8a,0_12px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[0_2px_0_#1e3a8a] transition-all cursor-pointer overflow-hidden"
    >
      {/* Top Gloss/Shine Highlight Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />

      {/* Left Circular 3D Icon Badge */}
      <div className="relative shrink-0 z-10">
        <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br ${badgeGradient} text-white ring-3 ring-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-1 sm:p-1.5 transition-transform group-hover:scale-110 group-hover:rotate-6 overflow-hidden`}>
          <img src={iconUrl} alt={title} className="w-full h-full object-cover scale-[1.35] filter drop-shadow-md" />
        </div>
      </div>

      {/* Center Text Body */}
      <div className="flex-1 text-left min-w-0 py-0.5 z-10">
        <h4 className="font-black text-xs sm:text-sm md:text-base uppercase tracking-wider text-white group-hover:text-yellow-300 transition-colors leading-tight line-clamp-1 drop-shadow-md">
          {title}
        </h4>
        <p className="text-[10px] sm:text-xs text-yellow-300 font-extrabold truncate mt-0.5 uppercase tracking-wide drop-shadow-xs">
          Alıştırma Etkinliği
        </p>
      </div>

      {/* Right 3D Green PLAY Action Image */}
      <div className="z-10 shrink-0 relative w-[42px] h-[33px] sm:w-[48px] sm:h-[37px] group-hover:scale-110 transition-transform filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/ply.png')` }}
        />
      </div>
    </button>
  );
};

// Helper function for Infinite Level & Trophy Target calculations
const getPlayerLevelInfo = (statsData: Record<string, StatRecord>, badgeCounts: Record<string, number>, unlockedBadges: string[]) => {
  const totalCorrect = Object.values(statsData || {}).reduce((sum, item) => sum + ((item && item.dogru) || 0), 0);
  const totalSolved = Object.values(statsData || {}).reduce((sum, item) => sum + (((item && item.dogru) || 0) + ((item && item.yanlis) || 0)), 0);

  let totalBadgesEarned = (unlockedBadges || []).length;
  Object.values(badgeCounts || {}).forEach(c => {
    if (c > 1) totalBadgesEarned += (c - 1);
  });

  const LEVEL_THRESHOLDS = [
    { level: 1, title: 'Matematik Çırağı', icon: '/rozets/d5.png', target: 20 },
    { level: 2, title: 'Sayı Ustası', icon: '/rozets/d9.png', target: 50 },
    { level: 3, title: 'Geometri Mimarı', icon: '/rozets/d10.png', target: 100 },
    { level: 4, title: 'Matematik Dâhisi', icon: '/rozets/d11.png', target: 180 },
    { level: 5, title: 'Şampiyon Kaptan', icon: '/rozets/d12.png', target: 280 },
    { level: 6, title: 'Galaksi Efsanesi', icon: '/rozets/d13.png', target: 400 },
    { level: 7, title: 'Galaksi Üstadı', icon: '/rozets/d14.png', target: 550 },
    { level: 8, title: 'Kozmik Profesör', icon: '/rozets/d15.png', target: 750 },
    { level: 9, title: 'Kuantum Mantıkçısı', icon: '/rozets/d16.png', target: 1000 },
  ];

  let currentLevel = 1;
  let levelTitle = 'Matematik Çırağı';
  let levelIcon = '/rozets/d5.png';
  let prevTarget = 0;
  let currentTarget = 20;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const stage = LEVEL_THRESHOLDS[i];
    if (totalCorrect >= stage.target) {
      currentLevel = stage.level + 1;
      prevTarget = stage.target;
      if (i + 1 < LEVEL_THRESHOLDS.length) {
        currentTarget = LEVEL_THRESHOLDS[i + 1].target;
        levelTitle = LEVEL_THRESHOLDS[i + 1].title;
        levelIcon = LEVEL_THRESHOLDS[i + 1].icon;
      } else {
        const extraLevels = currentLevel - 9;
        currentTarget = 1000 + (extraLevels * 300);
        levelTitle = `Zirve Şampiyon Lvl ${currentLevel}`;
        levelIcon = '👑';
      }
    } else {
      currentLevel = stage.level;
      levelTitle = stage.title;
      levelIcon = stage.icon;
      currentTarget = stage.target;
      break;
    }
  }

  const levelProgress = Math.max(0, totalCorrect - prevTarget);
  const levelNeed = Math.max(1, currentTarget - prevTarget);
  const percent = Math.min(100, Math.round((levelProgress / levelNeed) * 100));

  return {
    totalCorrect,
    totalSolved,
    totalBadgesEarned,
    currentLevel,
    levelTitle,
    levelIcon,
    prevTarget,
    currentTarget,
    percent
  };
};

export default function App() {
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [showOrientationToast, setShowOrientationToast] = useState<string | null>(null);

  const toggleOrientation = () => {
    try {
      const nextState = !isLandscape;
      setIsLandscape(nextState);
      const modeName = nextState ? "Yatay Ekran Modu (Landscape)" : "Dikey Ekran Modu (Portrait)";
      setShowOrientationToast(modeName);
      setTimeout(() => setShowOrientationToast(null), 2500);

      // Try native Screen Orientation API lock
      if (typeof window !== 'undefined' && window.screen && window.screen.orientation && typeof (window.screen.orientation as any).lock === 'function') {
        (window.screen.orientation as any).lock(nextState ? 'landscape' : 'portrait').catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [bgImage, setBgImage] = useState<string>(() => {
    try {
      return localStorage.getItem('userCustomBg') || '/bg-children.jpg';
    } catch {
      return '/bg-children.jpg';
    }
  });

  const [customWinVideo, setCustomWinVideo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('customWinVideo') || null;
    } catch {
      return null;
    }
  });

  const handleCustomVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (result) {
            setCustomWinVideo(result);
            try {
              localStorage.setItem('customWinVideo', result);
            } catch {
              // Ignore
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Ignore
    }
  };

  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bgOpacity');
      return saved ? parseFloat(saved) : 0.22;
    } catch {
      return 0.22;
    }
  });

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (result) {
            setBgImage(result);
            try {
              localStorage.setItem('userCustomBg', result);
            } catch {
              // Ignore
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Ignore
    }
  };

  const [selectedCategoryId, setSelectedCategoryIdState] = useState<string | null>(null);
  const [lastSelectedCategoryId, setLastSelectedCategoryId] = useState<string | null>(null);
  const setSelectedCategoryId = (cat: string | null) => {
    setSelectedCategoryIdState(cat);
    if (cat !== null) {
      setLastSelectedCategoryId(cat);
    }
  };
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [expandedModalCategories, setExpandedModalCategories] = useState<Record<string, boolean>>({});

  const toggleModalCategory = (catId: string) => {
    setExpandedModalCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mathGameSound') !== '0';
    } catch {
      return true;
    }
  });

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'cat-geometri': true,
    'cat-sayilar': true,
    'cat-islemler': true,
    'cat-olcme': true
  });

  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({
    'subgrp-ritmik': true,
    'subgrp-saat': true,
    'subgrp-toplama': true,
    'subgrp-cikarma': true
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const toggleSubGroup = (subId: string) => {
    setOpenSubGroups(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };
  const [currentTopic, setCurrentTopic] = useState<string>('nesne_sayisi');
  const [openedTopics, setOpenedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('openedTopics_v1');
      return saved ? JSON.parse(saved) : ['nesne_sayisi'];
    } catch {
      return ['nesne_sayisi'];
    }
  });
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'gameover'>('welcome');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [lastSelectedGrade, setLastSelectedGrade] = useState<number | null>(1);
  const [showIntro, setShowIntro] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (showIntro && introVideoRef.current) {
      const v = introVideoRef.current;
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    }
  }, [showIntro]);

  // Single Player Game State
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [hasHad3StreakInSession, setHasHad3StreakInSession] = useState(false);
  const [hasFailedAfter3Streak, setHasFailedAfter3Streak] = useState(false);

  // Player Count & Multi-Player Duel State (1 Oyuncu, 2 Oyuncu Düello, 3 Oyuncu Düello)
  const [playerCountMode, setPlayerCountMode] = useState<1 | 2 | 3>(1);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [duelWinnerIndex, setDuelWinnerIndex] = useState<number | null>(null);

  const playSynthSound = (src: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      if (src.includes('coin') || src.includes('para')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (src.includes('tek') || src.includes('dtt')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (src.includes('nextlvl') || src.includes('farklilvl') || src.includes('2ci3lude')) {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.3);
        });
      }
    } catch {
      // Ignore synth audio errors silently
    }
  };

  // Cache audio instances for instant playback across browsers
  const playMp3 = (src: string, onEnded?: () => void) => {
    if (!soundEnabled) return;
    try {
      // Standardize clean path
      const cleanSrc = src.startsWith('/') ? src : `/${src.replace(/^\.\//, '')}`;
      const audio = new Audio(cleanSrc);
      audio.currentTime = 0;
      audio.volume = 1.0;

      let hasEnded = false;
      const triggerEnded = () => {
        if (!hasEnded) {
          hasEnded = true;
          if (onEnded) onEnded();
        }
      };

      audio.onended = () => {
        triggerEnded();
      };

      audio.onerror = () => {
        playSynthSound(cleanSrc);
        setTimeout(triggerEnded, 300);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          playSynthSound(cleanSrc);
          setTimeout(triggerEnded, 300);
        });
      }
    } catch {
      playSynthSound(src);
      if (onEnded) onEnded();
    }
  };

  const speakTurkishText = (text: string) => {
    if (!soundEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Ignore speech synthesis errors
    }
  };

  const playCoinSound = (_starCount: 3 | 5 | 7 = 3) => {
    playMp3('/coin.mp3');
  };

  const playParaSound = (onEnded?: () => void) => {
    playMp3('/para.mp3', onEnded);
  };

  const playTekSound = () => {
    playMp3('/tek.mp3');
  };

  const playParaAndTekSound = () => {
    playMp3('/para.mp3', () => {
      playMp3('/tek.mp3');
    });
  };

  const playCoinAndTekSound = () => {
    playMp3('/coin.mp3', () => {
      playMp3('/tek.mp3');
    });
  };

  const playGoldCoinSound = (_count = 3) => {
    // Sentetik ses kaldırıldı
  };

  const playFireworkSound = () => {
    // Sentetik ses kaldırıldı
  };

  const triggerFireworks = () => {
    // Konfeti efekti performans ve PC kasmasını önlemek için devre dışı bırakıldı
  };
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionData | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<(string | number)[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(10);

  const isTimedTopic = (topicKey: string) => {
    return topicKey === 'sureli_toplama_cikarma' || topicKey === 'sureli_carpma_bolme';
  };

  // End Game Info
  const [gameResult, setGameResult] = useState<{
    reason: 'puan' | 'can';
    score: number;
    livesLeft: number;
    streak?: number;
    topicWinCount?: number;
    isThreeStarWin?: boolean;
  } | null>(null);

  const [topicWinCounts, setTopicWinCounts] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('mathGameTopicWins_v1') || '{}');
    } catch {
      return {};
    }
  });
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [show3DLab, setShow3DLab] = useState(false);
  const [showOtherGamesModal, setShowOtherGamesModal] = useState(false);
  const [showXOXGame, setShowXOXGame] = useState(false);
  const [wordGameType, setWordGameType] = useState<'zit_anlam' | 'es_anlam' | 'ingilizce' | null>(null);
  const [statsModalTab, setStatsModalTab] = useState<'rozetler' | 'istatistik'>('rozetler');
  const [confirmReset, setConfirmReset] = useState(false);
  const [statsData, setStatsData] = useState<Record<string, StatRecord>>(() => {
    try {
      return JSON.parse(localStorage.getItem('mathGameStats_v1') || '{}');
    } catch {
      return {};
    }
  });

  const DEFAULT_GROUP_STATS: GroupStatsRecord = {
    grup1: { id: 'grup1', name: '1. GRUP', badge: '🥇', color: 'blue', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
    grup2: { id: 'grup2', name: '2. GRUP', badge: '🥈', color: 'rose', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
    grup3: { id: 'grup3', name: '3. GRUP', badge: '🥉', color: 'emerald', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
  };

  const [groupStatsData, setGroupStatsData] = useState<GroupStatsRecord>(() => {
    try {
      const raw = localStorage.getItem('mathGameGroupStats_v1');
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return DEFAULT_GROUP_STATS;
  });

  const totalCorrect = Object.values(statsData).reduce<number>((sum, item) => sum + ((item as StatRecord)?.dogru || 0), 0);
  const totalCoins = totalCorrect * 10;

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mathGameBadges_v1') || '[]');
    } catch {
      return [];
    }
  });
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('mathGameBadgeCounts_v1') || '{}');
    } catch {
      return {};
    }
  });
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<BadgeItem | null>(null);

  const incrementBadgeCount = (badgeId: string, amount = 1) => {
    try {
      const existing: Record<string, number> = JSON.parse(localStorage.getItem('mathGameBadgeCounts_v1') || '{}');
      const updated = {
        ...existing,
        [badgeId]: (existing[badgeId] || 0) + amount
      };
      localStorage.setItem('mathGameBadgeCounts_v1', JSON.stringify(updated));
      setBadgeCounts(updated);
    } catch {
      // Ignore
    }
  };

  const checkAndUnlockBadges = (
    currentStats: Record<string, StatRecord>,
    curStreak: number,
    curScore: number,
    curLives: number,
    isWin?: boolean
  ) => {
    try {
      const existing: string[] = JSON.parse(localStorage.getItem('mathGameBadges_v1') || '[]');
      const newlyUnlocked: string[] = [...existing];
      let lastUnlockedBadge: BadgeItem | null = null;

      BADGES.forEach(badge => {
        if (!newlyUnlocked.includes(badge.id)) {
          const isUnlocked = badge.checkUnlocked(
            currentStats,
            curStreak,
            curScore,
            curLives,
            isWin,
            newlyUnlocked.length
          );
          if (isUnlocked) {
            newlyUnlocked.push(badge.id);
            lastUnlockedBadge = badge;
          }
        }
      });

      if (newlyUnlocked.length > existing.length) {
        localStorage.setItem('mathGameBadges_v1', JSON.stringify(newlyUnlocked));
        setUnlockedBadges(newlyUnlocked);
        if (lastUnlockedBadge) {
          setNewlyUnlockedBadge(lastUnlockedBadge);
          triggerFireworks();
          setTimeout(() => {
            setNewlyUnlockedBadge(null);
          }, 4500);
        }
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    checkAndUnlockBadges(statsData, streak, score, lives);
  }, [statsData]);

  // Play hata.mp3 audio whenever trytry2.mp4 defeat video screen is shown
  useEffect(() => {
    if (gameState === 'gameover' && gameResult && gameResult.reason !== 'puan') {
      playMp3('/hata.mp3');
    }
  }, [gameState, gameResult]);

  // 10-Second Countdown Timer for Timed Challenge Activities (Single Player & Multi-Player)
  useEffect(() => {
    if (gameState !== 'playing' || !isTimedTopic(currentTopic) || feedbackState !== 'none' || !currentQuestionData) {
      return;
    }

    if (questionTimeLeft <= 0) {
      playWrongSound();
      setFeedbackState('wrong');
      kaydetIstatistik(currentTopic, false);
      setStreak(0);

      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => {
            setGameResult({ reason: 'can', score, livesLeft: 0 });
            setGameState('gameover');
          }, 800);
        } else {
          setTimeout(() => {
            nextQuestion(currentTopic);
          }, 900);
        }
        return nextLives;
      });
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentTopic, feedbackState, questionTimeLeft, currentQuestionData, score]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Handle Theme Toggle
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('mathGameSound', next ? '1' : '0');
  };

  // Sound Synthesizer (Cevap tıklama ve geri bildirim sesleri)
  const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', delay = 0, vol = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime + delay;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch {
      // Audio play failed or blocked
    }
  };

  const playCorrectSound = () => {
    playTone(660, 0.12, 'sine', 0, 0.15);
    playTone(880, 0.16, 'sine', 0.09, 0.15);
  };

  const playWrongSound = () => {
    playTone(200, 0.28, 'sawtooth', 0, 0.10);
  };

  const playWinSound = () => {
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.22, 'sine', i * 0.14, 0.16));
  };

  const playDttSound = () => {
    playMp3('/dtt.mp3');
  };

  const playNextLvlSound = () => {
    playMp3('/nextlvl.mp3');
  };

  const playFarkliLvlSound = () => {
    playMp3('/farklilvl.mp3');
  };

  // Topics configuration (1., 2., 3. ve 4. Sınıf Seviyeleri)
  const topics: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
    ...topics4thGrade,
    ...topics3rdGrade,
    ...topics2ndGrade,
    ...topics1stGrade,
    en_yakin_onluk: topics2ndGrade.en_yakin_onluk || {
      title: "En Yakın Onluğa Yuvarlama",
      desc: "Sayıları en yakın onluğa yuvarlama alıştırması yapıyoruz.",
      generate: () => {
        const sayi = Math.floor(Math.random() * 89) + 11;
        const birler = sayi % 10;
        const onlar = Math.floor(sayi / 10);
        const dogruOnluk = birler >= 5 ? (onlar + 1) * 10 : onlar * 10;
        const yanlislar = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].filter(o => o !== dogruOnluk).sort(() => 0.5 - Math.random()).slice(0, 3);
        return {
          question: `${sayi} sayısı hangi onluğa daha yakındır?`,
          correct: dogruOnluk,
          wrong: yanlislar,
          isLong: true
        };
      }
    }
  };

  const generateUniqueQuestion = (targetTopicKey?: string): QuestionData => {
    const topicToUse = targetTopicKey || currentTopic;
    const currentGradeTopics = selectedGrade === 1 
      ? topics1stGrade 
      : selectedGrade === 3 
      ? topics3rdGrade 
      : selectedGrade === 4
      ? topics4thGrade
      : topics2ndGrade;
    const topicConfig = (currentGradeTopics as Record<string, { title: string; desc: string; generate: () => QuestionData }>)[topicToUse] || topics[topicToUse] || topics['nesne_sayisi'] || topics['g4_sayi_okuma_yazma'] || topics['g3_uc_basamakli_okuma_yazma'];
    let data: QuestionData;
    let imza: string;
    let deneme = 0;
    do {
      data = topicConfig.generate();
      imza = data.signature || `${JSON.stringify(data.question)}||${JSON.stringify(data.correct)}`;
      deneme++;
    } while (askedQuestions.includes(imza) && deneme < 40);

    setAskedQuestions(prev => [...prev, imza]);
    return data;
  };

  const generateQuestionForPlayer = (targetTopicKey: string, askedList: string[]) => {
    const topicToUse = targetTopicKey || currentTopic;
    const currentGradeTopics = selectedGrade === 1 
      ? topics1stGrade 
      : selectedGrade === 3 
      ? topics3rdGrade 
      : selectedGrade === 4
      ? topics4thGrade
      : topics2ndGrade;
    const topicConfig = (currentGradeTopics as Record<string, { title: string; desc: string; generate: () => QuestionData }>)[topicToUse] || topics[topicToUse] || topics['nesne_sayisi'] || topics['g4_sayi_okuma_yazma'] || topics['g3_uc_basamakli_okuma_yazma'];
    let data: QuestionData;
    let imza: string;
    let deneme = 0;
    do {
      data = topicConfig.generate();
      imza = data.signature || `${JSON.stringify(data.question)}||${JSON.stringify(data.correct)}`;
      deneme++;
    } while (askedList.includes(imza) && deneme < 40);

    const rawOptions = [data.correct, ...data.wrong];
    const shuffled = [...rawOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return { data, signature: imza, shuffledOptions: shuffled };
  };

  const setQuestionAndPrepareOptions = (data: QuestionData) => {
    setCurrentQuestionData(data);
    const rawOptions = [data.correct, ...data.wrong];
    // Fisher-Yates shuffle to randomly order options ONCE per question
    const shuffled = [...rawOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledOptions(shuffled);
  };

  const nextQuestion = (targetTopicKey?: string) => {
    setSelectedOption(null);
    setFeedbackState('none');
    setQuestionTimeLeft(10);
    const data = generateUniqueQuestion(targetTopicKey);
    setQuestionAndPrepareOptions(data);
  };

  const selectTopicAndStart = (topicKey: string) => {
    if (topicKey !== currentTopic) {
      playFarkliLvlSound();
    }
    setCurrentTopic(topicKey);
    setQuestionTimeLeft(10);
    setHasHad3StreakInSession(false);
    setHasFailedAfter3Streak(false);
    setOpenedTopics(prev => {
      if (!prev.includes(topicKey)) {
        const next = [...prev, topicKey];
        localStorage.setItem('openedTopics_v1', JSON.stringify(next));
        return next;
      }
      return prev;
    });
    setScore(0);
    setLives(3);
    setStreak(0);
    setAskedQuestions([]);
    setSelectedOption(null);
    setFeedbackState('none');
    setDuelWinnerIndex(null);

    // Initialize Players based on playerCountMode (1, 2, or 3)
    const initialPlayers: PlayerData[] = [];
    const playerConfigs = [
      {
        id: 1,
        name: "1. GRUP",
        avatar: "🥇 1. GRUP",
        colorTheme: {
          bg: "from-blue-950/90 via-indigo-950/90 to-slate-950/90",
          border: "border-blue-400",
          text: "text-blue-200",
          badge: "bg-blue-600 text-white",
          headerBg: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700"
        }
      },
      {
        id: 2,
        name: "2. GRUP",
        avatar: "🥈 2. GRUP",
        colorTheme: {
          bg: "from-rose-950/90 via-red-950/90 to-slate-950/90",
          border: "border-rose-400",
          text: "text-rose-200",
          badge: "bg-rose-600 text-white",
          headerBg: "bg-gradient-to-r from-rose-600 via-red-600 to-amber-700"
        }
      },
      {
        id: 3,
        name: "3. GRUP",
        avatar: "🥉 3. GRUP",
        colorTheme: {
          bg: "from-emerald-950/90 via-teal-950/90 to-slate-950/90",
          border: "border-emerald-400",
          text: "text-emerald-200",
          badge: "bg-emerald-600 text-white",
          headerBg: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700"
        }
      }
    ];

    let cumulativeAsked: string[] = [];
    for (let i = 0; i < playerCountMode; i++) {
      const qRes = generateQuestionForPlayer(topicKey, cumulativeAsked);
      cumulativeAsked.push(qRes.signature);
      initialPlayers.push({
        ...playerConfigs[i],
        score: 0,
        lives: 3,
        streak: 0,
        currentQuestionData: qRes.data,
        shuffledOptions: qRes.shuffledOptions,
        selectedOption: null,
        feedbackState: 'none',
        askedQuestions: [qRes.signature]
      });
    }

    setPlayers(initialPlayers);

    // Single player setup
    if (playerCountMode === 1 && initialPlayers[0]?.currentQuestionData) {
      setCurrentQuestionData(initialPlayers[0].currentQuestionData);
      setShuffledOptions(initialPlayers[0].shuffledOptions);
    }

    setGameState('playing');
  };

  const handleForwardNavigation = () => {
    // 1. If playing, move to next question
    if (gameState === 'playing') {
      if (playerCountMode > 1) {
        setPlayers(prev => prev.map(p => {
          const qRes = generateQuestionForPlayer(currentTopic, p.askedQuestions);
          return {
            ...p,
            currentQuestionData: qRes.data,
            shuffledOptions: qRes.shuffledOptions,
            selectedOption: null,
            feedbackState: 'none',
            askedQuestions: [...p.askedQuestions, qRes.signature]
          };
        }));
      } else {
        nextQuestion(currentTopic);
      }
      return;
    }

    // 2. If on Grade selection screen
    if (selectedGrade === null) {
      const g = lastSelectedGrade || 1;
      setSelectedGrade(g);
      setLastSelectedGrade(g);
      return;
    }

    // 3. If in Grade screen and no category selected
    if (selectedCategoryId === null) {
      const cat = lastSelectedCategoryId || (selectedGrade === 4 ? 'g4_tema1' : selectedGrade === 3 ? 'g3_tema1' : 'sayilar');
      setSelectedCategoryId(cat);
      setLastSelectedCategoryId(cat);
      return;
    }

    // 4. If in category view and topic modal not open
    if (!showTopicModal && !show3DLab && !showOtherGamesModal && !showXOXGame && wordGameType === null) {
      setShowTopicModal(true);
      return;
    }

    // 5. If topic modal is open, start game
    if (showTopicModal) {
      setShowTopicModal(false);
      selectTopicAndStart(currentTopic);
      setGameState('playing');
      return;
    }
  };

  const kaydetGrupIstatistik = (pIndex: number, topicId: string, dogruMu: boolean) => {
    try {
      const groupId = `grup${pIndex + 1}`;
      const raw = localStorage.getItem('mathGameGroupStats_v1');
      let currentGroupStats: GroupStatsRecord = raw ? JSON.parse(raw) : DEFAULT_GROUP_STATS;

      if (!currentGroupStats[groupId]) {
        const names = ['1. GRUP', '2. GRUP', '3. GRUP'];
        const badges = ['🥇', '🥈', '🥉'];
        const colors = ['blue', 'rose', 'emerald'];
        currentGroupStats[groupId] = {
          id: groupId,
          name: names[pIndex] || `${pIndex + 1}. GRUP`,
          badge: badges[pIndex] || '⭐',
          color: colors[pIndex] || 'amber',
          dogru: 0,
          yanlis: 0,
          wins: 0,
          topicStats: {}
        };
      }

      if (!currentGroupStats[groupId].topicStats) {
        currentGroupStats[groupId].topicStats = {};
      }

      if (!currentGroupStats[groupId].topicStats[topicId]) {
        currentGroupStats[groupId].topicStats[topicId] = { dogru: 0, yanlis: 0 };
      }

      if (dogruMu) {
        currentGroupStats[groupId].dogru = (currentGroupStats[groupId].dogru || 0) + 1;
        currentGroupStats[groupId].topicStats[topicId].dogru += 1;
      } else {
        currentGroupStats[groupId].yanlis = (currentGroupStats[groupId].yanlis || 0) + 1;
        currentGroupStats[groupId].topicStats[topicId].yanlis += 1;
      }

      localStorage.setItem('mathGameGroupStats_v1', JSON.stringify(currentGroupStats));
      setGroupStatsData({ ...currentGroupStats });
    } catch (e) {
      console.error('Group stat save error:', e);
    }
  };

  const kaydetGrupGalibiyet = (winnerIdx: number) => {
    try {
      const groupId = `grup${winnerIdx + 1}`;
      const raw = localStorage.getItem('mathGameGroupStats_v1');
      const currentGroupStats: GroupStatsRecord = raw ? JSON.parse(raw) : DEFAULT_GROUP_STATS;

      if (currentGroupStats[groupId]) {
        currentGroupStats[groupId].wins = (currentGroupStats[groupId].wins || 0) + 1;
        localStorage.setItem('mathGameGroupStats_v1', JSON.stringify(currentGroupStats));
        setGroupStatsData({ ...currentGroupStats });
      }
    } catch (e) {
      console.error('Group win save error:', e);
    }
  };

  const kaydetIstatistik = (topicId: string, dogruMu: boolean) => {
    try {
      const stats = JSON.parse(localStorage.getItem('mathGameStats_v1') || '{}') as Record<string, StatRecord>;
      if (!stats[topicId]) stats[topicId] = { dogru: 0, yanlis: 0 };
      
      const oldLevelInfo = getPlayerLevelInfo(stats, badgeCounts, unlockedBadges);

      if (dogruMu) stats[topicId].dogru++;
      else stats[topicId].yanlis++;

      const newLevelInfo = getPlayerLevelInfo(stats, badgeCounts, unlockedBadges);
      if (dogruMu && newLevelInfo.currentLevel > oldLevelInfo.currentLevel) {
        playNextLvlSound();
      }

      localStorage.setItem('mathGameStats_v1', JSON.stringify(stats));
      setStatsData(stats);
    } catch {
      // Ignore
    }
  };

  const handleAnswer = (option: string | number) => {
    if (feedbackState !== 'none' || !currentQuestionData) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestionData.correct;
    kaydetIstatistik(currentTopic, isCorrect);

    if (isCorrect) {
      playCorrectSound();
      setFeedbackState('correct');
      setScore(prev => prev + 1);
      
      const newStreak = streak + 1;
      setStreak(newStreak);

      incrementBadgeCount('ilk_dogru');
      if (newStreak % 3 === 0) {
        incrementBadgeCount('seri_3');
      }
      if (newStreak % 5 === 0) {
        incrementBadgeCount('seri_5');
      }
      if (newStreak % 7 === 0) {
        incrementBadgeCount('seri_7');
      }

      if (newStreak === 3) {
        triggerFireworks();
        playParaAndTekSound();
        if (hasFailedAfter3Streak) {
          setHasFailedAfter3Streak(false);
        } else {
          setHasHad3StreakInSession(true);
        }
      } else if (newStreak === 5) {
        triggerFireworks();
        playCoinAndTekSound();
      } else if (newStreak === 7) {
        triggerFireworks();
        playParaAndTekSound();
      }

      const nextScore = score + 1;
      checkAndUnlockBadges(statsData, newStreak, nextScore, lives, nextScore >= 10);

      if (nextScore >= 10) {
        // Level tamamlandığında dtt.mp3 sesini hemen çalıştır
        playDttSound();

        incrementBadgeCount('tam_puan');
        if (lives === 3) {
          incrementBadgeCount('kusursuz');
        }

        // Increment topic win count (repeat success counter)
        const prevWins = topicWinCounts[currentTopic] || 0;
        const newWins = prevWins + 1;
        const updatedTopicWins = { ...topicWinCounts, [currentTopic]: newWins };
        try {
          localStorage.setItem('mathGameTopicWins_v1', JSON.stringify(updatedTopicWins));
        } catch {
          // Ignore
        }
        setTopicWinCounts(updatedTopicWins);

        // Success repeated for the 3rd time (or multiples of 3)
        const isThreeStarWin = newWins >= 3 || newWins % 3 === 0;

        setTimeout(() => {
          playWinSound();
          playDttSound();
          checkAndUnlockBadges(statsData, newStreak, nextScore, lives, true);
          setGameResult({
            reason: 'puan',
            score: nextScore,
            livesLeft: lives,
            streak: newStreak,
            topicWinCount: newWins,
            isThreeStarWin
          });
          setGameState('gameover');
        }, 800);
        return;
      }
    } else {
      playWrongSound();
      setFeedbackState('wrong');
      setLives(prev => prev - 1);
      if (hasHad3StreakInSession) {
        setHasFailedAfter3Streak(true);
      }
      setStreak(0);

      const nextLives = lives - 1;
      if (nextLives <= 0) {
        setTimeout(() => {
          setGameResult({ reason: 'can', score, livesLeft: 0 });
          setGameState('gameover');
        }, 800);
        return;
      }
    }

    setTimeout(() => {
      nextQuestion(currentTopic);
    }, 900);
  };

  const handlePlayerAnswer = (pIndex: number, option: string | number) => {
    if (playerCountMode === 1) {
      handleAnswer(option);
      return;
    }

    if (pIndex >= players.length) return;
    const targetPlayer = players[pIndex];
    if (targetPlayer.feedbackState !== 'none' || !targetPlayer.currentQuestionData || targetPlayer.lives <= 0) return;

    const isCorrect = option === targetPlayer.currentQuestionData.correct;
    kaydetIstatistik(currentTopic, isCorrect);
    kaydetGrupIstatistik(pIndex, currentTopic, isCorrect);

    if (isCorrect) {
      playCorrectSound();
      const newScore = targetPlayer.score + 1;
      const newStreak = targetPlayer.streak + 1;

      setPlayers(prev => {
        const updated = [...prev];
        if (pIndex < updated.length) {
          updated[pIndex] = {
            ...updated[pIndex],
            score: newScore,
            streak: newStreak,
            selectedOption: option,
            feedbackState: 'correct'
          };
        }
        return updated;
      });

      if (newScore >= 10) {
        playDttSound();
        playWinSound();
        triggerFireworks();
        setDuelWinnerIndex(pIndex);
        kaydetGrupGalibiyet(pIndex);
        setTimeout(() => {
          setGameResult({
            reason: 'puan',
            score: newScore,
            livesLeft: targetPlayer.lives,
            streak: newStreak
          });
          setGameState('gameover');
        }, 700);
        return;
      }

      setTimeout(() => {
        setPlayers(prev => {
          if (pIndex >= prev.length) return prev;
          const currentP = prev[pIndex];
          const qRes = generateQuestionForPlayer(currentTopic, currentP.askedQuestions);
          const updated = [...prev];
          updated[pIndex] = {
            ...currentP,
            currentQuestionData: qRes.data,
            shuffledOptions: qRes.shuffledOptions,
            selectedOption: null,
            feedbackState: 'none',
            askedQuestions: [...currentP.askedQuestions, qRes.signature]
          };
          return updated;
        });
      }, 800);

    } else {
      playWrongSound();
      const newLives = targetPlayer.lives - 1;

      setPlayers(prev => {
        const updated = [...prev];
        if (pIndex < updated.length) {
          updated[pIndex] = {
            ...updated[pIndex],
            lives: newLives,
            streak: 0,
            selectedOption: option,
            feedbackState: 'wrong'
          };
        }
        return updated;
      });

      setTimeout(() => {
        setPlayers(prev => {
          const alivePlayers = prev.filter(p => p.lives > 0);
          if (alivePlayers.length <= 1) {
            let winnerIdx = 0;
            if (alivePlayers.length === 1) {
              winnerIdx = prev.findIndex(p => p.id === alivePlayers[0].id);
            } else {
              const sorted = [...prev].sort((a, b) => b.score - a.score);
              winnerIdx = prev.findIndex(p => p.id === sorted[0].id);
            }
            if (winnerIdx < 0) winnerIdx = 0;

            playDttSound();
            playWinSound();
            triggerFireworks();
            setDuelWinnerIndex(winnerIdx);
            kaydetGrupGalibiyet(winnerIdx);
            setGameResult({
              reason: 'can',
              score: prev[winnerIdx]?.score || 0,
              livesLeft: prev[winnerIdx]?.lives || 0
            });
            setGameState('gameover');
            return prev;
          }

          if (newLives > 0 && pIndex < prev.length) {
            const currentP = prev[pIndex];
            const qRes = generateQuestionForPlayer(currentTopic, currentP.askedQuestions);
            const updated = [...prev];
            updated[pIndex] = {
              ...currentP,
              currentQuestionData: qRes.data,
              shuffledOptions: qRes.shuffledOptions,
              selectedOption: null,
              feedbackState: 'none',
              askedQuestions: [...currentP.askedQuestions, qRes.signature]
            };
            return updated;
          }
          return prev;
        });
      }, 800);
    }
  };

  const optionsList = shuffledOptions;

  return (
    <div className="relative h-[100dvh] bg-gradient-to-br from-sky-100 via-blue-50 to-amber-50/70 dark:from-[#0B132B] dark:via-blue-950 dark:to-slate-950 text-blue-950 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 overflow-hidden select-none">
      {/* SUBTLE POSITIVE BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/intro2.png" 
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          style={{ opacity: 1 }}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-300"
        />
      </div>

      {/* GLOBAL HEADER BAR - 3D CARTOON GAME UI STYLE WITH ALL BUTTONS GROUPED AND CENTERED (HIDDEN ON INTRO) */}
      {!showIntro && (
        <header className="bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b-3 border-yellow-400 dark:border-yellow-500/80 px-1 xs:px-2 sm:px-4 py-0.5 sm:py-1 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 shadow-lg z-[100] relative shrink-0 w-full max-w-full overflow-x-auto no-scrollbar">
        {/* 1. ANA SAYFA */}
        <button
          onClick={() => {
            setGameState('welcome');
            setSelectedCategoryId(null);
            setShowTopicModal(false);
            setShowStatsModal(false);
            setShow3DLab(false);
            setShowOtherGamesModal(false);
            setShowXOXGame(false);
            setWordGameType(null);
            setSelectedGrade(null);
          }}
          title="Ana Sayfaya Dön"
          className="relative group w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] shrink-0"
        >
          <img 
            src="/ana.png" 
            alt="Ana Sayfa" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>

        {/* 2. GERİ */}
        <button
          onClick={() => {
            if (wordGameType !== null) {
              setWordGameType(null);
              return;
            }
            if (showXOXGame) {
              setShowXOXGame(false);
              return;
            }
            if (showOtherGamesModal) {
              setShowOtherGamesModal(false);
              return;
            }
            if (show3DLab) {
              setShow3DLab(false);
              return;
            }
            if (showStatsModal) {
              setShowStatsModal(false);
              return;
            }
            if (showTopicModal) {
              setShowTopicModal(false);
              return;
            }
            if (gameState === 'playing') {
              setGameState('welcome');
              return;
            }
            if (selectedCategoryId !== null) {
              setSelectedCategoryId(null);
              return;
            }
            if (selectedGrade !== null) {
              setSelectedGrade(null);
              return;
            }
          }}
          title="Bir önceki menüye dön"
          className="relative group w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] shrink-0"
        >
          <img 
            src="/geri.png" 
            alt="Geri" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>

        {/* 3. İLERİ */}
        <button
          onClick={handleForwardNavigation}
          title="İleri git"
          className="relative group w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] shrink-0"
        >
          <img 
            src="/ileri.png" 
            alt="İleri" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>

        {/* 4. SES */}
        <button
          onClick={toggleSound}
          className={`relative group w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] shrink-0 ${!soundEnabled ? 'opacity-40 grayscale' : ''}`}
          title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
        >
          <img 
            src="/ses.png" 
            alt="Ses" 
            className="w-full h-full object-contain pointer-events-none" 
          />
          {!soundEnabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-6 sm:w-7 h-1 bg-red-600/90 rotate-45 rounded-full shadow-xs" />
            </div>
          )}
        </button>

        {/* 5. İSTATİSTİK */}
        <button
          onClick={() => {
            try {
              setStatsData(JSON.parse(localStorage.getItem('mathGameStats_v1') || '{}'));
            } catch {}
            setShowStatsModal(true);
          }}
          className="relative group w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] shrink-0"
          title="İlerleme ve İstatistikler"
        >
          <img 
            src="/ist.png" 
            alt="İstatistik" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>
      </header>
      )}

      {/* SCREEN ORIENTATION TOAST BADGE */}
      {showOrientationToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-500 text-white font-black px-4 py-2 rounded-full border-2 border-white shadow-2xl animate-bounce flex items-center gap-2 text-xs sm:text-sm">
          <GlossyScreenRotateIcon isLandscape={isLandscape} size={20} />
          <span>{showOrientationToast}</span>
        </div>
      )}

      {/* MAIN SCREEN ROUTING - GRADE SELECTION (1, 2, 3, 4) OR GRADE-SPECIFIC DASHBOARD */}
      {gameState === 'welcome' && (
        <div className="flex-1 flex flex-col items-center pt-1 sm:pt-2 pb-6 px-2 sm:px-4 md:px-6 overflow-y-auto w-full min-h-0">
          {selectedGrade === null ? (
            /* GRADE / CLASS SELECTION SCREEN (1. SINIF, 2. SINIF, 3. SINIF, 4. SINIF) */
            <div className="max-w-4xl xl:max-w-5xl w-full mx-auto flex flex-col items-center justify-center my-auto py-1">
              {/* COMPACT CLEAN TITLE BADGE */}
              <div className="w-full flex items-center justify-center mb-1.5 sm:mb-2 px-2 shrink-0">
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-blue-950 font-black text-xs sm:text-sm md:text-base tracking-wider uppercase shadow-md border-2 border-white drop-shadow-sm">
                  <Sparkles size={14} className="text-blue-950 shrink-0" />
                  <span>Sınıfını Seç ve Başla</span>
                  <Sparkles size={14} className="text-blue-950 shrink-0" />
                </div>
              </div>

              {/* 4 GRADE CARDS IN 2X2 GRID + 5. ITEM 'DİĞER OYUNLAR' (ENLARGED GRADE BUTTONS, COMPACT 5TH ROW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5 md:gap-3 w-full max-w-4xl xl:max-w-5xl mx-auto py-1">
                {/* 1. SINIF */}
                <button
                  onClick={() => {
                    playMp3('/coin.mp3');
                    setSelectedGrade(1);
                    setLastSelectedGrade(1);
                  }}
                  className="group relative w-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-amber-300 shadow-[0_6px_18px_rgba(234,88,12,0.4),0_2px_0_rgba(0,0,0,0.25)] hover:shadow-[0_10px_26px_rgba(234,88,12,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-yellow-300/50 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-md border-2 sm:border-3 border-white shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_1.png" alt="1. Sınıf" className="w-full h-full object-cover scale-[1.35] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-yellow-200 flex items-center gap-1 drop-shadow-xs">
                      🌱 6 ANA KATEGORİ HAZIR
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      1. Sınıf Matematik
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-amber-100 mt-0.5 drop-shadow-xs line-clamp-1">
                      Geometri, Sayılar, İşlemler, Veri, Zeka Oyunları & 3D Lab
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>

                {/* 2. SINIF - FULLY ACTIVE (6 ANA KONU & TÜM OYUNLAR) */}
                <button
                  onClick={() => {
                    playMp3('/farklilvl.mp3');
                    setSelectedGrade(2);
                    setLastSelectedGrade(2);
                  }}
                  className="group relative w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-emerald-300 shadow-[0_6px_16px_rgba(16,185,129,0.35),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-emerald-300/40 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-2 sm:border-3 border-white/80 shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_2.png" alt="2. Sınıf" className="w-full h-full object-cover scale-[1.45] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-emerald-200 flex items-center gap-1 drop-shadow-xs">
                      🔥 6 ANA KONU & OYUNLAR HAZIR
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      2. Sınıf Matematik
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-emerald-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                      Geometri, Sayılar, İşlemler, Veri, Zeka Oyunları & 3D Lab
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>

                {/* 3. SINIF */}
                <button
                  onClick={() => {
                    playMp3('/coin.mp3');
                    setSelectedGrade(3);
                    setLastSelectedGrade(3);
                  }}
                  className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-white/90 shadow-[0_6px_16px_rgba(147,51,234,0.35),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_10px_24px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-purple-300/40 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-2 sm:border-3 border-white/80 shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_3.png" alt="3. Sınıf" className="w-full h-full object-cover scale-[1.35] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-purple-200 flex items-center gap-1 drop-shadow-xs">
                      🚀 İLERİ SEVİYE
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      3. Sınıf Matematik
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-purple-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                      3 Basamaklı Sayılar, Çarpma, Bölme, Kesirler & Problemler
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>

                {/* 4. SINIF */}
                <button
                  onClick={() => {
                    playMp3('/farklilvl.mp3');
                    setSelectedGrade(4);
                    setLastSelectedGrade(4);
                  }}
                  className="group relative w-full bg-gradient-to-r from-sky-600 via-indigo-700 to-purple-800 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-amber-300 shadow-[0_6px_18px_rgba(79,70,229,0.4),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_10px_26px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-cyan-300/40 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-md border-2 sm:border-3 border-white shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_4.png" alt="4. Sınıf" className="w-full h-full object-cover scale-[1.45] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1 drop-shadow-xs">
                      👑 4 ANA TEMA & UZMAN SEVİYE
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      4. Sınıf Matematik
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-cyan-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                      4-6 Basamaklı Sayılar, Kesirler, Dört İşlem, Geometri & Olasılık
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>

                {/* 5. MADDE: DİĞER OYUNLAR */}
                <button
                  onClick={() => {
                    playMp3('/coin.mp3');
                    setShowOtherGamesModal(true);
                  }}
                  className="group relative w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-pink-300 shadow-[0_6px_18px_rgba(217,70,239,0.4),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_10px_26px_rgba(217,70,239,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-pink-300/40 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-md border-2 sm:border-3 border-white shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_5.png" alt="5. Diğer Oyunlar" className="w-full h-full object-cover scale-[1.35] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-pink-200 flex items-center gap-1 drop-shadow-xs">
                      🎲 5. BÖLÜM & DİĞER OYUNLAR
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      5. Diğer Oyunlar
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-pink-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                      XOX & Matematik, Zıt & Eş Anlam, Hafıza
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>

                {/* 6. MADDE: İNGİLİZCE OYUNLAR */}
                <button
                  onClick={() => {
                    playMp3('/coin.mp3');
                    setWordGameType('ingilizce');
                  }}
                  className="group relative w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 text-white rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-2 sm:p-3 md:p-4 border-3 sm:border-4 border-sky-300 shadow-[0_6px_18px_rgba(14,165,233,0.4),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_10px_26px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-3.5 md:gap-4 overflow-hidden cursor-pointer ring-2 sm:ring-4 ring-sky-300/40 min-h-[64px] sm:min-h-[78px] md:min-h-[86px]"
                >
                  <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none" />
                  <div className="relative shrink-0 z-10 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-md border-2 sm:border-3 border-white shadow-md flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <img src="/icon_6.png" alt="6. İngilizce Oyunlar" className="w-full h-full object-cover scale-[1.35] filter drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left min-w-0 z-10 py-0.5">
                    <div className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-sky-200 flex items-center gap-1 drop-shadow-xs">
                      🇬🇧 6. BÖLÜM & KELİME OYUNLARI
                    </div>
                    <h3 className="font-black text-sm sm:text-lg md:text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider">
                      6. İngilizce Oyunlar
                    </h3>
                    <p className="text-[9px] sm:text-xs md:text-sm font-extrabold text-sky-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                      2., 3. ve 4. Sınıflar
                    </p>
                  </div>
                  <div className="z-10 shrink-0 relative w-[54px] h-[22px] sm:w-[74px] sm:h-[30px] md:w-[90px] md:h-[38px] group-hover:scale-105 transition-all filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] flex items-center justify-center">
                    <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                  </div>
                </button>
              </div>
            </div>
          ) : selectedCategoryId === null ? (
            /* CATEGORY CARDS SCREEN */
            <div className="max-w-4xl w-full mx-auto flex flex-col items-center py-0">
              {/* CENTERED GRADE ICON (20% REDUCED SIZE) */}
              <div className="w-full flex items-center justify-center mb-1 sm:mb-1.5 px-1">
                <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-2xl bg-white/20 backdrop-blur-md p-1 sm:p-1.5 border-2 sm:border-3 border-white/80 shadow-[0_6px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center transform hover:scale-105 transition-transform shrink-0">
                  <img
                    src={selectedGrade === 1 ? '/icon_1.png' : selectedGrade === 3 ? '/icon_3.png' : selectedGrade === 4 ? '/icon_4.png' : '/icon_2.png'}
                    alt={`${selectedGrade}. Sınıf`}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>

              {/* 1 OYUNCU, 2 OYUNCU DÜELLO, 3 OYUNCU DÜELLO SEÇİM ALANI */}
              <div className="w-full max-w-2xl mx-auto mb-0.5 sm:mb-1 flex items-center justify-center gap-1 sm:gap-2 z-20">
                <button
                  type="button"
                  onClick={() => {
                    setPlayerCountMode(1);
                    playMp3('/coin.mp3');
                  }}
                  className={`flex-1 py-1 sm:py-1.5 px-1 sm:px-2.5 rounded-lg sm:rounded-xl font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all transform flex items-center justify-center gap-1 cursor-pointer shadow-md border-2 whitespace-nowrap ${
                    playerCountMode === 1
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-blue-950 border-white shadow-[0_3px_10px_rgba(245,158,11,0.6)] scale-105 ring-2 ring-amber-300'
                      : 'bg-slate-800/85 text-white/80 border-slate-600 hover:bg-slate-700/90'
                  }`}
                >
                  <span className="text-xs sm:text-sm shrink-0">👤</span>
                  <span className="whitespace-nowrap">1 OYUNCU</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPlayerCountMode(2);
                    playMp3('/coin.mp3');
                  }}
                  className={`flex-1 py-1 sm:py-1.5 px-1 sm:px-2.5 rounded-lg sm:rounded-xl font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all transform flex items-center justify-center gap-1 cursor-pointer shadow-md border-2 whitespace-nowrap ${
                    playerCountMode === 2
                      ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white border-white shadow-[0_3px_10px_rgba(225,29,72,0.6)] scale-105 ring-2 ring-rose-300'
                      : 'bg-slate-800/85 text-white/80 border-slate-600 hover:bg-slate-700/90'
                  }`}
                >
                  <span className="text-xs sm:text-sm shrink-0">⚔️</span>
                  <span className="whitespace-nowrap">2 OYUNCU KAPIŞMA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPlayerCountMode(3);
                    playMp3('/coin.mp3');
                  }}
                  className={`flex-1 py-1 sm:py-1.5 px-1 sm:px-2.5 rounded-lg sm:rounded-xl font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider transition-all transform flex items-center justify-center gap-1 cursor-pointer shadow-md border-2 whitespace-nowrap ${
                    playerCountMode === 3
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-white shadow-[0_3px_10px_rgba(16,185,129,0.6)] scale-105 ring-2 ring-emerald-300'
                      : 'bg-slate-800/85 text-white/80 border-slate-600 hover:bg-slate-700/90'
                  }`}
                >
                  <span className="text-xs sm:text-sm shrink-0">⚔️⚔️</span>
                  <span className="whitespace-nowrap">3 OYUNCU KAPIŞMA</span>
                </button>
              </div>

              {/* 4. SINIF: 4 MAIN THEME CARDS (2x2 GRID) */}
              {selectedGrade === 4 ? (
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-1 sm:gap-1.5">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
                    {/* TEMA 1: SAYILAR VE NİCELİKLER 1 */}
                    <button
                      onClick={() => setSelectedCategoryId('g4_tema1')}
                      className="group relative w-full bg-gradient-to-br from-blue-500 via-indigo-600 to-sky-600 dark:from-blue-600 dark:via-indigo-700 dark:to-sky-800 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s19.png" alt="Sayılar ve Nicelikler 1" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          1. Sayılar ve Nicelikler (1)
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-blue-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          4-6 Basamaklı Sayılar, Çözümleme & Yuvarlama
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 2: SAYILAR VE NİCELİKLER 2 */}
                    <button
                      onClick={() => setSelectedCategoryId('g4_tema2')}
                      className="group relative w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 dark:from-amber-600 dark:via-orange-700 dark:to-red-700 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s15.png" alt="Sayılar ve Nicelikler 2" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          2. Sayılar ve Nicelikler (2)
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-amber-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Kesirler, Birim Kesirler & Ölçme Birimleri
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */}
                    <button
                      onClick={() => setSelectedCategoryId('g4_tema3')}
                      className="group relative w-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-700 dark:via-fuchsia-700 dark:to-pink-700 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s6.png" alt="İşlemler ve Cebir" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          3. İşlemlerden Cebirsel Düşünmeye
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-pink-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Eldeli Toplama, Çarpma, Bölme & Cebir
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 4: GEOMETRİ, VERİ VE OLASILIK */}
                    <button
                      onClick={() => setSelectedCategoryId('g4_tema4')}
                      className="group relative w-full bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 dark:from-teal-600 dark:via-emerald-700 dark:to-green-800 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s21.png" alt="Geometri, Veri ve Olasılık" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          4. Geometri, Veri ve Olasılık
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-emerald-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Açılar, Çevre, Alan, Grafikler & Olasılık
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>
                  </div>
                </div>
              ) : selectedGrade === 3 ? (
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-1 sm:gap-1.5">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
                    {/* TEMA 1: SAYILAR VE NİCELİKLER 1 */}
                    <button
                      onClick={() => setSelectedCategoryId('g3_tema1')}
                      className="group relative w-full bg-gradient-to-br from-blue-500 via-indigo-600 to-sky-600 dark:from-blue-600 dark:via-indigo-700 dark:to-sky-800 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s19.png" alt="Sayılar ve Nicelikler 1" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          1. Sayılar ve Nicelikler (1)
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-blue-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          1000'e Kadar Sayılar, Çözümleme & Ritmik
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 2: SAYILAR VE NİCELİKLER 2 */}
                    <button
                      onClick={() => setSelectedCategoryId('g3_tema2')}
                      className="group relative w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 dark:from-amber-600 dark:via-orange-700 dark:to-red-700 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s15.png" alt="Sayılar ve Nicelikler 2" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          2. Sayılar ve Nicelikler (2)
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-amber-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Kesirler, Zaman, Ölçme & Paralarımız
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */}
                    <button
                      onClick={() => setSelectedCategoryId('g3_tema3')}
                      className="group relative w-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-700 dark:via-fuchsia-700 dark:to-pink-700 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s6.png" alt="İşlemler ve Cebir" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          3. İşlemlerden Cebirsel Düşünmeye
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-pink-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Zihinden İşlem, Çarpma, Bölme & Cebir
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>

                    {/* TEMA 4: NESNELERİN GEOMETRİSİ VE ÖLÇME */}
                    <button
                      onClick={() => setSelectedCategoryId('g3_tema4')}
                      className="group relative w-full bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 dark:from-teal-600 dark:via-emerald-700 dark:to-green-800 text-white rounded-[14px] sm:rounded-[18px] p-2 sm:p-2.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[96px] xs:min-h-[106px] sm:min-h-[120px]"
                    >
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s21.png" alt="Geometri ve Ölçme" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          4. Nesnelerin Geometrisi ve Ölçme
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-emerald-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Cisimler, Açılar & Çevre Hesabı
                        </p>
                      </div>

                      <div className="z-10 shrink-0 relative w-[52px] h-[21px] sm:w-[70px] sm:h-[28px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: `url('/ply.png')` }} />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* MAIN CATEGORY CARDS - 1. & 2. SINIF (6 CARDS IN 3 ROWS OF 2) */
                <div className="w-full max-w-3xl mx-auto flex flex-col gap-1 sm:gap-1.5">
                  {/* ROWS 1 & 2: 2x2 GRID FOR FIRST 4 MAIN CATEGORIES */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-1.5 w-full">
                    {/* CARD 1: GEOMETRİ */}
                    <button
                      onClick={() => setSelectedCategoryId('geometri')}
                      className="group relative w-full bg-gradient-to-br from-blue-500 via-indigo-600 to-sky-600 dark:from-blue-600 dark:via-indigo-700 dark:to-sky-800 text-white rounded-[14px] sm:rounded-[18px] p-1.5 sm:p-2 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[92px] xs:min-h-[100px] sm:min-h-[114px]"
                    >
                      {/* Sunburst Ray & Top Gloss Overlays */}
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      {/* Top 3D Icon Badge */}
                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s21.png" alt="Geometri" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      {/* Center Text Column */}
                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-[11px] sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          1. Nesnelerin Geometrisi
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-blue-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Şekiller, Cisimler & Örüntüler
                        </p>
                      </div>

                      {/* Bottom Action Pill Button */}
                      <div className="z-10 shrink-0 relative w-[50px] h-[20px] sm:w-[68px] sm:h-[26px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                          style={{ backgroundImage: `url('/ply.png')` }}
                        />
                      </div>
                    </button>

                    {/* CARD 2: SAYILAR */}
                    <button
                      onClick={() => setSelectedCategoryId('sayilar')}
                      className="group relative w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 dark:from-amber-600 dark:via-orange-700 dark:to-red-700 text-white rounded-[14px] sm:rounded-[18px] p-1.5 sm:p-2 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[92px] xs:min-h-[100px] sm:min-h-[114px]"
                    >
                      {/* Sunburst Ray & Top Gloss Overlays */}
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      {/* Top 3D Icon Badge */}
                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s19.png" alt="Sayılar" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      {/* Center Text Column */}
                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-[11px] sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          2. Sayılar ve Nicelikler
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-amber-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Ritmik Sayma & Basamak Değeri
                        </p>
                      </div>

                      {/* Bottom Action Pill Button */}
                      <div className="z-10 shrink-0 relative w-[50px] h-[20px] sm:w-[68px] sm:h-[26px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                          style={{ backgroundImage: `url('/ply.png')` }}
                        />
                      </div>
                    </button>

                    {/* CARD 3: İŞLEMLER */}
                    <button
                      onClick={() => setSelectedCategoryId('islemler')}
                      className="group relative w-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 dark:from-purple-700 dark:via-fuchsia-700 dark:to-pink-700 text-white rounded-[14px] sm:rounded-[18px] p-1.5 sm:p-2 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[92px] xs:min-h-[100px] sm:min-h-[114px]"
                    >
                      {/* Sunburst Ray & Top Gloss Overlays */}
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      {/* Top 3D Icon Badge */}
                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s6.png" alt="İşlemler" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      {/* Center Text Column */}
                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-[11px] sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          3. İşlemler ve Cebir
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-pink-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Toplama, Çıkarma, Çarpma, Bölme
                        </p>
                      </div>

                      {/* Bottom Action Pill Button */}
                      <div className="z-10 shrink-0 relative w-[50px] h-[20px] sm:w-[68px] sm:h-[26px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                          style={{ backgroundImage: `url('/ply.png')` }}
                        />
                      </div>
                    </button>

                    {/* CARD 4: VERİ İŞLEME */}
                    <button
                      onClick={() => setSelectedCategoryId('olcme')}
                      className="group relative w-full bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 dark:from-teal-600 dark:via-emerald-700 dark:to-green-800 text-white rounded-[14px] sm:rounded-[18px] p-1.5 sm:p-2 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center overflow-hidden cursor-pointer min-h-[92px] xs:min-h-[100px] sm:min-h-[114px]"
                    >
                      {/* Sunburst Ray & Top Gloss Overlays */}
                      <div className="absolute -left-10 -top-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_50%,transparent_70%)] pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-t-[18px]" />

                      {/* Top 3D Icon Badge */}
                      <div className="relative shrink-0 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_3px_8px_rgba(0,0,0,0.3)] flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <img src="/iconn/s15.png" alt="Veri İşleme" className="w-full h-full object-cover scale-[1.55] sm:scale-[1.65] filter drop-shadow-md" />
                      </div>

                      {/* Center Text Column */}
                      <div className="flex-1 flex flex-col items-center justify-center z-10 py-0.5 min-w-0">
                        <h3 className="font-black text-[10px] xs:text-[11px] sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wide">
                          4. Veri İşleme
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-emerald-100/90 mt-0.5 drop-shadow-xs line-clamp-1">
                          Sütun Grafikleri & Tablolar
                        </p>
                      </div>

                      {/* Bottom Action Pill Button */}
                      <div className="z-10 shrink-0 relative w-[50px] h-[20px] sm:w-[68px] sm:h-[26px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                          style={{ backgroundImage: `url('/ply.png')` }}
                        />
                      </div>
                    </button>
                  </div>

                  {/* ROW 3: 2-COLUMN FOR 2. SINIF (5 & 6) OR SINGLE ITEM FOR 1. SINIF */}
                  {selectedGrade === 2 ? (
                    <div className="grid grid-cols-2 gap-1 sm:gap-1.5 w-full">
                      {/* CARD 5: 5. DİĞER OYUNLAR */}
                      <button
                        onClick={() => setSelectedCategoryId('diger_oyunlar')}
                        className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800 text-white rounded-[12px] sm:rounded-[16px] px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_12px_rgba(124,58,237,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden cursor-pointer min-h-[48px] xs:min-h-[54px] sm:min-h-[62px]"
                      >
                        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)] pointer-events-none" />
                        
                        {/* Left Icon */}
                        <div className="relative shrink-0 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-sm flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <img src="/iconn/s1.png" alt="Diğer Oyunlar" className="w-full h-full object-cover scale-[1.55] filter drop-shadow-xs" />
                        </div>

                        {/* Center Text */}
                        <div className="flex-1 text-center min-w-0 z-10 py-0 flex flex-col items-center justify-center">
                          <h3 className="font-black text-[10px] xs:text-[11px] sm:text-xs text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider truncate w-full text-center">
                            5. Diğer Oyunlar
                          </h3>
                          <p className="text-[7px] xs:text-[8px] sm:text-[9.5px] font-extrabold text-purple-100/90 drop-shadow-xs truncate w-full text-center">
                            Balon, Hafıza & Zeka
                          </p>
                        </div>

                        {/* Right Action Button */}
                        <div className="z-10 shrink-0 relative w-[42px] h-[17px] sm:w-[54px] sm:h-[21px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                          <div 
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                            style={{ backgroundImage: `url('/ply.png')` }}
                          />
                        </div>
                      </button>

                      {/* CARD 6: 6. 3D GEOMETRİ LABI */}
                      <button
                        onClick={() => setShow3DLab(true)}
                        className="group relative w-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-600 dark:from-amber-500 dark:via-orange-600 dark:to-pink-700 text-white rounded-[12px] sm:rounded-[16px] px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_12px_rgba(249,115,22,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(249,115,22,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-1.5 sm:gap-2 overflow-hidden cursor-pointer min-h-[48px] xs:min-h-[54px] sm:min-h-[62px]"
                      >
                        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)] pointer-events-none" />
                        
                        {/* Left Icon */}
                        <div className="relative shrink-0 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-sm flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <img src="/iconn/s10.png" alt="3D Geometri" className="w-full h-full object-cover scale-[1.55] filter drop-shadow-xs" />
                        </div>

                        {/* Center Text */}
                        <div className="flex-1 text-center min-w-0 z-10 py-0 flex flex-col items-center justify-center">
                          <h3 className="font-black text-[10px] xs:text-[11px] sm:text-xs text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider truncate w-full text-center">
                            6. 3D Geometri Labı
                          </h3>
                          <p className="text-[7px] xs:text-[8px] sm:text-[9.5px] font-extrabold text-amber-100/90 drop-shadow-xs truncate w-full text-center">
                            Küp, Silindir, Prizma 3D
                          </p>
                        </div>

                        {/* Right Action Button */}
                        <div className="z-10 shrink-0 relative w-[42px] h-[17px] sm:w-[54px] sm:h-[21px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                          <div 
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                            style={{ backgroundImage: `url('/ply.png')` }}
                          />
                        </div>
                      </button>
                    </div>
                  ) : (
                    /* ROW 3: SINGLE 5TH ITEM (5. DİĞER OYUNLAR) FOR 1. SINIF */
                    <div className="w-full">
                      {/* CARD 5: 5. DİĞER OYUNLAR */}
                      <button
                        onClick={() => setSelectedCategoryId('diger_oyunlar')}
                        className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800 text-white rounded-[12px] sm:rounded-[16px] px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 sm:border-3 border-white/90 dark:border-slate-700/80 shadow-[0_4px_12px_rgba(124,58,237,0.25),0_2px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-between gap-2 sm:gap-2.5 overflow-hidden cursor-pointer min-h-[48px] xs:min-h-[54px] sm:min-h-[62px]"
                      >
                        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)] pointer-events-none" />
                        
                        {/* Left Icon */}
                        <div className="relative shrink-0 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-sm flex items-center justify-center p-0 overflow-hidden group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <img src="/iconn/s1.png" alt="Diğer Oyunlar" className="w-full h-full object-cover scale-[1.55] filter drop-shadow-xs" />
                        </div>

                        {/* Center Text */}
                        <div className="flex-1 text-center min-w-0 z-10 py-0 flex flex-col items-center justify-center">
                          <h3 className="font-black text-[11px] xs:text-xs sm:text-sm text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] leading-tight uppercase tracking-wider truncate w-full text-center">
                            5. Diğer Oyunlar
                          </h3>
                          <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-extrabold text-purple-100/90 drop-shadow-xs truncate w-full text-center">
                            Balon, Hafıza & Zeka Oyunları
                          </p>
                        </div>

                        {/* Right Action Button */}
                        <div className="z-10 shrink-0 relative w-[46px] h-[18px] sm:w-[58px] sm:h-[23px] group-hover:scale-105 transition-all filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center">
                          <div 
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
                            style={{ backgroundImage: `url('/ply.png')` }}
                          />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* SUB-TOPIC BUTTON CARDS SCREEN FOR SELECTED CATEGORY (3-COLUMN SQUARE CARDS) */
            <div className="max-w-5xl w-full mx-auto flex flex-col items-center py-1 sm:py-2">
              
              {/* CENTERED TITLE HEADER LOGO (mattt.gif) & CATEGORY TITLE BADGE */}
              {/* COMPACT CATEGORY HEADER BADGE */}
              <div className="flex flex-col items-center justify-center mb-3 sm:mb-4 max-w-5xl w-full mx-auto shrink-0 py-1">
                {(() => {
                  const cat = CATEGORY_MAP.find(c => c.id === selectedCategoryId);
                  if (!cat) return null;
                  return (
                    <div className="z-10 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-blue-950 px-5 sm:px-8 py-2 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-white shadow-[0_4px_15px_rgba(0,0,0,0.6)] font-black text-sm sm:text-base md:text-lg uppercase tracking-wider whitespace-nowrap max-w-full shrink-0">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white text-blue-950 border-2 border-amber-500 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                        {cat.icon.startsWith('/') ? (
                          <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover scale-[1.55] filter drop-shadow-xs" />
                        ) : (
                          cat.icon
                        )}
                      </span>
                      <span className="drop-shadow-xs truncate">{cat.name}</span>
                    </div>
                  );
                })()}
              </div>

              {/* SUB-TOPICS RENDERED AS PILL BUTTONS IN A 2-COLUMN GRID (REFERENCE STYLE) */}
              <div className="w-full space-y-5">
                
                {/* 1. NESNELERİN GEOMETRİSİ */}
                {selectedCategoryId === 'geometri' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {(selectedGrade === 1
                        ? ['uzamsal_iliskiler', 'es_nesneler', 'geometrik_sekil_cisim']
                        : ['geometrik_sekil_cisim', 'yuz_ayrit_kose', 'geometrik_oruntu', 'uzamsal_iliskiler_simetri', 'sivi_olcme', 'tartma_olcme']
                      ).map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. SAYILAR VE NİCELİKLER */}
                {selectedCategoryId === 'sayilar' && (
                  <div className="space-y-5">
                    {/* Standalone topics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {(selectedGrade === 1
                        ? ['nesne_sayisi', 'sira_sayilari', 'cok_az_esit']
                        : ['nesne_sayisi', 'sayi_basamak_degeri', 'en_yakin_onluk', 'deste_duzine', 'kesirler', 'sayi_karsilastirma', 'sira_sayilari', 'paralarimiz', 'zaman_olcme', 'uzunluk_olcme']
                      ).map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        const isSpan = selectedGrade === 1 && key === 'cok_az_esit';
                        return (
                          <div key={key} className={isSpan ? "sm:col-span-2" : ""}>
                            <TopicButtonReferenceStyle
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Ritmik Saymalar Group Section */}
                    <div className="bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md">
                      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-blue-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-xl border border-amber-500 shadow-sm flex items-center gap-2 mb-3">
                        <img src="/iconn/s17.png" alt="Ritmik" className="w-7 h-7 object-contain filter drop-shadow-sm" />
                        <span>Ritmik Saymalar {selectedGrade === 1 ? "(1'er, 2'şer, 5'er, 10'ar)" : ""}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {(selectedGrade === 1
                          ? ['ritmik_ileri_1', 'ritmik_ileri_2', 'ritmik_ileri_5', 'ritmik_ileri_10', 'ritmik_geri_1', 'ritmik_geri_2', 'ritmik_geri_10']
                          : ['ritmik_ileri_2', 'ritmik_ileri_3', 'ritmik_ileri_4', 'ritmik_ileri_5', 'ritmik_ileri_10', 'ritmik_geri_2', 'ritmik_geri_10']
                        ).map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                              compact
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Saati Okuma Group Section (Sadece 2. Sınıf) */}
                    {selectedGrade === 2 && (
                      <div className="bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md">
                        <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-blue-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-xl border border-amber-500 shadow-sm flex items-center gap-2 mb-3">
                          <img src="/iconn/s24.png" alt="Saati Okuma" className="w-7 h-7 object-contain filter drop-shadow-sm" />
                          <span>Saati Okuma (Tam, Yarım, Çeyrek)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {['saat_tam', 'saat_yarim', 'saat_ceyrek_gece', 'saat_ceyrek_kala'].map(key => {
                            const t = topics[key];
                            if (!t) return null;
                            return (
                              <TopicButtonReferenceStyle
                                key={key}
                                topicKey={key}
                                title={t.title}
                                onClick={() => selectTopicAndStart(key)}
                                compact
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 1. Sınıf En Alttaki Ek Başlıklar: Sayı & Şekil Örüntüsü, Uzunluk, Tartma, Paralarımız */}
                    {selectedGrade === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {['sayi_sekil_oruntusu', 'uzunluk_olcme', 'tartma', 'paralarimiz'].map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */}
                {selectedCategoryId === 'islemler' && (
                  <div className="space-y-5">
                    {/* Toplama İşlemi Group */}
                    <div className="bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md">
                      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-blue-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-xl border border-amber-500 shadow-sm flex items-center gap-2 mb-3">
                        <img src="/iconn/s28.png" alt="Toplama" className="w-7 h-7 object-contain filter drop-shadow-sm" />
                        <span>{selectedGrade === 1 ? "Toplama İşlemleri (20 İçinde & Onluklar)" : "Toplama İşlemi"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {(selectedGrade === 1
                          ? ['toplama_20_ici', 'toplama_onluk', 'verilmeyen_toplanan', 'zihinden_toplama', 'tek_islem_toplama_problemleri', 'iki_islem_toplama_problemleri']
                          : ['toplama_eldesiz_50', 'toplama_eldeli_50', 'verilmeyen_toplanani_bul', 'zihinden_toplama', 'tek_islem_toplama_problemleri', 'iki_islem_toplama_problemleri']
                        ).map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                              compact
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Çıkarma İşlemi Group */}
                    <div className="bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md">
                      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-blue-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-xl border border-amber-500 shadow-sm flex items-center gap-2 mb-3">
                        <img src="/iconn/s33.png" alt="Çıkarma" className="w-7 h-7 object-contain filter drop-shadow-sm" />
                        <span>{selectedGrade === 1 ? "Çıkarma İşlemleri (20 İçinde & Onluklar)" : "Çıkarma İşlemi"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {(selectedGrade === 1
                          ? ['cikarma_20_ici', 'cikarma_onluk', 'zihinden_cikarma', 'tek_islem_cikarma_problemleri', 'iki_islem_cikarma_problemleri']
                          : ['cikarma_onluksuz_50', 'cikarma_onluklu_50', 'zihinden_cikarma', 'tek_islem_cikarma_problemleri', 'iki_islem_cikarma_problemleri']
                        ).map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                              compact
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Karışık Toplama Çıkarma Problemleri */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {['toplama_cikarma_problemleri'].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>

                    {/* Çarpma, Bölme ve Diğer İşlemler Cards (2. Sınıf) */}
                    {selectedGrade === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {['ardisik_toplama', 'ritmik_carpim', 'esit_paylastirma', 'ardisik_cikarma', 'kalansiz_bolme'].map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. VERİ İŞLEME & ÖLÇME */}
                {selectedCategoryId === 'olcme' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(selectedGrade === 1
                      ? ['veri_grafik']
                      : ['veri_grafik', 'takvim_olcme']
                    ).map(key => {
                      const t = topics[key];
                      if (!t) return null;
                      return (
                        <TopicButtonReferenceStyle
                          key={key}
                          topicKey={key}
                          title={t.title}
                          onClick={() => selectTopicAndStart(key)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* 5. DİĞER OYUNLAR */}
                {selectedCategoryId === 'diger_oyunlar' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {(selectedGrade === 1
                        ? [
                            'sureli_toplama_cikarma',
                            'sureli_on_tamamlama',
                            'balon_patlatma_mat',
                            'matematik_hafiza',
                            'hizli_islem_carki',
                            'sayi_dedektifi',
                            'ritim_labirent',
                            'geometri_eslestirme'
                          ]
                        : [
                            'sureli_toplama_cikarma',
                            'sureli_carpma_bolme',
                            'balon_patlatma_mat',
                            'matematik_hafiza',
                            'hizli_islem_carki',
                            'sayi_dedektifi',
                            'ritim_labirent',
                            'geometri_eslestirme'
                          ]
                      ).map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. SINIF TEMA 1: SAYILAR VE NİCELİKLER (1) */}
                {selectedCategoryId === 'g3_tema1' && (
                  <div className="space-y-5">
                    {/* Temel Sayı & Yuvarlama Konuları */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g3_uc_basamakli_okuma_yazma',
                        'g3_sayi_cozumleme',
                        'g3_sayi_siralama_karsilastirma',
                        'g3_en_yakin_onluga_yuvarlama_100',
                        'g3_en_yakin_onluga_yuvarlama',
                        'g3_en_yakin_yuzluge_yuvarlama'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>

                    {/* Ritmik Saymalar Alt Başlığı & Konuları */}
                    <div className="bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md">
                      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-blue-950 font-black text-sm sm:text-base px-3.5 py-1.5 rounded-xl border border-amber-500 shadow-sm flex items-center gap-2 mb-3">
                        <img src="/iconn/s17.png" alt="Ritmik Saymalar" className="w-7 h-7 object-contain filter drop-shadow-sm" />
                        <span>Ritmik Saymalar (6, 7, 8, 9, 10 ve 100'er)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {[
                          'g3_ritmik_6',
                          'g3_ritmik_7',
                          'g3_ritmik_8',
                          'g3_ritmik_9',
                          'g3_ritmik_10',
                          'g3_ritmik_100'
                        ].map(key => {
                          const t = topics[key];
                          if (!t) return null;
                          return (
                            <TopicButtonReferenceStyle
                              key={key}
                              topicKey={key}
                              title={t.title}
                              onClick={() => selectTopicAndStart(key)}
                              compact
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Tek-Çift ve Örüntü Konuları */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g3_tek_cift_20ye_kadar_islemler',
                        'g3_tek_cift_sayilar',
                        'g3_sayi_sekil_oruntuleri',
                        'g3_nesne_tahmin_karsilastirma'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. SINIF TEMA 2: SAYILAR VE NİCELİKLER (2) */}
                {selectedCategoryId === 'g3_tema2' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      'g3_birim_kesirler',
                      'g3_pay_payda_modelleme',
                      'g3_payda_10_100_kesir',
                      'g3_zaman_olcme',
                      'g3_uzunluk_kutle_sivi',
                      'g3_paralarimiz_lira_kurus'
                    ].map(key => {
                      const t = topics[key];
                      if (!t) return null;
                      return (
                        <TopicButtonReferenceStyle
                          key={key}
                          topicKey={key}
                          title={t.title}
                          onClick={() => selectTopicAndStart(key)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* 3. SINIF TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */}
                {selectedCategoryId === 'g3_tema3' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      'g3_zihinden_toplama_cikarma_tahmin',
                      'g3_toplama_cikarma_problemleri',
                      'g3_carpma_bolme_pratik',
                      'g3_verilmeyen_ogeyi_bulma'
                    ].map(key => {
                      const t = topics[key];
                      if (!t) return null;
                      return (
                        <TopicButtonReferenceStyle
                          key={key}
                          topicKey={key}
                          title={t.title}
                          onClick={() => selectTopicAndStart(key)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* 3. SINIF TEMA 4: NESNELERİN GEOMETRİSİ VE ÖLÇME */}
                {selectedCategoryId === 'g3_tema4' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      'g3_geometrik_cisimler_ozellikleri',
                      'g3_temel_geometri_kavramlari',
                      'g3_cevre_ve_olculebilir_nitelikler'
                    ].map(key => {
                      const t = topics[key];
                      if (!t) return null;
                      return (
                        <TopicButtonReferenceStyle
                          key={key}
                          topicKey={key}
                          title={t.title}
                          onClick={() => selectTopicAndStart(key)}
                        />
                      );
                    })}
                  </div>
                )}

                {/* 4. SINIF TEMA 1: SAYILAR VE NİCELİKLER (1) */}
                {selectedCategoryId === 'g4_tema1' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g4_sayi_okuma_yazma',
                        'g4_basamak_ve_cozumleme',
                        'g4_sayi_siralama',
                        'g4_en_yakin_onluk_yuzluk',
                        'g4_ritmik_yuzer_biner',
                        'g4_sayi_sekil_oruntuleri'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. SINIF TEMA 2: SAYILAR VE NİCELİKLER (2) */}
                {selectedCategoryId === 'g4_tema2' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g4_kesir_cesitleri_modelleme',
                        'g4_birim_kesirler_karsilastirma',
                        'g4_paydalari_esit_kesir_islemleri',
                        'g4_uzunluk_olculeri_donusum',
                        'g4_kutle_olculeri_ton_kg_g'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. SINIF TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE */}
                {selectedCategoryId === 'g4_tema3' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g4_dort_islem_toplama_cikarma',
                        'g4_carpma_islemi_3basamakli',
                        'g4_bolme_islemi_4basamakli',
                        'g4_zihinden_carpma_bolme_10_100_1000',
                        'g4_esitlik_ve_verilmeyen_deger'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. SINIF TEMA 4: GEOMETRİ, VERİ VE OLASILIK */}
                {selectedCategoryId === 'g4_tema4' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        'g4_geometrik_cisimler',
                        'g4_cevre_uzunlugu',
                        'g4_alan_tahmini_ve_birim_kare',
                        'g4_dogru_isin_dogru_parcasi_acilar',
                        'g4_simetri_dogrulari',
                        'g4_sutun_grafigi_ve_tablolar',
                        'g4_olaylarin_olasiligi'
                      ].map(key => {
                        const t = topics[key];
                        if (!t) return null;
                        return (
                          <TopicButtonReferenceStyle
                            key={key}
                            topicKey={key}
                            title={t.title}
                            onClick={() => selectTopicAndStart(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}
        </div>
      )}

      {/* FULL SCREEN GAME AREA (TEK KİŞİLİK TAM SAYFA ETKİNLİK) */}
      {gameState === 'playing' && playerCountMode === 1 && (
        <div className="flex-1 flex flex-col p-2 sm:p-4 max-w-4xl mx-auto w-full justify-between overflow-hidden min-h-0 relative h-full">
          {/* TOP BAR: BASBACK.PNG */}
          <div
            style={{ backgroundImage: `url('/basback.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
            className="relative overflow-hidden bg-cover bg-center rounded-2xl p-2 sm:p-3 mb-2 shrink-0 flex items-center justify-between gap-2 shadow-lg min-h-[58px]"
          >
            {/* LEFT: AVATAR & GROUP */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-300 shadow-md bg-blue-900/80 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/icon_1.png" alt="1. GRUP" className="w-full h-full object-cover scale-[1.35]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-xs sm:text-base text-yellow-950 uppercase tracking-tight truncate drop-shadow-sm">
                  1. GRUP
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-900 truncate">
                  {topics[currentTopic]?.title || 'Etkinlik'}
                </span>
              </div>
            </div>

            {/* RIGHT: SCORE & LIVES */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-1 rounded-xl font-black text-xs sm:text-base shadow-md border border-yellow-200">
                PUAN: {score} / 10
              </div>
              <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-xl border border-white/20">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-base sm:text-xl transition-all ${i < lives ? 'scale-110 drop-shadow-[0_0_6px_#ef4444]' : 'opacity-25 grayscale'}`}>
                    ❤️
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: QUESTION CONTAINER WITH BASBACK2.PNG OR ARK22.PNG */}
          <div
            style={{ backgroundImage: `url('/ark22.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
            className="relative flex-1 rounded-3xl p-4 sm:p-6 my-2 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden min-h-[160px] sm:min-h-[220px]"
          >
            <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-2 sm:px-6">
              {currentQuestionData?.questionHTML ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: currentQuestionData.questionHTML }} 
                  className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [text-shadow:0_2px_4px_#000] text-white font-black w-full flex flex-col items-center justify-center min-h-0 text-sm sm:text-base md:text-lg" 
                />
              ) : (
                <div className={`my-auto font-black text-white leading-snug tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_6px_#000,_0_4px_14px_rgba(0,0,0,0.9)] px-2 py-1 max-w-full text-center ${
                  (currentQuestionData?.question?.length || 0) < 25
                    ? "text-lg xs:text-xl sm:text-2xl md:text-3xl"
                    : (currentQuestionData?.question?.length || 0) < 60
                    ? "text-base xs:text-lg sm:text-xl md:text-2xl"
                    : "text-sm xs:text-base sm:text-lg md:text-xl"
                }`}>
                  {currentQuestionData?.question}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: 2x2 OPTIONS GRID WITH BUT1.PNG (TAHTALI BUTON) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full shrink-0">
            {optionsList.map((opt, idx) => {
              const isCorrect = selectedOption !== null && currentQuestionData && opt === currentQuestionData.correct;
              const isWrong = selectedOption !== null && currentQuestionData && opt === selectedOption && opt !== currentQuestionData.correct;

              let feedbackClasses = "";
              if (isCorrect) {
                feedbackClasses = "ring-4 ring-emerald-400 scale-105 shadow-[0_0_25px_rgba(16,185,129,0.9)] animate-pulse";
              } else if (isWrong) {
                feedbackClasses = "ring-4 ring-rose-500 scale-95 opacity-80 shadow-[0_0_25px_rgba(244,63,94,0.9)]";
              }

              const maxOptLen = Math.max(...optionsList.map(o => String(o).trim().length), 0);
              let fontSizeClass = "";
              if (maxOptLen <= 2) {
                fontSizeClass = "text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black";
              } else if (maxOptLen <= 5) {
                fontSizeClass = "text-lg xs:text-xl sm:text-2xl md:text-3xl font-black";
              } else if (maxOptLen <= 10) {
                fontSizeClass = "text-base xs:text-lg sm:text-xl md:text-2xl font-black";
              } else {
                fontSizeClass = "text-sm sm:text-base md:text-lg font-black";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedbackState !== 'none'}
                  style={{ backgroundImage: `url('/but1.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                  className={`relative group w-full py-3.5 sm:py-5 px-3 rounded-2xl transition-all duration-200 flex items-center justify-center text-center leading-tight break-words cursor-pointer uppercase tracking-wider overflow-hidden drop-shadow-lg active:scale-95 ${feedbackClasses}`}
                >
                  <span className={`relative z-10 px-2 flex items-center justify-center text-center pointer-events-none ${fontSizeClass} text-white [text-shadow:_0_2px_4px_#000,_0_4px_10px_rgba(0,0,0,0.9)]`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MULTI-PLAYER SPLIT SCREEN DÜELLO ALANI (2 VE 3 OYUNCU) */}
      {gameState === 'playing' && playerCountMode > 1 && (
        <div className="flex-1 flex flex-col p-2 sm:p-3 w-full h-full overflow-hidden min-h-0 relative z-10 max-w-7xl mx-auto">
          {/* COMMON TOP BAR: TOPIC TITLE & DÜELLO BADGE */}
          <div
            style={{ backgroundImage: `url('/basback.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
            className="relative overflow-hidden bg-cover bg-center rounded-2xl px-3 py-1.5 mb-2 shrink-0 flex items-center justify-between gap-2 min-h-[46px]"
          >
            <span className="px-3 py-1 bg-amber-400 text-blue-950 font-black text-xs sm:text-sm rounded-xl shadow-md uppercase tracking-wider shrink-0">
              ⚔️ {playerCountMode} OYUNCU DÜELLO
            </span>
            <div className="flex-1 min-w-0 text-center">
              <h2 className="text-xs sm:text-base md:text-lg font-black text-amber-950 uppercase tracking-tight truncate drop-shadow-sm">
                {topics[currentTopic]?.title || ''}
              </h2>
            </div>
            <span className="px-3 py-1 bg-slate-900/80 text-amber-300 border border-amber-400/50 font-black text-xs sm:text-sm rounded-xl shadow-sm uppercase shrink-0">
              HEDEF: 10 PUAN
            </span>
          </div>

          {/* SPLIT SCREEN GRID FOR 2 OR 3 PLAYERS */}
          <div className={`flex-1 grid grid-cols-1 ${playerCountMode === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-2 sm:gap-3.5 w-full min-h-0 overflow-y-auto no-scrollbar`}>
            {players.map((p, pIdx) => {
              const avatarImg = pIdx === 0 ? "/icon_1.png" : pIdx === 1 ? "/icon_2.png" : "/icon_3.png";

              return (
                <div
                  key={p.id}
                  className="relative flex flex-col justify-between p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border-2 border-yellow-400/60 shadow-2xl overflow-hidden min-h-0 z-10 transition-all"
                >
                  {/* PLAYER HEADER BAR */}
                  <div
                    style={{ backgroundImage: `url('/basback.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    className="relative flex items-center justify-between z-10 shrink-0 p-2 rounded-xl border border-yellow-400/30"
                  >
                    {/* LEFT: AVATAR & GROUP NAME */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-300 shadow-md bg-blue-950 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={avatarImg} alt={`${pIdx + 1}. GRUP`} className="w-full h-full object-cover scale-[1.35]" />
                      </div>
                      <span className="font-black text-xs sm:text-sm text-yellow-950 uppercase tracking-tight truncate drop-shadow-sm">
                        {pIdx + 1}. GRUP
                      </span>
                    </div>

                    {/* RIGHT: SCORE & HEARTS */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-amber-400 text-blue-950 font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
                        {p.score} / 10
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} className={`text-xs sm:text-sm ${i < p.lives ? 'scale-110' : 'opacity-25 grayscale'}`}>
                            ❤️
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* QUESTION AREA FOR THIS PLAYER */}
                  <div
                    style={{ backgroundImage: `url('/ark22.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    className="relative flex-1 rounded-2xl p-2 sm:p-4 my-2 flex flex-col items-center justify-center text-center z-10 overflow-hidden min-h-[140px] sm:min-h-[170px]"
                  >
                    {p.lives <= 0 ? (
                      <div className="relative z-20 flex flex-col items-center justify-center gap-1 p-2">
                        <div className="text-2xl sm:text-3xl animate-bounce">💔</div>
                        <div className="text-xl xs:text-2xl sm:text-3xl font-black text-rose-500 uppercase tracking-widest [text-shadow:0_3px_6px_#000,0_6px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_12px_rgba(225,29,72,0.95)] animate-pulse">
                          ELENDİ!
                        </div>
                        <div className="text-white/90 text-[11px] sm:text-xs font-black [text-shadow:0_2px_4px_#000] drop-shadow-md">
                          Diğer oyuncular yarışıyor...
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center justify-center text-center overflow-visible px-2 w-full">
                        {p.currentQuestionData?.questionHTML ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: p.currentQuestionData.questionHTML }} 
                            className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] [text-shadow:0_2px_4px_#000] text-white font-extrabold text-base sm:text-xl md:text-2xl leading-snug w-full flex flex-col items-center justify-center min-h-0 scale-90 xs:scale-95 sm:scale-100 origin-center" 
                          />
                        ) : (
                          <div className={`my-auto font-black text-white leading-snug tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_4px_#000,_0_4px_10px_rgba(0,0,0,0.9)] px-1 py-0.5 max-w-full text-center ${
                            (p.currentQuestionData?.question?.length || 0) < 25
                              ? "text-lg sm:text-xl md:text-2xl font-black"
                              : (p.currentQuestionData?.question?.length || 0) < 60
                              ? "text-sm sm:text-base md:text-lg font-black"
                              : "text-xs sm:text-sm md:text-base font-black"
                          }`}>
                            {p.currentQuestionData?.question}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CHOICE BUTTONS GRID FOR THIS PLAYER */}
                  {p.lives > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full shrink-0 z-10">
                      {p.shuffledOptions.map((opt, oIdx) => {
                        const isCorrect = p.selectedOption !== null && p.currentQuestionData && opt === p.currentQuestionData.correct;
                        const isWrong = p.selectedOption !== null && p.currentQuestionData && opt === p.selectedOption && opt !== p.currentQuestionData.correct;

                        let btnClass = "";
                        if (isCorrect) {
                          btnClass = "ring-4 ring-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse";
                        } else if (isWrong) {
                          btnClass = "ring-4 ring-rose-500 scale-95 opacity-80 shadow-[0_0_20px_rgba(244,63,94,0.9)]";
                        }

                        const maxOptLen = Math.max(...(p.shuffledOptions || []).map(o => String(o).trim().length), 0);
                        let fontClass = "";
                        if (maxOptLen <= 2) {
                          fontClass = playerCountMode === 3 ? "text-base xs:text-lg sm:text-xl md:text-2xl font-black" : "text-lg xs:text-xl sm:text-2xl md:text-3xl font-black";
                        } else if (maxOptLen <= 5) {
                          fontClass = playerCountMode === 3 ? "text-sm xs:text-base sm:text-lg md:text-xl font-black" : "text-base xs:text-lg sm:text-xl md:text-2xl font-black";
                        } else {
                          fontClass = "text-xs xs:text-sm sm:text-base font-black";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handlePlayerAnswer(pIdx, opt)}
                            disabled={p.feedbackState !== 'none'}
                            style={{ backgroundImage: `url('/but1.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                            className={`relative group w-full py-2.5 sm:py-3.5 px-2 rounded-xl sm:rounded-2xl transition-all duration-150 flex items-center justify-center text-center cursor-pointer uppercase tracking-wide overflow-hidden drop-shadow-md active:scale-95 ${btnClass}`}
                          >
                            <span className={`relative z-10 truncate ${fontClass} text-white font-black [text-shadow:_0_2px_4px_#000,_0_4px_8px_rgba(0,0,0,0.9)]`}>
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* GLOBAL FOOTER WITH COPYRIGHT TEXT */}
      <footer className="mt-auto z-30 shrink-0 bg-slate-950/90 dark:bg-[#070D1E]/95 backdrop-blur-md border-t-2 border-yellow-400/90 dark:border-yellow-500/80 py-2.5 sm:py-3.5 px-4 flex items-center justify-center shadow-xl w-full">
        <p className="text-yellow-400 dark:text-yellow-300 font-bold text-xs sm:text-sm tracking-wide text-center drop-shadow-sm">
          © 2026 OLCİCO Tüm hakları saklıdır.
        </p>
      </footer>

      {/* GAME OVER / VICTORY OVERLAY */}
      {gameState === 'gameover' && gameResult && (
        <div 
          className="fixed inset-0 h-[100dvh] w-full z-50 flex flex-col items-center justify-center text-white text-center overflow-hidden select-none px-2 sm:px-4 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/dere3.jpeg')` }}
        >
          {/* INNER CONTAINER - PERFECTLY POSITIONED INSIDE THE CREAM PARCHMENT AREA */}
          <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center my-auto">
            {/* MULTI-PLAYER AWARD SECTION (CENTERED IN CREAM AREA OVER DERE3.JPEG) */}
            {playerCountMode >= 2 ? (
              <div className="relative w-full max-w-[560px] sm:max-w-[660px] md:max-w-[720px] flex flex-col items-center justify-center select-none px-2 py-1">
                {/* 1. TOP HEADER SECTION: BANNER & WINNER ANNOUNCEMENT (INSIDE CREAM REGION) */}
                <div className="relative z-10 flex flex-col items-center shrink-0 w-full mb-1 sm:mb-2">
                  <div className="relative w-full max-w-[360px] xs:max-w-[420px] sm:max-w-[500px] h-12 xs:h-14 sm:h-16 flex items-center justify-center px-4">
                    {/* bb3.png BANNER BACKGROUND */}
                    <div 
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]"
                      style={{ backgroundImage: `url('/bb3.png')` }}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center -translate-y-0.5 sm:-translate-y-1">
                      <h2 className="text-[13px] xs:text-[15px] sm:text-lg md:text-xl font-black text-amber-200 uppercase tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] leading-tight">
                        🏆 {playerCountMode === 3 ? '3 OYUNCU KAPIŞMA ŞAMPİYONU' : '2 OYUNCU KAPIŞMA ŞAMPİYONU'}
                      </h2>
                      <p className="text-[11px] xs:text-[12.5px] sm:text-sm md:text-base font-black text-yellow-300 uppercase tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] leading-tight mt-0.5">
                        {playerCountMode === 3 ? (
                          duelWinnerIndex === 0
                            ? '1. GRUP (KAPLAN) KAZANDI! 🥇'
                            : duelWinnerIndex === 1
                            ? '2. GRUP (EJDERHA) KAZANDI! 🥇'
                            : '3. GRUP (SAVAŞÇI) KAZANDI! 🥇'
                        ) : (
                          duelWinnerIndex === 0
                            ? '1. GRUP (KAPLAN) KAZANDI! 🥇'
                            : '2. GRUP (EJDERHA) KAZANDI! 🥇'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. MIDDLE SECTION: 3-IMAGE PODIUM CEREMONY (CENTERED) */}
                <div className="relative z-10 w-full flex items-end justify-center py-1">
                  <div className="w-full flex items-end justify-center gap-2 xs:gap-3 sm:gap-5 px-1">
                    {(() => {
                      const groupCount = playerCountMode === 2 ? 2 : 3;
                      const activeIndices = groupCount === 2 ? [0, 1] : [0, 1, 2];
                      const rankedGroupIndices = [...activeIndices].sort((a, b) => {
                        if (a === duelWinnerIndex) return -1;
                        if (b === duelWinnerIndex) return 1;
                        const scoreA = players[a]?.score || 0;
                        const scoreB = players[b]?.score || 0;
                        if (scoreB !== scoreA) return scoreB - scoreA;
                        return a - b;
                      });
                      const groupRanks: Record<number, number> = {};
                      rankedGroupIndices.forEach((gIdx, rankIdx) => {
                        groupRanks[gIdx] = rankIdx + 1;
                      });

                      const groupDefs = [
                        { pIdx: 0, name: "1. GRUP", img: "/kap.png", label: "KAPLAN", headerColor: "bg-blue-600 border-blue-300" },
                        { pIdx: 1, name: "2. GRUP", img: "/ejd.png", label: "EJDERHA", headerColor: "bg-rose-600 border-rose-300" },
                        { pIdx: 2, name: "3. GRUP", img: "/balta.png", label: "SAVAŞÇI", headerColor: "bg-emerald-600 border-emerald-300" }
                      ].slice(0, groupCount);

                      return groupDefs.map((group) => {
                        const p = players[group.pIdx] || { score: 0 };
                        const rank = groupRanks[group.pIdx] || 1;
                        const isWinner = rank === 1;
                        return (
                          <div
                            key={group.pIdx}
                            className={`flex-1 max-w-[85px] xs:max-w-[105px] sm:max-w-[130px] flex flex-col items-center justify-end transition-all duration-500 ${
                              isWinner ? '-translate-y-1.5 sm:-translate-y-2.5 z-20' : 'translate-y-0 z-10 opacity-95'
                            }`}
                          >
                            {/* SCORE BADGE DIRECTLY ABOVE IMAGE */}
                            <div className="mb-0.5 flex flex-col items-center shrink-0">
                              {isWinner && (
                                <span className="text-xs xs:text-sm sm:text-lg filter drop-shadow-md animate-bounce mb-0.5">👑</span>
                              )}
                              <div
                                className={`px-1.5 xs:px-2 sm:px-2.5 py-0.5 rounded-full font-black text-[7.5px] xs:text-[8.5px] sm:text-[11px] tracking-wider shadow-lg border uppercase whitespace-nowrap ${
                                  isWinner
                                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-white ring-2 ring-yellow-300/80 drop-shadow-[0_2px_8px_rgba(251,191,36,0.9)]'
                                    : 'bg-slate-900/90 text-amber-300 border-amber-400/50 shadow-md'
                                }`}
                              >
                                {p.score} PUAN
                              </div>
                            </div>

                            {/* CHARACTER IMAGE */}
                            <div className={`relative flex items-center justify-center ${isWinner ? 'scale-105 sm:scale-115' : 'scale-90 sm:scale-95'} transition-transform`}>
                              {isWinner && (
                                <div className="absolute inset-0 bg-yellow-400/25 rounded-full blur-xl animate-pulse pointer-events-none" />
                              )}
                              <img
                                src={group.img}
                                alt={group.name}
                                className={`w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain filter select-none pointer-events-none transition-all ${
                                  isWinner
                                    ? 'drop-shadow-[0_0_16px_rgba(251,191,36,0.95)] brightness-110'
                                    : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]'
                                }`}
                              />
                            </div>

                            {/* GROUP NAME BADGE */}
                            <div
                              className={`mt-0.5 px-1.5 xs:px-2 py-0.5 rounded text-[7.5px] xs:text-[8.5px] sm:text-[11px] font-black uppercase text-white tracking-wider shadow-md border whitespace-nowrap ${
                                isWinner ? 'bg-amber-500 border-yellow-200 text-slate-950 shadow-yellow-500/50' : `${group.headerColor} text-white`
                              }`}
                            >
                              {isWinner ? `🥇 ${group.name}` : rank === 2 ? `🥈 ${group.name}` : `🥉 ${group.name}`}
                            </div>

                            {/* PODIUM PEDESTAL / KÜRSÜ STAND */}
                            <div
                              className={`w-full mt-0.5 rounded-t-lg flex flex-col items-center justify-center border-t-2 border-x-2 shadow-2xl ${
                                isWinner
                                  ? 'h-6 xs:h-7 sm:h-9 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-600 border-yellow-200 text-slate-950 font-black'
                                  : 'h-3.5 xs:h-4 sm:h-6 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 border-slate-500 text-slate-300 font-bold'
                              }`}
                            >
                              <span className={`text-[7.5px] xs:text-[8.5px] sm:text-[11px] font-black drop-shadow-sm ${isWinner ? 'text-slate-950' : 'text-slate-300'}`}>
                                {isWinner ? '1. ŞAMPİYON' : `${rank}. SIRA`}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* 3. ACTION BUTTONS (INSIDE CREAM REGION, DIRECTLY UNDER PODIUM STANDS) */}
                <div className="relative z-50 shrink-0 flex items-center justify-center gap-5 sm:gap-7 w-full max-w-xs mt-2.5 sm:mt-3.5">
                  {/* REPLAY ICON BUTTON (tekrar.png) */}
                  <button
                    onClick={() => selectTopicAndStart(currentTopic)}
                    title="Yeniden Oyna"
                    className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
                  >
                    <img 
                      src="/tekrar.png" 
                      alt="Yeniden Oyna" 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  </button>

                  {/* MENU ICON BUTTON (menu.png) */}
                  <button
                    onClick={() => {
                      setGameState('welcome');
                      setSelectedCategoryId(getCategoryIdForTopic(currentTopic));
                    }}
                    title="Konu Menüsüne Dön"
                    className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
                  >
                    <img 
                      src="/menu.png" 
                      alt="Konu Menüsü" 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  </button>
                </div>
              </div>
            ) : (
              /* SINGLE PLAYER WIN / LOSS SECTION */
              <div className="relative flex flex-col items-center justify-center w-full max-w-lg select-none px-2 py-1">
                {/* 1. TOP HEADER SECTION */}
                <div className="relative flex flex-col items-center shrink-0 w-full z-10 mb-1">
                  {gameResult.reason === 'puan' ? (
                    <div className="flex flex-col items-center w-full">
                      <GlossyCompleteCard
                        title={gameResult.livesLeft === 3 ? "MÜKEMMEL BAŞARI!" : "TEBRİKLER!"}
                        subtitle={gameResult.livesLeft === 3 ? "🔥 Can Kaybetmeden Tamamladın!" : "10 Puana Ulaşarak Zafer Kazandın!"}
                        starsCount={gameResult.livesLeft === 3 ? 3 : gameResult.livesLeft >= 2 ? 2 : 1}
                      />
                      <div className="relative flex flex-col items-center w-full mt-0.5">
                        <GoldCoinDisplayCard sessionCoins={gameResult.score * 10} totalCoins={totalCoins} compact={true} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full max-w-sm">
                      {/* BANNER WITH bb3.png BEHIND "Üzgünüm, Canların Bitti!" */}
                      <div className="relative w-full h-10 sm:h-12 flex items-center justify-center px-3">
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                          style={{ backgroundImage: `url('/bb3.png')` }}
                        />
                        <div className="relative z-10 flex items-center justify-center gap-1.5 -translate-y-0.5">
                          <span className="text-base sm:text-lg drop-shadow-md">💔🎒</span>
                          <h2 className="text-[10px] sm:text-xs md:text-sm font-black text-amber-100 uppercase tracking-wide [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_0_8px_rgba(0,0,0,0.8)]">
                            Üzgünüm, Canların Bitti!
                          </h2>
                        </div>
                      </div>
                      <div className="mt-0.5">
                        <GoldCoinDisplayCard sessionCoins={gameResult.score * 10} totalCoins={totalCoins} compact={true} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MIDDLE SECTION: VIDEO */}
                <div className="relative w-full my-auto flex items-center justify-center overflow-visible pointer-events-none z-30 py-1 sm:py-2">
                  {gameResult.reason === 'puan' ? (
                    <div className="h-28 sm:h-36 aspect-[9/16] flex items-center justify-center relative">
                      <ChromaKeyVideo
                        key={customWinVideo || 'default-win-video'}
                        src={customWinVideo || "/aslan-win.mp4"}
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        enableChromaKey={true}
                        showControls={false}
                        className="w-full h-full object-contain scale-110 sm:scale-120 relative z-30 pointer-events-none"
                      />

                      {/* OVERLAY mcomp.mp4 (GÖREV TAMAMLANDI) DIRECTLY ON ASLAN'S BELLY IF WIN */}
                      <div className="absolute inset-x-0 top-[38%] -translate-y-1/2 z-40 pointer-events-none flex items-center justify-center overflow-visible">
                        <ChromaKeyVideo
                          src="/mcomp.mp4"
                          autoPlay={true}
                          loop={true}
                          muted={true}
                          enableChromaKey={true}
                          showControls={false}
                          className="w-full h-20 sm:h-24 object-contain scale-[1.5] origin-center pointer-events-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 sm:h-36 aspect-video w-full flex items-center justify-center relative">
                      <ChromaKeyVideo
                        key="trytry2-defeat-video"
                        src="/trytry2.mp4"
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        enableChromaKey={true}
                        showControls={false}
                        className="w-full h-full object-contain scale-110 sm:scale-120 relative z-30 pointer-events-none"
                      />
                    </div>
                  )}
                </div>

                {/* 3. ACTION BUTTONS (INSIDE CREAM REGION) */}
                <div className="relative z-50 shrink-0 flex items-center justify-center gap-5 sm:gap-7 w-full max-w-xs mt-2">
                  {/* REPLAY ICON BUTTON (tekrar.png) */}
                  <button
                    onClick={() => selectTopicAndStart(currentTopic)}
                    title="Yeniden Oyna"
                    className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
                  >
                    <img 
                      src="/tekrar.png" 
                      alt="Yeniden Oyna" 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  </button>

                  {/* MENU ICON BUTTON (menu.png) */}
                  <button
                    onClick={() => {
                      setGameState('welcome');
                      setSelectedCategoryId(getCategoryIdForTopic(currentTopic));
                    }}
                    title="Konu Menüsüne Dön"
                    className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
                  >
                    <img 
                      src="/menu.png" 
                      alt="Konu Menüsü" 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEWLY UNLOCKED BADGE / TROPHY TOAST NOTIFICATION */}
      {newlyUnlockedBadge && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[99999] animate-bounce px-4 w-full max-w-md pointer-events-none">
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${newlyUnlockedBadge.badgeColor} border-4 ${newlyUnlockedBadge.borderColor} shadow-[0_12px_30px_rgba(0,0,0,0.6)] text-white flex items-center gap-3.5`}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-inner overflow-hidden p-1">
              {newlyUnlockedBadge.imageSrc ? (
                <img src={newlyUnlockedBadge.imageSrc} alt={newlyUnlockedBadge.title} className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                newlyUnlockedBadge.icon
              )}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-yellow-200 drop-shadow-xs flex items-center gap-1">
                <Sparkles size={14} /> YENİ ROZET/KUPA KAZANILDIN!
              </div>
              <div className="text-lg font-black drop-shadow-md leading-tight">{newlyUnlockedBadge.title}</div>
              <div className="text-xs opacity-90 line-clamp-1">{newlyUnlockedBadge.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* STATS & TROPHY ROOM MODAL */}
      {showStatsModal && (() => {
        const playerLevel = getPlayerLevelInfo(statsData, badgeCounts, unlockedBadges);

        return (
          <ModernStatsView
            statsData={statsData}
            groupStatsData={groupStatsData}
            topics={topics}
            openedTopics={openedTopics}
            unlockedBadges={unlockedBadges}
            badgeCounts={badgeCounts}
            playerLevel={playerLevel}
            streak={streak}
            onSelectTopic={(key) => selectTopicAndStart(key)}
            onResetStats={() => {
              const keysToRemove = [
                'mathGameStats_v1',
                'mathGameGroupStats_v1',
                'mathGameBadges_v1',
                'mathGameBadgeCounts_v1',
                'mathGameTopicWins_v1',
                'openedTopics_v1',
                'mathGameStats',
                'mathGameBadges',
                'mathGameBadgeCounts',
                'mathGameTopicWins',
                'openedTopics'
              ];
              keysToRemove.forEach((key) => {
                try {
                  localStorage.removeItem(key);
                } catch (e) {
                  console.error('Error removing key:', key, e);
                }
              });
              try {
                localStorage.setItem('mathGameStats_v1', '{}');
                localStorage.setItem('mathGameGroupStats_v1', JSON.stringify(DEFAULT_GROUP_STATS));
                localStorage.setItem('mathGameBadges_v1', '[]');
                localStorage.setItem('mathGameBadgeCounts_v1', '{}');
                localStorage.setItem('mathGameTopicWins_v1', '{}');
                localStorage.setItem('openedTopics_v1', JSON.stringify(['nesne_sayisi']));
              } catch (e) {
                console.error('Error setting empty stats:', e);
              }
              setStatsData({});
              setGroupStatsData(DEFAULT_GROUP_STATS);
              setUnlockedBadges([]);
              setBadgeCounts({});
              setTopicWinCounts({});
              setOpenedTopics(['nesne_sayisi']);
              setScore(0);
              setStreak(0);
              setLives(3);
              setGameResult(null);
              setFeedbackState('none');
              setNewlyUnlockedBadge(null);
            }}
            confirmReset={confirmReset}
            setConfirmReset={setConfirmReset}
            onClose={() => setShowStatsModal(false)}
          />
        );
      })()}


      {/* 3D GEOMETRY INTERACTIVE LAB MODAL */}
      {show3DLab && <Geometry3DLab onClose={() => setShow3DLab(false)} />}

      {/* DİĞER OYUNLAR ANA SEÇİM HUB MODAL */}
      {showOtherGamesModal && !showXOXGame && !wordGameType && (
        <OtherGamesHub
          onClose={() => setShowOtherGamesModal(false)}
          onOpenXOX={() => setShowXOXGame(true)}
          onOpenZitAnlam={() => setWordGameType('zit_anlam')}
          onOpenEsAnlam={() => setWordGameType('es_anlam')}
          onOpenIngilizce={() => setWordGameType('ingilizce')}
          playMp3={playMp3}
        />
      )}

      {/* XOX GAME MODAL */}
      {showXOXGame && <XOXGame onClose={() => setShowXOXGame(false)} playMp3={playMp3} />}

      {/* ZIT ANLAM & EŞ ANLAM KELİME OYUNU MODAL */}
      {wordGameType !== null && (
        <WordGameModal
          gameType={wordGameType}
          onClose={() => setWordGameType(null)}
          playMp3={playMp3}
        />
      )}

      {/* FULL SCREEN GAME INTRO OVERLAY */}
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 sm:p-8 overflow-hidden animate-fadeIn">
          {/* Full Screen Intro Background Video */}
          <video
            ref={introVideoRef}
            src="/introh.mp4"
            poster="/intro2.png"
            autoPlay
            loop
            muted
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            // @ts-ignore
            x5-playsinline="true"
            disablePictureInPicture
            controls={false}
            className="absolute inset-0 w-full h-full object-cover sm:object-contain bg-slate-950 pointer-events-none select-none"
          />

          {/* Subtle Bottom Gradient Shade for Button Readability */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

          {/* Giriş Button Overlay positioned higher from the bottom using grs.png */}
          <div className="relative z-10 mb-12 sm:mb-20 md:mb-24 flex flex-col items-center">
            <button
              onClick={() => {
                playMp3('/coin.mp3');
                setShowIntro(false);
              }}
              className="group focus:outline-none cursor-pointer transition-transform transform hover:scale-105 active:scale-95 duration-200"
              aria-label="Oyuna Başla"
            >
              <img
                src="/grs.png"
                alt="Giriş Yap"
                className="h-16 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform group-hover:brightness-110"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

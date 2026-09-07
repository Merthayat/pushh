import { QuestionData } from "../types";

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
  kup: '<img src="/geos/kups.png" alt="Küp" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />',
  kure: '<img src="/geos/kures.png" alt="Küre" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />',
  silindir: '<img src="/geos/slndrs.png" alt="Silindir" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />',
  dikdortgen_prizma: '<img src="/geos/dikdprz.png" alt="Dikdörtgenler Prizması" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />',
  kare_prizma: '<img src="/geos/kareprz.png" alt="Kare Prizma" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />',
  ucgen_prizma: '<img src="/geos/ucgenprz.png" alt="Üçgen Prizma" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] mx-auto inline-block hover:scale-105 transition-transform" />'
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
  // İlkokul müfredatında eksi sayı kavramı yoktur: adaylar ve sonuçlar daima pozitif olmalıdır!
  const safeMin = Math.max(0, minVal);
  const sonuc: number[] = [];
  const gorulen = new Set<number>([correct]);
  for (const aday of adaylar) {
    if (sonuc.length === 3) break;
    if (!gorulen.has(aday) && aday >= safeMin) {
      gorulen.add(aday);
      sonuc.push(aday);
    }
  }
  let ek = 1;
  while (sonuc.length < 3) {
    const aday = Math.max(safeMin, correct) + 10 + ek;
    if (!gorulen.has(aday) && aday >= safeMin) {
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
  }).join('');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 flex-nowrap max-w-full px-0.5">
      ${sequenceHTML}
    </div>
  </div>`;

  return {
    question: `Aşağıdaki ritmik sayma zincirinde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi sayı gelmelidir?\n\n ${gosterilecek.join(" ")}`,
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
  }).join('');

  const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5">
    <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] px-1.5 leading-snug sm:leading-normal">
      Aşağıdaki geriye ritmik sayma zincirinde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
    </div>
    <div class="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 flex-nowrap max-w-full px-0.5">
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



export const topics2ndGrade: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
// 1. NESNELERİN GEOMETRİSİ
    geometrik_sekil_cisim: {
      title: "Geometrik Şekil ve Cisimler",
      desc: "Küp, küre, silindir, dikdörtgenler prizması gibi geometrik cisimleri tanıma.",
      generate: () => {
        const cisimAnahtarlari = Object.keys(CISIM_SVG);
        const secilenKey = cisimAnahtarlari[Math.floor(Math.random() * cisimAnahtarlari.length)];
        const dogruAd = CISIM_OZELLIK[secilenKey].ad;
        const tumAdlar = Object.values(CISIM_OZELLIK).map(o => o.ad);
        const wrong = rastgeleSec(tumAdlar.filter(a => a !== dogruAd), 3);
        const soruHTML = `<div class="flex flex-col items-center justify-center w-full my-auto max-h-full py-0.5"><div class="p-2 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-center shrink-0 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform">${CISIM_SVG[secilenKey]}</div></div>`;
        return {
          question: "",
          questionHTML: soruHTML,
          correct: dogruAd,
          wrong,
          isLong: true
        };
      }
    },
    yuz_ayrit_kose: {
      title: "Geometrik Cisimler: Yüz, Ayrıt, Köşe",
      desc: "Geometrik cisimlerin yüz, ayrıt ve köşe sayılarını bulma.",
      generate: () => {
        const cisimAnahtarlari = Object.keys(CISIM_SVG);
        const secilenKey = cisimAnahtarlari[Math.floor(Math.random() * cisimAnahtarlari.length)];
        const ozellik = CISIM_OZELLIK[secilenKey];
        const sorulan = ['yüz', 'ayrıt', 'köşe'][Math.floor(Math.random() * 3)] as 'yüz' | 'ayrıt' | 'köşe';
        const cevap = ozellik[sorulan];
        const ek = OZELLIK_EK[sorulan];
        const tamlayan = getCisimTamlayan(ozellik.ad);
        const soruHTML = `<div class="flex flex-col items-center justify-center w-full gap-1.5 sm:gap-2 my-auto max-h-full py-0.5"><div class="p-1.5 sm:p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-center shrink-0 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform">${CISIM_SVG[secilenKey]}</div><div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] w-full px-1"><b>${tamlayan}</b> kaç <b>${ek.buyuk}</b> vardır?</div></div>`;
        return {
          question: `${tamlayan} kaç ${ek.kucuk} vardır?`,
          questionHTML: soruHTML,
          correct: cevap,
          wrong: benzersizYanlislar(cevap, [cevap + 1, cevap - 1, cevap + 2, cevap - 2], 0),
          isLong: true
        };
      }
    },
    geometri_tahtasi: {
      title: "Geometri Tahtası",
      desc: "Noktaları parmağınla birleştirerek kare, dikdörtgen, üçgen, altıgen ve geometrik şekiller çiz.",
      generate: () => {
        const sekiller = [
          { ad: "Altıgen", ipucu: "6 kenarı ve 6 köşesi olan çokgendir.", yanlis: ["Beşgen", "Kare", "Üçgen"] },
          { ad: "Beşgen", ipucu: "5 kenarı ve 5 köşesi olan çokgendir.", yanlis: ["Altıgen", "Yamuk", "Dikdörtgen"] },
          { ad: "Paralelkenar", ipucu: "Karşılıklı kenarları paralel ve eşit uzunlukta olan dörtgendir.", yanlis: ["Üçgen", "Çember", "Küre"] },
          { ad: "Yamuk", ipucu: "Yalnızca iki kenarı birbirine paralel olan dörtgendir.", yanlis: ["Kare", "Altıgen", "Daire"] },
          { ad: "Çember", ipucu: "Köşesi ve kenarı olmayan yuvarlak geometrik şekildir.", yanlis: ["Kare", "Beşgen", "Altıgen"] }
        ];
        const s = sekiller[Math.floor(Math.random() * sekiller.length)];
        return {
          question: `Geometri tahtasında "${s.ipucu}" olan geometrik şekil hangisidir?`,
          correct: s.ad,
          wrong: s.yanlis,
          isLong: false
        };
      }
    },
    uzamsal_iliskiler_simetri: {
      title: "Uzamsal İlişkiler & Simetri",
      desc: "Simetrik harf, rakam ve şekilleri tanıma ve ayırt etme.",
      generate: () => {
        const simetrikHarfler = ['A', 'H', 'I', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y', '8'];
        const asimetrikHarfler = ['F', 'G', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z', '2', '3', '4', '5', '6', '7', '9'];
        const simetrikSoruluyor = Math.random() < 0.5;
        if (simetrikSoruluyor) {
          const correct = simetrikHarfler[Math.floor(Math.random() * simetrikHarfler.length)];
          const wrong = rastgeleSec(asimetrikHarfler, 3);
          return {
            question: "Aşağıdaki harf veya rakamlardan hangisi dikey eksende SİMETRİKTİR?",
            correct,
            wrong,
            isLong: true
          };
        } else {
          const correct = asimetrikHarfler[Math.floor(Math.random() * asimetrikHarfler.length)];
          const wrong = rastgeleSec(simetrikHarfler, 3);
          return {
            question: "Aşağıdaki harf veya rakamlardan hangisi dikey eksende SİMETRİK DEĞİLDİR?",
            correct,
            wrong,
            isLong: true
          };
        }
      }
    },
    geometrik_oruntu: {
      title: "Geometrik Örüntüler",
      desc: "Belirli bir kurala göre dizilmiş geometrik şekillerdeki eksik elemanı bulma.",
      generate: () => {
        const sekiller = ["🔴", "🟦", "🔺", "🟢"];
        const desen = [sekiller[0], sekiller[1], sekiller[2]];
        const oruntu = [...desen, ...desen];
        const boslukIndex = Math.floor(Math.random() * 3) + 3;
        const correct = oruntu[boslukIndex];
        const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
        const gosterim = [...oruntu];
        (gosterim as (string[])[number][])[boslukIndex] = secilenKare.emoji;

        const patternHTML = oruntu.map((item, idx) => {
          if (idx === boslukIndex) {
            return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-lg ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>`;
          }
          return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-blue-900/80 border border-blue-400/60 flex items-center justify-center text-xs xs:text-sm sm:text-lg shadow-md shrink-0">${item}</div>`;
        }).join('');

        const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2 py-0.5">
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
            Aşağıdaki geometrik örüntüde <span class="text-amber-300 underline decoration-amber-400 font-extrabold">${secilenKare.ad}</span> yerine hangi şekil gelmelidir?
          </div>
          <div class="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 flex-nowrap max-w-full overflow-hidden px-0.5 my-0.5">
            ${patternHTML}
          </div>
        </div>`;

        return {
          question: `Aşağıdaki geometrik örüntüde ${secilenKare.ad} (${secilenKare.emoji}) yerine hangi şekil gelmelidir?\n\n${gosterim.join("  -  ")}`,
          questionHTML: soruHTML,
          correct,
          wrong: sekiller.filter(s => s !== correct),
          isLong: true
        };
      }
    },

    // 2. SAYILAR VE NİCELİKLER
    nesne_sayisi: {
      title: "Nesne Sayısı",
      desc: "Verilen nesnelerin miktarını sayma ve belirleme.",
      generate: () => {
        const adet = Math.floor(Math.random() * 15) + 5;
        const emojis = ["🍎", "⭐", "🚗", "🎈", "🐱", "🐶", "🍓", "⚽"];
        const secilenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        let nesnelerHTML = '<div class="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-xs">';
        for (let i = 0; i < adet; i++) {
          nesnelerHTML += `<span class="text-xl sm:text-2xl">${secilenEmoji}</span>`;
        }
        nesnelerHTML += '</div>';

        return {
          question: `Yukarıdaki grupta kaç tane nesne vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 py-1 text-center">
              <div class="p-3 bg-slate-900/90 rounded-2xl border-2 border-amber-400/80 shadow-md">
                ${nesnelerHTML}
              </div>
              <div class="text-base sm:text-lg font-black text-white">Grupta kaç tane nesne vardır?</div>
            </div>
          `,
          correct: adet,
          wrong: benzersizYanlislar(adet, [adet + 1, adet - 1, adet + 2, adet - 2], 1),
          isLong: false
        };
      }
    },
    en_yakin_onluk: {
      title: "En Yakın Onluğa Yuvarlama (100'e Kadar)",
      desc: "100'e kadar olan iki basamaklı sayıları en yakın onluğa yuvarlama alıştırması yapıyoruz.",
      generate: () => {
        const mode = Math.random();

        if (mode < 0.6) {
          // Doğrudan 2 basamaklı sayıyı en yakın onluğa yuvarlama (Sonu 0 asla olamaz)
          const onlar = Math.floor(Math.random() * 9) + 1; // 1..9
          const birler = Math.floor(Math.random() * 9) + 1; // 1..9 (0 hariç)
          const sayi = onlar * 10 + birler; // 11..99
          const dogruOnluk = birler >= 5 ? (onlar + 1) * 10 : onlar * 10;
          const adaylar = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].filter(o => o !== dogruOnluk);
          const yanlislar = adaylar.sort(() => 0.5 - Math.random()).slice(0, 3);

          return {
            question: `${sayi} sayısı en yakın onluğa yuvarlandığında hangi sayı olur?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
                <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                  <span class="text-white">${sayi}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
                </div>
                <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                  <span class="text-amber-300 font-black">${sayi}</span> sayısı <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın onluğa</span> yuvarlandığında hangi sayı olur?
                </div>
              </div>
            `,
            correct: dogruOnluk,
            wrong: yanlislar,
            isLong: false
          };
        } else {
          // Belirli bir onluğa yuvarlanan sayıyı bulma
          const hedefOnluk = (Math.floor(Math.random() * 8) + 2) * 10; // 20, 30, 40, 50, 60, 70, 80, 90
          // Hedef onluğa yuvarlanan sayılar: (hedefOnluk - 5) .. (hedefOnluk + 4) - hedefOnluk hariç
          const yuvarlananlar: number[] = [];
          for (let s = hedefOnluk - 5; s <= hedefOnluk + 4; s++) {
            if (s !== hedefOnluk) yuvarlananlar.push(s);
          }
          const dogru = yuvarlananlar[Math.floor(Math.random() * yuvarlananlar.length)];

          // Yuvarlanmayan adaylar
          const baskaSayilar: number[] = [];
          for (let s = 11; s <= 99; s++) {
            if (s % 10 !== 0 && !yuvarlananlar.includes(s) && s !== hedefOnluk) {
              baskaSayilar.push(s);
            }
          }
          const yanlislar = baskaSayilar.sort(() => 0.5 - Math.random()).slice(0, 3);

          return {
            question: `Aşağıdaki sayılardan hangisi en yakın onluğa yuvarlandığında ${hedefOnluk} olur?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
                <div class="px-5 py-2 sm:px-7 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                  🎯 Hedef Onluk: ${hedefOnluk}
                </div>
                <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                  Aşağıdaki sayılardan hangisi <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın onluğa</span> yuvarlandığında <span class="text-amber-300 font-black">${hedefOnluk}</span> olur?
                </div>
              </div>
            `,
            correct: dogru,
            wrong: yanlislar,
            isLong: false
          };
        }
      }
    },
    sayi_basamak_degeri: {
      title: "Sayı ve Basamak Değeri",
      desc: "İki basamaklı sayılarda rakamların basamak ve sayı değerlerini bulma.",
      generate: () => {
        const onlar = Math.floor(Math.random() * 8) + 1;
        const birler = Math.floor(Math.random() * 9) + 1;
        const sayi = onlar * 10 + birler;
        const sorulanBasamak = Math.random() < 0.5 ? 'onlar' : 'birler';
        const soruTuru = Math.random() < 0.5 ? 'basamak' : 'sayi';
        const rakam = sorulanBasamak === 'onlar' ? onlar : birler;

        if (soruTuru === 'basamak') {
          const basamakDegeri = sorulanBasamak === 'onlar' ? onlar * 10 : birler;
          return {
            question: `${sayi} sayısının ${sorulanBasamak} basamağındaki rakamın BASAMAK DEĞERİ kaçtır?`,
            correct: basamakDegeri,
            wrong: benzersizYanlislar(basamakDegeri, [rakam, basamakDegeri + 10, basamakDegeri - 10, basamakDegeri + 5], 0),
            isLong: true
          };
        } else {
          const digerRakam = sorulanBasamak === 'onlar' ? birler : onlar;
          return {
            question: `${sayi} sayısının ${sorulanBasamak} basamağındaki rakamın SAYI DEĞERİ kaçtır?`,
            correct: rakam,
            wrong: benzersizYanlislar(rakam, [rakam + 1, rakam - 1, digerRakam, rakam * 10], 0),
            isLong: true
          };
        }
      }
    },
    deste_duzine: {
      title: "Deste ve Düzine",
      desc: "Deste (10 tane) ve Düzine (12 tane) kavramlarını öğrenme.",
      generate: () => {
        const k = Math.floor(Math.random() * 5) + 1;
        const isDeste = Math.random() < 0.5;
        const miktar = isDeste ? k * 10 : k * 12;
        const etiket = isDeste ? 'DESTE' : 'DÜZİNE';
        return {
          question: `${miktar} tane nesne kaç ${etiket} eder?`,
          correct: k,
          wrong: benzersizYanlislar(k, [k + 1, k - 1, k + 2, k + 3], 1),
          isLong: true
        };
      }
    },
    sayi_karsilastirma: {
      title: "Sayı Karşılaştırma & Semboller",
      desc: "İki basamaklı sayıları Büyüktür (>), Küçüktür (<) veya Eşittir (=) sembolleriyle karşılaştırma.",
      generate: () => {
        const a = Math.floor(Math.random() * 89) + 10;
        let b = Math.floor(Math.random() * 89) + 10;
        if (Math.random() < 0.2) b = a;
        let correct = '=';
        if (a > b) correct = '>';
        if (a < b) correct = '<';

        const soruHTML = `
          <div class="flex flex-col items-center justify-center w-full gap-2 sm:gap-3 my-auto max-h-full">
            <div class="flex items-center justify-center gap-2.5 sm:gap-5 text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]">
              <span class="bg-black/40 px-3 sm:px-5 py-1 sm:py-2 rounded-2xl border border-amber-300/40 shadow-inner">${a}</span>
              <span class="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 border-2 sm:border-3 border-amber-300 text-white font-black shadow-[0_4px_14px_rgba(225,29,72,0.8)] animate-pulse shrink-0">
                <span class="text-lg sm:text-3xl md:text-4xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">?</span>
              </span>
              <span class="bg-black/40 px-3 sm:px-5 py-1 sm:py-2 rounded-2xl border border-amber-300/40 shadow-inner">${b}</span>
            </div>
            <div class="text-xs sm:text-sm md:text-base font-black text-amber-200 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] bg-slate-950/70 px-3.5 py-1 sm:py-1.5 rounded-xl border border-amber-300/40">
              Kırmızı kutu yerine hangi sembol gelmelidir?
            </div>
          </div>
        `;

        return {
          question: `${a}   [ 🟥 ]   ${b}\n\nKırmızı kutu yerine hangi sembol gelmelidir?`,
          questionHTML: soruHTML,
          correct,
          wrong: ['>', '<', '='].filter(s => s !== correct),
          isLong: false
        };
      }
    },
    sira_sayilari: {
      title: "Sıra Bildiren Sayılar",
      desc: "1., 2., 3. gibi sıra bildiren sayıların okunuşlarını bulma.",
      generate: () => {
        const sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
        const num = sayilar[Math.floor(Math.random() * sayilar.length)];
        const okunuslar: Record<number, string> = {
          1: "Birinci", 2: "İkinci", 3: "Üçüncü", 4: "Dördüncü", 5: "Beşinci",
          6: "Altıncı", 7: "Yedinci", 8: "Sekizinci", 9: "Dokuzuncu", 10: "Onuncu",
          12: "On ikinci", 15: "On beşinci", 20: "Yirminci"
        };
        const correct = okunuslar[num];
        const tumOkunuslar = Object.values(okunuslar).filter(o => o !== correct);
        const wrong = rastgeleSec(tumOkunuslar, 3);
        return {
          question: `"${num}." sayısının okunuşu aşağıdakilerden hangisidir?`,
          correct,
          wrong,
          isLong: true
        };
      }
    },
    ritmik_ileri_2: {
      title: "İleri İkişer Sayma (2-30)",
      desc: "30'a kadar ikişer ritmik sayma zinciri tamamlama.",
      generate: () => ritmikIleriUret(2, 30)
    },
    ritmik_ileri_3: {
      title: "İleri Üçer Sayma (3-30)",
      desc: "30'a kadar üçer ritmik sayma zinciri tamamlama.",
      generate: () => ritmikIleriUret(3, 30)
    },
    ritmik_ileri_4: {
      title: "İleri Dörder Sayma (4-40)",
      desc: "40'a kadar dörder ritmik sayma zinciri tamamlama.",
      generate: () => ritmikIleriUret(4, 40)
    },
    ritmik_ileri_5: {
      title: "İleri Beşer Sayma (5-100)",
      desc: "100'e kadar beşer ritmik sayma zinciri tamamlama.",
      generate: () => ritmikIleriUret(5, 100)
    },
    ritmik_ileri_10: {
      title: "İleri Onar Sayma (10-100)",
      desc: "100'e kadar onar ritmik sayma zinciri tamamlama.",
      generate: () => ritmikIleriUret(10, 100)
    },
    ritmik_geri_2: {
      title: "Geriye İkişer Sayma (20-0)",
      desc: "20'den geriye ikişer ritmik sayma zinciri tamamlama.",
      generate: () => ritmikGeriUret(2)
    },
    ritmik_geri_10: {
      title: "Geriye Onar Sayma (100 içinde)",
      desc: "100 içinde geriye onar ritmik sayma zinciri tamamlama.",
      generate: () => ritmikGeriUret(10)
    },

    // 3. İŞLEMLER VE CEBİR
    tek_islem_toplama_problemleri: {
      title: "Tek İşlemli Toplama Problemleri",
      desc: "Tek adımlı toplama problemleri çözme alıştırması.",
      generate: () => {
        const nesneler = ["bilye", "fındık", "kalem", "çıkartma", "balon", "elma", "çilek", "muz", "portakal", "karpuz", "şeftali", "üzüm", "kiraz", "ceviz"];
        const isim = getRastgeleOgrenci();
        const nesne = nesneler[Math.floor(Math.random() * nesneler.length)];
        const baslangic = Math.floor(Math.random() * 25) + 15;
        const degisim = Math.floor(Math.random() * 15) + 5;
        const correct = baslangic + degisim;
        const tamlayanIsim = getIsimTamlayan(isim);
        const iyelikNesne = getNesneIyelik(nesne);
        return {
          question: `${tamlayanIsim} ${baslangic} tane ${iyelikNesne} vardı. Arkadaşı ona ${degisim} tane daha verdi. ${tamlayanIsim} toplam kaç ${iyelikNesne} oldu?`,
          correct,
          wrong: benzersizYanlislar(correct, [correct - degisim, correct + 5, correct - 5, baslangic], 1),
          isLong: true
        };
      }
    },
    iki_islem_toplama_problemleri: {
      title: "İki İşlemli Toplama Problemleri",
      desc: "İki adımlı toplama problemleri çözme alıştırması.",
      generate: () => {
        const s1 = Math.floor(Math.random() * 15) + 5;
        const s2 = Math.floor(Math.random() * 15) + 5;
        const s3 = Math.floor(Math.random() * 15) + 5;
        const correct = s1 + s2 + s3;
        return {
          question: `Bir kütüphanede 1. rafta ${s1}, 2. rafta ${s2} ve 3. rafta ${s3} kitap vardır. Kütüphanede toplam kaç kitap vardır?`,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 5, correct - 5, s1 + s2, correct + 10], 1),
          isLong: true
        };
      }
    },
    toplama_eldesiz_50: {
      title: "Eldesiz Toplama",
      desc: "Toplamı 50'yi geçmeyen eldesiz toplama alıştırmaları.",
      generate: () => {
        const { s1, s2, correct } = toplamaUret(20, 50, false);
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} + ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Eldesiz toplama işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${s1} + ${s2} = ?\n\nEldesiz toplama işleminin sonucu kaçtır?`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 10, correct - 2, correct + 5, correct - 5], 0),
          isLong: false
        };
      }
    },
    toplama_eldeli_50: {
      title: "Eldeli Toplama",
      desc: "Toplamı 50'yi geçmeyen eldeli toplama alıştırmaları.",
      generate: () => {
        const { s1, s2, correct } = toplamaUret(20, 50, true);
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} + ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Eldeli toplama işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>? <span class="text-yellow-300 font-black">(Eldeye dikkat!)</span>
            </div>
          </div>
        `;

        return {
          question: `${s1} + ${s2} = ?\n(Eldeye dikkat!)`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct - 10, correct + 2, correct - 1, correct + 10], 0),
          isLong: false
        };
      }
    },
    verilmeyen_toplanani_bul: {
      title: "Verilmeyen Toplananı Bul",
      desc: "Toplama işleminde verilmeyen toplananı bulma alıştırmaları (100'den küçük sayılar).",
      generate: () => {
        const sum = Math.floor(Math.random() * 75) + 20; // 20 .. 94 (100'den küçük)
        const s1 = Math.floor(Math.random() * (sum - 10)) + 5; // 5 .. sum - 5
        const s2 = sum - s1;
        const isFirstMissing = Math.random() < 0.5;

        const correct = isFirstMissing ? s1 : s2;
        const knownNum = isFirstMissing ? s2 : s1;

        const qBoxHTML = `<div class="w-11 h-11 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] border-2 sm:border-3 border-[#d97706] rounded-xl sm:rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_14px_rgba(0,0,0,0.5)] flex items-center justify-center text-[#1e293b] font-black text-2xl sm:text-3xl md:text-4xl select-none shrink-0">?</div>`;
        const plusHTML = `<span class="text-[#f59e0b] font-black text-2xl sm:text-4xl md:text-5xl [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] mx-1 sm:mx-2">+</span>`;
        const equalsHTML = `<span class="text-[#f59e0b] font-black text-2xl sm:text-4xl md:text-5xl [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] mx-1 sm:mx-2">=</span>`;
        const knownNumHTML = `<span class="text-white font-black text-2xl sm:text-4xl md:text-5xl [text-shadow:0_3px_6px_rgba(0,0,0,0.9)] tracking-wider">${knownNum}</span>`;
        const sumHTML = `<span class="text-[#38bdf8] font-black text-2xl sm:text-4xl md:text-5xl [text-shadow:0_3px_6px_rgba(0,0,0,0.9)] tracking-wider">${sum}</span>`;

        const equationHTML = isFirstMissing
          ? `${qBoxHTML} ${plusHTML} ${knownNumHTML} ${equalsHTML} ${sumHTML}`
          : `${knownNumHTML} ${plusHTML} ${qBoxHTML} ${equalsHTML} ${sumHTML}`;

        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full my-auto py-1">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#008d7a] border border-[#14b8a6] text-white font-black text-xs sm:text-sm tracking-wider shadow-md uppercase mb-2">
              <span class="text-sm sm:text-base font-black">+</span> VERİLMEYEN TOPLANANI BUL
            </div>
            <div class="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 my-2">
              ${equationHTML}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center tracking-wide [text-shadow:0_2px_6px_rgba(0,0,0,0.95)] drop-shadow-md mt-2 px-2">
              Soru işareti (<span class="text-amber-300 font-black">?</span>) yerine hangi sayı gelmelidir?
            </div>
          </div>
        `;

        const question = isFirstMissing
          ? `? + ${s2} = ${sum}\nSoru işareti (?) yerine hangi sayı gelmelidir?`
          : `${s1} + ? = ${sum}\nSoru işareti (?) yerine hangi sayı gelmelidir?`;

        const distractors = [
          correct + 10,
          correct - 10,
          correct + 2,
          correct - 2,
          correct + 5,
          correct - 5,
          sum - 10,
          isFirstMissing ? s2 : s1
        ].filter(n => n > 0 && n < 100);

        return {
          question,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, distractors, 1),
          isLong: false
        };
      }
    },
    tek_islem_cikarma_problemleri: {
      title: "Tek İşlemli Çıkarma Problemleri",
      desc: "Tek adımlı çıkarma problemleri çözme alıştırması.",
      generate: () => {
        const nesneler = ["bilye", "fındık", "kalem", "çıkartma", "balon", "elma", "çilek", "muz", "portakal", "karpuz", "şeftali", "üzüm", "kiraz", "ceviz"];
        const isim = getRastgeleOgrenci();
        const nesne = nesneler[Math.floor(Math.random() * nesneler.length)];
        const baslangic = Math.floor(Math.random() * 25) + 15;
        const degisim = Math.floor(Math.random() * 10) + 5;
        const correct = baslangic - degisim;
        const tamlayanIsim = getIsimTamlayan(isim);
        const iyelikNesne = getNesneIyelik(nesne);
        return {
          question: `${tamlayanIsim} ${baslangic} tane ${iyelikNesne} vardı. ${degisim} tanesini arkadaşlarına dağıttı. ${tamlayanIsim} kaç ${iyelikNesne} kaldı?`,
          correct,
          wrong: benzersizYanlislar(correct, [baslangic + degisim, correct + 5, correct - 5, degisim], 1),
          isLong: true
        };
      }
    },
    iki_islem_cikarma_problemleri: {
      title: "İki İşlemli Çıkarma Problemleri",
      desc: "İki adımlı çıkarma problemleri çözme alıştırması.",
      generate: () => {
        const baslangic = Math.floor(Math.random() * 20) + 30;
        const cikan1 = Math.floor(Math.random() * 8) + 5;
        const cikan2 = Math.floor(Math.random() * 8) + 5;
        const correct = baslangic - cikan1 - cikan2;
        return {
          question: `Bir kümeste ${baslangic} tavuk vardı. Önce ${cikan1} tavuk, sonra ${cikan2} tavuk satıldı. Kümeste kaç tavuk kaldı?`,
          correct,
          wrong: benzersizYanlislar(correct, [baslangic - cikan1, correct + 5, correct - 5, baslangic - cikan2], 1),
          isLong: true
        };
      }
    },
    toplama_cikarma_problemleri: {
      title: "Toplama ve Çıkarma Problemleri",
      desc: "Toplama ve çıkarma işlemlerini içeren karma problemler.",
      generate: () => {
        const baslangic = Math.floor(Math.random() * 20) + 15;
        const eklenen = Math.floor(Math.random() * 15) + 5;
        const cikarilan = Math.floor(Math.random() * 10) + 5;
        const correct = baslangic + eklenen - cikarilan;
        return {
          question: `Bir otobüste ${baslangic} yolcu vardı. İlk durakta ${eklenen} yolcu bindi, 2. durakta ${cikarilan} yolcu indi. Otobüste kaç yolcu kaldı?`,
          correct,
          wrong: benzersizYanlislar(correct, [baslangic + eklenen, baslangic - cikarilan, correct + 5, correct - 5], 1),
          isLong: true
        };
      }
    },
    cikarma_onluksuz_50: {
      title: "Onluk Bozmadan",
      desc: "Onluk bozma gerektirmeyen çıkarma alıştırmaları.",
      generate: () => {
        const { s1, s2, correct } = cikarmaUret(21, 50, false);
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} - ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Onluk bozmadan çıkarma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${s1} - ${s2} = ?\n\nOnluk bozmadan çıkarma işleminin sonucu kaçtır?`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 10, correct - 5, correct + 2, correct - 2], 0),
          isLong: false
        };
      }
    },
    cikarma_onluklu_50: {
      title: "Onluk Bozarak",
      desc: "Onluk bozarak çıkarma alıştırmaları.",
      generate: () => {
        const { s1, s2, correct } = cikarmaUret(21, 50, true);
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} - ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Onluk bozarak çıkarma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>? <span class="text-yellow-300 font-black">(Komşudan onluk al!)</span>
            </div>
          </div>
        `;

        return {
          question: `${s1} - ${s2} = ?\n(Komşudan onluk al!)`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 10, correct - 10, correct + 1, correct - 1], 0),
          isLong: false
        };
      }
    },
    zihinden_toplama: {
      title: "Zihinden Toplama",
      desc: "Zihinden toplama işlemleri yapma alıştırmaları.",
      generate: () => {
        const onlar = (Math.floor(Math.random() * 4) + 1) * 10;
        const birler = Math.floor(Math.random() * 30) + 10;
        const correct = onlar + birler;
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${onlar} + ${birler} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Zihinden topla: <span class="text-amber-300 underline decoration-amber-400 font-black">sonuç kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${onlar} + ${birler} = ?\n(Zihinden topla)`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 10, correct - 10, correct + 5, correct - 5], 0),
          isLong: false
        };
      }
    },
    zihinden_cikarma: {
      title: "Zihinden Çıkarma",
      desc: "Zihinden çıkarma işlemleri yapma alıştırmaları.",
      generate: () => {
        const s1 = Math.floor(Math.random() * 40) + 30;
        const s2 = (Math.floor(Math.random() * 2) + 1) * 10;
        const correct = s1 - s2;
        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} - ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Zihinden çıkar: <span class="text-amber-300 underline decoration-amber-400 font-black">sonuç kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${s1} - ${s2} = ?\n(Zihinden çıkar)`,
          questionHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + 10, correct - 10, correct + 5, correct - 5], 0),
          isLong: false
        };
      }
    },
    ardisik_toplama: {
      title: "Ardışık Toplama",
      desc: "Aynı sayının ardışık toplanması alıştırmaları.",
      generate: () => {
        const sayi = Math.floor(Math.random() * 4) + 2;
        const adet = Math.floor(Math.random() * 3) + 3;
        const dizi = Array(adet).fill(sayi);
        const correct = sayi * adet;
        const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];
        const ikonlar = ["🍎", "⭐", "🎈", "🍬", "🧁"];
        const nesneIkon = ikonlar[Math.floor(Math.random() * ikonlar.length)];

        const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
            İşlemde <span class="text-amber-300 underline decoration-amber-400 font-black">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
          </div>
          <!-- Yan yana taşmayan, görsel ve sayıyı birlikte gösteren esnek bloklar -->
          <div class="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2.5 text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white flex-wrap max-w-full px-1 my-1">
            ${dizi.map(n => `
              <div class="flex flex-col items-center justify-center px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-2 rounded-xl bg-blue-900/95 border-2 border-blue-400/90 shadow-md shrink-0 text-center min-w-[32px]">
                <div class="text-[11px] xs:text-xs sm:text-sm tracking-tighter leading-none mb-0.5 select-none">${Array(n).fill(nesneIkon).join('')}</div>
                <div class="text-sm xs:text-base sm:text-lg font-black text-amber-300 leading-tight">${n}</div>
              </div>
            `).join('<span class="text-amber-400 shrink-0 text-base sm:text-xl font-black">+</span>')}
            <span class="text-amber-400 shrink-0 text-base sm:text-xl font-black">=</span>
            <div class="flex flex-col items-center justify-center px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-tr ${secilenKare.bgClass} border-2 border-white text-white font-black shadow-lg animate-pulse text-base xs:text-lg sm:text-xl ring-2 ring-white/30 shrink-0 min-w-[36px]">
              <span class="text-xs sm:text-sm leading-none mb-0.5">${secilenKare.emoji}</span>
              <span class="text-amber-300 font-black text-sm xs:text-base sm:text-lg leading-tight">?</span>
            </div>
          </div>
        </div>`;

        return {
          question: `${dizi.join(" + ")} = ${secilenKare.emoji}`,
          questionHTML: soruHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + sayi, correct - sayi, correct + 1, correct - 1], 1),
          isLong: false
        };
      }
    },
    ritmik_carpim: {
      title: "Ritmik Çarpım",
      desc: "Ritmik sayma ile çarpma alıştırmaları.",
      generate: () => {
        const carpanlar = [2, 3, 4, 5, 10];
        const c1 = carpanlar[Math.floor(Math.random() * carpanlar.length)];
        const c2 = Math.floor(Math.random() * 9) + 1;
        const correct = c1 * c2;
        const secilenKare = RITMIK_KARE_RENKLERI[Math.floor(Math.random() * RITMIK_KARE_RENKLERI.length)];

        const soruHTML = `<div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1">
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
            İşlemde <span class="text-amber-300 underline decoration-amber-400 font-black">${secilenKare.ad}</span> yerine hangi sayı gelmelidir?
          </div>
          <div class="flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-3 text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-white flex-nowrap max-w-full overflow-hidden px-1 my-1">
            <span class="px-3 py-1 xs:px-4 xs:py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-blue-900/90 border-2 border-blue-400/80 shadow-md shrink-0">${c1}</span>
            <span class="text-amber-400 shrink-0 text-base sm:text-xl md:text-2xl">x</span>
            <span class="px-3 py-1 xs:px-4 xs:py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-blue-900/90 border-2 border-blue-400/80 shadow-md shrink-0">${c2}</span>
            <span class="text-amber-400 shrink-0 text-base sm:text-xl md:text-2xl">=</span>
            <div class="w-9 h-9 xs:w-11 xs:h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${secilenKare.bgClass} border-2 border-white text-white font-black flex items-center justify-center shadow-lg animate-pulse text-base xs:text-lg sm:text-xl ring-2 ring-white/30 shrink-0">${secilenKare.emoji}</div>
          </div>
        </div>`;

        return {
          question: `${c1}  x  ${c2}  =  ${secilenKare.emoji}`,
          questionHTML: soruHTML,
          correct,
          wrong: benzersizYanlislar(correct, [correct + c1, correct - c1, correct + 1, correct - 1], 1),
          isLong: false
        };
      }
    },
    esit_paylastirma: {
      title: "Eşit Paylaştırma",
      desc: "Eşit şekilde paylaştırma alıştırmaları.",
      generate: () => {
        const nesneler = ["elma", "çilek", "muz", "portakal", "karpuz", "şeftali", "üzüm", "kiraz", "mandalina", "erik", "fındık", "ceviz", "bilye", "balon"];
        const nesne = nesneler[Math.floor(Math.random() * nesneler.length)];
        const nesneBelirtme = getNesneBelirtme(nesne);
        const kisiler = Math.floor(Math.random() * 3) + 2;
        const kisiBasi = Math.floor(Math.random() * 5) + 2;
        const toplam = kisiler * kisiBasi;
        return {
          question: `${toplam} ${nesneBelirtme} ${kisiler} arkadaş eşit paylaşıyor. Her birine kaç ${nesne} düşer?`,
          correct: kisiBasi,
          wrong: benzersizYanlislar(kisiBasi, [kisiBasi + 1, kisiBasi - 1, kisiBasi + 2, kisiler], 1),
          isLong: true
        };
      }
    },
    ardisik_cikarma: {
      title: "Ardışık Çıkarma",
      desc: "Ardışık çıkarma alıştırmaları.",
      generate: () => {
        const cikan = Math.floor(Math.random() * 3) + 2;
        const tekrar = Math.floor(Math.random() * 3) + 3;
        const eksilen = cikan * tekrar;
        return {
          question: `${eksilen} sayısından sıfıra ulaşana kadar kaç kez ${cikan} çıkarılır?`,
          correct: tekrar,
          wrong: benzersizYanlislar(tekrar, [tekrar + 1, tekrar - 1, tekrar + 2, cikan], 1),
          isLong: true
        };
      }
    },
    kalansiz_bolme: {
      title: "Kalansız Bölme",
      desc: "Kalansız bölme alıştırmaları.",
      generate: () => {
        const bolen = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
        const bolum = Math.floor(Math.random() * 8) + 1;
        const bolunen = bolen * bolum;

        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
            <div class="formula-box w-full max-w-[94%] mx-auto py-2.5 px-3 xs:py-3 xs:px-4 sm:py-3.5 sm:px-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white font-black text-2xl xs:text-3xl sm:text-4xl border-2 sm:border-3 border-white/90 shadow-[0_6px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3.5 whitespace-nowrap tracking-wide">
              <span class="text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">${bolunen}</span>
              <span class="text-cyan-300 font-mono">÷</span>
              <span class="text-emerald-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">${bolen}</span>
              <span class="text-amber-300 font-mono">=</span>
              <span class="text-yellow-300 font-black animate-pulse">?</span>
            </div>
            <div class="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug mt-1">
              Bölme işleminin sonucu kaçtır?
            </div>
          </div>
        `;

        return {
          question: `${bolunen} ÷ ${bolen} = ?`,
          questionHTML,
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum * 2], 1),
          isLong: false
        };
      }
    },

    // 4. ÖLÇME, VERİ VE KESİRLER
    kesirler: {
      title: "Kesirler (Bütün, Yarım, Çeyrek)",
      desc: "Bütün, yarım ve çeyrek kesir dönüşümleri.",
      generate: () => {
        const yiyecekler = ["ekmek", "elma", "pasta", "pide", "karpuz", "portakal", "simit", "pizza", "kivi", "şeftali"];
        const yiyecek = yiyecekler[Math.floor(Math.random() * yiyecekler.length)];
        const tur = Math.floor(Math.random() * 4);

        if (tur === 0) {
          // Yarım -> Bütün
          const yarim = (Math.floor(Math.random() * 5) + 1) * 2;
          const buton = yarim / 2;
          return {
            question: `${yarim} yarım ${yiyecek} kaç BÜTÜN ${yiyecek} eder?`,
            correct: `${buton} Bütün`,
            wrong: benzersizYanlislarString(`${buton} Bütün`, [`${buton + 1} Bütün`, `${Math.max(1, buton - 1)} Bütün`, `${yarim} Bütün`, `${buton * 2} Bütün`]),
            isLong: false
          };
        } else if (tur === 1) {
          // Bütün -> Çeyrek
          const buton = Math.floor(Math.random() * 4) + 1;
          const ceyrek = buton * 4;
          return {
            question: `${buton} bütün ${yiyecek} kaç ÇEYREK ${yiyecek} eder?`,
            correct: `${ceyrek} Çeyrek`,
            wrong: benzersizYanlislarString(`${ceyrek} Çeyrek`, [`${ceyrek + 2} Çeyrek`, `${ceyrek - 2} Çeyrek`, `${buton * 2} Çeyrek`, `${ceyrek + 4} Çeyrek`]),
            isLong: false
          };
        } else if (tur === 2) {
          // Çeyrek -> Bütün
          const ceyrek = (Math.floor(Math.random() * 4) + 1) * 4;
          const buton = ceyrek / 4;
          return {
            question: `${ceyrek} çeyrek ${yiyecek} kaç BÜTÜN ${yiyecek} eder?`,
            correct: `${buton} Bütün`,
            wrong: benzersizYanlislarString(`${buton} Bütün`, [`${buton + 1} Bütün`, `${buton + 2} Bütün`, `${ceyrek / 2} Bütün`, `${ceyrek} Bütün`]),
            isLong: false
          };
        } else {
          // Bütün -> Yarım
          const buton = Math.floor(Math.random() * 5) + 1;
          const yarim = buton * 2;
          return {
            question: `${buton} bütün ${yiyecek} kaç YARIM ${yiyecek} eder?`,
            correct: `${yarim} Yarım`,
            wrong: benzersizYanlislarString(`${yarim} Yarım`, [`${buton} Yarım`, `${yarim + 2} Yarım`, `${buton * 4} Yarım`, `${yarim + 1} Yarım`]),
            isLong: false
          };
        }
      }
    },
    zaman_olcme: {
      title: "Zaman Ölçme & Saatler",
      desc: "Görsel analog saatler üzerinde akrep ve yelkovanla saat okuma.",
      generate: () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const tur = Math.floor(Math.random() * 5);
        const formatDigit = (num: number) => (num < 10 ? '0' + num : '' + num);

        if (tur === 0) {
          // Tam Saat (e.g. 03:00)
          const minute = 0;
          const dogruCevap = `${formatDigit(h)}:00`;
          const nextH = h === 12 ? 1 : h + 1;
          const prevH = h === 1 ? 12 : h - 1;
          const wrong = [
            `${formatDigit(h)}:30`,
            `${formatDigit(nextH)}:00`,
            `${formatDigit(prevH)}:00`
          ];

          const svg = generateClockSVG(h, minute);
          const soruHTML = `
            <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
              ${svg}
              <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
                <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
                <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">
                Görseldeki saat kaçı göstermektedir?
              </div>
            </div>
          `;

          return {
            question: "Görseldeki saat kaçı göstermektedir?",
            questionHTML: soruHTML,
            correct: dogruCevap,
            wrong,
            isLong: false
          };
        } else if (tur === 1) {
          // Buçuk / Yarım Saat (e.g. 04.30)
          const minute = 30;
          const dogruCevap = `${formatDigit(h)}.30`;
          const nextH = h === 12 ? 1 : h + 1;
          const wrong = [
            `${formatDigit(h)}.00`,
            `${formatDigit(nextH)}.30`,
            `${formatDigit(nextH)}.00`
          ];

          const svg = generateClockSVG(h, minute);
          const soruHTML = `
            <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
              ${svg}
              <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
                <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
                <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">
                Görseldeki analog saat kaçı göstermektedir?
              </div>
            </div>
          `;

          return {
            question: "Görseldeki analog saat kaçı göstermektedir?",
            questionHTML: soruHTML,
            correct: dogruCevap,
            wrong,
            isLong: false
          };
        } else if (tur === 2) {
          // Çeyrek Geçe (e.g. 02.15)
          const minute = 15;
          const dogruCevap = `${formatDigit(h)}.15`;
          const nextH = h === 12 ? 1 : h + 1;
          const wrong = [
            `${formatDigit(h)}.30`,
            `${formatDigit(h)}.00`,
            `${formatDigit(nextH)}.15`
          ];

          const svg = generateClockSVG(h, minute);
          const soruHTML = `
            <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
              ${svg}
              <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
                <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
                <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">
                Görseldeki saat kaçı göstermektedir?
              </div>
            </div>
          `;

          return {
            question: "Görseldeki saat kaçı göstermektedir?",
            questionHTML: soruHTML,
            correct: dogruCevap,
            wrong,
            isLong: false
          };
        } else if (tur === 3) {
          // Çeyrek Kala (e.g. 05.45)
          const minute = 45;
          const dogruCevap = `${formatDigit(h)}.45`;
          const nextH = h === 12 ? 1 : h + 1;
          const wrong = [
            `${formatDigit(h)}.15`,
            `${formatDigit(h)}.30`,
            `${formatDigit(nextH)}.45`
          ];

          const svg = generateClockSVG(h, minute);
          const soruHTML = `
            <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
              ${svg}
              <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
                <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
                <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">
                Görseldeki saat kaçı göstermektedir?
              </div>
            </div>
          `;

          return {
            question: "Görseldeki saat kaçı göstermektedir?",
            questionHTML: soruHTML,
            correct: dogruCevap,
            wrong,
            isLong: false
          };
        } else {
          // 1 saat sonrası sorusu
          const minute = 0;
          const simdikiSaat = `${formatDigit(h)}.00`;
          const sonrakiH = h === 12 ? 1 : h + 1;
          const dogruCevap = `${formatDigit(sonrakiH)}.00`;
          const wrong = [
            simdikiSaat,
            `${formatDigit(sonrakiH)}.30`,
            `${formatDigit(h === 1 ? 12 : h - 1)}.00`
          ];

          const svg = generateClockSVG(h, minute);
          const soruHTML = `
            <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
              ${svg}
              <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
                <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
                <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">
                Görseldeki saatten <b>1 SAAT SONRA</b> saat kaç olur?
              </div>
            </div>
          `;

          return {
            question: "Görseldeki saatten 1 SAAT SONRA saat kaç olur?",
            questionHTML: soruHTML,
            correct: dogruCevap,
            wrong,
            isLong: false
          };
        }
      }
    },
    saat_tam: {
      title: "Tam Saatler",
      desc: "Tam saatleri okuma ve ayırt etme.",
      generate: () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const formatDigit = (num: number) => (num < 10 ? '0' + num : '' + num);
        const dogruCevap = `${formatDigit(h)}.00`;
        const nextH = h === 12 ? 1 : h + 1;
        const prevH = h === 1 ? 12 : h - 1;
        const wrong = [`${formatDigit(h)}.30`, `${formatDigit(nextH)}.00`, `${formatDigit(prevH)}.00`];
        const svg = generateClockSVG(h, 0);
        const soruHTML = `
          <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
            ${svg}
            <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
              <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
              <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">Görseldeki analog saat kaçı göstermektedir?</div>
          </div>
        `;
        return { question: "Görseldeki analog saat kaçı göstermektedir?", questionHTML: soruHTML, correct: dogruCevap, wrong, isLong: false };
      }
    },
    saat_yarim: {
      title: "Yarım Saatler",
      desc: "Yarım (buçuk) saatleri okuma alıştırması.",
      generate: () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const formatDigit = (num: number) => (num < 10 ? '0' + num : '' + num);
        const dogruCevap = `${formatDigit(h)}.30`;
        const nextH = h === 12 ? 1 : h + 1;
        const wrong = [`${formatDigit(h)}.00`, `${formatDigit(nextH)}.30`, `${formatDigit(nextH)}.00`];
        const svg = generateClockSVG(h, 30);
        const soruHTML = `
          <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
            ${svg}
            <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
              <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
              <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">Görseldeki analog saat kaçı göstermektedir?</div>
          </div>
        `;
        return { question: "Görseldeki analog saat kaçı göstermektedir?", questionHTML: soruHTML, correct: dogruCevap, wrong, isLong: false };
      }
    },
    saat_ceyrek_gece: {
      title: "Çeyrek Geçiyor",
      desc: "Çeyrek geçe saatlerini okuma alıştırması.",
      generate: () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const formatDigit = (num: number) => (num < 10 ? '0' + num : '' + num);
        const dogruCevap = `${formatDigit(h)}.15`;
        const nextH = h === 12 ? 1 : h + 1;
        const wrong = [`${formatDigit(h)}.30`, `${formatDigit(h)}.00`, `${formatDigit(nextH)}.15`];
        const svg = generateClockSVG(h, 15);
        const soruHTML = `
          <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
            ${svg}
            <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
              <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
              <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">Görseldeki analog saat kaçı göstermektedir?</div>
          </div>
        `;
        return { question: "Görseldeki analog saat kaçı göstermektedir?", questionHTML: soruHTML, correct: dogruCevap, wrong, isLong: false };
      }
    },
    saat_ceyrek_kala: {
      title: "Çeyrek Var",
      desc: "Çeyrek kala saatlerini okuma alıştırması.",
      generate: () => {
        const h = Math.floor(Math.random() * 12) + 1;
        const formatDigit = (num: number) => (num < 10 ? '0' + num : '' + num);
        const dogruCevap = `${formatDigit(h)}.45`;
        const nextH = h === 12 ? 1 : h + 1;
        const wrong = [`${formatDigit(h)}.15`, `${formatDigit(h)}.30`, `${formatDigit(nextH)}.45`];
        const svg = generateClockSVG(h, 45);
        const soruHTML = `
          <div class="flex flex-col items-center justify-center gap-1 my-auto w-full">
            ${svg}
            <div class="flex items-center gap-1.5 text-[10px] sm:text-xs font-black">
              <span class="flex items-center gap-1 text-red-200 bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-500/50">🔴 Akrep</span>
              <span class="flex items-center gap-1 text-blue-200 bg-blue-950/80 px-1.5 py-0.5 rounded-md border border-blue-500/50">🔵 Yelkovan</span>
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 mt-1">Görseldeki analog saat kaçı göstermektedir?</div>
          </div>
        `;
        return { question: "Görseldeki analog saat kaçı göstermektedir?", questionHTML: soruHTML, correct: dogruCevap, wrong, isLong: false };
      }
    },
    takvim_olcme: {
      title: "Takvim, Günler & Aylar",
      desc: "Gün, hafta, ay, mevsim kavramları ve takvim okuma.",
      generate: () => {
        const t = Math.floor(Math.random() * 4);
        if (t === 0) {
          return {
            question: "1 yılda kaç mevsim vardır?",
            correct: 4,
            wrong: [2, 7, 12],
            isLong: false
          };
        } else if (t === 1) {
          return {
            question: "1 yılda kaç ay vardır?",
            correct: 12,
            wrong: [4, 7, 30],
            isLong: false
          };
        } else if (t === 2) {
          return {
            question: "1 haftada kaç gün vardır?",
            correct: 7,
            wrong: [5, 12, 30],
            isLong: false
          };
        } else {
          const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
          const index = Math.floor(Math.random() * 11);
          const onceki = aylar[index];
          const sonraki = aylar[index + 1];
          return {
            question: `${onceki} ayından sonra hangi ay gelir?`,
            correct: sonraki,
            wrong: rastgeleSec(aylar.filter(a => a !== sonraki && a !== onceki), 3),
            isLong: true
          };
        }
      }
    },
    paralarimiz: {
      title: "Paralarımız",
      desc: "Lira ve Kuruş hesabı ile alışveriş problemleri.",
      generate: () => {
        const getParaGorselleriByTL = (tl: number): string[] => {
          if (tl === 200) return ['/paralar/200_tl_kagit_para.png'];
          if (tl === 100) return ['/paralar/100_tl_kagit_para.png'];
          if (tl === 50) return ['/paralar/50_tl_kagit_para.png'];
          if (tl === 20) return ['/paralar/20_tl_kagit_para.png'];
          if (tl === 10) return ['/paralar/10_tl_kagit_para.png'];
          if (tl === 5) return ['/paralar/5_tl_kagit_para.png'];
          if (tl === 1) return ['/paralar/1_tl_madeni_para.png'];
          
          const result: string[] = [];
          let rem = tl;
          const banknotlar = [
            { val: 100, img: '/paralar/100_tl_kagit_para.png' },
            { val: 50, img: '/paralar/50_tl_kagit_para.png' },
            { val: 20, img: '/paralar/20_tl_kagit_para.png' },
            { val: 10, img: '/paralar/10_tl_kagit_para.png' },
            { val: 5, img: '/paralar/5_tl_kagit_para.png' },
            { val: 1, img: '/paralar/1_tl_madeni_para.png' }
          ];
          for (const b of banknotlar) {
            while (rem >= b.val && result.length < 4) {
              result.push(b.img);
              rem -= b.val;
            }
          }
          return result.length > 0 ? result : ['/paralar/1_tl_madeni_para.png'];
        };

        const renderMoneyQuestionHTML = (images: string[], questionText: string) => {
          return `
            <div class="flex flex-col items-center justify-center w-full gap-1 sm:gap-2 my-auto max-h-full px-1">
              <div class="para-container flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap my-0.5 max-w-full">
                ${images.map(imgSrc => {
                  const isCoin = imgSrc.includes('madeni');
                  return `
                    <img 
                      src="${imgSrc}" 
                      alt="Para" 
                      class="${isCoin ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" 
                    />
                  `;
                }).join('')}
              </div>
              <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-1 leading-snug">
                ${questionText}
              </div>
            </div>
          `;
        };

        const get3WrongOptions = (correctVal: number): number[] => {
          const wr: number[] = [];
          const candidates = [
            correctVal + 5,
            correctVal - 5,
            correctVal + 10,
            correctVal - 10,
            correctVal + 15,
            correctVal - 15,
            correctVal + 20,
            correctVal + 2,
            correctVal - 2
          ];
          for (const cand of candidates) {
            if (cand > 0 && cand <= 100 && cand !== correctVal && !wr.includes(cand)) {
              wr.push(cand);
            }
            if (wr.length === 3) break;
          }
          let step = 1;
          while (wr.length < 3) {
            const cand1 = correctVal - step;
            const cand2 = correctVal + step;
            if (cand1 > 0 && cand1 <= 100 && cand1 !== correctVal && !wr.includes(cand1)) {
              wr.push(cand1);
            } else if (cand2 > 0 && cand2 <= 100 && cand2 !== correctVal && !wr.includes(cand2)) {
              wr.push(cand2);
            } else if (cand2 > 100 && cand1 <= 0) {
              const fallback = wr.length + 10;
              if (!wr.includes(fallback) && fallback !== correctVal) wr.push(fallback);
            }
            step++;
            if (step > 150) {
              while (wr.length < 3) {
                const dummy = wr.length + 5;
                if (!wr.includes(dummy) && dummy !== correctVal) wr.push(dummy);
                else wr.push(dummy + 1);
              }
              break;
            }
          }
          return wr;
        };

        const nesneler = ["kitap", "oyuncak", "kalem", "defter", "top", "şapka", "çanta", "kalemlik", "silgi"];
        const nesne = nesneler[Math.floor(Math.random() * nesneler.length)];
        const ogrenci = getRastgeleOgrenci();

        const tur = Math.floor(Math.random() * 5);

        if (tur === 0) {
          // Unit Price Shopping (Tanesi X TL olan...)
          const birimFiyatList = [5, 10, 20, 50];
          const birimFiyat = birimFiyatList[Math.floor(Math.random() * birimFiyatList.length)];
          const maxAdet = Math.min(4, Math.floor(100 / birimFiyat));
          const adet = Math.floor(Math.random() * (maxAdet - 1)) + 2; // at least 2
          const toplam = birimFiyat * adet; // strictly <= 100

          const images = getParaGorselleriByTL(birimFiyat);
          const questionText = `Tanesi ${birimFiyat} TL olan ${getNesneAyrilma(nesne)} ${adet} tane alan ${ogrenci} kaç TL öder?`;

          return {
            question: questionText,
            questionHTML: renderMoneyQuestionHTML(images, questionText),
            correct: `${toplam} TL`,
            wrong: get3WrongOptions(toplam).map(v => `${v} TL`),
            isLong: false
          };
        } else if (tur === 1) {
          // Change Back / Remaining Money (Para Üstü)
          const verilecekList = [20, 50, 100];
          const verilecek = verilecekList[Math.floor(Math.random() * verilecekList.length)];
          const harcananCandidates = [5, 10, 15, 20, 25, 30, 40, 50].filter(h => h < verilecek);
          const harcanan = harcananCandidates[Math.floor(Math.random() * harcananCandidates.length)];
          const kalan = verilecek - harcanan; // strictly <= 100

          const images = getParaGorselleriByTL(verilecek);
          const questionText = `${verilecek} TL parası olan ${ogrenci}, ${harcanan} TL'ye bir ${nesne} alırsa kaç TL parası kalır?`;

          return {
            question: questionText,
            questionHTML: renderMoneyQuestionHTML(images, questionText),
            correct: `${kalan} TL`,
            wrong: get3WrongOptions(kalan).map(v => `${v} TL`),
            isLong: false
          };
        } else if (tur === 2) {
          // Two Different Items Shopping (İki farklı ürün)
          const banknotlar = [5, 10, 20, 50];
          const fiyat1 = banknotlar[Math.floor(Math.random() * banknotlar.length)];
          const fiyat2Candidates = banknotlar.filter(f => f + fiyat1 <= 100);
          const fiyat2 = fiyat2Candidates[Math.floor(Math.random() * fiyat2Candidates.length)];
          const toplam = fiyat1 + fiyat2; // strictly <= 100

          const images = [...getParaGorselleriByTL(fiyat1), ...getParaGorselleriByTL(fiyat2)];
          const nesne2Options = nesneler.filter(n => n !== nesne);
          const nesne2 = nesne2Options[Math.floor(Math.random() * nesne2Options.length)];
          const questionText = `Fiyatı ${fiyat1} TL olan ${nesne} ile ${fiyat2} TL olan ${getNesneBelirtme(nesne2)} alan ${ogrenci} toplam kaç TL öder?`;

          return {
            question: questionText,
            questionHTML: renderMoneyQuestionHTML(images, questionText),
            correct: `${toplam} TL`,
            wrong: get3WrongOptions(toplam).map(v => `${v} TL`),
            isLong: false
          };
        } else if (tur === 3) {
          // Doğrudan Görseldeki Paraları Toplama
          const kombinasyonlar = [
            {
              images: ['/paralar/50_tl_kagit_para.png', '/paralar/20_tl_kagit_para.png', '/paralar/5_tl_kagit_para.png'],
              toplam: 75,
              text: "Görseldeki paraların toplam değeri kaç TL'dir?"
            },
            {
              images: ['/paralar/100_tl_kagit_para.png', '/paralar/50_tl_kagit_para.png'],
              toplam: 150,
              text: "Görseldeki paraların toplam değeri kaç TL'dir?"
            },
            {
              images: ['/paralar/20_tl_kagit_para.png', '/paralar/20_tl_kagit_para.png', '/paralar/10_tl_kagit_para.png'],
              toplam: 50,
              text: "Görseldeki paraların toplam değeri kaç TL'dir?"
            },
            {
              images: ['/paralar/50_tl_kagit_para.png', '/paralar/10_tl_kagit_para.png', '/paralar/10_tl_kagit_para.png'],
              toplam: 70,
              text: "Görseldeki paraların toplam değeri kaç TL'dir?"
            },
            {
              images: ['/paralar/20_tl_kagit_para.png', '/paralar/10_tl_kagit_para.png', '/paralar/5_tl_kagit_para.png', '/paralar/1_tl_madeni_para.png'],
              toplam: 36,
              text: "Görseldeki paraların toplam değeri kaç TL'dir?"
            },
            {
              images: ['/paralar/50_kurus_madeni_para.png', '/paralar/50_kurus_madeni_para.png', '/paralar/1_tl_madeni_para.png'],
              toplam: 2,
              text: "Görseldeki madeni paraların toplam değeri kaç TL'dir?"
            }
          ];
          const k = kombinasyonlar[Math.floor(Math.random() * kombinasyonlar.length)];
          return {
            question: k.text,
            questionHTML: renderMoneyQuestionHTML(k.images, k.text),
            correct: `${k.toplam} TL`,
            wrong: get3WrongOptions(k.toplam).map(v => `${v} TL`),
            isLong: false
          };
        } else {
          // Kuruş to TL Conversion Problem
          const liraList = [1, 2, 3, 4, 5];
          const lira = liraList[Math.floor(Math.random() * liraList.length)];
          const kurus = lira * 100;

          const questionText = `Kumbarasından <span class="text-amber-300 font-black">${kurus} Kuruş</span> çıkan ${getIsimTamlayan(ogrenci)} toplam kaç TL parası vardır?`;

          return {
            question: `Kumbarasından ${kurus} Kuruş çıkan ${ogrenci} toplam kaç TL parası vardır?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full gap-2 my-auto max-h-full px-2 text-center">
                <div class="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xl sm:text-2xl border-2 border-white shadow-md inline-block my-1">
                  ${kurus} Kuruş
                </div>
                <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-1 leading-snug">
                  ${questionText}
                </div>
                <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(100 Kuruş = 1 TL)</div>
              </div>
            `,
            correct: `${lira} TL`,
            wrong: get3WrongOptions(lira).map(v => `${v} TL`),
            isLong: false
          };
        }
      }
    },
    uzunluk_olcme: {
      title: "Uzunluk Ölçme",
      desc: "Standart olan/olmayan birimler, uzunluk tahmin etme ve problemler.",
      generate: () => {
        // 3 Farklı Soru Tipi (Karma Etkinlik)
        // 1: Standart Olmayan Ölçme Araçları (Görsel 2 & 3 referanslı)
        // 2: Uzunluk Tahmin Etme
        // 3: Metre/Santimetre Dönüştürme ve Problemler
        const category = Math.floor(Math.random() * 3) + 1;

        if (category === 0) {
          // --- KATEGORİ 0: CETVEL ÜZERİNDE ÖLÇÜM (GÖRSEL CETVEL) ---
          // Cetvel 0 - 20 cm arasında
          const start = Math.floor(Math.random() * 6); // 0, 1, 2, 3, 4, 5
          const length = Math.floor(Math.random() * 10) + 3; // 3 - 12 cm arası
          const end = start + length;

          const startPct = (start / 20) * 100;
          const lengthPct = (length / 20) * 100;

          // 0'dan 20'ye kadar çizgiler
          let ticksHTML = '';
          for (let i = 0; i <= 20; i++) {
            const leftPct = (i / 20) * 100;
            const is5 = i % 5 === 0;
            const tickHeight = is5 ? 'h-3.5 sm:h-4.5 bg-amber-950 w-[2px]' : 'h-2 sm:h-2.5 bg-amber-900/80 w-[1px]';
            ticksHTML += `
              <div style="left: ${leftPct}%;" class="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div class="${tickHeight}"></div>
                <span class="text-[8px] sm:text-[9.5px] font-black ${is5 ? 'text-amber-950 scale-105' : 'text-amber-900/85'} mt-0.5 select-none leading-none">${i}</span>
              </div>
            `;
          }

          const wrapCetvelHTML = `
            <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
              <div class="bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-2.5 sm:p-3.5 shadow-xl w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center gap-2.5">
                <div class="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1">
                  <span>📏 CETVEL İLE UZUNLUK ÖLÇME</span>
                </div>
                
                <div class="w-full bg-amber-100/95 border-2 border-amber-500 rounded-xl p-3 sm:p-4 shadow-inner flex flex-col gap-1">
                  {/* ORTAK ÖLÇÜM SKALA KAPSAYICISI (px-4 sm:px-6) */}
                  <div class="relative w-full px-4 sm:px-6 pt-1 pb-1">
                    
                    {/* 1. ÇUBUK VE REHBER ÇİZGİLER (Tam W Genişliğinde) */}
                    <div class="relative w-full h-8 sm:h-10 mb-2">
                      {/* Pembe Çubuk */}
                      <div 
                        style="left: ${startPct}%; width: ${lengthPct}%;" 
                        class="absolute top-0 bottom-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 border-2 border-white rounded-md shadow-md flex items-center justify-center px-1 font-black z-10"
                      >
                        <span class="text-[10px] sm:text-xs font-black text-white drop-shadow-sm whitespace-nowrap overflow-hidden">ÇUBUK</span>
                      </div>

                      {/* Başlangıç Kırmızı Dikey Çizgisi (Cetvele Tam Uzanır) */}
                      <div 
                        style="left: ${startPct}%;" 
                        class="absolute top-0 -bottom-4 sm:-bottom-5 w-[2px] bg-rose-600 z-30 pointer-events-none transform -translate-x-1/2"
                      ></div>

                      {/* Bitiş Kırmızı Dikey Çizgisi (Cetvele Tam Uzanır) */}
                      <div 
                        style="left: ${startPct + lengthPct}%;" 
                        class="absolute top-0 -bottom-4 sm:-bottom-5 w-[2px] bg-rose-600 z-30 pointer-events-none transform -translate-x-1/2"
                      ></div>
                    </div>

                    {/* 2. AHŞAP CETVEL GÖVDESİ VE ÇİZGİLERİ */}
                    <div class="relative w-full h-11 sm:h-13 bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-400 border-2 border-amber-800 rounded-xl shadow-md select-none">
                      {/* Çizgiler Katmanı (border-2 offsetini sıfırlamak için -left-[2px] -right-[2px]) */}
                      <div class="absolute inset-y-0 -left-[2px] -right-[2px] pt-0.5">
                        ${ticksHTML}
                      </div>
                    </div>

                  </div>
                </div>

                <div class="bg-amber-400/20 border border-amber-400/50 rounded-lg p-2 text-center w-full">
                  <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white leading-snug">
                    Cetvel üzerinde gösterilen çubuğun uzunluğu kaç <b>santimetredir (cm)</b>? <br/>
                    <span class="text-xs sm:text-sm font-bold text-amber-200">(Çubuğun bittiği sayıdan başladığı sayıyı çıkarabilirsin)</span>
                  </div>
                </div>
              </div>
            </div>
          `;

          const dogruCevap = `${length} cm`;
          // Yanıltıcı şıklar: end cm (en sık yapılan hata), length + 1, length - 1, start cm
          const wrongList = [
            `${end} cm`,
            `${length + 2} cm`,
            `${Math.max(1, length - 2)} cm`,
            `${start > 0 ? start : length + 3} cm`
          ].filter(v => v !== dogruCevap);

          const uniqueWrong = Array.from(new Set(wrongList)).slice(0, 3);
          while (uniqueWrong.length < 3) {
            const extra = `${length + uniqueWrong.length + 3} cm`;
            if (!uniqueWrong.includes(extra) && extra !== dogruCevap) {
              uniqueWrong.push(extra);
            }
          }

          return {
            question: "Cetvel üzerinde gösterilen çubuğun uzunluğu kaç santimetredir?",
            questionHTML: wrapCetvelHTML,
            correct: dogruCevap,
            wrong: uniqueWrong,
            isLong: false
          };

        } else if (category === 1) {
          // --- KATEGORİ 1: STANDART OLMAYAN ÖLÇME ARAÇLARI (REFERANS GÖRSELLER) ---
          const STANDART_OLMAYAN_SORULAR = [
            {
              soru: "Silgilerimizi hangi standart olmayan ölçme aracıyla ölçmemiz daha doğru ve kolay olur?",
              emoji: "🧽",
              baslik: "SİLGİ ÖLÇÜMÜ",
              dogru: "Parmak",
              yanlis: ["Adım", "Kulaç", "Ayak"]
            },
            {
              soru: "90 metre uzunluğundaki bir duvarı adım, karış veya ayak ölçme araçlarından hangisini kullanarak <b>daha çabuk</b> ölçebiliriz?",
              emoji: "🧱",
              baslik: "DUVAR ÖLÇÜMÜ",
              dogru: "Adım",
              yanlis: ["Karış", "Parmak", "Ayağın boyu"]
            },
            {
              soru: "Açılan iki kol arasındaki mesafeye verilen standart olmayan ölçme birimi adı nedir?",
              emoji: "🫂",
              baslik: "KOL AÇIKLIĞI",
              dogru: "Kulaç",
              yanlis: ["Karış", "Ayağın boyu", "Parmak"]
            },
            {
              soru: "Bir elin açılmış başparmağı ile küçük parmağı arasındaki mesafeye ne ad verilir?",
              emoji: "🖐️",
              baslik: "EL ÖLÇÜMÜ",
              dogru: "Karış",
              yanlis: ["Kulaç", "Adım", "Parmak"]
            },
            {
              soru: "Sınıfımızın uzunluğunu en az sayıda sayma yaparak <b>en hızlı</b> şekilde ölçmek için hangisini tercih etmeliyiz?",
              emoji: "🏫",
              baslik: "SINIF BOYU ÖLÇÜMÜ",
              dogru: "Adım",
              yanlis: ["Karış", "Parmak", "Kulaç"]
            },
            {
              soru: "Aşağıdakilerden hangisi <b>STANDART</b> uzunluk ölçme birimidir?",
              emoji: "📏",
              baslik: "STANDART BİRİM",
              dogru: "Metre (m)",
              yanlis: ["Karış", "Kulaç", "Adım"]
            }
          ];

          const item = STANDART_OLMAYAN_SORULAR[Math.floor(Math.random() * STANDART_OLMAYAN_SORULAR.length)];

          const wrapStandartOlmayanHTML = `
            <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
              <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                <div class="text-3xl sm:text-4xl filter drop-shadow-md">${item.emoji}</div>
                <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">${item.baslik}</div>
              </div>
              <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                <div class="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1 mb-0.5">
                  <span>📐 ÖLÇME ARAÇLARI</span>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">${item.soru}</div>
              </div>
            </div>
          `;

          return {
            question: item.soru.replace(/<b>/g, '').replace(/<\/b>/g, ''),
            questionHTML: wrapStandartOlmayanHTML,
            correct: item.dogru,
            wrong: item.yanlis,
            isLong: true
          };

        } else if (category === 2) {
          // --- KATEGORİ 2: UZUNLUK TAHMİN ETME ---
          const TAHMIN_NESNELERI = [
            {
              nesne: "Kurşun Kalem",
              emoji: "✏️",
              soru: "Yazı yazarken kullandığımız bir <b>Kurşun Kalemin</b> boyu yaklaşık kaç santimetre (cm) olabilir?",
              plainSoru: "Kurşun kalemin boyu yaklaşık kaç cm olabilir?",
              dogru: "15 cm",
              yanlis: ["1 cm", "100 cm", "5 metre"]
            },
            {
              nesne: "Okul Silgisi",
              emoji: "🧽",
              soru: "Çantamızdaki standart bir <b>Okul Silgisinin</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Okul silgisinin boyu yaklaşık ne kadar olabilir?",
              dogru: "5 cm",
              yanlis: ["1 cm", "50 cm", "2 metre"]
            },
            {
              nesne: "Yazı Tahtası",
              emoji: "📋",
              soru: "Sınıfımızdaki <b>Yazı Tahtasının</b> genişliği yaklaşık ne kadar olabilir?",
              plainSoru: "Yazı tahtasının genişliği yaklaşık ne kadar olabilir?",
              dogru: "3 metre",
              yanlis: ["3 cm", "50 metre", "500 cm"]
            },
            {
              nesne: "Matematik Ders Kitabı",
              emoji: "📘",
              soru: "Masa üstündeki <b>Matematik Ders Kitabının</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Matematik ders kitabının boyu yaklaşık ne kadar olabilir?",
              dogru: "30 cm",
              yanlis: ["2 cm", "200 cm", "10 metre"]
            },
            {
              nesne: "Sınıf Kapısı",
              emoji: "🚪",
              soru: "Sınıfımızın <b>Kapısının</b> yüksekliği yaklaşık ne kadar olabilir?",
              plainSoru: "Sınıf kapısının yüksekliği yaklaşık ne kadar olabilir?",
              dogru: "2 metre",
              yanlis: ["10 cm", "50 metre", "100 metre"]
            },
            {
              nesne: "Bahçe Ağacı",
              emoji: "🌳",
              soru: "Okul bahçesindeki büyük bir <b>Ağacın</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Bahçe ağacının boyu yaklaşık ne kadar olabilir?",
              dogru: "5 metre",
              yanlis: ["5 cm", "100 metre", "1000 metre"]
            },
            {
              nesne: "Ataş (Kağıt Tutucu)",
              emoji: "📎",
              soru: "Kağıtları tutturduğumuz bir <b>Ataşın</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Ataşın boyu yaklaşık ne kadar olabilir?",
              dogru: "3 cm",
              yanlis: ["50 cm", "2 metre", "10 metre"]
            },
            {
              nesne: "Cep Telefonu",
              emoji: "📱",
              soru: "Akıllı bir <b>Cep Telefonunun</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Cep telefonunun boyu yaklaşık ne kadar olabilir?",
              dogru: "15 cm",
              yanlis: ["1 cm", "100 cm", "10 metre"]
            },
            {
              nesne: "Ders Cetveli",
              emoji: "📏",
              soru: "Çantamızdaki standart ders <b>Cetvelinin</b> boyu yaklaşık ne kadar olabilir?",
              plainSoru: "Ders cetvelinin boyu yaklaşık ne kadar olabilir?",
              dogru: "30 cm",
              yanlis: ["1 cm", "10 metre", "100 metre"]
            }
          ];

          const item = TAHMIN_NESNELERI[Math.floor(Math.random() * TAHMIN_NESNELERI.length)];

          const wrapUzunlukTahminHTML = `
            <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
              <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                <div class="text-3xl sm:text-4xl filter drop-shadow-md">${item.emoji}</div>
                <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">${item.nesne}</div>
              </div>
              <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                <div class="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1 mb-0.5">
                  <span>📏 UZUNLUK TAHMİNİ</span>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">${item.soru}</div>
              </div>
            </div>
          `;

          return {
            question: item.plainSoru,
            questionHTML: wrapUzunlukTahminHTML,
            correct: item.dogru,
            wrong: item.yanlis,
            isLong: false
          };

        } else {
          // --- KATEGORİ 3: METRE/SANTİMETRE DÖNÜŞTÜRME VE PROBLEMLER ---
          const problemType = Math.floor(Math.random() * 4);

          if (problemType === 0) {
            // 1 metre = 100 cm dönüşüm sorusu
            const metre = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4 metre
            const dogruCm = metre * 100;
            const wrapHTML = `
              <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
                <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                  <div class="text-3xl sm:text-4xl filter drop-shadow-md">📐</div>
                  <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">BİRİM DÖNÜŞÜMÜ</div>
                </div>
                <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                  <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
                    <b>${metre} metre</b> kaç santimetredir (cm)?
                  </div>
                </div>
              </div>
            `;
            return {
              question: `${metre} metre kaç santimetredir (cm)?`,
              questionHTML: wrapHTML,
              correct: `${dogruCm} cm`,
              wrong: [`${metre * 10} cm`, `${metre * 50} cm`, `${metre * 1000} cm`],
              isLong: false
            };
          } else if (problemType === 1) {
            // Kurdele kesme problemi
            const toplam = (Math.floor(Math.random() * 5) + 4) * 10; // 40, 50, 60, 70, 80 cm
            const kesilen = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, 30 cm
            const kalan = toplam - kesilen;

            const wrapHTML = `
              <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
                <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                  <div class="text-3xl sm:text-4xl filter drop-shadow-md">🎀</div>
                  <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">UZUNLUK PROBLEMİ</div>
                </div>
                <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                  <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
                    <b>${toplam} cm</b> uzunluğundaki kurdelenin <b>${kesilen} cm'si</b> kesildi. Geriye kaç cm kurdele kaldı?
                  </div>
                </div>
              </div>
            `;
            return {
              question: `${toplam} cm uzunluğundaki kurdelenin ${kesilen} cm'si kesilirse geriye kaç cm kalır?`,
              questionHTML: wrapHTML,
              correct: `${kalan} cm`,
              wrong: [`${toplam + kesilen} cm`, `${kalan + 10} cm`, `${Math.max(5, kalan - 10)} cm`],
              isLong: false
            };
          } else if (problemType === 2) {
            // Metre ve cm toplam boy
            const cmEk = (Math.floor(Math.random() * 8) + 1) * 5 + 10; // 15, 20, 25 ... 50 cm
            const toplamCm = 100 + cmEk;

            const wrapHTML = `
              <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
                <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                  <div class="text-3xl sm:text-4xl filter drop-shadow-md">🧍</div>
                  <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">BOY ÖLÇÜSÜ</div>
                </div>
                <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                  <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
                    Ali'nin boyu <b>1 metre ${cmEk} cm'dir</b>. Ali'nin boyu toplam kaç santimetredir?
                  </div>
                </div>
              </div>
            `;
            return {
              question: `Ali'nin boyu 1 metre ${cmEk} cm'dir. Ali'nin boyu toplam kaç santimetredir?`,
              questionHTML: wrapHTML,
              correct: `${toplamCm} cm`,
              wrong: [`${cmEk + 10} cm`, `${toplamCm + 20} cm`, `${toplamCm - 10} cm`],
              isLong: false
            };
          } else {
            // 1 Metrelik kumaştan kesilen
            const kesilen = (Math.floor(Math.random() * 6) + 2) * 10; // 20, 30, 40, 50, 60, 70 cm
            const kalan = 100 - kesilen;

            const wrapHTML = `
              <div class="w-full flex flex-col justify-center items-center gap-1.5 sm:gap-2 my-auto">
                <div class="bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-slate-950 border-2 border-white rounded-2xl px-4 py-1.5 sm:py-2 shadow-xl text-center w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center gap-0.5 shrink-0">
                  <div class="text-3xl sm:text-4xl filter drop-shadow-md">🧵</div>
                  <div class="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider bg-white/80 px-3 py-0.5 rounded-full border border-amber-400/60 shadow-2xs">KUMAŞ PROBLEMİ</div>
                </div>
                <div class="bg-slate-900/90 text-white border-2 border-amber-400 rounded-xl p-2.5 shadow-lg text-center w-full max-w-sm sm:max-w-md mx-auto shrink-0">
                  <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
                    <b>1 metrelik (100 cm)</b> bir kumaşın <b>${kesilen} cm'si</b> satıldı. Geriye kaç cm kumaş kaldı?
                  </div>
                </div>
              </div>
            `;
            return {
              question: `1 metrelik kumaşın ${kesilen} cm'si satıldı. Geriye kaç cm kumaş kaldı?`,
              questionHTML: wrapHTML,
              correct: `${kalan} cm`,
              wrong: [`${kesilen} cm`, `${kalan + 10} cm`, `${Math.max(10, kalan - 20)} cm`],
              isLong: false
            };
          }
        }
      }
    },
    tartma_olcme: {
      title: "Ağırlık Ölçme",
      desc: "Kütleleri ölçme, Kilogram (kg) kavramı ve nesneleri karşılaştırma.",
      generate: () => {
        const t = Math.floor(Math.random() * 3);
        if (t === 0) {
          const questionText = "Kütle (ağırlık) ölçüm birimi aşağıdakilerden hangisidir?";
          return {
            question: questionText,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full gap-1.5 sm:gap-2.5 my-auto px-1 text-center">
                <div class="flex items-center justify-center gap-2 flex-nowrap max-w-full overflow-hidden my-0.5">
                  <div class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/90 border-2 border-amber-400 text-amber-300 font-black text-xs xs:text-sm sm:text-lg shadow-md shrink-0 whitespace-nowrap">
                    ⚖️ Kütle (Ağırlık) Birimi = ❓
                  </div>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
                  ${questionText}
                </div>
              </div>
            `,
            correct: "Kilogram (kg)",
            wrong: ["Litre (L)", "Metre (m)", "Saat"],
            isLong: true
          };
        } else if (t === 1) {
          const meyveler = ["elma 🍎", "karpuz 🍉", "portakal 🍊", "çilek 🍓", "muz 🍌", "şeftali 🍑", "kavun 🍈", "üzüm 🍇", "limon 🍋", "ananas 🍍"];
          const m1 = meyveler[Math.floor(Math.random() * meyveler.length)];
          let m2 = meyveler[Math.floor(Math.random() * meyveler.length)];
          while (m2 === m1) m2 = meyveler[Math.floor(Math.random() * meyveler.length)];

          const k1 = Math.floor(Math.random() * 5) + 2;
          const k2 = Math.floor(Math.random() * 5) + 2;
          const toplam = k1 + k2;
          const questionText = `${k1} kg ${m1} ile ${k2} kg ${m2} toplam kaç kg eder?`;
          return {
            question: questionText,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full gap-1.5 sm:gap-2.5 my-auto px-1 text-center">
                <div class="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-full my-0.5">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-white font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">${k1} kg ${m1}</span>
                  <span class="text-amber-300 font-black text-xs xs:text-sm sm:text-base shrink-0">+</span>
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-white font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">${k2} kg ${m2}</span>
                  <span class="text-amber-300 font-black text-xs xs:text-sm sm:text-base shrink-0">=</span>
                  <span class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">❓ kg</span>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
                  ${questionText}
                </div>
              </div>
            `,
            correct: toplam,
            wrong: benzersizYanlislar(toplam, [toplam + 2, toplam - 1, k1 * k2, toplam + 5], 1),
            isLong: false
          };
        } else {
          const meyveler = ["elma 🍎", "çilek 🍓", "muz 🍌", "portakal 🍊", "şeftali 🍑", "karpuz 🍉", "kavun 🍈", "üzüm 🍇"];
          const m = meyveler[Math.floor(Math.random() * meyveler.length)];
          const ogrenci = getRastgeleOgrenci();
          const k1 = Math.floor(Math.random() * 6) + 5;
          const k2 = Math.floor(Math.random() * 4) + 1;
          const kalan = k1 - k2;
          const mAyrilma = getNesneAyrilma(m.split(' ')[0]);
          const questionText = `${ogrenci} pazardan ${k1} kg ${m} aldı. Ailesi ile birlikte ${k2} kg ${mAyrilma} yedi. Geride kaç kg ${m} kaldı?`;
          return {
            question: questionText,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full gap-1.5 sm:gap-2.5 my-auto px-1 text-center">
                <div class="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-full my-0.5">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-white font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">🛒 ${k1} kg ${m}</span>
                  <span class="px-2.5 py-1 rounded-lg bg-rose-950/90 border border-rose-600 text-rose-300 font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">-${k2} kg</span>
                  <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs xs:text-sm sm:text-base shadow-sm whitespace-nowrap">Kalan: ❓ kg</span>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-2 leading-snug">
                  ${questionText}
                </div>
              </div>
            `,
            correct: kalan,
            wrong: benzersizYanlislar(kalan, [k1 + k2, kalan + 2, kalan - 1, k2], 1),
            isLong: true
          };
        }
      }
    },
    sivi_olcme: {
      title: "Sıvı Ölçme",
      desc: "Sıvıları bardak, sürahi, kova gibi birimlerle ölçme.",
      generate: () => {
        const b = Math.floor(Math.random() * 4) + 2;
        const s = b * 4;
        return {
          question: `1 sürahi 4 bardak su almaktadır. Buna göre ${b} sürahi kaç bardak su alır?`,
          correct: s,
          wrong: benzersizYanlislar(s, [s + 2, s - 2, b + 4, s + 4], 1),
          isLong: true
        };
      }
    },
    veri_grafik: {
      title: "Veri Toplama ve Grafik Okuma",
      desc: "Nesne grafiği ve çetele tablolarını okuyup soruları cevaplama.",
      generate: () => {
        const elma = Math.floor(Math.random() * 5) + 3; // 3..7
        const muz = Math.floor(Math.random() * 4) + 2; // 2..5
        const cilek = Math.floor(Math.random() * 4) + 3; // 3..6

        const soruTuru = Math.floor(Math.random() * 3);
        let soru = "";
        let dogru = 0;

        if (soruTuru === 0) {
          soru = "Grafiğe göre en çok sevilen meyve hangisidir?";
          const enCok = Math.max(elma, muz, cilek);
          const meyve = elma === enCok ? "Elma" : muz === enCok ? "Muz" : "Çilek";
          return {
            question: `Grafiğe göre: Elma(${elma}), Muz(${muz}), Çilek(${cilek}). En çok sevilen meyve hangisidir?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center gap-2 sm:gap-2.5 text-center my-auto">
                <div class="p-2 sm:p-3 rounded-2xl bg-slate-900/85 border-2 border-amber-300 text-left text-sm xs:text-base sm:text-lg font-black text-white space-y-1">
                  <div>🍎 Elma: ${"🟥".repeat(elma)} (${elma})</div>
                  <div>🍌 Muz: ${"🟨".repeat(muz)} (${muz})</div>
                  <div>🍓 Çilek: ${"🟩".repeat(cilek)} (${cilek})</div>
                </div>
                <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-0.5">
                  Grafiğe göre en çok sevilen meyve hangisidir?
                </div>
              </div>
            `,
            correct: meyve,
            wrong: ["Elma", "Muz", "Çilek", "Portakal"].filter(m => m !== meyve).slice(0, 3),
            isLong: false
          };
        } else if (soruTuru === 1) {
          dogru = elma + muz;
          soru = `Elma ve Muz seven çocukların toplamı kaçtır?`;
        } else {
          // Her zaman çok olandan az olanı çıkarıyoruz ki fark daima pozitif olsun (eksi sayı kavramı yok)
          let meyve1 = "Elma";
          let meyve2 = "Muz";
          let sayi1 = elma;
          let sayi2 = muz;
          if (muz > elma) {
            meyve1 = "Muz";
            meyve2 = "Elma";
            sayi1 = muz;
            sayi2 = elma;
          } else if (elma === muz) {
            sayi1 = elma + 2;
          }
          dogru = sayi1 - sayi2;
          soru = `${meyve1} sevenler, ${meyve2} sevenlerden kaç fazladır?`;
        }

        return {
          question: `Grafiğe göre: Elma(${elma}), Muz(${muz}), Çilek(${cilek}). ${soru}`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center gap-2 sm:gap-2.5 text-center my-auto">
              <div class="p-2 sm:p-3 rounded-2xl bg-slate-900/85 border-2 border-amber-300 text-left text-sm xs:text-base sm:text-lg font-black text-white space-y-1">
                <div>🍎 Elma: ${"🟥".repeat(elma)} (${elma})</div>
                <div>🍌 Muz: ${"🟨".repeat(muz)} (${muz})</div>
                <div>🍓 Çilek: ${"🟩".repeat(cilek)} (${cilek})</div>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-0.5">
                ${soru}
              </div>
            </div>
          `,
          correct: dogru,
          wrong: benzersizYanlislar(dogru, [dogru + 1, dogru - 1, dogru + 2, dogru + 3].filter(n => n > 0), 1),
          isLong: false
        };
      }
    }
  
};

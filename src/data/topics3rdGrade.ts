import { QuestionData } from '../types';

// Öğrenci İsimleri
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

// Türkçe Tamlayan / İyelik Eki (-in, -ın, -un, -ün, -nin, -nın, -nun, -nün)
function getIsimTamlayan(isim: string): string {
  const clean = toTitleCaseTR(isim.trim());
  if (!clean) return isim;
  if (clean.endsWith("Su")) return `${clean}'yun`;

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

// Türkçe Ayrılma Hali Eki (-den, -dan, -ten, -tan)
function getIsimAyrilma(isim: string): string {
  const clean = toTitleCaseTR(isim.trim());
  if (!clean) return isim;
  if (clean.endsWith("Su")) return `${clean}'dan`;

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

  return `${clean}'${startChar}${endChar}`;
}

// Türkçe Yönelme Hali Eki (-e, -a, -ye, -ya)
function getIsimYonelme(isim: string): string {
  const clean = toTitleCaseTR(isim.trim());
  if (!clean) return isim;
  if (clean.endsWith("Su")) return `${clean}'ya`;

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

  const suffix = ['a', 'ı', 'o', 'u'].includes(lastVowel) ? (isVowel ? 'ya' : 'a') : (isVowel ? 'ye' : 'e');
  return `${clean}'${suffix}`;
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
    const aday1 = correct + ek;
    if (!gorulen.has(aday1) && aday1 >= minVal) {
      gorulen.add(aday1);
      sonuc.push(aday1);
    }
    if (sonuc.length === 3) break;
    const aday2 = correct - ek;
    if (!gorulen.has(aday2) && aday2 >= minVal) {
      gorulen.add(aday2);
      sonuc.push(aday2);
    }
    ek++;
  }
  return sonuc;
}

// 3. Sınıf Sayı Okunuşu Sözlüğü
const BIRLER = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const ONLAR = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];

function sayiOkunusu(sayi: number): string {
  if (sayi === 0) return "sıfır";
  if (sayi === 1000) return "bin";
  let metin = "";
  const yuzler = Math.floor(sayi / 100);
  const onlar = Math.floor((sayi % 100) / 10);
  const birler = sayi % 10;

  if (yuzler > 0) {
    if (yuzler === 1) metin += "yüz";
    else metin += BIRLER[yuzler] + " yüz";
  }
  if (onlar > 0) {
    if (metin !== "") metin += " ";
    metin += ONLAR[onlar];
  }
  if (birler > 0) {
    if (metin !== "") metin += " ";
    metin += BIRLER[birler];
  }
  return metin;
}

// Analog Saat SVG Oluşturucu (Akrep & Yelkovan)
function generateClockSVG(hour: number, minute: number): string {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const hRad = (hourAngle - 90) * (Math.PI / 180);
  const mRad = (minuteAngle - 90) * (Math.PI / 180);

  const hX = 50 + 20 * Math.cos(hRad);
  const hY = 50 + 20 * Math.sin(hRad);

  const mX = 50 + 30 * Math.cos(mRad);
  const mY = 50 + 30 * Math.sin(mRad);

  let numbersHTML = '';
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const nx = 50 + 38 * Math.cos(angle);
    const ny = 50 + 38 * Math.sin(angle);
    numbersHTML += `<text x="${nx}" y="${ny + 3.5}" text-anchor="middle" font-size="9" font-weight="900" fill="#1e293b">${i}</text>`;
  }

  return `
    <svg viewBox="0 0 100 100" class="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#f59e0b" stroke-width="5" />
      <circle cx="50" cy="50" r="44" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.5" />
      ${numbersHTML}
      <line x1="50" y1="50" x2="${hX}" y2="${hY}" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round" />
      <line x1="50" y1="50" x2="${mX}" y2="${mY}" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
      <circle cx="50" cy="50" r="3.5" fill="#f59e0b" />
    </svg>
  `;
}

// Kesir Modeli (Pasta / Daire SVG)
function generatePieFractionSVG(numerator: number, denominator: number): string {
  const cx = 50;
  const cy = 50;
  const r = 42;
  const paths: string[] = [];

  for (let i = 0; i < denominator; i++) {
    const startAngle = (i * (360 / denominator) - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * (360 / denominator) - 90) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const isFilled = i < numerator;
    const fill = isFilled ? '#f59e0b' : '#f8fafc';

    paths.push(
      `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#1e293b" stroke-width="2" />`
    );
  }

  return `
    <svg viewBox="0 0 100 100" class="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      ${paths.join('')}
      <circle cx="50" cy="50" r="3" fill="#1e293b" />
    </svg>
  `;
}

// Kesir Modeli (Dikdörtgen Şerit SVG)
function generateBarFractionSVG(numerator: number, denominator: number): string {
  const totalW = 160;
  const h = 36;
  const partW = totalW / denominator;
  const rects: string[] = [];

  for (let i = 0; i < denominator; i++) {
    const isFilled = i < numerator;
    const fill = isFilled ? '#3b82f6' : '#f8fafc';
    rects.push(
      `<rect x="${i * partW}" y="0" width="${partW}" height="${h}" fill="${fill}" stroke="#0f172a" stroke-width="2" />`
    );
  }

  return `
    <svg viewBox="0 0 ${totalW} ${h}" class="w-44 sm:w-56 h-10 sm:h-12 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      ${rects.join('')}
    </svg>
  `;
}

// Açı Gösterimi SVG (Dar, Dik, Geniş)
function generateAngleSVG(angleDeg: number, label: string): string {
  const rad = (angleDeg * Math.PI) / 180;
  const len = 40;
  const cx = 20;
  const cy = 70;
  const x2 = cx + len;
  const y2 = cy;
  const x1 = cx + len * Math.cos(-rad);
  const y1 = cy + len * Math.sin(-rad);

  let arcPath = '';
  if (angleDeg === 90) {
    arcPath = `<path d="M ${cx + 12} ${cy} L ${cx + 12} ${cy - 12} L ${cx} ${cy - 12}" fill="none" stroke="#ef4444" stroke-width="2" /><circle cx="${cx + 6}" cy="${cy - 6}" r="1.5" fill="#ef4444" />`;
  } else {
    const arcRad = 16;
    const arcX = cx + arcRad * Math.cos(-rad);
    const arcY = cy + arcRad * Math.sin(-rad);
    arcPath = `<path d="M ${cx + arcRad} ${cy} A ${arcRad} ${arcRad} 0 0 0 ${arcX} ${arcY}" fill="none" stroke="#ef4444" stroke-width="2.5" />`;
  }

  return `
    <svg viewBox="0 0 90 90" class="w-20 h-20 sm:w-24 sm:h-24 bg-white/95 rounded-2xl p-1 border-2 border-slate-700 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      <line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#1e293b" stroke-width="4" stroke-linecap="round" />
      ${arcPath}
      <circle cx="${cx}" cy="${cy}" r="3.5" fill="#1e293b" />
      <text x="75" y="85" font-size="8" font-weight="900" fill="#64748b" text-anchor="end">${label}</text>
    </svg>
  `;
}

// -------------------------------------------------------------
// 3. SINIF MATEMATİK KAZANIMLARI VE SORU ÜRETECİLERİ
// -------------------------------------------------------------

export const topics3rdGrade: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {

  // =========================================================================
  // TEMA 1: SAYILAR VE NİCELİKLER (1)
  // =========================================================================

  // 1.1 Üç Basamaklı Sayılar (Okuma ve Yazma)
  g3_uc_basamakli_okuma_yazma: {
    title: "1000'e Kadar Sayıları Okuma & Yazma",
    desc: "Üç basamaklı doğal sayıların okunuşları ve rakamla yazılışları",
    generate: () => {
      const mode = Math.random() < 0.5 ? 'sayidan_okunusa' : 'okunustan_sayiya';
      const sayi = Math.floor(Math.random() * 900) + 100; // 100-999

      if (mode === 'sayidan_okunusa') {
        const dogru = sayiOkunusu(sayi);
        const y1 = sayiOkunusu(sayi + 10);
        const y2 = sayiOkunusu(sayi - (sayi % 10 === 0 ? 1 : 1));
        const y3 = sayiOkunusu(sayi + 100 > 999 ? sayi - 100 : sayi + 100);
        const yanlislar = [y1, y2, y3].filter(y => y !== dogru).slice(0, 3);
        while (yanlislar.length < 3) {
          yanlislar.push(sayiOkunusu(sayi + yanlislar.length + 5));
        }

        return {
          question: `${sayi} sayısının doğru okunuşu hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-wide">
                ${sayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu sayının <span class="text-amber-300 underline decoration-amber-400 font-black">doğru okunuşu</span> hangisidir?
              </div>
            </div>
          `,
          correct: dogru.toLocaleUpperCase('tr-TR'),
          wrong: yanlislar.map(y => y.toLocaleUpperCase('tr-TR')),
          isLong: true
        };
      } else {
        const dogru = sayi;
        const okunusu = sayiOkunusu(sayi);
        const adaylar = [sayi + 10, sayi - 10, sayi + 100, sayi - 100, sayi + 1, sayi - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 100);

        return {
          question: `"${okunusu}" şeklinde okunan sayı hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-slate-900/90 border-2 border-amber-400 text-amber-300 font-black text-base sm:text-xl md:text-2xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-wide">
                "${okunusu.toLocaleUpperCase('tr-TR')}"
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Okunuşu verilen <span class="text-amber-300 underline decoration-amber-400 font-black">sayı hangisidir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 1.2 Sayıları Çözümleme ve Basamak Değeri
  g3_sayi_cozumleme: {
    title: "Sayıları Çözümleme & Basamak Değeri",
    desc: "Yüzler, onlar ve birler basamağı çözümlemeleri ve basamak değerleri",
    generate: () => {
      const type = Math.random();
      const yuzler = Math.floor(Math.random() * 9) + 1; // 1-9
      const onlar = Math.floor(Math.random() * 10); // 0-9
      const birler = Math.floor(Math.random() * 10); // 0-9
      const sayi = yuzler * 100 + onlar * 10 + birler;

      if (type < 0.35) {
        const secilenBasamak = Math.random() < 0.4 ? 'yüzler' : Math.random() < 0.5 ? 'onlar' : 'birler';
        let dogru = 0;
        let rakam = 0;
        if (secilenBasamak === 'yüzler') {
          dogru = yuzler * 100;
          rakam = yuzler;
        } else if (secilenBasamak === 'onlar') {
          dogru = onlar * 10;
          rakam = onlar;
        } else {
          dogru = birler;
          rakam = birler;
        }

        const adaylar = [yuzler * 100, onlar * 10, birler, rakam, dogru + 10, dogru + 100];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${sayi} sayısının ${secilenBasamak} basamağındaki "${rakam}" rakamının basamak değeri kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${sayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Sayısındaki <span class="text-amber-300 underline decoration-amber-400 font-black">${secilenBasamak} basamağının</span> basamak değeri kaçtır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else if (type < 0.7) {
        const dogru = sayi;
        const metin = `${yuzler} yüzlük + ${onlar} onluk + ${birler} birlik`;
        const adaylar = [
          yuzler * 100 + birler * 10 + onlar,
          birler * 100 + onlar * 10 + yuzler,
          dogru + 10,
          dogru - 10,
          dogru + 100
        ];
        const yanlis = benzersizYanlislar(dogru, adaylar, 100);

        return {
          question: `"${metin}" şeklinde çözümlenen sayı kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-4 py-2 rounded-2xl bg-indigo-950/90 border-2 border-indigo-400 text-indigo-200 font-black text-sm sm:text-lg md:text-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${metin}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Çözümlenmiş hali verilen <span class="text-amber-300 underline decoration-amber-400 font-black">sayı kaçtır?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const dogru = sayi;
        const toplamStr = `${yuzler * 100} + ${onlar * 10} + ${birler}`;
        const adaylar = [dogru + 10, dogru - 10, dogru + 100, dogru - 100, yuzler * 10 + onlar + birler];
        const yanlis = benzersizYanlislar(dogru, adaylar, 100);

        return {
          question: `${toplamStr} toplamı hangi sayıya eşittir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-teal-900 border-2 border-teal-300 text-teal-200 font-black text-xl sm:text-2xl md:text-3xl shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${toplamStr}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Basamak değerleri toplamı <span class="text-amber-300 underline decoration-amber-400 font-black">hangi sayıya eşittir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 1.3 Sayıları Sıralama ve Karşılaştırma (<, >, =)
  g3_sayi_siralama_karsilastirma: {
    title: "Sayıları Sıralama & Karşılaştırma",
    desc: "Üç basamaklı sayılarda küçüktür (<), büyüktür (>) ve küçükten büyüğe sıralama",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.35) {
        // İki sayıyı karşılaştırma: <, >, =
        const a = Math.floor(Math.random() * 800) + 100;
        const diff = (Math.floor(Math.random() * 50) + 1) * (Math.random() < 0.5 ? 1 : -1);
        const b = Math.random() < 0.2 ? a : Math.max(100, a + diff);

        let sembol = "=";
        let aciklama = "Eşittir";
        if (a > b) {
          sembol = ">";
          aciklama = "Büyüktür";
        } else if (a < b) {
          sembol = "<";
          aciklama = "Küçüktür";
        }

        const dogru = `${sembol} (${aciklama})`;
        const adaylar = [
          `${sembol === '<' ? '>' : '<'} (${sembol === '<' ? 'Büyüktür' : 'Küçüktür'})`,
          `= (Eşittir)`,
          `+ (Toplama)`,
          `- (Çıkarma)`
        ];
        const yanlis = adaylar.filter(x => x !== dogru).slice(0, 3);

        return {
          question: `${a} ... ${b} ifadesinde noktalı yere hangi karşılaştırma sembolü gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-2 sm:gap-3">
                <span class="px-4 py-2 rounded-2xl bg-blue-600 text-white font-black text-xl sm:text-2xl md:text-3xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white">
                  ${a}
                </span>
                <span class="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  ?
                </span>
                <span class="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-xl sm:text-2xl md:text-3xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white">
                  ${b}
                </span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Kutucuğa hangi <span class="text-amber-300 underline decoration-amber-400 font-black">karşılaştırma sembolü</span> gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: true
        };
      } else if (mode < 0.7) {
        // Küçükten büyüğe ya da büyükten küçüğe sıralama
        const sayilar: number[] = [];
        while (sayilar.length < 3) {
          const s = Math.floor(Math.random() * 850) + 100;
          if (!sayilar.includes(s)) sayilar.push(s);
        }

        const isKucuktenBuyuge = Math.random() < 0.5;
        const sirali = [...sayilar].sort((x, y) => isKucuktenBuyuge ? x - y : y - x);
        const sembol = isKucuktenBuyuge ? " < " : " > ";
        const dogru = sirali.join(sembol);

        const y1 = [...sayilar].sort((x, y) => isKucuktenBuyuge ? y - x : x - y).join(sembol);
        const y2 = [sayilar[0], sayilar[2], sayilar[1]].join(sembol);
        const y3 = [sayilar[1], sayilar[0], sayilar[2]].join(sembol);

        const yanlis = [y1, y2, y3].filter(y => y !== dogru).slice(0, 3);
        while (yanlis.length < 3) {
          yanlis.push([sayilar[2], sayilar[1], sayilar[0]].join(sembol));
        }

        return {
          question: `${sayilar.join(', ')} sayılarının ${isKucuktenBuyuge ? 'küçükten büyüğe' : 'büyükten küçüğe'} doğru sıralanışı hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex flex-wrap items-center justify-center gap-2 max-w-md">
                ${sayilar.map(s => `<span class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 border-2 border-amber-400 font-black text-lg sm:text-xl shadow-[0_3px_8px_rgba(0,0,0,0.5)]">${s}</span>`).join('')}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Sayıların <span class="text-amber-300 underline decoration-amber-400 font-black">${isKucuktenBuyuge ? 'KÜÇÜKTEN BÜYÜĞE (<)' : 'BÜYÜKTEN KÜÇÜĞE (>)'}</span> doğru sıralanışı hangisidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: true
        };
      } else {
        // En büyük / En küçük sayıyı bulma
        const isEnBuyuk = Math.random() < 0.5;
        const sayilar: number[] = [];
        while (sayilar.length < 4) {
          const s = Math.floor(Math.random() * 850) + 100;
          if (!sayilar.includes(s)) sayilar.push(s);
        }

        const dogru = isEnBuyuk ? Math.max(...sayilar) : Math.min(...sayilar);
        const yanlis = sayilar.filter(s => s !== dogru);

        return {
          question: `Verilen sayılardan en ${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'} olanı hangisidir? [${sayilar.join(', ')}]`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex flex-wrap items-center justify-center gap-2 max-w-md">
                ${sayilar.map(s => `<span class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 border-2 border-amber-400/80 font-black text-base sm:text-lg shadow-[0_3px_8px_rgba(0,0,0,0.5)]">${s}</span>`).join('')}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan en <span class="text-amber-300 underline decoration-amber-400 font-black uppercase">${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'}</span> olanı bulunuz:
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 1.4 En Yakın Onluğa Yuvarlama (100'e Kadar)
  g3_en_yakin_onluga_yuvarlama_100: {
    title: "En Yakın Onluğa Yuvarlama (100'e Kadar)",
    desc: "100'e kadar olan 2 basamaklı sayıları en yakın onluğa yuvarlama alıştırması",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        // Doğrudan 2 basamaklı sayıyı yuvarlama (Birler basamağı ASLA 0 olamaz)
        const onlar = Math.floor(Math.random() * 9) + 1; // 1..9
        const birler = Math.floor(Math.random() * 9) + 1; // 1..9 (0 hariç)
        const sayi = onlar * 10 + birler; // 11..99 (sonu 0 olamaz)
        const dogru = birler >= 5 ? (onlar + 1) * 10 : onlar * 10;
        const adaylar = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].filter(o => o !== dogru);
        const yanlis = adaylar.sort(() => 0.5 - Math.random()).slice(0, 3);

        return {
          question: `${sayi} sayısının en yakın onluğa yuvarlanmış hali kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                <span class="text-white">${sayi}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${sayi}</span> sayısını <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın onluğa</span> yuvarladığımızda hangi sayı olur?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // Hangi sayı bu onluğa yuvarlanır? (<100)
        const hedefOnluk = (Math.floor(Math.random() * 8) + 2) * 10; // 20..90
        const fark = (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? 1 : -1);
        const dogru = hedefOnluk + fark;

        const yanlis1 = hedefOnluk + 5 + Math.floor(Math.random() * 4);
        const yanlis2 = hedefOnluk - 5 - Math.floor(Math.random() * 4);
        const yanlis3 = hedefOnluk + 12;

        const yanlis = [yanlis1, yanlis2, yanlis3].filter(y => y !== dogru && y > 0 && y < 100);
        while (yanlis.length < 3) {
          yanlis.push(dogru + 15);
        }

        return {
          question: `Aşağıdaki sayılardan hangisi en yakın onluğa yuvarlandığında ${hedefOnluk} olur?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2 rounded-2xl bg-teal-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Hedef Onluk: ${hedefOnluk}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan hangisi en yakın onluğa yuvarlandığında <span class="text-amber-300 underline decoration-amber-400 font-black">${hedefOnluk}</span> olur?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis.slice(0, 3),
          isLong: false
        };
      }
    }
  },

  // 1.4 En Yakın Onluğa Yuvarlama (1000'e Kadar)
  g3_en_yakin_onluga_yuvarlama: {
    title: "En Yakın Onluğa Yuvarlama (1000'e Kadar)",
    desc: "1000'e kadar olan 3 basamaklı ve 2 basamaklı sayıları en yakın onluğa yuvarlama",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.45) {
        // Doğrudan Sayıyı Yuvarlama (3 basamaklı, birler basamağı ASLA 0 olamaz)
        const yuzlerOnlar = Math.floor(Math.random() * 88) + 11; // 11..98
        const birler = Math.floor(Math.random() * 9) + 1; // 1..9 (0 hariç)
        const sayi = yuzlerOnlar * 10 + birler; // 111..989 (asla sonu 0 olamaz)
        let yuvarlanmis: number;
        if (birler < 5) {
          yuvarlanmis = sayi - birler;
        } else {
          yuvarlanmis = sayi + (10 - birler);
        }

        const altOnluk = sayi - birler;
        const ustOnluk = sayi + (10 - birler);
        const yuzluk = Math.round(sayi / 100) * 100;

        const adaylar = [
          yuvarlanmis === altOnluk ? ustOnluk : altOnluk,
          yuzluk,
          yuvarlanmis + 10,
          yuvarlanmis - 10,
          sayi
        ];
        const dogru = yuvarlanmis;
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${sayi} sayısının en yakın onluğa yuvarlanmış hali kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                <span class="text-white">${sayi}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${sayi}</span> sayısını <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın onluğa</span> yuvarladığımızda hangi sayıyı elde ederiz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else if (mode < 0.75) {
        // Hangi sayı bu onluğa yuvarlanır? (4 Şıklı)
        const hedefOnluk = (Math.floor(Math.random() * 80) + 12) * 10; // 120..910
        const fark = (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? 1 : -1);
        const dogruSayi = hedefOnluk + fark;

        const yanlis1 = hedefOnluk + 5 + Math.floor(Math.random() * 4);
        const yanlis2 = hedefOnluk - 5 - Math.floor(Math.random() * 4);
        const yanlis3 = hedefOnluk + 12 + Math.floor(Math.random() * 4);

        const dogru = dogruSayi;
        const yanlis = [yanlis1, yanlis2, yanlis3];

        return {
          question: `Aşağıdaki sayılardan hangisi en yakın onluğa yuvarlandığında ${hedefOnluk} olur?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2 rounded-2xl bg-teal-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Hedef Onluk: ${hedefOnluk}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan hangisi en yakın onluğa yuvarlandığında <span class="text-amber-300 underline decoration-amber-400 font-black">${hedefOnluk}</span> olur?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // En Büyük veya En Küçük Sayı Sorusu
        const isEnBuyuk = Math.random() < 0.5;
        const onluk = (Math.floor(Math.random() * 75) + 15) * 10; // 150..890
        const dogru = isEnBuyuk ? onluk + 4 : onluk - 5;

        const adaylar = [
          isEnBuyuk ? onluk + 5 : onluk - 6,
          isEnBuyuk ? onluk + 9 : onluk - 1,
          isEnBuyuk ? onluk - 1 : onluk + 1,
          onluk
        ];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `En yakın onluğa yuvarlandığında ${onluk} olan en ${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'} doğal sayı kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2 rounded-2xl bg-rose-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Onluk: ${onluk}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                En yakın onluğa yuvarlandığında <span class="text-amber-300 font-black">${onluk}</span> olan en <span class="text-cyan-300 underline decoration-cyan-400 font-black uppercase">${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'}</span> sayı kaçtır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.5 En Yakın Yüzlüğe Yuvarlama (1000'e kadar)
  g3_en_yakin_yuzluge_yuvarlama: {
    title: "En Yakın Yüzlüğe Yuvarlama (1000'e Kadar)",
    desc: "1000'e kadar olan 3 basamaklı sayıları onlar basamağına bakarak en yakın yüzlüğe yuvarlama",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.45) {
        // Doğrudan Sayıyı Yüzlüğe Yuvarlama
        const yuzler = Math.floor(Math.random() * 8) + 1; // 1..8
        const sonIki = Math.floor(Math.random() * 90) + 5; // 5..94
        const sayi = yuzler * 100 + sonIki;

        let yuvarlanmis: number;
        if (sonIki < 50) {
          yuvarlanmis = yuzler * 100;
        } else {
          yuvarlanmis = (yuzler + 1) * 100;
        }

        const digerYuzluk = yuvarlanmis === yuzler * 100 ? (yuzler + 1) * 100 : yuzler * 100;
        const onlugaYuvarlanmis = Math.round(sayi / 10) * 10;
        const adaylar = [digerYuzluk, onlugaYuvarlanmis, yuvarlanmis + 100, yuvarlanmis - 100];
        const dogru = yuvarlanmis;
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${sayi} sayısının en yakın yüzlüğe yuvarlanmış hali kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-emerald-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                <span class="text-white">${sayi}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${sayi}</span> sayısını <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın yüzlüğe</span> yuvarladığımızda hangi sayıyı elde ederiz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else if (mode < 0.75) {
        // Hangi sayı bu yüzlüğe yuvarlanır?
        const hedefYuzluk = (Math.floor(Math.random() * 7) + 2) * 100; // 200..800
        const fark = (Math.floor(Math.random() * 45) + 2) * (Math.random() < 0.5 ? 1 : -1);
        const dogruSayi = hedefYuzluk + fark;

        const yanlis1 = hedefYuzluk + 52 + Math.floor(Math.random() * 30);
        const yanlis2 = hedefYuzluk - 52 - Math.floor(Math.random() * 30);
        const yanlis3 = hedefYuzluk + 110 + Math.floor(Math.random() * 20);

        const dogru = dogruSayi;
        const yanlis = [yanlis1, yanlis2, yanlis3];

        return {
          question: `Aşağıdaki sayılardan hangisi en yakın yüzlüğe yuvarlandığında ${hedefYuzluk} olur?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2 rounded-2xl bg-amber-600 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Hedef Yüzlük: ${hedefYuzluk}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan hangisi en yakın yüzlüğe yuvarlandığında <span class="text-amber-300 underline decoration-amber-400 font-black">${hedefYuzluk}</span> olur?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // En Büyük veya En Küçük Sayı Sorusu
        const isEnBuyuk = Math.random() < 0.5;
        const yuzluk = (Math.floor(Math.random() * 6) + 2) * 100; // 200..700
        const dogru = isEnBuyuk ? yuzluk + 49 : yuzluk - 50;

        const adaylar = [
          isEnBuyuk ? yuzluk + 50 : yuzluk - 51,
          isEnBuyuk ? yuzluk + 99 : yuzluk - 1,
          isEnBuyuk ? yuzluk + 40 : yuzluk - 40,
          yuzluk
        ];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `En yakın yüzlüğe yuvarlandığında ${yuzluk} olan en ${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'} doğal sayı kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2 rounded-2xl bg-rose-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Yüzlük: ${yuzluk}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                En yakın yüzlüğe yuvarlandığında <span class="text-amber-300 font-black">${yuzluk}</span> olan en <span class="text-cyan-300 underline decoration-cyan-400 font-black uppercase">${isEnBuyuk ? 'BÜYÜK' : 'KÜÇÜK'}</span> sayı kaçtır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.6 6'şar Ritmik Sayma (60 İçinde)
  g3_ritmik_6: {
    title: "6'şar Ritmik Sayma (60 İçinde)",
    desc: "60 içinde altışar ileriye ve geriye doğru ritmik sayma",
    generate: () => {
      const step = 6;
      const maxLimit = 60;
      const isGeri = Math.random() < 0.35;
      const mode = Math.random();

      if (mode < 0.65) {
        const startIndex = isGeri 
          ? Math.floor(Math.random() * 5) + 5 // 5..9
          : Math.floor(Math.random() * 5) + 1; // 1..5

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const idx = isGeri ? startIndex - i : startIndex + i;
          if (idx >= 1 && idx <= 10) {
            fullArray.push(idx * step);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -step : step));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + step, dogru - step, dogru + 2 * step, dogru - 2 * step, dogru + 1, dogru - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `6'şar ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${maxLimit} içinde <span class="text-amber-300 font-black">6'şar ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        const adimNo = Math.floor(Math.random() * 6) + 3; // 3..8
        const dogru = adimNo * step;
        const adaylar = [(adimNo + 1) * step, (adimNo - 1) * step, (adimNo + 2) * step, (adimNo - 2) * step];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `6'dan başlayıp 6'şar ileriye doğru sayarken ${adimNo}. sırada hangi sayıyı söyleriz?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-indigo-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🔢 6'şar Ritmik Sayma
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">6</span>'dan başlayıp ileriye doğru 6'şar sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">${adimNo}. sırada</span> hangi sayıyı söyleriz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.7 7'şer Ritmik Sayma (70 İçinde)
  g3_ritmik_7: {
    title: "7'şer Ritmik Sayma (70 İçinde)",
    desc: "70 içinde yedişer ileriye ve geriye doğru ritmik sayma",
    generate: () => {
      const step = 7;
      const maxLimit = 70;
      const isGeri = Math.random() < 0.35;
      const mode = Math.random();

      if (mode < 0.65) {
        const startIndex = isGeri 
          ? Math.floor(Math.random() * 5) + 5 // 5..9
          : Math.floor(Math.random() * 5) + 1; // 1..5

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const idx = isGeri ? startIndex - i : startIndex + i;
          if (idx >= 1 && idx <= 10) {
            fullArray.push(idx * step);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -step : step));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + step, dogru - step, dogru + 2 * step, dogru - 2 * step, dogru + 1, dogru - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `7'şer ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${maxLimit} içinde <span class="text-amber-300 font-black">7'şer ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        const adimNo = Math.floor(Math.random() * 6) + 3; // 3..8
        const dogru = adimNo * step;
        const adaylar = [(adimNo + 1) * step, (adimNo - 1) * step, (adimNo + 2) * step, (adimNo - 2) * step];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `7'den başlayıp 7'şer ileriye doğru sayarken ${adimNo}. sırada hangi sayıyı söyleriz?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-purple-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🔢 7'şer Ritmik Sayma
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">7</span>'den başlayıp ileriye doğru 7'şer sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">${adimNo}. sırada</span> hangi sayıyı söyleriz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.8 8'er Ritmik Sayma (80 İçinde)
  g3_ritmik_8: {
    title: "8'er Ritmik Sayma (80 İçinde)",
    desc: "80 içinde sekizer ileriye ve geriye doğru ritmik sayma",
    generate: () => {
      const step = 8;
      const maxLimit = 80;
      const isGeri = Math.random() < 0.35;
      const mode = Math.random();

      if (mode < 0.65) {
        const startIndex = isGeri 
          ? Math.floor(Math.random() * 5) + 5 // 5..9
          : Math.floor(Math.random() * 5) + 1; // 1..5

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const idx = isGeri ? startIndex - i : startIndex + i;
          if (idx >= 1 && idx <= 10) {
            fullArray.push(idx * step);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -step : step));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + step, dogru - step, dogru + 2 * step, dogru - 2 * step, dogru + 1, dogru - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `8'er ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${maxLimit} içinde <span class="text-amber-300 font-black">8'er ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        const adimNo = Math.floor(Math.random() * 6) + 3; // 3..8
        const dogru = adimNo * step;
        const adaylar = [(adimNo + 1) * step, (adimNo - 1) * step, (adimNo + 2) * step, (adimNo - 2) * step];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `8'den başlayıp 8'er ileriye doğru sayarken ${adimNo}. sırada hangi sayıyı söyleriz?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-teal-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🔢 8'er Ritmik Sayma
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">8</span>'den başlayıp ileriye doğru 8'er sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">${adimNo}. sırada</span> hangi sayıyı söyleriz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.9 9'ar Ritmik Sayma (90 İçinde)
  g3_ritmik_9: {
    title: "9'ar Ritmik Sayma (90 İçinde)",
    desc: "90 içinde dokuzar ileriye ve geriye doğru ritmik sayma",
    generate: () => {
      const step = 9;
      const maxLimit = 90;
      const isGeri = Math.random() < 0.35;
      const mode = Math.random();

      if (mode < 0.65) {
        const startIndex = isGeri 
          ? Math.floor(Math.random() * 5) + 5 // 5..9
          : Math.floor(Math.random() * 5) + 1; // 1..5

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const idx = isGeri ? startIndex - i : startIndex + i;
          if (idx >= 1 && idx <= 10) {
            fullArray.push(idx * step);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -step : step));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + step, dogru - step, dogru + 2 * step, dogru - 2 * step, dogru + 1, dogru - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `9'ar ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${maxLimit} içinde <span class="text-amber-300 font-black">9'ar ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        const adimNo = Math.floor(Math.random() * 6) + 3; // 3..8
        const dogru = adimNo * step;
        const adaylar = [(adimNo + 1) * step, (adimNo - 1) * step, (adimNo + 2) * step, (adimNo - 2) * step];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `9'dan başlayıp 9'ar ileriye doğru sayarken ${adimNo}. sırada hangi sayıyı söyleriz?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-rose-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🔢 9'ar Ritmik Sayma
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">9</span>'dan başlayıp ileriye doğru 9'ar sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">${adimNo}. sırada</span> hangi sayıyı söyleriz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.10 10'ar Ritmik Sayma (1000 İçinde)
  g3_ritmik_10: {
    title: "10'ar Ritmik Sayma (1000 İçinde)",
    desc: "1000 içinde 3 basamaklı sayılardan başlayarak ileriye ve geriye 10'ar ritmik sayma",
    generate: () => {
      const isGeri = Math.random() < 0.4;
      const mode = Math.random();

      if (mode < 0.65) {
        // 3 Basamaklı Sayılarda 10'ar Dizi (❓ Eksik Sayı)
        const base = Math.floor(Math.random() * 80) + 12; // 12..91 -> 120..910
        const birler = Math.random() < 0.3 ? (Math.floor(Math.random() * 9) + 1) : 0; // %70 tam onluk, %30 rastgele birler basamağı (örn: 345, 355, 365)
        const startVal = base * 10 + birler;

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const val = isGeri ? startVal - i * 10 : startVal + i * 10;
          if (val >= 10 && val <= 1000) {
            fullArray.push(val);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -10 : 10));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + 10, dogru - 10, dogru + 100, dogru - 100, dogru + 20, dogru - 20];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `10'ar ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                1000 içinde <span class="text-amber-300 font-black">10'ar ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // İlerideki Adımı Bulma
        const start = (Math.floor(Math.random() * 60) + 20) * 10; // 200..790
        const stepCount = Math.floor(Math.random() * 5) + 3; // 3..7
        const dogru = isGeri ? start - stepCount * 10 : start + stepCount * 10;
        const adaylar = [
          dogru + 10,
          dogru - 10,
          isGeri ? start - (stepCount - 1) * 10 : start + (stepCount - 1) * 10,
          dogru + 100
        ];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${start} sayısından başlayarak 10'ar ${isGeri ? 'geriye' : 'ileriye'} doğru ${stepCount} adım saydığımızda hangi sayıya ulaşırız?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-amber-600 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🎯 Başlangıç: ${start}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${start}</span> sayısından başlayıp 10'ar <span class="text-cyan-300 font-black">${isGeri ? 'geriye' : 'ileriye'} doğru ${stepCount} adım</span> saydığımızda hangi sayıya ulaşırız?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.11 100'er Ritmik Sayma (1000 İçinde)
  g3_ritmik_100: {
    title: "100'er Ritmik Sayma (1000 İçinde)",
    desc: "1000 içinde 100'er ileriye ve geriye doğru ritmik sayma",
    generate: () => {
      const isGeri = Math.random() < 0.4;
      const mode = Math.random();

      if (mode < 0.65) {
        // Yüzer Dizi Tamamlama (❓ Eksik Sayı)
        const startYuzluk = isGeri 
          ? Math.floor(Math.random() * 4) + 6 // 6..9 (örn: 900, 800...)
          : Math.floor(Math.random() * 4) + 1; // 1..4 (örn: 100, 200...)
        
        const sonIki = Math.random() < 0.3 ? (Math.floor(Math.random() * 9) + 1) * 10 : 0; // %70 tam 100'lük (300, 400..), %30 (340, 440..)
        const startVal = startYuzluk * 100 + sonIki;

        const fullArray: number[] = [];
        for (let i = 0; i < 5; i++) {
          const val = isGeri ? startVal - i * 100 : startVal + i * 100;
          if (val >= 100 && val <= 1000) {
            fullArray.push(val);
          }
        }

        while (fullArray.length < 4) {
          fullArray.push(fullArray[fullArray.length - 1] + (isGeri ? -100 : 100));
        }

        const missingIdx = Math.floor(Math.random() * (fullArray.length - 2)) + 1;
        const dogru = fullArray[missingIdx];
        const gorunum = fullArray.map((val, i) => (i === missingIdx ? '❓' : String(val)));

        const adaylar = [dogru + 100, dogru - 100, dogru + 10, dogru - 10, dogru + 200, dogru - 200];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `100'er ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada [${gorunum.join(' - ')}] soru işareti yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
              <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
                ${gorunum.map(item => `
                  <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                    ${item}
                  </span>
                `).join('')}
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                1000 içinde <span class="text-amber-300 font-black">100'er ${isGeri ? 'geriye' : 'ileriye'}</span> ritmik sayarken <span class="text-cyan-300 underline decoration-cyan-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // n. Adım / Sayma Sorusu
        const adimNo = Math.floor(Math.random() * 5) + 3; // 3..7
        const start = isGeri ? 1000 : 100;
        const dogru = isGeri ? 1000 - (adimNo - 1) * 100 : adimNo * 100;
        const adaylar = [dogru + 100, dogru - 100, dogru + 10, dogru - 10];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${start}'den başlayıp 100'er ${isGeri ? 'geriye' : 'ileriye'} doğru sayarken ${adimNo}. sırada hangi sayıyı söyleriz?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-emerald-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide">
                🔢 100'er Ritmik Sayma
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${start}</span>'den başlayıp 100'er <span class="text-cyan-300 underline decoration-cyan-400 font-black">${isGeri ? 'geriye' : 'ileriye'}</span> doğru sayarken <span class="text-amber-300 font-black">${adimNo}. sırada</span> hangi sayıyı söyleriz?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.12 Genel Ritmik Saymalar (Geriye dönük uyumluluk)
  g3_ritmik_saymalar: {
    title: "Genel Ritmik Saymalar",
    desc: "6'şar, 7'şer, 8'er, 9'ar, 10'ar ve 100'er ritmik saymada eksik sayıyı bulma",
    generate: () => {
      const adimlar = [6, 7, 8, 9, 10, 100];
      const adim = adimlar[Math.floor(Math.random() * adimlar.length)];
      const isGeri = Math.random() < 0.3;
      const baslangic = adim === 100 
        ? Math.floor(Math.random() * 4 + 1) * 100 
        : Math.floor(Math.random() * 5 + 1) * adim;

      const dizi: number[] = [];
      for (let i = 0; i < 5; i++) {
        dizi.push(isGeri ? baslangic + (4 - i) * adim : baslangic + i * adim);
      }

      const eksikIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
      const dogru = dizi[eksikIndex];
      const gorunum = dizi.map((val, idx) => idx === eksikIndex ? '❓' : String(val));

      const adaylar = [dogru + adim, dogru - adim, dogru + 2 * adim, dogru - 2 * adim, dogru + 1, dogru - 1];
      const yanlis = benzersizYanlislar(dogru, adaylar, 0);

      return {
        question: `Ritmik saymada soru işareti yerine hangi sayı gelmelidir? [${gorunum.join(' - ')}]`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
            <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
              ${gorunum.map(item => `
                <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 rounded-lg ${item === '❓' ? 'bg-amber-400 text-slate-950 font-black scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white' : 'bg-slate-900/90 text-white font-black border border-slate-600 shadow-md'} text-[11px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0">
                  ${item}
                </span>
              `).join('')}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              ${adim}'şar ${isGeri ? 'geriye' : 'ileriye'} ritmik saymada <span class="text-amber-300 underline decoration-amber-400 font-black">soru işareti (❓)</span> yerine ne gelmelidir?
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 1.13 İşlemlerde Tek ve Çift Sayılar (Toplam <= 20, Eksilen <= 20) - 2 ŞIKLI
  g3_tek_cift_20ye_kadar_islemler: {
    title: "İşlemlerde Tek & Çift (<20)",
    desc: "Toplamları 20'yi geçmeyen ve eksileni 20'den büyük olmayan işlemlerde sonucun tek mi çift mi olduğunu bulma",
    generate: () => {
      const isToplama = Math.random() < 0.55;

      if (isToplama) {
        // Toplamları 20'yi geçmeyen iki sayı (Toplam <= 20)
        const s1 = Math.floor(Math.random() * 10) + 1; // 1..10
        const s2 = Math.floor(Math.random() * (20 - s1)) + 1; // 1..(20-s1)
        const toplam = s1 + s2;
        const sonucTekMi = toplam % 2 !== 0;

        const dogru = sonucTekMi ? "TEK SAYI" : "ÇİFT SAYI";
        const yanlis = [sonucTekMi ? "ÇİFT SAYI" : "TEK SAYI"];

        return {
          question: `${s1} + ${s2} işleminin sonucu TEK sayı mıdır yoksa ÇİFT sayı mıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl sm:rounded-3xl bg-indigo-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
                ${s1} + ${s2} = ?
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu toplama işleminin sonucu <span class="text-amber-300 underline decoration-amber-400 font-black">TEK sayı</span> mıdır yoksa <span class="text-cyan-300 underline decoration-cyan-400 font-black">ÇİFT sayı</span> mıdır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // Eksileni 20'den büyük olmayan çıkarma (Eksilen <= 20, Eksilen > Çıkan)
        const eksilen = Math.floor(Math.random() * 15) + 6; // 6..20
        const cikan = Math.floor(Math.random() * (eksilen - 2)) + 1; // 1..(eksilen-2)
        const fark = eksilen - cikan;
        const sonucTekMi = fark % 2 !== 0;

        const dogru = sonucTekMi ? "TEK SAYI" : "ÇİFT SAYI";
        const yanlis = [sonucTekMi ? "ÇİFT SAYI" : "TEK SAYI"];

        return {
          question: `${eksilen} - ${cikan} işleminin sonucu TEK sayı mıdır yoksa ÇİFT sayı mıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl sm:rounded-3xl bg-rose-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
                ${eksilen} - ${cikan} = ?
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu çıkarma işleminin sonucu <span class="text-amber-300 underline decoration-amber-400 font-black">TEK sayı</span> mıdır yoksa <span class="text-cyan-300 underline decoration-cyan-400 font-black">ÇİFT sayı</span> mıdır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.14 Tek ve Çift Sayıları Belirleme (4 ŞIKLI)
  g3_tek_cift_sayilar: {
    title: "Tek ve Çift Sayıları Bulma",
    desc: "Verilen sayılar arasından tek veya çift olan sayıyı belirleme",
    generate: () => {
      const isTekSorusu = Math.random() < 0.5;

      const uretSayi = (tekOlsun: boolean) => {
        const yuzler = Math.floor(Math.random() * 9) + 1;
        const onlar = Math.floor(Math.random() * 10);
        const tekRakamlar = [1, 3, 5, 7, 9];
        const ciftRakamlar = [0, 2, 4, 6, 8];
        const birler = tekOlsun 
          ? tekRakamlar[Math.floor(Math.random() * tekRakamlar.length)]
          : ciftRakamlar[Math.floor(Math.random() * ciftRakamlar.length)];
        return yuzler * 100 + onlar * 10 + birler;
      };

      if (isTekSorusu) {
        // Doğru tek, yanlışlar çift (4 ŞIKLI)
        const dogru = uretSayi(true);
        const yanlisSet = new Set<number>();
        while (yanlisSet.size < 3) {
          const s = uretSayi(false);
          if (s !== dogru) yanlisSet.add(s);
        }
        const yanlis = Array.from(yanlisSet);

        return {
          question: `Aşağıdaki sayılardan hangisi bir TEK sayıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                🔢 TEK SAYIYI BULALIM
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan hangisi bir <span class="text-amber-300 underline decoration-amber-400 font-black uppercase">TEK</span> sayıdır?
              </div>
              <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                (Birler basamağında 1, 3, 5, 7 veya 9 olan sayılar TEK sayıdır)
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        // Doğru çift, yanlışlar tek (4 ŞIKLI)
        const dogru = uretSayi(false);
        const yanlisSet = new Set<number>();
        while (yanlisSet.size < 3) {
          const s = uretSayi(true);
          if (s !== dogru) yanlisSet.add(s);
        }
        const yanlis = Array.from(yanlisSet);

        return {
          question: `Aşağıdaki sayılardan hangisi bir ÇİFT sayıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                🔢 ÇİFT SAYIYI BULALIM
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Aşağıdaki sayılardan hangisi bir <span class="text-amber-300 underline decoration-amber-400 font-black uppercase">ÇİFT</span> sayıdır?
              </div>
              <div class="text-xs sm:text-sm font-bold text-cyan-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                (Birler basamağında 0, 2, 4, 6 veya 8 olan sayılar ÇİFT sayıdır)
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      }
    }
  },

  // 1.6 Sayı ve Şekil Örüntüleri
  g3_sayi_sekil_oruntuleri: {
    title: "Sayı ve Şekil Örüntüleri",
    desc: "Belli bir kurala göre artan/azalan örüntülerde kuralı ve sıradaki adımı bulma",
    generate: () => {
      const artis = Math.floor(Math.random() * 6) + 3; // 3-8
      const baslangic = Math.floor(Math.random() * 40) + 10;
      const dizi = [baslangic, baslangic + artis, baslangic + 2 * artis, baslangic + 3 * artis];
      const dogru = baslangic + 4 * artis;

      const adaylar = [dogru + artis, dogru - 1, dogru + 2, dogru - artis];
      const yanlis = benzersizYanlislar(dogru, adaylar, 0);

      return {
        question: `Örüntüde sıradaki sayı kaçtır? [${dizi.join(', ')}, ?]`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2 py-0.5 text-center">
            <div class="flex items-center gap-1 xs:gap-1.5 flex-nowrap justify-center max-w-full my-0.5">
              ${dizi.map(n => `<span class="px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-lg bg-blue-900 text-white font-black text-[11px] xs:text-xs sm:text-sm border border-blue-400 shadow-md shrink-0">${n}</span>`).join('')}
              <span class="px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] xs:text-xs sm:text-sm border-2 border-white shadow-md animate-pulse shrink-0">?</span>
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Kuralı keşfederek <span class="text-amber-300 underline decoration-amber-400 font-black">soru işareti (?)</span> yerine gelecek sayıyı bulunuz:
            </div>
            <div class="text-[10px] xs:text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              (Kural: Her adımda +${artis} artmaktadır)
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 1.7 Nesne Sayısını Tahmin Etme ve Karşılaştırma
  g3_nesne_tahmin_karsilastirma: {
    title: "Nesne Sayısını Tahmin Etme",
    desc: "Grup halindeki nesneleri tahmin etme ve gerçek sayıyla farkını hesaplama",
    generate: () => {
      const ogrenci = getRastgeleOgrenci();
      const gercekSayi = Math.floor(Math.random() * 40) + 30; // 30-70
      const tahminFarki = (Math.floor(Math.random() * 5) + 2) * (Math.random() < 0.5 ? 1 : -1);
      const tahmin = Math.max(10, gercekSayi + tahminFarki);
      const fark = Math.abs(tahmin - gercekSayi);

      const dogru = fark;
      const adaylar = [fark + 1, Math.max(1, fark - 1), fark + 5, fark + 2];
      const yanlis = benzersizYanlislar(dogru, adaylar, 0);

      return {
        question: `${ogrenci} kutudaki bilye sayısını ${tahmin} olarak tahmin etti. Kutuda gerçekte ${gercekSayi} bilye olduğuna göre tahmin ile gerçek sayı arasındaki fark kaçtır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
            <div class="flex items-center justify-center gap-3">
              <span class="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-black text-sm sm:text-base rounded-xl border border-white shadow-md">
                Tahmin: ${tahmin}
              </span>
              <span class="px-3.5 py-1.5 bg-emerald-600 text-white font-black text-sm sm:text-base rounded-xl border border-white shadow-md">
                Gerçek Sayı: ${gercekSayi}
              </span>
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              ${getIsimTamlayan(ogrenci)} tahmini ile gerçek bilye sayısı arasındaki <span class="text-amber-300 underline decoration-amber-400 font-black">fark kaçtır?</span>
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // =========================================================================
  // TEMA 2: SAYILAR VE NİCELİKLER (2)
  // =========================================================================

  // 2.1 Bütün, Yarım, Çeyrek ve Birim Kesirler
  g3_birim_kesirler: {
    title: "Birim Kesirler (Bütün, Yarım, Çeyrek)",
    desc: "Payı 1 olan birim kesirler (1/2, 1/3, 1/4, 1/6, 1/8) ve model gösterimleri",
    generate: () => {
      const paydalar = [2, 3, 4, 5, 6, 8];
      const payda = paydalar[Math.floor(Math.random() * paydalar.length)];
      const svg = Math.random() < 0.5 ? generatePieFractionSVG(1, payda) : generateBarFractionSVG(1, payda);

      const dogru = `1/${payda}`;
      const adaylar = [`1/${payda + 1}`, `1/${Math.max(2, payda - 1)}`, `${payda}/1`, `2/${payda}`];
      const yanlis = adaylar.filter(a => a !== dogru).slice(0, 3);

      return {
        question: `Modele göre boyalı kısım hangi birim kesri ifade eder?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
            ${svg}
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Modeldeki boyalı parça hangi <span class="text-amber-300 underline decoration-amber-400 font-black">birim kesri</span> gösterir?
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 2.2 Kesirlerde Pay ve Payda İlişkisi
  g3_pay_payda_modelleme: {
    title: "Pay ve Payda İlişkisi & Modeller",
    desc: "Bir bütünün eş parçalarından istenen kadarını boyama ve kesir olarak okuma",
    generate: () => {
      const paydalar = [4, 5, 6, 8];
      const payda = paydalar[Math.floor(Math.random() * paydalar.length)];
      const pay = Math.floor(Math.random() * (payda - 1)) + 1;

      const svg = Math.random() < 0.5 ? generatePieFractionSVG(pay, payda) : generateBarFractionSVG(pay, payda);
      const dogru = `${pay}/${payda}`;

      const adaylar = [
        `${payda}/${pay}`,
        `${Math.min(payda, pay + 1)}/${payda}`,
        `${Math.max(1, pay - 1)}/${payda}`,
        `1/${payda}`,
        `${pay}/${payda + 1}`,
        `${pay}/${Math.max(2, payda - 1)}`,
        `${Math.min(payda, pay + 2)}/${payda}`
      ];
      const yanlis: string[] = [];
      for (const a of adaylar) {
        if (a !== dogru && !yanlis.includes(a)) {
          yanlis.push(a);
          if (yanlis.length === 3) break;
        }
      }

      return {
        question: `Modelde boyalı olarak gösterilen kesir hangisidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
            ${svg}
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Modeldeki boyalı parçaları ifade eden <span class="text-amber-300 underline decoration-amber-400 font-black">kesir hangisidir?</span>
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 2.3 Paydası 10 ve 100 Olan Kesir Temsilleri
  g3_payda_10_100_kesir: {
    title: "Paydası 10 ve 100 Olan Kesirler",
    desc: "1/10, 1/100 ve ondalık temelli birim kesirlerin modelleri ve okunuşları",
    generate: () => {
      const isYuz = Math.random() < 0.5;
      const payda = isYuz ? 100 : 10;
      const pay = isYuz ? (Math.floor(Math.random() * 5) + 1) * 10 : Math.floor(Math.random() * 8) + 1;

      const dogru = `${pay}/${payda}`;
      const yanlis = [
        `${payda}/${pay}`,
        `${pay}/${isYuz ? 10 : 100}`,
        `${pay + 2}/${payda}`
      ].filter(y => y !== dogru).slice(0, 3);

      return {
        question: `${payda} eş parçaya bölünmüş bir bütünün ${pay} parçası boyandığında kesir nasıl yazılır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
            <div class="px-5 py-2 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-cyan-200 font-black text-sm sm:text-lg md:text-xl shadow-[0_4px_12px_rgba(0,0,0,0.5)] max-w-md">
              Bir bütün <span class="text-amber-300 font-black">${payda}</span> eş parçaya bölünüp <span class="text-emerald-300 font-black">${pay}</span> parçası boyanmıştır.
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Bu modelin gösterdiği <span class="text-amber-300 underline decoration-amber-400 font-black">kesir hangisidir?</span>
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 2.4 Zaman Ölçüleri (Saat Okuma & Dönüşümler)
  g3_zaman_olcme: {
    title: "Zaman Ölçüleri (Saat, Dakika, Gün)",
    desc: "Analog-dijital saat okumaları, öğleden önce/sonra ve zaman birimi dönüşümleri",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        const saat = Math.floor(Math.random() * 12) + 1;
        const dakikalar = [0, 15, 30, 45, 10, 20, 40, 50];
        const dakika = dakikalar[Math.floor(Math.random() * dakikalar.length)];

        const svg = generateClockSVG(saat, dakika);
        const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const dogru = `${pad2(saat)}.${pad2(dakika)}`;

        const nextSaat = saat === 12 ? 1 : saat + 1;
        const prevSaat = saat === 1 ? 12 : saat - 1;
        const digerDakika = (dakika + 30) % 60;
        const digerDakika2 = (dakika + 15) % 60;

        const adaylar = [
          `${pad2(nextSaat)}.${pad2(dakika)}`,
          `${pad2(prevSaat)}.${pad2(dakika)}`,
          `${pad2(saat)}.${pad2(digerDakika)}`,
          `${pad2(saat)}.${pad2(digerDakika2)}`,
          `${pad2(nextSaat)}.${pad2(digerDakika)}`
        ];
        const yanlis = adaylar.filter(y => y !== dogru).slice(0, 3);

        return {
          question: `Saat kaçı göstermektedir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              ${svg}
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Görseldeki saatin <span class="text-amber-300 underline decoration-amber-400 font-black">dijital gösterimi</span> hangisidir?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis,
          isLong: false
        };
      } else {
        const tur = Math.random();
        if (tur < 0.33) {
          const saat = Math.floor(Math.random() * 3) + 2;
          const dogru = saat * 60;
          const adaylar = [dogru + 20, dogru - 30, saat * 100, dogru + 60];
          const yanlis = benzersizYanlislar(dogru, adaylar, 0);

          return {
            question: `${saat} saat kaç dakikadır?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
                <div class="px-5 py-2 rounded-2xl bg-sky-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  ${saat} SAAT = ? DAKİKA
                </div>
                <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                  ${saat} saat toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç dakikadır?</span>
                </div>
                <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 saat = 60 dakikadır)</div>
              </div>
            `,
            correct: `${dogru} dk`,
            wrong: yanlis.map(y => `${y} dk`),
            isLong: false
          };
        } else if (tur < 0.66) {
          const gun = Math.floor(Math.random() * 3) + 2;
          const dogru = gun * 24;
          const adaylar = [dogru + 12, dogru - 10, gun * 20, dogru + 24];
          const yanlis = benzersizYanlislar(dogru, adaylar, 0);

          return {
            question: `${gun} gün kaç saattir?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
                <div class="px-5 py-2 rounded-2xl bg-indigo-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  ${gun} GÜN = ? SAAT
                </div>
                <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                  ${gun} gün toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç saattir?</span>
                </div>
                <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 gün = 24 saattir)</div>
              </div>
            `,
            correct: `${dogru} saat`,
            wrong: yanlis.map(y => `${y} saat`),
            isLong: false
          };
        } else {
          const hafta = Math.floor(Math.random() * 4) + 2;
          const dogru = hafta * 7;
          const adaylar = [dogru + 3, dogru - 2, hafta * 10, dogru + 7];
          const yanlis = benzersizYanlislar(dogru, adaylar, 0);

          return {
            question: `${hafta} hafta kaç gündür?`,
            questionHTML: `
              <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
                <div class="px-5 py-2 rounded-2xl bg-emerald-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  ${hafta} HAFTA = ? GÜN
                </div>
                <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                  ${hafta} hafta toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç gündür?</span>
                </div>
                <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 hafta = 7 gündür)</div>
              </div>
            `,
            correct: `${dogru} gün`,
            wrong: yanlis.map(y => `${y} gün`),
            isLong: false
          };
        }
      }
    }
  },

  // 2.5 Uzunluk, Kütle ve Sıvı Ölçü Birimleri (m-cm, kg-g, L-yarım L)
  g3_uzunluk_kutle_sivi: {
    title: "Uzunluk, Kütle ve Sıvı Ölçüleri",
    desc: "1 m = 100 cm, 1 kg = 1000 g, 1 L = 2 yarım litre ilişkileri ve problemleri",
    generate: () => {
      const type = Math.random();

      if (type < 0.35) {
        const metre = Math.floor(Math.random() * 5) + 1;
        const cm = Math.floor(Math.random() * 8 + 1) * 10;
        const toplamCm = metre * 100 + cm;

        const dogru = toplamCm;
        const adaylar = [metre * 10 + cm, toplamCm + 20, toplamCm - 50, metre * 1000 + cm];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${metre} metre ${cm} santimetre toplam kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-amber-600 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                📏 ${metre} m ${cm} cm = ? cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Verilen uzunluk toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç santimetredir?</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 metre = 100 santimetredir)</div>
            </div>
          `,
          correct: `${dogru} cm`,
          wrong: yanlis.map(y => `${y} cm`)
        };
      } else if (type < 0.7) {
        const litre = Math.floor(Math.random() * 6) + 2;
        const dogru = litre * 2;
        const adaylar = [litre + 2, litre * 4, dogru + 2, dogru - 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 1);

        return {
          question: `${litre} litre sütün içinde kaç yarım litre süt vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-cyan-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                🥛 ${litre} Litre = ? Yarım Litre
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${litre} litrenin içinde toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç yarım litre vardır?</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 Litre = 2 Yarım Litredir)</div>
            </div>
          `,
          correct: `${dogru} yarım litre`,
          wrong: yanlis.map(y => `${y} yarım litre`)
        };
      } else {
        const kg = Math.floor(Math.random() * 4) + 1;
        const dogru = kg * 1000;
        const adaylar = [kg * 100, dogru + 500, dogru - 500, kg * 10];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${kg} kilogram kaç gramdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2 rounded-2xl bg-teal-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ⚖️ ${kg} kg = ? gram
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${kg} kilogram toplam <span class="text-amber-300 underline decoration-amber-400 font-black">kaç gramdır?</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(1 kilogram = 1000 gramdır)</div>
            </div>
          `,
          correct: `${dogru} g`,
          wrong: yanlis.map(y => `${y} g`)
        };
      }
    }
  },

  // 2.6 Para Birimlerimiz (Lira ve Kuruş İlişkisi: 1 TL = 100 Kr)
  g3_paralarimiz_lira_kurus: {
    title: "Paralarımız (Lira & Kuruş İlişkisi)",
    desc: "100 Kuruş = 1 TL dönüşümleri, para üstü ve market alışveriş hesaplamaları",
    generate: () => {
      const mode = Math.floor(Math.random() * 3);

      if (mode === 0) {
        // Lira & Kuruş Dönüşümü
        const tl = Math.floor(Math.random() * 8) + 1;
        const kr = Math.floor(Math.random() * 9 + 1) * 10;
        const toplamKurus = tl * 100 + kr;

        const dogru = `${tl} TL ${kr} Kr`;
        const yanlis = [
          `${tl + 1} TL ${kr} Kr`,
          `${tl} TL ${kr === 50 ? 25 : 50} Kr`,
          `${kr} TL ${tl} Kr`
        ];

        return {
          question: `${toplamKurus} kuruş kaç TL ve kaç kuruş eder?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center gap-2 flex-nowrap max-w-full overflow-hidden">
                <img src="/paralar/1_tl_madeni_para.png" class="h-8 sm:h-12 w-8 sm:w-12 object-contain drop-shadow-md shrink-0" />
                <div class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-500 text-slate-950 font-black text-base sm:text-xl md:text-2xl border-2 border-white shadow-md shrink-0 whitespace-nowrap">
                  🪙 ${toplamKurus} Kuruş
                </div>
                <img src="/paralar/50_kurus_madeni_para.png" class="h-7 sm:h-10 w-7 sm:w-10 object-contain drop-shadow-md shrink-0" />
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu miktar kaç TL ve kaç kuruşa <span class="text-amber-300 underline decoration-amber-400 font-black">eşittir?</span>
              </div>
              <div class="text-[11px] xs:text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">(100 Kuruş = 1 TL)</div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else if (mode === 1) {
        // Alışveriş & Para Üstü Hesabı Görsel Banknotlu
        const ogrenci = getRastgeleOgrenci();
        const verilenSecenekler = [
          { val: 50, img: '/paralar/50_tl_kagit_para.png' },
          { val: 100, img: '/paralar/100_tl_kagit_para.png' },
          { val: 200, img: '/paralar/200_tl_kagit_para.png' },
        ];
        const secilenVerilen = verilenSecenekler[Math.floor(Math.random() * verilenSecenekler.length)];
        const verilen = secilenVerilen.val;
        const fiyat = Math.floor(Math.random() * (verilen - 15)) + 10;
        const paraUstu = verilen - fiyat;

        const dogru = paraUstu;
        const adaylar = [paraUstu + 5, paraUstu - 5, paraUstu + 10, paraUstu + 2];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${ogrenci} ${fiyat} TL tutan kitabı almak için satıcıya ${verilen} TL verdi. Kaç TL para üstü alır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1 sm:gap-2 py-0.5 text-center">
              <div class="para-container flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap max-w-full my-0.5">
                <span class="px-2 py-0.5 bg-rose-600 text-white font-black text-[10px] xs:text-xs sm:text-sm rounded-lg border border-white shadow-md shrink-0 whitespace-nowrap">Ürün: ${fiyat} TL</span>
                <img src="${secilenVerilen.img}" alt="Para" class="para-kagit object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" />
              </div>
              <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-1">
                ${ogrenci} satıcıya görseldeki <span class="text-amber-300 font-black">${verilen} TL</span>'yi verirse kaç TL <span class="text-emerald-300 underline font-black">para üstü</span> alır?
              </div>
            </div>
          `,
          correct: `${dogru} TL`,
          wrong: yanlis.map(y => `${y} TL`)
        };
      } else {
        // Görseldeki Lira ve Kuruşları Toplama
        const kombinasyonlar = [
          {
            images: ['/paralar/20_tl_kagit_para.png', '/paralar/5_tl_kagit_para.png', '/paralar/1_tl_madeni_para.png', '/paralar/50_kurus_madeni_para.png'],
            dogru: "26 TL 50 Kr",
            yanlis: ["25 TL 50 Kr", "27 TL", "26 TL"],
            text: "Görseldeki paraların toplam değeri nedir?"
          },
          {
            images: ['/paralar/50_tl_kagit_para.png', '/paralar/10_tl_kagit_para.png', '/paralar/1_tl_madeni_para.png', '/paralar/1_tl_madeni_para.png'],
            dogru: "62 TL",
            yanlis: ["61 TL", "60 TL", "72 TL"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?"
          },
          {
            images: ['/paralar/100_tl_kagit_para.png', '/paralar/20_tl_kagit_para.png', '/paralar/5_tl_kagit_para.png'],
            dogru: "125 TL",
            yanlis: ["120 TL", "130 TL", "115 TL"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?"
          },
          {
            images: ['/paralar/50_kurus_madeni_para.png', '/paralar/50_kurus_madeni_para.png', '/paralar/25_kurus_madeni_para.png', '/paralar/25_kurus_madeni_para.png'],
            dogru: "1 TL 50 Kr",
            yanlis: ["1 TL", "2 TL", "1 TL 25 Kr"],
            text: "Görseldeki madeni paraların toplam değeri nedir?"
          }
        ];
        const k = kombinasyonlar[Math.floor(Math.random() * kombinasyonlar.length)];
        return {
          question: k.text,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1 sm:gap-2 py-0.5 text-center">
              <div class="para-container flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap max-w-full my-0.5">
                ${k.images.map(img => `
                  <img src="${img}" alt="Para" class="${img.includes('madeni') ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" />
                `).join('')}
              </div>
              <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-1">
                ${k.text}
              </div>
            </div>
          `,
          correct: k.dogru,
          wrong: k.yanlis
        };
      }
    }
  },

  // =========================================================================
  // TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE
  // =========================================================================

  // 3.1 Zihinden Toplama-Çıkarma ve Tahmin
  g3_zihinden_toplama_cikarma_tahmin: {
    title: "Zihinden İşlem ve Sonucu Tahmin Etme",
    desc: "Üç basamaklı sayıları en yakın onluğa yuvarlayarak toplama ve çıkarma tahminleri",
    generate: () => {
      const s1 = Math.floor(Math.random() * 400) + 100;
      const s2 = Math.floor(Math.random() * 400) + 100;

      const y1 = Math.round(s1 / 10) * 10;
      const y2 = Math.round(s2 / 10) * 10;
      const tahminTop = y1 + y2;

      const dogru = tahminTop;
      const adaylar = [tahminTop + 10, tahminTop - 10, tahminTop + 100, tahminTop - 100];
      const yanlis = benzersizYanlislar(dogru, adaylar, 0);

      return {
        question: `${s1} + ${s2} işleminin sonucunu sayıları en yakın onluğa yuvarlayarak tahmin ediniz.`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl sm:rounded-3xl bg-indigo-800 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
              ${s1} + ${s2} ≈ ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Sayıları <span class="text-amber-300 underline decoration-amber-400 font-black">en yakın onluğa</span> yuvarlayarak tahmini sonucu bulunuz.
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlis
      };
    }
  },

  // 3.2 Doğal Sayılarla Toplama ve Çıkarma Problemleri
  g3_toplama_cikarma_problemleri: {
    title: "Toplama ve Çıkarma Problemleri",
    desc: "Üç basamaklı sayılarla günlük yaşam 1 ve 2 adımlı matematik problemleri",
    generate: () => {
      const ogrenci1 = getRastgeleOgrenci();
      const ogrenci2 = getRastgeleOgrenci();
      const mode = Math.random();

      if (mode < 0.5) {
        const sayfa1 = Math.floor(Math.random() * 150) + 120;
        const sayfa2 = Math.floor(Math.random() * 120) + 100;
        const toplamKitap = sayfa1 + sayfa2 + Math.floor(Math.random() * 80 + 40);
        const kalan = toplamKitap - (sayfa1 + sayfa2);

        const dogru = kalan;
        const adaylar = [kalan + 10, kalan - 10, kalan + 20, kalan + 5];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${toplamKitap} sayfalık kitabın 1. gün ${sayfa1}, 2. gün ${sayfa2} sayfasını okuyan ${getIsimTamlayan(ogrenci1)} okuması gereken kaç sayfası kalmıştır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-4 py-2 bg-slate-900/90 rounded-2xl border border-amber-400 text-amber-200 font-bold text-xs sm:text-sm md:text-base max-w-md shadow-md">
                📖 Toplam: ${toplamKitap} sayfa | 1. Gün: ${sayfa1} | 2. Gün: ${sayfa2}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                ${getIsimTamlayan(ogrenci1)} geriye okuması gereken <span class="text-amber-300 underline decoration-amber-400 font-black">kaç sayfası kalmıştır?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const s1 = Math.floor(Math.random() * 200) + 150;
        const fazlalik = Math.floor(Math.random() * 60) + 30;
        const s2 = s1 + fazlalik;
        const toplam = s1 + s2;

        const dogru = toplam;
        const adaylar = [s2, toplam + 10, toplam - 20, toplam + 100];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${getIsimTamlayan(ogrenci1)} ${s1} bilyesi vardır. ${getIsimTamlayan(ogrenci2)} bilyeleri ${getIsimAyrilma(ogrenci1)} ${fazlalik} fazladır. İkisinin toplam kaç bilyesi vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-4 py-2 bg-slate-900 rounded-2xl border border-blue-400 text-blue-200 font-bold text-xs sm:text-sm md:text-base max-w-md shadow-md">
                ${ogrenci1}: ${s1} bilye | ${ogrenci2}: ${getIsimAyrilma(ogrenci1)} ${fazlalik} fazla
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                İki arkadaşın <span class="text-amber-300 underline decoration-amber-400 font-black">toplam</span> kaç bilyesi vardır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 3.3 Çarpma ve Bölme İşlemleri
  g3_carpma_bolme_pratik: {
    title: "Çarpma ve Bölme İşlemleri",
    desc: "Çarpım tablosu (6, 7, 8, 9 katları), iki basamaklı çarpma ve eşit paylaştırma",
    generate: () => {
      const isCarpma = Math.random() < 0.5;

      if (isCarpma) {
        const a = Math.floor(Math.random() * 6) + 4;
        const b = Math.floor(Math.random() * 8) + 3;
        const dogru = a * b;
        const adaylar = [dogru + a, dogru - a, dogru + b, dogru + 4, dogru - 4];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `${a} x ${b} çarpma işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${a} ✖ ${b} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Çarpma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const bolen = Math.floor(Math.random() * 6) + 3;
        const bolum = Math.floor(Math.random() * 7) + 3;
        const bolunen = bolen * bolum;

        const dogru = bolum;
        const adaylar = [bolum + 1, bolum - 1, bolum + 2, bolen];
        const yanlis = benzersizYanlislar(dogru, adaylar, 1);

        return {
          question: `${bolunen} ÷ ${bolen} bölme işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${bolunen} ➗ ${bolen} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bölme işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 3.4 Dört İşlemde Verilmeyen Ögeleri Bulma
  g3_verilmeyen_ogeyi_bulma: {
    title: "Verilmeyen Ögeyi Bulma",
    desc: "Toplama, çıkarma, çarpma ve bölmede verilmeyen kutucuklu terimi hesaplama",
    generate: () => {
      const islemTuru = Math.random();

      if (islemTuru < 0.35) {
        const toplanan1 = Math.floor(Math.random() * 300) + 120;
        const toplam = toplanan1 + Math.floor(Math.random() * 300) + 100;
        const verilmeyen = toplam - toplanan1;

        const dogru = verilmeyen;
        const adaylar = [verilmeyen + 10, verilmeyen - 10, verilmeyen + 100, toplam + toplanan1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `▲ + ${toplanan1} = ${toplam} işleminde ▲ yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl md:text-3xl text-white">
                <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-white shadow-md">▲</span>
                <span>+</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-500 shadow-md">${toplanan1}</span>
                <span>=</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-blue-600 border border-white shadow-md">${toplam}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Verilmeyen toplanan <span class="text-amber-300 underline decoration-amber-400 font-black">(▲) yerine hangi sayı gelmelidir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else if (islemTuru < 0.7) {
        const cikan = Math.floor(Math.random() * 200) + 100;
        const fark = Math.floor(Math.random() * 250) + 100;
        const eksilen = cikan + fark;

        const dogru = eksilen;
        const adaylar = [eksilen + 10, eksilen - 10, fark - cikan, eksilen + 100];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `■ - ${cikan} = ${fark} işleminde ■ yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl md:text-3xl text-white">
                <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center border-2 border-white shadow-md">■</span>
                <span>-</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-500 shadow-md">${cikan}</span>
                <span>=</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-emerald-600 border border-white shadow-md">${fark}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Verilmeyen eksilen <span class="text-amber-300 underline decoration-amber-400 font-black">(■) yerine hangi sayı gelmelidir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const carpan1 = Math.floor(Math.random() * 6) + 4;
        const carpan2 = Math.floor(Math.random() * 7) + 3;
        const carpim = carpan1 * carpan2;

        const dogru = carpan1;
        const adaylar = [carpan1 + 1, carpan1 - 1, carpan1 + 2, carpan2 + 1];
        const yanlis = benzersizYanlislar(dogru, adaylar, 1);

        return {
          question: `● x ${carpan2} = ${carpim} işleminde ● yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl md:text-3xl text-white">
                <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center border-2 border-white shadow-md">●</span>
                <span>✖</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-500 shadow-md">${carpan2}</span>
                <span>=</span>
                <span class="px-3.5 py-1.5 rounded-2xl bg-amber-500 text-slate-950 border border-white shadow-md">${carpim}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Verilmeyen çarpan <span class="text-amber-300 underline decoration-amber-400 font-black">(●) yerine hangi sayı gelmelidir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // =========================================================================
  // TEMA 4: NESNELERİN GEOMETRİSİ VE ÖLÇME
  // =========================================================================

  // 4.1 Geometrik Şekiller ve Cisimlerin Temel Özellikleri (Yüz, Köşe, Ayrıt)
  g3_geometrik_cisimler_ozellikleri: {
    title: "Geometrik Cisimlerin Özellikleri",
    desc: "Küp, kare prizma, dikdörtgenler prizması, silindir, koni ve kürenin yüz/köşe/ayrıt sayıları",
    generate: () => {
      const cisimler = [
        { ad: "Küp", yuz: 6, ayrit: 12, kose: 8, img: "/geos/kups.png" },
        { ad: "Kare Prizma", yuz: 6, ayrit: 12, kose: 8, img: "/geos/kareprz.png" },
        { ad: "Dikdörtgenler Prizması", yuz: 6, ayrit: 12, kose: 8, img: "/geos/dikdprz.png" },
        { ad: "Üçgen Prizma", yuz: 5, ayrit: 9, kose: 6, img: "/geos/ucgenprz.png" },
        { ad: "Silindir", yuz: 3, ayrit: 0, kose: 0, img: "/geos/slndrs.png" },
        { ad: "Küre", yuz: 1, ayrit: 0, kose: 0, img: "/geos/kures.png" }
      ];

      const secilen = cisimler[Math.floor(Math.random() * cisimler.length)];
      const soruTuru = Math.random();

      if (soruTuru < 0.35) {
        const dogru = secilen.kose;
        const adaylar = [secilen.yuz, secilen.ayrit, dogru + 2, Math.max(0, dogru - 2)];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `Bu geometrik cismin kaç tane KÖŞESİ vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center justify-center">
                <img src="${secilen.img}" alt="" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu geometrik cismin kaç tane <span class="text-amber-300 underline decoration-amber-400 font-black">KÖŞESİ</span> vardır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else if (soruTuru < 0.7) {
        const dogru = secilen.ayrit;
        const adaylar = [secilen.kose, secilen.yuz, dogru + 2, Math.max(0, dogru - 3)];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `Bu geometrik cismin kaç tane AYRITI vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center justify-center">
                <img src="${secilen.img}" alt="" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu geometrik cismin kaç tane <span class="text-amber-300 underline decoration-amber-400 font-black">AYRITI (Kenarı)</span> vardır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const dogru = secilen.yuz;
        const adaylar = [secilen.kose, secilen.ayrit, dogru + 1, Math.max(1, dogru - 1)];
        const yanlis = benzersizYanlislar(dogru, adaylar, 1);

        return {
          question: `Bu geometrik cismin kaç tane YÜZÜ vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center justify-center">
                <img src="${secilen.img}" alt="" class="geo-cisim-img max-h-24 sm:max-h-28 md:max-h-32 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu geometrik cismin kaç tane <span class="text-amber-300 underline decoration-amber-400 font-black">YÜZÜ</span> vardır?
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 4.2 Temel Geometrik Kavramlar (Nokta, Doğru, Işın, Doğru Parçası, Açılar)
  g3_temel_geometri_kavramlari: {
    title: "Temel Geometri Kavramları & Açılar",
    desc: "Nokta, doğru, ışın, doğru parçası ve dar açı, dik açı (90°), geniş açı kavramları",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        const acilar = [
          { deg: 90, tur: "DİK AÇI", svg: generateAngleSVG(90, "90°") },
          { deg: 45, tur: "DAR AÇI", svg: generateAngleSVG(45, "< 90°") },
          { deg: 125, tur: "GENİŞ AÇI", svg: generateAngleSVG(125, "> 90°") }
        ];
        const secilen = acilar[Math.floor(Math.random() * acilar.length)];

        const dogru = secilen.tur;
        const yanlis = ["DİK AÇI", "DAR AÇI", "GENİŞ AÇI", "DOĞRU AÇI"].filter(a => a !== dogru).slice(0, 3);

        return {
          question: `Görselde verilen açı çeşidi hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              ${secilen.svg}
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Görseldeki açı <span class="text-amber-300 underline decoration-amber-400 font-black">hangi açı çeşididir?</span>
              </div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      } else {
        const kavramlar = [
          {
            ad: "IŞIN",
            ipucu: "Bir ucu sınırlı, diğer ucu sonsuza uzar (Örn: El feneri ışığı)",
            svg: `<svg viewBox="0 0 120 30" class="w-36 h-9 sm:w-44 sm:h-10 bg-white/95 rounded-xl p-1 border-2 border-slate-700 filter drop-shadow-md"><circle cx="15" cy="15" r="4" fill="#ef4444" /><line x1="15" y1="15" x2="105" y2="15" stroke="#1e293b" stroke-width="4" /><polygon points="105,10 115,15 105,20" fill="#1e293b" /></svg>`
          },
          {
            ad: "DOĞRU PARÇASI",
            ipucu: "İki ucu da sınırlı olan çizgi modeli (Örn: Cetvel, kurşun kalem)",
            svg: `<svg viewBox="0 0 120 30" class="w-36 h-9 sm:w-44 sm:h-10 bg-white/95 rounded-xl p-1 border-2 border-slate-700 filter drop-shadow-md"><circle cx="15" cy="15" r="4" fill="#ef4444" /><line x1="15" y1="15" x2="105" y2="15" stroke="#1e293b" stroke-width="4" /><circle cx="105" cy="15" r="4" fill="#ef4444" /></svg>`
          },
          {
            ad: "DOĞRU",
            ipucu: "İki ucundan da sonsuza uzayan çizgi modeli",
            svg: `<svg viewBox="0 0 120 30" class="w-36 h-9 sm:w-44 sm:h-10 bg-white/95 rounded-xl p-1 border-2 border-slate-700 filter drop-shadow-md"><polygon points="15,10 5,15 15,20" fill="#1e293b" /><line x1="10" y1="15" x2="110" y2="15" stroke="#1e293b" stroke-width="4" /><polygon points="105,10 115,15 105,20" fill="#1e293b" /></svg>`
          }
        ];
        const secilen = kavramlar[Math.floor(Math.random() * kavramlar.length)];

        const dogru = secilen.ad;
        const yanlis = ["IŞIN", "DOĞRU PARÇASI", "DOĞRU", "NOKTA"].filter(k => k !== dogru).slice(0, 3);

        return {
          question: `Görseldeki geometrik kavram hangisidir? (${secilen.ipucu})`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              ${secilen.svg}
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Görseldeki geometrik model <span class="text-amber-300 underline decoration-amber-400 font-black">hangisidir?</span>
              </div>
              <div class="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">${secilen.ipucu}</div>
            </div>
          `,
          correct: dogru,
          wrong: yanlis
        };
      }
    }
  },

  // 4.3 Nesnelerin Ölçülebilir Nitelikleri (Çevre Hesaplama & Günlük Yaşam)
  g3_cevre_ve_olculebilir_nitelikler: {
    title: "Çevre Hesaplama & Ölçülebilir Nitelikler",
    desc: "Kare, dikdörtgen ve üçgenin çevre uzunluğu hesaplamaları ve kenar toplamları",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        const kenar = Math.floor(Math.random() * 15) + 5;
        const dogru = kenar * 4;
        const adaylar = [kenar * 2, kenar + 4, dogru + 4, dogru - 4];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `Bir kenar uzunluğu ${kenar} cm olan karenin çevre uzunluğu kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 border-2 border-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center font-black text-slate-950 text-base sm:text-lg">
                ${kenar} cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bir kenarı <span class="text-amber-300 font-black">${kenar} cm</span> olan karenin <span class="text-amber-300 underline decoration-amber-400 font-black">çevresi</span> kaç cm'dir?
              </div>
            </div>
          `,
          correct: `${dogru} cm`,
          wrong: yanlis.map(y => `${y} cm`)
        };
      } else {
        const kisaKenar = Math.floor(Math.random() * 8) + 4;
        const uzunKenar = kisaKenar + Math.floor(Math.random() * 10) + 4;
        const dogru = (kisaKenar + uzunKenar) * 2;
        const adaylar = [kisaKenar + uzunKenar, dogru + 4, dogru - 4, kisaKenar * uzunKenar];
        const yanlis = benzersizYanlislar(dogru, adaylar, 0);

        return {
          question: `Kısa kenarı ${kisaKenar} cm, uzun kenarı ${uzunKenar} cm olan dikdörtgenin çevresi kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="w-28 h-14 sm:w-36 sm:h-18 bg-blue-600 border-2 border-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center font-black text-white text-xs sm:text-sm">
                <span>Uzun: ${uzunKenar} cm</span>
                <span class="text-amber-200">Kısa: ${kisaKenar} cm</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Dikdörtgenin <span class="text-amber-300 underline decoration-amber-400 font-black">çevre uzunluğu</span> kaç cm'dir?
              </div>
            </div>
          `,
          correct: `${dogru} cm`,
          wrong: yanlis.map(y => `${y} cm`)
        };
      }
    }
  }

};

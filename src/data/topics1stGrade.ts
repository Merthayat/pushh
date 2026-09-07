import { QuestionData } from '../types';

// Öğrenci İsimleri
const OGRENCILER = [
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
  const raw = OGRENCILER[Math.floor(Math.random() * OGRENCILER.length)];
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

function getNesneIyelik(nesne: string): string {
  const n = nesne.trim().toLowerCase();
  if (n === 'kalem') return 'kalemi';
  if (n === 'balon') return 'balonu';
  if (n === 'bilye') return 'bilyesi';
  if (n === 'çıkartma') return 'çıkartması';
  if (n === 'elma') return 'elması';
  if (n === 'ceviz') return 'cevizi';
  if (n === 'fındık') return 'fındığı';
  if (n === 'çilek') return 'çileği';
  if (n === 'muz') return 'muzu';
  if (n === 'portakal') return 'portakalı';
  if (n === 'şeftali') return 'şeftalisi';
  return `${nesne}si`;
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
    const aday = Math.max(safeMin, correct) + ek;
    if (!gorulen.has(aday) && aday >= safeMin) {
      gorulen.add(aday);
      sonuc.push(aday);
    }
    ek++;
  }
  return sonuc;
}

function rastgeleSec<T>(dizi: T[], adet: number): T[] {
  const kopya = [...dizi];
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
  }
  return kopya.slice(0, adet);
}

// Saat SVG Oluşturucu (Tam ve Yarım Saatler)
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

  return `
    <svg viewBox="0 0 100 100" class="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)] mx-auto">
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#2563EB" stroke-width="3" />
      <circle cx="50" cy="50" r="44" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      ${numbersHTML}
      <line x1="50" y1="50" x2="${hX.toFixed(1)}" y2="${hY.toFixed(1)}" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round" />
      <line x1="50" y1="50" x2="${mX.toFixed(1)}" y2="${mY.toFixed(1)}" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="50" cy="50" r="3" fill="#1E293B" stroke="#FFFFFF" stroke-width="1" />
      <circle cx="50" cy="50" r="1.2" fill="#F59E0B" />
    </svg>
  `;
}

// Sequence Cards HTML Oluşturucu (Ritmik Saymalar İçin)
function renderSequenceCardsHTML(dizi: (number | string)[], boslukIndex: number, instruction: string) {
  const boxGradients = [
    'from-sky-500 via-blue-600 to-indigo-700 border-sky-300',
    'from-emerald-500 via-teal-600 to-emerald-700 border-emerald-300',
    'from-amber-400 via-orange-500 to-amber-600 border-amber-200',
    'from-purple-500 via-violet-600 to-purple-700 border-purple-300',
    'from-rose-500 via-pink-600 to-rose-700 border-rose-300',
  ];

  const cardsHTML = dizi.map((val, idx) => {
    if (idx === boslukIndex) {
      return `
        <div class="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-amber-400 border-2 border-yellow-200 shadow-[0_0_12px_rgba(236,72,153,0.8)] flex items-center justify-center transform scale-105 animate-pulse shrink-0">
          <span class="text-white font-black text-xs xs:text-sm sm:text-base md:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] inline-flex items-center justify-center leading-none">?</span>
        </div>
      `;
    } else {
      const grad = boxGradients[idx % boxGradients.length];
      return `
        <div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-md sm:rounded-lg bg-gradient-to-b ${grad} border border-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center shrink-0">
          <span class="text-white font-black text-[11px] xs:text-xs sm:text-sm md:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] inline-flex items-center justify-center leading-none">${val}</span>
        </div>
      `;
    }
  }).join('');

  return `
    <div class="w-full flex flex-col items-center justify-center gap-1 sm:gap-2 my-auto px-0.5 max-w-full text-center">
      <div class="flex items-center justify-center flex-nowrap gap-1 xs:gap-1.5 sm:gap-2 my-0.5 w-full max-w-full overflow-hidden py-0.5">
        ${cardsHTML}
      </div>
      <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] px-1">
        ${instruction}
      </div>
    </div>
  `;
}

function ritmikIleri1Uret(): QuestionData {
  const baslangic = Math.floor(Math.random() * 46) + 1; // 1..46 (en fazla 50)
  const dizi = [baslangic, baslangic + 1, baslangic + 2, baslangic + 3, baslangic + 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const questionHTML = renderSequenceCardsHTML(
    dizi,
    boslukIndex,
    `Örüntüde <span class="text-yellow-300 font-black">?</span> yerine hangi sayı gelmelidir?`
  );

  return {
    question: `İleri birer ritmik saymada ? yerine hangi sayı gelmelidir?`,
    questionHTML,
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

  const questionHTML = renderSequenceCardsHTML(
    dizi,
    boslukIndex,
    `Geriye birer saymada <span class="text-yellow-300 font-black">?</span> yerine hangi sayı gelmelidir?`
  );

  return {
    question: `20'den geriye birer saymada ? yerine hangi sayı gelmelidir?`,
    questionHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + 1, dogruCevap - 1, dogruCevap + 2, dogruCevap - 2], 0),
    isLong: true
  };
}

function ritmikIleriUret1st(adim: number, ustSinir: number): QuestionData {
  const maxBaslangicKati = Math.max(Math.floor((ustSinir - adim * 4) / adim), 1);
  const kat = Math.floor(Math.random() * maxBaslangicKati) + 1;
  const baslangic = kat * adim;
  const dizi = [baslangic, baslangic + adim, baslangic + adim * 2, baslangic + adim * 3, baslangic + adim * 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const questionHTML = renderSequenceCardsHTML(
    dizi,
    boslukIndex,
    `Ritmik saymada <span class="text-yellow-300 font-black">?</span> yerine hangi sayı gelmelidir?`
  );

  return {
    question: `Ritmik saymada ? yerine hangi sayı gelmelidir?`,
    questionHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + adim, dogruCevap - adim, dogruCevap + 1, dogruCevap - 1, dogruCevap + adim * 2], 1),
    isLong: true
  };
}

function ritmikGeriUret1st(adim: number, maxUstSinir = 100): QuestionData {
  const minBaslangic = adim * 4 + adim;
  const baslangicKati = Math.floor(Math.random() * Math.floor((maxUstSinir - minBaslangic) / adim + 1)) + Math.ceil(minBaslangic / adim);
  const baslangic = Math.min(baslangicKati * adim, maxUstSinir);
  const dizi = [baslangic, baslangic - adim, baslangic - adim * 2, baslangic - adim * 3, baslangic - adim * 4];
  const boslukIndex = Math.floor(Math.random() * 3) + 1;
  const dogruCevap = dizi[boslukIndex];

  const questionHTML = renderSequenceCardsHTML(
    dizi,
    boslukIndex,
    `Geriye ritmik saymada <span class="text-yellow-300 font-black">?</span> yerine hangi sayı gelmelidir?`
  );

  return {
    question: `Geriye ritmik saymada ? yerine hangi sayı gelmelidir?`,
    questionHTML,
    correct: dogruCevap,
    wrong: benzersizYanlislar(dogruCevap, [dogruCevap + adim, dogruCevap - adim, dogruCevap - 1, dogruCevap + 1, dogruCevap - adim * 2], 0),
    isLong: true
  };
}

export const topics1stGrade: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
  // 1. NESNELERİN GEOMETRİSİ
  uzamsal_iliskiler: {
    title: "Uzamsal İlişkiler (Konum)",
    desc: "Görsellere göre altında, üstünde, içinde, dışında, önünde, arkasında, sağında, solunda kavramları.",
    generate: () => {
      // public/gorselsoru/ klasöründeki g1.jpeg - g9.jpeg görsellerine özel hazırlanmış uzamsal ilişki soruları
      interface UzamsalSoruTanimi {
        img: string;
        soru: string;
        dogru: string;
        yanlis: string[];
      }

      const tumSorular: UzamsalSoruTanimi[] = [
        // --- GÖRSEL 1: Taş ev, çatıda kedi, kapı önünde sarı çizmeler, sağda bank, solda çiçek bahçesi ---
        {
          img: "/gorselsoru/g1.jpeg",
          soru: `Evin çatısının <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ÜSTÜNDE</span> hangi hayvan durmaktadır?`,
          dogru: "🐱 Kedi",
          yanlis: ["🐶 Köpek", "🐦 Kuş", "🐰 Tavşan"]
        },
        {
          img: "/gorselsoru/g1.jpeg",
          soru: `Mavi kapının hemen <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ÖNÜNDE</span> ne durmaktadır?`,
          dogru: "🥾 Sarı çizmeler",
          yanlis: ["🪵 Ahşap bank", "🪴 Çiçek saksısı", "🚲 Yeşil bisiklet"]
        },
        {
          img: "/gorselsoru/g1.jpeg",
          soru: `Ahşap bank, evin hangi tarafında yer almaktadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Üstünde", "İçinde"]
        },
        {
          img: "/gorselsoru/g1.jpeg",
          soru: `Çitlerle çevrili çiçek bahçesi, evin neresindedir?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Arkasında", "Üstünde"]
        },

        // --- GÖRSEL 2: Taş ev, kapı önünde köpek, solda yeşil bisiklet, sağda odun yığını, baca üstünde horoz rüzgar gülü ---
        {
          img: "/gorselsoru/g2.jpeg",
          soru: `Köpek, evin kapısının neresinde uyumaktadır?`,
          dogru: "Önünde",
          yanlis: ["Arkasında", "Üstünde", "İçinde"]
        },
        {
          img: "/gorselsoru/g2.jpeg",
          soru: `Yeşil bisiklet, evin hangi tarafında durmaktadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Arkasında", "Üstünde"]
        },
        {
          img: "/gorselsoru/g2.jpeg",
          soru: `Odun yığını, evin neresinde durmaktadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Üstünde", "İçinde"]
        },
        {
          img: "/gorselsoru/g2.jpeg",
          soru: `Horoz figürlü rüzgar gülü, bacanın neresindedir?`,
          dogru: "Üstünde",
          yanlis: ["Altında", "İçinde", "Solunda"]
        },

        // --- GÖRSEL 3: Minyatür ev, baca üstünde kuş, kapı önünde turuncu kedi, solda posta kutusu, sağda saksılı çiçek ---
        {
          img: "/gorselsoru/g3.jpeg",
          soru: `Bacanın <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ÜSTÜNDE</span> hangi hayvan durmaktadır?`,
          dogru: "🐦 Kuş",
          yanlis: ["🐱 Kedi", "🐶 Köpek", "🦋 Kelebek"]
        },
        {
          img: "/gorselsoru/g3.jpeg",
          soru: `Turuncu kedi, evin neresinde uyumaktadır?`,
          dogru: "Kapının önünde",
          yanlis: ["Çatının üstünde", "Evin arkasında", "Evin içinde"]
        },
        {
          img: "/gorselsoru/g3.jpeg",
          soru: `Kırmızı posta kutusu, evin hangi tarafındadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Arkasında", "Üstünde"]
        },
        {
          img: "/gorselsoru/g3.jpeg",
          soru: `Çiçek saksısı, evin neresinde durmaktadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "İçinde", "Altında"]
        },

        // --- GÖRSEL 4: Ağaç, dalda mavi kelebek, altta kaplumbağa, solda sulama kabı, sağda renkli plaj topu ---
        {
          img: "/gorselsoru/g4.jpeg",
          soru: `Ağacın dalında, <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">YUKARIDA</span> ne durmaktadır?`,
          dogru: "🦋 Mavi kelebek",
          yanlis: ["🐢 Kaplumbağa", "⚽ Plaj topu", "🪣 Sulama kabı"]
        },
        {
          img: "/gorselsoru/g4.jpeg",
          soru: `Ağacın <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ALTINDA</span> çimlerde hangi hayvan yürümektedir?`,
          dogru: "🐢 Kaplumbağa",
          yanlis: ["🦋 Mavi kelebek", "🐱 Kedi", "🐰 Tavşan"]
        },
        {
          img: "/gorselsoru/g4.jpeg",
          soru: `Metal sulama kabı, ağacın hangi tarafındadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Üstünde", "İçinde"]
        },
        {
          img: "/gorselsoru/g4.jpeg",
          soru: `Renkli plaj topu, ağacın neresinde durmaktadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Üstünde", "Altında"]
        },

        // --- GÖRSEL 5: Ağaç, dalda kırmızı kuş, solda tavşan, sağda kırmızı top, solda sarı çiçek ---
        {
          img: "/gorselsoru/g5.jpeg",
          soru: `Kırmızı kuş ağacın neresindedir?`,
          dogru: "Yukarısında (dalında)",
          yanlis: ["Aşağısında (kökünde)", "Topun arkasında", "Saksının içinde"]
        },
        {
          img: "/gorselsoru/g5.jpeg",
          soru: `Kırmızı top, ağacın neresinde durmaktadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Üstünde", "İçinde"]
        },
        {
          img: "/gorselsoru/g5.jpeg",
          soru: `Gri tavşan, ağacın hangi tarafında durmaktadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "En tepesinde", "Arkasında"]
        },
        {
          img: "/gorselsoru/g5.jpeg",
          soru: `Saksıdaki sarı çiçek, tavşanın neresindedir?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Üstünde", "Arkasında"]
        },

        // --- GÖRSEL 6: Balkon/masa, üstte çiçekli vazo, altta kaplumbağa, solda çizmeler, sağda renkli top ---
        {
          img: "/gorselsoru/g6.jpeg",
          soru: `Masanın <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ÜSTÜNDE</span> ne durmaktadır?`,
          dogru: "🏺 Çiçekli vazo",
          yanlis: ["🐢 Kaplumbağa", "⚽ Renkli top", "🥾 Çizmeler"]
        },
        {
          img: "/gorselsoru/g6.jpeg",
          soru: `Masanın <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ALTINDA</span> hangi canlı bulunmaktadır?`,
          dogru: "🐢 Kaplumbağa",
          yanlis: ["🏺 Çiçekli vazo", "⚽ Renkli top", "🐱 Kedi"]
        },
        {
          img: "/gorselsoru/g6.jpeg",
          soru: `Renkli top, masanın neresindedir?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Üstünde", "Altında"]
        },
        {
          img: "/gorselsoru/g6.jpeg",
          soru: `Mavi çizmeler, masanın hangi tarafındadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Üstünde", "İçinde"]
        },

        // --- GÖRSEL 7: Ahşap masa, üstte elma, altta kedi, solda saksı bitkisi, sağda sarı top ---
        {
          img: "/gorselsoru/g7.jpeg",
          soru: `Kedi, masanın neresinde uyumaktadır?`,
          dogru: "Altında",
          yanlis: ["Üstünde", "İçinde", "Arkasında"]
        },
        {
          img: "/gorselsoru/g7.jpeg",
          soru: `Masanın <span class="px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow">ÜSTÜNDE</span> hangi meyve durmaktadır?`,
          dogru: "🍎 Kırmızı elma",
          yanlis: ["🎾 Sarı top", "🪴 Saksı bitkisi", "🐱 Kedi"]
        },
        {
          img: "/gorselsoru/g7.jpeg",
          soru: `Sarı tenis topu, masanın neresindedir?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Altında", "İçinde"]
        },
        {
          img: "/gorselsoru/g7.jpeg",
          soru: `Saksıdaki bitki, masanın hangi tarafında durmaktadır?`,
          dogru: "Solunda",
          yanlis: ["Sağında", "Üstünde", "Altında"]
        },

        // --- GÖRSEL 8: Ahşap oda, masa altında tavşan, üstünde kutu, sağdaki taburede kırmızı kuş ---
        {
          img: "/gorselsoru/g8.jpeg",
          soru: `Gri tavşan, masanın neresindedir?`,
          dogru: "Altında",
          yanlis: ["Üstünde", "İçinde", "Arkasında"]
        },
        {
          img: "/gorselsoru/g8.jpeg",
          soru: `Kırmızı kuş nerede durmaktadır?`,
          dogru: "Taburenin üstünde",
          yanlis: ["Taburenin altında", "Masanın altında", "Kutunun içinde"]
        },
        {
          img: "/gorselsoru/g8.jpeg",
          soru: `Karton kutu, masanın neresindedir?`,
          dogru: "Üstünde",
          yanlis: ["Altında", "Arkasında", "İçinde"]
        },
        {
          img: "/gorselsoru/g8.jpeg",
          soru: `Kuşun durduğu tabure, masanın hangi tarafındadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Altında", "İçinde"]
        },

        // --- GÖRSEL 9: Ahşap oda, sehpa altında kedi, üstünde vazo, sağdaki taburede uğur böceği ---
        {
          img: "/gorselsoru/g9.jpeg",
          soru: `Gri kedi, ahşap sehpanın neresindedir?`,
          dogru: "Altında",
          yanlis: ["Üstünde", "İçinde", "Arkasında"]
        },
        {
          img: "/gorselsoru/g9.jpeg",
          soru: `Çiçek desenli vazo, sehpanın neresindedir?`,
          dogru: "Üstünde",
          yanlis: ["Altında", "İçinde", "Aşağısında"]
        },
        {
          img: "/gorselsoru/g9.jpeg",
          soru: `Sağ taraftaki taburenin üstünde hangi canlı durmaktadır?`,
          dogru: "🐞 Uğur böceği",
          yanlis: ["🐱 Gri kedi", "🐦 Kuş", "🦋 Kelebek"]
        },
        {
          img: "/gorselsoru/g9.jpeg",
          soru: `Uğur böceğinin durduğu tabure, sehpanın hangi tarafındadır?`,
          dogru: "Sağında",
          yanlis: ["Solunda", "Altında", "İçinde"]
        }
      ];

      const secilenSoru = tumSorular[Math.floor(Math.random() * tumSorular.length)];

      const questionHTML = `
        <div data-full-width="true" class="uzamsal-soru-container flex flex-col items-center justify-between w-full h-full max-w-full overflow-hidden min-h-0">
          <div class="uzamsal-soru-frame relative flex items-center justify-center w-full flex-1 min-h-0">
            <img 
              src="${secilenSoru.img}" 
              alt="Uzamsal İlişki Görseli" 
              class="uzamsal-soru-img block" 
              referrerpolicy="no-referrer"
            />
          </div>
          <div class="uzamsal-soru-text w-full text-center font-black text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shrink-0 z-10">
            ${secilenSoru.soru}
          </div>
        </div>
      `;

      return {
        question: secilenSoru.soru.replace(/<[^>]*>/g, ''),
        questionHTML,
        correct: secilenSoru.dogru,
        wrong: secilenSoru.yanlis,
        signature: `${secilenSoru.img}-${secilenSoru.dogru}-${secilenSoru.soru.replace(/<[^>]*>/g, '')}`,
        isLong: false
      };
    }
  },

  es_nesneler: {
    title: "Eş Nesneler ve Şekiller",
    desc: "Birebir aynı ve eş olan nesneleri, hayvanları ve şekilleri tanıma.",
    generate: () => {
      const nesneGruplari = [
        { ad: "Kırmızı Kalp", icon: "❤️", secenekler: ["❤️", "⭐", "🔷", "🌸"] },
        { ad: "Sevimli Kedi", icon: "🐱", secenekler: ["🐱", "🐶", "🐰", "🦊"] },
        { ad: "Sarı Yıldız", icon: "⭐", secenekler: ["⭐", "🌙", "☀️", "⚡"] },
        { ad: "Futbol Topu", icon: "⚽", secenekler: ["⚽", "🏀", "🎾", "🏐"] },
        { ad: "Kırmızı Elma", icon: "🍎", secenekler: ["🍎", "🍌", "🍇", "🍊"] },
        { ad: "Mavi Kelebek", icon: "🦋", secenekler: ["🦋", "🐝", "🐞", "🐛"] }
      ];
      const secilen = nesneGruplari[Math.floor(Math.random() * nesneGruplari.length)];
      const dogru = secilen.icon;
      const yanlislar = secilen.secenekler.filter(x => x !== dogru);

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 text-center my-auto w-full px-1">
          <div class="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 sm:border-3 border-amber-300 flex items-center justify-center text-4xl xs:text-5xl sm:text-6xl shadow-xl filter drop-shadow-md">
            ${secilen.icon}
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Yukarıdaki <b>${secilen.ad}</b> nesnesinin <b>EŞİ</b> olan şekil hangisidir?
          </div>
        </div>
      `;

      return {
        question: `Yukarıdaki ${secilen.ad} nesnesinin EŞİ olan şekil hangisidir?`,
        questionHTML,
        correct: dogru,
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  geometrik_sekil_cisim: {
    title: "Geometrik Şekiller",
    desc: "Üçgen, kare, dikdörtgen ve çemberi günlük nesnelerle eşleştirme.",
    generate: () => {
      const modeller = [
        // ÇEMBER
        { nesne: "1 TL Madeni Para", sekil: "Çember", img: "/paralar/1_tl_madeni_para.png", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] },
        { nesne: "Simit", sekil: "Çember", emoji: "🥯", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] },
        { nesne: "Hulahop", sekil: "Çember", emoji: "⭕", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] },
        { nesne: "Duvar Saati", sekil: "Çember", emoji: "⏰", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] },
        { nesne: "Yüzük", sekil: "Çember", emoji: "💍", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] },
        // ÜÇGEN
        { nesne: "Trafik Levhası", sekil: "Üçgen", emoji: "⚠️", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        { nesne: "Pizza Dilimi", sekil: "Üçgen", emoji: "🍕", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        { nesne: "Kamp Çadırı", sekil: "Üçgen", emoji: "⛺", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        { nesne: "Yelkenli Yelkeni", sekil: "Üçgen", emoji: "⛵", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        { nesne: "Üçgen Peynir", sekil: "Üçgen", emoji: "🧀", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        // KARE
        { nesne: "Satranç Tahtası", sekil: "Kare", emoji: "🏁", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        { nesne: "Kare Pencere", sekil: "Kare", emoji: "🪟", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        { nesne: "Kare Sehpa", sekil: "Kare", emoji: "🪑", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        { nesne: "Kare Kutu Kapağı", sekil: "Kare", emoji: "📦", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        { nesne: "Kare Fayans", sekil: "Kare", emoji: "🧱", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        // DİKDÖRTGEN
        { nesne: "Yazı Tahtası", sekil: "Dikdörtgen", emoji: "📋", yanlis: ["Üçgen", "Kare", "Çember"] },
        { nesne: "Oda Kapısı", sekil: "Dikdörtgen", emoji: "🚪", yanlis: ["Üçgen", "Kare", "Çember"] },
        { nesne: "Hikaye Kitabı", sekil: "Dikdörtgen", emoji: "📖", yanlis: ["Üçgen", "Kare", "Çember"] },
        { nesne: "Akıllı Telefon", sekil: "Dikdörtgen", emoji: "📱", yanlis: ["Üçgen", "Kare", "Çember"] },
        { nesne: "5 TL Kağıt Para", sekil: "Dikdörtgen", img: "/paralar/5_tl_kagit_para.png", yanlis: ["Üçgen", "Kare", "Çember"] },
        { nesne: "Televizyon Ekranı", sekil: "Dikdörtgen", emoji: "📺", yanlis: ["Üçgen", "Kare", "Çember"] }
      ];
      const m = modeller[Math.floor(Math.random() * modeller.length)];

      const visualHTML = (m as any).img
        ? `<div class="p-2 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.5)] shrink-0 flex items-center justify-center">
             <img src="${(m as any).img}" alt="${m.nesne}" class="geo-cisim-img max-h-20 sm:max-h-24 md:max-h-28 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
           </div>`
        : `<div class="text-5xl xs:text-6xl sm:text-7xl leading-none filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform my-1">${m.emoji}</div>`;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center my-auto">
          ${visualHTML}
          <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white px-2 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <b>"${m.nesne}"</b> hangi geometrik şekle benzer?
          </div>
        </div>
      `;

      return {
        question: `"${m.nesne}" hangi geometrik şekle benzer?`,
        questionHTML,
        correct: m.sekil,
        wrong: m.yanlis,
        isLong: true
      };
    }
  },

  geometri_tahtasi: {
    title: "Geometri Tahtası",
    desc: "Geometri tahtasında noktaları birleştirerek kare, üçgen, dikdörtgen ve çemberi tanıma.",
    generate: () => {
      const sekiller = [
        { ad: "Kare", ipucu: "4 eşit kenarı ve 4 köşesi vardır.", yanlis: ["Üçgen", "Dikdörtgen", "Çember"] },
        { ad: "Üçgen", ipucu: "3 kenarı ve 3 köşesi vardır.", yanlis: ["Kare", "Dikdörtgen", "Çember"] },
        { ad: "Dikdörtgen", ipucu: "Karşılıklı kenarları birbirine eşit 4 kenarı ve 4 köşesi vardır.", yanlis: ["Üçgen", "Kare", "Çember"] },
        { ad: "Çember", ipucu: "Kenarı ve köşesi olmayan yuvarlak şekildir.", yanlis: ["Üçgen", "Kare", "Dikdörtgen"] }
      ];
      const s = sekiller[Math.floor(Math.random() * sekiller.length)];
      return {
        question: `Geometri tahtasında "${s.ipucu}" özelliği olan şekil hangisidir?`,
        correct: s.ad,
        wrong: s.yanlis,
        isLong: false
      };
    }
  },

  // 2. SAYILAR VE NİCELİKLER
  nesne_sayisi: {
    title: "Nesne Sayısını Belirleme (1-20)",
    desc: "Verilen gruptaki nesneleri sayarak doğru sayıyı belirleme alıştırması.",
    generate: () => {
      const adet = Math.floor(Math.random() * 18) + 3; // 3..20
      const emojiler = ["🍎", "⭐", "⚽", "🐱", "🎈", "🌸", "🚗", "🍓", "🐥", "🐬", "🐞", "🧸", "🚀"];
      const secilenEmoji = emojiler[Math.floor(Math.random() * emojiler.length)];

      let gridHTML = '';
      for (let i = 0; i < adet; i++) {
        gridHTML += `<span class="inline-flex items-center justify-center text-2xl xs:text-3xl sm:text-4xl filter drop-shadow-md select-none transform transition-transform hover:scale-110">${secilenEmoji}</span>`;
      }

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center my-auto max-w-md mx-auto w-full px-1">
          <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1 max-w-full">
            ${gridHTML}
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-1 leading-snug">
            Görselde toplam kaç tane <span class="text-amber-300 font-black">${secilenEmoji}</span> vardır?
          </div>
        </div>
      `;

      return {
        question: `Görselde toplam kaç tane nesne vardır? (${adet} adet)`,
        questionHTML,
        correct: adet,
        wrong: benzersizYanlislar(adet, [adet + 1, adet - 1, adet + 2, adet - 2], 1),
        isLong: false
      };
    }
  },

  sira_sayilari: {
    title: "Sıra Sayıları (1., 2., 3., 4., 5.)",
    desc: "Birinci, ikinci, üçüncü, dördüncü gibi sıra bildiren sayıları bulma.",
    generate: () => {
      // 1. sınıf seviyesine uygun, çocukların çok iyi bildiği temel okul eşyaları
      const okulNesneleri = [
        { ad: "Kalem", img: "/okul_gorseller/kursun_kalem.png" },
        { ad: "Silgi", img: "/okul_gorseller/silgi.png" },
        { ad: "Kalemtıraş", img: "/okul_gorseller/kalemtiras.png" },
        { ad: "Cetvel", img: "/okul_gorseller/cetvel.png" },
        { ad: "Makas", img: "/okul_gorseller/makas.png" },
        { ad: "Kitap", img: "/okul_gorseller/acik_kitap.png" },
        { ad: "Defter", img: "/okul_gorseller/yildizli_kahverengi_defter.png" },
        { ad: "Boya Kalemi", img: "/okul_gorseller/renkli_pastel_boya_kalemleri.png" },
        { ad: "Boya Paleti", img: "/okul_gorseller/boya_paleti.png" },
        { ad: "Yazı Tahtası", img: "/okul_gorseller/kara_tahta.png" },
        { ad: "Okul Servisi", img: "/okul_gorseller/okul_otobusu.png" },
        { ad: "Büyüteç", img: "/okul_gorseller/buyutec.png" },
        { ad: "Dünya Küresi", img: "/okul_gorseller/kuresel_harita.png" },
        { ad: "Hesap Makinesi", img: "/okul_gorseller/hesap_makinesi.png" },
        { ad: "Yapıştırıcı", img: "/okul_gorseller/sivi_yapistirici.png" },
        { ad: "Bant", img: "/okul_gorseller/bantli_seloteyp_makinesi.png" },
        { ad: "Lego", img: "/okul_gorseller/lego_bloklari.png" },
        { ad: "Harf Küpü", img: "/okul_gorseller/harf_kupleri.png" },
        { ad: "Pastel Boya", img: "/okul_gorseller/pastel_boya_kutusu.png" },
        { ad: "Mikroskop", img: "/okul_gorseller/mikroskop.png" }
      ];

      // Her soruda rastgele 5 farklı okul görseli seç
      const karisik = [...okulNesneleri].sort(() => Math.random() - 0.5);
      const secilenDizi = karisik.slice(0, 5);

      const siraAdlari = ["1. (Birinci)", "2. (İkinci)", "3. (Üçüncü)", "4. (Dördüncü)", "5. (Beşinci)"];
      const siraKelimeleri = ["Birinci", "İkinci", "Üçüncü", "Dördüncü", "Beşinci"];
      const secilenIndex = Math.floor(Math.random() * secilenDizi.length);
      const secilenNesne = secilenDizi[secilenIndex];

      // Küçük çocukların görselle kolayca seçebilmesi için şık oluşturucu (metinler kesilmez)
      const nesneSecenegiHTML = (nesne: { ad: string; img: string }) => `
        <div class="flex items-center justify-center gap-1.5 w-full px-1">
          <img src="${nesne.img}" alt="${nesne.ad}" class="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow shrink-0" />
          <span class="font-black text-[11px] sm:text-xs md:text-sm text-white leading-tight text-center break-words line-clamp-2">${nesne.ad}</span>
        </div>
      `;

      // 5 okul eşyasının 1.den 5.ye kadar sıra görünümü (100% genişlik, ekrandan asla taşmaz)
      const uretSiraGrid = (isType2: boolean = false) => {
        const itemsHTML = secilenDizi.map((nesne, i) => {
          const isTarget = i === secilenIndex;
          return `
            <div class="flex flex-col items-center justify-between p-1 rounded-xl ${isTarget ? 'bg-amber-400/30 border-2 border-amber-300 ring-2 ring-amber-300/60 shadow-lg' : 'bg-white/10 border border-white/20 shadow-sm'} min-w-0 transition-all">
              <div class="w-full aspect-square max-h-12 sm:max-h-14 flex items-center justify-center p-0.5">
                <img src="${nesne.img}" alt="${nesne.ad}" class="w-full h-full object-contain filter drop-shadow pointer-events-none" />
              </div>
              <span class="mt-1 px-1 sm:px-1.5 py-0.5 rounded-md ${isTarget ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800/90 text-amber-300 font-extrabold'} text-[10px] sm:text-xs leading-none shadow-sm">
                ${isType2 && isTarget ? '❓' : (i + 1) + '.'}
              </span>
            </div>
          `;
        }).join('');

        return `
          <div class="w-full flex flex-col items-center gap-1 sm:gap-1.5 px-0.5 max-w-full">
            <div class="flex items-center justify-between w-full px-1 text-[10px] sm:text-xs font-black text-amber-300 tracking-wider select-none">
              <span class="flex items-center gap-1">🏁 <span>1. BAŞLANGIÇ</span></span>
              <span class="text-white/60 text-[10px] hidden xs:inline">➡️ Sıra Yönü ➡️</span>
              <span class="flex items-center gap-1"><span>5. BİTİŞ</span> 🚩</span>
            </div>
            <div class="grid grid-cols-5 gap-1 sm:gap-1.5 w-full p-1 sm:p-1.5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/15 shadow-inner">
              ${itemsHTML}
            </div>
          </div>
        `;
      };

      // Soru türü: %70 "Sırada X. olan okul eşyası hangisidir?", %30 "Sırada [Görsel] kaçıncı sıradadır?"
      const soruTuru = Math.random() > 0.3 ? 1 : 2;

      if (soruTuru === 1) {
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto w-full max-w-full px-1">
            <div class="text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Sırada <span class="inline-block px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-md mx-0.5">${secilenIndex + 1}. (${siraKelimeleri[secilenIndex]})</span> olan okul eşyası hangisidir?
            </div>
            ${uretSiraGrid(false)}
          </div>
        `;

        const digerNesneler = secilenDizi.filter((_, i) => i !== secilenIndex);
        return {
          question: `Sırada ${secilenIndex + 1}. (${siraKelimeleri[secilenIndex]}) olan okul eşyası hangisidir?`,
          questionHTML,
          correct: nesneSecenegiHTML(secilenNesne),
          wrong: digerNesneler.slice(0, 3).map(n => nesneSecenegiHTML(n)),
          isLong: false
        };
      } else {
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto w-full max-w-full px-1">
            <div class="text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center flex-wrap gap-1">
              <span>Sırada</span>
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-md">
                <img src="${secilenNesne.img}" alt="${secilenNesne.ad}" class="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block filter drop-shadow shrink-0" />
                <span>${secilenNesne.ad}</span>
              </span>
              <span>kaçıncı sıradadır?</span>
            </div>
            ${uretSiraGrid(true)}
          </div>
        `;

        const siraSecenekHTML = (siraMetni: string) => `
          <div class="flex items-center justify-center gap-1.5 w-full px-1">
            <img src="${secilenNesne.img}" alt="${secilenNesne.ad}" class="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow shrink-0" />
            <span class="font-black text-xs sm:text-sm text-white leading-tight text-center">${siraMetni}</span>
          </div>
        `;

        const yanlisSiraSecenekleri = siraAdlari.filter((_, i) => i !== secilenIndex).slice(0, 3);
        return {
          question: `Sırada "${secilenNesne.ad}" kaçıncı sıradadır?`,
          questionHTML,
          correct: siraSecenekHTML(siraAdlari[secilenIndex]),
          wrong: yanlisSiraSecenekleri.map(s => siraSecenekHTML(s)),
          isLong: true
        };
      }
    }
  },

  cok_az_esit: {
    title: "Çok mu, Az mı, Eşit mi?",
    desc: "İki gruptaki nesne sayılarını karşılaştırma.",
    generate: () => {
      const solSayi = Math.floor(Math.random() * 8) + 2;
      let sagSayi = Math.floor(Math.random() * 8) + 2;
      const tur = Math.floor(Math.random() * 3); // 0: çok, 1: az, 2: eşit

      if (tur === 2) {
        sagSayi = solSayi;
      } else if (solSayi === sagSayi) {
        sagSayi = solSayi + 2;
      }

      let soruMetni = "";
      let dogruCevap = "";

      if (tur === 0) {
        soruMetni = "Hangi grupta daha <b>ÇOK (FAZLA)</b> elma vardır?";
        dogruCevap = solSayi > sagSayi ? "A Grubu (Soldaki)" : solSayi < sagSayi ? "B Grubu (Sağdaki)" : "Her İkisi Eşit";
      } else if (tur === 1) {
        soruMetni = "Hangi grupta daha <b>AZ</b> elma vardır?";
        dogruCevap = solSayi < sagSayi ? "A Grubu (Soldaki)" : solSayi > sagSayi ? "B Grubu (Sağdaki)" : "Her İkisi Eşit";
      } else {
        soruMetni = "İki grubun elma sayıları arasındaki ilişki nedir?";
        dogruCevap = solSayi === sagSayi ? "Gruplar Eşit Sayıdadır" : solSayi > sagSayi ? "A Grubu Daha Çoktur" : "B Grubu Daha Çoktur";
      }

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto">
          <div class="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-sm">
            <div class="p-2 sm:p-2.5 rounded-xl bg-blue-950/80 border-2 border-blue-400 text-center">
              <div class="text-xs sm:text-sm font-black text-blue-300 mb-0.5">A GRUBU</div>
              <div class="text-xl sm:text-2xl">${"🍎".repeat(solSayi)}</div>
              <div class="text-xs sm:text-sm font-bold text-white mt-0.5">(${solSayi} Elma)</div>
            </div>
            <div class="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border-2 border-amber-400 text-center">
              <div class="text-xs sm:text-sm font-black text-amber-300 mb-0.5">B GRUBU</div>
              <div class="text-xl sm:text-2xl">${"🍏".repeat(sagSayi)}</div>
              <div class="text-xs sm:text-sm font-bold text-white mt-0.5">(${sagSayi} Elma)</div>
            </div>
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            ${soruMetni}
          </div>
        </div>
      `;

      const tumSecenekler = ["A Grubu (Soldaki)", "B Grubu (Sağdaki)", "Her İkisi Eşit", "Hiçbiri"];
      return {
        question: soruMetni.replace(/<[^>]*>/g, ''),
        questionHTML,
        correct: dogruCevap,
        wrong: tumSecenekler.filter(x => x !== dogruCevap).slice(0, 3),
        isLong: true
      };
    }
  },

  sayi_sekil_oruntusu: {
    title: "Sayı ve Şekil Örüntüleri",
    desc: "Kuralı takip eden dizilerde eksik bırakılan sayıyı veya şekli bulma.",
    generate: () => {
      const oruntuTuru = Math.random() < 0.5 ? 'sayi' : 'sekil';
      if (oruntuTuru === 'sayi') {
        const artis = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
        const baslangic = Math.floor(Math.random() * 10) + 1;
        const dizi = [baslangic, baslangic + artis, baslangic + artis * 2, baslangic + artis * 3, baslangic + artis * 4];
        const boslukIndex = Math.floor(Math.random() * 3) + 1;
        const dogru = dizi[boslukIndex];

        const questionHTML = renderSequenceCardsHTML(
          dizi,
          boslukIndex,
          `Örüntüde <span class="text-yellow-300 font-black">?</span> yerine hangi sayı gelmelidir?`
        );

        return {
          question: `Sayı örüntüsünde ? yerine hangi sayı gelmelidir?`,
          questionHTML,
          correct: dogru,
          wrong: benzersizYanlislar(dogru, [dogru + artis, dogru - artis, dogru + 1, dogru - 1], 1),
          isLong: true
        };
      } else {
        const sekiller = ["⭐", "❤️", "🔷", "🟢"];
        const s1 = sekiller[0];
        const s2 = sekiller[1];
        const dizi = [s1, s2, s1, s2, s1, s2];
        const boslukIndex = Math.floor(Math.random() * 4) + 1;
        const dogru = dizi[boslukIndex];

        const cardsHTML = dizi.map((val, idx) => {
          if (idx === boslukIndex) {
            return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg bg-pink-600/80 border-2 border-yellow-300 text-yellow-200 font-black flex items-center justify-center text-sm xs:text-base sm:text-xl animate-pulse shrink-0">?</div>`;
          }
          return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg bg-blue-900/80 border border-blue-400 flex items-center justify-center text-sm xs:text-base sm:text-xl shrink-0">${val}</div>`;
        }).join('');

        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center my-auto px-0.5 w-full">
            <div class="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 flex-nowrap max-w-full overflow-hidden py-0.5">
              ${cardsHTML}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Şekil örüntüsünde <span class="text-yellow-300 font-black">?</span> yerine hangisi gelmelidir?
            </div>
          </div>
        `;

        return {
          question: `Şekil örüntüsünde ? yerine hangi şekil gelmelidir?`,
          questionHTML,
          correct: dogru,
          wrong: sekiller.filter(s => s !== dogru).slice(0, 3),
          isLong: false
        };
      }
    }
  },

  uzunluk_olcme: {
    title: "Uzunluk Ölçme (Standart Olmayan)",
    desc: "Karış, kulaç, adım, ayak ve parmak ile uzunluk karşılaştırması yapma.",
    generate: () => {
      const senaryolar = [
        {
          soru: "Yazı tahtasının boyunu ölçmek için aşağıdaki standart olmayan ölçme araçlarından hangisi en uygundur?",
          dogru: "Kulaç veya Adım",
          yanlis: ["Parmak", "Silgi", "Kalem Ucu"],
          emoji: "📋 🚶"
        },
        {
          soru: "Defterimizin enini ölçerken hangisini kullanmak daha kolay ve uygundur?",
          dogru: "Karış veya Parmak",
          yanlis: ["Adım", "Kulaç", "Ayak"],
          emoji: "📖 🖐️"
        },
        {
          soru: "Sınıfın boyunu adımlayarak ölçen Harun 12 adım, Eymen ise 10 adım saymıştır. Hangisinin adımı daha büyüktür?",
          dogru: "Eymen'in adımı",
          yanlis: ["Harun'un adımı", "İkisi de eşit", "Bilemeyiz"],
          emoji: "🏫 👣"
        },
        {
          soru: "Zürafa ile Kediyi boylarına göre karşılaştırdığımızda hangisi doğrudur?",
          dogru: "Zürafa daha uzundur",
          yanlis: ["Kedi daha uzundur", "Boyları eşittir", "Kedi daha yüksektir"],
          emoji: "🦒 🐈"
        }
      ];
      const s = senaryolar[Math.floor(Math.random() * senaryolar.length)];
      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 text-center my-auto">
          <div class="text-4xl xs:text-5xl sm:text-6xl filter drop-shadow-xl">${s.emoji}</div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white px-2 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            ${s.soru}
          </div>
        </div>
      `;
      return {
        question: s.soru,
        questionHTML,
        correct: s.dogru,
        wrong: s.yanlis,
        isLong: true
      };
    }
  },

  tartma: {
    title: "Tartma (Ağır - Hafif)",
    desc: "Nesneleri ağırlıklarına göre karşılaştırma (Daha ağır / Daha hafif).",
    generate: () => {
      const karsilastirmalar = [
        { agir: "Karpuz 🍉", hafif: "Elma 🍎" },
        { agir: "Fil 🐘", hafif: "Kuş 🐦" },
        { agir: "Okul Çantası 🎒", hafif: "Kalem ✏️" },
        { agir: "Araba 🚗", hafif: "Bisiklet 🚲" },
        { agir: "Balkabağı 🎃", hafif: "Çilek 🍓" }
      ];
      const secilen = karsilastirmalar[Math.floor(Math.random() * karsilastirmalar.length)];
      const agirSoruluyor = Math.random() < 0.5;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 text-center my-auto px-1 w-full">
          <div class="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 flex-nowrap max-w-full overflow-hidden text-center py-0.5">
            <span class="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-slate-900/90 border border-slate-700 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl shrink-0 whitespace-nowrap">
              ${secilen.agir}
            </span>
            <span class="text-sm xs:text-base sm:text-xl text-amber-300 font-black shrink-0">⚖️</span>
            <span class="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-slate-900/90 border border-slate-700 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl shrink-0 whitespace-nowrap">
              ${secilen.hafif}
            </span>
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Yukarıdaki iki varlıktan hangisi daha <b>${agirSoruluyor ? 'AĞIRDIR' : 'HAFİFTİR'}</b>?
          </div>
        </div>
      `;

      return {
        question: `Yukarıdaki iki varlıktan hangisi daha ${agirSoruluyor ? 'AĞIRDIR' : 'HAFİFTİR'}?`,
        questionHTML,
        correct: agirSoruluyor ? secilen.agir : secilen.hafif,
        wrong: [
          agirSoruluyor ? secilen.hafif : secilen.agir,
          "İkisi Eşit",
          "Tartılamaz"
        ],
        isLong: true
      };
    }
  },

  paralarimiz: {
    title: "Paralarımız (TL ve Kuruş)",
    desc: "1 TL, 50 Kuruş, 25 Kuruş madeni ve 5 TL, 10 TL, 20 TL kağıt paraları tanıma.",
    generate: () => {
      const mode = Math.floor(Math.random() * 4);

      if (mode === 0) {
        // Tek bir parayı tanıma
        const paralar = [
          { name: "1 Kuruş", img: "/paralar/1_kurus_madeni_para.png", wrong: ["5 Kuruş", "10 Kuruş", "1 TL"] },
          { name: "5 Kuruş", img: "/paralar/5_kurus_madeni_para.png", wrong: ["1 Kuruş", "10 Kuruş", "25 Kuruş"] },
          { name: "10 Kuruş", img: "/paralar/10_kurus_madeni_para.png", wrong: ["5 Kuruş", "25 Kuruş", "50 Kuruş"] },
          { name: "25 Kuruş", img: "/paralar/25_kurus_madeni_para.png", wrong: ["10 Kuruş", "50 Kuruş", "1 TL"] },
          { name: "50 Kuruş", img: "/paralar/50_kurus_madeni_para.png", wrong: ["25 Kuruş", "1 TL", "5 TL"] },
          { name: "1 TL", img: "/paralar/1_tl_madeni_para.png", wrong: ["50 Kuruş", "5 TL", "10 TL"] },
          { name: "5 TL", img: "/paralar/5_tl_kagit_para.png", wrong: ["10 TL", "20 TL", "50 TL"] },
          { name: "10 TL", img: "/paralar/10_tl_kagit_para.png", wrong: ["5 TL", "20 TL", "50 TL"] },
          { name: "20 TL", img: "/paralar/20_tl_kagit_para.png", wrong: ["10 TL", "50 TL", "100 TL"] },
          { name: "50 TL", img: "/paralar/50_tl_kagit_para.png", wrong: ["20 TL", "100 TL", "200 TL"] },
          { name: "100 TL", img: "/paralar/100_tl_kagit_para.png", wrong: ["50 TL", "20 TL", "200 TL"] },
          { name: "200 TL", img: "/paralar/200_tl_kagit_para.png", wrong: ["100 TL", "50 TL", "20 TL"] },
        ];
        const p = paralar[Math.floor(Math.random() * paralar.length)];
        const isCoin = p.img.includes('madeni');
        const questionText = "Görseldeki paranın değeri nedir?";
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center my-auto w-full px-1">
            <div class="para-container flex items-center justify-center my-0.5 max-w-full">
              <img src="${p.img}" alt="${p.name}" class="${isCoin ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
            </div>
            <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              ${questionText}
            </div>
          </div>
        `;
        return {
          question: questionText,
          questionHTML,
          correct: p.name,
          wrong: p.wrong,
          isLong: false
        };
      } else if (mode === 1) {
        // Paraları toplama (Aynı madeni veya kağıt paralar)
        const toplamSorulari = [
          {
            images: ["/paralar/50_kurus_madeni_para.png", "/paralar/50_kurus_madeni_para.png"],
            text: "Görseldeki 2 tane 50 Kuruşun toplam değeri nedir?",
            correct: "1 TL",
            wrong: ["2 TL", "50 Kuruş", "5 TL"],
            isCoin: true
          },
          {
            images: ["/paralar/25_kurus_madeni_para.png", "/paralar/25_kurus_madeni_para.png", "/paralar/25_kurus_madeni_para.png", "/paralar/25_kurus_madeni_para.png"],
            text: "Görseldeki 4 tane 25 Kuruş toplam kaç lira yapar?",
            correct: "1 TL",
            wrong: ["2 TL", "50 Kuruş", "100 TL"],
            isCoin: true
          },
          {
            images: ["/paralar/10_tl_kagit_para.png", "/paralar/10_tl_kagit_para.png"],
            text: "Görseldeki 2 tane 10 TL kağıt paranın toplamı kaç TL'dir?",
            correct: "20 TL",
            wrong: ["10 TL", "15 TL", "30 TL"],
            isCoin: false
          },
          {
            images: ["/paralar/5_tl_kagit_para.png", "/paralar/5_tl_kagit_para.png"],
            text: "Görseldeki 2 tane 5 TL kağıt paranın toplamı kaç TL'dir?",
            correct: "10 TL",
            wrong: ["15 TL", "20 TL", "5 TL"],
            isCoin: false
          },
          {
            images: ["/paralar/20_tl_kagit_para.png", "/paralar/20_tl_kagit_para.png"],
            text: "Görseldeki 2 tane 20 TL kağıt paranın toplamı kaç TL'dir?",
            correct: "40 TL",
            wrong: ["30 TL", "50 TL", "20 TL"],
            isCoin: false
          },
          {
            images: ["/paralar/1_tl_madeni_para.png", "/paralar/1_tl_madeni_para.png", "/paralar/1_tl_madeni_para.png"],
            text: "Görseldeki 3 tane 1 TL madeni paranın toplamı kaç TL'dir?",
            correct: "3 TL",
            wrong: ["2 TL", "4 TL", "5 TL"],
            isCoin: true
          }
        ];
        const s = toplamSorulari[Math.floor(Math.random() * toplamSorulari.length)];
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center my-auto w-full px-1">
            <div class="para-container flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap max-w-full my-0.5">
              ${s.images.map(img => `
                <img src="${img}" alt="Para" class="${s.isCoin ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" />
              `).join('')}
            </div>
            <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              ${s.text}
            </div>
          </div>
        `;
        return {
          question: s.text,
          questionHTML,
          correct: s.correct,
          wrong: s.wrong,
          isLong: false
        };
      } else if (mode === 2) {
        // Karışık Paraları Toplama
        const karisikSorular = [
          {
            images: ["/paralar/10_tl_kagit_para.png", "/paralar/5_tl_kagit_para.png"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?",
            correct: "15 TL",
            wrong: ["12 TL", "20 TL", "25 TL"]
          },
          {
            images: ["/paralar/20_tl_kagit_para.png", "/paralar/10_tl_kagit_para.png"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?",
            correct: "30 TL",
            wrong: ["25 TL", "35 TL", "40 TL"]
          },
          {
            images: ["/paralar/50_tl_kagit_para.png", "/paralar/20_tl_kagit_para.png"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?",
            correct: "70 TL",
            wrong: ["60 TL", "80 TL", "75 TL"]
          },
          {
            images: ["/paralar/5_tl_kagit_para.png", "/paralar/1_tl_madeni_para.png"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?",
            correct: "6 TL",
            wrong: ["5 TL", "7 TL", "10 TL"]
          },
          {
            images: ["/paralar/10_tl_kagit_para.png", "/paralar/1_tl_madeni_para.png", "/paralar/1_tl_madeni_para.png"],
            text: "Görseldeki paraların toplam değeri kaç TL'dir?",
            correct: "12 TL",
            wrong: ["11 TL", "13 TL", "15 TL"]
          }
        ];
        const s = karisikSorular[Math.floor(Math.random() * karisikSorular.length)];
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center my-auto w-full px-1">
            <div class="para-container flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 flex-wrap max-w-full my-0.5">
              ${s.images.map(img => `
                <img src="${img}" alt="Para" class="${img.includes('madeni') ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" />
              `).join('')}
            </div>
            <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              ${s.text}
            </div>
          </div>
        `;
        return {
          question: s.text,
          questionHTML,
          correct: s.correct,
          wrong: s.wrong,
          isLong: false
        };
      } else {
        // En büyük / En küçük Madeni veya Kağıt para özellikleri
        const genelSorular = [
          {
            img: "/paralar/1_kurus_madeni_para.png",
            text: "En küçük değere sahip madeni paramız hangisidir?",
            correct: "1 Kuruş",
            wrong: ["5 Kuruş", "10 Kuruş", "1 TL"]
          },
          {
            img: "/paralar/1_tl_madeni_para.png",
            text: "En büyük değere sahip madeni paramız hangisidir?",
            correct: "1 TL",
            wrong: ["50 Kuruş", "5 TL", "25 Kuruş"]
          },
          {
            img: "/paralar/5_tl_kagit_para.png",
            text: "En küçük değere sahip kağıt paramız hangisidir?",
            correct: "5 TL",
            wrong: ["1 TL", "10 TL", "20 TL"]
          },
          {
            img: "/paralar/200_tl_kagit_para.png",
            text: "En büyük değere sahip kağıt paramız hangisidir?",
            correct: "200 TL",
            wrong: ["100 TL", "50 TL", "500 TL"]
          }
        ];
        const s = genelSorular[Math.floor(Math.random() * genelSorular.length)];
        const isCoin = s.img.includes('madeni');
        const questionHTML = `
          <div class="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center my-auto w-full px-1">
            <div class="para-container flex items-center justify-center my-0.5 max-w-full">
              <img src="${s.img}" alt="Para" class="${isCoin ? 'para-madeni' : 'para-kagit'} object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]" />
            </div>
            <div class="text-sm xs:text-base sm:text-lg md:text-xl font-black text-white px-1 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              ${s.text}
            </div>
          </div>
        `;
        return {
          question: s.text,
          questionHTML,
          correct: s.correct,
          wrong: s.wrong,
          isLong: false
        };
      }
    }
  },

  // 1. Sınıf Ritmik Saymalar
  ritmik_ileri_1: {
    title: "İleri Birer Sayma (1-50)",
    desc: "1'den 50'ye kadar ileriye doğru birer ritmik sayma zinciri tamamlama.",
    generate: () => ritmikIleri1Uret()
  },

  ritmik_ileri_2: {
    title: "İleri İkişer Sayma (2-20)",
    desc: "20'ye kadar ileriye doğru ikişer ritmik sayma zinciri tamamlama.",
    generate: () => ritmikIleriUret1st(2, 20)
  },

  ritmik_ileri_5: {
    title: "İleri Beşer Sayma (5-50)",
    desc: "50'ye kadar ileriye doğru beşer ritmik sayma zinciri tamamlama.",
    generate: () => ritmikIleriUret1st(5, 50)
  },

  ritmik_ileri_10: {
    title: "İleri Onar Sayma (10-100)",
    desc: "100'e kadar ileriye doğru onar ritmik sayma zinciri tamamlama.",
    generate: () => ritmikIleriUret1st(10, 100)
  },

  ritmik_geri_1: {
    title: "Geriye Birer Sayma (20-0)",
    desc: "20'den geriye doğru birer sayma zinciri tamamlama.",
    generate: () => ritmikGeri1Uret()
  },

  ritmik_geri_2: {
    title: "Geriye İkişer Sayma (20-0)",
    desc: "20'den geriye doğru ikişer ritmik sayma zinciri tamamlama.",
    generate: () => ritmikGeriUret1st(2, 20)
  },

  ritmik_geri_10: {
    title: "Geriye Onar Sayma (100-0)",
    desc: "100'den geriye doğru onar ritmik sayma zinciri tamamlama.",
    generate: () => ritmikGeriUret1st(10, 100)
  },

  // 3. İŞLEMLER VE CEBİR
  toplama_20_ici: {
    title: "20 İçinde Toplama İşlemi",
    desc: "20'ye kadar olan sayılarla temel toplama alıştırmaları.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 10) + 1;
      const maxS2 = 20 - s1;
      const s2 = Math.floor(Math.random() * Math.min(maxS2, 10)) + 1;
      const sonuc = s1 + s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} + ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            Toplama işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} + ${s2} = ?\n\nToplama işleminin sonucu kaçtır?`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 1),
        isLong: false
      };
    }
  },

  toplama_onluk: {
    title: "Onluklarla Toplama İşlemi",
    desc: "10, 20, 30, 40 gibi tam onlukları zihinden ve işlemle toplama.",
    generate: () => {
      const onluklar = [10, 20, 30, 40, 50];
      const s1 = onluklar[Math.floor(Math.random() * 4)];
      const kalanlar = onluklar.filter(o => s1 + o <= 100);
      const s2 = kalanlar[Math.floor(Math.random() * kalanlar.length)];
      const sonuc = s1 + s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} + ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            Onluklarla toplama işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} + ${s2} = ?\n\nOnluklarla toplama işleminin sonucu kaçtır?`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 20, sonuc - 20], 10),
        isLong: false
      };
    }
  },

  verilmeyen_toplanan: {
    title: "Verilmeyen Toplananı Bulma",
    desc: "A + ? = B veya ? + A = B şeklindeki işlemlerde eksik toplananı bulma.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 9) + 2; // 2..10
      const eksik = Math.floor(Math.random() * 9) + 1; // 1..9
      const toplam = s1 + eksik;
      const solTaraftaMi = Math.random() < 0.5;

      const questionText = solTaraftaMi ? `${s1} + ? = ${toplam}` : `? + ${s1} = ${toplam}`;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${questionText}
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            Soru işareti (<span class="text-amber-300 font-black">?</span>) yerine hangi sayı gelmelidir?
          </div>
        </div>
      `;

      return {
        question: `${questionText}\n\nSoru işareti (?) yerine hangi sayı gelmelidir?`,
        questionHTML,
        correct: eksik,
        wrong: benzersizYanlislar(eksik, [eksik + 1, eksik - 1, eksik + 2, toplam], 1),
        isLong: true
      };
    }
  },

  zihinden_toplama: {
    title: "Zihinden Toplama (10'a Tamamlama)",
    desc: "Sayıları 10'a tamamlayarak kolayca zihinden toplama.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 4) + 7; // 7, 8, 9, 10
      const s2 = Math.floor(Math.random() * 6) + 3; // 3..8
      const sonuc = s1 + s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} + ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            ${s1} sayısına ${s2} eklersek <span class="text-amber-300 underline decoration-amber-400 font-black">sonuç kaç olur</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} sayısına ${s2} eklersek sonuç kaç olur? (${s1} + ${s2} = ?)`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 1),
        isLong: true
      };
    }
  },

  tek_islem_toplama_problemleri: {
    title: "Tek İşlemli Toplama Problemleri",
    desc: "1. Sınıf düzeyinde hikayeli tek adımlı toplama problemleri.",
    generate: () => {
      const isim = getRastgeleOgrenci();
      const s1 = Math.floor(Math.random() * 8) + 3;
      const s2 = Math.floor(Math.random() * 8) + 2;
      const sonuc = s1 + s2;

      const nesneler = ["balon", "kalem", "ceviz", "elma", "bilye", "çıkartma"];
      const n = nesneler[Math.floor(Math.random() * nesneler.length)];
      const iyelik = getNesneIyelik(n);

      const soru = `${getIsimTamlayan(isim)} ${s1} tane ${iyelik} vardı. Öğretmeni ona ${s2} tane daha ${n} verdi. ${getIsimTamlayan(isim)} toplam kaç ${iyelik} oldu?`;

      return {
        question: soru,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, s1], 1),
        isLong: true
      };
    }
  },

  iki_islem_toplama_problemleri: {
    title: "İki İşlemli Toplama Problemleri",
    desc: "Üç arkadaşın topladıkları veya iki aşamalı toplama problemleri.",
    generate: () => {
      const i1 = getRastgeleOgrenci();
      const i2 = getRastgeleOgrenci();
      const s1 = Math.floor(Math.random() * 5) + 2;
      const s2 = Math.floor(Math.random() * 4) + 2;
      const s3 = Math.floor(Math.random() * 4) + 1;
      const sonuc = s1 + s2 + s3;

      const soru = `${getIsimTamlayan(i1)} ${s1} cevizi, ${getIsimTamlayan(i2)} ${s2} cevizi, Harun'un ise ${s3} cevizi vardır. Üçünün toplam kaç cevizi vardır?`;

      return {
        question: soru,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, s1 + s2], 1),
        isLong: true
      };
    }
  },

  cikarma_20_ici: {
    title: "20 İçinde Çıkarma İşlemi",
    desc: "20'ye kadar olan sayılarla temel çıkarma alıştırmaları.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 12) + 6; // 6..17
      const s2 = Math.floor(Math.random() * (s1 - 2)) + 1;
      const sonuc = s1 - s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} - ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            Çıkarma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} - ${s2} = ?\n\nÇıkarma işleminin sonucu kaçtır?`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 0),
        isLong: false
      };
    }
  },

  cikarma_onluk: {
    title: "Onluklarla Çıkarma İşlemi",
    desc: "Onlukların birbirinden çıkarılması alıştırmaları.",
    generate: () => {
      const s1 = (Math.floor(Math.random() * 6) + 3) * 10; // 30..80
      const s2 = (Math.floor(Math.random() * (s1 / 10 - 1)) + 1) * 10;
      const sonuc = s1 - s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} - ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            Onluklarla çıkarma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} - ${s2} = ?\n\nOnluklarla çıkarma işleminin sonucu kaçtır?`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 20, sonuc - 20], 0),
        isLong: false
      };
    }
  },

  zihinden_cikarma: {
    title: "Zihinden Çıkarma İşlemleri",
    desc: "Geriye sayma veya 10'dan eksiltme yoluyla zihinden çıkarma.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 9) + 11; // 11..19
      const s2 = Math.floor(Math.random() * 5) + 1; // 1..5
      const sonuc = s1 - s2;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${s1} - ${s2} = ?
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            ${s1} sayısından ${s2} çıkarırsak <span class="text-amber-300 underline decoration-amber-400 font-black">kaç kalır</span>?
          </div>
        </div>
      `;

      return {
        question: `${s1} sayısından ${s2} çıkarırsak kaç kalır? (${s1} - ${s2} = ?)`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 0),
        isLong: true
      };
    }
  },

  tek_islem_cikarma_problemleri: {
    title: "Tek İşlemli Çıkarma Problemleri",
    desc: "Azalma, eksilme ve harcama durumlarını içeren 1. sınıf çıkarma problemleri.",
    generate: () => {
      const isim = getRastgeleOgrenci();
      const s1 = Math.floor(Math.random() * 8) + 10; // 10..17
      const s2 = Math.floor(Math.random() * (s1 - 4)) + 2;
      const sonuc = s1 - s2;

      const nesneler = ["balon", "fındık", "bilye", "çilek", "kalem"];
      const n = nesneler[Math.floor(Math.random() * nesneler.length)];

      const soru = `Tabaktaki ${s1} tane ${n}den ${s2} tanesini ${isim} yedi. Tabakta kaç tane ${n} kaldı?`;

      return {
        question: soru,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, s1], 0),
        isLong: true
      };
    }
  },

  iki_islem_cikarma_problemleri: {
    title: "İki İşlemli Çıkarma Problemleri",
    desc: "Art arda eksilme veya dağıtma içeren iki adımlı çıkarma problemleri.",
    generate: () => {
      const isim = getRastgeleOgrenci();
      const baslangic = Math.floor(Math.random() * 6) + 14; // 14..19
      const v1 = Math.floor(Math.random() * 3) + 2; // 2..4
      const v2 = Math.floor(Math.random() * 3) + 2; // 2..4
      const sonuc = baslangic - v1 - v2;

      const soru = `${getIsimTamlayan(isim)} ${baslangic} tane boya kalemi vardı. 1. arkadaşına ${v1} tane, 2. arkadaşına ${v2} tane verdi. Geriye kaç kalemi kaldı?`;

      return {
        question: soru,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, baslangic - v1], 0),
        isLong: true
      };
    }
  },

  toplama_cikarma_problemleri: {
    title: "Karışık Toplama ve Çıkarma Problemleri",
    desc: "Önce artma sonra azalma veya önce harcama sonra kazanma durumları.",
    generate: () => {
      const isim = getRastgeleOgrenci();
      const s1 = Math.floor(Math.random() * 6) + 8; // 8..13
      const s2 = Math.floor(Math.random() * 5) + 3; // 3..7
      const s3 = Math.floor(Math.random() * 4) + 2; // 2..5
      const sonuc = s1 + s2 - s3;

      const soru = `Ağaçta ${s1} kuş vardı. Ağaca ${s2} kuş daha kondu. Daha sonra ${s3} kuş uçup gitti. Ağaçta son durumda kaç kuş kaldı?`;

      return {
        question: soru,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, s1 + s2], 0),
        isLong: true
      };
    }
  },

  // 4. VERİ İŞLEME
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
  },

  // 5. EĞLENCELİ MATEMATİK VE ZEKA OYUNLARI
  sureli_toplama_cikarma: {
    title: "⚡ Süreli Hızlı Toplama & Çıkarma",
    desc: "10 saniye süre bitmeden hızlıca toplama veya çıkarma yap.",
    generate: () => {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const s1 = Math.floor(Math.random() * 9) + 1;
        const s2 = Math.floor(Math.random() * (10 - s1)) + 1;
        const sonuc = s1 + s2;

        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg animate-pulse">
              ${s1} + ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              ⚡ Hızlıca topla: <span class="text-amber-300 underline decoration-amber-400 font-black">sonuç kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${s1} + ${s2} = ?`,
          questionHTML,
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 1),
          isLong: false
        };
      } else {
        const s1 = Math.floor(Math.random() * 10) + 3;
        const s2 = Math.floor(Math.random() * (s1 - 1)) + 1;
        const sonuc = s1 - s2;

        const questionHTML = `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
            <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg animate-pulse">
              ${s1} - ${s2} = ?
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              ⚡ Hızlıca çıkar: <span class="text-amber-300 underline decoration-amber-400 font-black">sonuç kaçtır</span>?
            </div>
          </div>
        `;

        return {
          question: `${s1} - ${s2} = ?`,
          questionHTML,
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 0),
          isLong: false
        };
      }
    }
  },

  sureli_on_tamamlama: {
    title: "⚡ 10'a Tamamlama Yarışı",
    desc: "Verilen sayıyı 10 yapmak için kaç eklemek gerektiğini hızlıca bul.",
    generate: () => {
      const sayi = Math.floor(Math.random() * 9) + 1; // 1..9
      const gereken = 10 - sayi;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
          <div class="px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-4xl md:text-5xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg">
            ${sayi} + ? = 10
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
            ${sayi} sayısını <span class="text-yellow-300 font-black">10'a</span> tamamlamak için kaç eklemeliyiz?
          </div>
        </div>
      `;

      return {
        question: `${sayi} sayısını 10'a tamamlamak için kaç eklemeliyiz?\n(${sayi} + ? = 10)`,
        questionHTML,
        correct: gereken,
        wrong: benzersizYanlislar(gereken, [gereken + 1, gereken - 1, gereken + 2, gereken - 2], 1),
        isLong: true
      };
    }
  },

  balon_patlatma_mat: {
    title: "🎈 Balon Patlatma Matematik",
    desc: "En büyük veya en küçük sayıyı bulup doğru balonu patlat.",
    generate: () => {
      const sayilar = [
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 6,
        Math.floor(Math.random() * 5) + 11,
        Math.floor(Math.random() * 5) + 16
      ].sort(() => 0.5 - Math.random());

      const enBuyukMu = Math.random() < 0.5;
      const dogru = enBuyukMu ? Math.max(...sayilar) : Math.min(...sayilar);

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto">
          <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            ${sayilar.map(s => `<span class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-black text-lg xs:text-xl sm:text-2xl border-2 border-white shadow-md">🎈 ${s}</span>`).join('')}
          </div>
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-1">
            Yukarıdaki balonlardan hangisinde <b>${enBuyukMu ? 'EN BÜYÜK' : 'EN KÜÇÜK'}</b> sayı yazmaktadır?
          </div>
        </div>
      `;

      return {
        question: `Yukarıdaki balonlardan hangisinde ${enBuyukMu ? 'EN BÜYÜK' : 'EN KÜÇÜK'} sayı yazmaktadır?`,
        questionHTML,
        correct: dogru,
        wrong: sayilar.filter(s => s !== dogru),
        isLong: false
      };
    }
  },

  matematik_hafiza: {
    title: "🧠 Matematik Hafıza Kartları",
    desc: "Birbirine eşit olan işlem ve sonucu eşleştirme.",
    generate: () => {
      const islemler = [
        { islem: "4 + 3", sonuc: 7 },
        { islem: "5 + 5", sonuc: 10 },
        { islem: "8 - 3", sonuc: 5 },
        { islem: "6 + 2", sonuc: 8 },
        { islem: "9 - 5", sonuc: 4 },
        { islem: "7 + 2", sonuc: 9 }
      ];
      const secilen = islemler[Math.floor(Math.random() * islemler.length)];
      return {
        question: `"${secilen.islem}" işleminin sonucu hangi hafıza kartına eşittir?`,
        correct: secilen.sonuc,
        wrong: benzersizYanlislar(secilen.sonuc, [secilen.sonuc + 1, secilen.sonuc - 1, secilen.sonuc + 2], 1),
        isLong: false
      };
    }
  },

  hizli_islem_carki: {
    title: "🎡 Hızlı İşlem Çarkı",
    desc: "Çarkın ortasındaki sayıya göre hızlı hesaplama yap.",
    generate: () => {
      const merkez = Math.floor(Math.random() * 5) + 5; // 5..9
      const eklenen = Math.floor(Math.random() * 4) + 1; // 1..4
      const sonuc = merkez + eklenen;

      // 8 dilimli renkli matematik çarkı SVG tasarımı
      const slices = [
        { label: `+${eklenen}`, color: '#EF4444' },
        { label: '+1', color: '#F59E0B' },
        { label: '+2', color: '#10B981' },
        { label: '+3', color: '#06B6D4' },
        { label: '+4', color: '#3B82F6' },
        { label: '+5', color: '#6366F1' },
        { label: '+6', color: '#8B5CF6' },
        { label: '+7', color: '#EC4899' },
      ];

      const wheelSVG = `
        <svg viewBox="0 0 200 200" class="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] mx-auto">
          <defs>
            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#1E293B" />
              <stop offset="100%" stop-color="#020617" />
            </radialGradient>
          </defs>
          <!-- Outer Wheel Rim -->
          <circle cx="100" cy="100" r="96" fill="#0F172A" stroke="#FBBF24" stroke-width="4" />
          <!-- 8 Wheel Wedges -->
          <!-- Top Slice: -112.5 deg to -67.5 deg (Center at -90 deg, Top pointer) -->
          <path d="M 100 100 L 64.4 11.8 A 94 94 0 0 1 135.6 11.8 Z" fill="#EF4444" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 135.6 11.8 A 94 94 0 0 1 188.2 64.4 Z" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 188.2 64.4 A 94 94 0 0 1 188.2 135.6 Z" fill="#10B981" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 188.2 135.6 A 94 94 0 0 1 135.6 188.2 Z" fill="#06B6D4" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 135.6 188.2 A 94 94 0 0 1 64.4 188.2 Z" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 64.4 188.2 A 94 94 0 0 1 11.8 135.6 Z" fill="#6366F1" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 11.8 135.6 A 94 94 0 0 1 11.8 64.4 Z" fill="#8B5CF6" stroke="#FFFFFF" stroke-width="1.5" />
          <path d="M 100 100 L 11.8 64.4 A 94 94 0 0 1 64.4 11.8 Z" fill="#EC4899" stroke="#FFFFFF" stroke-width="1.5" />
          <!-- Labels on Wedges -->
          <text x="100" y="44" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="900" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.9))">+${eklenen}</text>
          <text x="146" y="62" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+1</text>
          <text x="162" y="106" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+2</text>
          <text x="146" y="148" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+3</text>
          <text x="100" y="166" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+4</text>
          <text x="54" y="148" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+5</text>
          <text x="38" y="106" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+6</text>
          <text x="54" y="62" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">+7</text>
          <!-- Center Wheel Hub -->
          <circle cx="100" cy="100" r="32" fill="url(#hubGrad)" stroke="#FBBF24" stroke-width="3.5" />
          <text x="100" y="93" text-anchor="middle" fill="#94A3B8" font-size="9" font-weight="800" letter-spacing="1">MERKEZ</text>
          <text x="100" y="113" text-anchor="middle" fill="#FDE047" font-size="20" font-weight="900">${merkez}</text>
          <!-- Pointer / İbre (Arrow pointing to top slice) -->
          <polygon points="100,24 88,4 112,4" fill="#FACC15" stroke="#000000" stroke-width="2" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.8))" />
          <circle cx="100" cy="6" r="4" fill="#EF4444" stroke="#FFFFFF" stroke-width="1.5" />
        </svg>
      `;

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 my-auto w-full px-1 text-center">
          ${wheelSVG}
          <div class="flex items-center justify-center gap-2 my-0.5">
            <span class="px-3.5 py-1 rounded-xl bg-slate-900/95 border-2 border-amber-400 text-amber-300 font-black text-sm xs:text-base sm:text-lg shadow-md whitespace-nowrap">
              ${merkez} + ${eklenen} = ❓
            </span>
          </div>
          <div class="text-xs xs:text-sm sm:text-base font-black text-white text-center leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-2">
            🎡 Çarkın ortasındaki <span class="text-amber-300 font-black">${merkez}</span> sayısına ibrenin gösterdiği <span class="text-cyan-300 font-black">+${eklenen}</span> eklenirse ibre kaçı gösterir?
          </div>
        </div>
      `;

      return {
        question: `🎡 Çarkın ortasındaki ${merkez} sayısına ${eklenen} eklenirse ibre kaçı gösterir?`,
        questionHTML,
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2], 1),
        isLong: true
      };
    }
  },

  sayi_dedektifi: {
    title: "🔍 Sayı Dedektifi",
    desc: "Verilen gizemli ipuçlarını takip ederek aranan sayıyı bul.",
    generate: () => {
      const sayi = Math.floor(Math.random() * 15) + 2; // 2..16
      const ipucu1 = sayi > 10 ? "10'dan BÜYÜK" : "10'dan KÜÇÜK";
      const ipucu2 = sayi % 2 === 0 ? "ÇİFT sayıdır (2'şer sayarken söylenir)" : "TEK sayıdır";

      return {
        question: `🔍 İpuçları:\n• Bu sayı ${ipucu1},\n• ${sayi - 1} ile ${sayi + 1} arasındadır.\n\nDedektif, aradığımız sayı kaçtır?`,
        correct: sayi,
        wrong: benzersizYanlislar(sayi, [sayi + 2, sayi - 2, sayi + 3, sayi - 3], 1),
        isLong: true
      };
    }
  },

  ritim_labirent: {
    title: "🌀 Ritim Labirenti",
    desc: "2'şer veya 5'er ritmik sayarak labirentten çıkışı bul.",
    generate: () => {
      const adim = Math.random() < 0.5 ? 2 : 5;
      const baslangic = adim * 2;
      const eksik: number = baslangic + adim * 2;
      const sira: (number | string)[] = [baslangic, baslangic + adim, "?", baslangic + adim * 3];

      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto w-full px-1">
          <div class="text-sm xs:text-base sm:text-lg font-black text-white px-2 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            🌀 <span class="text-cyan-300 underline decoration-cyan-400 font-extrabold text-base xs:text-lg sm:text-xl">${adim}'şer</span> ritmik sayarak labirentte ilerliyoruz:
          </div>
          <!-- FARKLI RENKTE VE AYRI BİR SATIRDAKİ RİTMİK ADIM KUTULARI -->
          <div class="flex items-center justify-center gap-2 sm:gap-3 my-1.5 flex-wrap">
            ${sira.map((item) => {
              if (item === "?") {
                return `<div class="px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 border-2 border-white text-white font-black text-xl xs:text-2xl sm:text-3xl shadow-[0_4px_16px_rgba(244,63,94,0.7)] animate-pulse ring-2 ring-rose-400/50 shrink-0">?</div>`;
              }
              return `<div class="px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 font-black text-xl xs:text-2xl sm:text-3xl shadow-[0_4px_14px_rgba(245,158,11,0.5)] shrink-0">${item}</div>`;
            }).join('')}
          </div>
          <div class="text-xs xs:text-sm sm:text-base font-black text-white px-2 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5">
            Soru işareti (<span class="text-rose-400 font-black">?</span>) yerine hangi adım gelmelidir?
          </div>
        </div>
      `;

      return {
        question: `🌀 ${adim}'şer ritmik sayarak labirentte ilerliyoruz:\n\n[ ${sira.join("  -  ")} ]\n\nSoru işareti (?) yerine hangi adım gelmelidir?`,
        questionHTML,
        correct: eksik,
        wrong: benzersizYanlislar(eksik, [eksik + adim, eksik - adim, eksik + 1], 1),
        isLong: true
      };
    }
  },

  geometri_eslestirme: {
    title: "🔺 Geometri Eşleştirme",
    desc: "Üçgen, kare, dikdörtgen ve çember şekillerini eşleştirme.",
    generate: () => {
      const eslesmeler = [
        { sekil: "3 kenarı ve 3 köşesi olan şekil", dogru: "Üçgen", yanlis: ["Kare", "Dikdörtgen", "Çember"], emoji: "🔺" },
        { sekil: "4 eşit kenarı ve 4 köşesi olan şekil", dogru: "Kare", yanlis: ["Üçgen", "Dikdörtgen", "Çember"], emoji: "🟦" },
        { sekil: "Kenarı ve köşesi olmayan yuvarlak şekil", dogru: "Çember", yanlis: ["Kare", "Üçgen", "Dikdörtgen"], emoji: "⭕" },
        { sekil: "Karşılıklı kenarları eşit 4 kenarlı şekil", dogru: "Dikdörtgen", yanlis: ["Üçgen", "Kare", "Çember"], emoji: "🟨" }
      ];
      const secilen = eslesmeler[Math.floor(Math.random() * eslesmeler.length)];
      const questionHTML = `
        <div class="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center my-auto">
          <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white px-2 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <b>${secilen.sekil}</b> hangisidir?
          </div>
        </div>
      `;
      return {
        question: `${secilen.sekil} hangisidir?`,
        questionHTML,
        correct: secilen.dogru,
        wrong: secilen.yanlis,
        isLong: false
      };
    }
  }
};

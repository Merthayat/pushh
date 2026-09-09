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

function sayiOkunusTR(n: number): string {
  if (n === 0) return 'sıfır';
  const birler = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
  const onlar = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

  function ucluOkunus(num: number): string {
    let res = '';
    const yuz = Math.floor(num / 100);
    const on = Math.floor((num % 100) / 10);
    const bir = num % 10;
    if (yuz > 0) {
      if (yuz === 1) res += 'yüz ';
      else res += birler[yuz] + ' yüz ';
    }
    if (on > 0) res += onlar[on] + ' ';
    if (bir > 0) res += birler[bir] + ' ';
    return res.trim();
  }

  if (n < 1000) return ucluOkunus(n);
  
  const binlerKismi = Math.floor(n / 1000);
  const birlerKismi = n % 1000;

  let sonuc = '';
  if (binlerKismi === 1) {
    sonuc += 'bin ';
  } else {
    sonuc += ucluOkunus(binlerKismi) + ' bin ';
  }

  if (birlerKismi > 0) {
    sonuc += ucluOkunus(birlerKismi);
  }

  return sonuc.trim();
}

export const topics4thGrade: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
  // ==========================================
  // TEMA 1: SAYILAR VE NİCELİKLER (1)
  // ==========================================

  // 1.1 4-6 Basamaklı Sayıları Okuma ve Yazma
  g4_sayi_okuma_yazma: {
    title: "4-6 Basamaklı Doğal Sayılar",
    desc: "4, 5 ve 6 basamaklı sayıları okuma, yazma ve basamak adlandırma alıştırmaları.",
    generate: () => {
      const mode = Math.random();
      if (mode < 0.5) {
        // Sayı verilip okunuşu sorulur
        const basamakSecim = Math.random();
        let sayi = 0;
        if (basamakSecim < 0.35) {
          sayi = Math.floor(Math.random() * 9000) + 1000; // 4 basamaklı
        } else if (basamakSecim < 0.7) {
          sayi = Math.floor(Math.random() * 90000) + 10000; // 5 basamaklı
        } else {
          sayi = Math.floor(Math.random() * 900000) + 100000; // 6 basamaklı
        }

        const dogruOkunus = sayiOkunusTR(sayi);
        const formatliSayi = sayi.toLocaleString('tr-TR');

        // Yanlış okunuşlar üretme
        const yanlislar: string[] = [];
        let deneme = 0;
        while (yanlislar.length < 3 && deneme < 20) {
          deneme++;
          const fark = (Math.floor(Math.random() * 9) + 1) * (Math.random() < 0.5 ? 100 : 1000);
          const ySayi = sayi + (Math.random() < 0.5 ? fark : -fark);
          if (ySayi > 0 && ySayi !== sayi) {
            const yOkunus = sayiOkunusTR(ySayi);
            if (!yanlislar.includes(yOkunus) && yOkunus !== dogruOkunus) {
              yanlislar.push(yOkunus);
            }
          }
        }
        while (yanlislar.length < 3) {
          yanlislar.push(sayiOkunusTR(sayi + yanlislar.length + 10));
        }

        return {
          question: `${formatliSayi} sayısının okunuşu aşağıdakilerden hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] tracking-wider">
                ${formatliSayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Yukarıda verilen <span class="text-amber-300 font-black">${formatliSayi}</span> sayısının <span class="text-cyan-300 underline decoration-cyan-400 font-black">doğru okunuşu</span> hangisidir?
              </div>
            </div>
          `,
          correct: dogruOkunus,
          wrong: yanlislar,
          isLong: true
        };
      } else {
        // Okunuşu verilip sayısı sorulur
        const sayi = Math.floor(Math.random() * 890000) + 10000;
        const okunus = sayiOkunusTR(sayi);
        const formatliDogru = sayi.toLocaleString('tr-TR');

        const yanlislar: string[] = [];
        const sapmalar = [-1000, 1000, -100, 100, -10, 10, -500, 500];
        for (const s of sapmalar.sort(() => 0.5 - Math.random())) {
          const y = sayi + s;
          if (y > 0 && y !== sayi && !yanlislar.includes(y.toLocaleString('tr-TR'))) {
            yanlislar.push(y.toLocaleString('tr-TR'));
            if (yanlislar.length === 3) break;
          }
        }

        return {
          question: `"${okunus}" okunuşuna sahip doğal sayı hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2.5 sm:px-7 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-lg sm:text-xl md:text-2xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] max-w-xl">
                "${okunus}"
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Okunuşu verilen sayının <span class="text-amber-300 font-black">rakamla yazılışı</span> hangisidir?
              </div>
            </div>
          `,
          correct: formatliDogru,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 1.2 Basamak Değerleri ve Çözümleme
  g4_basamak_ve_cozumleme: {
    title: "Basamak Değeri ve Çözümleme",
    desc: "4-6 basamaklı sayılarda basamak/bölük değerleri ve çözümleme işlemleri.",
    generate: () => {
      const mode = Math.random();
      const sayi = Math.floor(Math.random() * 890000) + 10000;
      const strSayi = sayi.toString();
      const formatliSayi = sayi.toLocaleString('tr-TR');

      if (mode < 0.5) {
        // Belirli bir basamağın basamak değeri sorulur
        const basamakAdlari = ["birler", "onlar", "yüzler", "binler", "on binler", "yüz binler"];
        const indexFromRight = Math.floor(Math.random() * strSayi.length); // 0 = birler, 1 = onlar...
        const basamakAdi = basamakAdlari[indexFromRight];
        const rakam = parseInt(strSayi[strSayi.length - 1 - indexFromRight]);
        const basamakDegeri = rakam * Math.pow(10, indexFromRight);

        const yanlislar: string[] = [];
        if (rakam === 0) {
          // 0 rakamının basamak değeri her zaman 0'dır
          // Çeldirici olarak basamak katları (örn: 10.000, 100.000, 1.000) ve diğer makul seçenekler
          const p10 = Math.pow(10, indexFromRight);
          const candidates = [p10, p10 * 10, Math.max(1, Math.floor(p10 / 10)), 10, 100, 1000, 10000, 100000]
            .filter(v => v !== basamakDegeri)
            .map(v => v.toLocaleString('tr-TR'));
          for (const cand of candidates.sort(() => 0.5 - Math.random())) {
            if (!yanlislar.includes(cand) && cand !== basamakDegeri.toLocaleString('tr-TR')) {
              yanlislar.push(cand);
              if (yanlislar.length === 3) break;
            }
          }
        } else {
          const carpanlar = [1, 10, 100, 1000, 10000, 100000].filter(c => c !== Math.pow(10, indexFromRight));
          for (const c of carpanlar.sort(() => 0.5 - Math.random())) {
            const y = (rakam * c).toLocaleString('tr-TR');
            if (!yanlislar.includes(y) && y !== basamakDegeri.toLocaleString('tr-TR')) {
              yanlislar.push(y);
              if (yanlislar.length === 3) break;
            }
          }
        }

        // Güvenlik yedeği: Her durumda tam 3 adet farklı yanlış seçenek olmasını garanti et
        let fallbackCarpan = 10;
        while (yanlislar.length < 3) {
          const cand = fallbackCarpan.toLocaleString('tr-TR');
          if (cand !== basamakDegeri.toLocaleString('tr-TR') && !yanlislar.includes(cand)) {
            yanlislar.push(cand);
          }
          fallbackCarpan = fallbackCarpan * 10;
          if (fallbackCarpan > 1000000) fallbackCarpan = fallbackCarpan + 17;
        }

        return {
          question: `${formatliSayi} sayısındaki ${basamakAdi} basamağının basamak değeri kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${formatliSayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu sayıdaki <span class="text-amber-300 font-black">${basamakAdi} basamağının</span> <span class="underline decoration-amber-400">basamak değeri</span> kaçtır?
              </div>
            </div>
          `,
          correct: basamakDegeri.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // Çözümleme sorusu (yüz binlik, on binlik, binlik, yüzlük vb.)
        const is6Digit = sayi >= 100000;
        const yuzbinler = Math.floor(sayi / 100000);
        const onbinler = Math.floor((sayi % 100000) / 10000);
        const binler = Math.floor((sayi % 10000) / 1000);
        const yuzler = Math.floor((sayi % 1000) / 100);
        const onlar = Math.floor((sayi % 100) / 10);
        const birler = sayi % 10;

        const formatCozumleme = (yb: number, ob: number, bn: number, y: number, o: number, br: number) => {
          return `${is6Digit ? `${yb} yüz binlik + ` : ''}${ob} on binlik + ${bn} binlik + ${y} yüzlük + ${o} onluk + ${br} birlik`;
        };

        const dogruCozumleme = formatCozumleme(yuzbinler, onbinler, binler, yuzler, onlar, birler);

        const yanlislar: string[] = [];
        const adaylar = [
          formatCozumleme(is6Digit ? (yuzbinler === 9 ? 8 : yuzbinler + 1) : yuzbinler, (onbinler + 1) % 10, binler, yuzler, onlar, birler),
          formatCozumleme(yuzbinler, (onbinler + 1) % 10, binler, yuzler, onlar, birler),
          formatCozumleme(yuzbinler, onbinler, (binler + 1) % 10, yuzler, onlar, birler),
          formatCozumleme(yuzbinler, onbinler, binler, (yuzler + 2) % 10, onlar, birler),
          formatCozumleme(yuzbinler, onbinler, binler, yuzler, (onlar + 3) % 10, birler),
          formatCozumleme(yuzbinler, onbinler, binler, yuzler, onlar, (birler + 2) % 10),
          formatCozumleme(yuzbinler, (onbinler + 2) % 10, binler, (yuzler + 1) % 10, onlar, birler),
          formatCozumleme(yuzbinler, onbinler, (binler + 2) % 10, yuzler, (onlar + 1) % 10, birler)
        ];

        for (const aday of adaylar) {
          if (aday !== dogruCozumleme && !yanlislar.includes(aday)) {
            yanlislar.push(aday);
            if (yanlislar.length === 3) break;
          }
        }

        let delta = 1;
        while (yanlislar.length < 3) {
          const fallback = formatCozumleme(
            is6Digit ? (yuzbinler + delta) % 9 + 1 : 0,
            (onbinler + delta) % 10,
            (binler + delta) % 10,
            (yuzler + delta) % 10,
            (onlar + delta) % 10,
            (birler + delta) % 10
          );
          if (fallback !== dogruCozumleme && !yanlislar.includes(fallback)) {
            yanlislar.push(fallback);
          }
          delta++;
        }

        return {
          question: `${formatliSayi} sayısının basamaklarına göre çözümlenmiş hali hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${formatliSayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Yukarıdaki sayının <span class="text-cyan-300 underline decoration-cyan-400 font-black">doğru çözümlenmiş hali</span> hangisidir?
              </div>
            </div>
          `,
          correct: dogruCozumleme,
          wrong: yanlislar,
          isLong: true
        };
      }
    }
  },

  // 1.3 Doğal Sayıları Sıralama ve Karşılaştırma
  g4_sayi_siralama: {
    title: "Doğal Sayıları Sıralama",
    desc: "4 ve 5 basamaklı sayıları büyükten küçüğe veya küçükten büyüğe sıralama.",
    generate: () => {
      // Sayılar tam yüzlük olacak (yüzden küçük basamak yok: onlar ve birler 00).
      // Örnek: 23.600, 24.500 gibi net, kafa karıştırmayan yüzlükler.
      const isFiveDigit = Math.random() < 0.85;
      const baseThousands = isFiveDigit
        ? Math.floor(Math.random() * 70) + 15 // 15 .. 84 (örn: 23 -> 23.000)
        : Math.floor(Math.random() * 6) + 3;  // 3 .. 8 (örn: 4 -> 4.000)

      // 4 farklı yüzlük adımı seç (her biri 100'ün tam katı)
      const hundredSteps = new Set<number>();
      while (hundredSteps.size < 4) {
        // 1 ile 25 arası çarpan (100 ile 2500 arası farklar oluşturur)
        hundredSteps.add(Math.floor(Math.random() * 25) + 1);
      }
      const sortedSteps = Array.from(hundredSteps).sort((a, b) => a - b);
      const sayilar = sortedSteps.map(step => (baseThousands * 1000) + (step * 100));

      // Karışık sıra
      const karisik = [...sayilar].sort(() => 0.5 - Math.random());
      const buyuktenKucuge = Math.random() < 0.5;
      const op = buyuktenKucuge ? ' > ' : ' < ';

      // Doğru sıralanış
      const dogruSira = [...sayilar]
        .sort((a, b) => (buyuktenKucuge ? b - a : a - b))
        .map(n => n.toLocaleString('tr-TR'))
        .join(op);

      // Yanlış sıralamalar (öğrenci yanılgıları)
      const yanlisSet = new Set<string>();

      // 1. Tam tersi yön (küçükten büyüğe yerine büyükten küçüğe veya tersi)
      const tersSira = [...sayilar]
        .sort((a, b) => (buyuktenKucuge ? a - b : b - a))
        .map(n => n.toLocaleString('tr-TR'))
        .join(op);
      if (tersSira !== dogruSira) yanlisSet.add(tersSira);

      // 2. Ortadaki veya sondaki iki sayının yer değiştirdiği sıralama
      const sortedAscDesc = [...sayilar].sort((a, b) => (buyuktenKucuge ? b - a : a - b));
      const swappedLast = [sortedAscDesc[0], sortedAscDesc[1], sortedAscDesc[3], sortedAscDesc[2]]
        .map(n => n.toLocaleString('tr-TR'))
        .join(op);
      if (swappedLast !== dogruSira) yanlisSet.add(swappedLast);

      const swappedFirst = [sortedAscDesc[1], sortedAscDesc[0], sortedAscDesc[2], sortedAscDesc[3]]
        .map(n => n.toLocaleString('tr-TR'))
        .join(op);
      if (swappedFirst !== dogruSira) yanlisSet.add(swappedFirst);

      // Rastgele karıştırmalarla 3 yanlışı tamamla
      let attempts = 0;
      while (yanlisSet.size < 3 && attempts < 50) {
        attempts++;
        const shuffled = [...sayilar].sort(() => 0.5 - Math.random()).map(n => n.toLocaleString('tr-TR')).join(op);
        if (shuffled !== dogruSira) {
          yanlisSet.add(shuffled);
        }
      }

      return {
        question: `${karisik.map(n => n.toLocaleString('tr-TR')).join(', ')} sayılarının ${buyuktenKucuge ? 'büyükten küçüğe' : 'küçükten büyüğe'} doğru sıralanışı hangisidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
            <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-full my-1 px-1">
              ${karisik.map(n => `
                <span class="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-900/90 border-2 border-amber-400 text-amber-300 font-black text-xs sm:text-base md:text-lg shadow-md shrink-0 whitespace-nowrap">
                  ${n.toLocaleString('tr-TR')}
                </span>
              `).join('')}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Sayıların <span class="text-cyan-300 underline decoration-cyan-400 font-black">${buyuktenKucuge ? 'BÜYÜKTEN KÜÇÜĞE' : 'KÜÇÜKTEN BÜYÜĞE'}</span> doğru sıralanışı hangisidir?
            </div>
          </div>
        `,
        correct: dogruSira,
        wrong: Array.from(yanlisSet).slice(0, 3),
        isLong: true
      };
    }
  },

  // 1.4 En Yakın Onluğa ve Yüzlüğe Yuvarlama (10 000'e Kadar)
  g4_en_yakin_onluk_yuzluk: {
    title: "En Yakın Onluğa ve Yüzlüğe Yuvarlama",
    desc: "4 basamaklı sayıları en yakın onluğa veya yüzlüğe yuvarlama alıştırmaları.",
    generate: () => {
      const mode = Math.random();
      const binler = Math.floor(Math.random() * 8) + 1; // 1..8
      const yuzler = Math.floor(Math.random() * 9) + 1;
      const onlar = Math.floor(Math.random() * 9) + 1;
      const birler = Math.floor(Math.random() * 9) + 1; // 1..9 (0 hariç)
      const sayi = binler * 1000 + yuzler * 100 + onlar * 10 + birler;

      if (mode < 0.5) {
        // En yakın onluğa yuvarlama
        const dogru = birler >= 5 ? Math.ceil(sayi / 10) * 10 : Math.floor(sayi / 10) * 10;
        const adaylar = [dogru - 10, dogru + 10, dogru + 20, dogru - 20, dogru + 30, dogru + 40];
        const yanlisSet = new Set<number>();
        for (const a of adaylar) {
          if (a > 0 && a !== dogru) {
            yanlisSet.add(a);
            if (yanlisSet.size === 3) break;
          }
        }
        let off = 10;
        while (yanlisSet.size < 3) {
          off += 10;
          if (dogru + off !== dogru) yanlisSet.add(dogru + off);
        }
        const yanlislar = Array.from(yanlisSet).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

        return {
          question: `${sayi.toLocaleString('tr-TR')} sayısı en yakın onluğa yuvarlandığında hangi sayı elde edilir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-md">
                <span class="text-white">${sayi.toLocaleString('tr-TR')}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${sayi.toLocaleString('tr-TR')}</span> sayısı <span class="text-cyan-300 underline decoration-cyan-400 font-black">en yakın onluğa</span> yuvarlandığında kaç olur?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // En yakın yüzlüğe yuvarlama
        const sonIki = sayi % 100;
        const dogru = sonIki >= 50 ? Math.ceil(sayi / 100) * 100 : Math.floor(sayi / 100) * 100;
        const adaylar = [dogru - 100, dogru + 100, dogru + 200, dogru - 200, dogru + 300, dogru + 400];
        const yanlisSet = new Set<number>();
        for (const a of adaylar) {
          if (a > 0 && a !== dogru) {
            yanlisSet.add(a);
            if (yanlisSet.size === 3) break;
          }
        }
        let off = 100;
        while (yanlisSet.size < 3) {
          off += 100;
          if (dogru + off !== dogru) yanlisSet.add(dogru + off);
        }
        const yanlislar = Array.from(yanlisSet).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

        return {
          question: `${sayi.toLocaleString('tr-TR')} sayısı en yakın yüzlüğe yuvarlandığında hangi sayı elde edilir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-md">
                <span class="text-white">${sayi.toLocaleString('tr-TR')}</span> <span class="text-amber-300 mx-1">=</span> <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                <span class="text-amber-300 font-black">${sayi.toLocaleString('tr-TR')}</span> sayısı <span class="text-yellow-300 underline decoration-yellow-400 font-black">en yakın yüzlüğe</span> yuvarlandığında kaç olur?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 1.5 10 000'e Kadar Yüzer ve Biner Ritmik Sayma
  g4_ritmik_yuzer_biner: {
    title: "Yüzer ve Biner Ritmik Sayma",
    desc: "10 000'e kadar yüzer ve biner ileri/geri ritmik sayma zincirlerindeki boşlukları tamamlama.",
    generate: () => {
      const isBiner = Math.random() < 0.5;
      const step = isBiner ? 1000 : 100;
      const baslangic = isBiner 
        ? (Math.floor(Math.random() * 5) + 1) * 1000 
        : (Math.floor(Math.random() * 40) + 10) * 100;

      const dizi = [baslangic, baslangic + step, baslangic + step * 2, baslangic + step * 3, baslangic + step * 4];
      const boslukIndex = Math.floor(Math.random() * 3) + 1; // 1, 2 veya 3. eleman
      const dogruCevap = dizi[boslukIndex];

      const sequenceHTML = dizi.map((val, idx) => {
        if (idx === boslukIndex) {
          return `<div class="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-white text-white font-black flex items-center justify-center shadow-md text-sm xs:text-base sm:text-lg shrink-0 select-none">?</div>`;
        }
        return `<div class="px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-b from-[#16233b] to-[#0c1424] border-2 border-slate-600 text-white font-black text-xs xs:text-sm sm:text-base shadow-sm shrink-0 text-center">${val.toLocaleString('tr-TR')}</div>`;
      }).join('');

      const adaylar = [
        dogruCevap + step,
        dogruCevap - step,
        dogruCevap + (step * 2),
        dogruCevap - (step * 2),
        dogruCevap + (step * 3)
      ];
      const yanlisSet = new Set<number>();
      for (const a of adaylar) {
        if (a > 0 && a !== dogruCevap) {
          yanlisSet.add(a);
          if (yanlisSet.size === 3) break;
        }
      }
      let off = step;
      while (yanlisSet.size < 3) {
        off += step;
        if (dogruCevap + off !== dogruCevap) yanlisSet.add(dogruCevap + off);
      }
      const yanlislar = Array.from(yanlisSet).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

      return {
        question: `Ritmik sayma zincirinde soru işareti (❓) yerine hangi sayı gelmelidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
            <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
              ${sequenceHTML}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Ritmik saymada <span class="text-cyan-300 font-black">❓</span> yerine hangi sayı gelmelidir?
            </div>
          </div>
        `,
        correct: dogruCevap.toLocaleString('tr-TR'),
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // 1.6 Sayı ve Şekil Örüntüleri
  g4_sayi_sekil_oruntuleri: {
    title: "Sayı ve Şekil Örüntüleri",
    desc: "Artan ve azalan sayı örüntülerinin kuralını bulma ve verilmeyen adımı belirleme.",
    generate: () => {
      const artis = (Math.floor(Math.random() * 8) + 3) * (Math.random() < 0.3 ? 10 : 1);
      const baslangic = Math.floor(Math.random() * 50) + 10;
      const dizi = [
        baslangic,
        baslangic + artis,
        baslangic + artis * 2,
        baslangic + artis * 3,
        baslangic + artis * 4
      ];
      const boslukIndex = Math.floor(Math.random() * 3) + 1;
      const dogru = dizi[boslukIndex];

      const sequenceHTML = dizi.map((val, idx) => {
        if (idx === boslukIndex) {
          return `<div class="min-w-[44px] xs:min-w-[52px] sm:min-w-[60px] h-10 xs:h-12 sm:h-14 px-2 rounded-xl bg-gradient-to-tr from-[#1a2842] to-[#121c2e] border-2 border-white text-white font-black flex items-center justify-center shadow-lg text-lg xs:text-xl sm:text-2xl shrink-0 whitespace-nowrap select-none">?</div>`;
        }
        return `<div class="min-w-[44px] xs:min-w-[52px] sm:min-w-[60px] h-10 xs:h-12 sm:h-14 px-2.5 xs:px-3.5 rounded-xl bg-gradient-to-b from-[#16233b] to-[#0c1424] border-2 border-slate-600 text-white font-black text-sm xs:text-base sm:text-lg shadow-lg flex items-center justify-center shrink-0 whitespace-nowrap">${val}</div>`;
      }).join('');

      const adaylar = [dogru + artis, dogru - artis, dogru + artis * 2, dogru - 1, dogru + 2, dogru - artis * 2];
      const yanlisSet = new Set<number>();
      for (const a of adaylar) {
        if (a > 0 && a !== dogru) {
          yanlisSet.add(a);
          if (yanlisSet.size === 3) break;
        }
      }
      let off = 1;
      while (yanlisSet.size < 3) {
        off++;
        if (dogru + off !== dogru) yanlisSet.add(dogru + off);
      }
      const yanlislar = Array.from(yanlisSet).slice(0, 3);

      return {
        question: `Örüntüde soru işareti yerine hangi sayı gelmelidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-0.5 text-center">
            <div class="oruntu-sequence-container flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-3 flex-nowrap whitespace-nowrap max-w-full my-1 overflow-visible">
              ${sequenceHTML}
            </div>
            <div class="oruntu-soru-metni text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Verilen sayı örüntüsünde <span class="text-amber-300 font-black">❓</span> yerine hangi sayı gelmelidir?
            </div>
          </div>
        `,
        correct: dogru,
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // ==========================================
  // TEMA 2: SAYILAR VE NİCELİKLER (2)
  // ==========================================

  // 2.1 Kesir Çeşitleri ve Modelleme
  g4_kesir_cesitleri_modelleme: {
    title: "Kesir Çeşitleri (Basit, Bileşik, Tam)",
    desc: "Basit kesir, bileşik kesir ve tam sayılı kesir kavramlarını ayırt etme.",
    generate: () => {
      const turSecim = Math.random();
      if (turSecim < 0.35) {
        // Basit Kesir
        const payda = Math.floor(Math.random() * 8) + 3; // 3..10
        const pay = Math.floor(Math.random() * (payda - 1)) + 1; // 1..(payda-1)
        return {
          question: "Kesrin türü hangisidir?",
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex flex-col items-center px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                <span>${pay}</span>
                <div class="w-10 h-0.5 bg-white my-0.5"></div>
                <span>${payda}</span>
              </div>
              <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Kesrin türü hangisidir?
              </div>
            </div>
          `,
          correct: "Basit Kesir",
          wrong: ["Bileşik Kesir", "Tam Sayılı Kesir", "Birim Kesir"],
          isLong: false
        };
      } else if (turSecim < 0.7) {
        // Bileşik Kesir
        const payda = Math.floor(Math.random() * 6) + 2; // 2..7
        const pay = payda + Math.floor(Math.random() * 5) + 1; // pay > payda
        return {
          question: "Kesrin türü hangisidir?",
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex flex-col items-center px-6 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                <span>${pay}</span>
                <div class="w-10 h-0.5 bg-white my-0.5"></div>
                <span>${payda}</span>
              </div>
              <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Kesrin türü hangisidir?
              </div>
            </div>
          `,
          correct: "Bileşik Kesir",
          wrong: ["Basit Kesir", "Tam Sayılı Kesir", "Birim Kesir"],
          isLong: false
        };
      } else {
        // Tam Sayılı Kesir
        const tam = Math.floor(Math.random() * 3) + 1; // 1..3
        const payda = Math.floor(Math.random() * 6) + 3;
        const pay = Math.floor(Math.random() * (payda - 1)) + 1;
        return {
          question: "Kesrin türü hangisidir?",
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                <span class="text-3xl sm:text-4xl text-amber-300">${tam}</span>
                <div class="flex flex-col items-center text-xl sm:text-2xl">
                  <span>${pay}</span>
                  <div class="w-8 h-0.5 bg-white my-0.5"></div>
                  <span>${payda}</span>
                </div>
              </div>
              <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Kesrin türü hangisidir?
              </div>
            </div>
          `,
          correct: "Tam Sayılı Kesir",
          wrong: ["Basit Kesir", "Bileşik Kesir", "Birim Kesir"],
          isLong: false
        };
      }
    }
  },

  // 2.2 Birim Kesirleri Karşılaştırma
  g4_birim_kesirler_karsilastirma: {
    title: "Birim Kesirleri Karşılaştırma",
    desc: "Payı 1 olan birim kesirlerin büyüklüklerini paydalarına bakarak karşılaştırma.",
    generate: () => {
      const p1 = Math.floor(Math.random() * 8) + 2; // 2..9
      let p2 = Math.floor(Math.random() * 8) + 2;
      while (p2 === p1) {
        p2 = Math.floor(Math.random() * 8) + 2;
      }

      // Kural: Paydası küçük olan birim kesir DAHA BÜYÜKTÜR!
      const buyukOlan = p1 < p2 ? `1/${p1}` : `1/${p2}`;
      const kucukOlan = p1 < p2 ? `1/${p2}` : `1/${p1}`;
      const soruTipiBuyuk = Math.random() < 0.5;

      return {
        question: soruTipiBuyuk ? 'Hangisi daha büyüktür?' : 'Hangisi daha küçüktür?',
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="flex items-center justify-center gap-4 sm:gap-6 px-6 py-2.5 rounded-2xl bg-slate-900/90 text-white font-black border-2 border-amber-400 shadow-md">
              <div class="flex flex-col items-center justify-center text-cyan-300">
                <span class="text-2xl sm:text-3xl font-black leading-none">1</span>
                <div class="w-8 sm:w-10 h-0.5 bg-cyan-300 my-1"></div>
                <span class="text-2xl sm:text-3xl font-black leading-none">${p1}</span>
              </div>
              <span class="text-amber-400 text-2xl sm:text-3xl">❓</span>
              <div class="flex flex-col items-center justify-center text-pink-300">
                <span class="text-2xl sm:text-3xl font-black leading-none">1</span>
                <div class="w-8 sm:w-10 h-0.5 bg-pink-300 my-1"></div>
                <span class="text-2xl sm:text-3xl font-black leading-none">${p2}</span>
              </div>
            </div>
            <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              ${soruTipiBuyuk ? 'Hangisi daha büyüktür?' : 'Hangisi daha küçüktür?'}
            </div>
          </div>
        `,
        correct: soruTipiBuyuk ? buyukOlan : kucukOlan,
        wrong: [
          soruTipiBuyuk ? kucukOlan : buyukOlan,
          `İkisi de eşittir`,
          `1/${p1 + p2}`
        ],
        isLong: false
      };
    }
  },

  // 2.3 Paydaları Eşit Kesirlerle İşlemler
  g4_paydalari_esit_kesir_islemleri: {
    title: "Paydaları Eşit Kesirlerle İşlemler",
    desc: "Paydaları eşit kesirlerle toplama ve çıkarma işlemleri.",
    generate: () => {
      const isToplama = Math.random() < 0.5;
      const payda = Math.floor(Math.random() * 8) + 4; // 4..11

      if (isToplama) {
        const pay1 = Math.floor(Math.random() * (payda - 2)) + 1;
        const pay2 = Math.floor(Math.random() * (payda - pay1)) + 1;
        const sonucPay = pay1 + pay2;

        const yanlislar = [
          `${sonucPay + 1}/${payda}`,
          `${sonucPay - 1 > 0 ? sonucPay - 1 : sonucPay + 2}/${payda}`,
          `${sonucPay}/${payda * 2}`
        ];

        return {
          question: "İşlemin sonucu kaçtır?",
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center gap-3 sm:gap-4 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-black leading-none">${pay1}</span>
                  <div class="w-8 sm:w-10 h-0.5 bg-white my-1"></div>
                  <span class="text-2xl sm:text-3xl font-black leading-none">${payda}</span>
                </div>
                <span class="text-amber-300 text-2xl sm:text-3xl font-black">+</span>
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-black leading-none">${pay2}</span>
                  <div class="w-8 sm:w-10 h-0.5 bg-white my-1"></div>
                  <span class="text-2xl sm:text-3xl font-black leading-none">${payda}</span>
                </div>
                <span class="text-amber-300 text-2xl sm:text-3xl font-black">=</span>
                <span class="text-yellow-300 font-black text-2xl sm:text-3xl">?</span>
              </div>
              <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                İşlemin sonucu kaçtır?
              </div>
            </div>
          `,
          correct: `${sonucPay}/${payda}`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        const pay1 = Math.floor(Math.random() * (payda - 2)) + 3;
        const pay2 = Math.floor(Math.random() * (pay1 - 1)) + 1;
        const sonucPay = pay1 - pay2;

        const yanlislar = [
          `${sonucPay + 1}/${payda}`,
          `${sonucPay - 1 > 0 ? sonucPay - 1 : sonucPay + 2}/${payda}`,
          `${sonucPay}/${payda * 2}`
        ];

        return {
          question: "İşlemin sonucu kaçtır?",
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center gap-3 sm:gap-4 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-pink-700 text-white font-black border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-black leading-none">${pay1}</span>
                  <div class="w-8 sm:w-10 h-0.5 bg-white my-1"></div>
                  <span class="text-2xl sm:text-3xl font-black leading-none">${payda}</span>
                </div>
                <span class="text-amber-300 text-2xl sm:text-3xl font-black">-</span>
                <div class="flex flex-col items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-black leading-none">${pay2}</span>
                  <div class="w-8 sm:w-10 h-0.5 bg-white my-1"></div>
                  <span class="text-2xl sm:text-3xl font-black leading-none">${payda}</span>
                </div>
                <span class="text-amber-300 text-2xl sm:text-3xl font-black">=</span>
                <span class="text-yellow-300 font-black text-2xl sm:text-3xl">?</span>
              </div>
              <div class="text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                İşlemin sonucu kaçtır?
              </div>
            </div>
          `,
          correct: `${sonucPay}/${payda}`,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 2.4 Uzunluk Ölçüleri Dönüşümü (m, cm, mm, km)
  g4_uzunluk_olculeri_donusum: {
    title: "Uzunluk Ölçüleri Dönüşümü",
    desc: "Metre, santimetre, milimetre ve kilometre arasındaki dönüşüm alıştırmaları.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.35) {
        // km -> m
        const km = Math.floor(Math.random() * 8) + 2;
        const m = Math.floor(Math.random() * 800) + 50;
        const toplamM = km * 1000 + m;

        const yanlislar = [
          (toplamM + 100).toLocaleString('tr-TR') + ' m',
          (toplamM - 100).toLocaleString('tr-TR') + ' m',
          (km * 100 + m).toLocaleString('tr-TR') + ' m'
        ];

        return {
          question: `${km} km ${m} m kaç metredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${km} km ${m} m = ? m
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen uzunluk <span class="text-amber-300 underline decoration-amber-400 font-black">kaç metredir</span>?
              </div>
            </div>
          `,
          correct: `${toplamM.toLocaleString('tr-TR')} m`,
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode < 0.7) {
        // m -> cm
        const m = Math.floor(Math.random() * 8) + 2;
        const cm = Math.floor(Math.random() * 80) + 10;
        const toplamCm = m * 100 + cm;

        const yanlislar = [
          `${toplamCm + 10} cm`,
          `${toplamCm - 10} cm`,
          `${m * 1000 + cm} cm`
        ];

        return {
          question: `${m} m ${cm} cm kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${m} m ${cm} cm = ? cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen uzunluk <span class="text-amber-300 underline decoration-amber-400 font-black">kaç santimetredir</span>?
              </div>
            </div>
          `,
          correct: `${toplamCm} cm`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // cm -> mm
        const cm = Math.floor(Math.random() * 20) + 5;
        const mm = Math.floor(Math.random() * 8) + 1;
        const toplamMm = cm * 10 + mm;

        const yanlislar = [
          `${toplamMm + 10} mm`,
          `${toplamMm - 5} mm`,
          `${cm * 100 + mm} mm`
        ];

        return {
          question: `${cm} cm ${mm} mm kaç milimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${cm} cm ${mm} mm = ? mm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen uzunluk <span class="text-cyan-300 underline decoration-cyan-400 font-black">kaç milimetredir</span>?
              </div>
            </div>
          `,
          correct: `${toplamMm} mm`,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 2.5 Kütle Ölçüleri (Ton, kg, g)
  g4_kutle_olculeri_ton_kg_g: {
    title: "Kütle Ölçüleri (Ton, kg, g)",
    desc: "Ton, kilogram ve gram arasındaki ilişkiler ve kütle problemleri.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        // ton -> kg
        const ton = Math.floor(Math.random() * 6) + 2;
        const kg = Math.floor(Math.random() * 700) + 100;
        const toplamKg = ton * 1000 + kg;

        const yanlislar = [
          (toplamKg + 100).toLocaleString('tr-TR') + ' kg',
          (toplamKg - 100).toLocaleString('tr-TR') + ' kg',
          (ton * 100 + kg).toLocaleString('tr-TR') + ' kg'
        ];

        return {
          question: `${ton} ton ${kg} kg kaç kilogramdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${ton} ton ${kg} kg = ? kg
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen kütle <span class="text-amber-300 underline decoration-amber-400 font-black">kaç kilogramdır</span>?
              </div>
            </div>
          `,
          correct: `${toplamKg.toLocaleString('tr-TR')} kg`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // kg -> g
        const kg = Math.floor(Math.random() * 6) + 2;
        const g = Math.floor(Math.random() * 700) + 100;
        const toplamG = kg * 1000 + g;

        const yanlislar = [
          (toplamG + 100).toLocaleString('tr-TR') + ' g',
          (toplamG - 100).toLocaleString('tr-TR') + ' g',
          (kg * 100 + g).toLocaleString('tr-TR') + ' g'
        ];

        return {
          question: `${kg} kg ${g} g kaç gramdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${kg} kg ${g} g = ? g
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen kütle <span class="text-cyan-300 underline decoration-cyan-400 font-black">kaç gramdır</span>?
              </div>
            </div>
          `,
          correct: `${toplamG.toLocaleString('tr-TR')} g`,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // ==========================================
  // TEMA 3: İŞLEMLERDEN CEBİRSEL DÜŞÜNMEYE
  // ==========================================

  // 3.1 4-5 Basamaklı Toplama ve Çıkarma
  g4_dort_islem_toplama_cikarma: {
    title: "4-5 Basamaklı Toplama ve Çıkarma",
    desc: "Doğal sayılarla eldeli toplama ve onluk bozarak çıkarma işlemleri.",
    generate: () => {
      const isToplama = Math.random() < 0.5;

      if (isToplama) {
        const s1 = Math.floor(Math.random() * 4000) + 1200;
        const s2 = Math.floor(Math.random() * 4000) + 1100;
        const dogru = s1 + s2;
        const yanlislar = [dogru + 100, dogru - 100, dogru + 10].map(n => n.toLocaleString('tr-TR'));

        return {
          question: `${s1.toLocaleString('tr-TR')} + ${s2.toLocaleString('tr-TR')} işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${s1.toLocaleString('tr-TR')} + ${s2.toLocaleString('tr-TR')} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                İşlemin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else {
        const s1 = Math.floor(Math.random() * 5000) + 4000;
        const s2 = Math.floor(Math.random() * 3000) + 1000;
        const dogru = s1 - s2;
        const yanlislar = [dogru + 100, dogru - 100, dogru + 10].map(n => n.toLocaleString('tr-TR'));

        return {
          question: `${s1.toLocaleString('tr-TR')} - ${s2.toLocaleString('tr-TR')} işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${s1.toLocaleString('tr-TR')} - ${s2.toLocaleString('tr-TR')} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                İşlemin <span class="text-cyan-300 underline decoration-cyan-400 font-black">sonucu kaçtır</span>?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 3.2 3 Basamaklı Sayılarla Çarpma İşlemi (2. çarpan onluk)
  g4_carpma_islemi_3basamakli: {
    title: "Çarpma İşlemi (3 Basamaklı)",
    desc: "3 basamaklı sayılarla 2. çarpanı onluk (10, 20, 30... 90) olan çarpma işlemleri.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 400) + 110; // 3 basamaklı: 110..509
      const onluklar = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const s2 = onluklar[Math.floor(Math.random() * onluklar.length)]; // 2. çarpan kesinlikle onluk
      const dogru = s1 * s2;

      const altOnluk = s2 > 10 ? s2 - 10 : 20;
      const ustOnluk = s2 < 90 ? s2 + 10 : 80;
      const candidates = [
        s1 * altOnluk,
        s1 * ustOnluk,
        (s1 + 10) * s2,
        (s1 - 10) * s2,
        dogru + 100,
        dogru - 100,
        dogru + (s2 * 5),
        dogru - (s2 * 5)
      ];

      const wrongSet = new Set<string>();
      for (const val of candidates) {
        if (val > 0 && val !== dogru) {
          wrongSet.add(val.toLocaleString('tr-TR'));
          if (wrongSet.size === 3) break;
        }
      }
      let step = 100;
      while (wrongSet.size < 3) {
        const fallback = dogru + step;
        wrongSet.add(fallback.toLocaleString('tr-TR'));
        step += 100;
      }
      const yanlislar = Array.from(wrongSet);

      return {
        question: `${s1} x ${s2} çarpma işleminin sonucu kaçtır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
              ${s1} × ${s2} = ?
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              İşlemin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
            </div>
          </div>
        `,
        correct: dogru.toLocaleString('tr-TR'),
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // 3.3 En Çok İki Basamaklı Doğal Sayıları 5 ile Kısa Yoldan Çarpma
  g4_kisa_yoldan_carpma_5: {
    title: "5 ile Kısa Yoldan Çarpma",
    desc: "En çok iki basamaklı doğal sayıları 5 ile kısa yoldan çarpma (10 ile çarpıp 2'ye bölme).",
    generate: () => {
      const mode = Math.floor(Math.random() * 4);
      // İki basamaklı çift sayılar (kısa yoldan bölme kolaylığı için)
      const ciftSayilar = [12, 14, 16, 18, 22, 24, 26, 28, 32, 34, 36, 38, 42, 44, 46, 48, 52, 54, 56, 58, 62, 64, 66, 72, 74, 82, 84, 86, 92, 94];
      const sayi = ciftSayilar[Math.floor(Math.random() * ciftSayilar.length)];
      const dogru = sayi * 5;

      if (mode === 0) {
        // Doğrudan Kısa Yoldan Çarpma İşlemi
        const wrongSet = new Set<string>();
        wrongSet.add((sayi * 10).toLocaleString('tr-TR')); // 2'ye bölmeyi unutan
        wrongSet.add((dogru + 10).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 10).toLocaleString('tr-TR'));
        wrongSet.add((Math.floor(sayi / 2) * 5).toLocaleString('tr-TR'));
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 20).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 5 kısa yoldan çarpma işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${sayi} × 5 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                ${sayi} sayısını <span class="text-amber-300 underline decoration-amber-400 font-black">5 ile kısa yoldan çarptığımızda</span> sonuç kaçtır?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 1) {
        // Adım Tamamlama Sorusu (1. Adım -> 2. Adım)
        const subMode = Math.random() < 0.5;
        const adim1Sonuc = subMode ? sayi * 10 : sayi / 2;
        const sembol = subMode ? "★" : "▲";

        const wrongSet = new Set<string>();
        wrongSet.add(adim1Sonuc.toLocaleString('tr-TR'));
        wrongSet.add((dogru + 10).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 10).toLocaleString('tr-TR'));
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 15).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 5 kısa yoldan çarpma adımlarında ${sembol} yerine kaç gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border-2 border-amber-400/40 max-w-md w-full shadow-lg">
                <div class="text-xs sm:text-sm font-bold text-amber-300 mb-1">5 İle Kısa Yoldan Çarpma Adımları:</div>
                <div class="text-sm sm:text-base font-black text-white space-y-1">
                  <div>1. Adım: ${subMode ? `${sayi} × 10 = ${adim1Sonuc}` : `${sayi} ÷ 2 = ${adim1Sonuc}`}</div>
                  <div class="text-amber-300 font-extrabold text-base sm:text-lg">2. Adım: ${subMode ? `${adim1Sonuc} ÷ 2 = ${sembol}` : `${adim1Sonuc} × 10 = ${sembol}`}</div>
                </div>
              </div>
              <div class="text-base sm:text-lg font-black text-white text-center drop-shadow-md">
                <span class="text-amber-300 font-black">${sembol}</span> yerine hangi sayı gelmelidir?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 2) {
        // Kural ve Strateji Bilgisi
        return {
          question: `Bir doğal sayıyı 5 ile kısa yoldan çarpmak için hangi işlem sırası uygulanmalıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-md">
                ⚡ 5 ile Kısa Yoldan Çarpma Kuralı
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Bir sayıyı <span class="text-amber-300 underline font-black">5 ile kısa yoldan çarpmak için</span> hangisi yapılır?
              </div>
            </div>
          `,
          correct: "Sayıyı 10 ile çarpıp 2'ye bölmek",
          wrong: [
            "Sayıyı 2 ile çarpıp 10'a bölmek",
            "Sayıyı 100 ile çarpıp 4'e bölmek",
            "Sayıyı 5 ile toplayıp 2'ye bölmek"
          ],
          isLong: true
        };
      } else {
        // Matematiksel İfade / Eşdeğerlik Gösterimi
        const useDivFirst = Math.random() < 0.5;
        const dogruIfade = useDivFirst ? `(${sayi} ÷ 2) × 10` : `(${sayi} × 10) ÷ 2`;
        const yanlis1 = `(${sayi} × 2) ÷ 10`;
        const yanlis2 = `(${sayi} × 100) ÷ 2`;
        const yanlis3 = `(${sayi} ÷ 5) × 10`;

        return {
          question: `${sayi} × 5 işleminin kısa yoldan yapılışı aşağıdakilerden hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-slate-900/85 border-2 border-amber-400 text-white font-black text-2xl sm:text-3xl shadow-lg">
                ${sayi} × 5 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki işlemin <span class="text-amber-300 underline decoration-amber-400 font-black">kısa yoldan yapılışı</span> hangi seçenekte doğru verilmiştir?
              </div>
            </div>
          `,
          correct: dogruIfade,
          wrong: [yanlis1, yanlis2, yanlis3],
          isLong: false
        };
      }
    }
  },

  // 3.4 En Çok İki Basamaklı Doğal Sayıları 50 ile Kısa Yoldan Çarpma
  g4_kisa_yoldan_carpma_50: {
    title: "50 ile Kısa Yoldan Çarpma",
    desc: "En çok iki basamaklı doğal sayıları 50 ile kısa yoldan çarpma (100 ile çarpıp 2'ye bölme).",
    generate: () => {
      const mode = Math.floor(Math.random() * 4);
      // İki basamaklı çift sayılar
      const ciftSayilar = [12, 14, 16, 18, 22, 24, 26, 28, 32, 34, 36, 38, 42, 44, 46, 48, 52, 54, 56, 62, 64, 72, 76, 84];
      const sayi = ciftSayilar[Math.floor(Math.random() * ciftSayilar.length)];
      const dogru = sayi * 50;

      if (mode === 0) {
        // Doğrudan Kısa Yoldan Çarpma İşlemi
        const wrongSet = new Set<string>();
        wrongSet.add((sayi * 100).toLocaleString('tr-TR')); // 2'ye bölmeyen
        wrongSet.add((dogru + 100).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 100).toLocaleString('tr-TR'));
        wrongSet.add(((sayi / 2) * 10).toLocaleString('tr-TR')); // 100 yerine 10 ile çarpan
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 200).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 50 kısa yoldan çarpma işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${sayi} × 50 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                ${sayi} sayısını <span class="text-cyan-300 underline decoration-cyan-400 font-black">50 ile kısa yoldan çarptığımızda</span> sonuç kaçtır?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 1) {
        // Adım Tamamlama Sorusu (1. Adım -> 2. Adım)
        const subMode = Math.random() < 0.5;
        const adim1Sonuc = subMode ? sayi * 100 : sayi / 2;
        const sembol = subMode ? "■" : "●";

        const wrongSet = new Set<string>();
        wrongSet.add(adim1Sonuc.toLocaleString('tr-TR'));
        wrongSet.add((dogru + 100).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 100).toLocaleString('tr-TR'));
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 150).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 50 kısa yoldan çarpma adımlarında ${sembol} yerine kaç gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border-2 border-teal-400/40 max-w-md w-full shadow-lg">
                <div class="text-xs sm:text-sm font-bold text-cyan-300 mb-1">50 İle Kısa Yoldan Çarpma Adımları:</div>
                <div class="text-sm sm:text-base font-black text-white space-y-1">
                  <div>1. Adım: ${subMode ? `${sayi} × 100 = ${adim1Sonuc}` : `${sayi} ÷ 2 = ${adim1Sonuc}`}</div>
                  <div class="text-cyan-300 font-extrabold text-base sm:text-lg">2. Adım: ${subMode ? `${adim1Sonuc} ÷ 2 = ${sembol}` : `${adim1Sonuc} × 100 = ${sembol}`}</div>
                </div>
              </div>
              <div class="text-base sm:text-lg font-black text-white text-center drop-shadow-md">
                <span class="text-cyan-300 font-black">${sembol}</span> yerine hangi sayı gelmelidir?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 2) {
        // Kural ve Strateji Bilgisi
        return {
          question: `Bir doğal sayıyı 50 ile kısa yoldan çarpmak için hangi kural uygulanmalıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-md">
                ⚡ 50 ile Kısa Yoldan Çarpma Kuralı
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Bir sayıyı <span class="text-cyan-300 underline font-black">50 ile kısa yoldan çarpmak için</span> hangisi yapılır?
              </div>
            </div>
          `,
          correct: "Sayıyı 100 ile çarpıp 2'ye bölmek",
          wrong: [
            "Sayıyı 10 ile çarpıp 5'e bölmek",
            "Sayıyı 100 ile çarpıp 4'e bölmek",
            "Sayıyı 50 ile toplayıp 2 ile çarpmak"
          ],
          isLong: true
        };
      } else {
        // Matematiksel İfade / Eşdeğerlik Gösterimi
        const useDivFirst = Math.random() < 0.5;
        const dogruIfade = useDivFirst ? `(${sayi} ÷ 2) × 100` : `(${sayi} × 100) ÷ 2`;
        const yanlis1 = `(${sayi} × 10) ÷ 2`;
        const yanlis2 = `(${sayi} × 100) ÷ 4`;
        const yanlis3 = `(${sayi} ÷ 50) × 100`;

        return {
          question: `${sayi} × 50 işleminin kısa yoldan yapılışı aşağıdakilerden hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-slate-900/85 border-2 border-cyan-400 text-white font-black text-2xl sm:text-3xl shadow-lg">
                ${sayi} × 50 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki işlemin <span class="text-cyan-300 underline decoration-cyan-400 font-black">kısa yoldan yapılışı</span> hangi seçenekte doğru verilmiştir?
              </div>
            </div>
          `,
          correct: dogruIfade,
          wrong: [yanlis1, yanlis2, yanlis3],
          isLong: false
        };
      }
    }
  },

  // 3.5 En Çok İki Basamaklı Doğal Sayıları 25 ile Kısa Yoldan Çarpma
  g4_kisa_yoldan_carpma_25: {
    title: "25 ile Kısa Yoldan Çarpma",
    desc: "En çok iki basamaklı doğal sayıları 25 ile kısa yoldan çarpma (100 ile çarpıp 4'e bölme).",
    generate: () => {
      const mode = Math.floor(Math.random() * 4);
      // İki basamaklı 4'ün katı sayılar
      const dordeBolunenler = [12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 84, 88, 96];
      const sayi = dordeBolunenler[Math.floor(Math.random() * dordeBolunenler.length)];
      const dogru = sayi * 25;

      if (mode === 0) {
        // Doğrudan Kısa Yoldan Çarpma İşlemi
        const wrongSet = new Set<string>();
        wrongSet.add((sayi * 50).toLocaleString('tr-TR')); // 50 ile çarpan
        wrongSet.add((dogru + 100).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 100).toLocaleString('tr-TR'));
        wrongSet.add(((sayi / 4) * 10).toLocaleString('tr-TR')); // 100 yerine 10 ile çarpan
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 200).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 25 kısa yoldan çarpma işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-800 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${sayi} × 25 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                ${sayi} sayısını <span class="text-amber-300 underline decoration-amber-400 font-black">25 ile kısa yoldan çarptığımızda</span> sonuç kaçtır?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 1) {
        // Adım Tamamlama Sorusu (1. Adım -> 2. Adım)
        const subMode = Math.random() < 0.5;
        const adim1Sonuc = subMode ? sayi * 100 : sayi / 4;
        const sembol = subMode ? "◆" : "★";

        const wrongSet = new Set<string>();
        wrongSet.add(adim1Sonuc.toLocaleString('tr-TR'));
        wrongSet.add((dogru + 100).toLocaleString('tr-TR'));
        wrongSet.add((dogru - 100).toLocaleString('tr-TR'));
        wrongSet.delete(dogru.toLocaleString('tr-TR'));
        const yanlislar = Array.from(wrongSet).slice(0, 3);
        while (yanlislar.length < 3) yanlislar.push((dogru + (yanlislar.length + 1) * 150).toLocaleString('tr-TR'));

        return {
          question: `${sayi} × 25 kısa yoldan çarpma adımlarında ${sembol} yerine kaç gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border-2 border-purple-400/40 max-w-md w-full shadow-lg">
                <div class="text-xs sm:text-sm font-bold text-purple-300 mb-1">25 İle Kısa Yoldan Çarpma Adımları:</div>
                <div class="text-sm sm:text-base font-black text-white space-y-1">
                  <div>1. Adım: ${subMode ? `${sayi} × 100 = ${adim1Sonuc}` : `${sayi} ÷ 4 = ${adim1Sonuc}`}</div>
                  <div class="text-amber-300 font-extrabold text-base sm:text-lg">2. Adım: ${subMode ? `${adim1Sonuc} ÷ 4 = ${sembol}` : `${adim1Sonuc} × 100 = ${sembol}`}</div>
                </div>
              </div>
              <div class="text-base sm:text-lg font-black text-white text-center drop-shadow-md">
                <span class="text-amber-300 font-black">${sembol}</span> yerine hangi sayı gelmelidir?
              </div>
            </div>
          `,
          correct: dogru.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode === 2) {
        // Kural ve Strateji Bilgisi
        return {
          question: `Bir doğal sayıyı 25 ile kısa yoldan çarpmak için hangi işlem sırası uygulanmalıdır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-md">
                ⚡ 25 ile Kısa Yoldan Çarpma Kuralı
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Bir sayıyı <span class="text-purple-300 underline font-black">25 ile kısa yoldan çarpmak için</span> hangisi yapılır?
              </div>
            </div>
          `,
          correct: "Sayıyı 100 ile çarpıp 4'e bölmek",
          wrong: [
            "Sayıyı 100 ile çarpıp 2'ye bölmek",
            "Sayıyı 10 ile çarpıp 4'e bölmek",
            "Sayıyı 25 ile toplayıp 4 ile çarpmak"
          ],
          isLong: true
        };
      } else {
        // Matematiksel İfade / Eşdeğerlik Gösterimi
        const useDivFirst = Math.random() < 0.5;
        const dogruIfade = useDivFirst ? `(${sayi} ÷ 4) × 100` : `(${sayi} × 100) ÷ 4`;
        const yanlis1 = `(${sayi} × 100) ÷ 2`;
        const yanlis2 = `(${sayi} × 10) ÷ 4`;
        const yanlis3 = `(${sayi} ÷ 25) × 100`;

        return {
          question: `${sayi} × 25 işleminin kısa yoldan yapılışı aşağıdakilerden hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-slate-900/85 border-2 border-purple-400 text-white font-black text-2xl sm:text-3xl shadow-lg">
                ${sayi} × 25 = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki işlemin <span class="text-purple-300 underline decoration-purple-400 font-black">kısa yoldan yapılışı</span> hangi seçenekte doğru verilmiştir?
              </div>
            </div>
          `,
          correct: dogruIfade,
          wrong: [yanlis1, yanlis2, yanlis3],
          isLong: false
        };
      }
    }
  },

  // 3.6 4 Basamağa Kadar Bölme İşlemi
  g4_bolme_islemi_4basamakli: {
    title: "Bölme İşlemi (4 Basamağa Kadar)",
    desc: "4 basamağa kadar sayıları bölme, kalan ve bölüm hesabı.",
    generate: () => {
      const bolen = Math.floor(Math.random() * 8) + 3; // 3..10
      const bolum = Math.floor(Math.random() * 300) + 50;
      const kalan = Math.floor(Math.random() * (bolen - 1));
      const bolunen = bolen * bolum + kalan;

      const yanlislar = [
        (bolum + 10).toLocaleString('tr-TR'),
        (bolum - 10).toLocaleString('tr-TR'),
        (bolum + 1).toLocaleString('tr-TR')
      ];

      return {
        question: `${bolunen.toLocaleString('tr-TR')} ÷ ${bolen} işleminde bölüm kaçtır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
              ${bolunen.toLocaleString('tr-TR')} ÷ ${bolen} = ?
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              Bölme işleminde <span class="text-cyan-300 underline decoration-cyan-400 font-black">bölüm kaçtır</span>?
            </div>
          </div>
        `,
        correct: bolum.toLocaleString('tr-TR'),
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // 3.4 10, 100, 1000 ile Zihinden İşlem ve Tahmin
  g4_zihinden_carpma_bolme_10_100_1000: {
    title: "10, 100, 1000 ile Zihinden İşlem",
    desc: "10, 100 ve 1000 ile kısa yoldan çarpma ve bölme işlemleri.",
    generate: () => {
      const isCarpma = Math.random() < 0.5;
      const carpan = [10, 100, 1000][Math.floor(Math.random() * 3)];

      if (isCarpma) {
        const sayi = Math.floor(Math.random() * 85) + 12;
        const sonuc = sayi * carpan;

        const yanlislar = [
          (sayi * (carpan === 10 ? 100 : carpan / 10)).toLocaleString('tr-TR'),
          (sonuc + carpan).toLocaleString('tr-TR'),
          (sonuc - carpan).toLocaleString('tr-TR')
        ];

        return {
          question: `${sayi} × ${carpan} zihinden çarpma işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${sayi} × ${carpan} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                İşlemin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
              </div>
            </div>
          `,
          correct: sonuc.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      } else {
        const sayi = (Math.floor(Math.random() * 45) + 5) * carpan;
        const sonuc = sayi / carpan;

        const yanlislar = [
          (sonuc * 10).toLocaleString('tr-TR'),
          (sonuc + 5).toLocaleString('tr-TR'),
          (sonuc - 2 > 0 ? sonuc - 2 : sonuc + 8).toLocaleString('tr-TR')
        ];

        return {
          question: `${sayi.toLocaleString('tr-TR')} ÷ ${carpan} zihinden bölme işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                ${sayi.toLocaleString('tr-TR')} ÷ ${carpan} = ?
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                İşlemin <span class="text-cyan-300 underline decoration-cyan-400 font-black">sonucu kaçtır</span>?
              </div>
            </div>
          `,
          correct: sonuc.toLocaleString('tr-TR'),
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 3.5 Matematiksel Eşitlik ve Verilmeyeni Bulma
  g4_esitlik_ve_verilmeyen_deger: {
    title: "Eşitlik ve Verilmeyen Değer",
    desc: "Matematiksel eşitlik durumlarında terazi dengesi mantığıyla verilmeyen sayıyı bulma.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.5) {
        // A + B = C + ?
        const a = Math.floor(Math.random() * 40) + 20;
        const b = Math.floor(Math.random() * 40) + 20;
        const solToplam = a + b;
        const c = Math.floor(Math.random() * 30) + 10;
        const bilinmeyen = solToplam - c;

        const yanlislar = [bilinmeyen + 10, bilinmeyen - 10, bilinmeyen + 5].filter(y => y !== bilinmeyen && y > 0);

        return {
          question: `${a} + ${b} = ${c} + 🔺 eşitliğinde 🔺 yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-md">
                ${a} + ${b} = ${c} + <span class="text-amber-300">🔺</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Eşitlikte <span class="text-amber-300 underline decoration-amber-400 font-black">🔺 yerine</span> hangi sayı gelmelidir?
              </div>
            </div>
          `,
          correct: bilinmeyen,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // A x B = C x ?
        const a = Math.floor(Math.random() * 6) + 4; // 4..9
        const b = Math.floor(Math.random() * 6) + 4; // 4..9
        const carpim = a * b;
        // Çarpımın böleni olan bir sayı seçelim
        const carpanlar: number[] = [];
        for (let i = 2; i <= 12; i++) {
          if (carpim % i === 0 && i !== a && i !== b) {
            carpanlar.push(i);
          }
        }
        const c = carpanlar.length > 0 ? carpanlar[Math.floor(Math.random() * carpanlar.length)] : 2;
        const bilinmeyen = carpim / c;

        const yanlislar = [bilinmeyen + 2, bilinmeyen - 2 > 0 ? bilinmeyen - 2 : bilinmeyen + 4, bilinmeyen + 5];

        return {
          question: `${a} × ${b} = ${c} × ⬛ eşitliğinde ⬛ yerine hangi sayı gelmelidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xl sm:text-2xl md:text-3xl border-2 border-white shadow-md">
                ${a} × ${b} = ${c} × <span class="text-yellow-300">⬛</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Eşitlikte <span class="text-yellow-300 underline decoration-yellow-400 font-black">⬛ yerine</span> hangi sayı gelmelidir?
              </div>
            </div>
          `,
          correct: bilinmeyen,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // ==========================================
  // TEMA 4: GEOMETRİ, VERİ VE OLASILIK
  // ==========================================

  // 4.1 Geometrik Cisimler ve Özellikleri
  g4_geometrik_cisimler: {
    title: "Geometrik Cisimler ve Özellikleri",
    desc: "Küp, kare prizma, dikdörtgenler prizması, silindir, koni ve kürenin özellikleri.",
    generate: () => {
      const cisimler = [
        { ad: "Küp", yuz: 6, ayrit: 12, kose: 8, ekstra: "Bütün yüzleri karedir.", img: "/geos/kups.png" },
        { ad: "Kare Prizma", yuz: 6, ayrit: 12, kose: 8, ekstra: "Tabanları kare, yan yüzleri dikdörtgendir.", img: "/geos/kareprz.png" },
        { ad: "Dikdörtgenler Prizması", yuz: 6, ayrit: 12, kose: 8, ekstra: "Tüm yüzleri dikdörtgendir.", img: "/geos/dikdprz.png" },
        { ad: "Üçgen Prizma", yuz: 5, ayrit: 9, kose: 6, ekstra: "2 üçgen ve 3 dikdörtgen yüzden oluşur.", img: "/geos/ucgenprz.png" },
        { ad: "Silindir", yuz: 3, ayrit: 0, kose: 0, ekstra: "Köşesi ve ayrıtı yoktur, 2 daire tabanı vardır.", img: "/geos/slndrs.png" },
        { ad: "Küre", yuz: 1, ayrit: 0, kose: 0, ekstra: "Köşesi ve ayrıtı yoktur, eğri bir yüzeye sahiptir.", img: "/geos/kures.png" }
      ];

      const secilen = cisimler[Math.floor(Math.random() * cisimler.length)];
      const mode = Math.random();

      if (mode < 0.5) {
        return {
          question: `Görseldeki geometrik cismin kaç yüzü, kaç ayrıtı ve kaç köşesi vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-3 sm:gap-4 py-1 text-center">
              <div class="flex items-center justify-center">
                <img src="${secilen.img}" alt="" class="geo-cisim-img max-h-32 sm:max-h-40 md:max-h-48 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
              </div>
              <div class="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Görseldeki geometrik cismin <span class="text-cyan-300 underline decoration-cyan-400 font-black">Yüz, Ayrıt ve Köşe sayısı</span> hangisinde doğru verilmiştir?
              </div>
            </div>
          `,
          correct: `${secilen.yuz} yüz, ${secilen.ayrit} ayrıt, ${secilen.kose} köşe`,
          wrong: [
            `${secilen.yuz + 1} yüz, ${secilen.ayrit} ayrıt, ${secilen.kose} köşe`,
            `${secilen.yuz} yüz, ${secilen.ayrit > 0 ? secilen.ayrit - 2 : 6} ayrıt, ${secilen.kose} köşe`,
            `${secilen.yuz} yüz, ${secilen.ayrit} ayrıt, ${secilen.kose > 0 ? secilen.kose + 2 : 4} köşe`
          ],
          isLong: true
        };
      } else {
        const digerleri = cisimler.filter(c => c.ad !== secilen.ad).map(c => c.ad);
        return {
          question: `Görseldeki geometrik cisim hangisidir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-3 sm:gap-4 py-1 text-center">
              <div class="flex items-center justify-center">
                <img src="${secilen.img}" alt="" class="geo-cisim-img max-h-32 sm:max-h-40 md:max-h-48 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform" />
              </div>
              <div class="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Görseldeki <span class="text-amber-300 underline decoration-amber-400 font-black">geometrik cisim</span> hangisidir?
              </div>
            </div>
          `,
          correct: secilen.ad,
          wrong: digerleri.sort(() => 0.5 - Math.random()).slice(0, 3),
          isLong: false
        };
      }
    }
  },

  // 4.2 Çevre Uzunluğu (Üçgen, Kare, Dikdörtgen)
  g4_cevre_uzunlugu: {
    title: "Çevre Uzunluğu Hesaplama",
    desc: "Kare, dikdörtgen ve üçgenin çevre uzunluklarını görsel modeller üzerinden hesaplama.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.35) {
        // Kare Çevresi - Görsel Çizimli
        const kenar = Math.floor(Math.random() * 15) + 5;
        const cevre = kenar * 4;
        const yanlislar = [cevre + 4, cevre - 4, kenar * 2].map(n => `${n} cm`);

        return {
          question: `Kenar uzunluğu ${kenar} cm olan karenin çevresi kaç cm'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center my-0.5">
                <svg viewBox="0 0 200 135" class="h-20 sm:h-24 md:h-28 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style="overflow: visible;">
                  <rect x="58" y="24" width="84" height="84" rx="6" fill="#1e3a8a" fill-opacity="0.85" stroke="#60a5fa" stroke-width="3" />
                  <path d="M58 36 L70 36 L70 24" fill="none" stroke="#93c5fd" stroke-width="2" />
                  <text x="100" y="17" fill="#fde047" font-size="14" font-weight="900" text-anchor="middle">${kenar} cm</text>
                  <text x="48" y="71" fill="#fde047" font-size="14" font-weight="900" text-anchor="end">${kenar} cm</text>
                </svg>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki karenin <span class="text-amber-300 underline decoration-amber-400 font-black">çevresi kaç cm'dir</span>?
              </div>
            </div>
          `,
          correct: `${cevre} cm`,
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode < 0.7) {
        // Dikdörtgen Çevresi - Görsel Çizimli
        const kisa = Math.floor(Math.random() * 8) + 4;
        const uzun = kisa + Math.floor(Math.random() * 8) + 3;
        const cevre = 2 * (kisa + uzun);
        const yanlislar = [cevre + 4, cevre - 4, kisa + uzun].map(n => `${n} cm`);

        return {
          question: `Kısa kenarı ${kisa} cm, uzun kenarı ${uzun} cm olan dikdörtgenin çevresi kaç cm'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center my-0.5">
                <svg viewBox="0 0 240 135" class="h-20 sm:h-24 md:h-28 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style="overflow: visible;">
                  <rect x="30" y="24" width="140" height="80" rx="6" fill="#4c1d95" fill-opacity="0.85" stroke="#c084fc" stroke-width="3" />
                  <path d="M30 36 L42 36 L42 24" fill="none" stroke="#e9d5ff" stroke-width="2" />
                  <text x="100" y="17" fill="#fde047" font-size="14" font-weight="900" text-anchor="middle">${uzun} cm</text>
                  <text x="178" y="69" fill="#fde047" font-size="14" font-weight="900" text-anchor="start">${kisa} cm</text>
                </svg>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki dikdörtgenin <span class="text-cyan-300 underline decoration-cyan-400 font-black">çevresi kaç cm'dir</span>?
              </div>
            </div>
          `,
          correct: `${cevre} cm`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // Üçgen Çevresi - Görsel Çizimli
        const a = Math.floor(Math.random() * 10) + 6;
        const b = Math.floor(Math.random() * 10) + 6;
        const c = Math.floor(Math.random() * 10) + 6;
        const cevre = a + b + c;
        const yanlislar = [cevre + 3, cevre - 3, cevre + 5].map(n => `${n} cm`);

        return {
          question: `Kenar uzunlukları ${a} cm, ${b} cm ve ${c} cm olan üçgenin çevresi kaç cm'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center my-0.5">
                <svg viewBox="0 0 210 135" class="h-20 sm:h-24 md:h-28 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style="overflow: visible;">
                  <polygon points="105,20 40,110 170,110" fill="#064e3b" fill-opacity="0.85" stroke="#34d399" stroke-width="3" stroke-linejoin="round" />
                  <text x="60" y="63" fill="#fde047" font-size="14" font-weight="900" text-anchor="end">${a} cm</text>
                  <text x="150" y="63" fill="#fde047" font-size="14" font-weight="900" text-anchor="start">${b} cm</text>
                  <text x="105" y="127" fill="#fde047" font-size="14" font-weight="900" text-anchor="middle">${c} cm</text>
                </svg>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki üçgenin <span class="text-amber-300 underline decoration-amber-400 font-black">çevre uzunluğu</span> kaç cm'dir?
              </div>
            </div>
          `,
          correct: `${cevre} cm`,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 4.3 Birim Kareler ile Alan Tahmini ve Hesabı
  g4_alan_tahmini_ve_birim_kare: {
    title: "Birim Karelerle Alan Hesabı",
    desc: "Kare, dikdörtgen ve birim kare modelleri üzerinden br2 cinsinden alan hesaplama.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.4) {
        // Dikdörtgen Alanı - Görsel Çizimli
        const kisa = Math.floor(Math.random() * 7) + 3; // 3..9
        const uzun = kisa + Math.floor(Math.random() * 6) + 2; // 5..15
        const alan = kisa * uzun;
        const cevre = 2 * (kisa + uzun);

        // Her zaman tam 3 farklı yanlış seçenek oluştur
        const adaylar = [
          cevre,
          alan + 4,
          alan > 4 ? alan - 4 : alan + 8,
          kisa + uzun,
          alan + 6,
          alan > 6 ? alan - 6 : alan + 10
        ];
        const yanlislarSet = new Set<number>();
        for (const aday of adaylar) {
          if (aday > 0 && aday !== alan) {
            yanlislarSet.add(aday);
            if (yanlislarSet.size === 3) break;
          }
        }
        let offset = 2;
        while (yanlislarSet.size < 3) {
          if (alan + offset !== alan) yanlislarSet.add(alan + offset);
          if (yanlislarSet.size < 3 && alan - offset > 0) yanlislarSet.add(alan - offset);
          offset += 2;
        }
        const yanlislar = Array.from(yanlislarSet).slice(0, 3).map(n => `${n} br2`);

        return {
          question: `Kısa kenarı ${kisa} br, uzun kenarı ${uzun} br olan dikdörtgenin alanı kaç br2'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center my-0.5">
                <svg viewBox="0 0 240 135" class="h-20 sm:h-24 md:h-28 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style="overflow: visible;">
                  <rect x="30" y="24" width="140" height="80" rx="6" fill="#4c1d95" fill-opacity="0.85" stroke="#c084fc" stroke-width="3" />
                  <path d="M30 36 L42 36 L42 24" fill="none" stroke="#e9d5ff" stroke-width="2" />
                  <text x="100" y="17" fill="#fde047" font-size="14" font-weight="900" text-anchor="middle">${uzun} br</text>
                  <text x="178" y="69" fill="#fde047" font-size="14" font-weight="900" text-anchor="start">${kisa} br</text>
                </svg>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki dikdörtgenin <span class="text-yellow-300 underline decoration-yellow-400 font-black">alanı kaç br2'dir</span>?
              </div>
            </div>
          `,
          correct: `${alan} br2`,
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode < 0.7) {
        // Kare Alanı - Görsel Çizimli
        const kenar = Math.floor(Math.random() * 9) + 4; // 4..12
        const alan = kenar * kenar;
        const cevre = kenar * 4;

        // Her zaman tam 3 farklı yanlış seçenek oluştur (alan === cevre durumu dahil)
        const adaylar = [
          cevre,
          alan + 5,
          alan > 5 ? alan - 5 : alan + 9,
          kenar * 2,
          alan + 7,
          alan > 7 ? alan - 7 : alan + 12
        ];
        const yanlislarSet = new Set<number>();
        for (const aday of adaylar) {
          if (aday > 0 && aday !== alan) {
            yanlislarSet.add(aday);
            if (yanlislarSet.size === 3) break;
          }
        }
        let offset = 3;
        while (yanlislarSet.size < 3) {
          if (alan + offset !== alan) yanlislarSet.add(alan + offset);
          if (yanlislarSet.size < 3 && alan - offset > 0) yanlislarSet.add(alan - offset);
          offset += 3;
        }
        const yanlislar = Array.from(yanlislarSet).slice(0, 3).map(n => `${n} br2`);

        return {
          question: `Kenar uzunluğu ${kenar} br olan karenin alanı kaç br2'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center my-0.5">
                <svg viewBox="0 0 200 135" class="h-20 sm:h-24 md:h-28 w-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style="overflow: visible;">
                  <rect x="58" y="24" width="84" height="84" rx="6" fill="#1e3a8a" fill-opacity="0.85" stroke="#60a5fa" stroke-width="3" />
                  <path d="M58 36 L70 36 L70 24" fill="none" stroke="#93c5fd" stroke-width="2" />
                  <text x="100" y="17" fill="#fde047" font-size="14" font-weight="900" text-anchor="middle">${kenar} br</text>
                  <text x="48" y="71" fill="#fde047" font-size="14" font-weight="900" text-anchor="end">${kenar} br</text>
                </svg>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki karenin <span class="text-amber-300 underline decoration-amber-400 font-black">alanı kaç br2'dir</span>?
              </div>
            </div>
          `,
          correct: `${alan} br2`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // Birim Kareler ile Alan
        const satir = Math.floor(Math.random() * 3) + 3; // 3..5
        const sutun = Math.floor(Math.random() * 4) + 3; // 3..6
        const alan = satir * sutun;

        const adaylar = [
          alan + 2,
          alan > 2 ? alan - 2 : alan + 4,
          (satir + sutun) * 2,
          satir + sutun,
          alan + 6,
          alan > 4 ? alan - 4 : alan + 8
        ];
        const yanlislarSet = new Set<number>();
        for (const aday of adaylar) {
          if (aday > 0 && aday !== alan) {
            yanlislarSet.add(aday);
            if (yanlislarSet.size === 3) break;
          }
        }
        let offset = 2;
        while (yanlislarSet.size < 3) {
          if (alan + offset !== alan) yanlislarSet.add(alan + offset);
          if (yanlislarSet.size < 3 && alan - offset > 0) yanlislarSet.add(alan - offset);
          offset += 2;
        }
        const yanlislar = Array.from(yanlislarSet).slice(0, 3).map(n => `${n} br2`);

        const gridCells = Array.from({ length: satir * sutun }).map(() => `
          <div class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-cyan-500/80 border border-cyan-200/60 flex items-center justify-center text-[10px] text-white font-bold shrink-0">1</div>
        `).join('');

        return {
          question: `${satir} satır ve ${sutun} sütundan oluşan şeklin alanı kaç br2'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center">
              <div class="flex items-center justify-center p-2 rounded-xl bg-slate-900/90 border-2 border-cyan-400 shadow-md my-0.5">
                <div class="grid gap-1" style="grid-template-columns: repeat(${sutun}, minmax(0, 1fr));">
                  ${gridCells}
                </div>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki şeklin <span class="text-yellow-300 underline decoration-yellow-400 font-black">alanı kaç br2'dir</span>?
              </div>
            </div>
          `,
          correct: `${alan} br2`,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 4.4 Doğru, Işın, Doğru Parçası ve Açı Çeşitleri
  g4_dogru_isin_dogru_parcasi_acilar: {
    title: "Doğru, Işın ve Açı Çeşitleri",
    desc: "Doğru, ışın, doğru parçası modelleri ve açıları dar, dik, geniş olarak sınıflandırma.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.4) {
        // Geometrik model tanıma
        const modeller = [
          { ad: "Doğru", tanim: "Her iki ucundan da sonsuza kadar uzayan çizgi modeli", sembol: "⟷" },
          { ad: "Işın", tanim: "Bir ucu kapalı, diğer ucu sonsuza kadar uzayan çizgi modeli", sembol: "⟶" },
          { ad: "Doğru Parçası", tanim: "İki ucu da sınırlandırılmış (kapalı) çizgi parçası", sembol: "•—•" }
        ];
        const secilen = modeller[Math.floor(Math.random() * modeller.length)];
        const yanlislar = modeller.filter(m => m.ad !== secilen.ad).map(m => m.ad);
        yanlislar.push("Eğri Çizgi");

        return {
          question: `"${secilen.tanim}" ifadesi hangi geometrik kavrama aittir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-black text-lg sm:text-xl border-2 border-white shadow-md max-w-lg">
                "${secilen.tanim}"
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıda tanımı verilen <span class="text-amber-300 underline decoration-amber-400 font-black">geometrik model</span> hangisidir?
              </div>
            </div>
          `,
          correct: secilen.ad,
          wrong: yanlislar.slice(0, 3),
          isLong: false
        };
      } else {
        // Açı çeşitleri
        const aciCesitleri = [
          { ad: "Dik Açı", derece: 90, aciklama: "Ölçüsü tam 90° olan açıdır." },
          { ad: "Dar Açı", derece: Math.floor(Math.random() * 80) + 10, aciklama: "Ölçüsü 0° ile 90° arasında olan açıdır." },
          { ad: "Geniş Açı", derece: Math.floor(Math.random() * 80) + 95, aciklama: "Ölçüsü 90° ile 180° arasında olan açıdır." },
          { ad: "Doğru Açı", derece: 180, aciklama: "Ölçüsü tam 180° olan açıdır." }
        ];
        const secilen = aciCesitleri[Math.floor(Math.random() * aciCesitleri.length)];
        const yanlislar = aciCesitleri.filter(a => a.ad !== secilen.ad).map(a => a.ad);

        return {
          question: `Ölçüsü ${secilen.derece}° olan açı hangi açı çeşididir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                📐 Açı = ${secilen.derece}°
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Ölçüsü <span class="text-amber-300 font-black">${secilen.derece}°</span> olan açı <span class="text-cyan-300 underline decoration-cyan-400 font-black">hangi açı türüne</span> girer?
              </div>
            </div>
          `,
          correct: secilen.ad,
          wrong: yanlislar.slice(0, 3),
          isLong: false
        };
      }
    }
  },

  // 4.5 Simetri Doğruları
  g4_simetri_dogrulari: {
    title: "Simetri Doğruları",
    desc: "Düzlemsel şekillerde simetri ekseni sayısı ve simetrik şekilleri belirleme.",
    generate: () => {
      const sekiller = [
        { ad: "Kare", simetriSayisi: 4, aciklama: "Yatay, dikey ve 2 köşegen simetri doğrusu vardır." },
        { ad: "Dikdörtgen", simetriSayisi: 2, aciklama: "Yatay ve dikey 2 simetri doğrusu vardır." },
        { ad: "Eşkenar Üçgen", simetriSayisi: 3, aciklama: "Her bir köşeden karşı kenara 3 simetri doğrusu vardır." },
        { ad: "Daire (Çember)", simetriSayisi: "Sonsuz", aciklama: "Merkezden geçen sonsuz sayıda simetri doğrusu vardır." }
      ];

      const secilen = sekiller[Math.floor(Math.random() * sekiller.length)];

      const yanlislar = [1, 2, 4, 8, "Sonsuz"].filter(y => y !== secilen.simetriSayisi).slice(0, 3).map(n => n.toString());

      return {
        question: `${secilen.ad} şeklinin kaç tane simetri doğrusu vardır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
              🪞 ${secilen.ad}
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              <span class="text-amber-300 font-black">${secilen.ad}</span> şeklinin toplam <span class="text-cyan-300 underline decoration-cyan-400 font-black">kaç tane simetri doğrusu</span> vardır?
            </div>
          </div>
        `,
        correct: secilen.simetriSayisi.toString(),
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // 4.6 Sütun Grafiği ve Tablolar
  g4_sutun_grafigi_ve_tablolar: {
    title: "Sütun Grafiği ve Tablo Yorumlama",
    desc: "Sütun grafiği okuma, en çok/en az değerleri bulma ve grafik problemleri çözme.",
    generate: () => {
      const ogrenci1 = getRastgeleOgrenci();
      let ogrenci2 = getRastgeleOgrenci();
      while (ogrenci2 === ogrenci1) ogrenci2 = getRastgeleOgrenci();
      let ogrenci3 = getRastgeleOgrenci();
      while (ogrenci3 === ogrenci1 || ogrenci3 === ogrenci2) ogrenci3 = getRastgeleOgrenci();

      const k1 = Math.floor(Math.random() * 15) + 10;
      const k2 = Math.floor(Math.random() * 15) + 10;
      const k3 = Math.floor(Math.random() * 15) + 10;

      const toplam = k1 + k2 + k3;
      const fark = Math.abs(k1 - k2);

      const mode = Math.random();

      if (mode < 0.5) {
        const yanlislar = [toplam + 5, toplam - 5, toplam + 10];
        return {
          question: `Grafiğe göre üç öğrencinin okuduğu toplam kitap sayısı kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 text-white font-black text-sm sm:text-base border-2 border-amber-400 shadow-md flex-wrap">
                <span class="text-cyan-300">📖 ${ogrenci1}: ${k1}</span>
                <span class="text-amber-300">📖 ${ogrenci2}: ${k2}</span>
                <span class="text-pink-300">📖 ${ogrenci3}: ${k3}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Verilen tabloya göre bu üç arkadaşın okuduğu <span class="text-amber-300 underline decoration-amber-400 font-black">toplam kitap sayısı</span> kaçtır?
              </div>
            </div>
          `,
          correct: toplam,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        const yanlislar = [fark + 2, fark > 2 ? fark - 2 : fark + 4, fark + 5];
        return {
          question: `${ogrenci1} ile ${ogrenci2} arasındaki kitap sayısı farkı kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 text-white font-black text-sm sm:text-base border-2 border-amber-400 shadow-md flex-wrap">
                <span class="text-cyan-300">📖 ${ogrenci1}: ${k1}</span>
                <span class="text-amber-300">📖 ${ogrenci2}: ${k2}</span>
                <span class="text-pink-300">📖 ${ogrenci3}: ${k3}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                <span class="text-cyan-300 font-black">${ogrenci1}</span> ile <span class="text-amber-300 font-black">${ogrenci2}</span> arasındaki <span class="text-yellow-300 underline decoration-yellow-400 font-black">kitap okuma farkı</span> kaçtır?
              </div>
            </div>
          `,
          correct: fark,
          wrong: yanlislar,
          isLong: false
        };
      }
    }
  },

  // 4.7 Olayların Olasılığı (Kesin, İmkânsız vb.)
  g4_olaylarin_olasiligi: {
    title: "Olayların Olasılığı",
    desc: "Basit olayların olasılığını kesin, imkânsız, daha fazla veya eşit olasılıklı olarak açıklama.",
    generate: () => {
      const durumlar = [
        {
          olay: "Havaya atılan bir madeni paranın yazı veya tura gelmesi durumu",
          cevap: "Eşit Olasılıklı",
          yanlislar: ["İmkânsız Olay", "Kesin Olay", "Olası Değildir"]
        },
        {
          olay: "İçinde sadece kırmızı elma olan bir sepetten rastgele kırmızı elma çekilmesi",
          cevap: "Kesin Olay",
          yanlislar: ["İmkânsız Olay", "Eşit Olasılıklı", "Az Olasılıklı"]
        },
        {
          olay: "Standart bir zarı attığımızda üst yüze 8 sayısının gelmesi",
          cevap: "İmkânsız Olay",
          yanlislar: ["Kesin Olay", "Eşit Olasılıklı", "Çok Olasılıklı"]
        },
        {
          olay: "Bir torbada 8 mavi, 2 sarı bilye varken rastgele çekilen bilyenin mavi olma ihtimali",
          cevap: "Daha Fazla Olasılıklı",
          yanlislar: ["İmkânsız Olay", "Daha Az Olasılıklı", "Eşit Olasılıklı"]
        },
        {
          olay: "Güneşin yarın sabah doğudan doğması",
          cevap: "Kesin Olay",
          yanlislar: ["İmkânsız Olay", "Eşit Olasılıklı", "Az Olasılıklı"]
        }
      ];

      const secilen = durumlar[Math.floor(Math.random() * durumlar.length)];

      return {
        question: `"${secilen.olay}" hangi olasılık türüne örnektir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-black text-base sm:text-lg border-2 border-white shadow-md max-w-lg">
              🎲 "${secilen.olay}"
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              Yukarıdaki durum <span class="text-amber-300 underline decoration-amber-400 font-black">hangi olasılık kavramı</span> ile açıklanır?
            </div>
          </div>
        `,
        correct: secilen.cevap,
        wrong: secilen.yanlislar,
        isLong: false
      };
    }
  }
};

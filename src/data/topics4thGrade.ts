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
          question: `${formatliSayi} sayısındaki ${rakam} rakamının (${basamakAdi} basamağı) basamak değeri kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2 sm:px-8 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl md:text-4xl border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                ${formatliSayi}
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Bu sayıdaki <span class="text-amber-300 font-black">${basamakAdi} basamağındaki</span> (<span class="text-cyan-300 font-black">${rakam}</span>) rakamının <span class="underline decoration-amber-400">basamak değeri</span> kaçtır?
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
    desc: "4, 5 ve 6 basamaklı sayıları büyükten küçüğe veya küçükten büyüğe sıralama.",
    generate: () => {
      const taban = Math.floor(Math.random() * 80000) + 10000;
      const sayilar = [
        taban + Math.floor(Math.random() * 150),
        taban + Math.floor(Math.random() * 300) + 200,
        taban + Math.floor(Math.random() * 500) + 600,
        taban + Math.floor(Math.random() * 800) + 1200
      ];
      // Karışık sıra
      const karisik = [...sayilar].sort(() => 0.5 - Math.random());
      const buyuktenKucuge = Math.random() < 0.5;

      let dogruSira: string;
      if (buyuktenKucuge) {
        dogruSira = [...sayilar].sort((a, b) => b - a).map(n => n.toLocaleString('tr-TR')).join(' > ');
      } else {
        dogruSira = [...sayilar].sort((a, b) => a - b).map(n => n.toLocaleString('tr-TR')).join(' < ');
      }

      // Yanlış sıralamalar
      const yanlis1 = [...sayilar].sort(() => 0.5 - Math.random()).map(n => n.toLocaleString('tr-TR')).join(buyuktenKucuge ? ' > ' : ' < ');
      const yanlis2 = [...sayilar].sort((a, b) => (buyuktenKucuge ? a - b : b - a)).map(n => n.toLocaleString('tr-TR')).join(buyuktenKucuge ? ' > ' : ' < ');
      const yanlis3 = [...karisik].map(n => n.toLocaleString('tr-TR')).join(buyuktenKucuge ? ' > ' : ' < ');

      const yanlislar = [yanlis1, yanlis2, yanlis3].filter(y => y !== dogruSira);
      while (yanlislar.length < 3) {
        yanlislar.push([...sayilar].sort(() => 0.5 - Math.random()).map(n => n.toLocaleString('tr-TR')).join(buyuktenKucuge ? ' > ' : ' < '));
      }

      return {
        question: `${karisik.map(n => n.toLocaleString('tr-TR')).join(', ')} sayılarının ${buyuktenKucuge ? 'büyükten küçüğe' : 'küçükten büyüğe'} doğru sıralanışı hangisidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
            <div class="flex flex-wrap items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 max-w-full my-0.5 px-1">
              ${karisik.map(n => `
                <span class="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-slate-900/90 border border-amber-400 text-amber-300 font-black text-[11px] xs:text-xs sm:text-sm shadow-sm shrink-0 whitespace-nowrap">
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
        wrong: yanlislar.slice(0, 3),
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
        const yanlislar = [
          dogru - 10,
          dogru + 10,
          dogru + 20,
          dogru - 20
        ].filter(y => y !== dogru && y > 0).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

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
        const yanlislar = [
          dogru - 100,
          dogru + 100,
          dogru + 200,
          dogru - 200
        ].filter(y => y !== dogru && y > 0).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

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
          return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white text-blue-950 font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-base shrink-0">❓</div>`;
        }
        return `<div class="px-1 py-0.5 xs:px-1.5 xs:py-0.5 sm:px-2 sm:py-1 rounded-lg bg-slate-900/90 border border-cyan-400 text-cyan-300 font-black text-[10px] xs:text-[11px] sm:text-xs md:text-sm shadow-sm shrink-0 text-center">${val.toLocaleString('tr-TR')}</div>`;
      }).join('');

      const yanlislar = [
        dogruCevap + step,
        dogruCevap - step,
        dogruCevap + (step * 2),
        dogruCevap - (step * 2)
      ].filter(y => y !== dogruCevap && y > 0).slice(0, 3).map(n => n.toLocaleString('tr-TR'));

      return {
        question: `Ritmik sayma zincirinde soru işareti (❓) yerine hangi sayı gelmelidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2.5 py-0.5 text-center">
            <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
              ${sequenceHTML}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Aşağıdaki <span class="text-amber-300 font-black">${isBiner ? "biner" : "yüzer"}</span> ritmik sayma örüntüsünde <span class="text-cyan-300 font-black">❓</span> yerine hangi sayı gelmelidir?
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
          return `<div class="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-600 border-2 border-white text-white font-black flex items-center justify-center shadow-md animate-pulse text-xs xs:text-sm sm:text-base shrink-0">❓</div>`;
        }
        return `<div class="px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-lg bg-slate-800 border border-white/60 text-white font-black text-[11px] xs:text-xs sm:text-sm shadow-md shrink-0">${val}</div>`;
      }).join('');

      const yanlislar = [dogru + artis, dogru - artis, dogru + artis * 2, dogru - 1].filter(y => y !== dogru && y > 0).slice(0, 3);

      return {
        question: `Örüntüde soru işareti yerine hangi sayı gelmelidir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-1.5 sm:gap-2 py-0.5 text-center">
            <div class="flex items-center justify-center gap-1 xs:gap-1.5 flex-nowrap max-w-full my-0.5">
              ${sequenceHTML}
            </div>
            <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
              Kuralı verilen sayı örüntüsünde <span class="text-amber-300 font-black">❓</span> yerine hangi sayı gelmelidir?
            </div>
            <div class="text-[10px] xs:text-xs sm:text-sm font-extrabold text-cyan-200">
              (Örüntü Kuralı: Sayılar her adımda <span class="text-yellow-300 font-black">${artis}</span> artmaktadır)
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
    desc: "Basit kesir, bileşik kesir ve tam sayılı kesir kavramlarını ayırt etme ve modelleme.",
    generate: () => {
      const turSecim = Math.random();
      if (turSecim < 0.35) {
        // Basit Kesir
        const payda = Math.floor(Math.random() * 8) + 3; // 3..10
        const pay = Math.floor(Math.random() * (payda - 1)) + 1; // 1..(payda-1)
        return {
          question: `${pay}/${payda} kesri hangi kesir türüne örnektir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex flex-col items-center px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                <span>${pay}</span>
                <div class="w-10 h-0.5 bg-white my-0.5"></div>
                <span>${payda}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki <span class="text-amber-300 font-black">${pay}/${payda}</span> kesrinin türü aşağıdakilerden hangisidir?
              </div>
            </div>
          `,
          correct: "Basit Kesir",
          wrong: ["Bileşik Kesir", "Tam Sayılı Kesir", "Birim Kesir Değildir"],
          isLong: false
        };
      } else if (turSecim < 0.7) {
        // Bileşik Kesir
        const payda = Math.floor(Math.random() * 6) + 2; // 2..7
        const pay = payda + Math.floor(Math.random() * 5) + 1; // pay > payda
        return {
          question: `${pay}/${payda} kesri hangi kesir türüne örnektir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="flex flex-col items-center px-6 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
                <span>${pay}</span>
                <div class="w-10 h-0.5 bg-white my-0.5"></div>
                <span>${payda}</span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Payı paydasına eşit veya paydasından büyük olan <span class="text-amber-300 font-black">${pay}/${payda}</span> kesrinin türü nedir?
              </div>
            </div>
          `,
          correct: "Bileşik Kesir",
          wrong: ["Basit Kesir", "Tam Sayılı Kesir", "Ondalık Kesir"],
          isLong: false
        };
      } else {
        // Tam Sayılı Kesir
        const tam = Math.floor(Math.random() * 3) + 1; // 1..3
        const payda = Math.floor(Math.random() * 6) + 3;
        const pay = Math.floor(Math.random() * (payda - 1)) + 1;
        return {
          question: `${tam} tam ${pay}/${payda} kesri hangi kesir türüne örnektir?`,
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
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıdaki <span class="text-amber-300 font-black">${tam} tam ${pay}/${payda}</span> kesrinin türü nedir?
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
        question: `1/${p1} ve 1/${p2} birim kesirlerinden hangisi daha ${soruTipiBuyuk ? 'büyüktür' : 'küçüktür'}?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="flex items-center justify-center gap-4 px-6 py-2.5 rounded-2xl bg-slate-900/90 text-white font-black text-2xl sm:text-3xl border-2 border-amber-400 shadow-md">
              <span class="text-cyan-300">1/${p1}</span>
              <span class="text-amber-400">❓</span>
              <span class="text-pink-300">1/${p2}</span>
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              Birim kesirlerde paydası küçük olan daha büyüktür. Buna göre hangisi <span class="text-amber-300 underline decoration-amber-400 font-black">${soruTipiBuyuk ? 'DAHA BÜYÜKTÜR' : 'DAHA KÜÇÜKTÜR'}</span>?
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
          question: `${pay1}/${payda} + ${pay2}/${payda} işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center gap-2 sm:gap-3 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-2xl sm:text-4xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
                <span>${pay1}/${payda}</span>
                <span class="text-amber-300">+</span>
                <span>${pay2}/${payda}</span>
                <span class="text-amber-300">=</span>
                <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Paydaları eşit kesirler toplanırken paylar toplanır, ortak payda aynen yazılır. <span class="text-amber-300 underline decoration-amber-400 font-black">Sonuç kaçtır</span>?
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
          `${sonucPay + 2}/${payda}`,
          `${sonucPay}/0`
        ];

        return {
          question: `${pay1}/${payda} - ${pay2}/${payda} işleminin sonucu kaçtır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center gap-2 sm:gap-3 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-600 to-pink-700 text-white font-black text-2xl sm:text-4xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
                <span>${pay1}/${payda}</span>
                <span class="text-amber-300">-</span>
                <span>${pay2}/${payda}</span>
                <span class="text-amber-300">=</span>
                <span class="text-yellow-300 font-black">?</span>
              </div>
              <div class="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2">
                Paydaları eşit kesirler çıkarılırken paylar çıkarılır, ortak payda aynen yazılır. <span class="text-cyan-300 underline decoration-cyan-400 font-black">Sonuç kaçtır</span>?
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
                (1 km = 1000 m) olduğuna göre verilen uzunluk <span class="text-amber-300 underline decoration-amber-400 font-black">kaç metredir</span>?
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
                (1 m = 100 cm) olduğuna göre verilen uzunluk <span class="text-amber-300 underline decoration-amber-400 font-black">kaç santimetredir</span>?
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
                (1 cm = 10 mm) olduğuna göre verilen uzunluk <span class="text-cyan-300 underline decoration-cyan-400 font-black">kaç milimetredir</span>?
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
                (1 ton = 1000 kg) olduğuna göre bu ağırlık <span class="text-amber-300 underline decoration-amber-400 font-black">kaç kilogramdır</span>?
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
                (1 kg = 1000 g) olduğuna göre bu ağırlık <span class="text-cyan-300 underline decoration-cyan-400 font-black">kaç gramdır</span>?
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
                Yukarıdaki eldeli toplama işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
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
                Yukarıdaki onluk bozmayı gerektiren çıkarma işleminin <span class="text-cyan-300 underline decoration-cyan-400 font-black">sonucu kaçtır</span>?
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

  // 3.2 3 Basamaklı Sayılarla Çarpma İşlemi
  g4_carpma_islemi_3basamakli: {
    title: "Çarpma İşlemi (3 Basamaklı)",
    desc: "3 basamaklı sayılarla 1 ve 2 basamaklı sayıları çarpma ve çarpma problemleri.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 400) + 110; // 3 basamaklı
      const s2 = Math.floor(Math.random() * 20) + 5; // 1 veya 2 basamaklı
      const dogru = s1 * s2;

      const yanlislar = [
        (dogru + s1).toLocaleString('tr-TR'),
        (dogru - s1).toLocaleString('tr-TR'),
        (dogru + 100).toLocaleString('tr-TR')
      ];

      return {
        question: `${s1} x ${s2} çarpma işleminin sonucu kaçtır?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black text-2xl sm:text-3xl border-2 border-white shadow-md">
              ${s1} × ${s2} = ?
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              Yukarıdaki çarpma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">doğru sonucu</span> hangisidir?
            </div>
          </div>
        `,
        correct: dogru.toLocaleString('tr-TR'),
        wrong: yanlislar,
        isLong: false
      };
    }
  },

  // 3.3 4 Basamağa Kadar Bölme İşlemi
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
              Yukarıdaki bölme işleminde <span class="text-cyan-300 underline decoration-cyan-400 font-black">BÖLÜM</span> kaçtır? ${kalan > 0 ? `<span class="text-xs text-yellow-200 block mt-0.5">(Kalan: ${kalan})</span>` : ''}
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
                (10, 100, 1000 ile) Zihinden çarpma işleminin <span class="text-amber-300 underline decoration-amber-400 font-black">sonucu kaçtır</span>?
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
                (10, 100, 1000 ile) Zihinden bölme işleminin <span class="text-cyan-300 underline decoration-cyan-400 font-black">sonucu kaçtır</span>?
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
                Eşitliğin her iki tarafının dengede olması için <span class="text-amber-300 underline decoration-amber-400 font-black">🔺 yerine</span> hangi sayı gelmelidir?
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
                Eşitliğin sağlanması için <span class="text-yellow-300 underline decoration-yellow-400 font-black">⬛ yerine</span> hangi sayı gelmelidir?
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
          question: `${secilen.ad} geometrik cisminin kaç yüzü, kaç ayrıtı ve kaç köşesi vardır?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center justify-center gap-3">
                <div class="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center shrink-0">
                  <img src="${secilen.img}" alt="${secilen.ad}" class="geo-cisim-img max-h-20 sm:max-h-24 md:max-h-28 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform" />
                </div>
                <span class="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-md">
                  ${secilen.ad}
                </span>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                <span class="text-amber-300 font-black">${secilen.ad}</span> için <span class="text-cyan-300 underline decoration-cyan-400 font-black">Yüz, Ayrıt ve Köşe sayısı</span> hangisinde doğru verilmiştir?
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
          question: `"${secilen.ekstra}" özelliği hangi geometrik cisme aittir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3.5 py-1 text-center">
              <div class="flex items-center justify-center gap-3">
                <div class="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center shrink-0">
                  <img src="${secilen.img}" alt="${secilen.ad}" class="geo-cisim-img max-h-20 sm:max-h-24 md:max-h-28 w-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform" />
                </div>
                <div class="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-base sm:text-xl border-2 border-white shadow-md max-w-lg">
                  "${secilen.ekstra}"
                </div>
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Yukarıda özelliği verilen <span class="text-amber-300 underline decoration-amber-400 font-black">geometrik cisim</span> hangisidir?
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
    desc: "Kare, dikdörtgen ve üçgenin çevre uzunluklarını hesaplama ve çevre problemleri.",
    generate: () => {
      const mode = Math.random();

      if (mode < 0.35) {
        // Kare Çevresi
        const kenar = Math.floor(Math.random() * 15) + 5;
        const cevre = kenar * 4;
        const yanlislar = [cevre + 4, cevre - 4, kenar * 2].map(n => `${n} cm`);

        return {
          question: `Bir kenar uzunluğu ${kenar} cm olan karenin çevre uzunluğu kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xl sm:text-2xl border-2 border-white shadow-md">
                🟦 Karenin Kenarı = ${kenar} cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Karenin tüm kenarları eşit olduğuna göre <span class="text-amber-300 underline decoration-amber-400 font-black">çevresi kaç santimetredir</span>?
              </div>
            </div>
          `,
          correct: `${cevre} cm`,
          wrong: yanlislar,
          isLong: false
        };
      } else if (mode < 0.7) {
        // Dikdörtgen Çevresi
        const kisa = Math.floor(Math.random() * 10) + 4;
        const uzun = kisa + Math.floor(Math.random() * 10) + 4;
        const cevre = 2 * (kisa + uzun);
        const yanlislar = [cevre + 4, cevre - 4, kisa + uzun].map(n => `${n} cm`);

        return {
          question: `Kısa kenarı ${kisa} cm, uzun kenarı ${uzun} cm olan dikdörtgenin çevre uzunluğu kaç cm'dir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-lg sm:text-xl border-2 border-white shadow-md">
                ▭ Kısa: ${kisa} cm &nbsp;•&nbsp; Uzun: ${uzun} cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Bu dikdörtgenin <span class="text-cyan-300 underline decoration-cyan-400 font-black">çevre uzunluğu (Ç = 2 × [Kısa + Uzun])</span> kaç cm'dir?
              </div>
            </div>
          `,
          correct: `${cevre} cm`,
          wrong: yanlislar,
          isLong: false
        };
      } else {
        // Eşkenar / Çeşitkenar Üçgen Çevresi
        const a = Math.floor(Math.random() * 10) + 6;
        const b = Math.floor(Math.random() * 10) + 6;
        const c = Math.floor(Math.random() * 10) + 6;
        const cevre = a + b + c;
        const yanlislar = [cevre + 3, cevre - 3, cevre + 5].map(n => `${n} cm`);

        return {
          question: `Kenar uzunlukları ${a} cm, ${b} cm ve ${c} cm olan üçgenin çevresi kaç santimetredir?`,
          questionHTML: `
            <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
              <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-lg sm:text-xl border-2 border-white shadow-md">
                🔺 Kenarlar: ${a} cm, ${b} cm, ${c} cm
              </div>
              <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
                Bu üçgenin <span class="text-amber-300 underline decoration-amber-400 font-black">çevre uzunluğu</span> kaç santimetredir?
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
    title: "Birim Karelerle Alan",
    desc: "Birim kareler sayarak şekillerin alanını belirleme ve alan tahmini.",
    generate: () => {
      const satir = Math.floor(Math.random() * 4) + 3; // 3..6
      const sutun = Math.floor(Math.random() * 5) + 3; // 3..7
      const alan = satir * sutun;

      const yanlislar = [alan + sutun, alan - satir, alan + 2].filter(y => y !== alan && y > 0).slice(0, 3).map(n => `${n} birimkare`);

      return {
        question: `${satir} satır ve ${sutun} sütundan oluşan dikdörtgen şeklin alanı kaç birimkaredir?`,
        questionHTML: `
          <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2.5 sm:gap-3 py-1 text-center">
            <div class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg sm:text-xl border-2 border-white shadow-md">
              📐 ${satir} Satır × ${sutun} Sütun Birim Kare
            </div>
            <div class="text-base sm:text-lg md:text-xl font-black text-white text-center leading-snug drop-shadow-md max-w-lg px-2">
              İçinde ${satir} sıra ve her sırada ${sutun} adet birim kare olan şeklin <span class="text-yellow-300 underline decoration-yellow-400 font-black">toplam alanı kaç birimkaredir</span>?
            </div>
          </div>
        `,
        correct: `${alan} birimkare`,
        wrong: yanlislar,
        isLong: false
      };
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
                "${secilen.tanim}" (${secilen.sembol})
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

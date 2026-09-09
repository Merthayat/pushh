import { QuestionData } from '../types';

function benzersizYanlislar(correct: number, adaylar: number[], minVal = 0): number[] {
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
  let step = 1;
  while (sonuc.length < 3) {
    const yukari = correct + step;
    if (!gorulen.has(yukari)) {
      gorulen.add(yukari);
      sonuc.push(yukari);
    }
    if (sonuc.length < 3) {
      const asagi = correct - step;
      if (asagi >= safeMin && !gorulen.has(asagi)) {
        gorulen.add(asagi);
        sonuc.push(asagi);
      }
    }
    step++;
  }
  return sonuc;
}

const renderHalatQuestionHTML = (islemStr: string, islemTuru: string, aciklama: string, renk: string) => `
  <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center select-none">
    <div class="flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-amber-400/60 text-amber-300 font-black text-xs sm:text-sm tracking-wider uppercase shadow-md whitespace-nowrap" style="white-space: nowrap !important; text-wrap: nowrap !important;">
      <span>🪢 HALAT ÇEKME DÜELLOSU</span>
      <span class="text-white/70">|</span>
      <span>${islemTuru}</span>
    </div>
    <div class="halat-islem-box px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${renk} text-white font-black text-xl xs:text-2xl sm:text-3xl md:text-4xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg shrink-0 inline-flex items-center justify-center" style="white-space: nowrap !important; text-wrap: nowrap !important; word-break: keep-all !important;">
      ${islemStr} = ?
    </div>
    <div class="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 whitespace-nowrap" style="white-space: nowrap !important; text-wrap: nowrap !important;">
      ${aciklama}
    </div>
  </div>
`;

const renderSureliQuestionHTML = (islemStr: string, islemTuru: string, aciklama: string, renk: string) => `
  <div class="flex flex-col items-center justify-center w-full h-full my-auto gap-2 sm:gap-2.5 py-1 text-center select-none">
    <div class="flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 font-black text-xs sm:text-sm tracking-wider uppercase shadow-md whitespace-nowrap" style="white-space: nowrap !important; text-wrap: nowrap !important;">
      <span>⚡ SÜRELİ İŞLEM YARIŞI</span>
      <span class="text-white/70">|</span>
      <span>${islemTuru}</span>
    </div>
    <div class="halat-islem-box px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${renk} text-white font-black text-xl xs:text-2xl sm:text-3xl md:text-4xl border-2 sm:border-3 border-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap tracking-wide drop-shadow-lg shrink-0 inline-flex items-center justify-center" style="white-space: nowrap !important; text-wrap: nowrap !important; word-break: keep-all !important;">
      ${islemStr} = ?
    </div>
    <div class="text-xs xs:text-sm sm:text-base md:text-lg font-black text-white text-center leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-w-lg px-2 whitespace-nowrap" style="white-space: nowrap !important; text-wrap: nowrap !important;">
      ${aciklama}
    </div>
  </div>
`;

export const halatCekmeTopics: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
  // -------------------------------------------------------------
  // 1. SINIF HALAT ÇEKME OYUNLARI
  // -------------------------------------------------------------
  halat_toplama_1: {
    title: "🪢 Halat Çekme: Toplama (1. Sınıf)",
    desc: "2 Kişilik Halat Çekme Düellosu! 20'ye kadar hızlı topla, halatı takımına çek!",
    generate: () => {
      const s1 = Math.floor(Math.random() * 9) + 2; // 2..10
      const s2 = Math.floor(Math.random() * 9) + 2; // 2..10
      const sonuc = s1 + s2;
      return {
        question: `${s1} + ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} + ${s2}`,
          "1. Sınıf Toplama",
          "Hızlı topla, halatı kendi tarafına çek!",
          "from-blue-600 via-indigo-600 to-cyan-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 1),
        isLong: false
      };
    }
  },

  halat_cikarma_1: {
    title: "🪢 Halat Çekme: Çıkarma (1. Sınıf)",
    desc: "2 Kişilik Halat Çekme Düellosu! 20'ye kadar hızlı çıkar, halatı takımına çek!",
    generate: () => {
      const s1 = Math.floor(Math.random() * 12) + 6; // 6..18
      const s2 = Math.floor(Math.random() * (s1 - 2)) + 1;
      const sonuc = s1 - s2;
      return {
        question: `${s1} - ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} - ${s2}`,
          "1. Sınıf Çıkarma",
          "Hızlı çıkar, halatı kendi tarafına çek!",
          "from-rose-600 via-pink-600 to-amber-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 1, sonuc - 1, sonuc + 2, sonuc - 2], 0),
        isLong: false
      };
    }
  },

  // -------------------------------------------------------------
  // 2. SINIF HALAT ÇEKME OYUNLARI
  // -------------------------------------------------------------
  halat_toplama_2: {
    title: "🪢 Halat Çekme: Toplama (2. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 100'e kadar iki basamaklı toplama işlemleri.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 40) + 12; // 12..51
      const s2 = Math.floor(Math.random() * 40) + 12; // 12..51
      const sonuc = s1 + s2;
      return {
        question: `${s1} + ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} + ${s2}`,
          "2. Sınıf Toplama",
          "Hızlı topla, halatı kendi tarafına çek!",
          "from-blue-600 via-indigo-600 to-teal-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 1, sonuc - 1], 1),
        isLong: false
      };
    }
  },

  halat_cikarma_2: {
    title: "🪢 Halat Çekme: Çıkarma (2. Sınıf)",
    desc: "2 Kişilik Halat Çekme! İki basamaklı çıkarma işlemleri.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 50) + 35; // 35..84
      const s2 = Math.floor(Math.random() * 25) + 12; // 12..36
      const sonuc = s1 - s2;
      return {
        question: `${s1} - ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} - ${s2}`,
          "2. Sınıf Çıkarma",
          "Hızlı çıkar, halatı kendi tarafına çek!",
          "from-rose-600 via-red-600 to-orange-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 2, sonuc - 2], 0),
        isLong: false
      };
    }
  },

  halat_carpma_2: {
    title: "🪢 Halat Çekme: Çarpma (2. Sınıf)",
    desc: "2 Kişilik Halat Çekme! Çarpım tablosu (1-5'ler) hızlı çarpma.",
    generate: () => {
      const carpan1 = Math.floor(Math.random() * 5) + 1; // 1..5
      const carpan2 = Math.floor(Math.random() * 10) + 1; // 1..10
      const sonuc = carpan1 * carpan2;
      return {
        question: `${carpan1} × ${carpan2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${carpan1} × ${carpan2}`,
          "2. Sınıf Çarpma",
          "Çarpım tablosunu hatırla, halatı çek!",
          "from-amber-500 via-orange-500 to-yellow-500"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + carpan1, sonuc - carpan1, sonuc + 2, sonuc - 2], 0),
        isLong: false
      };
    }
  },

  halat_bolme_2: {
    title: "🪢 Halat Çekme: Bölme (2. Sınıf)",
    desc: "2 Kişilik Halat Çekme! Kalansız bölme işlemi alıştırmaları.",
    generate: () => {
      const bolen = Math.floor(Math.random() * 4) + 2; // 2..5
      const bolum = Math.floor(Math.random() * 8) + 2; // 2..9
      const bolunen = bolen * bolum;
      return {
        question: `${bolunen} ÷ ${bolen} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${bolunen} ÷ ${bolen}`,
          "2. Sınıf Bölme",
          "Hızlı böl, halatı takımına çek!",
          "from-emerald-600 via-teal-600 to-cyan-600"
        ),
        correct: bolum,
        wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
        isLong: false
      };
    }
  },

  // -------------------------------------------------------------
  // 3. SINIF HALAT ÇEKME OYUNLARI
  // -------------------------------------------------------------
  halat_toplama_3: {
    title: "🪢 Halat Çekme: Toplama (3. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 3 basamaklı sayılarla toplama düellosu.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 300) + 120; // 120..419
      const s2 = Math.floor(Math.random() * 300) + 110; // 110..409
      const sonuc = s1 + s2;
      return {
        question: `${s1} + ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} + ${s2}`,
          "3. Sınıf Toplama",
          "3 basamaklıları topla, halatı takımına çek!",
          "from-blue-600 via-indigo-700 to-purple-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 100, sonuc - 100], 1),
        isLong: false
      };
    }
  },

  halat_cikarma_3: {
    title: "🪢 Halat Çekme: Çıkarma (3. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 3 basamaklı sayılarla çıkarma düellosu.",
    generate: () => {
      const s1 = Math.floor(Math.random() * 450) + 350; // 350..799
      const s2 = Math.floor(Math.random() * 250) + 110; // 110..359
      const sonuc = s1 - s2;
      return {
        question: `${s1} - ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} - ${s2}`,
          "3. Sınıf Çıkarma",
          "Hızlı çıkar, halatı kendi tarafına çek!",
          "from-rose-600 via-pink-700 to-red-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 100, sonuc - 100], 0),
        isLong: false
      };
    }
  },

  halat_carpma_3: {
    title: "🪢 Halat Çekme: Çarpma (3. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 6-9 çarpım tablosu ve 2 basamaklı çarpma.",
    generate: () => {
      const isTable = Math.random() < 0.6;
      if (isTable) {
        const c1 = Math.floor(Math.random() * 4) + 6; // 6..9
        const c2 = Math.floor(Math.random() * 9) + 2; // 2..10
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${c1} × ${c2}`,
            "3. Sınıf Çarpma",
            "Çarpımı hızlıca bul, halatı çek!",
            "from-amber-500 via-orange-600 to-red-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + c1, sonuc - c1, sonuc + 4, sonuc - 4], 0),
          isLong: false
        };
      } else {
        const c1 = Math.floor(Math.random() * 15) + 11; // 11..25
        const c2 = Math.floor(Math.random() * 4) + 2; // 2..5
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${c1} × ${c2}`,
            "3. Sınıf Çarpma",
            "İşlemi zihinden yap, halatı takımına çek!",
            "from-amber-500 via-orange-600 to-red-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + c2, sonuc - c2], 0),
          isLong: false
        };
      }
    }
  },

  halat_bolme_3: {
    title: "🪢 Halat Çekme: Bölme (3. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 2 basamaklı sayıyı 1 basamaklıya bölme.",
    generate: () => {
      const bolen = Math.floor(Math.random() * 7) + 3; // 3..9
      const bolum = Math.floor(Math.random() * 8) + 4; // 4..11
      const bolunen = bolen * bolum;
      return {
        question: `${bolunen} ÷ ${bolen} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${bolunen} ÷ ${bolen}`,
          "3. Sınıf Bölme",
          "Kalansız bölmeyi yap, halatı çek!",
          "from-teal-600 via-emerald-600 to-cyan-600"
        ),
        correct: bolum,
        wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
        isLong: false
      };
    }
  },

  // -------------------------------------------------------------
  // 4. SINIF HALAT ÇEKME OYUNLARI
  // -------------------------------------------------------------
  halat_toplama_4: {
    title: "🪢 Halat Çekme: Toplama (4. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 4 basamaklı sayılarla toplama.",
    generate: () => {
      const s1 = (Math.floor(Math.random() * 40) + 12) * 100 + (Math.floor(Math.random() * 8) + 1) * 10;
      const s2 = (Math.floor(Math.random() * 35) + 11) * 100 + (Math.floor(Math.random() * 8) + 1) * 10;
      const sonuc = s1 + s2;
      return {
        question: `${s1} + ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} + ${s2}`,
          "4. Sınıf Toplama",
          "4 basamaklıları topla, halatı kendi tarafına çek!",
          "from-blue-600 via-indigo-700 to-purple-800"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 100, sonuc - 100, sonuc + 10, sonuc - 10], 1),
        isLong: false
      };
    }
  },

  halat_cikarma_4: {
    title: "🪢 Halat Çekme: Çıkarma (4. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 4 basamaklı sayılarla çıkarma.",
    generate: () => {
      const s1 = (Math.floor(Math.random() * 40) + 50) * 100;
      const s2 = (Math.floor(Math.random() * 25) + 15) * 100;
      const sonuc = s1 - s2;
      return {
        question: `${s1} - ${s2} = ?`,
        questionHTML: renderHalatQuestionHTML(
          `${s1} - ${s2}`,
          "4. Sınıf Çıkarma",
          "Hızlıca çıkar, halatı kendi tarafına çek!",
          "from-rose-600 via-pink-700 to-red-800"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + 100, sonuc - 100, sonuc + 200, sonuc - 200], 0),
        isLong: false
      };
    }
  },

  halat_carpma_4: {
    title: "🪢 Halat Çekme: Çarpma (4. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 2 basamaklı sayılarla çarpma işlemi.",
    generate: () => {
      const isEasy = Math.random() < 0.5;
      if (isEasy) {
        const c1 = Math.floor(Math.random() * 35) + 12; // 12..46
        const c2 = 10;
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${c1} × ${c2}`,
            "4. Sınıf Çarpma",
            "10 ile kısa yoldan çarp, halatı çek!",
            "from-amber-600 via-orange-600 to-yellow-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 100, sonuc - 100], 0),
          isLong: false
        };
      } else {
        const c1 = Math.floor(Math.random() * 15) + 12; // 12..26
        const c2 = Math.floor(Math.random() * 6) + 4; // 4..9
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${c1} × ${c2}`,
            "4. Sınıf Çarpma",
            "Çarpma işlemini hesapla, halatı takımına çek!",
            "from-amber-600 via-orange-600 to-yellow-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + c2, sonuc - c2], 0),
          isLong: false
        };
      }
    }
  },

  halat_bolme_4: {
    title: "🪢 Halat Çekme: Bölme (4. Sınıf)",
    desc: "2 Kişilik Halat Çekme! 3 basamaklı sayılarla bölme işlemi.",
    generate: () => {
      const isTen = Math.random() < 0.4;
      if (isTen) {
        const bolum = (Math.floor(Math.random() * 40) + 12);
        const bolunen = bolum * 10;
        return {
          question: `${bolunen} ÷ 10 = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${bolunen} ÷ 10`,
            "4. Sınıf Bölme",
            "10 ile kısa yoldan böl, halatı çek!",
            "from-teal-600 via-emerald-700 to-cyan-700"
          ),
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 10, bolum - 10], 1),
          isLong: false
        };
      } else {
        const bolen = Math.floor(Math.random() * 7) + 3; // 3..9
        const bolum = (Math.floor(Math.random() * 25) + 10); // 10..34
        const bolunen = bolen * bolum;
        return {
          question: `${bolunen} ÷ ${bolen} = ?`,
          questionHTML: renderHalatQuestionHTML(
            `${bolunen} ÷ ${bolen}`,
            "4. Sınıf Bölme",
            "Kalansız bölmeyi hızlıca çöz, halatı çek!",
            "from-teal-600 via-emerald-700 to-cyan-700"
          ),
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
          isLong: false
        };
      }
    }
  }
};

// -------------------------------------------------------------
// SÜRELİ ÇARPMA VE BÖLME ETKİNLİKLERİ (1, 2 VE 3 KİŞİLİK)
// -------------------------------------------------------------
export const sureliExtraTopics: Record<string, { title: string; desc: string; generate: () => QuestionData }> = {
  sureli_carpma: {
    title: "⚡ Süreli Hızlı Çarpma",
    desc: "10 saniye süre bitmeden hızlıca çarpma işlemini yap. (1, 2 veya 3 kişilik)",
    generate: () => {
      const c1 = Math.floor(Math.random() * 8) + 2; // 2..9
      const c2 = Math.floor(Math.random() * 9) + 2; // 2..10
      const sonuc = c1 * c2;
      return {
        question: `${c1} × ${c2} = ?`,
        questionHTML: renderSureliQuestionHTML(
          `${c1} × ${c2}`,
          "Süreli Çarpma",
          "⚡ Süre bitmeden çarpımı bul!",
          "from-amber-500 via-orange-600 to-red-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + c1, sonuc - c1, sonuc + 3, sonuc - 3], 0),
        isLong: false
      };
    }
  },

  sureli_bolme: {
    title: "⚡ Süreli Hızlı Bölme",
    desc: "10 saniye süre bitmeden hızlıca bölme işlemini yap. (1, 2 veya 3 kişilik)",
    generate: () => {
      const bolen = Math.floor(Math.random() * 8) + 2; // 2..9
      const bolum = Math.floor(Math.random() * 9) + 2; // 2..10
      const bolunen = bolen * bolum;
      return {
        question: `${bolunen} ÷ ${bolen} = ?`,
        questionHTML: renderSureliQuestionHTML(
          `${bolunen} ÷ ${bolen}`,
          "Süreli Bölme",
          "⚡ Süre bitmeden sonucu bul!",
          "from-teal-500 via-emerald-600 to-cyan-600"
        ),
        correct: bolum,
        wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
        isLong: false
      };
    }
  },

  sureli_carpma_bolme: {
    title: "⚡ Süreli Hızlı Çarpma & Bölme",
    desc: "10 saniye süre bitmeden çarpma veya bölmeyi çöz. (1, 2 veya 3 kişilik)",
    generate: () => {
      const isMul = Math.random() < 0.5;
      if (isMul) {
        const c1 = Math.floor(Math.random() * 8) + 2;
        const c2 = Math.floor(Math.random() * 9) + 2;
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${c1} × ${c2}`,
            "Süreli Çarpma",
            "⚡ Hızlıca çarp: sonuç kaçtır?",
            "from-amber-500 via-orange-600 to-rose-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + c1, sonuc - c1, sonuc + 4, sonuc - 4], 0),
          isLong: false
        };
      } else {
        const bolen = Math.floor(Math.random() * 8) + 2;
        const bolum = Math.floor(Math.random() * 9) + 2;
        const bolunen = bolen * bolum;
        return {
          question: `${bolunen} ÷ ${bolen} = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${bolunen} ÷ ${bolen}`,
            "Süreli Bölme",
            "⚡ Hızlıca böl: sonuç kaçtır?",
            "from-teal-500 via-emerald-600 to-blue-600"
          ),
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
          isLong: false
        };
      }
    }
  },

  sureli_carpma_3: {
    title: "⚡ Süreli Çarpma (3. Sınıf)",
    desc: "3. Sınıf seviyesinde 10 saniye süreyle hızlı çarpma yarışı. (1, 2 veya 3 kişilik)",
    generate: () => {
      const c1 = Math.floor(Math.random() * 8) + 2;
      const c2 = Math.floor(Math.random() * 9) + 2;
      const sonuc = c1 * c2;
      return {
        question: `${c1} × ${c2} = ?`,
        questionHTML: renderSureliQuestionHTML(
          `${c1} × ${c2}`,
          "3. Sınıf Çarpma",
          "⚡ Süre dolmadan çarpımı bul!",
          "from-amber-500 via-orange-600 to-red-600"
        ),
        correct: sonuc,
        wrong: benzersizYanlislar(sonuc, [sonuc + c1, sonuc - c1, sonuc + 2, sonuc - 2], 0),
        isLong: false
      };
    }
  },

  sureli_bolme_3: {
    title: "⚡ Süreli Bölme (3. Sınıf)",
    desc: "3. Sınıf seviyesinde 10 saniye süreyle hızlı kalansız bölme yarışı. (1, 2 veya 3 kişilik)",
    generate: () => {
      const bolen = Math.floor(Math.random() * 7) + 3; // 3..9
      const bolum = Math.floor(Math.random() * 8) + 3; // 3..10
      const bolunen = bolen * bolum;
      return {
        question: `${bolunen} ÷ ${bolen} = ?`,
        questionHTML: renderSureliQuestionHTML(
          `${bolunen} ÷ ${bolen}`,
          "3. Sınıf Bölme",
          "⚡ Süre bitmeden bölümü hesapla!",
          "from-teal-500 via-emerald-600 to-cyan-600"
        ),
        correct: bolum,
        wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
        isLong: false
      };
    }
  },

  sureli_carpma_4: {
    title: "⚡ Süreli Çarpma (4. Sınıf)",
    desc: "4. Sınıf seviyesinde 10 saniye süreyle hızlı çarpma yarışı. (1, 2 veya 3 kişilik)",
    generate: () => {
      const is10 = Math.random() < 0.4;
      if (is10) {
        const c1 = Math.floor(Math.random() * 40) + 12;
        const sonuc = c1 * 10;
        return {
          question: `${c1} × 10 = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${c1} × 10`,
            "4. Sınıf Çarpma",
            "⚡ 10 ile kısa yoldan çarp!",
            "from-amber-500 via-orange-600 to-red-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + 10, sonuc - 10, sonuc + 100, sonuc - 100], 0),
          isLong: false
        };
      } else {
        const c1 = Math.floor(Math.random() * 15) + 11;
        const c2 = Math.floor(Math.random() * 6) + 3;
        const sonuc = c1 * c2;
        return {
          question: `${c1} × ${c2} = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${c1} × ${c2}`,
            "4. Sınıf Çarpma",
            "⚡ Zihinden çarp, hemen işaretle!",
            "from-amber-500 via-orange-600 to-red-600"
          ),
          correct: sonuc,
          wrong: benzersizYanlislar(sonuc, [sonuc + c2, sonuc - c2, sonuc + 10, sonuc - 10], 0),
          isLong: false
        };
      }
    }
  },

  sureli_bolme_4: {
    title: "⚡ Süreli Bölme (4. Sınıf)",
    desc: "4. Sınıf seviyesinde 10 saniye süreyle hızlı bölme yarışı. (1, 2 veya 3 kişilik)",
    generate: () => {
      const is10 = Math.random() < 0.4;
      if (is10) {
        const bolum = Math.floor(Math.random() * 45) + 11;
        const bolunen = bolum * 10;
        return {
          question: `${bolunen} ÷ 10 = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${bolunen} ÷ 10`,
            "4. Sınıf Bölme",
            "⚡ 10 ile kısa yoldan böl!",
            "from-teal-500 via-emerald-600 to-cyan-600"
          ),
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 10, bolum - 10], 1),
          isLong: false
        };
      } else {
        const bolen = Math.floor(Math.random() * 6) + 3; // 3..8
        const bolum = Math.floor(Math.random() * 15) + 8; // 8..22
        const bolunen = bolen * bolum;
        return {
          question: `${bolunen} ÷ ${bolen} = ?`,
          questionHTML: renderSureliQuestionHTML(
            `${bolunen} ÷ ${bolen}`,
            "4. Sınıf Bölme",
            "⚡ Kalansız böl, süreyi yakala!",
            "from-teal-500 via-emerald-600 to-cyan-600"
          ),
          correct: bolum,
          wrong: benzersizYanlislar(bolum, [bolum + 1, bolum - 1, bolum + 2, bolum - 2], 1),
          isLong: false
        };
      }
    }
  }
};

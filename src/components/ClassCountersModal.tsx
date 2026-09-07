import React, { useState } from 'react';
import { 
  X, Users, MousePointerClick, CheckCircle2, XCircle, 
  BarChart3, RotateCcw, Copy, Check, Sparkles, TrendingUp,
  Calendar, Clock, ShieldCheck, PieChart, Layers
} from 'lucide-react';
import { 
  ClassCountersData, 
  GradeCategoryKey, 
  resetAllCounters, 
  loadCounters 
} from '../utils/counterStorage';

interface ClassCountersModalProps {
  isOpen: boolean;
  onClose: () => void;
  countersData: ClassCountersData;
  onCountersUpdated: (newData: ClassCountersData) => void;
  playMp3?: (src: string) => void;
}

interface GradeMeta {
  key: GradeCategoryKey;
  name: string;
  badge: string;
  icon: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    bar: string;
    badgeBg: string;
  };
}

const GRADES_META: GradeMeta[] = [
  {
    key: 'grade1',
    name: '1. Sınıf',
    badge: '1. SINIF MATEMATİK',
    icon: '/icon_1.png',
    colorTheme: {
      bg: 'from-amber-950/60 to-orange-950/60',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      bar: 'bg-amber-500',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
    }
  },
  {
    key: 'grade2',
    name: '2. Sınıf',
    badge: '2. SINIF MATEMATİK',
    icon: '/icon_2.png',
    colorTheme: {
      bg: 'from-emerald-950/60 to-teal-950/60',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300',
      bar: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
    }
  },
  {
    key: 'grade3',
    name: '3. Sınıf',
    badge: '3. SINIF MATEMATİK',
    icon: '/icon_3.png',
    colorTheme: {
      bg: 'from-purple-950/60 to-indigo-950/60',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      bar: 'bg-purple-500',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40'
    }
  },
  {
    key: 'grade4',
    name: '4. Sınıf',
    badge: '4. SINIF MATEMATİK',
    icon: '/icon_4.png',
    colorTheme: {
      bg: 'from-blue-950/60 to-indigo-950/60',
      border: 'border-blue-500/40',
      text: 'text-blue-300',
      bar: 'bg-blue-500',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40'
    }
  },
  {
    key: 'otherGames',
    name: '5. Diğer Oyunlar',
    badge: 'DİĞER & ZEKA OYUNLARI',
    icon: '/icon_5.png',
    colorTheme: {
      bg: 'from-fuchsia-950/60 to-pink-950/60',
      border: 'border-pink-500/40',
      text: 'text-pink-300',
      bar: 'bg-pink-500',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40'
    }
  },
  {
    key: 'englishGames',
    name: '6. İngilizce',
    badge: 'İNGİLİZCE KELİME OYUNLARI',
    icon: '/icon_6.png',
    colorTheme: {
      bg: 'from-sky-950/60 to-cyan-950/60',
      border: 'border-sky-500/40',
      text: 'text-sky-300',
      bar: 'bg-sky-500',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40'
    }
  }
];

export const ClassCountersModal: React.FC<ClassCountersModalProps> = ({
  isOpen,
  onClose,
  countersData,
  onCountersUpdated,
  playMp3
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'questions' | 'visits'>('overview');
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Click totals
  const totalClicks = Object.values(countersData.clicks).reduce((sum, c) => sum + (c || 0), 0);

  // Question totals
  let totalSolved = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  Object.values(countersData.questions).forEach(q => {
    const c = q?.correct || 0;
    const w = q?.wrong || 0;
    totalCorrect += c;
    totalWrong += w;
    totalSolved += (c + w);
  });

  const overallSuccessRate = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  // Copy report
  const handleCopyReport = () => {
    try {
      const lines = [
        '📊 SİSTEM VE SINIF SAYAÇ RAPORU (OLCİCO)',
        '========================================',
        `👤 Toplam Site Girişi: ${countersData.visits.total}`,
        `📅 Bugünkü Girişler: ${countersData.visits.today}`,
        `🕒 Son Giriş Zamanı: ${countersData.visits.lastVisitTime || '-'}`,
        '',
        '📌 SINIFLARA TIKLANMA SAYILARI:',
        ...GRADES_META.map(g => {
          const clicks = countersData.clicks[g.key] || 0;
          const pct = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
          return ` - ${g.name}: ${clicks} tıklanma (%${pct})`;
        }),
        `Toplam Tıklanma: ${totalClicks}`,
        '',
        '📝 ÇÖZÜLEN SORULAR (SINIF SINIF):',
        ...GRADES_META.map(g => {
          const q = countersData.questions[g.key] || { correct: 0, wrong: 0 };
          const solved = q.correct + q.wrong;
          const rate = solved > 0 ? Math.round((q.correct / solved) * 100) : 0;
          return ` - ${g.name}: ${solved} soru (Doğru: ${q.correct}, Yanlış: ${q.wrong}, Başarı: %${rate})`;
        }),
        `Genel Çözülen Soru: ${totalSolved} (Doğru: ${totalCorrect}, Yanlış: ${totalWrong}, Başarı: %${overallSuccessRate})`,
        '========================================'
      ];

      navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      playMp3?.('/coin.mp3');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleReset = () => {
    const fresh = resetAllCounters();
    onCountersUpdated(fresh);
    setShowResetConfirm(false);
    playMp3?.('/coin.mp3');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md select-none overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-400/40">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-md border border-white/40 shrink-0">
              <BarChart3 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black tracking-wide text-white drop-shadow-sm uppercase">
                  Sınıf & Ziyaretçi Sayaç Paneli
                </h2>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <ShieldCheck size={11} /> Yönetici & Öğretmen
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Sınıf sınıf tıklanma, ziyaretçi girişleri ve soru çözüm analizleri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer shrink-0"
            title="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 pt-3 pb-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => {
              playMp3?.('/op.mp3');
              setActiveTab('overview');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PieChart size={15} /> Genel Özet
          </button>

          <button
            onClick={() => {
              playMp3?.('/op.mp3');
              setActiveTab('classes');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MousePointerClick size={15} /> Sınıf Tıklanmaları ({totalClicks})
          </button>

          <button
            onClick={() => {
              playMp3?.('/op.mp3');
              setActiveTab('questions');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 size={15} /> Çözülen Sorular ({totalSolved})
          </button>

          <button
            onClick={() => {
              playMp3?.('/op.mp3');
              setActiveTab('visits');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
              activeTab === 'visits'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={15} /> Ziyaretçiler ({countersData.visits.total})
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* TOP STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5 border border-blue-400/30">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Toplam Giriş
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white mt-0.5">
                    {countersData.visits.total.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-blue-300/80 mt-0.5">
                    Bugün: {countersData.visits.today}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5 border border-amber-400/30">
                    <MousePointerClick size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sınıf Tıklanma
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white mt-0.5">
                    {totalClicks.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-amber-300/80 mt-0.5">
                    6 Farklı Bölüm
                  </span>
                </div>

                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 border border-emerald-400/30">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Çözülen Soru
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white mt-0.5">
                    {totalSolved.toLocaleString('tr-TR')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-300/80 mt-0.5">
                    {totalCorrect} Doğru • {totalWrong} Yanlış
                  </span>
                </div>

                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1.5 border border-purple-400/30">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Başarı Oranı
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white mt-0.5">
                    %{overallSuccessRate}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-purple-300/80 mt-0.5">
                    Genel Ortalama
                  </span>
                </div>
              </div>

              {/* SECTION: CLASS BREAKDOWN QUICK CARDS */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Layers size={16} className="text-amber-400" /> Sınıf ve Bölüm Sayaçları Özeti
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Tıklanma ve Çözülen Sorular
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {GRADES_META.map(g => {
                    const clicks = countersData.clicks[g.key] || 0;
                    const clickPct = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
                    const q = countersData.questions[g.key] || { correct: 0, wrong: 0 };
                    const solved = q.correct + q.wrong;
                    const rate = solved > 0 ? Math.round((q.correct / solved) * 100) : 0;

                    return (
                      <div 
                        key={g.key}
                        className={`bg-gradient-to-br ${g.colorTheme.bg} border ${g.colorTheme.border} rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden`}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <img 
                            src={g.icon} 
                            alt={g.name} 
                            className="w-9 h-9 sm:w-10 sm:h-10 object-contain filter drop-shadow-md shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-sm text-white truncate leading-tight">
                              {g.name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-300/90 truncate block">
                              {g.badge}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
                          <div className="bg-black/30 rounded-lg py-1 px-1.5">
                            <span className="text-[9px] text-slate-400 uppercase block font-bold">Tıklanma</span>
                            <span className={`text-sm sm:text-base font-black ${g.colorTheme.text}`}>
                              {clicks} <span className="text-[10px] font-normal text-slate-400">(%{clickPct})</span>
                            </span>
                          </div>
                          <div className="bg-black/30 rounded-lg py-1 px-1.5">
                            <span className="text-[9px] text-slate-400 uppercase block font-bold">Çözülen Soru</span>
                            <span className="text-sm sm:text-base font-black text-white">
                              {solved} <span className="text-[10px] font-bold text-emerald-400">(%{rate})</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLASSES CLICKS */}
          {activeTab === 'classes' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                      Sınıfların Seçilme & Tıklanma Sayıları
                    </h3>
                    <p className="text-xs text-slate-400">
                      Öğrencilerin ve öğretmenlerin ana menüden hangi sınıfa kaç kez tıkladığı
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block">TOPLAM</span>
                    <span className="text-lg sm:text-2xl font-black text-amber-400">{totalClicks}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {GRADES_META.map(g => {
                    const clicks = countersData.clicks[g.key] || 0;
                    const pct = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;

                    return (
                      <div 
                        key={g.key}
                        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img src={g.icon} alt={g.name} className="w-8 h-8 object-contain" />
                            <div>
                              <span className="font-black text-sm text-white block leading-tight">
                                {g.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {g.badge}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400">
                              %{pct} Pay
                            </span>
                            <span className={`text-base sm:text-lg font-black ${g.colorTheme.text}`}>
                              {clicks} Tıklanma
                            </span>
                          </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                          <div 
                            className={`h-full ${g.colorTheme.bar} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(pct, clicks > 0 ? 3 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUESTIONS SOLVED */}
          {activeTab === 'questions' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                      Sınıf Bazında Çözülen Soru Sayıları
                    </h3>
                    <p className="text-xs text-slate-400">
                      Her sınıf seviyesinde çözülen sorular, doğru ve yanlış sayıları
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold block">TOPLAM SORU</span>
                    <span className="text-lg sm:text-2xl font-black text-emerald-400">{totalSolved}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {GRADES_META.map(g => {
                    const q = countersData.questions[g.key] || { correct: 0, wrong: 0 };
                    const solved = q.correct + q.wrong;
                    const successRate = solved > 0 ? Math.round((q.correct / solved) * 100) : 0;

                    return (
                      <div 
                        key={g.key}
                        className={`bg-slate-900/90 border ${g.colorTheme.border} rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={g.icon} alt={g.name} className="w-8 h-8 object-contain" />
                            <div>
                              <h4 className="font-black text-sm text-white leading-tight">
                                {g.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {g.badge}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            %{successRate} Başarı
                          </span>
                        </div>

                        {/* STAT NUMBERS */}
                        <div className="grid grid-cols-3 gap-2 bg-black/40 rounded-xl p-2 text-center">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Toplam</span>
                            <span className="text-base font-black text-white">{solved}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-emerald-400 block">Doğru</span>
                            <span className="text-base font-black text-emerald-400">{q.correct}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-rose-400 block">Yanlış</span>
                            <span className="text-base font-black text-rose-400">{q.wrong}</span>
                          </div>
                        </div>

                        {/* ACCURACY BAR */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                            <span>Doğruluk Dağılımı</span>
                            <span className="text-emerald-300">{q.correct} / {solved}</span>
                          </div>
                          <div className="w-full bg-rose-950/80 h-2 rounded-full overflow-hidden border border-slate-700/50 flex">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${solved > 0 ? (q.correct / solved) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISITS */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white mb-1">
                  Site Giriş & Ziyaretçi İstatistikleri
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Bu tarayıcı ve cihazda kaydedilen toplam oturum ve giriş bilgileri
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
                      <Users size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block uppercase">Toplam Site Girişi</span>
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {countersData.visits.total} kez
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                      <Calendar size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block uppercase">Bugünkü Girişler</span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        {countersData.visits.today} oturum
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                      <Clock size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block uppercase">Son Giriş Zamanı</span>
                      <span className="text-base sm:text-lg font-black text-emerald-300">
                        {countersData.visits.lastVisitTime || 'Şimdi'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                      <Sparkles size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block uppercase">İlk Sayaç Başlangıcı</span>
                      <span className="text-base sm:text-lg font-black text-purple-300">
                        {countersData.visits.firstVisitDate || countersData.visits.lastVisitTime || 'Bugün'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all border border-slate-700 cursor-pointer"
              title="Sayaç özetini panoya kopyala"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span className="text-emerald-400">Rapor Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Raporu Kopyala</span>
                </>
              )}
            </button>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs sm:text-sm font-bold transition-all border border-red-800/40 cursor-pointer"
                title="Yeni dönem veya test için sayaçları sıfırla"
              >
                <RotateCcw size={14} />
                <span>Sayaçları Sıfırla</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-600 rounded-xl p-1 px-2">
                <span className="text-[10px] sm:text-xs text-red-200 font-bold">Emin misiniz?</span>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black cursor-pointer"
                >
                  Evet, Sıfırla
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold cursor-pointer"
                >
                  İptal
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-md cursor-pointer ml-auto"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

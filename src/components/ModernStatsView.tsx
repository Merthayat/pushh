import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  BarChart2,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  Target,
  Flame,
  Award,
  BookOpen,
  X,
  Trash2,
  Users,
  Crown,
  TrendingUp
} from 'lucide-react';
import { StatRecord, GroupStatsRecord } from '../types';

export const Cute3DRobotMascotSVG: React.FC<{ sizePx?: number; className?: string }> = ({ sizePx = 90, className = '' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: sizePx, height: sizePx }}>
    <img
      src="/robot.png"
      alt="Robot Maskot"
      className="w-full h-full object-contain drop-shadow-2xl rounded-2xl hover:scale-105 transition-transform"
    />
  </div>
);

export const Cute3DStarMascotSVG = Cute3DRobotMascotSVG;

interface ModernStatsViewProps {
  statsData: Record<string, StatRecord>;
  groupStatsData?: GroupStatsRecord;
  topics: Record<string, { title: string; desc?: string; icon?: string }>;
  openedTopics?: string[];
  unlockedBadges?: string[];
  badgeCounts?: Record<string, number>;
  playerLevel?: {
    currentLevel: number;
    levelTitle: string;
    levelIcon: string;
    totalCorrect: number;
    totalBadgesEarned: number;
  };
  streak?: number;
  onSelectTopic: (topicKey: string) => void;
  onResetStats: () => void;
  confirmReset: boolean;
  setConfirmReset: (val: boolean) => void;
  onClose: () => void;
}

export const ModernStatsView: React.FC<ModernStatsViewProps> = ({
  statsData,
  groupStatsData,
  topics,
  onSelectTopic,
  onResetStats,
  confirmReset,
  setConfirmReset,
  onClose
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('hepsi');

  // Default group stats fallback
  const defaultGroups: GroupStatsRecord = {
    grup1: { id: 'grup1', name: '1. GRUP', badge: '🥇', color: 'blue', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
    grup2: { id: 'grup2', name: '2. GRUP', badge: '🥈', color: 'rose', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
    grup3: { id: 'grup3', name: '3. GRUP', badge: '🥉', color: 'emerald', dogru: 0, yanlis: 0, wins: 0, topicStats: {} },
  };

  const currentGroupStats = groupStatsData || defaultGroups;
  const groupsList = [
    currentGroupStats.grup1 || defaultGroups.grup1,
    currentGroupStats.grup2 || defaultGroups.grup2,
    currentGroupStats.grup3 || defaultGroups.grup3,
  ];

  // Available topic keys
  const allTopicKeys = Object.keys(topics);

  // Categories
  const categories = [
    { id: 'hepsi', label: 'Tüm Konular', icon: '/iconn/s38.png' },
    { id: 'sayilar', label: 'Sayılar & İşlemler', icon: '/iconn/s6.png' },
    { id: 'problemler', label: 'Problem Çözme', icon: '/iconn/s31.png' },
    { id: 'geometri', label: 'Geometri & Şekiller', icon: '/iconn/s10.png' },
    { id: 'zaman', label: 'Zaman & Saatler', icon: '/iconn/s24.png' }
  ];

  const STAT_TOPIC_ICONS: Record<string, string> = {
    geometrik_sekil_cisim: '/iconn/s10.png',
    yuz_ayrit_kose: '/iconn/s1.png',
    geometrik_oruntu: '/iconn/s2.png',
    uzamsal_iliskiler_simetri: '/iconn/s3.png',
    sivi_olcme: '/iconn/s4.png',
    tartma_olcme: '/iconn/s5.png',
    nesne_sayisi: '/iconn/s6.png',
    sayi_basamak_degeri: '/iconn/s7.png',
    deste_duzine: '/iconn/s8.png',
    kesirler: '/iconn/s9.png',
    sayi_karsilastirma: '/iconn/s11.png',
    paralarimiz: '/iconn/s12.png',
    zaman_olcme: '/iconn/s13.png',
    uzunluk_olcme: '/iconn/s14.png',
    sira_sayilari: '/iconn/s15.png',
    takvim_olcme: '/iconn/s16.png',
    ritmik_ileri_2: '/iconn/s17.png',
    ritmik_ileri_3: '/iconn/s18.png',
    ritmik_ileri_4: '/iconn/s19.png',
    ritmik_ileri_5: '/iconn/s20.png',
    ritmik_ileri_10: '/iconn/s21.png',
    ritmik_geri_2: '/iconn/s22.png',
    ritmik_geri_10: '/iconn/s23.png',
    saat_tam: '/iconn/s24.png',
    saat_yarim: '/iconn/s25.png',
    saat_ceyrek_gece: '/iconn/s26.png',
    saat_ceyrek_kala: '/iconn/s27.png',
    toplama_eldesiz_50: '/iconn/s28.png',
    toplama_eldeli_50: '/iconn/s29.png',
    verilmeyen_toplanani_bul: '/iconn/s28.png',
    zihinden_toplama: '/iconn/s30.png',
    tek_islem_toplama_problemleri: '/iconn/s31.png',
    iki_islem_toplama_problemleri: '/iconn/s32.png',
    cikarma_onluksuz_50: '/iconn/s33.png',
    cikarma_onluklu_50: '/iconn/s34.png',
    zihinden_cikarma: '/iconn/s35.png',
    tek_islem_cikarma_problemleri: '/iconn/s36.png',
    iki_islem_cikarma_problemleri: '/iconn/s37.png',
    toplama_cikarma_problemleri: '/iconn/s38.png',
    ardisik_toplama: '/iconn/s39.png',
    ritmik_carpim: '/iconn/s18.png',
    esit_paylastirma: '/iconn/s15.png',
    ardisik_cikarma: '/iconn/s34.png',
    kalansiz_bolme: '/iconn/s23.png',
    veri_grafik: '/iconn/s21.png',
  };

  const getTopicCategory = (key: string) => {
    if (key.includes('problem')) return 'problemler';
    if (key.includes('cisim') || key.includes('lab') || key.includes('geometri')) return 'geometri';
    if (key.includes('saat') || key.includes('takvim') || key.includes('zaman')) return 'zaman';
    return 'sayilar';
  };

  const filteredTopicKeys = allTopicKeys.filter(key => {
    if (categoryFilter === 'hepsi') return true;
    return getTopicCategory(key) === categoryFilter;
  });

  // Calculate totals for overall header
  const totalGroupCorrect = groupsList.reduce((sum, g) => sum + (g.dogru || 0), 0);

  return (
    <div className="fixed inset-0 bg-[#0f0a2e]/95 backdrop-blur-xl z-[300] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* VIBRANT PURPLE CONTAINER FRAME */}
      <div className="bg-gradient-to-b from-[#3b239b] via-[#2f1b82] to-[#1e0f5c] text-white rounded-[28px] sm:rounded-[36px] border-4 border-[#7d60ff]/50 shadow-[0_25px_70px_rgba(15,5,45,0.9)] max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden relative my-auto">
        
        {/* HEADER: GRUPLAR YARIŞIYOR İSTATİSTİK SAYFASI */}
        <div className="p-3.5 sm:p-5 pb-2 shrink-0">
          <div className="bg-gradient-to-r from-[#2a1380] via-[#381f96] to-[#2a1380] rounded-[22px] sm:rounded-[26px] p-3.5 sm:p-4 border-2 border-amber-400/40 shadow-xl relative overflow-hidden flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-30 shadow-md border border-white/20 active:scale-95"
              title="Kapat"
            >
              <X size={20} className="sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-300 shrink-0 text-2xl sm:text-3xl">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider">
                  <Users size={16} />
                  <span>GRUPLAR YARIŞIYOR</span>
                </div>
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  Üç Grubun İstatistik Tablosu
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-purple-200/80">
                  Tüm konularda grupların yaptığı doğru ve başarı durumları
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP SECTION: 3 GRUBUN OVERALL SUMMARY CARDS */}
        <div className="px-3.5 sm:px-5 py-2 shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* 1. GRUP CARD */}
            <div className="bg-gradient-to-b from-blue-900/90 via-indigo-950/90 to-slate-950/95 border-2 border-blue-400/80 rounded-2xl p-2 sm:p-3 text-center shadow-lg flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-sky-300" />
              <div>
                <div className="h-12 sm:h-14 flex items-center justify-center mb-1">
                  <img src="/icon_1.png" alt="1. Grup" className="h-full object-contain drop-shadow-md bg-transparent filter hover:scale-105 transition-transform" />
                </div>
                <div className="font-black text-xs sm:text-sm text-blue-300 uppercase tracking-wide truncate">
                  1. GRUP
                </div>
              </div>
              <div className="my-1 sm:my-1.5 bg-blue-950/80 rounded-xl p-1 sm:p-1.5 border border-blue-500/30">
                <div className="text-base sm:text-2xl font-black text-amber-300 leading-tight">
                  {groupsList[0].dogru}
                </div>
                <div className="text-[9px] sm:text-[10px] font-extrabold text-blue-200/90 uppercase">
                  TOPLAM DOĞRU
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-blue-200/80 pt-0.5 border-t border-blue-500/20">
                <span>Yanlış: <b className="text-rose-300">{groupsList[0].yanlis}</b></span>
                <span>🏆 <b className="text-amber-300">{groupsList[0].wins}</b></span>
              </div>
            </div>

            {/* 2. GRUP CARD */}
            <div className="bg-gradient-to-b from-rose-900/90 via-red-950/90 to-slate-950/95 border-2 border-rose-400/80 rounded-2xl p-2 sm:p-3 text-center shadow-lg flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-300" />
              <div>
                <div className="h-12 sm:h-14 flex items-center justify-center mb-1">
                  <img src="/icon_2.png" alt="2. Grup" className="h-full object-contain drop-shadow-md bg-transparent filter hover:scale-105 transition-transform" />
                </div>
                <div className="font-black text-xs sm:text-sm text-rose-300 uppercase tracking-wide truncate">
                  2. GRUP
                </div>
              </div>
              <div className="my-1 sm:my-1.5 bg-rose-950/80 rounded-xl p-1 sm:p-1.5 border border-rose-500/30">
                <div className="text-base sm:text-2xl font-black text-amber-300 leading-tight">
                  {groupsList[1].dogru}
                </div>
                <div className="text-[9px] sm:text-[10px] font-extrabold text-rose-200/90 uppercase">
                  TOPLAM DOĞRU
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-rose-200/80 pt-0.5 border-t border-rose-500/20">
                <span>Yanlış: <b className="text-rose-300">{groupsList[1].yanlis}</b></span>
                <span>🏆 <b className="text-amber-300">{groupsList[1].wins}</b></span>
              </div>
            </div>

            {/* 3. GRUP CARD */}
            <div className="bg-gradient-to-b from-emerald-900/90 via-teal-950/90 to-slate-950/95 border-2 border-emerald-400/80 rounded-2xl p-2 sm:p-3 text-center shadow-lg flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-300" />
              <div>
                <div className="h-12 sm:h-14 flex items-center justify-center mb-1">
                  <img src="/icon_3.png" alt="3. Grup" className="h-full object-contain drop-shadow-md bg-transparent filter hover:scale-105 transition-transform" />
                </div>
                <div className="font-black text-xs sm:text-sm text-emerald-300 uppercase tracking-wide truncate">
                  3. GRUP
                </div>
              </div>
              <div className="my-1 sm:my-1.5 bg-emerald-950/80 rounded-xl p-1 sm:p-1.5 border border-emerald-500/30">
                <div className="text-base sm:text-2xl font-black text-amber-300 leading-tight">
                  {groupsList[2].dogru}
                </div>
                <div className="text-[9px] sm:text-[10px] font-extrabold text-emerald-200/90 uppercase">
                  TOPLAM DOĞRU
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-emerald-200/80 pt-0.5 border-t border-emerald-500/20">
                <span>Yanlış: <b className="text-rose-300">{groupsList[2].yanlis}</b></span>
                <span>🏆 <b className="text-amber-300">{groupsList[2].wins}</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN SCROLLABLE CONTENT: KONU BAZLI GRUP DOĞRU SAYILARI */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-2 space-y-3 no-scrollbar">
          
          {/* CATEGORY FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                  categoryFilter === cat.id
                    ? 'bg-[#7c5cf7] text-white shadow-md border-amber-300 scale-102'
                    : 'bg-[#2a1380]/80 text-purple-200/80 hover:bg-[#361a99] border-purple-400/20'
                }`}
              >
                {cat.icon.startsWith('/') ? (
                  <img src={cat.icon} alt="" className="w-4 h-4 object-contain shrink-0" />
                ) : (
                  <span>{cat.icon}</span>
                )}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* TOPIC LIST WITH 3-GROUP BREAKDOWN */}
          <div className="space-y-3 pb-2">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <TrendingUp size={15} />
              <span>KONU BAZLI GRUP DOĞRU SAYILARI</span>
            </div>

            {filteredTopicKeys.map((key, idx) => {
              const topic = topics[key];
              if (!topic) return null;

              const g1Dogru = groupsList[0].topicStats[key]?.dogru || 0;
              const g1Yanlis = groupsList[0].topicStats[key]?.yanlis || 0;

              const g2Dogru = groupsList[1].topicStats[key]?.dogru || 0;
              const g2Yanlis = groupsList[1].topicStats[key]?.yanlis || 0;

              const g3Dogru = groupsList[2].topicStats[key]?.dogru || 0;
              const g3Yanlis = groupsList[2].topicStats[key]?.yanlis || 0;

              const maxDogruInTopic = Math.max(g1Dogru, g2Dogru, g3Dogru, 1);
              const topicIconPath = STAT_TOPIC_ICONS[key] || `/iconn/s${(idx % 39) + 1}.png`;

              // Find leader group
              let leaderName = '';
              if (maxDogruInTopic > 0) {
                if (g1Dogru === maxDogruInTopic && g1Dogru > g2Dogru && g1Dogru > g3Dogru) leaderName = '1. GRUP LİDER';
                else if (g2Dogru === maxDogruInTopic && g2Dogru > g1Dogru && g2Dogru > g3Dogru) leaderName = '2. GRUP LİDER';
                else if (g3Dogru === maxDogruInTopic && g3Dogru > g1Dogru && g3Dogru > g2Dogru) leaderName = '3. GRUP LİDER';
              }

              return (
                <div
                  key={key}
                  onClick={() => {
                    onSelectTopic(key);
                    onClose();
                  }}
                  className="bg-gradient-to-b from-[#2e1882] to-[#221069] hover:from-[#371e98] hover:to-[#29147d] border-2 border-purple-400/30 rounded-2xl p-3 transition-all shadow-md relative overflow-hidden group cursor-pointer"
                >
                  {/* TOPIC HEADER ROW */}
                  <div className="flex items-center gap-3 mb-2.5 pb-2 border-b border-purple-400/20">
                    <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 flex items-center justify-center shadow-md border border-amber-300 overflow-hidden">
                      <img src={topicIconPath} alt={topic.title} className="w-full h-full object-cover scale-[1.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-white truncate drop-shadow-sm flex items-center gap-2">
                        <span>{topic.title}</span>
                      </h4>
                      <p className="text-[10px] sm:text-xs text-purple-200/80 truncate">
                        {topic.desc}
                      </p>
                    </div>
                    {leaderName && (
                      <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/50 rounded-full font-black text-[9px] sm:text-[10px] uppercase shrink-0 flex items-center gap-1">
                        <Crown size={11} className="text-amber-300" />
                        <span>{leaderName}</span>
                      </span>
                    )}
                  </div>

                  {/* 3 GROUP COMPARISON PROGRESS BARS */}
                  <div className="space-y-1.5">
                    {/* 1. GRUP ROW */}
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-[10px] sm:text-xs font-black text-blue-300 truncate shrink-0 flex items-center gap-1">
                        <img src="/icon_1.png" alt="1" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0" />
                        <span>1. GRUP</span>
                      </span>
                      <div className="flex-1 bg-black/40 rounded-full h-3 overflow-hidden border border-blue-500/30 relative">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((g1Dogru / maxDogruInTopic) * 100))}%` }}
                        />
                      </div>
                      <span className="w-20 text-[10px] sm:text-xs font-black text-right shrink-0">
                        <b className="text-amber-300">{g1Dogru}</b> <span className="text-blue-200/70">doğru</span>
                      </span>
                    </div>

                    {/* 2. GRUP ROW */}
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-[10px] sm:text-xs font-black text-rose-300 truncate shrink-0 flex items-center gap-1">
                        <img src="/icon_2.png" alt="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0" />
                        <span>2. GRUP</span>
                      </span>
                      <div className="flex-1 bg-black/40 rounded-full h-3 overflow-hidden border border-rose-500/30 relative">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((g2Dogru / maxDogruInTopic) * 100))}%` }}
                        />
                      </div>
                      <span className="w-20 text-[10px] sm:text-xs font-black text-right shrink-0">
                        <b className="text-amber-300">{g2Dogru}</b> <span className="text-rose-200/70">doğru</span>
                      </span>
                    </div>

                    {/* 3. GRUP ROW */}
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-[10px] sm:text-xs font-black text-emerald-300 truncate shrink-0 flex items-center gap-1">
                        <img src="/icon_3.png" alt="3" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0" />
                        <span>3. GRUP</span>
                      </span>
                      <div className="flex-1 bg-black/40 rounded-full h-3 overflow-hidden border border-emerald-500/30 relative">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((g3Dogru / maxDogruInTopic) * 100))}%` }}
                        />
                      </div>
                      <span className="w-20 text-[10px] sm:text-xs font-black text-right shrink-0">
                        <b className="text-amber-300">{g3Dogru}</b> <span className="text-emerald-200/70">doğru</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="p-3 sm:p-4 pt-2 bg-[#1e0f5c] flex flex-col items-center shrink-0 border-t border-purple-500/30">
          <button
            onClick={() => {
              const firstTopic = allTopicKeys[0] || 'nesne_sayisi';
              onSelectTopic(firstTopic);
              onClose();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg border border-emerald-300/40 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Play size={18} fill="currentColor" />
            <span>HEMEN YARIŞMAYA BAŞLA</span>
          </button>

          {/* RESET STATS CONTROL */}
          <div className="mt-2 flex items-center justify-between w-full px-2 text-xs">
            {confirmReset ? (
              <div className="flex items-center gap-2 bg-red-950/90 p-1 px-2.5 rounded-lg border border-red-700 w-full justify-between">
                <span className="font-bold text-red-200 text-[11px]">Grup istatistikleri sıfırlansın mı?</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      onResetStats();
                      setConfirmReset(false);
                    }}
                    className="px-2 py-0.5 bg-red-600 text-white rounded font-black text-[11px] hover:bg-red-500 cursor-pointer"
                  >
                    Evet
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-0.5 bg-purple-900 text-purple-200 rounded font-bold text-[11px] hover:bg-purple-800 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-purple-300/60 hover:text-red-300 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Grup İstatistiklerini Sıfırla</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-purple-200/80 hover:text-white font-bold text-[11px] cursor-pointer"
            >
              Kapat ✕
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

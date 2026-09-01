import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Sparkles, RotateCcw, ArrowLeft, Trophy, Flame, 
  HelpCircle, Swords, Zap, CheckCircle2, XCircle, Heart, Star, Clock, Users, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ZIT_ANLAM_DATA, ES_ANLAM_DATA, INGILIZCE_DATA, WordPair } from '../data/wordPairsData';

interface WordGameModalProps {
  gameType: 'zit_anlam' | 'es_anlam' | 'ingilizce';
  onClose: () => void;
  playMp3?: (src: string, onEnded?: () => void) => void;
}

type GameMode = 'duel2' | 'duel3' | 'quiz1' | 'matching';

interface MemoryCard {
  id: string;
  pairId: number;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
  emoji?: string;
}

interface DuelPlayer {
  id: number;
  name: string;
  avatar: string;
  img: string;
  colorTheme: {
    border: string;
    bg: string;
    headerBg: string;
    optBg: string;
    text: string;
    tagBg: string;
  };
  score: number;
  lives: number;
  currentQuestion: {
    word: string;
    correct: string;
    options: string[];
    emoji?: string;
  } | null;
  selectedOption: string | null;
  feedback: 'none' | 'correct' | 'wrong';
  isEliminated: boolean;
}

const PLAYER_THEMES = [
  {
    name: '1. GRUP',
    avatar: 'KAPLAN',
    img: '/kap.png',
    border: 'border-blue-500',
    bg: 'from-blue-950/80 via-slate-900/90 to-blue-950/90',
    headerBg: 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800',
    optBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-300',
    text: 'text-blue-300',
    tagBg: 'bg-blue-500/30 text-blue-200 border-blue-400/50'
  },
  {
    name: '2. GRUP',
    avatar: 'EJDERHA',
    img: '/ejd.png',
    border: 'border-rose-500',
    bg: 'from-rose-950/80 via-slate-900/90 to-rose-950/90',
    headerBg: 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800',
    optBg: 'bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-red-500 text-white border-rose-300',
    text: 'text-rose-300',
    tagBg: 'bg-rose-500/30 text-rose-200 border-rose-400/50'
  },
  {
    name: '3. GRUP',
    avatar: 'SAVAŞÇI',
    img: '/balta.png',
    border: 'border-emerald-500',
    bg: 'from-emerald-950/80 via-slate-900/90 to-teal-950/90',
    headerBg: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-green-800',
    optBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-300',
    text: 'text-emerald-300',
    tagBg: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50'
  }
];

function generateWordQuestion(data: WordPair[], excludeWord?: string) {
  const pool = data.filter(d => d.word !== excludeWord);
  const selected = pool[Math.floor(Math.random() * pool.length)] || data[0];

  const wrongOptions = data
    .filter(d => d.word !== selected.word && d.match !== selected.match)
    .map(d => d.match)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOptions = [selected.match, ...wrongOptions].sort(() => Math.random() - 0.5);

  return {
    word: selected.word,
    correct: selected.match,
    options: allOptions,
    emoji: selected.emoji
  };
}

// Helper function for automatic max font size that never line-wraps
const getWordOptionFontSize = (options: string[], isDuel: boolean = false) => {
  const maxOptLen = Math.max(...options.map(o => String(o || '').trim().length), 0);
  if (isDuel) {
    if (maxOptLen <= 4) return 'text-sm xs:text-base sm:text-lg md:text-xl font-black';
    if (maxOptLen <= 7) return 'text-xs xs:text-sm sm:text-base md:text-lg font-black';
    if (maxOptLen <= 11) return 'text-[11px] xs:text-xs sm:text-sm md:text-base font-black';
    if (maxOptLen <= 15) return 'text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-black';
    return 'text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs font-black';
  }
  // 1-Player Quiz
  if (maxOptLen <= 4) return 'text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black';
  if (maxOptLen <= 7) return 'text-lg xs:text-xl sm:text-2xl md:text-3xl font-black';
  if (maxOptLen <= 11) return 'text-base xs:text-lg sm:text-xl md:text-2xl font-black';
  if (maxOptLen <= 15) return 'text-sm xs:text-base sm:text-lg md:text-xl font-black';
  return 'text-xs xs:text-sm sm:text-base md:text-lg font-black';
};

export const WordGameModal: React.FC<WordGameModalProps> = ({
  gameType,
  onClose,
  playMp3
}) => {
  const isZit = gameType === 'zit_anlam';
  const isEs = gameType === 'es_anlam';
  const isIng = gameType === 'ingilizce';
  const gameTitle = isIng ? 'İngilizce Kelime Oyunları' : isZit ? 'Zıt Anlamlı Kelimeler' : 'Eş Anlamlı Kelimeler';
  const gameConcept = isIng ? 'TÜRKÇE KARŞILIĞI' : isZit ? 'ZIT (Karşıt)' : 'EŞ (Anlamdaş)';

  const [englishGrade, setEnglishGrade] = useState<'all' | '2. Sınıf' | '3. Sınıf' | '4. Sınıf'>('all');

  const baseData = isIng ? INGILIZCE_DATA : isZit ? ZIT_ANLAM_DATA : ES_ANLAM_DATA;
  const rawData = useMemo(() => {
    if (isIng && englishGrade !== 'all') {
      return baseData.filter(item => item.category === englishGrade);
    }
    return baseData;
  }, [baseData, isIng, englishGrade]);

  // Active Mode: default to 2-player duel
  const [activeMode, setActiveMode] = useState<GameMode>('duel2');

  // Sound helper (TTS was completely removed per instructions)
  const playSound = (type: 'correct' | 'wrong' | 'win' | 'click' | 'flip') => {
    if (playMp3) {
      if (type === 'correct') playMp3('/para.mp3');
      else if (type === 'wrong') playMp3('/hata.mp3');
      else if (type === 'win') playMp3('/kazandinn.mp3');
      else if (type === 'flip') playMp3('/tek.mp3');
      else playMp3('/coin.mp3');
    }
  };

  // ==========================================
  // 1. MATCHING / MEMORY CARDS LOGIC
  // ==========================================
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [matchMoves, setMatchMoves] = useState(0);
  const [matchTimer, setMatchTimer] = useState(0);
  const [isMatchComplete, setIsMatchComplete] = useState(false);
  const matchDifficulty = 6; // 6 pairs = 12 cards

  const initMatchingGame = useCallback(() => {
    const shuffledSource = [...rawData].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledSource.slice(0, matchDifficulty);

    const generatedCards: MemoryCard[] = [];
    selectedPairs.forEach((pair, index) => {
      generatedCards.push({
        id: `pair-${index}-a`,
        pairId: index,
        text: pair.word,
        isFlipped: false,
        isMatched: false,
        emoji: pair.emoji?.split(' ')[0]
      });
      generatedCards.push({
        id: `pair-${index}-b`,
        pairId: index,
        text: pair.match,
        isFlipped: false,
        isMatched: false,
        emoji: pair.emoji?.split(' ')[1] || pair.emoji
      });
    });

    const shuffledCards = generatedCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCardIds([]);
    setMatchedPairsCount(0);
    setMatchMoves(0);
    setMatchTimer(0);
    setIsMatchComplete(false);
  }, [rawData, matchDifficulty]);

  useEffect(() => {
    if (activeMode === 'matching') {
      initMatchingGame();
    }
  }, [activeMode, initMatchingGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeMode === 'matching' && !isMatchComplete && cards.length > 0) {
      interval = setInterval(() => {
        setMatchTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeMode, isMatchComplete, cards.length]);

  const handleCardClick = (cardId: string) => {
    if (flippedCardIds.length >= 2 || isMatchComplete) return;

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    playSound('flip');

    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMatchMoves(m => m + 1);
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = clickedCard;

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // MATCH FOUND
        setTimeout(() => {
          playSound('correct');
          setCards(prev => prev.map(c => 
            (c.id === firstCard.id || c.id === secondCard.id) 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ));
          setFlippedCardIds([]);
          setMatchedPairsCount(prev => {
            const nextCount = prev + 1;
            if (nextCount >= matchDifficulty) {
              setIsMatchComplete(true);
              playSound('win');
              try {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              } catch {}
            }
            return nextCount;
          });
        }, 400);
      } else {
        // MISMATCH
        setTimeout(() => {
          playSound('wrong');
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCardIds([]);
        }, 900);
      }
    }
  };

  // ==========================================
  // 2. 1-PLAYER QUIZ TEST LOGIC
  // ==========================================
  const [quizScore, setQuizScore] = useState(0);
  const [quizLives, setQuizLives] = useState(3);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState<{
    word: string;
    correct: string;
    options: string[];
    emoji?: string;
  } | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isQuizGameOver, setIsQuizGameOver] = useState(false);

  const initQuiz1 = useCallback(() => {
    setQuizScore(0);
    setQuizLives(3);
    setQuizStreak(0);
    setQuizSelectedOption(null);
    setQuizFeedback('none');
    setIsQuizGameOver(false);
    setQuizQuestion(generateWordQuestion(rawData));
  }, [rawData]);

  useEffect(() => {
    if (activeMode === 'quiz1') {
      initQuiz1();
    }
  }, [activeMode, initQuiz1]);

  const handleQuizAnswer = (option: string) => {
    if (quizFeedback !== 'none' || !quizQuestion || isQuizGameOver) return;

    setQuizSelectedOption(option);
    const isCorrect = option === quizQuestion.correct;

    if (isCorrect) {
      playSound('correct');
      setQuizFeedback('correct');
      setQuizScore(s => s + 1);
      setQuizStreak(st => st + 1);

      setTimeout(() => {
        setQuizQuestion(generateWordQuestion(rawData, quizQuestion.word));
        setQuizSelectedOption(null);
        setQuizFeedback('none');
      }, 700);
    } else {
      playSound('wrong');
      setQuizFeedback('wrong');
      setQuizStreak(0);
      const nextLives = quizLives - 1;
      setQuizLives(nextLives);

      if (nextLives <= 0) {
        setTimeout(() => {
          setIsQuizGameOver(true);
          playSound('win');
        }, 800);
      } else {
        setTimeout(() => {
          setQuizQuestion(generateWordQuestion(rawData, quizQuestion.word));
          setQuizSelectedOption(null);
          setQuizFeedback('none');
        }, 1000);
      }
    }
  };

  // ==========================================
  // 3. MULTIPLAYER DUEL: 2 & 3 PLAYER LOGIC
  // ==========================================
  const [duelPlayers, setDuelPlayers] = useState<DuelPlayer[]>([]);
  const [duelWinnerIndex, setDuelWinnerIndex] = useState<number | null>(null);
  const [isDuelFinished, setIsDuelFinished] = useState(false);
  const duelTargetScore = 10;

  const initMultiplayerGame = useCallback((numPlayers: 2 | 3) => {
    const initialized: DuelPlayer[] = [];
    for (let i = 0; i < numPlayers; i++) {
      initialized.push({
        id: i,
        name: PLAYER_THEMES[i].name,
        avatar: PLAYER_THEMES[i].avatar,
        img: PLAYER_THEMES[i].img,
        colorTheme: PLAYER_THEMES[i],
        score: 0,
        lives: 3, // 3 hata yapan elenir
        currentQuestion: generateWordQuestion(rawData),
        selectedOption: null,
        feedback: 'none',
        isEliminated: false
      });
    }
    setDuelPlayers(initialized);
    setDuelWinnerIndex(null);
    setIsDuelFinished(false);
  }, [rawData]);

  useEffect(() => {
    if (activeMode === 'duel2') {
      initMultiplayerGame(2);
    } else if (activeMode === 'duel3') {
      initMultiplayerGame(3);
    }
  }, [activeMode, initMultiplayerGame]);

  const handleMultiplayerAnswer = (pIdx: number, option: string) => {
    if (isDuelFinished) return;

    setDuelPlayers(prev => {
      const p = prev[pIdx];
      if (!p || p.isEliminated || p.feedback !== 'none' || !p.currentQuestion) {
        return prev;
      }

      const isCorrect = option === p.currentQuestion.correct;
      const nextPlayers = [...prev];

      if (isCorrect) {
        playSound('correct');
        const nextScore = p.score + 1;
        nextPlayers[pIdx] = {
          ...p,
          score: nextScore,
          selectedOption: option,
          feedback: 'correct'
        };

        // Check if player reached target score (10 points)
        if (nextScore >= duelTargetScore) {
          setTimeout(() => {
            setDuelWinnerIndex(pIdx);
            setIsDuelFinished(true);
            playSound('win');
            try {
              confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
            } catch {}
          }, 300);
        } else {
          // Next question for this player
          setTimeout(() => {
            setDuelPlayers(curr => {
              const currentP = curr[pIdx];
              if (!currentP) return curr;
              const updated = [...curr];
              updated[pIdx] = {
                ...currentP,
                currentQuestion: generateWordQuestion(rawData, currentP.currentQuestion?.word),
                selectedOption: null,
                feedback: 'none'
              };
              return updated;
            });
          }, 550);
        }
      } else {
        // Wrong answer -> lose 1 life
        playSound('wrong');
        const nextLives = p.lives - 1;
        const isEliminated = nextLives <= 0;

        nextPlayers[pIdx] = {
          ...p,
          lives: nextLives,
          isEliminated,
          selectedOption: option,
          feedback: 'wrong'
        };

        if (isEliminated) {
          // Check how many players remain active
          const activeRemaining = nextPlayers.filter(pl => !pl.isEliminated);
          if (activeRemaining.length === 1) {
            const winnerIdx = activeRemaining[0].id;
            setTimeout(() => {
              setDuelWinnerIndex(winnerIdx);
              setIsDuelFinished(true);
              playSound('win');
              try {
                confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
              } catch {}
            }, 300);
          } else if (activeRemaining.length === 0) {
            // Find player with highest score
            const highestScorer = [...nextPlayers].sort((a, b) => b.score - a.score)[0];
            const winnerIdx = highestScorer ? highestScorer.id : 0;
            setTimeout(() => {
              setDuelWinnerIndex(winnerIdx);
              setIsDuelFinished(true);
              playSound('win');
            }, 300);
          }
        } else {
          // Next question for this player after brief red flash
          setTimeout(() => {
            setDuelPlayers(curr => {
              const currentP = curr[pIdx];
              if (!currentP || currentP.isEliminated) return curr;
              const updated = [...curr];
              updated[pIdx] = {
                ...currentP,
                currentQuestion: generateWordQuestion(rawData, currentP.currentQuestion?.word),
                selectedOption: null,
                feedback: 'none'
              };
              return updated;
            });
          }, 700);
        }
      }

      return nextPlayers;
    });
  };

  // Determine if completion screen should be shown
  const showCompletionScreen = 
    (activeMode === 'duel2' || activeMode === 'duel3') ? isDuelFinished :
    activeMode === 'quiz1' ? isQuizGameOver :
    activeMode === 'matching' ? isMatchComplete : false;

  const restartCurrentGame = () => {
    playSound('click');
    if (activeMode === 'matching') initMatchingGame();
    else if (activeMode === 'quiz1') initQuiz1();
    else if (activeMode === 'duel2') initMultiplayerGame(2);
    else initMultiplayerGame(3);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col font-sans select-none overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-amber-50/70 dark:from-[#0B132B] dark:via-blue-950 dark:to-slate-950 text-blue-950 dark:text-gray-100">
      {/* 1. SAME BACKGROUND IMAGE AS OTHER CLASSROOM ACTIVITIES (/intro2.png) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/intro2.png" 
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      {/* 2. TOP HEADER BAR - MATCHING CLASSROOM HEADER STYLING */}
      <header className="relative z-30 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b-3 border-yellow-400 dark:border-yellow-500/80 px-2 sm:px-4 py-1.5 flex items-center justify-between shadow-lg shrink-0">
        {/* ANA SAYFA / GERİ BUTTON */}
        <button
          onClick={onClose}
          title="Ana Sayfaya Dön"
          className="group relative w-[88px] h-[30px] sm:w-[110px] sm:h-[38px] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/butt.png')` }}
          />
          <span className="relative z-10 text-white font-black text-[9px] sm:text-xs tracking-wider [text-shadow:0_2px_0_#000,0_3px_6px_rgba(0,0,0,0.8)] uppercase select-none -translate-y-[1px]">
            GERİ DÖN
          </span>
        </button>

        {/* CENTER TITLE BADGE */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-blue-950 font-black text-[8px] sm:text-[10px] tracking-wider uppercase shadow-xs border border-white">
            <Sparkles size={10} className="text-blue-950 shrink-0" />
            <span>{isIng ? '🇬🇧 6. BÖLÜM & İNGİLİZCE OYUNLAR' : '🎲 5. BÖLÜM & DİĞER OYUNLAR'}</span>
            <Sparkles size={10} className="text-blue-950 shrink-0" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-black text-amber-950 dark:text-amber-300 tracking-wide uppercase drop-shadow-sm leading-tight mt-0.5">
            {gameTitle}
          </h1>
        </div>

        {/* RESTART BUTTON */}
        <button
          onClick={restartCurrentGame}
          title="Yeniden Başlat"
          className="group relative w-8 h-8 sm:w-10 sm:h-10 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] shrink-0"
        >
          <img 
            src="/tekrar.png" 
            alt="Yeniden Başlat" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>
      </header>

      {/* 3. MODE SELECTOR & GRADE BAR */}
      {!showCompletionScreen && (
        <div className="relative z-20 px-2 py-1 bg-black/40 backdrop-blur-sm border-b border-amber-400/30 flex flex-col items-center justify-center gap-1 shrink-0">
          <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            <button
              onClick={() => { setActiveMode('duel2'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'duel2'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 shadow-md scale-105 border-2 border-white'
                  : 'bg-white/10 text-white/85 hover:bg-white/20'
              }`}
            >
              <span>⚔️ 2 Kişilik Kapışma</span>
            </button>

            <button
              onClick={() => { setActiveMode('duel3'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'duel3'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-md scale-105 border-2 border-white'
                  : 'bg-white/10 text-white/85 hover:bg-white/20'
              }`}
            >
              <span>👑 3 Kişilik Kapışma</span>
            </button>

            <button
              onClick={() => { setActiveMode('quiz1'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'quiz1'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md scale-105 border-2 border-white'
                  : 'bg-white/10 text-white/85 hover:bg-white/20'
              }`}
            >
              <span>🎯 1 Kişilik Test</span>
            </button>

            <button
              onClick={() => { setActiveMode('matching'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'matching'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md scale-105 border-2 border-white'
                  : 'bg-white/10 text-white/85 hover:bg-white/20'
              }`}
            >
              <span>🧩 Hafıza Kartı</span>
            </button>
          </div>

          {/* ENGLISH GRADE FILTER TABS */}
          {isIng && (
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-300 mr-1 uppercase">
                Sınıf Seç:
              </span>
              {[
                { id: 'all', label: '🌟 Tüm Seviyeler' },
                { id: '2. Sınıf', label: '🎒 2. Sınıf' },
                { id: '3. Sınıf', label: '🚀 3. Sınıf' },
                { id: '4. Sınıf', label: '👑 4. Sınıf' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    setEnglishGrade(g.id as any);
                    playSound('click');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all cursor-pointer border ${
                    englishGrade === g.id
                      ? 'bg-amber-400 text-slate-950 border-white shadow-xs font-black'
                      : 'bg-white/15 text-white/90 border-white/20 hover:bg-white/25'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. MAIN GAME CONTENT AREA OR COMPLETION SCREEN */}
      <main className="relative z-10 flex-1 flex flex-col p-1.5 sm:p-3 max-w-6xl mx-auto w-full justify-between overflow-y-auto no-scrollbar min-h-0">
        
        {/* ========================================================================= */}
        {/* A. STANDARDIZED COMPLETION SCREEN (KAPIŞMA ŞAMPİYONU / 3 GÖRSEL KÜRSÜSÜ) */}
        {/* ========================================================================= */}
        {showCompletionScreen ? (
          <div 
            className="relative flex-1 flex flex-col items-center justify-center overflow-hidden w-full max-w-4xl mx-auto min-h-0 my-auto rounded-2xl bg-cover bg-center bg-no-repeat shadow-2xl border-2 border-amber-500/50 px-2 sm:px-4 py-2"
            style={{ backgroundImage: `url('/dere3.jpeg')` }}
          >
            {/* UNIFIED CONTAINER FOR HEADER & PODIUM (CENTERED IN THE CREAM PARCHMENT AREA OF DERE3.JPEG) */}
            <div className="relative w-full max-w-[560px] sm:max-w-[660px] md:max-w-[720px] flex flex-col items-center justify-center my-auto select-none px-2 py-1">
              {/* 1. TOP HEADER SECTION: bb3.png BANNER (INSIDE CREAM REGION) */}
              <div className="relative z-10 flex flex-col items-center shrink-0 w-full mb-1 sm:mb-2">
                <div className="relative w-full max-w-[360px] xs:max-w-[420px] sm:max-w-[500px] h-12 xs:h-14 sm:h-16 flex items-center justify-center px-4">
                  <div 
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]"
                    style={{ backgroundImage: `url('/bb3.png')` }}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center -translate-y-0.5 sm:-translate-y-1">
                    <h2 className="text-[13px] xs:text-[15px] sm:text-lg md:text-xl font-black text-amber-200 uppercase tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] leading-tight">
                      {(activeMode === 'duel2' || activeMode === 'duel3')
                        ? (activeMode === 'duel3' ? '🏆 3 OYUNCU KAPIŞMA ŞAMPİYONU' : '🏆 2 OYUNCU KAPIŞMA ŞAMPİYONU')
                        : activeMode === 'quiz1'
                        ? '🏆 TEST TAMAMLANDI!'
                        : '🧩 HAFIZA ŞAMPİYONU!'}
                    </h2>
                    <p className="text-[11px] xs:text-[12.5px] sm:text-sm md:text-base font-black text-yellow-300 uppercase tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] leading-tight mt-0.5">
                      {(activeMode === 'duel2' || activeMode === 'duel3')
                        ? (duelWinnerIndex === 0
                            ? '1. GRUP (KAPLAN) KAZANDI! 🥇'
                            : duelWinnerIndex === 1
                            ? '2. GRUP (EJDERHA) KAZANDI! 🥇'
                            : '3. GRUP (SAVAŞÇI) KAZANDI! 🥇')
                        : activeMode === 'quiz1'
                        ? `${quizScore} Doğru Cevapla Tebrikler! 🎉`
                        : `${matchMoves} Hamlede Tamamladın! 🎉`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. MIDDLE SECTION: 3-IMAGE PODIUM CEREMONY (CENTERED) */}
              <div className="relative z-10 w-full flex items-end justify-center py-1">
                <div className="w-full flex items-end justify-center gap-2 xs:gap-3 sm:gap-5 px-1">
                  {(() => {
                    const rankedDuelIndices = [0, 1, 2].sort((a, b) => {
                      const isWinnerA = (activeMode === 'duel2' || activeMode === 'duel3') ? a === duelWinnerIndex : a === 0;
                      const isWinnerB = (activeMode === 'duel2' || activeMode === 'duel3') ? b === duelWinnerIndex : b === 0;
                      if (isWinnerA) return -1;
                      if (isWinnerB) return 1;
                      const scoreA = duelPlayers[a]?.score ?? (a === 0 ? quizScore : 0);
                      const scoreB = duelPlayers[b]?.score ?? (b === 0 ? quizScore : 0);
                      if (scoreB !== scoreA) return scoreB - scoreA;
                      return a - b;
                    });
                    const duelGroupRanks: Record<number, number> = {};
                    rankedDuelIndices.forEach((gIdx, rankIdx) => {
                      duelGroupRanks[gIdx] = rankIdx + 1;
                    });

                    return [
                      { pIdx: 0, name: "1. GRUP", img: "/kap.png", label: "KAPLAN", headerColor: "bg-blue-600 border-blue-300" },
                      { pIdx: 1, name: "2. GRUP", img: "/ejd.png", label: "EJDERHA", headerColor: "bg-rose-600 border-rose-300" },
                      { pIdx: 2, name: "3. GRUP", img: "/balta.png", label: "SAVAŞÇI", headerColor: "bg-emerald-600 border-emerald-300" }
                    ].map((group) => {
                      const p = duelPlayers[group.pIdx] || { score: activeMode === 'quiz1' && group.pIdx === 0 ? quizScore : 0 };
                      const rank = duelGroupRanks[group.pIdx] || 1;
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

                          {/* CHARACTER IMAGE (1 OF 3 VISUALS) */}
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
                  onClick={restartCurrentGame}
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
                  onClick={onClose}
                  title="Menüye Dön"
                  className="group relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] shrink-0"
                >
                  <img 
                    src="/menu.png" 
                    alt="Menüye Dön" 
                    className="w-full h-full object-contain pointer-events-none" 
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* B. ACTIVE GAMEPLAY SCREENS (DUELS, 1-PLAYER QUIZ, MATCHING)               */
          /* ========================================================================= */
          <>
            {/* MULTIPLAYER DUEL: 2 & 3 PLAYER INDEPENDENT BOARDS */}
            {(activeMode === 'duel2' || activeMode === 'duel3') && (
              <div className="flex-1 flex flex-col w-full h-full min-h-0">
                {/* COMMON TOP BAR: TOPIC & DUEL BADGE */}
                <div
                  style={{ backgroundImage: `url('/basback.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                  className="relative overflow-hidden bg-cover bg-center rounded-2xl px-3 py-1.5 mb-2 shrink-0 flex items-center justify-between gap-2 min-h-[44px]"
                >
                  <span className="px-3 py-0.5 bg-amber-400 text-blue-950 font-black text-xs sm:text-sm rounded-xl shadow-md uppercase tracking-wider shrink-0">
                    ⚔️ {activeMode === 'duel2' ? '2' : '3'} OYUNCU DÜELLO
                  </span>
                  <div className="flex-1 min-w-0 text-center">
                    <h2 className="text-xs sm:text-base md:text-lg font-black text-amber-950 uppercase tracking-tight truncate drop-shadow-sm">
                      {gameTitle} ({gameConcept.toUpperCase()} ANLAM)
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-900/80 text-amber-300 border border-amber-400/50 font-black text-xs rounded-xl shadow-sm uppercase shrink-0">
                    HEDEF: {duelTargetScore} PUAN
                  </span>
                </div>

                {/* PLAYERS GRID */}
                <div className={`flex-1 grid grid-cols-1 ${activeMode === 'duel2' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-2 sm:gap-3 w-full min-h-0 overflow-y-auto no-scrollbar`}>
                  {duelPlayers.map((p, pIdx) => (
                    <div
                      key={p.id}
                      className={`relative flex flex-col justify-between p-2 sm:p-3 rounded-2xl sm:rounded-3xl border-3 ${p.colorTheme.border} bg-gradient-to-b ${p.colorTheme.bg} shadow-2xl overflow-hidden min-h-0 z-10 transition-all`}
                    >
                      {/* PLAYER HEADER WITH CHARACTER ICON & LIVES */}
                      <div className={`relative overflow-hidden ${p.colorTheme.headerBg} rounded-xl p-2 flex items-center justify-between shadow-md shrink-0 border border-white/40`}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img 
                            src={p.img} 
                            alt={p.name} 
                            className="w-7 h-7 sm:w-8 sm:h-8 object-contain filter drop-shadow-md shrink-0"
                          />
                          <span className="font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate drop-shadow-md">
                            {p.name} ({p.avatar})
                          </span>
                        </div>

                        {/* LIVES & SCORE */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 3 }).map((_, li) => (
                              <Heart
                                key={li}
                                size={16}
                                className={`transition-all duration-300 ${
                                  li < p.lives
                                    ? 'text-red-400 fill-red-500 filter drop-shadow-md scale-100'
                                    : 'text-slate-500 fill-slate-700/50 opacity-40 scale-90'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="bg-black/50 border border-amber-300/80 text-amber-300 px-2 py-0.5 rounded-lg font-black text-xs shadow-inner shrink-0">
                            {p.score} / {duelTargetScore}
                          </div>
                        </div>
                      </div>

                      {/* QUESTION CONTAINER - SAME WOODEN BOARD (ark22.png) AS 1-PLAYER */}
                      <div className="relative flex-1 rounded-2xl p-1 sm:p-2 my-1 sm:my-1.5 flex flex-col items-center justify-center text-center z-10 overflow-hidden min-h-[140px] sm:min-h-[160px]">
                        <div 
                          className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat pointer-events-none rounded-xl"
                          style={{ backgroundImage: `url('/ark22.png')` }}
                        />

                        {p.isEliminated ? (
                          <div className="relative z-20 flex flex-col items-center justify-center gap-1.5 p-2">
                            <div className="text-2xl sm:text-3xl animate-bounce">💔</div>
                            <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-rose-500 uppercase tracking-widest [text-shadow:0_3px_6px_#000,0_6px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_12px_rgba(225,29,72,0.95)] animate-pulse">
                              ELENDİ!
                            </div>
                            <div className="text-white/90 text-xs sm:text-sm font-black [text-shadow:0_2px_4px_#000] drop-shadow-md">
                              3 Hata Yaptı
                            </div>
                          </div>
                        ) : p.currentQuestion ? (
                          <div className="absolute top-[8%] bottom-[8%] left-[10%] right-[10%] z-10 flex flex-col items-center justify-center text-center overflow-visible px-1">
                            <div className="text-[10px] sm:text-xs font-black uppercase text-amber-300/90 tracking-wider mb-1 drop-shadow-[0_2px_4px_#000] [text-shadow:0_2px_4px_#000]">
                              {isIng ? 'TÜRKÇE ANLAMI:' : `${gameConcept.toUpperCase()} ANLAMLISI:`}
                            </div>

                            {/* TARGET WORD DISPLAY */}
                            <div className="px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-base sm:text-lg md:text-xl tracking-wide uppercase shadow-lg border-2 border-white flex items-center gap-1.5 max-w-full truncate">
                              {p.currentQuestion.emoji && <span className="text-lg">{p.currentQuestion.emoji}</span>}
                              <span className="truncate">{p.currentQuestion.word}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* 4 CHOICES GRID UNDER THE QUESTION (MATCHING 1-PLAYER & CLASSROOM DUELS) */}
                      {!p.isEliminated && p.currentQuestion && (
                        <div className="grid grid-cols-2 gap-1 sm:gap-1.5 w-full shrink-0 z-10">
                          {p.currentQuestion.options.map((opt, oIdx) => {
                            const isSelected = p.selectedOption === opt;
                            const isCorrectOpt = opt === p.currentQuestion?.correct;
                            const optFontClass = getWordOptionFontSize(p.currentQuestion?.options || [], true);
                            let btnStyle = p.colorTheme.optBg;

                            if (p.feedback !== 'none') {
                              if (isCorrectOpt) {
                                btnStyle = 'bg-emerald-500 text-slate-950 border-white shadow-emerald-500/50 scale-102';
                              } else if (isSelected && !isCorrectOpt) {
                                btnStyle = 'bg-rose-600 text-white border-rose-300 opacity-90 scale-98';
                              } else {
                                btnStyle = 'bg-slate-800/80 text-slate-400 border-slate-700 opacity-50';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={p.feedback !== 'none' || p.isEliminated}
                                onClick={() => handleMultiplayerAnswer(pIdx, opt)}
                                className={`relative px-1.5 xs:px-2 py-2 sm:py-2.5 rounded-xl ${optFontClass} tracking-wide border-2 transition-all transform active:scale-95 flex items-center justify-center text-center cursor-pointer shadow-md overflow-hidden min-h-[38px] sm:min-h-[44px] ${btnStyle}`}
                              >
                                <span className="truncate whitespace-nowrap uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] [text-shadow:0_1px_2px_#000]">{opt}</span>
                                {p.feedback !== 'none' && isCorrectOpt && (
                                  <CheckCircle2 size={14} className="ml-1 text-slate-950 shrink-0" />
                                )}
                                {p.feedback !== 'none' && isSelected && !isCorrectOpt && (
                                  <XCircle size={14} className="ml-1 text-white shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1-PLAYER TEST QUIZ */}
            {activeMode === 'quiz1' && quizQuestion && (
              <div className="flex-1 flex flex-col items-center justify-between max-w-xl mx-auto w-full py-1">
                
                {/* TOP STATS BAR */}
                <div
                  style={{ backgroundImage: `url('/basback2.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                  className="relative overflow-hidden bg-cover bg-center rounded-2xl p-2 flex justify-between items-center w-full shrink-0 mb-1.5 min-h-[44px]"
                >
                  <div className="flex items-center gap-1 z-10">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Heart
                        key={i}
                        size={20}
                        className={`transition-all duration-300 ${
                          i < quizLives
                            ? 'text-red-400 fill-red-500 filter drop-shadow-md scale-100'
                            : 'text-slate-500 fill-slate-700/50 opacity-40 scale-90'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 z-10">
                    <span className="font-black text-sm text-amber-950 uppercase tracking-wide drop-shadow-xs">
                      Skor: {quizScore}
                    </span>
                    {quizStreak >= 2 && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white font-black text-xs uppercase shadow-sm animate-pulse">
                        🔥 {quizStreak}x Seri
                      </span>
                    )}
                  </div>
                </div>

                {/* QUESTION CARD - CRISP WOODEN BOARD (ark22.png) */}
                <div className="relative flex-1 rounded-2xl p-1 sm:p-2 flex flex-col items-center justify-center text-center my-1 sm:my-1.5 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] w-full max-w-xl mx-auto z-10 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat pointer-events-none rounded-2xl"
                    style={{ backgroundImage: `url('/ark22.png')` }}
                  />

                  {/* QUESTION TEXT - INSIDE INNER WOODEN BOARD */}
                  <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] z-10 flex flex-col items-center justify-center text-center px-2 py-1">
                    <span className="text-[11px] sm:text-xs md:text-sm font-black text-amber-300 uppercase tracking-wider mb-1 drop-shadow-[0_2px_4px_#000] [text-shadow:0_2px_4px_#000]">
                      {isIng ? 'Bu Kelimenin Türkçe Anlamını Seç:' : `Bu Kelimenin ${gameConcept} Anlamlısını Seç:`}
                    </span>

                    <div className="px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xl sm:text-2xl md:text-3xl tracking-wide uppercase shadow-lg border-2 border-white flex items-center gap-2 my-1">
                      {quizQuestion.emoji && <span className="text-2xl">{quizQuestion.emoji}</span>}
                      <span>{quizQuestion.word}</span>
                    </div>
                  </div>
                </div>

                {/* 4 CHOICES - DYNAMIC AUTO FONT SIZE (NEVER LINE WRAPS) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-xl shrink-0 mt-1 sm:mt-2">
                  {quizQuestion.options.map((opt, oIdx) => {
                    const isSelected = quizSelectedOption === opt;
                    const isCorrect = opt === quizQuestion.correct;
                    const optFontClass = getWordOptionFontSize(quizQuestion.options, false);
                    let btnColor = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-300';

                    if (quizFeedback !== 'none') {
                      if (isCorrect) {
                        btnColor = 'bg-emerald-500 text-slate-950 border-white shadow-emerald-500/50 scale-102';
                      } else if (isSelected && !isCorrect) {
                        btnColor = 'bg-rose-600 text-white border-rose-300 opacity-90 scale-98';
                      } else {
                        btnColor = 'bg-slate-800 text-slate-500 border-slate-700 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={quizFeedback !== 'none'}
                        onClick={() => handleQuizAnswer(opt)}
                        className={`relative group w-full min-h-[48px] xs:min-h-[54px] sm:min-h-[60px] px-3 py-2 rounded-2xl border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-center cursor-pointer overflow-hidden filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${btnColor}`}
                      >
                        <span className={`${optFontClass} uppercase truncate whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] [text-shadow:0_2px_0_#000,0_3px_6px_rgba(0,0,0,0.95)]`}>
                          {opt}
                        </span>
                        {quizFeedback !== 'none' && isCorrect && (
                          <CheckCircle2 size={18} className="ml-1.5 text-slate-950 shrink-0 filter drop-shadow-md" />
                        )}
                        {quizFeedback !== 'none' && isSelected && !isCorrect && (
                          <XCircle size={18} className="ml-1.5 text-white shrink-0 filter drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* MEMORY CARDS MATCHING GAME */}
            {activeMode === 'matching' && (
              <div className="flex-1 flex flex-col items-center justify-between max-w-3xl mx-auto w-full py-1">
                {/* STATUS BAR */}
                <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-black/40 border border-white/20 mb-2 text-xs sm:text-sm font-black text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-amber-400" />
                    <span>Süre: {matchTimer} sn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap size={16} className="text-amber-400" />
                    <span>Hamle: {matchMoves}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Eşleşen: {matchedPairsCount} / {matchDifficulty}</span>
                  </div>
                </div>

                {/* CARDS GRID (3x4 or 4x3) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-2xl flex-1 items-center">
                  {cards.map(card => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.isFlipped || card.isMatched}
                      className={`aspect-square sm:aspect-[4/3] rounded-2xl p-2 font-black text-xs sm:text-sm md:text-base border-3 flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg ${
                        card.isMatched
                          ? 'bg-emerald-600/90 text-white border-emerald-300 opacity-90 scale-95'
                          : card.isFlipped
                          ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-white scale-102'
                          : 'bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 text-amber-200 border-indigo-400/60 hover:border-amber-300 hover:scale-102'
                      }`}
                    >
                      {card.isFlipped || card.isMatched ? (
                        <>
                          {card.emoji && <span className="text-lg sm:text-xl mb-0.5">{card.emoji}</span>}
                          <span className="leading-tight uppercase text-center break-words">{card.text}</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-amber-300/80">
                          <span className="text-xl sm:text-2xl">❓</span>
                          <span className="text-[9px] uppercase tracking-wider mt-0.5 text-amber-200/70 font-bold">Aç</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

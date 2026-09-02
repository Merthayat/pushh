import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Sparkles, ArrowLeft, Bot, Users, Trophy, Flame, 
  HelpCircle, Volume2, CheckCircle2, XCircle, Zap, Shield, Swords, Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface XOXGameProps {
  onClose: () => void;
  playMp3?: (src: string, onEnded?: () => void) => void;
}

type Player = 'X' | 'O';
type CellValue = Player | null;
type GameMode = 'pve' | 'pvp'; // pve: vs Bot, pvp: 2 Players
type Difficulty = 'easy' | 'medium' | 'hard';

export const XOXGame: React.FC<XOXGameProps> = ({ onClose, playMp3 }) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  // Game Settings
  const [gameMode, setGameMode] = useState<GameMode>('pve');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mathChallengeEnabled, setMathChallengeEnabled] = useState(false);
  
  // Scores
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<{ board: CellValue[]; turn: Player }[]>([]);

  // Math Challenge State
  const [pendingMoveIndex, setPendingMoveIndex] = useState<number | null>(null);
  const [mathQuestion, setMathQuestion] = useState<{
    text: string;
    answer: number;
    options: number[];
  } | null>(null);

  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const triggerSound = (type: 'move' | 'win' | 'draw' | 'error' | 'click') => {
    if (playMp3) {
      if (type === 'move') playMp3('/para.mp3');
      else if (type === 'win') playMp3('/nextlvl.mp3');
      else if (type === 'draw') playMp3('/coin.mp3');
      else if (type === 'error') playMp3('/hata.mp3');
      else playMp3('/tek.mp3');
    }
  };

  const checkWinner = (currentBoard: CellValue[]): { winner: Player | 'draw' | null; line: number[] | null } => {
    for (const combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw', line: null };
    }
    return { winner: null, line: null };
  };

  const generateMathQuestion = () => {
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * (mathChallengeEnabled ? 3 : 2))];
    let a = 0, b = 0, ans = 0;
    
    if (op === '+') {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 25) + 10;
      b = Math.floor(Math.random() * a) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 5) + 2;
      ans = a * b;
    }

    const wrongOpts = new Set<number>();
    while (wrongOpts.size < 3) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (wrong > 0 && wrong !== ans) {
        wrongOpts.add(wrong);
      }
    }

    const options = [ans, ...Array.from(wrongOpts)].sort(() => Math.random() - 0.5);

    return {
      text: `${a} ${op === '*' ? '×' : op} ${b} = ?`,
      answer: ans,
      options
    };
  };

  const makeMove = (index: number, player: Player) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setHistory(prev => [...prev, { board, turn }]);
    triggerSound('move');

    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameOver(result.winner, result.line);
    } else {
      setTurn(player === 'X' ? 'O' : 'X');
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;
    if (gameMode === 'pve' && turn === 'O') return; // Bot turn

    if (mathChallengeEnabled) {
      setPendingMoveIndex(index);
      setMathQuestion(generateMathQuestion());
      triggerSound('click');
    } else {
      makeMove(index, turn);
    }
  };

  const handleMathAnswer = (selectedAns: number) => {
    if (!mathQuestion || pendingMoveIndex === null) return;

    if (selectedAns === mathQuestion.answer) {
      triggerSound('win');
      makeMove(pendingMoveIndex, turn);
      setMathQuestion(null);
      setPendingMoveIndex(null);
    } else {
      triggerSound('error');
      // Pass turn to other player or miss turn
      setMathQuestion(null);
      setPendingMoveIndex(null);
      if (gameMode === 'pvp') {
        setTurn(prev => (prev === 'X' ? 'O' : 'X'));
      }
    }
  };

  // Bot Logic
  useEffect(() => {
    if (gameMode === 'pve' && turn === 'O' && !winner && !mathQuestion) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(board, difficulty);
        if (botMove !== -1) {
          makeMove(botMove, 'O');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, winner, board, difficulty, mathQuestion]);

  const getBotMove = (currentBoard: CellValue[], diff: Difficulty): number => {
    const available = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((idx): idx is number => idx !== null);

    if (available.length === 0) return -1;

    // Easy: Random
    if (diff === 'easy') {
      return available[Math.floor(Math.random() * available.length)];
    }

    // Medium & Hard: Check winning move for Bot (O)
    for (const idx of available) {
      const copy = [...currentBoard];
      copy[idx] = 'O';
      if (checkWinner(copy).winner === 'O') return idx;
    }

    // Check blocking move for Player (X)
    for (const idx of available) {
      const copy = [...currentBoard];
      copy[idx] = 'X';
      if (checkWinner(copy).winner === 'X') return idx;
    }

    // Medium: 60% smart, 40% random
    if (diff === 'medium') {
      if (Math.random() > 0.4 && currentBoard[4] === null) return 4; // Take center
      return available[Math.floor(Math.random() * available.length)];
    }

    // Hard: Minimax (Optimal)
    if (currentBoard[4] === null) return 4; // Take center
    
    // Corners preference
    const corners = [0, 2, 6, 8].filter(c => currentBoard[c] === null);
    if (corners.length > 0 && Math.random() > 0.2) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  };

  const handleGameOver = (winResult: Player | 'draw', line: number[] | null) => {
    setWinner(winResult);
    setWinningLine(line);

    if (winResult === 'X') {
      setScores(prev => ({ ...prev, X: prev.X + 1 }));
      setStreak(prev => prev + 1);
      triggerSound('win');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else if (winResult === 'O') {
      setScores(prev => ({ ...prev, O: prev.O + 1 }));
      setStreak(0);
      triggerSound(gameMode === 'pve' ? 'error' : 'win');
    } else {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      triggerSound('draw');
    }
  };

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setTurn('X');
    setPendingMoveIndex(null);
    setMathQuestion(null);
    setHistory([]);
    triggerSound('click');
  };

  const resetAll = () => {
    resetRound();
    setScores({ X: 0, O: 0, draws: 0 });
    setStreak(0);
  };

  const undoMove = () => {
    if (history.length === 0 || winner) return;
    if (gameMode === 'pve' && history.length >= 2) {
      // Undo both bot and player move
      const prev = history[history.length - 2];
      setBoard(prev.board);
      setTurn('X');
      setHistory(history.slice(0, -2));
      triggerSound('click');
    } else if (gameMode === 'pvp' && history.length >= 1) {
      const prev = history[history.length - 1];
      setBoard(prev.board);
      setTurn(prev.turn);
      setHistory(history.slice(0, -1));
      triggerSound('click');
    }
  };

  return (
    <div className="fixed inset-0 top-[48px] xs:top-[56px] sm:top-[70px] md:top-[76px] z-40 h-[calc(100dvh-48px)] xs:h-[calc(100dvh-56px)] sm:h-[calc(100dvh-70px)] md:h-[calc(100dvh-76px)] overflow-hidden flex flex-col items-center justify-between p-1 xs:p-1.5 sm:p-2.5 font-sans select-none bg-gradient-to-br from-sky-100 via-blue-50 to-amber-50/70 dark:from-[#0B132B] dark:via-blue-950 dark:to-slate-950 text-blue-950 dark:text-gray-100">
      {/* SAME POSITIVE BACKGROUND IMAGE AS OTHER CLASSROOM ACTIVITIES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/intro2.png" 
          alt="Arka Plan Görseli"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      {/* Top Game Bar - Compact, below global navigation header */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-between gap-1.5 shrink-0 mb-1 px-1">
        <button
          onClick={onClose}
          className="group relative w-[76px] h-[26px] sm:w-[92px] sm:h-[30px] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] shrink-0"
        >
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url('/butt.png')` }}
          />
          <span className="relative z-10 text-white font-black text-[9px] sm:text-xs tracking-wider [text-shadow:0_2px_0_#000,0_3px_6px_rgba(0,0,0,0.8)] uppercase select-none -translate-y-[1px]">
            MENÜ
          </span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-blue-950 font-black text-[11px] sm:text-xs md:text-sm tracking-wider uppercase shadow-md border-2 border-white">
          <Sparkles size={14} className="shrink-0" />
          <span>XOX (TİC-TAC-TOE)</span>
          <img src="/icon_5.png" alt="Oyun İkonu" className="h-5 sm:h-6 w-auto object-contain shrink-0 filter drop-shadow-xs" />
        </div>

        <button
          onClick={resetAll}
          title="Tüm Skorları Sıfırla"
          className="group relative w-7 h-7 sm:w-8 sm:h-8 aspect-square transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] shrink-0"
        >
          <img 
            src="/tekrar.png" 
            alt="Tüm Skorları Sıfırla" 
            className="w-full h-full object-contain pointer-events-none" 
          />
        </button>
      </div>

      {/* Main Content Container - Flex-1 No Scroll, perfectly fits viewport */}
      <div className="w-full max-w-lg flex-1 min-h-0 flex flex-col items-center justify-between py-0.5 sm:py-1 gap-1 z-10">
        
        {/* Game Mode & Difficulty Controls */}
        <div className="w-full flex flex-wrap items-center justify-center gap-1.5 bg-slate-900/85 p-1.5 sm:p-2 rounded-2xl border-2 border-indigo-500/40 backdrop-blur-sm shadow-lg shrink-0">
          {/* PVP / PVE Toggle */}
          <div className="flex rounded-xl bg-slate-950 p-0.5 border border-white/10 shrink-0">
            <button
              onClick={() => {
                setGameMode('pve');
                resetRound();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                gameMode === 'pve'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot size={13} />
              <span>Robot'a Karşı</span>
            </button>
            <button
              onClick={() => {
                setGameMode('pvp');
                resetRound();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                gameMode === 'pvp'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={13} />
              <span>2 Kişilik</span>
            </button>
          </div>

          {/* Bot Difficulty (Visible only in PVE) */}
          {gameMode === 'pve' && (
            <div className="flex rounded-xl bg-slate-950 p-0.5 border border-white/10 shrink-0">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    resetRound();
                  }}
                  className={`px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold capitalize transition-all cursor-pointer ${
                    difficulty === d
                      ? d === 'hard'
                        ? 'bg-red-600 text-white shadow-md'
                        : d === 'medium'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d === 'easy' ? 'Kolay' : d === 'medium' ? 'Orta' : '👑 Zor'}
                </button>
              ))}
            </div>
          )}

          {/* Math Challenge Toggle */}
          <button
            onClick={() => {
              setMathChallengeEnabled(prev => !prev);
              triggerSound('click');
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              mathChallengeEnabled
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-300 shadow-md ring-2 ring-purple-400/50'
                : 'bg-slate-950/80 text-purple-300 border-purple-500/30 hover:bg-purple-950/40'
            }`}
          >
            <Brain size={13} className={mathChallengeEnabled ? 'animate-bounce' : ''} />
            <span>Matematik Sorulu XOX</span>
          </button>
        </div>

        {/* Score & Turn Banner */}
        <div className="w-full grid grid-cols-3 gap-1.5 text-center shrink-0">
          {/* Player X Card */}
          <div className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all backdrop-blur-md ${
            turn === 'X' && !winner
              ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-102 ring-2 ring-cyan-400/30'
              : 'bg-slate-900/80 border-cyan-800/40 opacity-85'
          }`}>
            <div className="flex items-center justify-center gap-1 text-cyan-400 text-[10px] sm:text-xs font-black">
              <span>{gameMode === 'pve' ? 'Sen (X)' : '1. Oyuncu (X)'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">{scores.X}</div>
            <div className="text-[9px] font-bold text-cyan-300">Galibiyet</div>
          </div>

          {/* Draws / Status Card */}
          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 border-2 border-slate-700/50 backdrop-blur-md flex flex-col justify-center items-center">
            <div className="text-[10px] font-bold text-slate-400">Beraberlik</div>
            <div className="text-lg sm:text-xl font-black text-slate-200 leading-none">{scores.draws}</div>
            {streak > 1 && (
              <div className="text-[9px] font-black text-amber-400 flex items-center gap-0.5 mt-0.5">
                <Flame size={11} className="fill-amber-400 text-amber-400" />
                <span>{streak} Seri!</span>
              </div>
            )}
          </div>

          {/* Player O Card */}
          <div className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all backdrop-blur-md ${
            turn === 'O' && !winner
              ? 'bg-amber-950/90 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-102 ring-2 ring-amber-400/30'
              : 'bg-slate-900/80 border-amber-800/40 opacity-85'
          }`}>
            <div className="flex items-center justify-center gap-1 text-amber-400 text-[10px] sm:text-xs font-black">
              <span>{gameMode === 'pve' ? 'Robot (O)' : '2. Oyuncu (O)'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">{scores.O}</div>
            <div className="text-[9px] font-bold text-amber-300">Galibiyet</div>
          </div>
        </div>

        {/* Turn Indicator Message */}
        <div className="h-5 flex items-center justify-center shrink-0">
          {winner === 'X' ? (
            <span className="text-xs sm:text-sm font-black text-cyan-400 animate-pulse flex items-center gap-1">
              🎉 {gameMode === 'pve' ? 'Tebrikler, Sen Kazandın!' : '1. Oyuncu (X) Kazandı!'}
            </span>
          ) : winner === 'O' ? (
            <span className="text-xs sm:text-sm font-black text-amber-400 animate-pulse flex items-center gap-1">
              👑 {gameMode === 'pve' ? 'Robot Kazandı!' : '2. Oyuncu (O) Kazandı!'}
            </span>
          ) : winner === 'draw' ? (
            <span className="text-xs sm:text-sm font-black text-yellow-300">
              🤝 Dostluk Kazandı! Berabere!
            </span>
          ) : (
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1 [text-shadow:0_1px_2px_rgba(255,255,255,0.7)] dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
              Sıra: <span className={turn === 'X' ? 'text-blue-600 dark:text-cyan-400 font-black' : 'text-amber-600 dark:text-amber-400 font-black'}>
                {turn === 'X' ? (gameMode === 'pve' ? 'Senin Hamlen (X)' : '1. Oyuncu (X)') : (gameMode === 'pve' ? 'Robot Düşünüyor... (O)' : '2. Oyuncu (O)')}
              </span>
            </span>
          )}
        </div>

        {/* 3x3 XOX Game Board - Scaled to fit viewport without scrolling */}
        <div className="relative p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-3 border-indigo-500/50 shadow-[0_8px_25px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2)] shrink-0">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
            {board.map((cell, idx) => {
              const isWinningCell = winningLine?.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={Boolean(cell || winner || (gameMode === 'pve' && turn === 'O'))}
                  className={`w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl md:text-5xl transition-all transform cursor-pointer select-none ${
                    cell === null
                      ? 'bg-slate-800/90 hover:bg-slate-700/90 border-2 border-slate-700 hover:border-indigo-400/80 shadow-md hover:scale-103 active:scale-95'
                      : isWinningCell
                      ? cell === 'X'
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-3 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-105 animate-bounce'
                        : 'bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 border-3 border-white shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-105 animate-bounce'
                      : cell === 'X'
                      ? 'bg-cyan-950/90 text-cyan-400 border-2 border-cyan-500/50 shadow-inner'
                      : 'bg-amber-950/90 text-amber-400 border-2 border-amber-500/50 shadow-inner'
                  }`}
                >
                  {cell === 'X' && (
                    <span className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]">X</span>
                  )}
                  {cell === 'O' && (
                    <span className="drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">O</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Game Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
          {history.length > 0 && !winner && (
            <button
              onClick={undoMove}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] sm:text-xs border border-white/20 transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <RotateCcw size={14} />
              <span>Geri Al</span>
            </button>
          )}

          <button
            onClick={resetRound}
            className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black text-xs sm:text-sm border-2 border-emerald-300 shadow-[0_4px_12px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={15} />
            <span>{winner ? 'Yeni Tur Başlat' : 'Yeniden Dağıt'}</span>
          </button>
        </div>
      </div>

      {/* Math Challenge Modal Overlay */}
      {mathQuestion && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-gradient-to-b from-indigo-900 to-slate-950 p-5 rounded-3xl border-3 border-amber-400 shadow-2xl text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black uppercase mb-3 shadow-md">
              <Brain size={15} />
              <span>Hamle İçin Hızlı İşlem!</span>
            </div>

            <h3 className="text-3xl font-black text-amber-300 drop-shadow-md mb-2">
              {mathQuestion.text}
            </h3>
            <p className="text-xs font-bold text-slate-300 mb-4">
              Kareyi kapmak için doğru cevabı seç:
            </p>

            <div className="grid grid-cols-2 gap-2.5 w-full">
              {mathQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMathAnswer(opt)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xl border-2 border-indigo-400/50 hover:border-white shadow-lg transition-all transform active:scale-95 cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setMathQuestion(null);
                setPendingMoveIndex(null);
              }}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

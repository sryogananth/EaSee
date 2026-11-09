import React, { useState, useEffect } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Volume2, Trophy, RefreshCw } from 'lucide-react';

interface MatrixOddOneOutGameProps {
  pair: ConfusionPair;
  childAge: number;
  onCompleteRound: (score: { correct: number; total: number }) => void;
}

export const MatrixOddOneOutGame: React.FC<MatrixOddOneOutGameProps> = ({
  pair,
  childAge,
  onCompleteRound,
}) => {
  const gridSize = childAge <= 5 ? 3 : 4;
  const totalTiles = gridSize * gridSize;

  const [round, setRound] = useState(1);
  const maxRounds = 5;
  const [majorityChar, setMajorityChar] = useState('');
  const [oddChar, setOddChar] = useState('');
  const [oddIndex, setOddIndex] = useState(0);
  const [wrongClicks, setWrongClicks] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [correctTotal, setCorrectTotal] = useState(0);

  useEffect(() => {
    startNewRound(1);
  }, [pair]);

  const startNewRound = (roundNum: number) => {
    const isOddA = Math.random() > 0.5;
    const odd = isOddA ? pair.charA : pair.charB;
    const majority = isOddA ? pair.charB : pair.charA;
    const targetIdx = Math.floor(Math.random() * totalTiles);

    setMajorityChar(majority);
    setOddChar(odd);
    setOddIndex(targetIdx);
    setWrongClicks([]);
    setRound(roundNum);

    sound.speak(`Find the hidden ${odd} among the ${majority}'s!`);
  };

  const handleTileClick = (index: number) => {
    if (isFinished) return;

    if (index === oddIndex) {
      sound.playCorrect();
      fireStarBurst();
      const updatedTotal = correctTotal + 1;
      setCorrectTotal(updatedTotal);

      if (round >= maxRounds) {
        setIsFinished(true);
        sound.playFanfare();
        onCompleteRound({ correct: updatedTotal, total: maxRounds });
      } else {
        setTimeout(() => {
          startNewRound(round + 1);
        }, 800);
      }
    } else {
      sound.playGentleRetry();
      if (!wrongClicks.includes(index)) {
        setWrongClicks((prev) => [...prev, index]);
      }
    }
  };

  return (
    <div className="relative w-full rounded-3xl glass-card p-4 sm:p-6 md:p-8 shadow-sm border border-white/90">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full">
              Detective Hunt 🕵️
            </span>
            <span className="text-xs font-black text-slate-500">
              Round {round} / {maxRounds}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 mt-1">
            <span>Find the Odd</span>
            <span className="text-2xl sm:text-3xl text-rose-600 font-dyslexic font-black px-2 py-0.5 glass-card-amber rounded-xl">
              {oddChar}
            </span>
            <button
              onClick={() => sound.speak(`Find the intruder letter ${oddChar}!`, true)}
              className="p-1 hover:bg-rose-100/80 rounded-full text-rose-600 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] sm:text-xs font-bold text-slate-500">Stars</span>
          <div className="text-base sm:text-lg font-black text-rose-950">⭐ {correctTotal}</div>
        </div>
      </div>

      {/* Grid Matrix */}
      <div
        className="max-w-md mx-auto grid gap-2 sm:gap-3 p-3 sm:p-4 glass-card bg-white/75 rounded-3xl border border-white/90 shadow-sm"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalTiles }).map((_, i) => {
          const isOdd = i === oddIndex;
          const char = isOdd ? oddChar : majorityChar;
          const wasWrong = wrongClicks.includes(i);

          return (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              className={`aspect-square rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl transition-all duration-150 select-none font-dyslexic bouncy-glass-btn ${
                wasWrong
                  ? 'bg-rose-100/80 border-rose-300 text-rose-400 opacity-50 scale-95'
                  : 'bg-white/80 border-white/90 text-slate-800 hover:scale-105'
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>

      {/* Finished Modal */}
      {isFinished && (
        <div className="mt-4 glass-card bg-white/95 p-4 sm:p-5 text-center max-w-sm mx-auto shadow-md animate-scale-in">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-1.5" />
          <h4 className="text-lg font-black text-slate-800">Sharp Eyed Detective!</h4>
          <p className="text-xs text-slate-600 mt-0.5 mb-3">
            You spotted all the hidden {oddChar}'s without getting confused!
          </p>
          <button
            onClick={() => {
              setIsFinished(false);
              setCorrectTotal(0);
              startNewRound(1);
            }}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 bouncy-glass-btn text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

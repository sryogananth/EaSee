import React, { useState, useEffect } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Search, Volume2, Sparkles, Trophy, RefreshCw } from 'lucide-react';

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
  const gridSize = childAge <= 5 ? 3 : 4; // 3x3 for little ones, 4x4 for older
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
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-rose-50/70 to-pink-50/70 border-4 border-rose-200 p-4 md:p-8 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Odd-One-Out Detective</span>
            <span className="bg-rose-200 text-rose-900 text-xs font-black px-2 py-0.5 rounded-full">
              Round {round} / {maxRounds}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 mt-1">
            <span>Spot the Odd</span>
            <span className="text-3xl text-rose-600 font-dyslexic font-black px-2 py-0.5 bg-white rounded-xl shadow-xs border border-rose-200">
              {oddChar}
            </span>
            <button
              onClick={() => sound.speak(`Find the intruder letter ${oddChar}!`, true)}
              className="p-1 hover:bg-rose-100 rounded-full text-rose-600 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500">Detective Score</span>
          <div className="text-lg font-black text-rose-950">{correctTotal} Stars</div>
        </div>
      </div>

      {/* Grid Matrix */}
      <div
        className="max-w-md mx-auto grid gap-3 p-4 bg-white/80 rounded-3xl border-2 border-rose-200 shadow-md"
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
              className={`aspect-square rounded-2xl flex items-center justify-center font-black text-3xl md:text-4xl transition-all duration-150 border-2 select-none font-dyslexic ${
                wasWrong
                  ? 'bg-rose-100 border-rose-300 text-rose-400 opacity-60 scale-95'
                  : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50 hover:scale-105 active:scale-95 shadow-sm text-slate-800'
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>

      {/* Victory modal */}
      {isFinished && (
        <div className="mt-6 bg-white rounded-2xl border-2 border-rose-300 p-5 text-center max-w-sm mx-auto shadow-md animate-scale-in">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2" />
          <h4 className="text-xl font-black text-slate-800">Sharp Eyed Detective!</h4>
          <p className="text-xs text-slate-600 mt-1 mb-4">
            You spotted all the hidden {oddChar}'s without getting confused!
          </p>
          <button
            onClick={() => {
              setIsFinished(false);
              setCorrectTotal(0);
              startNewRound(1);
            }}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 bouncy-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

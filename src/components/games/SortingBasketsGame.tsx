import React, { useState, useEffect } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { ArrowLeft, ArrowRight, Volume2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface SortingItem {
  id: number;
  content: string;
  targetSide: 'A' | 'B';
  label: string;
}

interface SortingBasketsGameProps {
  pair: ConfusionPair;
  childAge: number;
  onCompleteRound: (score: { correct: number; total: number }) => void;
}

export const SortingBasketsGame: React.FC<SortingBasketsGameProps> = ({
  pair,
  childAge,
  onCompleteRound,
}) => {
  const [deck, setDeck] = useState<SortingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animatingSide, setAnimatingSide] = useState<'A' | 'B' | null>(null);

  // Generate a round of 8 items mixing the characters and sample words
  useEffect(() => {
    generateDeck();
  }, [pair]);

  const generateDeck = () => {
    const items: SortingItem[] = [];
    let id = 1;

    // Direct characters
    for (let i = 0; i < 3; i++) {
      items.push({ id: id++, content: pair.charA, targetSide: 'A', label: `Letter ${pair.charA}` });
      items.push({ id: id++, content: pair.charB, targetSide: 'B', label: `Letter ${pair.charB}` });
    }

    // Example words
    if (pair.examplesA.length > 0) {
      items.push({ id: id++, content: pair.examplesA[0], targetSide: 'A', label: pair.examplesA[0] });
    }
    if (pair.examplesB.length > 0) {
      items.push({ id: id++, content: pair.examplesB[0], targetSide: 'B', label: pair.examplesB[0] });
    }

    // Shuffle deck
    setDeck(items.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setMistakes(0);
    setIsFinished(false);
  };

  const currentItem = deck[currentIndex];

  useEffect(() => {
    if (currentItem) {
      sound.speak(`Where does ${currentItem.content} go?`);
    }
  }, [currentIndex, currentItem]);

  const handleChoice = (side: 'A' | 'B') => {
    if (!currentItem || isFinished) return;

    setAnimatingSide(side);

    if (currentItem.targetSide === side) {
      sound.playCorrect();
      setScore((s) => s + 1);
    } else {
      sound.playGentleRetry();
      setMistakes((m) => m + 1);
      const correctName = currentItem.targetSide === 'A' ? pair.animalA.name : pair.animalB.name;
      sound.speak(`Not quite! That belongs to ${correctName}!`);
    }

    setTimeout(() => {
      setAnimatingSide(null);
      if (currentIndex + 1 >= deck.length) {
        setIsFinished(true);
        sound.playFanfare();
        fireStarBurst();
        onCompleteRound({ correct: score + (currentItem.targetSide === side ? 1 : 0), total: deck.length });
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 450);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-indigo-50/60 to-purple-50/60 border-4 border-indigo-200 p-4 md:p-8 shadow-sm">
      {/* Header & Score Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Sorting Kingdom</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-800">
            Feed the Right Basket! 🧺
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Progress:</span>
          <span className="text-base font-black text-indigo-900">
            {currentIndex + 1} / {deck.length}
          </span>
          <div className="w-20 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Basket (Character A) */}
        <div
          onClick={() => handleChoice('A')}
          className={`cursor-pointer rounded-3xl p-5 border-4 transition-all duration-200 flex flex-col items-center text-center bouncy-btn ${
            animatingSide === 'A'
              ? 'scale-105 border-emerald-400 bg-emerald-50'
              : 'border-blue-300 bg-gradient-to-b from-blue-50 to-indigo-50 hover:border-blue-400 hover:scale-102'
          }`}
          style={{ minHeight: '260px' }}
        >
          <div className="text-5xl mb-2 animate-bounce-gentle">{pair.animalA.emoji}</div>
          <h4 className="text-lg font-black text-slate-800">{pair.animalA.name}</h4>
          <span className="text-4xl font-black text-blue-600 font-dyslexic my-2">
            {pair.charA}
          </span>
          <p className="text-xs font-bold text-slate-500 mt-auto bg-white/80 py-1.5 px-3 rounded-xl border border-blue-200">
            {pair.visualCueA}
          </p>
          <button
            type="button"
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Put Here</span>
          </button>
        </div>

        {/* Center Card to Sort */}
        <div className="flex flex-col items-center justify-center">
          {currentItem && !isFinished ? (
            <div className="relative w-44 h-48 md:w-52 md:h-56 bg-white rounded-3xl border-4 border-amber-300 shadow-xl flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
              <span className="absolute top-2.5 right-2.5 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                CARD
              </span>
              <span className="text-6xl md:text-7xl font-black text-slate-800 font-dyslexic my-auto select-none">
                {currentItem.content}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.speak(currentItem.content, true);
                }}
                className="mt-auto p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors flex items-center gap-1 text-xs font-bold px-3"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-white rounded-3xl border-2 border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-extrabold text-slate-700">All Sorted!</p>
            </div>
          )}
        </div>

        {/* Right Basket (Character B) */}
        <div
          onClick={() => handleChoice('B')}
          className={`cursor-pointer rounded-3xl p-5 border-4 transition-all duration-200 flex flex-col items-center text-center bouncy-btn ${
            animatingSide === 'B'
              ? 'scale-105 border-emerald-400 bg-emerald-50'
              : 'border-emerald-300 bg-gradient-to-b from-emerald-50 to-teal-50 hover:border-emerald-400 hover:scale-102'
          }`}
          style={{ minHeight: '260px' }}
        >
          <div className="text-5xl mb-2 animate-bounce-gentle">{pair.animalB.emoji}</div>
          <h4 className="text-lg font-black text-slate-800">{pair.animalB.name}</h4>
          <span className="text-4xl font-black text-emerald-600 font-dyslexic my-2">
            {pair.charB}
          </span>
          <p className="text-xs font-bold text-slate-500 mt-auto bg-white/80 py-1.5 px-3 rounded-xl border border-emerald-200">
            {pair.visualCueB}
          </p>
          <button
            type="button"
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Put Here</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Victory Modal */}
      {isFinished && (
        <div className="mt-6 bg-white rounded-2xl border-2 border-emerald-300 p-5 text-center max-w-md mx-auto shadow-md animate-scale-in">
          <div className="text-3xl mb-1">🎉</div>
          <h4 className="text-xl font-black text-slate-800">Master Sorter!</h4>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            You scored {score} out of {deck.length} correctly!
          </p>
          <button
            onClick={generateDeck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-6 rounded-xl text-sm inline-flex items-center gap-2 bouncy-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sort Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

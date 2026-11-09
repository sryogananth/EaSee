import React, { useState, useEffect } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { ArrowLeft, ArrowRight, Volume2, CheckCircle2, RefreshCw } from 'lucide-react';

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

  useEffect(() => {
    generateDeck();
  }, [pair]);

  const generateDeck = () => {
    const items: SortingItem[] = [];
    let id = 1;

    for (let i = 0; i < 3; i++) {
      items.push({ id: id++, content: pair.charA, targetSide: 'A', label: `Letter ${pair.charA}` });
      items.push({ id: id++, content: pair.charB, targetSide: 'B', label: `Letter ${pair.charB}` });
    }

    if (pair.examplesA.length > 0) {
      items.push({ id: id++, content: pair.examplesA[0], targetSide: 'A', label: pair.examplesA[0] });
    }
    if (pair.examplesB.length > 0) {
      items.push({ id: id++, content: pair.examplesB[0], targetSide: 'B', label: pair.examplesB[0] });
    }

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
    }, 400);
  };

  return (
    <div className="relative w-full rounded-3xl glass-card p-4 sm:p-6 md:p-8 shadow-sm border border-white/90">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
            Sorting Kingdom 🧺
          </span>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5">
            Feed the Right Basket!
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-indigo-950">
            {currentIndex + 1} / {deck.length}
          </span>
          <div className="w-16 sm:w-20 h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex) / deck.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Play Area - On Mobile: Center Card first, then 2 Baskets side-by-side */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 items-center">
        
        {/* Center Card (On Mobile shows first) */}
        <div className="order-1 md:order-2 w-full flex flex-col items-center justify-center my-2">
          {currentItem && !isFinished ? (
            <div className="relative w-40 h-44 sm:w-48 sm:h-52 glass-card bg-white/90 rounded-3xl border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center p-3 animate-scale-in">
              <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                CARD
              </span>
              <span className="text-5xl sm:text-6xl font-black text-slate-800 font-dyslexic my-auto select-none">
                {currentItem.content}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.speak(currentItem.content, true);
                }}
                className="mt-auto py-1 px-3 glass-pill hover:bg-amber-100 text-amber-900 rounded-full transition-colors flex items-center gap-1 text-[11px] font-extrabold"
              >
                <Volume2 className="w-3 h-3 text-amber-700" />
                <span>Hear Sound</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-4 glass-card">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-1" />
              <p className="font-extrabold text-xs text-slate-700">All Done!</p>
            </div>
          )}
        </div>

        {/* Left Basket (Character A) */}
        <div
          onClick={() => handleChoice('A')}
          className={`order-2 md:order-1 w-full cursor-pointer rounded-3xl p-4 border transition-all duration-200 flex flex-col items-center text-center bouncy-glass-btn ${
            animatingSide === 'A'
              ? 'scale-105 border-emerald-400 bg-emerald-50/90 ring-4 ring-emerald-200'
              : 'glass-card-sky hover:border-blue-300'
          }`}
          style={{ minHeight: '190px' }}
        >
          <div className="text-4xl mb-1">{pair.animalA.emoji}</div>
          <h4 className="text-sm sm:text-base font-black text-slate-800">{pair.animalA.name}</h4>
          <span className="text-3xl sm:text-4xl font-black text-blue-600 font-dyslexic my-1">
            {pair.charA}
          </span>
          <p className="text-[10px] font-bold text-slate-500 mt-auto glass-pill py-1 px-2.5 rounded-xl truncate max-w-full">
            {pair.visualCueA}
          </p>
          <button
            type="button"
            className="w-full mt-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Put in {pair.charA} Basket</span>
          </button>
        </div>

        {/* Right Basket (Character B) */}
        <div
          onClick={() => handleChoice('B')}
          className={`order-3 md:order-3 w-full cursor-pointer rounded-3xl p-4 border transition-all duration-200 flex flex-col items-center text-center bouncy-glass-btn ${
            animatingSide === 'B'
              ? 'scale-105 border-emerald-400 bg-emerald-50/90 ring-4 ring-emerald-200'
              : 'glass-card-mint hover:border-emerald-300'
          }`}
          style={{ minHeight: '190px' }}
        >
          <div className="text-4xl mb-1">{pair.animalB.emoji}</div>
          <h4 className="text-sm sm:text-base font-black text-slate-800">{pair.animalB.name}</h4>
          <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-dyslexic my-1">
            {pair.charB}
          </span>
          <p className="text-[10px] font-bold text-slate-500 mt-auto glass-pill py-1 px-2.5 rounded-xl truncate max-w-full">
            {pair.visualCueB}
          </p>
          <button
            type="button"
            className="w-full mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Put in {pair.charB} Basket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Finished Summary */}
      {isFinished && (
        <div className="mt-4 glass-card bg-white/95 p-4 text-center max-w-sm mx-auto shadow-md animate-scale-in">
          <div className="text-3xl mb-1">🎉</div>
          <h4 className="text-lg font-black text-slate-800">Master Sorter!</h4>
          <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
            You sorted {score} out of {deck.length} correctly!
          </p>
          <button
            onClick={generateDeck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 px-5 rounded-xl text-xs inline-flex items-center gap-1.5 bouncy-glass-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sort Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

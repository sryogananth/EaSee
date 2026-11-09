import React, { useState } from 'react';
import { UserProfile, ConfusionPair } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TraceCanvasGame } from './games/TraceCanvasGame';
import { SortingBasketsGame } from './games/SortingBasketsGame';
import { MatrixOddOneOutGame } from './games/MatrixOddOneOutGame';
import { PhysicalMidlineGym } from './games/PhysicalMidlineGym';
import { sound } from '../utils/sound';
import { Sparkles, Gamepad2, Play, Volume2, Star } from 'lucide-react';

interface EndlessArcadeViewProps {
  profile: UserProfile;
  onUpdateStats: (pairId: string, stats: { correct: number; total: number }, starsEarned: number) => void;
}

export const EndlessArcadeView: React.FC<EndlessArcadeViewProps> = ({
  profile,
  onUpdateStats,
}) => {
  const [selectedPairId, setSelectedPairId] = useState<string>('b-d');
  const [activeGame, setActiveGame] = useState<'balloon' | 'trace' | 'sort' | 'matrix' | 'midline'>('balloon');

  const selectedPair = CONFUSION_PAIRS.find((p) => p.id === selectedPairId) || CONFUSION_PAIRS[0];

  const handleGameComplete = (score: { correct: number; total: number }) => {
    const earnedStars = Math.max(1, Math.round((score.correct / Math.max(1, score.total)) * 4));
    onUpdateStats(selectedPair.id, score, earnedStars);
  };

  const games = [
    { id: 'balloon' as const, name: 'Balloon Pop', emoji: '🎈', color: 'border-sky-300 bg-sky-50', desc: 'Pop floating targets before they escape!' },
    { id: 'trace' as const, name: 'Rainbow Trace', emoji: '✏️', color: 'border-amber-300 bg-amber-50', desc: 'Motor memory checkpoints & stroke order' },
    { id: 'sort' as const, name: 'Sorting Baskets', emoji: '🧺', color: 'border-indigo-300 bg-indigo-50', desc: 'Feed characters into animal homes' },
    { id: 'matrix' as const, name: 'Odd-One-Out', emoji: '🕵️', color: 'border-rose-300 bg-rose-50', desc: 'Spot mirror-flipped intruder letters' },
    { id: 'midline' as const, name: 'Midline Gym', emoji: '🧠', color: 'border-teal-300 bg-teal-50', desc: 'Lazy 8 tracking & bilateral rhythm' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-4 border-sky-300 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4 text-sky-600" />
            <span>Endless Practice Lab</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            Play As Long As You Like! 🚀
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Pick any confusing letter or number pair and test your skills with 5 different mini-games!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="font-black text-amber-950 text-base">{profile.stars} Total Stars</span>
        </div>
      </div>

      {/* Confusion Pair Selector Bar */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 px-1">
          Choose Confusion Pair to Practice:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {CONFUSION_PAIRS.map((pair) => {
            const isSelected = selectedPairId === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => {
                  setSelectedPairId(pair.id);
                  sound.playPop(480);
                  sound.speak(`${pair.charA} versus ${pair.charB}`);
                }}
                className={`py-3 px-2 rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl font-black font-dyslexic text-slate-800">
                  {pair.charA} <span className="text-slate-400 font-normal text-xs">vs</span> {pair.charB}
                </span>
                <span className="text-[10px] font-bold text-indigo-700 mt-1 truncate max-w-full">
                  {pair.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                sound.playPop(520);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                isActive
                  ? `${g.color} ring-4 ring-indigo-300 scale-102 shadow-md`
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-3xl block mb-1">{g.emoji}</span>
              <h4 className="font-extrabold text-sm text-slate-800">{g.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1">
                {g.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Game Stage */}
      <div className="pt-2">
        {activeGame === 'balloon' && (
          <BalloonPopGame
            pair={selectedPair}
            targetChar={selectedPair.charA}
            childAge={profile.age}
            onCompleteRound={handleGameComplete}
          />
        )}

        {activeGame === 'trace' && (
          <TraceCanvasGame
            pair={selectedPair}
            targetChar={selectedPair.charA}
            onComplete={() => handleGameComplete({ correct: 5, total: 5 })}
          />
        )}

        {activeGame === 'sort' && (
          <SortingBasketsGame
            pair={selectedPair}
            childAge={profile.age}
            onCompleteRound={handleGameComplete}
          />
        )}

        {activeGame === 'matrix' && (
          <MatrixOddOneOutGame
            pair={selectedPair}
            childAge={profile.age}
            onCompleteRound={handleGameComplete}
          />
        )}

        {activeGame === 'midline' && (
          <PhysicalMidlineGym
            onComplete={() => handleGameComplete({ correct: 5, total: 5 })}
          />
        )}
      </div>
    </div>
  );
};

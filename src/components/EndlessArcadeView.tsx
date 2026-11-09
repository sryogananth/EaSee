import React, { useState } from 'react';
import { UserProfile, ConfusionPair } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TraceCanvasGame } from './games/TraceCanvasGame';
import { SortingBasketsGame } from './games/SortingBasketsGame';
import { MatrixOddOneOutGame } from './games/MatrixOddOneOutGame';
import { PhysicalMidlineGym } from './games/PhysicalMidlineGym';
import { sound } from '../utils/sound';
import { Gamepad2, Star } from 'lucide-react';

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
    { id: 'balloon' as const, name: 'Balloon Pop', emoji: '🎈', desc: 'Spot and pop targets' },
    { id: 'trace' as const, name: 'Rainbow Trace', emoji: '✏️', desc: 'Guided stroke checkpoints' },
    { id: 'sort' as const, name: 'Baskets', emoji: '🧺', desc: 'Feed character homes' },
    { id: 'matrix' as const, name: 'Odd-One-Out', emoji: '🕵️', desc: 'Find mirror intruders' },
    { id: 'midline' as const, name: 'Midline Gym', emoji: '🧠', desc: 'Lazy 8 & bilateral taps' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fade-in w-full">
      {/* Top Banner */}
      <div className="glass-card-sky p-4 sm:p-6 rounded-3xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-200/80 text-sky-900 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-700" />
            <span>Endless Practice Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
            Play As Long As You Like! 🚀
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Pick any confusing letter or number pair and test your skills with 5 mini-games!
          </p>
        </div>

        <div className="flex items-center gap-1.5 glass-pill px-3 py-1.5 rounded-2xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-black text-amber-950 text-xs sm:text-sm">{profile.stars} Total Stars</span>
        </div>
      </div>

      {/* Confusion Pair Selector Bar */}
      <div>
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5 px-1">
          Choose Confusion Pair:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
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
                className={`py-2 sm:py-3 px-1.5 rounded-2xl font-black transition-all border flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50/90 scale-105 shadow-md ring-2 ring-indigo-300'
                    : 'glass-card hover:bg-white/90'
                }`}
              >
                <span className="text-lg sm:text-2xl font-black font-dyslexic text-slate-800">
                  {pair.charA} <span className="text-slate-400 font-normal text-[10px]">vs</span> {pair.charB}
                </span>
                <span className="text-[9px] font-bold text-indigo-700 truncate max-w-full">
                  {pair.charA}/{pair.charB}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                sound.playPop(520);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'glass-card-purple border-purple-400 ring-2 ring-purple-300 scale-102 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <span className="text-2xl sm:text-3xl block mb-0.5">{g.emoji}</span>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{g.name}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                {g.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Game Stage */}
      <div className="pt-1">
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

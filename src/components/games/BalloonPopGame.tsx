import React, { useState, useEffect, useRef } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Volume2, RefreshCw } from 'lucide-react';

interface BalloonItem {
  id: number;
  char: string;
  isTarget: boolean;
  x: number; // percentage 12 - 82
  y: number; // percentage 105 -> -20
  speed: number;
  color: string;
  size: number;
  popped: boolean;
}

interface BalloonPopGameProps {
  pair: ConfusionPair;
  targetChar: string;
  childAge: number;
  onCompleteRound: (score: { correct: number; total: number }) => void;
}

const BALLOON_COLORS = [
  '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  pair,
  targetChar,
  childAge,
  onCompleteRound,
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [goal] = useState(8);
  const [isFinished, setIsFinished] = useState(false);
  const nextId = useRef(1);

  const baseSpeed = Math.max(0.24, Math.min(0.55, 0.24 + (childAge - 4) * 0.04));
  const otherChar = targetChar === pair.charA ? pair.charB : pair.charA;
  const isA = targetChar === pair.charA;
  const targetMnemonic = isA ? pair.mnemonicA : pair.mnemonicB;
  const targetAnimal = isA ? pair.animalA : pair.animalB;

  useEffect(() => {
    sound.speak(`Pop all the ${targetChar}'s! Remember, ${targetMnemonic}`, true);
  }, [targetChar, targetMnemonic]);

  // Balloon spawn loop
  useEffect(() => {
    if (isFinished) return;

    const spawnInterval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 6) return prev;
        const isTarget = Math.random() > 0.45;
        const char = isTarget ? targetChar : otherChar;
        const newItem: BalloonItem = {
          id: nextId.current++,
          char,
          isTarget,
          x: 12 + Math.random() * 70, // safely inside edges
          y: 105,
          speed: baseSpeed * (0.8 + Math.random() * 0.4),
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          size: childAge <= 5 ? 74 : 66,
          popped: false,
        };
        return [...prev, newItem];
      });
    }, childAge <= 5 ? 1900 : 1400);

    return () => clearInterval(spawnInterval);
  }, [isFinished, baseSpeed, targetChar, otherChar, childAge]);

  // Balloon rising loop
  useEffect(() => {
    if (isFinished) return;

    const animFrame = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -25 && !b.popped)
      );
    }, 30);

    return () => clearInterval(animFrame);
  }, [isFinished]);

  const handlePop = (balloon: BalloonItem) => {
    if (balloon.popped) return;

    if (balloon.isTarget) {
      sound.playPop(500 + streak * 30);
      setScore((s) => {
        const newScore = s + 1;
        if (newScore >= goal && !isFinished) {
          setIsFinished(true);
          sound.playFanfare();
          fireStarBurst();
          onCompleteRound({ correct: newScore, total: newScore + misses });
        }
        return newScore;
      });
      setStreak((st) => st + 1);

      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
      );
    } else {
      sound.playGentleRetry();
      sound.speak(`Oops, that's a ${balloon.char}! We want ${targetChar}.`);
      setMisses((m) => m + 1);
      setStreak(0);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setMisses(0);
    setStreak(0);
    setIsFinished(false);
    setBalloons([]);
  };

  return (
    <div className="relative w-full h-[56vh] min-h-[380px] max-h-[500px] rounded-3xl glass-card overflow-hidden select-none shadow-lg border border-white/90">
      
      {/* Decorative Sky Orbs */}
      <div className="absolute top-8 left-12 w-28 h-28 bg-sky-200/40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Guide */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex flex-wrap items-center justify-between gap-2 glass-pill px-3 py-2 rounded-2xl border border-white/90 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-2xl sm:text-3xl">{targetAnimal.emoji}</div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-800">Target:</span>
              <span className="text-xl sm:text-2xl font-black text-sky-950 font-dyslexic bg-white/90 px-2 rounded-lg border border-sky-200">{targetChar}</span>
              <button
                onClick={() => sound.speak(`Look for letter ${targetChar}. ${targetMnemonic}`, true)}
                className="p-1 hover:bg-sky-100/80 rounded-full text-sky-700 transition-colors"
                title="Hear clue"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar & Goal */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 block leading-tight">Popped</span>
            <div className="text-sm sm:text-base font-black text-sky-900">{score} / {goal}</div>
          </div>
          <div className="w-16 sm:w-24 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (score / goal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floating Balloons Field */}
      <div className="relative w-full h-full overflow-hidden">
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={() => handlePop(b)}
            className="absolute cursor-pointer transition-transform active:scale-90 hover:scale-105"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Balloon Body with Glass Glow & Gloss highlight */}
            <div
              className="w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg flex items-center justify-center relative border border-white/70"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 8px 20px ${b.color}77, inset -3px -5px 10px rgba(0,0,0,0.2), inset 3px 5px 8px rgba(255,255,255,0.7)`,
              }}
            >
              <div className="absolute top-2 left-2.5 w-2.5 h-3.5 bg-white/75 rounded-full rotate-45 blur-[0.4px]" />

              <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-md font-dyslexic select-none">
                {b.char}
              </span>

              {/* Knot & String */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-sm"
                style={{ backgroundColor: b.color }}
              />
              <div className="absolute -bottom-5 left-1/2 w-0.5 h-5 bg-slate-400/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Victory Overlay */}
      {isFinished && (
        <div className="absolute inset-0 z-30 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card bg-white/95 p-6 sm:p-8 text-center max-w-sm w-full border border-white/90 shadow-2xl">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
              🏆
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Spectacular Popping!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-3">
              You spotted every {targetChar} without getting tricked by {otherChar}!
            </p>
            <div className="glass-card-amber rounded-2xl p-2.5 mb-4 text-xs font-bold text-amber-950 flex justify-around">
              <div>🎯 Accuracy: {Math.round((score / (score + misses)) * 100)}%</div>
              <div>⭐ +3 Stars!</div>
            </div>
            <button
              onClick={handleRestart}
              className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3 rounded-2xl flex items-center justify-center gap-2 bouncy-glass-btn shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Play Another Round</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

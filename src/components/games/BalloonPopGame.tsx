import React, { useState, useEffect, useRef } from 'react';
import { ConfusionPair } from '../../types';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Volume2, Sparkles, RefreshCw, Trophy } from 'lucide-react';

interface BalloonItem {
  id: number;
  char: string;
  isTarget: boolean;
  x: number; // percentage 5 - 85
  y: number; // percentage 100 -> -20
  speed: number;
  color: string;
  size: number;
  popped: boolean;
}

interface BalloonPopGameProps {
  pair: ConfusionPair;
  targetChar: string; // 'b' or 'd'
  childAge: number;
  onCompleteRound: (score: { correct: number; total: number }) => void;
}

const BALLOON_COLORS = [
  '#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'
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
  const [goal] = useState(8); // pop 8 target balloons to complete
  const [isFinished, setIsFinished] = useState(false);
  const nextId = useRef(1);

  // Speed scaling based on age: age 4 is slower, age 10 is brisker
  const baseSpeed = Math.max(0.25, Math.min(0.65, 0.25 + (childAge - 4) * 0.05));

  const otherChar = targetChar === pair.charA ? pair.charB : pair.charA;
  const isA = targetChar === pair.charA;
  const targetMnemonic = isA ? pair.mnemonicA : pair.mnemonicB;
  const targetAnimal = isA ? pair.animalA : pair.animalB;

  // Speak initial instruction
  useEffect(() => {
    sound.speak(`Pop all the ${targetChar}'s! Remember, ${targetMnemonic}`, true);
  }, [targetChar, targetMnemonic]);

  // Balloon spawn loop
  useEffect(() => {
    if (isFinished) return;

    const spawnInterval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 7) return prev;
        const isTarget = Math.random() > 0.45;
        const char = isTarget ? targetChar : otherChar;
        const newItem: BalloonItem = {
          id: nextId.current++,
          char,
          isTarget,
          x: 10 + Math.random() * 75,
          y: 105,
          speed: baseSpeed * (0.8 + Math.random() * 0.4),
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          size: childAge <= 5 ? 88 : 78,
          popped: false,
        };
        return [...prev, newItem];
      });
    }, childAge <= 5 ? 1800 : 1300);

    return () => clearInterval(spawnInterval);
  }, [isFinished, baseSpeed, targetChar, otherChar, childAge]);

  // Balloon rising animation loop
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

      // mark popped animation
      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
      );
    } else {
      // Clicked distractor
      sound.playGentleRetry();
      sound.speak(`Oops, that's a ${balloon.char}! We are looking for ${targetChar}.`);
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
    <div className="relative w-full h-[520px] rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 border-4 border-sky-200 overflow-hidden select-none shadow-inner">
      {/* Top Banner Guide */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{targetAnimal.emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Mission Target:</span>
              <span className="text-2xl font-black text-sky-950 font-dyslexic">{targetChar}</span>
              <button
                onClick={() => sound.speak(`Look for letter ${targetChar}. ${targetMnemonic}`, true)}
                className="p-1 hover:bg-sky-100 rounded-full text-sky-600 transition-colors"
                title="Hear clue again"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 font-semibold max-w-md hidden sm:block">
              {targetMnemonic}
            </p>
          </div>
        </div>

        {/* Progress Bar & Goal */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">Balloons Popped</span>
            <div className="text-lg font-black text-sky-900">{score} / {goal}</div>
          </div>
          <div className="w-24 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (score / goal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floating Balloons Canvas */}
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
            {/* Balloon Body with organic 3D gradient */}
            <div
              className="w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg flex items-center justify-center relative border-2 border-white/60"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 8px 18px ${b.color}66, inset -4px -6px 12px rgba(0,0,0,0.15), inset 4px 6px 10px rgba(255,255,255,0.6)`,
              }}
            >
              {/* Highlight shine */}
              <div className="absolute top-2 left-3 w-3 h-4 bg-white/70 rounded-full rotate-45 blur-[0.5px]" />

              {/* Letter / Number inside */}
              <span className="text-4xl md:text-5xl font-black text-white drop-shadow-md font-dyslexic select-none">
                {b.char}
              </span>

              {/* Balloon knot & string */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-sm"
                style={{ backgroundColor: b.color }}
              />
              <div className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-slate-400/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Round Finished Victory Overlay */}
      {isFinished && (
        <div className="absolute inset-0 z-30 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 text-center max-w-sm w-full border-4 border-amber-400 shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              🏆
            </div>
            <h3 className="text-2xl font-black text-slate-800">Spectacular Popping!</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">
              You spotted every {targetChar} without getting tricked by {otherChar}!
            </p>
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-5 text-sm font-bold text-amber-900 flex justify-around">
              <div>🎯 Accuracy: {Math.round((score / (score + misses)) * 100)}%</div>
              <div>⭐ +3 Stars!</div>
            </div>
            <button
              onClick={handleRestart}
              className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3 rounded-2xl flex items-center justify-center gap-2 bouncy-btn shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Play Another Balloon Round</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

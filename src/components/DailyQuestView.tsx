import React, { useState, useEffect } from 'react';
import { UserProfile, ConfusionPair, DayLesson } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { THIRTY_DAY_CURRICULUM } from '../data/thirtyDayPlan';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TraceCanvasGame } from './games/TraceCanvasGame';
import { PhysicalMidlineGym } from './games/PhysicalMidlineGym';
import { sound } from '../utils/sound';
import { fireGrandCelebration, fireStarBurst } from '../utils/confetti';
import { Clock, CheckCircle2, Star, Sparkles, ArrowRight, Play, RefreshCw, Flame, Award, Volume2 } from 'lucide-react';

interface DailyQuestViewProps {
  profile: UserProfile;
  onRecordSession: (earnedStars: number, dayNumber: number, pairId: string, stats: { correct: number; total: number }) => void;
  onOpenStickerAlbum: () => void;
}

export const DailyQuestView: React.FC<DailyQuestViewProps> = ({
  profile,
  onRecordSession,
  onOpenStickerAlbum,
}) => {
  const nextDayNumber = profile.completedDays.length > 0
    ? Math.min(30, Math.max(...profile.completedDays) + 1)
    : 1;

  const currentLesson: DayLesson = THIRTY_DAY_CURRICULUM[nextDayNumber - 1] || THIRTY_DAY_CURRICULUM[0];
  const targetPair: ConfusionPair = CONFUSION_PAIRS.find((p) => p.id === currentLesson.pairId) || CONFUSION_PAIRS[0];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && currentStep < 5) {
      interval = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, currentStep]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleStartDailySession = () => {
    sound.playPop(520);
    sound.speak(`Day ${currentLesson.dayNumber}: ${currentLesson.title}! Let's learn the secret rule and play!`, true);
    setIsTimerRunning(true);
    setCurrentStep(2);
  };

  const handleFinishStep2 = (score: { correct: number; total: number }) => {
    setSessionScore((prev) => ({
      correct: prev.correct + score.correct,
      total: prev.total + score.total,
    }));
    sound.playFanfare();
    setCurrentStep(3);
  };

  const handleFinishStep3 = () => {
    setSessionScore((prev) => ({
      correct: prev.correct + 5,
      total: prev.total + 5,
    }));
    sound.playFanfare();
    setCurrentStep(4);
  };

  const handleFinishStep4 = () => {
    setIsTimerRunning(false);
    setCurrentStep(5);
    sound.playFanfare();
    fireGrandCelebration();

    const earnedStars = 10;
    onRecordSession(earnedStars, currentLesson.dayNumber, targetPair.id, sessionScore);
  };

  const stepsMeta = [
    { num: 1, label: 'Secret Rule', icon: '📖' },
    { num: 2, label: 'Balloon Hunter', icon: '🎈' },
    { num: 3, label: 'Rainbow Trace', icon: '✏️' },
    { num: 4, label: 'Midline Gym', icon: '🧠' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in w-full">
      {/* Daily Progress Glass Banner */}
      <div className="glass-card-amber p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl sm:text-3xl shadow-sm border border-white/80 shrink-0">
            {currentLesson.badgeEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                Day {currentLesson.dayNumber} of 30
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                • {currentLesson.durationMinutes}m Quest
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 truncate mt-0.5">
              {currentLesson.title}
            </h2>
          </div>
        </div>

        {/* Live Active Glass Timer */}
        <div className="flex items-center justify-between sm:justify-start gap-3 glass-pill px-4 py-2 rounded-2xl w-full sm:w-auto border border-white/90">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">Exercise Timer</span>
          </div>
          <div className="text-lg sm:text-xl font-mono font-black text-amber-950">
            {formatTimer(sessionSeconds)}
          </div>
        </div>
      </div>

      {/* Routine Steps Stepper (Responsive: Horizontal scroll on tiny screens, grid on tablet) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {stepsMeta.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div
              key={s.num}
              className={`p-2 sm:p-3 rounded-2xl border transition-all flex items-center justify-center sm:justify-start gap-2 ${
                isDone
                  ? 'glass-card-mint border-emerald-300 text-emerald-900'
                  : isCurrent
                  ? 'glass-card-amber border-amber-400 text-amber-950 ring-2 ring-amber-300 scale-102 shadow-sm'
                  : 'glass-card opacity-60 text-slate-400'
              }`}
            >
              <span className="text-lg sm:text-xl shrink-0">{s.icon}</span>
              <div className="hidden sm:block text-left min-w-0">
                <span className="text-[9px] uppercase font-bold block text-slate-500">Step {s.num}</span>
                <span className="text-xs font-extrabold truncate block">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Lesson Introduction & Mnemonic Rule */}
      {currentStep === 1 && (
        <div className="glass-card p-5 sm:p-8 md:p-10 text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              Today's Secret Superpower Rule ⚡
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mt-3 mb-2">
              {targetPair.ruleTitle}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Dyslexic brains think in wonderful 3D pictures! Today we give {targetPair.charA} and {targetPair.charB} their own special identities so you never confuse them again.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto py-1">
            {/* Side A Card */}
            <div className="glass-card-sky p-5 sm:p-6 rounded-3xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">{targetPair.animalA.emoji}</span>
                <span className="text-5xl font-black text-blue-600 font-dyslexic">{targetPair.charA}</span>
              </div>
              <h4 className="text-lg font-black text-slate-800">{targetPair.animalA.name}</h4>
              <p className="text-xs sm:text-sm font-bold text-blue-950 mt-2 glass-pill p-3 rounded-2xl">
                {targetPair.mnemonicA}
              </p>
              <div className="mt-2.5 text-[11px] font-bold text-slate-600">
                Visual Cue: {targetPair.visualCueA}
              </div>
            </div>

            {/* Side B Card */}
            <div className="glass-card-mint p-5 sm:p-6 rounded-3xl text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">{targetPair.animalB.emoji}</span>
                <span className="text-5xl font-black text-emerald-600 font-dyslexic">{targetPair.charB}</span>
              </div>
              <h4 className="text-lg font-black text-slate-800">{targetPair.animalB.name}</h4>
              <p className="text-xs sm:text-sm font-bold text-emerald-950 mt-2 glass-pill p-3 rounded-2xl">
                {targetPair.mnemonicB}
              </p>
              <div className="mt-2.5 text-[11px] font-bold text-slate-600">
                Visual Cue: {targetPair.visualCueB}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartDailySession}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-amber-950 font-black text-base sm:text-lg py-4 px-8 sm:px-12 rounded-2xl shadow-lg glass-action-btn inline-flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-amber-950" />
              <span>Start Today's 7-Min Workout!</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Balloon Pop Game */}
      {currentStep === 2 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Phase 1: Visual Discrimination Hunter
            </h3>
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 glass-pill px-3 py-1 rounded-xl"
            >
              <span>Skip to Tracing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <BalloonPopGame
            pair={targetPair}
            targetChar={targetPair.charA}
            childAge={profile.age}
            onCompleteRound={handleFinishStep2}
          />
        </div>
      )}

      {/* Step 3: Directional Tracing */}
      {currentStep === 3 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Phase 2: Muscle Memory Directional Tracing
            </h3>
            <button
              onClick={() => setCurrentStep(4)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 glass-pill px-3 py-1 rounded-xl"
            >
              <span>Skip to Physical Gym</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <TraceCanvasGame
            pair={targetPair}
            targetChar={targetPair.charA}
            onComplete={handleFinishStep3}
          />
        </div>
      )}

      {/* Step 4: Physical Midline Gym */}
      {currentStep === 4 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Phase 3: Bilateral Brain & Eye Midline Gym
            </h3>
            <button
              onClick={handleFinishStep4}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm"
            >
              <span>Complete Quest</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <PhysicalMidlineGym onComplete={handleFinishStep4} />
        </div>
      )}

      {/* Step 5: Grand Completion Celebration */}
      {currentStep === 5 && (
        <div className="glass-card p-6 sm:p-10 md:p-12 text-center space-y-6 max-w-xl mx-auto animate-scale-in">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto shadow-lg border-2 border-white animate-bounce-gentle">
            🏆
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
              Day {currentLesson.dayNumber} Completed!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Incredible Effort, {profile.name || 'Champion'}!
            </h3>
            <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1.5">
              You exercised your brain for {Math.max(1, Math.round(sessionSeconds / 60))} minutes today and mastered {targetPair.charA} and {targetPair.charB}!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 glass-card-amber p-3 sm:p-4 rounded-2xl">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-800">Stars Earned</span>
              <p className="text-lg sm:text-2xl font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>+10</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-800">Streak Updated</span>
              <p className="text-lg sm:text-2xl font-black text-orange-600 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>{profile.currentStreak}d</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-800">Island Conquered</span>
              <p className="text-lg sm:text-2xl font-black text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <span>Day {currentLesson.dayNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenStickerAlbum}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 bouncy-glass-btn"
            >
              <Award className="w-4 h-4" />
              <span>Open Sticker Album</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setSessionSeconds(0);
              }}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 bouncy-glass-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

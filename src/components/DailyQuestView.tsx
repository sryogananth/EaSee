import React, { useState, useEffect } from 'react';
import { UserProfile, ConfusionPair, DayLesson } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { THIRTY_DAY_CURRICULUM } from '../data/thirtyDayPlan';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TraceCanvasGame } from './games/TraceCanvasGame';
import { PhysicalMidlineGym } from './games/PhysicalMidlineGym';
import { sound } from '../utils/sound';
import { fireGrandCelebration, fireStarBurst } from '../utils/confetti';
import { Clock, CheckCircle2, Star, Sparkles, ArrowRight, Play, RefreshCw, Flame, Award } from 'lucide-react';

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
  // Determine current day from completedDays
  const nextDayNumber = profile.completedDays.length > 0
    ? Math.min(30, Math.max(...profile.completedDays) + 1)
    : 1;

  const currentLesson: DayLesson = THIRTY_DAY_CURRICULUM[nextDayNumber - 1] || THIRTY_DAY_CURRICULUM[0];
  const targetPair: ConfusionPair = CONFUSION_PAIRS.find((p) => p.id === currentLesson.pairId) || CONFUSION_PAIRS[0];

  // Steps in the 7-minute daily routine:
  // 1: Intro Mnemonic Briefing (30s)
  // 2: Visual Balloon Pop Game (2m)
  // 3: Directional Tracing (2m)
  // 4: Physical Midline Gym (2m)
  // 5: Celebration & Star Rewards!
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  // Timer tracker
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Daily Progress Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border-4 border-amber-300 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md border-2 border-white">
            {currentLesson.badgeEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Day {currentLesson.dayNumber} of 30
              </span>
              <span className="text-xs font-bold text-slate-500">
                • {currentLesson.durationMinutes} Mins Daily Workout
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-0.5">
              {currentLesson.title}
            </h2>
          </div>
        </div>

        {/* Live Active Timer */}
        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <Clock className="w-5 h-5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Daily Exercise Timer</span>
            <div className="text-xl font-mono font-black text-amber-950">
              {formatTimer(sessionSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Steps Breadcrumbs */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {[
          { num: 1, label: 'Mnemonic Rule', icon: '📖' },
          { num: 2, label: 'Balloon Hunter', icon: '🎈' },
          { num: 3, label: 'Rainbow Trace', icon: '✏️' },
          { num: 4, label: 'Midline Gym', icon: '🧠' },
        ].map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div
              key={s.num}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 ${
                isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : isCurrent
                  ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm scale-102 font-black'
                  : 'bg-white/60 border-slate-200 text-slate-400'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] uppercase font-bold block text-slate-500">Step {s.num}</span>
                <span className="text-xs font-extrabold truncate">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Lesson Introduction & Mnemonic Rule */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border-4 border-amber-200 shadow-lg text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <span className="text-sm font-extrabold text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
              Today's Secret Superpower Rule
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 mb-2">
              {targetPair.ruleTitle}
            </h3>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              Dyslexic brains are wonderful at thinking in 3D pictures! Today we give {targetPair.charA} and {targetPair.charB} their own unique superpower identities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto py-2">
            {/* Side A Card */}
            <div className="rounded-3xl p-6 border-4 border-blue-200 bg-gradient-to-b from-blue-50 to-indigo-50 text-left shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{targetPair.animalA.emoji}</span>
                <span className="text-5xl font-black text-blue-600 font-dyslexic">{targetPair.charA}</span>
              </div>
              <h4 className="text-xl font-black text-slate-800">{targetPair.animalA.name}</h4>
              <p className="text-sm font-bold text-blue-900 mt-2 bg-white/80 p-3 rounded-2xl border border-blue-200">
                {targetPair.mnemonicA}
              </p>
              <div className="mt-3 text-xs font-bold text-slate-500">
                Visual Cue: {targetPair.visualCueA}
              </div>
            </div>

            {/* Side B Card */}
            <div className="rounded-3xl p-6 border-4 border-emerald-200 bg-gradient-to-b from-emerald-50 to-teal-50 text-left shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{targetPair.animalB.emoji}</span>
                <span className="text-5xl font-black text-emerald-600 font-dyslexic">{targetPair.charB}</span>
              </div>
              <h4 className="text-xl font-black text-slate-800">{targetPair.animalB.name}</h4>
              <p className="text-sm font-bold text-emerald-900 mt-2 bg-white/80 p-3 rounded-2xl border border-emerald-200">
                {targetPair.mnemonicB}
              </p>
              <div className="mt-3 text-xs font-bold text-slate-500">
                Visual Cue: {targetPair.visualCueB}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleStartDailySession}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-amber-950 font-black text-xl py-4 px-10 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-102 active:scale-98 transition-all inline-flex items-center gap-3 bouncy-btn"
            >
              <Play className="w-6 h-6 fill-amber-950" />
              <span>Start Today's 7-Min Workout!</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Balloon Pop Game */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Phase 1: Visual Discrimination Hunter</span>
            </h3>
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Phase 2: Muscle Memory Directional Tracing</span>
            </h3>
            <button
              onClick={() => setCurrentStep(4)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Phase 3: Bilateral Brain & Eye Midline Gym</span>
            </h3>
            <button
              onClick={handleFinishStep4}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm"
            >
              <span>Complete Daily Workout</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
          <PhysicalMidlineGym onComplete={handleFinishStep4} />
        </div>
      )}

      {/* Step 5: Grand Completion Celebration */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-8 md:p-12 border-4 border-amber-300 shadow-2xl text-center space-y-6 max-w-2xl mx-auto animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg animate-bounce-gentle">
            🏆
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Day {currentLesson.dayNumber} Completed!
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
              Incredible Effort, {profile.name || 'Champion'}!
            </h3>
            <p className="text-slate-600 font-medium text-base mt-2">
              You exercised your eyes and brain for {Math.max(1, Math.round(sessionSeconds / 60))} minutes today and mastered {targetPair.charA} and {targetPair.charB}!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div>
              <span className="text-xs font-bold text-amber-700">Stars Earned</span>
              <p className="text-2xl font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>+10</span>
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700">Streak Updated</span>
              <p className="text-2xl font-black text-orange-600 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span>{profile.currentStreak}d</span>
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700">Island Unlocked</span>
              <p className="text-2xl font-black text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <span>Day {currentLesson.dayNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onOpenStickerAlbum}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 bouncy-btn"
            >
              <Award className="w-5 h-5" />
              <span>Open Sticker Album</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setSessionSeconds(0);
              }}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 bouncy-btn"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Practice Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

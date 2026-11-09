import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Play, Pause, Volume2, CheckCircle2 } from 'lucide-react';

interface PhysicalMidlineGymProps {
  onComplete: () => void;
}

export const PhysicalMidlineGym: React.FC<PhysicalMidlineGymProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'lazy8' | 'crosscrawl' | 'thumbs'>('lazy8');
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [laps, setLaps] = useState(0);
  const targetLaps = 5;
  const [t, setT] = useState(0);

  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [crossCrawlCount, setCrossCrawlCount] = useState(0);
  const targetCrossCrawls = 10;
  const [isCrossCrawlActive, setIsCrossCrawlActive] = useState(false);

  useEffect(() => {
    if (!isPlaying || activeTab !== 'lazy8') return;

    const interval = setInterval(() => {
      setT((prev) => {
        const next = prev + 0.025;
        if (next >= Math.PI * 2) {
          setLaps((l) => {
            const nextLaps = l + 1;
            sound.playPop(520 + nextLaps * 40);
            if (nextLaps >= targetLaps) {
              sound.playFanfare();
              fireStarBurst();
            }
            return nextLaps;
          });
          return 0;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const butterflyX = 50 + Math.sin(t) * 38;
  const butterflyY = 50 + Math.sin(t) * Math.cos(t) * 44;

  useEffect(() => {
    if (!isCrossCrawlActive || activeTab !== 'crosscrawl') return;

    const interval = setInterval(() => {
      setCurrentSide((prev) => {
        const next = prev === 'left' ? 'right' : 'left';
        sound.playRhythmTick(next === 'left');
        setCrossCrawlCount((c) => {
          const nextCount = c + 1;
          if (nextCount >= targetCrossCrawls) {
            setIsCrossCrawlActive(false);
            sound.playFanfare();
            fireStarBurst();
          }
          return nextCount;
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isCrossCrawlActive, activeTab]);

  const speakLazy8 = () => {
    sound.speak("Keep your head very still! Follow the magic butterfly with only your eyes as it loops across the infinity track!", true);
  };

  const speakCrossCrawl = () => {
    sound.speak("Stand up! When the left box lights up, touch your left hand to your right knee. When the right box lights up, touch your right hand to your left knee!", true);
  };

  const speakThumbs = () => {
    sound.speak("Hold up both hands in thumbs-up fists! Your left hand makes the letter b! Your right hand makes the letter d! Together they make a bed!", true);
  };

  return (
    <div className="relative w-full rounded-3xl glass-card p-4 sm:p-6 md:p-8 shadow-sm border border-white/90">
      {/* Exercise Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full">
            Physical & Visual Gym 🧠⚡
          </span>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5">
            Brain Midline Crossing
          </h3>
        </div>

        <div className="flex overflow-x-auto no-scrollbar glass-pill p-1 rounded-2xl gap-1 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('lazy8');
              speakLazy8();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex-1 sm:flex-initial ${
              activeTab === 'lazy8'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ♾️ Lazy 8
          </button>
          <button
            onClick={() => {
              setActiveTab('crosscrawl');
              speakCrossCrawl();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex-1 sm:flex-initial ${
              activeTab === 'crosscrawl'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤸 Cross-Crawl
          </button>
          <button
            onClick={() => {
              setActiveTab('thumbs');
              speakThumbs();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex-1 sm:flex-initial ${
              activeTab === 'thumbs'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👍 b-e-d Trick
          </button>
        </div>
      </div>

      {/* Mode 1: Lazy 8 Eye Tracking */}
      {activeTab === 'lazy8' && (
        <div className="space-y-3">
          <div className="glass-pill px-4 py-2 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                Keep head STILL, follow butterfly with eyes only!
              </span>
              <button
                onClick={speakLazy8}
                className="p-1 hover:bg-teal-100/80 rounded-full text-teal-700 transition-colors shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-teal-800">
                Loops: {laps} / {targetLaps}
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-800 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] bg-white/70 backdrop-blur-md rounded-3xl border-2 border-dashed border-teal-300 overflow-hidden flex items-center justify-center shadow-inner">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none stroke-teal-200/90"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M 50,50 C 30,10 10,25 10,50 C 10,75 30,90 50,50 C 70,10 90,25 90,50 C 90,75 70,90 50,50 Z"
                strokeWidth="4"
                strokeDasharray="3 3"
              />
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-teal-400 bg-teal-100/90 flex items-center justify-center text-[10px] font-black text-teal-800 pointer-events-none">
              +
            </div>

            <div
              className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-3xl sm:text-4xl transition-transform duration-75 pointer-events-none"
              style={{
                left: `${butterflyX}%`,
                top: `${butterflyY}%`,
                filter: 'drop-shadow(0 4px 10px rgba(20, 184, 166, 0.4))',
              }}
            >
              🦋
            </div>

            {laps >= targetLaps && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center animate-fade-in p-4">
                <div className="text-center glass-card p-5 max-w-xs">
                  <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-1.5" />
                  <h4 className="text-xl font-black text-slate-800">Vision Mastery!</h4>
                  <p className="text-xs text-slate-600 mt-0.5 mb-3">
                    Your eye muscles smoothly tracked across both hemispheres!
                  </p>
                  <button
                    onClick={() => {
                      setLaps(0);
                      setIsPlaying(true);
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-5 rounded-xl text-xs bouncy-glass-btn"
                  >
                    Repeat 5 Loops
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Cross-Crawl */}
      {activeTab === 'crosscrawl' && (
        <div className="space-y-3">
          <div className="glass-pill px-4 py-2 rounded-2xl flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Cross your body! Touch Left Hand to Right Knee, then switch!
            </span>
            <button
              onClick={speakCrossCrawl}
              className="p-1 hover:bg-teal-100/80 rounded-full text-teal-700 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 sm:p-6 rounded-3xl border transition-all duration-300 text-center ${
                currentSide === 'left' && isCrossCrawlActive
                  ? 'border-indigo-400 bg-indigo-50/90 scale-102 shadow-lg ring-4 ring-indigo-200'
                  : 'glass-card opacity-60'
              }`}
            >
              <div className="text-4xl sm:text-5xl mb-1">✋ ➡️ 🦵</div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800">LEFT Hand to RIGHT Knee</h4>
              <p className="text-[10px] text-indigo-700 font-bold mt-0.5">Cross to right side!</p>
            </div>

            <div
              className={`p-4 sm:p-6 rounded-3xl border transition-all duration-300 text-center ${
                currentSide === 'right' && isCrossCrawlActive
                  ? 'border-emerald-400 bg-emerald-50/90 scale-102 shadow-lg ring-4 ring-emerald-200'
                  : 'glass-card opacity-60'
              }`}
            >
              <div className="text-4xl sm:text-5xl mb-1">🦵 ⬅️ ✋</div>
              <h4 className="text-xs sm:text-sm font-black text-slate-800">RIGHT Hand to LEFT Knee</h4>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Cross to left side!</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {!isCrossCrawlActive ? (
              <button
                onClick={() => {
                  setCrossCrawlCount(0);
                  setIsCrossCrawlActive(true);
                  sound.playPop(500);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-6 rounded-2xl shadow-md glass-action-btn flex items-center gap-2 text-xs sm:text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Start 10-Rep Cross-Crawl Gym</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 glass-pill px-5 py-2.5 rounded-2xl">
                <span className="text-xs font-bold text-slate-600">Reps Finished:</span>
                <span className="text-xl font-black text-teal-800">
                  {crossCrawlCount} / {targetCrossCrawls}
                </span>
                <button
                  onClick={() => setIsCrossCrawlActive(false)}
                  className="ml-1 text-xs text-rose-500 font-bold hover:underline"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Hand Trick */}
      {activeTab === 'thumbs' && (
        <div className="glass-card bg-white/80 rounded-3xl p-5 sm:p-7 text-center space-y-4">
          <h4 className="text-xl sm:text-2xl font-black text-slate-800">
            The Magic "b - e - d" Bed Trick! 🛏️
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Make two fists with thumbs up in front of your chest!
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
            <div className="glass-card-sky rounded-3xl p-4 w-32 sm:w-36 text-center">
              <span className="text-4xl">👍</span>
              <h5 className="font-black text-sm text-blue-900 mt-1">Left Hand</h5>
              <p className="text-3xl font-black text-blue-600 font-dyslexic">b</p>
              <p className="text-[10px] font-bold text-blue-800 mt-1">Bat & Ball</p>
            </div>

            <div className="text-2xl font-black text-slate-400">+</div>

            <div className="glass-card-mint rounded-3xl p-4 w-32 sm:w-36 text-center">
              <span className="text-4xl transform -scale-x-100 inline-block">👍</span>
              <h5 className="font-black text-sm text-emerald-900 mt-1">Right Hand</h5>
              <p className="text-3xl font-black text-emerald-600 font-dyslexic">d</p>
              <p className="text-[10px] font-bold text-emerald-800 mt-1">Drum & Stick</p>
            </div>
          </div>

          <div className="glass-card-amber rounded-2xl p-3 max-w-sm mx-auto text-xs font-bold text-amber-950">
            Together they spell "b - e - d" (bed)!
          </div>
        </div>
      )}
    </div>
  );
};

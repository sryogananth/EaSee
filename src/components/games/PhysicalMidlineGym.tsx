import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/sound';
import { fireStarBurst } from '../../utils/confetti';
import { Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface PhysicalMidlineGymProps {
  onComplete: () => void;
}

export const PhysicalMidlineGym: React.FC<PhysicalMidlineGymProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'lazy8' | 'crosscrawl' | 'thumbs'>('lazy8');
  
  // Lazy 8 animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [laps, setLaps] = useState(0);
  const targetLaps = 5;
  const [t, setT] = useState(0);

  // Cross-crawl state
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [crossCrawlCount, setCrossCrawlCount] = useState(0);
  const targetCrossCrawls = 10;
  const [isCrossCrawlActive, setIsCrossCrawlActive] = useState(false);

  // Lazy 8 math curve (Lemniscate of Bernoulli or smooth parametric infinity)
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

  // Infinity curve coordinates: x = sin(t), y = sin(t) * cos(t)
  const butterflyX = 50 + Math.sin(t) * 38;
  const butterflyY = 50 + Math.sin(t) * Math.cos(t) * 44;

  // Cross-crawl metronome ticker
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
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-teal-50/70 via-emerald-50/40 to-cyan-50/70 border-4 border-teal-200 p-4 md:p-8 shadow-sm">
      {/* Exercise Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Physical & Visual Gym</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-800">
            Brain Midline Crossing 🧠⚡
          </h3>
        </div>

        <div className="flex bg-white/80 p-1.5 rounded-2xl border border-teal-200 gap-1 shadow-xs">
          <button
            onClick={() => {
              setActiveTab('lazy8');
              speakLazy8();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === 'lazy8'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ♾️ Lazy 8 Eye Tracking
          </button>
          <button
            onClick={() => {
              setActiveTab('crosscrawl');
              speakCrossCrawl();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === 'crosscrawl'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤸 Cross-Crawl Rhythm
          </button>
          <button
            onClick={() => {
              setActiveTab('thumbs');
              speakThumbs();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === 'thumbs'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👍 b-e-d Hand Trick
          </button>
        </div>
      </div>

      {/* Mode 1: Lazy 8 Eye Tracking */}
      {activeTab === 'lazy8' && (
        <div className="space-y-4">
          <div className="bg-white/90 rounded-2xl p-4 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">
                Keep head STILL, follow the butterfly with eyes only!
              </span>
              <button
                onClick={speakLazy8}
                className="p-1 hover:bg-teal-100 rounded-full text-teal-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-teal-800">
                Loops: {laps} / {targetLaps}
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-800 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Infinity Canvas Area */}
          <div className="relative w-full h-[320px] md:h-[380px] bg-white rounded-3xl border-4 border-dashed border-teal-300 overflow-hidden flex items-center justify-center shadow-inner">
            {/* SVG Infinity Loop Track */}
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

            {/* Central Midline Crosshair Marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-teal-400 bg-teal-100 flex items-center justify-center text-[10px] font-black text-teal-800 pointer-events-none">
              +
            </div>

            {/* Flying Magic Butterfly Target */}
            <div
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-4xl transition-transform duration-75 pointer-events-none"
              style={{
                left: `${butterflyX}%`,
                top: `${butterflyY}%`,
                filter: 'drop-shadow(0 4px 10px rgba(20, 184, 166, 0.4))',
              }}
            >
              🦋
            </div>

            {laps >= targetLaps && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center animate-fade-in p-6">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-2" />
                  <h4 className="text-2xl font-black text-slate-800">Vision Mastery!</h4>
                  <p className="text-sm text-slate-600 mt-1 mb-4">
                    Your eye muscles smoothly tracked across both hemispheres!
                  </p>
                  <button
                    onClick={() => {
                      setLaps(0);
                      setIsPlaying(true);
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm"
                  >
                    Repeat 5 More Loops
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Cross-Crawl Rhythm Physical Exercise */}
      {activeTab === 'crosscrawl' && (
        <div className="space-y-4">
          <div className="bg-white/90 rounded-2xl p-4 border border-teal-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              Cross your body! Touch Left Hand to Right Knee, then switch!
            </span>
            <button
              onClick={speakCrossCrawl}
              className="p-1 hover:bg-teal-100 rounded-full text-teal-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Prompt */}
            <div
              className={`p-6 rounded-3xl border-4 transition-all duration-300 text-center ${
                currentSide === 'left' && isCrossCrawlActive
                  ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-xl ring-4 ring-indigo-200'
                  : 'border-slate-200 bg-white opacity-60'
              }`}
            >
              <div className="text-6xl mb-2">✋ ➡️ 🦵</div>
              <h4 className="text-lg font-black text-slate-800">LEFT Hand to RIGHT Knee</h4>
              <p className="text-xs text-indigo-700 font-bold mt-1">Cross to the right side!</p>
            </div>

            {/* Right Prompt */}
            <div
              className={`p-6 rounded-3xl border-4 transition-all duration-300 text-center ${
                currentSide === 'right' && isCrossCrawlActive
                  ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-white opacity-60'
              }`}
            >
              <div className="text-6xl mb-2">🦵 ⬅️ ✋</div>
              <h4 className="text-lg font-black text-slate-800">RIGHT Hand to LEFT Knee</h4>
              <p className="text-xs text-emerald-700 font-bold mt-1">Cross to the left side!</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            {!isCrossCrawlActive ? (
              <button
                onClick={() => {
                  setCrossCrawlCount(0);
                  setIsCrossCrawlActive(true);
                  sound.playPop(500);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg bouncy-btn flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span>Start 10-Rep Cross-Crawl Gym</span>
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border-2 border-teal-300 shadow-sm">
                <span className="text-sm font-bold text-slate-600">Reps Finished:</span>
                <span className="text-2xl font-black text-teal-800">
                  {crossCrawlCount} / {targetCrossCrawls}
                </span>
                <button
                  onClick={() => setIsCrossCrawlActive(false)}
                  className="ml-2 text-xs text-rose-500 font-bold hover:underline"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Hand Trick (b-e-d bed mnemonic) */}
      {activeTab === 'thumbs' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-200 text-center space-y-4">
          <h4 className="text-2xl font-black text-slate-800">
            The Magic "b - e - d" Bed Trick! 🛏️
          </h4>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Make two fists in front of your chest with your thumbs pointing straight UP.
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-12 py-4">
            {/* Left Hand: b */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-3xl p-5 w-40 text-center">
              <span className="text-5xl">👍</span>
              <h5 className="font-black text-xl text-blue-900 mt-2">Left Hand</h5>
              <p className="text-4xl font-black text-blue-600 font-dyslexic mt-1">b</p>
              <p className="text-[11px] font-bold text-blue-700 mt-2">Makes letter b (Bat & Ball)</p>
            </div>

            <div className="text-3xl font-black text-slate-300">+</div>

            {/* Right Hand: d */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 w-40 text-center">
              <span className="text-5xl transform -scale-x-100 inline-block">👍</span>
              <h5 className="font-black text-xl text-emerald-900 mt-2">Right Hand</h5>
              <p className="text-4xl font-black text-emerald-600 font-dyslexic mt-1">d</p>
              <p className="text-[11px] font-bold text-emerald-700 mt-2">Makes letter d (Drum & Stick)</p>
            </div>
          </div>

          <div className="bg-amber-100 rounded-2xl p-4 border border-amber-300 max-w-md mx-auto">
            <span className="font-extrabold text-amber-950 text-sm">
              Together they spell "b - e - d" (bed)!
            </span>
            <p className="text-xs text-amber-900 mt-1">
              The bed headboard is on the left (b), you sleep in the middle (e), and the footboard is on the right (d)!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

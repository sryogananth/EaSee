import React from 'react';
import { UserProfile } from '../types';
import { THIRTY_DAY_CURRICULUM } from '../data/thirtyDayPlan';
import { sound } from '../utils/sound';
import { Lock, Compass } from 'lucide-react';

interface AdventureMapViewProps {
  profile: UserProfile;
  onSelectDay: (dayNumber: number) => void;
}

export const AdventureMapView: React.FC<AdventureMapViewProps> = ({
  profile,
  onSelectDay,
}) => {
  const completedSet = new Set(profile.completedDays);
  const nextUnlockedDay = profile.completedDays.length > 0
    ? Math.min(30, Math.max(...profile.completedDays) + 1)
    : 1;

  const worlds = [
    { title: 'World 1: Whispering Woods', days: THIRTY_DAY_CURRICULUM.slice(0, 7), bg: 'from-emerald-400/20 to-teal-400/10' },
    { title: 'World 2: Crystal Cove', days: THIRTY_DAY_CURRICULUM.slice(7, 14), bg: 'from-sky-400/20 to-indigo-400/10' },
    { title: 'World 3: Sky Peaks & Cloud Ocean', days: THIRTY_DAY_CURRICULUM.slice(14, 21), bg: 'from-indigo-400/20 to-purple-400/10' },
    { title: 'World 4: Star Castle & Graduation', days: THIRTY_DAY_CURRICULUM.slice(21, 30), bg: 'from-amber-400/20 to-orange-400/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in w-full">
      {/* Header */}
      <div className="glass-card-mint p-4 sm:p-6 rounded-3xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>1-Month Journey Archipelago</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
            The 30-Day Reading Expedition 🗺️
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Travel island by island! Each 5-10 minute day unlocks new stars, characters, and superpowers.
          </p>
        </div>

        <div className="glass-pill px-3 py-1.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Progress</span>
          <div className="text-sm sm:text-base font-black text-emerald-950">
            {profile.completedDays.length} / 30 Islands
          </div>
        </div>
      </div>

      {/* Worlds and Island Nodes */}
      <div className="space-y-6">
        {worlds.map((world, wIdx) => (
          <div
            key={wIdx}
            className={`rounded-3xl p-4 sm:p-6 md:p-8 border border-white/80 bg-gradient-to-r ${world.bg} glass-card`}
          >
            <h3 className="text-base sm:text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{world.title}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
              {world.days.map((day) => {
                const isCompleted = completedSet.has(day.dayNumber);
                const isCurrent = day.dayNumber === nextUnlockedDay;
                const isLocked = day.dayNumber > nextUnlockedDay;

                return (
                  <button
                    key={day.dayNumber}
                    disabled={isLocked}
                    onClick={() => {
                      sound.playPop(520);
                      onSelectDay(day.dayNumber);
                    }}
                    className={`relative rounded-3xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-200 border select-none ${
                      isCompleted
                        ? 'bg-white/80 border-emerald-300 shadow-sm hover:scale-105'
                        : isCurrent
                        ? 'glass-card-amber border-amber-400 shadow-lg scale-105 ring-4 ring-amber-200'
                        : 'bg-white/30 border-slate-200/60 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-pill flex items-center justify-center text-2xl sm:text-3xl mb-1.5 relative shadow-xs">
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-slate-400" />
                      ) : (
                        <span>{day.badgeEmoji}</span>
                      )}

                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-xs">
                          ✓
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] sm:text-xs font-black text-slate-800 truncate w-full">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 truncate w-full mt-0.5">
                      {day.title}
                    </span>

                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1">
                      {isCompleted ? '⭐ Mastered' : isCurrent ? '🌟 Ready!' : 'Locked'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

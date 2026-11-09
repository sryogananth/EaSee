import React from 'react';
import { UserProfile, DayLesson } from '../types';
import { THIRTY_DAY_CURRICULUM } from '../data/thirtyDayPlan';
import { sound } from '../utils/sound';
import { MapPin, Lock, CheckCircle2, Star, Sparkles, Trophy, Compass } from 'lucide-react';

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
    { title: 'World 1: Whispering Woods', days: THIRTY_DAY_CURRICULUM.slice(0, 7), bg: 'from-emerald-500/10 to-teal-500/10' },
    { title: 'World 2: Crystal Cove', days: THIRTY_DAY_CURRICULUM.slice(7, 14), bg: 'from-sky-500/10 to-indigo-500/10' },
    { title: 'World 3: Sky Peaks & Cloud Ocean', days: THIRTY_DAY_CURRICULUM.slice(14, 21), bg: 'from-indigo-500/10 to-purple-500/10' },
    { title: 'World 4: Star Castle & Graduation', days: THIRTY_DAY_CURRICULUM.slice(21, 30), bg: 'from-amber-500/10 to-orange-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-4 border-emerald-300 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>1-Month Journey Archipelago</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            The 30-Day Reading Expedition 🗺️
          </h2>
          <p className="text-slate-600 text-sm mt-0.5">
            Travel island by island! Each 5-10 minute day unlocks new stars, characters, and superpowers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Exploration Progress</span>
            <div className="text-lg font-black text-emerald-950">
              {profile.completedDays.length} / 30 Islands Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Worlds and Island Nodes */}
      <div className="space-y-8">
        {worlds.map((world, wIdx) => (
          <div
            key={wIdx}
            className={`rounded-3xl p-6 md:p-8 border-2 border-slate-200 bg-gradient-to-r ${world.bg} backdrop-blur-xs`}
          >
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{world.title}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3.5">
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
                    className={`relative rounded-3xl p-4 flex flex-col items-center text-center transition-all duration-200 border-2 select-none ${
                      isCompleted
                        ? 'bg-white border-emerald-300 shadow-sm hover:scale-105'
                        : isCurrent
                        ? 'bg-amber-100 border-amber-400 shadow-lg scale-105 ring-4 ring-amber-200 animate-pulse-glow'
                        : 'bg-white/40 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Badge Emoji */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-2 shadow-xs relative">
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-slate-400" />
                      ) : (
                        <span>{day.badgeEmoji}</span>
                      )}

                      {isCompleted && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                          ✓
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-black text-slate-800">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 truncate w-full mt-0.5">
                      {day.title}
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-2">
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

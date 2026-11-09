import React from 'react';
import { UserProfile } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { BarChart2, Printer, ShieldCheck, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface ParentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ParentReportModal: React.FC<ParentReportModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const handlePrintCertificate = () => {
    sound.playFanfare();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-[94vw] sm:w-full max-w-2xl glass-card bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/95 p-4 sm:p-6 md:p-8 overflow-hidden my-auto max-h-[92dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800">
                Parent & Educator Insights
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Diagnostics on letter reversal patterns and mastery levels.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
          {/* Quick Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="glass-card-amber p-2.5 text-center rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Player</span>
              <p className="text-sm sm:text-base font-black text-amber-950 truncate mt-0.5">{profile.name || 'Champion'}</p>
              <span className="text-[10px] text-amber-900 font-semibold">Age {profile.age}</span>
            </div>

            <div className="glass-card-mint p-2.5 text-center rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Streak</span>
              <p className="text-sm sm:text-base font-black text-emerald-950 mt-0.5">{profile.currentStreak} Days</p>
              <span className="text-[10px] text-emerald-900 font-semibold">Best: {profile.bestStreak}d</span>
            </div>

            <div className="glass-card-sky p-2.5 text-center rounded-2xl">
              <span className="text-[10px] font-bold text-sky-800 uppercase">Stars</span>
              <p className="text-sm sm:text-base font-black text-sky-950 mt-0.5">⭐ {profile.stars}</p>
              <span className="text-[10px] text-sky-900 font-semibold">{profile.unlockedStickers.length}/24 Badges</span>
            </div>

            <div className="glass-card-purple p-2.5 text-center rounded-2xl">
              <span className="text-[10px] font-bold text-purple-800 uppercase">Curriculum</span>
              <p className="text-sm sm:text-base font-black text-purple-950 mt-0.5">{profile.completedDays.length} / 30</p>
              <span className="text-[10px] text-purple-900 font-semibold">Islands Done</span>
            </div>
          </div>

          {/* Diagnostic Breakdown */}
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 mb-2">
              Confusion Discrimination Diagnostics:
            </h4>
            <div className="space-y-2">
              {CONFUSION_PAIRS.map((pair) => {
                const stat = profile.pairStats[pair.id] || { correct: 0, total: 0 };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                const status =
                  stat.total === 0
                    ? 'New'
                    : pct >= 80
                    ? 'Mastered'
                    : pct >= 50
                    ? 'In Progress'
                    : 'Focus Needed';

                return (
                  <div
                    key={pair.id}
                    className="glass-card p-2.5 sm:p-3 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg sm:text-xl font-black text-slate-800 font-dyslexic glass-pill px-2 py-0.5 rounded-xl shrink-0">
                        {pair.charA} <span className="text-slate-400 font-normal text-xs">vs</span> {pair.charB}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-xs text-slate-800 truncate">{pair.title}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{pair.ruleTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-bold text-slate-500">
                          {stat.correct}/{stat.total} ({pct}%)
                        </span>
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                          <div
                            className={`h-full ${
                              pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                          status === 'Mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'Focus Needed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Tips */}
          <div className="glass-card-sky p-3 rounded-2xl space-y-1">
            <h5 className="font-extrabold text-xs text-sky-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Evidence-Based Dyslexia Tips:</span>
            </h5>
            <ul className="text-[11px] text-sky-800 space-y-1 list-disc pl-4">
              <li><strong>Multi-sensory tracing:</strong> Draw letters in sand or shaving cream while vocalizing.</li>
              <li><strong>The "b-e-d" mnemonic:</strong> Two thumbs up in front of chest forms the word "bed", locking in orientation.</li>
              <li><strong>Bilateral midline crossing:</strong> The Lazy 8 exercise stimulates both brain hemispheres.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">
            Stored locally on this device.
          </span>
          <button
            onClick={handlePrintCertificate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 bouncy-glass-btn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { UserProfile } from '../types';
import { CONFUSION_PAIRS } from '../data/confusionPairs';
import { BarChart2, Award, Printer, CheckCircle2, AlertTriangle, ShieldCheck, X, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-slate-300 p-6 md:p-8 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Parent & Educator Insights
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Detailed diagnostics on reversal patterns, mastery levels, and recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
          {/* Quick Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-bold text-amber-700 uppercase">Player Name</span>
              <p className="text-lg font-black text-amber-950 truncate mt-0.5">{profile.name || 'Champion'}</p>
              <span className="text-[11px] text-amber-800 font-semibold">Age: {profile.age} yrs</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Daily Streak</span>
              <p className="text-lg font-black text-emerald-950 mt-0.5">{profile.currentStreak} Days</p>
              <span className="text-[11px] text-emerald-800 font-semibold">Best: {profile.bestStreak}d</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-bold text-sky-700 uppercase">Total Stars</span>
              <p className="text-lg font-black text-sky-950 mt-0.5">⭐ {profile.stars}</p>
              <span className="text-[11px] text-sky-800 font-semibold">{profile.unlockedStickers.length}/24 Stickers</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-bold text-purple-700 uppercase">Curriculum</span>
              <p className="text-lg font-black text-purple-950 mt-0.5">{profile.completedDays.length} / 30</p>
              <span className="text-[11px] text-purple-800 font-semibold">Days Mastered</span>
            </div>
          </div>

          {/* Diagnostic Breakdown per Confusion Pair */}
          <div>
            <h4 className="font-extrabold text-base text-slate-800 mb-3 flex items-center gap-2">
              <span>Confusion Discrimination Diagnostics:</span>
            </h4>
            <div className="space-y-3">
              {CONFUSION_PAIRS.map((pair) => {
                const stat = profile.pairStats[pair.id] || { correct: 0, total: 0 };
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                const status =
                  stat.total === 0
                    ? 'Not Practiced'
                    : pct >= 80
                    ? 'Mastered'
                    : pct >= 50
                    ? 'In Progress'
                    : 'Needs Focus';

                return (
                  <div
                    key={pair.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-slate-800 font-dyslexic bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                        {pair.charA} <span className="text-slate-400 font-normal text-sm">vs</span> {pair.charB}
                      </span>
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-800">{pair.title}</h5>
                        <p className="text-xs text-slate-500">{pair.ruleTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-500">
                          {stat.correct} / {stat.total} ({pct}%)
                        </span>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap ${
                          status === 'Mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'Needs Focus'
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

          {/* Clinical & Home Tips */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
            <h5 className="font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Evidence-Based Tips for Dyslexic Learners:</span>
            </h5>
            <ul className="text-xs text-sky-800 space-y-1.5 list-disc pl-4">
              <li><strong>Multi-sensory tracing:</strong> Have the child draw letters in sand, shaving cream, or on sandpaper while saying the sound out loud.</li>
              <li><strong>Use the "b-e-d" mnemonic:</strong> Two thumbs up in front of chest creates the word "bed", fixing the orientation of `b` and `d` permanently.</li>
              <li><strong>Midline crossing:</strong> Exercises like the Lazy 8 and Cross-Crawl tap activate both brain hemispheres, improving spatial perception.</li>
              <li><strong>Warm ivory/tinted paper:</strong> High-contrast black on white can cause visual vibration. Keep the warm paper tint enabled for easier reading.</li>
            </ul>
          </div>
        </div>

        {/* Footer with Printable Certificate trigger */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">
            All data stored strictly on this device.
          </span>
          <button
            onClick={handlePrintCertificate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs md:text-sm flex items-center gap-2 shadow-sm bouncy-btn"
          >
            <Printer className="w-4 h-4" />
            <span>Print Achievement Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

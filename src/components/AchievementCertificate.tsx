import React from 'react';
import { UserProfile } from '../types';
import { AVATARS } from '../utils/theme';
import { Award, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface AchievementCertificateProps {
  profile: UserProfile;
}

export const AchievementCertificate: React.FC<AchievementCertificateProps> = ({ profile }) => {
  const currentAvatar = AVATARS.find((a) => a.id === profile.avatar) || AVATARS[0];
  const todayDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block fixed inset-0 bg-white p-8 z-[9999] text-center font-lexend">
      <div className="w-full h-full border-8 border-double border-amber-500 rounded-3xl p-10 flex flex-col justify-between items-center relative bg-gradient-to-b from-amber-50/30 to-white">
        {/* Certificate Seal & Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest">
            ★ Official Reading & Motor Mastery Certificate ★
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight mt-4">
            SUPER READER CHAMPION
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            This certificate of honorary excellence is proudly awarded to:
          </p>
        </div>

        {/* Child's Name */}
        <div className="my-6 border-b-4 border-amber-400 pb-2 px-12">
          <h2 className="text-6xl font-black text-amber-950 font-dyslexic tracking-wide">
            {profile.name || 'Champion Explorer'}
          </h2>
        </div>

        {/* Achievement Details */}
        <div className="max-w-2xl text-slate-700 text-base md:text-lg space-y-2">
          <p>
            For demonstrating incredible dedication, sharp visual discrimination, and triumphing over confusing letters and numbers (b, d, p, q, 5, S, 2, Z) with patience and courage!
          </p>
          <div className="flex justify-center gap-8 pt-4 font-bold text-amber-900">
            <span>⭐ {profile.stars} Stars Earned</span>
            <span>🔥 {profile.currentStreak} Day Practice Streak</span>
            <span>🏆 {profile.completedDays.length} Island Quests Conquered</span>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="w-full flex justify-between items-end px-12 pt-8">
          <div className="text-left">
            <p className="font-mono text-sm font-bold text-slate-500">Date Awarded: {todayDate}</p>
            <p className="font-bold text-slate-800 mt-1">EaSee Dyslexia Academy</p>
          </div>

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-md border-4 border-white">
            {currentAvatar.emoji}
          </div>

          <div className="text-right">
            <p className="font-script text-2xl text-indigo-700 font-bold">Dr. Oliver Owl</p>
            <p className="font-bold text-slate-800 text-sm border-t border-slate-300 pt-1 mt-1">
              Chief Learning Companion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

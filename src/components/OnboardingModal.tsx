import React, { useState } from 'react';
import { UserProfile, GenderType, AvatarType } from '../types';
import { AVATARS } from '../utils/theme';
import { sound } from '../utils/sound';
import { fireStarBurst } from '../utils/confetti';
import { Sparkles, Rocket, Volume2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profileData: Partial<UserProfile>) => void;
  initialProfile: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, initialProfile }) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [age, setAge] = useState<number>(initialProfile.age || 6);
  const [gender, setGender] = useState<GenderType>(initialProfile.gender || 'boy');
  const [avatar, setAvatar] = useState<AvatarType>(initialProfile.avatar || 'fox');
  const [email, setEmail] = useState<string>(initialProfile.email || '');
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSpeakWelcome = () => {
    sound.speak("Hi there explorer! Welcome to EaSee! Pick your friendly character, tell us your age, and let's play fun reading games!", true);
  };

  const handleFinish = () => {
    sound.playFanfare();
    fireStarBurst();
    sound.speak(`Welcome aboard, ${name.trim() || 'Champion'}! Let's start having fun!`, true);
    onComplete({
      name: name.trim() || (gender === 'girl' ? 'Starlight Star' : 'Little Champion'),
      age,
      gender,
      avatar,
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-[94vw] sm:w-full max-w-xl glass-card bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/95 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[92dvh] my-auto">
        
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Welcome to EaSee Kids Club!</span>
            <button
              onClick={handleSpeakWelcome}
              type="button"
              className="ml-1 p-0.5 hover:bg-amber-200 rounded-full transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-800" />
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Make Your Player Card! 🎨
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
            No password required. Saved locally on this device.
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-4 sm:space-y-5">
            {/* Nickname */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs sm:text-sm">
                What is your name or superhero nickname?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo, Maya, Super Sam..."
                maxLength={20}
                className="w-full text-base sm:text-lg font-bold px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all glass-pill"
              />
            </div>

            {/* Age Selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs sm:text-sm">
                How old are you? <span className="text-slate-400 font-normal">(Scales speed & size)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((a) => {
                  const isSelected = age === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAge(a);
                        sound.playPop(350 + a * 30);
                      }}
                      className={`flex-1 min-w-[38px] sm:min-w-[48px] py-2 sm:py-2.5 rounded-xl font-black text-sm sm:text-base transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-amber-950 scale-105 shadow-sm border border-amber-500'
                          : 'glass-pill text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      {a === 12 ? '12+' : a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hero Badge Identity */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs sm:text-sm">
                Choose your hero badge:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'boy' as GenderType, label: 'Boy Explorer', emoji: '👦', bg: 'glass-card-sky text-blue-900' },
                  { id: 'girl' as GenderType, label: 'Girl Explorer', emoji: '👧', bg: 'glass-card-purple text-pink-900' },
                  { id: 'prefer-not-say' as GenderType, label: 'Super Star', emoji: '🌟', bg: 'glass-card-amber text-purple-900' }
                ].map((g) => {
                  const active = gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGender(g.id);
                        sound.playPop(480);
                      }}
                      className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                        active
                          ? 'border-amber-500 bg-amber-100/90 text-amber-950 scale-102 shadow-xs'
                          : `${g.bg} opacity-80 hover:opacity-100`
                      }`}
                    >
                      <span className="text-xl">{g.emoji}</span>
                      <span className="truncate">{g.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Companion Avatars */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs sm:text-sm">
                Pick your friendly companion:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATARS.map((av) => {
                  const active = avatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setAvatar(av.id);
                        sound.playPop(520);
                        sound.speak(av.tagline);
                      }}
                      className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all ${
                        active
                          ? 'border-indigo-400 bg-indigo-50/90 shadow-sm scale-105'
                          : 'glass-card hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-0.5">{av.emoji}</span>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full">{av.label.split(' ')[0]}</span>
                      {active && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-amber-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-md glass-action-btn flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue to Cloud Sync & Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass-card-sky p-4 rounded-2xl text-sky-950">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl">☁️</span>
                <div>
                  <h4 className="font-black text-sm text-sky-900">
                    Play Across Laptop, iPad or Phone!
                  </h4>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Your progress is saved locally. If you'd like to pick up on your school iPad or home laptop, enter an optional email below!
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs sm:text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Parent Email (Optional):</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com (optional)"
                className="w-full text-sm font-medium px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none glass-pill"
              />
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero spam guarantee. Used only to send restore links.</span>
              </p>
            </div>

            <div className="glass-card-amber p-3 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Child Sync Code</p>
                <p className="text-lg font-black text-amber-950 font-mono tracking-widest">{initialProfile.syncCode || 'STAR-77'}</p>
              </div>
              <span className="text-[10px] text-amber-900 max-w-[150px] text-right font-medium">
                Type this on other devices to load this progress!
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl text-slate-600 font-bold hover:bg-slate-100 text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 px-6 rounded-2xl shadow-md glass-action-btn flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Start Practicing!</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

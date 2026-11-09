import React, { useState } from 'react';
import { UserProfile, GenderType, AvatarType } from '../types';
import { AVATARS } from '../utils/theme';
import { sound } from '../utils/sound';
import { fireStarBurst } from '../utils/confetti';
import { Sparkles, Heart, Rocket, Volume2, ShieldCheck, Mail, ArrowRight, UserCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8 overflow-hidden my-auto">
        {/* Playful background decorative blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-100 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Welcome to EaSee Kids Club!</span>
            <button
              onClick={handleSpeakWelcome}
              type="button"
              className="ml-1 p-1 hover:bg-amber-200 rounded-full transition-colors"
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
            </button>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Let's Make Your Player Card! 🎨
          </h2>
          <p className="text-slate-600 font-medium text-sm md:text-base mt-1">
            No password needed! Saved right on this device so you can play in seconds.
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            {/* Child's Nickname */}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-base md:text-lg flex items-center gap-2">
                <span>What is your name or superhero nickname?</span>
                <span className="text-amber-500 font-normal text-xs">(Whatever you like!)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo, Maya, Super Sam..."
                maxLength={20}
                className="w-full text-xl font-bold px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Age selector (4 - 12+) */}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-base md:text-lg">
                How old are you? <span className="text-slate-400 text-sm font-normal">(We adjust game speed and size for your age!)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
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
                      className={`flex-1 min-w-[54px] py-3 rounded-2xl font-black text-lg md:text-xl transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-amber-950 scale-105 shadow-md border-2 border-amber-500'
                          : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:scale-102 border-2 border-transparent'
                      }`}
                    >
                      {a === 12 ? '12+' : a}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender / Hero Identity */}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-base">
                Choose your hero badge:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'boy' as GenderType, label: 'Boy Explorer', emoji: '👦', bg: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { id: 'girl' as GenderType, label: 'Girl Explorer', emoji: '👧', bg: 'bg-pink-50 border-pink-200 text-pink-800' },
                  { id: 'prefer-not-say' as GenderType, label: 'Super Star', emoji: '🌟', bg: 'bg-purple-50 border-purple-200 text-purple-800' }
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
                      className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                        active
                          ? 'border-amber-500 bg-amber-100 text-amber-900 scale-102 shadow-sm'
                          : `${g.bg} opacity-80 hover:opacity-100`
                      }`}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <span className="text-sm">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-base">
                Pick your friendly companion:
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
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
                      className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                        active
                          ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-3xl mb-1">{av.emoji}</span>
                      <span className="text-xs font-bold text-slate-700">{av.label}</span>
                      {active && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next / Proceed button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-amber-950 font-black text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-3 bouncy-btn"
              >
                <span>Continue to Cloud Sync & Start</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Optional Email Registration & Multi-device pickup */
          <div className="space-y-6">
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-5 text-sky-950">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-200 flex items-center justify-center shrink-0 text-xl">
                  ☁️
                </div>
                <div>
                  <h4 className="font-extrabold text-base md:text-lg text-sky-900">
                    Play Across Laptop, iPad, Tablet or Phone!
                  </h4>
                  <p className="text-sm text-sky-800 mt-1">
                    Your progress is already safely saved on this device. If you'd like to pick up on your school Chromebook, family iPad, or home laptop, you can enter a parent email below or get your secret 6-digit sync code!
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-2 text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Parent Email (Optional):</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com (optional)"
                className="w-full text-lg font-medium px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero spam guarantee. Used only to send your restore link so your stars are never lost!</span>
              </p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Your Child Sync Code</p>
                <p className="text-xl font-black text-amber-950 font-mono tracking-widest">{initialProfile.syncCode || 'STAR-77'}</p>
              </div>
              <span className="text-xs text-amber-800 max-w-[200px] text-right">
                Type this on any other device to load this exact progress!
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-white font-black text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-3 bouncy-btn"
              >
                <Rocket className="w-5 h-5" />
                <span>Blast Off & Start Practicing!</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1">🔒 100% Private & Kid-Safe</span>
          <span className="flex items-center gap-1">⚡ Instant Local Storage</span>
          <span className="flex items-center gap-1">✨ Dyslexia Art Directed</span>
        </div>
      </div>
    </div>
  );
};

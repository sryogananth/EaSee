import React, { useState } from 'react';
import { UserProfile, PaperTint } from '../types';
import { AVATARS, TINT_STYLES } from '../utils/theme';
import { sound } from '../utils/sound';
import {
  Sparkles,
  Flame,
  Star,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Palette,
  Cloud,
  Award,
  BarChart2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  onUpdateSettings: (newSettings: UserProfile['settings']) => void;
  onOpenProfile: () => void;
  onOpenSync: () => void;
  onOpenParentReport: () => void;
  onOpenStickerAlbum: () => void;
  activeView: 'daily' | 'arcade' | 'adventure';
  onChangeView: (view: 'daily' | 'arcade' | 'adventure') => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateSettings,
  onOpenProfile,
  onOpenSync,
  onOpenParentReport,
  onOpenStickerAlbum,
  activeView,
  onChangeView,
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const currentAvatar = AVATARS.find((a) => a.id === profile.avatar) || AVATARS[0];

  const toggleSound = () => {
    const newState = !profile.settings.enableSoundEffects;
    sound.setSoundEnabled(newState);
    sound.setVoiceEnabled(newState);
    onUpdateSettings({
      ...profile.settings,
      enableSoundEffects: newState,
      enableVoice: newState,
    });
    if (newState) sound.playPop(520);
  };

  const toggleDyslexicFont = () => {
    const newState = !profile.settings.useDyslexicFont;
    sound.playPop(480);
    onUpdateSettings({
      ...profile.settings,
      useDyslexicFont: newState,
    });
  };

  const toggleReadingRuler = () => {
    const newState = !profile.settings.readingRuler;
    sound.playPop(450);
    onUpdateSettings({
      ...profile.settings,
      readingRuler: newState,
    });
  };

  const setPaperTint = (tint: PaperTint) => {
    sound.playPop(400);
    onUpdateSettings({
      ...profile.settings,
      paperTint: tint,
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 border-b border-amber-200/60 shadow-sm px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Brand Logo & Child Profile Pill */}
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2 cursor-pointer group p-1 -ml-1 rounded-2xl hover:bg-amber-100/60 transition-colors"
            title="Edit Player Profile"
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${currentAvatar.bgGradient} flex items-center justify-center text-2xl shadow-md border-2 border-white group-hover:scale-105 transition-transform`}>
              {currentAvatar.emoji}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-800 leading-tight">
                  {profile.name || 'Hero'}
                </span>
                <span className="text-[11px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md">
                  Age {profile.age}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {currentAvatar.label}
              </span>
            </div>
          </div>

          {/* Main App Title */}
          <div className="hidden lg:flex items-center gap-1 border-l pl-4 border-slate-200">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
              EaSee
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-1">
              Kids Quest
            </span>
          </div>
        </div>

        {/* View Switcher Tabs (Daily Quest, Endless Arcade, 30-Day Map) */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => {
              onChangeView('daily');
              sound.playPop(480);
            }}
            className={`px-3 md:px-4 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-1.5 ${
              activeView === 'daily'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily 7-Min</span>
          </button>

          <button
            onClick={() => {
              onChangeView('arcade');
              sound.playPop(520);
            }}
            className={`px-3 md:px-4 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-1.5 ${
              activeView === 'arcade'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-400 text-white shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Endless Arcade</span>
          </button>

          <button
            onClick={() => {
              onChangeView('adventure');
              sound.playPop(560);
            }}
            className={`px-3 md:px-4 py-1.5 rounded-xl text-xs md:text-sm font-black transition-all flex items-center gap-1.5 ${
              activeView === 'adventure'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🗺️ 30-Day Map</span>
          </button>
        </nav>

        {/* Rewards Counters & Accessibility Toolbar */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Star Bank */}
          <div
            onClick={onOpenStickerAlbum}
            className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-2xl cursor-pointer hover:bg-amber-200 transition-colors shadow-sm"
            title="Open Sticker Album"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span className="font-black text-amber-950 text-sm md:text-base">
              {profile.stars}
            </span>
          </div>

          {/* Daily Streak Flame */}
          <div
            className="flex items-center gap-1 bg-orange-100 border border-orange-300 px-2.5 py-1.5 rounded-2xl text-orange-700 shadow-sm"
            title={`${profile.currentStreak} Day Reading Streak!`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-extrabold text-xs md:text-sm">
              {profile.currentStreak}d
            </span>
          </div>

          {/* Stickers shortcut */}
          <button
            onClick={onOpenStickerAlbum}
            className="hidden md:flex items-center gap-1.5 p-2 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 transition-colors"
            title="Sticker Album"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold">{profile.unlockedStickers.length}/24</span>
          </button>

          {/* Parent Report Shortcut */}
          <button
            onClick={onOpenParentReport}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Parent & Teacher Analytics Report"
          >
            <BarChart2 className="w-4 h-4 text-slate-600" />
          </button>

          {/* Cloud Sync shortcut */}
          <button
            onClick={onOpenSync}
            className="p-2 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200 transition-colors"
            title="Sync Across Devices"
          >
            <Cloud className="w-4 h-4 text-sky-600" />
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={profile.settings.enableSoundEffects ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {profile.settings.enableSoundEffects ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-500" />
            )}
          </button>

          {/* Accessibility Settings Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-900 border border-amber-300 transition-colors"
              title="Dyslexia Sensory & Reading Settings"
            >
              <Settings className="w-4 h-4 text-amber-900" />
            </button>

            {/* Dropdown Menu */}
            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border-2 border-amber-200 p-4 z-50 animate-scale-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-extrabold text-sm text-slate-800">
                    Dyslexia Comfort Studio 👓
                  </span>
                  <button
                    onClick={() => setShowSettingsDropdown(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Done
                  </button>
                </div>

                <div className="space-y-3.5 py-3 text-xs">
                  {/* Dyslexic Font Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-indigo-500" />
                      OpenDyslexic Font
                    </span>
                    <button
                      onClick={toggleDyslexicFont}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        profile.settings.useDyslexicFont ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          profile.settings.useDyslexicFont ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reading Ruler Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-500" />
                      Guided Reading Ruler
                    </span>
                    <button
                      onClick={toggleReadingRuler}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        profile.settings.readingRuler ? 'bg-amber-500' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          profile.settings.readingRuler ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Anti-Glare Paper Tint Selector */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-pink-500" />
                      Visual Stress Paper Tint:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(Object.keys(TINT_STYLES) as PaperTint[]).map((tintKey) => {
                        const info = TINT_STYLES[tintKey];
                        const active = profile.settings.paperTint === tintKey;
                        return (
                          <button
                            key={tintKey}
                            onClick={() => setPaperTint(tintKey)}
                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                              active
                                ? 'border-amber-500 shadow-sm font-extrabold ring-2 ring-amber-200'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ backgroundColor: info.hex }}
                          >
                            <span className="truncate">{info.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

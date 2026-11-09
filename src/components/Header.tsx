import React, { useState } from 'react';
import { UserProfile, PaperTint } from '../types';
import { AVATARS, TINT_STYLES } from '../utils/theme';
import { sound } from '../utils/sound';
import {
  Sparkles,
  Flame,
  Star,
  Settings2,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Palette,
  Cloud,
  Award,
  BarChart2,
  Clock,
  Menu,
  X,
  Compass,
  Gamepad2,
  Sun
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
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
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
    <>
      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 border-b border-white/80 shadow-[0_4px_24px_rgba(100,116,139,0.06)] px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Companion Avatar Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenProfile}
              type="button"
              className="flex items-center gap-2 glass-pill px-2 sm:px-3 py-1.5 rounded-2xl hover:scale-102 active:scale-98 transition-all group border border-white/90 shadow-sm"
              title="Change Companion or Profile"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${currentAvatar.bgGradient} flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-white/80 group-hover:rotate-6 transition-transform`}>
                {currentAvatar.emoji}
              </div>
              <div className="text-left hidden xs:block">
                <span className="font-extrabold text-xs sm:text-sm text-slate-800 leading-tight block truncate max-w-[85px] sm:max-w-[120px]">
                  {profile.name || 'Hero'}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded-md">
                  Age {profile.age}
                </span>
              </div>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                EaSee
              </span>
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                Kids Quest
              </span>
            </div>
          </div>

          {/* Desktop Glass Navigation Pills (Hidden on Mobile, replaced by Bottom Dock) */}
          <nav className="hidden md:flex items-center glass-pill p-1 rounded-2xl border border-white/90 shadow-xs">
            <button
              onClick={() => {
                onChangeView('daily');
                sound.playPop(480);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeView === 'daily'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 shadow-sm scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeView === 'arcade'
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-sm scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Arcade Lab</span>
            </button>

            <button
              onClick={() => {
                onChangeView('adventure');
                sound.playPop(560);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeView === 'adventure'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>30-Day Map</span>
            </button>
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Star Bank */}
            <button
              onClick={onOpenStickerAlbum}
              type="button"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 px-2.5 sm:px-3 py-1.5 rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs"
              title="Open Sticker Album"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-black text-amber-950 text-xs sm:text-sm">
                {profile.stars}
              </span>
            </button>

            {/* Streak Flame */}
            <div
              className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200/80 px-2 sm:px-2.5 py-1.5 rounded-2xl text-orange-700 shadow-xs"
              title={`${profile.currentStreak} Day Practice Streak!`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500" />
              <span className="font-extrabold text-[11px] sm:text-xs">
                {profile.currentStreak}d
              </span>
            </div>

            {/* Sound Toggle (Desktop & Tablet) */}
            <button
              onClick={toggleSound}
              type="button"
              className="p-2 rounded-2xl glass-pill hover:bg-white text-slate-700 transition-colors shadow-xs"
              title={profile.settings.enableSoundEffects ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {profile.settings.enableSoundEffects ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-500" />
              )}
            </button>

            {/* Dyslexia Sensory Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                type="button"
                className="p-2 rounded-2xl bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 border border-amber-200/80 transition-all shadow-xs"
                title="Dyslexia Sensory & Reading Settings"
              >
                <Settings2 className="w-4 h-4 text-amber-900" />
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {showSettingsDropdown && (
                <div className="absolute right-0 mt-3 w-72 sm:w-80 glass-card p-5 z-50 animate-scale-in border border-white/90 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
                    <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Dyslexia Comfort Studio</span>
                    </span>
                    <button
                      onClick={() => setShowSettingsDropdown(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 py-3 text-xs">
                    {/* Dyslexic Font Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-2">
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
                      <span className="font-bold text-slate-700 flex items-center gap-2">
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

                    {/* Paper Tint Selector */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-pink-500" />
                        Anti-Glare Paper Tint:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(Object.keys(TINT_STYLES) as PaperTint[]).map((tintKey) => {
                          const info = TINT_STYLES[tintKey];
                          const active = profile.settings.paperTint === tintKey;
                          return (
                            <button
                              key={tintKey}
                              onClick={() => setPaperTint(tintKey)}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 ${
                                active
                                  ? 'border-amber-500 shadow-sm font-black ring-2 ring-amber-300 scale-102'
                                  : 'border-slate-200/80 hover:border-slate-300'
                              }`}
                              style={{ backgroundColor: info.hex }}
                            >
                              <span className="truncate">{info.name.split(' ')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Parent & Sync Links */}
                    <div className="pt-2 border-t border-slate-200/50 flex gap-2">
                      <button
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenParentReport();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Diagnostics</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          onOpenSync();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-sky-200/60"
                      >
                        <Cloud className="w-3.5 h-3.5 text-sky-600" />
                        <span>Cloud Sync</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Drawer Toggle (Replaces cramped top row icons) */}
            <button
              onClick={() => setShowMobileDrawer(true)}
              type="button"
              className="md:hidden p-2 rounded-2xl glass-pill hover:bg-white text-slate-700 shadow-xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slideout for Phone Screens) */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-[80vw] max-w-sm h-full glass-card rounded-none rounded-l-3xl p-6 flex flex-col justify-between shadow-2xl border-l border-white/90 animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black bg-gradient-to-r from-amber-500 to-indigo-600 bg-clip-text text-transparent">
                    EaSee Kids
                  </span>
                </div>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options */}
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => {
                    onChangeView('daily');
                    setShowMobileDrawer(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${
                    activeView === 'daily'
                      ? 'bg-amber-400 text-amber-950 shadow-md'
                      : 'glass-pill text-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>Daily 7-Min Workout</span>
                </button>

                <button
                  onClick={() => {
                    onChangeView('arcade');
                    setShowMobileDrawer(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${
                    activeView === 'arcade'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'glass-pill text-slate-700'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-indigo-600" />
                  <span>Endless Arcade Lab</span>
                </button>

                <button
                  onClick={() => {
                    onChangeView('adventure');
                    setShowMobileDrawer(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${
                    activeView === 'adventure'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'glass-pill text-slate-700'
                  }`}
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Expedition Map</span>
                </button>
              </div>

              {/* Extras & Tools */}
              <div className="space-y-2 mt-6 pt-4 border-t border-slate-200/60">
                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    onOpenStickerAlbum();
                  }}
                  className="w-full p-3 rounded-2xl glass-pill font-bold text-xs text-purple-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Sticker Album</span>
                  </span>
                  <span className="text-xs bg-purple-100 px-2 py-0.5 rounded-full font-black">
                    {profile.unlockedStickers.length}/24
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    onOpenParentReport();
                  }}
                  className="w-full p-3 rounded-2xl glass-pill font-bold text-xs text-indigo-900 flex items-center gap-2"
                >
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  <span>Parent & Diagnostic Report</span>
                </button>

                <button
                  onClick={() => {
                    setShowMobileDrawer(false);
                    onOpenSync();
                  }}
                  className="w-full p-3 rounded-2xl glass-pill font-bold text-xs text-sky-900 flex items-center gap-2"
                >
                  <Cloud className="w-4 h-4 text-sky-600" />
                  <span>Cross-Device Cloud Sync</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 text-center">
              <span className="text-[11px] font-bold text-slate-400">
                EaSee • Made for Dyslexic Superpowers 🌟
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Glass Dock (For Easy Thumb-Reach Navigation on Mobile) */}
      <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden pointer-events-auto">
        <div className="glass-card bg-white/85 backdrop-blur-2xl px-2 py-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/95 flex items-center justify-around">
          <button
            onClick={() => {
              onChangeView('daily');
              sound.playPop(480);
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeView === 'daily'
                ? 'bg-amber-400 text-amber-950 font-black shadow-xs scale-105'
                : 'text-slate-500 font-bold hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Daily</span>
          </button>

          <button
            onClick={() => {
              onChangeView('arcade');
              sound.playPop(520);
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeView === 'arcade'
                ? 'bg-indigo-500 text-white font-black shadow-xs scale-105'
                : 'text-slate-500 font-bold hover:text-slate-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Arcade</span>
          </button>

          <button
            onClick={() => {
              onChangeView('adventure');
              sound.playPop(560);
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              activeView === 'adventure'
                ? 'bg-emerald-500 text-white font-black shadow-xs scale-105'
                : 'text-slate-500 font-bold hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">30-Day</span>
          </button>

          <button
            onClick={onOpenStickerAlbum}
            className="flex flex-col items-center py-1.5 px-3 rounded-xl text-slate-500 font-bold hover:text-purple-700 transition-all"
          >
            <Award className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Stickers</span>
          </button>
        </div>
      </div>
    </>
  );
};

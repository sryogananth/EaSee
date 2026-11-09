import React, { useState } from 'react';
import { Sticker, UserProfile } from '../types';
import { STICKERS } from '../data/stickers';
import { sound } from '../utils/sound';
import { Star, Award, Lock, Sparkles, X } from 'lucide-react';

interface StickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Stickers' },
    { id: 'animals', label: '🐻 Animals' },
    { id: 'magic', label: '🪄 Magic' },
    { id: 'space', label: '🚀 Space' },
    { id: 'champions', label: '🏆 Champions' },
  ];

  const filteredStickers = activeCategory === 'all'
    ? STICKERS
    : STICKERS.filter((s) => s.category === activeCategory);

  const isUnlocked = (sticker: Sticker) => {
    return profile.unlockedStickers.includes(sticker.id) || profile.stars >= sticker.starsRequired;
  };

  const handleSelectSticker = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    if (isUnlocked(sticker)) {
      sound.playPop(520);
      sound.speak(`${sticker.name}! ${sticker.description}`, true);
    } else {
      sound.playGentleRetry();
      sound.speak(`Locked! Earn ${sticker.starsRequired} stars to unlock this sticker!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-[94vw] sm:w-full max-w-3xl glass-card bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/95 p-4 sm:p-6 md:p-8 overflow-hidden my-auto max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-xl sm:text-2xl shadow-sm text-white">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800">
                Collector's Sticker Album 🌟
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold hidden sm:block">
                Earn stars from daily workouts and games to peel exciting stickers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 glass-card-amber px-2.5 py-1 rounded-2xl">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="font-black text-amber-950 text-xs sm:text-sm">
                {profile.stars}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 py-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'glass-pill text-slate-600 hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="flex-1 overflow-y-auto pr-1 py-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {filteredStickers.map((sticker) => {
            const unlocked = isUnlocked(sticker);
            const isSelected = selectedSticker?.id === sticker.id;

            return (
              <div
                key={sticker.id}
                onClick={() => handleSelectSticker(sticker)}
                className={`relative rounded-2xl p-2.5 flex flex-col items-center text-center cursor-pointer transition-all duration-200 border select-none ${
                  unlocked
                    ? 'glass-card-purple hover:scale-105 hover:shadow-sm'
                    : 'bg-white/40 border-dashed border-slate-300 opacity-60'
                } ${isSelected ? 'ring-2 ring-purple-400 scale-105' : ''}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl glass-pill flex items-center justify-center text-2xl sm:text-3xl mb-1.5 relative shadow-xs">
                  {unlocked ? (
                    <span className="transform hover:scale-110 transition-transform">
                      {sticker.emoji}
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                  {unlocked && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <h5 className="font-extrabold text-[11px] text-slate-800 truncate w-full">
                  {sticker.name}
                </h5>

                <span className="text-[9px] font-bold text-purple-700 mt-0.5 truncate w-full">
                  {unlocked ? 'Unlocked!' : `${sticker.starsRequired} ⭐`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detail Card */}
        {selectedSticker && (
          <div className="mt-2.5 p-3 rounded-2xl glass-card-purple flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-3xl shrink-0">{selectedSticker.emoji}</span>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-purple-950 truncate">
                  {selectedSticker.name}
                </h4>
                <p className="text-[11px] text-purple-800 truncate">
                  {selectedSticker.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => sound.speak(`${selectedSticker.name}! ${selectedSticker.description}`, true)}
              className="p-1.5 glass-pill text-purple-800 text-xs font-bold shrink-0 ml-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

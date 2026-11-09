import React, { useState } from 'react';
import { Sticker, UserProfile } from '../types';
import { STICKERS } from '../data/stickers';
import { sound } from '../utils/sound';
import { Star, Award, Lock, Sparkles, X, Check } from 'lucide-react';

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
    { id: 'animals', label: '🐻 Animal Friends' },
    { id: 'magic', label: '🪄 Magic & Wonders' },
    { id: 'space', label: '🚀 Cosmic Quests' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-purple-300 p-6 md:p-8 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-2xl shadow-md text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Collector's Sticker Album 🌟
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-semibold">
                Earn stars from daily workouts and arcade games to peel exciting stickers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-2xl">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-black text-amber-950 text-sm md:text-base">
                {profile.stars} Stars
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 py-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredStickers.map((sticker) => {
            const unlocked = isUnlocked(sticker);
            const isSelected = selectedSticker?.id === sticker.id;

            return (
              <div
                key={sticker.id}
                onClick={() => handleSelectSticker(sticker)}
                className={`relative rounded-3xl p-3 flex flex-col items-center text-center cursor-pointer transition-all duration-200 border-2 select-none ${
                  unlocked
                    ? 'bg-gradient-to-b from-purple-50/70 to-pink-50/70 border-purple-200 hover:scale-105 hover:shadow-md'
                    : 'bg-slate-50 border-dashed border-slate-300 opacity-60 hover:opacity-80'
                } ${isSelected ? 'ring-4 ring-purple-400 scale-105' : ''}`}
              >
                {/* Sticker Emoji Artwork */}
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-2 relative">
                  {unlocked ? (
                    <span className="transform hover:scale-110 transition-transform">
                      {sticker.emoji}
                    </span>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                  {unlocked && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <h5 className="font-extrabold text-xs text-slate-800 truncate w-full">
                  {sticker.name}
                </h5>

                <span className="text-[10px] font-bold text-purple-700 mt-1">
                  {unlocked ? 'Unlocked!' : `${sticker.starsRequired} ⭐ required`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Sticker Detail Card */}
        {selectedSticker && (
          <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedSticker.emoji}</span>
              <div>
                <h4 className="font-extrabold text-base text-purple-950">
                  {selectedSticker.name}
                </h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  {selectedSticker.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => sound.speak(`${selectedSticker.name}! ${selectedSticker.description}`, true)}
              className="p-2 bg-purple-200 hover:bg-purple-300 rounded-xl text-purple-800 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Read Aloud</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

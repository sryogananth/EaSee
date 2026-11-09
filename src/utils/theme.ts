import { AvatarType, PaperTint } from '../types';

export interface AvatarInfo {
  id: AvatarType;
  label: string;
  emoji: string;
  bgGradient: string;
  tagline: string;
}

export const AVATARS: AvatarInfo[] = [
  { id: 'fox', label: 'Rusty Fox', emoji: '🦊', bgGradient: 'from-amber-400 to-orange-500', tagline: 'Curious & Quick!' },
  { id: 'dino', label: 'Dexter Dino', emoji: '🦖', bgGradient: 'from-emerald-400 to-green-600', tagline: 'Strong & Mighty!' },
  { id: 'owl', label: 'Ollie Owl', emoji: '🦉', bgGradient: 'from-sky-400 to-blue-600', tagline: 'Sharp Eyed & Wise!' },
  { id: 'astronaut', label: 'Astro Leo', emoji: '🧑‍🚀', bgGradient: 'from-purple-400 to-indigo-600', tagline: 'Star Explorer!' },
  { id: 'fairy', label: 'Flora Fairy', emoji: '🧚', bgGradient: 'from-pink-400 to-rose-500', tagline: 'Sparkly & Kind!' },
  { id: 'robot', label: 'Beep Bot', emoji: '🤖', bgGradient: 'from-cyan-400 to-teal-500', tagline: 'Super Thinker!' },
];

export const TINT_STYLES: Record<PaperTint, { bg: string; name: string; hex: string; desc: string }> = {
  ivory: {
    bg: 'bg-[#faf5ee]',
    name: 'Warm Ivory',
    hex: '#faf5ee',
    desc: 'Soft warm cream that prevents letter vibration and glare.',
  },
  peach: {
    bg: 'bg-[#fff4ec]',
    name: 'Soft Peach',
    hex: '#fff4ec',
    desc: 'Gentle warm tint proven to calm reading strain.',
  },
  mint: {
    bg: 'bg-[#f0fbf4]',
    name: 'Mint Dew',
    hex: '#f0fbf4',
    desc: 'Refreshing soft pastel green that eases tired eyes.',
  },
  lavender: {
    bg: 'bg-[#f6f2fe]',
    name: 'Lavender Breeze',
    hex: '#f6f2fe',
    desc: 'Peaceful soothing violet tint for focused clarity.',
  },
  sky: {
    bg: 'bg-[#f0f8ff]',
    name: 'Sky Blue',
    hex: '#f0f8ff',
    desc: 'Serene high-contrast pastel daylight background.',
  },
  white: {
    bg: 'bg-white',
    name: 'Classic White',
    hex: '#ffffff',
    desc: 'Standard crisp clean backdrop.',
  },
};

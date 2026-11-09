export type AvatarType = 'fox' | 'dino' | 'owl' | 'astronaut' | 'fairy' | 'robot';
export type GenderType = 'boy' | 'girl' | 'prefer-not-say';
export type PaperTint = 'ivory' | 'peach' | 'mint' | 'lavender' | 'sky' | 'white';

export interface UserSettings {
  useDyslexicFont: boolean;
  enableVoice: boolean;
  enableSoundEffects: boolean;
  readingRuler: boolean;
  rulerColor: string;
  paperTint: PaperTint;
  highContrast: boolean;
  largeText: boolean;
}

export interface PairScore {
  correct: number;
  total: number;
  lastPracticed: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: GenderType;
  avatar: AvatarType;
  email?: string;
  syncCode?: string;
  createdAt: string;
  lastActiveDate: string;
  stars: number;
  currentStreak: number;
  bestStreak: number;
  unlockedStickers: string[];
  completedDays: number[]; // e.g. [1, 2, 3...]
  pairStats: Record<string, PairScore>;
  dailyMinutesPracticed: number;
  settings: UserSettings;
}

export interface ConfusionPair {
  id: string;
  title: string;
  category: 'letters' | 'numbers' | 'rotations';
  charA: string;
  charB: string;
  ruleTitle: string;
  mnemonicA: string;
  mnemonicB: string;
  visualCueA: string;
  visualCueB: string;
  soundHintA: string;
  soundHintB: string;
  storyA: string;
  storyB: string;
  animalA: { name: string; emoji: string; color: string };
  animalB: { name: string; emoji: string; color: string };
  colorA: string;
  colorB: string;
  examplesA: string[];
  examplesB: string[];
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  starsRequired: number;
  category: 'animals' | 'space' | 'magic' | 'champions';
}

export interface DayLesson {
  dayNumber: number;
  title: string;
  pairId: string;
  theme: string;
  badgeEmoji: string;
  durationMinutes: number;
  targetSkill: string;
  colorScheme: string;
}

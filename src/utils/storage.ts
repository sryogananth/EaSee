import { UserProfile, UserSettings } from '../types';

const STORAGE_KEY = 'easee_child_profile_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  useDyslexicFont: false, // Default to Lexend, can toggle OpenDyslexic
  enableVoice: true,
  enableSoundEffects: true,
  readingRuler: false,
  rulerColor: '#fef08a', // Soft yellow tint
  paperTint: 'ivory',
  highContrast: false,
  largeText: false,
};

export function generateSyncCode(): string {
  const words = ['STAR', 'LION', 'DINO', 'BEAR', 'MOON', 'BIRD', 'HERO', 'WAVE'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${word}-${num}`;
}

export function createDefaultProfile(): UserProfile {
  return {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: '',
    age: 6,
    gender: 'boy',
    avatar: 'fox',
    syncCode: generateSyncCode(),
    createdAt: new Date().toISOString(),
    lastActiveDate: new Date().toISOString().split('T')[0],
    stars: 5, // Give starting stars for encouragement!
    currentStreak: 1,
    bestStreak: 1,
    unlockedStickers: ['star-1'],
    completedDays: [],
    pairStats: {
      'b-d': { correct: 0, total: 0, lastPracticed: '' },
      'p-q': { correct: 0, total: 0, lastPracticed: '' },
      '5-s': { correct: 0, total: 0, lastPracticed: '' },
      '2-z': { correct: 0, total: 0, lastPracticed: '' },
      'm-w': { correct: 0, total: 0, lastPracticed: '' },
      'u-n': { correct: 0, total: 0, lastPracticed: '' },
      '6-9': { correct: 0, total: 0, lastPracticed: '' },
      'e-3': { correct: 0, total: 0, lastPracticed: '' },
    },
    dailyMinutesPracticed: 0,
    settings: DEFAULT_SETTINGS,
  };
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    const data = JSON.parse(raw);
    
    // Check daily streak maintenance
    const today = new Date().toISOString().split('T')[0];
    if (data.lastActiveDate !== today) {
      const last = new Date(data.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        data.currentStreak += 1;
        if (data.currentStreak > data.bestStreak) {
          data.bestStreak = data.currentStreak;
        }
      } else if (diffDays > 1) {
        data.currentStreak = 1;
      }
      data.lastActiveDate = today;
      data.dailyMinutesPracticed = 0; // reset daily timer count for new day
      saveProfile(data);
    }
    
    // Merge settings if missing any new keys
    return {
      ...createDefaultProfile(),
      ...data,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(data.settings || {})
      }
    };
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

// Generate an exportable encrypted or encoded sync payload string
export function exportSyncPayload(profile: UserProfile): string {
  const jsonStr = JSON.stringify(profile);
  return btoa(encodeURIComponent(jsonStr));
}

// Restore profile from an encoded string
export function importSyncPayload(payload: string): UserProfile | null {
  try {
    const jsonStr = decodeURIComponent(atob(payload.trim()));
    const profile = JSON.parse(jsonStr) as UserProfile;
    if (profile && profile.id && profile.name !== undefined) {
      saveProfile(profile);
      return profile;
    }
    return null;
  } catch {
    return null;
  }
}

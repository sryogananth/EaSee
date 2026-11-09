import React, { useState, useEffect } from 'react';
import { UserProfile, UserSettings } from './types';
import { loadProfile, saveProfile } from './utils/storage';
import { TINT_STYLES } from './utils/theme';
import { Header } from './components/Header';
import { ReadingRuler } from './components/ReadingRuler';
import { OnboardingModal } from './components/OnboardingModal';
import { SyncModal } from './components/SyncModal';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { ParentReportModal } from './components/ParentReportModal';
import { DailyQuestView } from './components/DailyQuestView';
import { EndlessArcadeView } from './components/EndlessArcadeView';
import { AdventureMapView } from './components/AdventureMapView';
import { AchievementCertificate } from './components/AchievementCertificate';
import { STICKERS } from './data/stickers';
import { sound } from './utils/sound';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [activeView, setActiveView] = useState<'daily' | 'arcade' | 'adventure'>('daily');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showStickerAlbum, setShowStickerAlbum] = useState(false);
  const [showParentReport, setShowParentReport] = useState(false);

  // Check if first-time user
  useEffect(() => {
    if (!profile.name) {
      setShowOnboarding(true);
    }
  }, [profile.name]);

  // Sync sound settings with audio engine
  useEffect(() => {
    sound.setSoundEnabled(profile.settings.enableSoundEffects);
    sound.setVoiceEnabled(profile.settings.enableVoice);
  }, [profile.settings.enableSoundEffects, profile.settings.enableVoice]);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setProfile((prev) => {
      const updated = { ...prev, settings: newSettings };
      saveProfile(updated);
      return updated;
    });
  };

  // Profile save helper
  const updateAndSaveProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile((prev) => {
      const updated = updater(prev);
      saveProfile(updated);
      return updated;
    });
  };

  // Handler for completing a daily session
  const handleRecordDailySession = (
    earnedStars: number,
    dayNumber: number,
    pairId: string,
    stats: { correct: number; total: number }
  ) => {
    updateAndSaveProfile((prev) => {
      const newStars = prev.stars + earnedStars;
      const completedSet = new Set(prev.completedDays);
      completedSet.add(dayNumber);

      // Check sticker unlocks
      const currentStickers = new Set(prev.unlockedStickers);
      STICKERS.forEach((st) => {
        if (newStars >= st.starsRequired) {
          currentStickers.add(st.id);
        }
      });

      const currentPairStats = prev.pairStats[pairId] || { correct: 0, total: 0, lastPracticed: '' };
      const updatedPairStats = {
        ...prev.pairStats,
        [pairId]: {
          correct: currentPairStats.correct + stats.correct,
          total: currentPairStats.total + stats.total,
          lastPracticed: new Date().toISOString(),
        },
      };

      return {
        ...prev,
        stars: newStars,
        completedDays: Array.from(completedSet).sort((a, b) => a - b),
        unlockedStickers: Array.from(currentStickers),
        pairStats: updatedPairStats,
        dailyMinutesPracticed: prev.dailyMinutesPracticed + 7,
      };
    });
  };

  // Handler for endless arcade games
  const handleRecordArcadeStats = (
    pairId: string,
    stats: { correct: number; total: number },
    earnedStars: number
  ) => {
    updateAndSaveProfile((prev) => {
      const newStars = prev.stars + earnedStars;
      const currentStickers = new Set(prev.unlockedStickers);
      STICKERS.forEach((st) => {
        if (newStars >= st.starsRequired) {
          currentStickers.add(st.id);
        }
      });

      const currentPairStats = prev.pairStats[pairId] || { correct: 0, total: 0, lastPracticed: '' };
      const updatedPairStats = {
        ...prev.pairStats,
        [pairId]: {
          correct: currentPairStats.correct + stats.correct,
          total: currentPairStats.total + stats.total,
          lastPracticed: new Date().toISOString(),
        },
      };

      return {
        ...prev,
        stars: newStars,
        unlockedStickers: Array.from(currentStickers),
        pairStats: updatedPairStats,
      };
    });
  };

  const currentTint = TINT_STYLES[profile.settings.paperTint] || TINT_STYLES.ivory;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative overflow-x-hidden max-w-full ${currentTint.bg} ${
        profile.settings.useDyslexicFont ? 'font-dyslexic-override' : 'font-lexend'
      }`}
      style={{ backgroundColor: currentTint.hex }}
    >
      {/* Dynamic Ambient Glass Glow Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Dyslexic Reading Ruler Highlight strip */}
      <ReadingRuler
        enabled={profile.settings.readingRuler}
        color={profile.settings.rulerColor}
      />

      {/* Main Header / Navigation */}
      <Header
        profile={profile}
        onUpdateSettings={handleUpdateSettings}
        onOpenProfile={() => setShowOnboarding(true)}
        onOpenSync={() => setShowSyncModal(true)}
        onOpenParentReport={() => setShowParentReport(true)}
        onOpenStickerAlbum={() => setShowStickerAlbum(true)}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Container Views - with bottom padding for mobile dock */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-28 md:pb-12">
        {activeView === 'daily' && (
          <DailyQuestView
            profile={profile}
            onRecordSession={handleRecordDailySession}
            onOpenStickerAlbum={() => setShowStickerAlbum(true)}
          />
        )}

        {activeView === 'arcade' && (
          <EndlessArcadeView
            profile={profile}
            onUpdateStats={handleRecordArcadeStats}
          />
        )}

        {activeView === 'adventure' && (
          <AdventureMapView
            profile={profile}
            onSelectDay={(dayNum) => {
              setActiveView('daily');
            }}
          />
        )}
      </main>

      {/* Onboarding / Profile setup modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        initialProfile={profile}
        onComplete={(data) => {
          updateAndSaveProfile((prev) => ({
            ...prev,
            ...data,
          }));
          setShowOnboarding(false);
        }}
      />

      {/* Multi-Device Cloud Sync & Email pickup modal */}
      <SyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        profile={profile}
        onProfileUpdated={(newProf) => setProfile(newProf)}
      />

      {/* Sticker Album modal */}
      <StickerAlbumModal
        isOpen={showStickerAlbum}
        onClose={() => setShowStickerAlbum(false)}
        profile={profile}
      />

      {/* Parent & Educator Diagnostic Report modal */}
      <ParentReportModal
        isOpen={showParentReport}
        onClose={() => setShowParentReport(false)}
        profile={profile}
      />

      {/* Printable Graduation Certificate (active in print preview) */}
      <AchievementCertificate profile={profile} />
    </div>
  );
};

export default App;

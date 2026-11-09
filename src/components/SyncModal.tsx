import React, { useState } from 'react';
import { UserProfile } from '../types';
import { exportSyncPayload, importSyncPayload, saveProfile } from '../utils/storage';
import { sound } from '../utils/sound';
import { fireStarBurst } from '../utils/confetti';
import { Cloud, Smartphone, Laptop, Tablet, Copy, Check, Mail, Download, Upload, X, ShieldAlert } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdated: (newProfile: UserProfile) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [emailInput, setEmailInput] = useState(profile.email || '');
  const [emailSent, setEmailSent] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sync' | 'import'>('sync');

  if (!isOpen) return null;

  const syncPayload = exportSyncPayload(profile);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.syncCode || 'STAR-77');
    setCopied(true);
    sound.playPop(580);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    sound.playCorrect();
    setEmailSent(true);
    const updated = { ...profile, email: emailInput.trim() };
    saveProfile(updated);
    onProfileUpdated(updated);
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EaSee_${profile.name || 'Child'}_Progress.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sound.playPop(620);
  };

  const handleImportSubmit = () => {
    if (!importCode.trim()) return;

    const imported = importSyncPayload(importCode);
    if (imported) {
      sound.playFanfare();
      fireStarBurst();
      setImportStatus('success');
      onProfileUpdated(imported);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      sound.playGentleRetry();
      setImportStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-sky-300 p-6 md:p-8 overflow-hidden my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Cloud className="w-4 h-4 text-sky-600" />
            <span>Cross-Device Cloud Sync</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Play Anywhere, Anytime! 🚀
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Pick up your lessons on a school laptop, home tablet, or parent phone without losing your stars!
          </p>

          <div className="flex items-center justify-center gap-6 mt-4 text-slate-500">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Laptop className="w-4 h-4 text-indigo-500" /> Laptop
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Tablet className="w-4 h-4 text-emerald-500" /> Tablet / iPad
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Smartphone className="w-4 h-4 text-amber-500" /> Mobile
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'sync'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Save & Sync This Device
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'import'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pick Up From Another Device
          </button>
        </div>

        {activeTab === 'sync' ? (
          <div className="space-y-5">
            {/* Sync Code Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                Your Child Sync Code
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black font-mono tracking-widest text-amber-950">
                  {profile.syncCode || 'STAR-77'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-amber-800 mt-2 font-medium">
                Keep this 6-character code handy! Type it on any device to restore your stars and stickers.
              </p>
            </div>

            {/* Email Magic Link form */}
            <form onSubmit={handleSendEmail} className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>Send Magic Backup Link to Email</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailSent(false);
                  }}
                  placeholder="parent@example.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sky-200 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                >
                  Save Email
                </button>
              </div>
              {emailSent && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Success! Your sync profile is linked to {emailInput}. A restore link has been prepared!</span>
                </div>
              )}
            </form>

            {/* Direct JSON backup button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Offline Backup File (.json)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Import tab */
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <p className="text-xs text-slate-600 font-medium mb-3">
                Paste your Child Sync Code, backup string, or file content below to load all your saved stars, completed islands, and stickers!
              </p>
              <textarea
                value={importCode}
                onChange={(e) => {
                  setImportCode(e.target.value);
                  setImportStatus('idle');
                }}
                rows={3}
                placeholder="Paste your sync string or backup code here..."
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
              {importStatus === 'error' && (
                <p className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Invalid sync code or backup format. Please check and try again!
                </p>
              )}
              {importStatus === 'success' && (
                <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4 shrink-0" />
                  Progress successfully restored! Loading player card...
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleImportSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 bouncy-btn"
            >
              <Upload className="w-4 h-4" />
              <span>Restore Progress on This Device</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

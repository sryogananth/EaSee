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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-[94vw] sm:w-full max-w-lg glass-card bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/95 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[92dvh] my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 bg-sky-100/90 text-sky-800 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-sky-200">
            <Cloud className="w-3.5 h-3.5 text-sky-600" />
            <span>Cross-Device Cloud Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Play Anywhere, Anytime! 🚀
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Pick up your lessons on school laptop, family iPad, or phone without losing your stars!
          </p>

          <div className="flex items-center justify-center gap-4 mt-3 text-slate-500">
            <span className="flex items-center gap-1 text-[11px] font-bold"><Laptop className="w-3.5 h-3.5 text-indigo-500" /> Laptop</span>
            <span className="flex items-center gap-1 text-[11px] font-bold"><Tablet className="w-3.5 h-3.5 text-emerald-500" /> Tablet</span>
            <span className="flex items-center gap-1 text-[11px] font-bold"><Smartphone className="w-3.5 h-3.5 text-amber-500" /> Phone</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex glass-pill p-1 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'sync'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Save & Sync Device
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'import'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Load From Another Device
          </button>
        </div>

        {activeTab === 'sync' ? (
          <div className="space-y-4">
            <div className="glass-card-amber p-4 rounded-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">
                Your Child Sync Code
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-amber-950">
                  {profile.syncCode || 'STAR-77'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-amber-900 mt-1.5 font-medium">
                Type this 6-character code on any device to restore stars and stickers!
              </p>
            </div>

            <form onSubmit={handleSendEmail} className="glass-card-sky p-3.5 rounded-2xl space-y-2">
              <label className="block text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
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
                  className="flex-1 px-3 py-2 rounded-xl border border-sky-200 text-xs font-medium outline-none glass-pill"
                />
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs"
                >
                  Save
                </button>
              </div>
              {emailSent && (
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Success! Saved to {emailInput}.</span>
                </div>
              )}
            </form>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl glass-pill hover:bg-white text-slate-600 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Backup File (.json)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="glass-card p-3.5 rounded-2xl">
              <p className="text-xs text-slate-600 font-medium mb-2">
                Paste your Child Sync Code, backup string, or file content below:
              </p>
              <textarea
                value={importCode}
                onChange={(e) => {
                  setImportCode(e.target.value);
                  setImportStatus('idle');
                }}
                rows={3}
                placeholder="Paste backup code here..."
                className="w-full p-2.5 font-mono text-xs rounded-xl border border-slate-200 outline-none glass-pill"
              />
              {importStatus === 'error' && (
                <p className="text-[11px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Invalid code. Please check and try again!
                </p>
              )}
              {importStatus === 'success' && (
                <p className="text-[11px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  Progress successfully restored!
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleImportSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs bouncy-glass-btn"
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

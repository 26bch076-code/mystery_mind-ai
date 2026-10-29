import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Sparkles, 
  Flame, 
  Play, 
  CheckCircle2,
  X
} from 'lucide-react';
import { MysteryCase, Difficulty } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface CaseBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: MysteryCase | null;
  onStartInvestigation: (difficulty: Difficulty, generateAI?: boolean, customTheme?: string) => void;
  isLoading: boolean;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onStartInvestigation,
  isLoading,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    currentCase?.difficulty || 'easy'
  );
  const [useAI, setUseAI] = useState(false);
  const [customTheme, setCustomTheme] = useState('');

  if (!isOpen) return null;

  const handleStart = () => {
    soundEffects.playClick();
    onStartInvestigation(selectedDifficulty, useAI, customTheme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-gradient-to-b from-[#101432] via-[#0b0e26] to-[#070918] border border-purple-500/40 shadow-2xl shadow-purple-950/60 text-white overflow-hidden">
        
        {/* Top atmospheric banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-slate-950/90 border-b border-purple-800/40">
          {currentCase && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition"
              title="Close briefing"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-purple-400 uppercase font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            CONFIDENTIAL POLICE FILE • LEVEL 4 AUTHORIZATION
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {currentCase ? currentCase.title : 'Incident Dossier & Case Commission'}
          </h2>

          <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
            {currentCase ? currentCase.synopsis : 'Select a difficulty level to initiate your forensic investigation. Question suspects, unearth physical clues, and deduce the true perpetrator.'}
          </p>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-3">
              Select Investigation Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Easy */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedDifficulty('easy');
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedDifficulty === 'easy'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-[#0d112b] border-purple-900/40 text-purple-200/70 hover:border-purple-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-base text-emerald-400">Easy</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 font-mono">3 Suspects</span>
                  </div>
                  <p className="text-xs text-purple-300/80 leading-snug">
                    Clear contradictions, direct physical evidence, generous forensic hints. Ideal for gumshoes.
                  </p>
                </div>
                {selectedDifficulty === 'easy' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-3 self-end" />
                )}
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedDifficulty('medium');
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedDifficulty === 'medium'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950/40'
                    : 'bg-[#0d112b] border-purple-900/40 text-purple-200/70 hover:border-purple-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-base text-amber-400">Medium</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-900/50 text-amber-300 font-mono">4 Suspects</span>
                  </div>
                  <p className="text-xs text-purple-300/80 leading-snug">
                    Layered motives, concealed secrets, deceptive tech alibis, and subtle timeline gaps.
                  </p>
                </div>
                {selectedDifficulty === 'medium' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 mt-3 self-end" />
                )}
              </button>

              {/* Hard */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedDifficulty('hard');
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedDifficulty === 'hard'
                    ? 'bg-purple-950/80 border-purple-400 text-white shadow-lg shadow-purple-950/60'
                    : 'bg-[#0d112b] border-purple-900/40 text-purple-200/70 hover:border-purple-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-base text-purple-300">Hard</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-mono">Expert</span>
                  </div>
                  <p className="text-xs text-purple-300/80 leading-snug">
                    Locked-room paradox, cryptographic mechanical traps, conflicting alibis, and red herrings.
                  </p>
                </div>
                {selectedDifficulty === 'hard' && (
                  <CheckCircle2 className="w-4 h-4 text-purple-300 mt-3 self-end" />
                )}
              </button>

            </div>
          </div>

          {/* AI Generation Option */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-200">Generate Unique Case with Gemini AI</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useAI} 
                  onChange={(e) => setUseAI(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {useAI && (
              <div className="pt-2">
                <label className="block text-xs text-purple-300 mb-1.5">
                  Optional Mystery Theme or Setting (e.g. "Orient Express 1930s", "Deep Sea Submarine", "Cyberpunk Tokyo"):
                </label>
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="e.g. Venetian Masquerade Ball or Moon Base Research Lab"
                  className="w-full px-3.5 py-2 text-sm bg-black/40 border border-purple-700/50 rounded-lg text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400"
                />
              </div>
            )}
          </div>

          {/* Victim & Incident Snapshot if currentCase is present */}
          {currentCase && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#0e1230] border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                <FileText className="w-4 h-4" />
                Victim Profile & Forensic Autopsy
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-xs text-purple-400/80 font-mono">VICTIM IDENTITY</div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    {currentCase.victim.name}, {currentCase.victim.age}
                  </div>
                  <div className="text-xs text-purple-300/80">{currentCase.victim.title}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-purple-400/80 font-mono">CRIME SCENE & TIME</div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Approx {currentCase.victim.timeOfDeath}
                  </div>
                  <div className="text-xs text-purple-300/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">{currentCase.victim.crimeScene}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-900/40">
                <div className="text-xs text-rose-400 font-mono font-bold mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  CORONER'S PRELIMINARY CAUSE OF DEATH
                </div>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-mono bg-black/30 p-2.5 rounded-lg border border-purple-900/30">
                  {currentCase.victim.causeOfDeath}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer: Prominent "Start Investigation" Button */}
        <div className="p-6 bg-[#080b20] border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-purple-300/70 font-mono">
            {isLoading ? 'Decrypting case dossier and initializing suspects...' : 'Ready to begin criminal investigation.'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentCase && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-purple-800/60 text-purple-300 hover:bg-purple-900/40 font-semibold text-sm transition"
              >
                Dismiss
              </button>
            )}

            {/* REQUIRED BUTTON: "Start Investigation" */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-purple-900/50 hover:shadow-purple-700/70 flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Loading Case...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Investigation</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

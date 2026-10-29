import React, { useState } from 'react';
import { 
  Eye, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  X, 
  Sparkles, 
  BookOpen, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { CaseSolution } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface RevealSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  solution: CaseSolution | null;
  onConfirmReveal: () => Promise<void>;
  isLoading: boolean;
  onNewCase: () => void;
}

export const RevealSolutionModal: React.FC<RevealSolutionModalProps> = ({
  isOpen,
  onClose,
  caseId,
  solution,
  onConfirmReveal,
  isLoading,
  onNewCase,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleReveal = async () => {
    soundEffects.playClick();
    setConfirmed(true);
    await onConfirmReveal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-gradient-to-b from-[#13163a] via-[#0d1029] to-[#070918] border border-purple-500/50 shadow-2xl text-white overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-b border-purple-800/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900 border border-purple-400/40 flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-purple-400 font-bold tracking-widest">
                CLASSIFIED DOSSIER DECLASSIFICATION
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                The Complete Mystery Solution
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!solution && !confirmed ? (
          /* Confirmation Step to prevent accidental spoilers */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-600/50 mx-auto flex items-center justify-center text-purple-400 shadow-xl">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">
                Declassify the Case Files?
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                Revealing the solution will immediately unmask the true culprit, their method, motive, and chronological timeline. This cannot be undone for the current inquiry.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-purple-800 text-purple-300 hover:bg-purple-900/40 text-xs font-semibold"
              >
                Keep Investigating
              </button>

              <button
                type="button"
                onClick={handleReveal}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-950 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Unsealing Files...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Reveal Full Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : solution ? (
          /* Solution Revealed */
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Culprit Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-purple-500/60 shadow-xl space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                THE TRUE PERPETRATOR
              </div>
              <div className="text-2xl font-black text-white">
                {solution.culpritName}
              </div>
              <div className="text-xs text-purple-200/90 font-mono">
                <span className="text-purple-400 font-bold">Execution Method: </span>
                {solution.weaponOrMethod}
              </div>
              <div className="text-xs text-purple-200/90 font-mono">
                <span className="text-purple-400 font-bold">Real Motive: </span>
                {solution.actualMotive}
              </div>
            </div>

            {/* Smoking gun clue */}
            <div className="p-4 rounded-xl bg-[#090d26] border border-purple-900/40 space-y-1">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold">
                ★ The Key Incriminating Clue (Smoking Gun)
              </div>
              <p className="text-xs sm:text-sm text-purple-100 font-sans">
                {solution.keyIncriminatingClue}
              </p>
            </div>

            {/* Confession */}
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/50 space-y-1">
              <div className="text-xs font-mono uppercase text-purple-300 font-bold">
                Culprit Confession Under Caution:
              </div>
              <p className="text-xs sm:text-sm text-purple-200 italic leading-relaxed">
                "{solution.confession}"
              </p>
            </div>

            {/* Complete Breakdown & Red Herrings */}
            <div className="p-4 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
              <div className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Deductive Synthesis & Red Herrings
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-sans">
                {solution.breakdown}
              </p>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Unabridged Chronological Timeline
              </div>
              <div className="space-y-2">
                {solution.timeline.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs bg-[#090c24] p-2.5 rounded-lg border border-purple-900/30">
                    <span className="font-mono font-bold text-purple-300 shrink-0">{entry.time}:</span>
                    <span className="text-purple-100/90">{entry.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-purple-800 text-purple-300 hover:bg-purple-900/40 text-xs font-semibold"
              >
                Close Solution
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewCase();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start New Case</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-purple-300 font-mono">Retrieving declassified solution...</p>
          </div>
        )}

      </div>
    </div>
  );
};

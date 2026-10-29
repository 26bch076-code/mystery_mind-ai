import React from 'react';
import { HelpCircle, Sparkles, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestHint: () => Promise<void>;
  hints: Array<{ number: number; text: string; focusArea: string }>;
  hintsRemaining: number;
  maxHints: number;
  isLoading: boolean;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  onRequestHint,
  hints,
  hintsRemaining,
  maxHints,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-gradient-to-b from-[#101438] via-[#0c0f2b] to-[#070918] border border-indigo-500/50 shadow-2xl text-white space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Chief Inspector Investigative Briefing
              </h3>
              <p className="text-xs text-indigo-300/70 font-mono">
                {hintsRemaining} of {maxHints} Crime Lab Hints Available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Hints List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {hints.length === 0 ? (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-center text-xs text-indigo-300/70">
              No hints requested yet. If you are uncertain about conflicting alibis, physical evidence, or timing, consult the crime lab.
            </div>
          ) : (
            hints.map((hint, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-xl bg-[#090d26] border border-indigo-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 font-bold">
                  <span>HINT #{hint.number}: {hint.focusArea}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-xs text-purple-100 leading-relaxed font-sans">
                  "{hint.text}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Action button */}
        <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-purple-800/60 text-purple-300 hover:bg-purple-900/30 text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={async () => {
              soundEffects.playHint();
              await onRequestHint();
            }}
            disabled={hintsRemaining <= 0 || isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/50 flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Decrypting Hint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request Next Hint ({hintsRemaining} left)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

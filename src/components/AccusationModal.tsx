import React, { useState } from 'react';
import { 
  Gavel, 
  ShieldAlert, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  XCircle, 
  X, 
  Sparkles, 
  RotateCcw,
  Clock,
  BookOpen
} from 'lucide-react';
import { Suspect, Clue, AccusationResult, AccusationPayload } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  suspects: Suspect[];
  clues: Clue[];
  onSubmitAccusation: (payload: AccusationPayload) => Promise<AccusationResult | null>;
  accusationResult: AccusationResult | null;
  onResetAccusation: () => void;
  onNewCase: () => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  caseId,
  suspects,
  clues,
  onSubmitAccusation,
  accusationResult,
  onResetAccusation,
  onNewCase,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(suspects[0]?.id || '');
  const [weapon, setWeapon] = useState('');
  const [motive, setMotive] = useState('');
  const [selectedClueId, setSelectedClueId] = useState<string>(
    clues.find(c => c.discovered)?.id || clues[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspectId || isSubmitting) return;

    setIsSubmitting(true);
    soundEffects.playGavel();

    await onSubmitAccusation({
      caseId,
      accusedSuspectId: selectedSuspectId,
      murderWeapon: weapon,
      motive,
      keyClueId: selectedClueId,
    });

    setIsSubmitting(false);
  };

  const discoveredClues = clues.filter(c => c.discovered);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-gradient-to-b from-[#13173d] via-[#0d102b] to-[#070918] border border-purple-500/50 shadow-2xl text-white overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-b border-purple-800/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900 border border-purple-400/40 flex items-center justify-center shadow-lg">
              <Gavel className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-purple-400 font-bold tracking-widest">
                OFFICIAL JUDICIAL INDICTMENT
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {accusationResult ? 'Court Verdict & Resolution' : 'File Formal Accusation'}
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

        {/* If accusation is already submitted: Show Verdict */}
        {accusationResult ? (
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Banner outcome */}
            <div
              className={`p-5 rounded-2xl border flex items-center gap-4 ${
                accusationResult.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-xl shadow-emerald-950/50'
                  : 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-xl shadow-rose-950/50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center shrink-0">
                {accusationResult.isCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider font-bold">
                  {accusationResult.isCorrect ? 'CASE OFFICIALLY SOLVED' : 'VERDICT: INNOCENT PERSON ACCUSED'}
                </div>
                <div className="text-lg font-bold">
                  {accusationResult.isCorrect
                    ? `Perpetrator Caught: ${accusationResult.solution.culpritName}`
                    : `Wrong Culprit Indicted. The true murderer escaped!`}
                </div>
              </div>
            </div>

            {/* Detective Rank & Score */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#090d26] border border-purple-900/40 text-center">
                <div className="text-[11px] font-mono text-purple-400 uppercase">Deduction Score</div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {accusationResult.score} / 100
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#090d26] border border-purple-900/40 text-center">
                <div className="text-[11px] font-mono text-purple-400 uppercase">Detective Standing</div>
                <div className="text-sm font-bold text-purple-200 mt-2 truncate">
                  {accusationResult.rank}
                </div>
              </div>
            </div>

            {/* Dramatic Climax Narrative */}
            <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
              <div className="text-xs font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Prosecution Transcript & Breakdown
              </div>
              <p className="text-sm text-purple-100/90 whitespace-pre-line leading-relaxed font-serif">
                {accusationResult.verdictNarrative}
              </p>
            </div>

            {/* Culprit Confession */}
            <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-700/60 space-y-1.5">
              <div className="text-xs font-mono text-purple-300 font-bold uppercase">
                Confession of {accusationResult.solution.culpritName}:
              </div>
              <p className="text-xs sm:text-sm text-purple-200 italic leading-relaxed">
                "{accusationResult.solution.confession}"
              </p>
            </div>

            {/* Timeline breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Forensic Reconstruction Timeline
              </div>
              <div className="space-y-2">
                {accusationResult.solution.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs bg-[#090c24] p-2.5 rounded-lg border border-purple-900/30">
                    <span className="font-mono font-bold text-purple-300 shrink-0">{item.time}:</span>
                    <span className="text-purple-100/90">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onResetAccusation();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-purple-800 text-purple-300 hover:bg-purple-900/40 text-xs font-semibold"
              >
                Return to Inquiry Board
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNewCase();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Play Next Case</span>
              </button>
            </div>

          </div>
        ) : (
          /* Accusation Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Step 1: Accuse Suspect */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-2">
                1. Identify the Culprit (Prime Accused)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suspects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedSuspectId(s.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      selectedSuspectId === s.id
                        ? 'bg-purple-900/80 border-purple-400 text-white shadow-md'
                        : 'bg-[#090c24] border-purple-950 text-purple-300/70 hover:border-purple-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{s.name}</div>
                      <div className="text-xs text-purple-300/70">{s.role}</div>
                    </div>
                    {selectedSuspectId === s.id && (
                      <CheckCircle2 className="w-4 h-4 text-purple-300 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Murder Weapon / Method */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                2. Murder Weapon / Method of Execution
              </label>
              <input
                type="text"
                required
                value={weapon}
                onChange={(e) => setWeapon(e.target.value)}
                placeholder="e.g. Digitalis foxglove on glass rim / EMP probe in neural socket / Clockwork needle"
                className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-purple-800/60 rounded-xl text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Step 3: True Motive */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                3. Culprit's Actual Motive
              </label>
              <input
                type="text"
                required
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="e.g. Lord Blackwood discovered the wine counterfeiting / Arms smuggling exposure"
                className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-purple-800/60 rounded-xl text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Step 4: Primary Incriminating Clue */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                4. Primary Incriminating Clue (Smoking Gun)
              </label>
              <select
                value={selectedClueId}
                onChange={(e) => setSelectedClueId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#090c24] border border-purple-800/60 rounded-xl text-white focus:outline-none focus:border-purple-400"
              >
                {discoveredClues.map((clue) => (
                  <option key={clue.id} value={clue.id}>
                    {clue.title} ({clue.category})
                  </option>
                ))}
                {clues.filter(c => !c.discovered).map((clue) => (
                  <option key={clue.id} value={clue.id}>
                    {clue.title} (Undiscovered Clue)
                  </option>
                ))}
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-purple-800 text-purple-300 hover:bg-purple-900/30 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !weapon || !motive}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-950 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Confronting Suspect...</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    <span>Deliver Indictment</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

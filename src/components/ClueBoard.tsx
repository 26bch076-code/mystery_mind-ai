import React, { useState } from 'react';
import { 
  FolderSearch, 
  MapPin, 
  FileCheck, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Sparkles, 
  Tag, 
  AlertTriangle,
  FileText,
  Search
} from 'lucide-react';
import { Clue, CrimeScenePoint, ClueCategory } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface ClueBoardProps {
  clues: Clue[];
  crimeScenePoints: CrimeScenePoint[];
  onSearchPoint: (pointId: string) => Promise<void>;
  isSearching: boolean;
}

export const ClueBoard: React.FC<ClueBoardProps> = ({
  clues,
  crimeScenePoints,
  onSearchPoint,
  isSearching,
}) => {
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const discoveredCount = clues.filter(c => c.discovered).length;
  const searchedPointsCount = crimeScenePoints.filter(p => p.searched).length;

  const categories: ClueCategory[] = ['Physical', 'Document', 'Alibi', 'Forensic', 'Digital'];

  const filteredClues = clues.filter(clue => {
    if (filterCategory === 'all') return true;
    return clue.category === filterCategory;
  });

  const handleSearch = async (pointId: string) => {
    if (isSearching) return;
    soundEffects.playClick();
    await onSearchPoint(pointId);
    soundEffects.playClueDiscovered();
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0a0d24] border border-purple-900/40 shadow-xl overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 bg-[#0d122e] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FolderSearch className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              Crime Scene & Evidence Locker
            </h3>
          </div>
          <p className="text-xs text-purple-300/70 mt-0.5">
            Examine forensic locations to recover physical evidence and documentation.
          </p>
        </div>

        {/* Discovery stats */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-purple-400">EVIDENCE RECOVERED: </span>
            <span className="text-sm font-mono font-bold text-white">
              {discoveredCount} / {clues.length}
            </span>
          </div>
          <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-800/40">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${(discoveredCount / Math.max(1, clues.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-6">
        
        {/* Crime Scene Search Points */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-purple-300 font-bold">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              Crime Scene Inspection Points ({searchedPointsCount} / {crimeScenePoints.length} Searched)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {crimeScenePoints.map((point) => (
              <div
                key={point.id}
                className={`p-3.5 rounded-xl border transition ${
                  point.searched
                    ? 'bg-[#0d1333] border-purple-800/60 text-purple-200'
                    : 'bg-[#080b1d] border-purple-950/70 hover:border-purple-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    {point.searched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Search className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <span>{point.name}</span>
                  </div>
                  {point.searched ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      SECURED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800">
                      UNSEARCHED
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-300/80 mb-3 leading-relaxed">
                  {point.description}
                </p>

                {point.searched ? (
                  <div className="text-xs font-mono bg-black/40 p-2.5 rounded-lg border border-purple-900/40 text-purple-300">
                    <span className="text-purple-400 font-bold">Forensic Note: </span>
                    {point.investigationNote || 'Site fully fingerprinted and logged into evidence locker.'}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSearch(point.id)}
                    disabled={isSearching}
                    className="w-full py-1.5 px-3 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/40 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Inspect & Recover Evidence</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Locker List */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-purple-300 font-bold">
              <FileCheck className="w-3.5 h-3.5 text-purple-400" />
              Evidence Locker ({discoveredCount} Unlocked)
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterCategory('all')}
                className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition ${
                  filterCategory === 'all'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-[#0e1230] text-purple-300/70 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-[11px] px-2 py-1 rounded-md font-mono transition ${
                    filterCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-[#0e1230] text-purple-300/70 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredClues.map((clue) => {
              const isDiscovered = clue.discovered;
              return (
                <div
                  key={clue.id}
                  onClick={() => {
                    if (isDiscovered) {
                      soundEffects.playClick();
                      setSelectedClue(clue);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                    isDiscovered
                      ? 'bg-[#0d122e] border-purple-700/50 hover:border-purple-500 cursor-pointer shadow-md shadow-purple-950/40'
                      : 'bg-[#070918] border-purple-950/40 text-purple-400/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-800/60">
                        {clue.category}
                      </span>
                      {isDiscovered && clue.isKeyEvidence && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800/60 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                          KEY EVIDENCE
                        </span>
                      )}
                      {!isDiscovered && (
                        <Lock className="w-3.5 h-3.5 text-purple-400/50" />
                      )}
                    </div>

                    <div className="font-bold text-sm text-white mb-1">
                      {isDiscovered ? clue.title : 'Confidential Evidence [Locked]'}
                    </div>

                    <p className="text-xs text-purple-300/80 line-clamp-2 leading-relaxed">
                      {isDiscovered ? clue.description : 'Search crime scene or corner suspects during interrogation to unlock this clue.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-purple-400/70 truncate max-w-[150px]">
                      {isDiscovered ? clue.location : 'Location Hidden'}
                    </span>
                    {isDiscovered && (
                      <span className="text-purple-300 hover:text-white flex items-center gap-1">
                        Inspect <Eye className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Clue Inspector Modal */}
      {selectedClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-gradient-to-b from-[#12163b] to-[#0a0d24] border border-purple-500/50 shadow-2xl text-white space-y-4">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                  {selectedClue.category} Evidence
                </span>
                <h3 className="text-xl font-bold mt-2 text-white">
                  {selectedClue.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClue(null)}
                className="text-purple-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-purple-900/40 text-sm leading-relaxed text-purple-200">
              {selectedClue.description}
            </div>

            {selectedClue.details && (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs font-mono text-purple-200 leading-relaxed">
                <div className="text-purple-400 font-bold mb-1">LAB SPECTROMETRY & ANALYSIS:</div>
                {selectedClue.details}
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono text-purple-400/80 pt-2 border-t border-purple-900/40">
              <span>Location: {selectedClue.location}</span>
              {selectedClue.isKeyEvidence && (
                <span className="text-rose-400 font-bold">★ Prime Incriminating Clue</span>
              )}
            </div>

            <button
              onClick={() => setSelectedClue(null)}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition"
            >
              Return to Evidence Locker
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

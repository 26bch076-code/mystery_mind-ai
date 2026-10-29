import React from 'react';
import { 
  Compass, 
  HelpCircle, 
  Eye, 
  PlusCircle, 
  Gavel, 
  Volume2, 
  VolumeX, 
  ShieldAlert,
  Search
} from 'lucide-react';
import { MysteryCase, Difficulty } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  currentCase: MysteryCase | null;
  onNewCase: () => void;
  onHint: () => void;
  onRevealSolution: () => void;
  onAccuse: () => void;
  onOpenBriefing: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  onNewCase,
  onHint,
  onRevealSolution,
  onAccuse,
  onOpenBriefing,
  muted,
  onToggleMute,
}) => {
  const getDifficultyBadge = (diff?: Difficulty) => {
    switch (diff) {
      case 'easy':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            Easy Case
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/30">
            Medium Case
          </span>
        );
      case 'hard':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
            Hard Case
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'solved':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Case Solved
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Cold Case
          </span>
        );
      case 'revealed':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/50 flex items-center gap-1.5">
            Declassified
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Active Inquiry
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d24]/95 backdrop-blur-md border-b border-purple-900/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-navy-900 flex items-center justify-center border border-purple-400/40 shadow-lg shadow-purple-900/30">
              <Search className="w-5 h-5 text-purple-200 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  Mystery<span className="text-gradient-purple">Mind</span> AI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded uppercase bg-purple-900/60 text-purple-300 border border-purple-600/40">
                  Detective Engine
                </span>
              </div>
              <p className="text-xs text-purple-300/70 truncate max-w-[220px] sm:max-w-xs font-medium">
                {currentCase ? currentCase.title : 'Interactive Criminal Deduction Game'}
              </p>
            </div>
          </div>

          {/* Center Badges (Desktop) */}
          {currentCase && (
            <div className="hidden md:flex items-center gap-2.5">
              {getDifficultyBadge(currentCase.difficulty)}
              {getStatusBadge(currentCase.status)}
              <button
                onClick={onOpenBriefing}
                className="text-xs text-purple-300 hover:text-purple-100 flex items-center gap-1 px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 transition"
                title="View Case Briefing Dossier"
              >
                <Compass className="w-3.5 h-3.5" />
                Case Briefing
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className="p-2 text-purple-300/70 hover:text-purple-200 hover:bg-purple-900/30 rounded-lg transition"
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle sound"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Hint Button */}
            <button
              onClick={() => {
                soundEffects.playHint();
                onHint();
              }}
              className="relative px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/50 hover:border-indigo-500 flex items-center gap-1.5 transition shadow-sm hover:shadow-indigo-900/40"
              title="Request investigative hint from crime lab"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
              <span>Hint</span>
              {currentCase && (
                <span className="w-5 h-5 rounded-full bg-indigo-800/80 text-[11px] font-bold text-white flex items-center justify-center ml-0.5">
                  {currentCase.hintsAvailable - currentCase.hintsUsed}
                </span>
              )}
            </button>

            {/* Reveal Solution Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onRevealSolution();
              }}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/50 hover:border-purple-500 flex items-center gap-1.5 transition shadow-sm"
              title="Declassify full truth and solution"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              <span className="hidden sm:inline">Reveal</span> Solution
            </button>

            {/* Make Accusation Button */}
            <button
              onClick={() => {
                soundEffects.playGavel();
                onAccuse();
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 flex items-center gap-1.5 transition transform active:scale-95"
              title="Formulate official indictment"
            >
              <Gavel className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>Accuse</span>
            </button>

            {/* New Case Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onNewCase();
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 flex items-center gap-1.5 transition"
              title="Start a new mystery case"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="hidden sm:inline">New</span> Case
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  MessageSquare, 
  FileEdit, 
  Activity,
  Flame,
  Wine,
  Briefcase,
  UserCheck,
  Bot,
  Cpu,
  TrendingUp,
  Coins,
  Wrench,
  BookOpen,
  Scroll,
  User
} from 'lucide-react';
import { Suspect } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface SuspectDossierProps {
  suspects: Suspect[];
  onInterrogate: (suspectId: string) => void;
}

export const SuspectDossier: React.FC<SuspectDossierProps> = ({
  suspects,
  onInterrogate,
}) => {
  const [suspectTags, setSuspectTags] = useState<Record<string, 'cleared' | 'suspicious' | 'prime'>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleSetTag = (id: string, tag: 'cleared' | 'suspicious' | 'prime') => {
    soundEffects.playClick();
    setSuspectTags(prev => ({
      ...prev,
      [id]: prev[id] === tag ? undefined! : tag,
    }));
  };

  const getSuspectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wine': return <Wine className="w-6 h-6 text-purple-300" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-amber-300" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-emerald-300" />;
      case 'Bot': return <Bot className="w-6 h-6 text-cyan-300" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-violet-300" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-pink-300" />;
      case 'Coins': return <Coins className="w-6 h-6 text-yellow-300" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-orange-300" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-blue-300" />;
      case 'Scroll': return <Scroll className="w-6 h-6 text-teal-300" />;
      default: return <User className="w-6 h-6 text-purple-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0a0d24] border border-purple-900/40 shadow-xl overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 bg-[#0d122e] border-b border-purple-900/40 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              Suspect Lineup & Intelligence Dossier
            </h3>
          </div>
          <p className="text-xs text-purple-300/70 mt-0.5">
            Cross-examine motives, scrutinize alibis, and record field deductions.
          </p>
        </div>
        <span className="text-xs font-mono text-purple-400">
          {suspects.length} Profiles on Record
        </span>
      </div>

      {/* Grid of suspects */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suspects.map((suspect) => {
            const currentTag = suspectTags[suspect.id];
            const currentNote = notes[suspect.id] || '';

            return (
              <div
                key={suspect.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0d112d] border border-purple-900/50 hover:border-purple-700/60 transition shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-600/40 flex items-center justify-center shrink-0">
                        {getSuspectIcon(suspect.avatarIcon)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{suspect.name}</h4>
                        <div className="text-xs text-purple-300/80 font-mono">
                          {suspect.role} • Age {suspect.age}
                        </div>
                      </div>
                    </div>

                    {/* Stress gauge */}
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-purple-400/80">TENSION</div>
                      <div className="text-xs font-mono font-bold text-purple-200">
                        {suspect.stressLevel}%
                      </div>
                    </div>
                  </div>

                  {/* Personality */}
                  <div className="mt-3 text-xs text-purple-200/90 italic bg-black/30 p-2.5 rounded-lg border border-purple-900/30">
                    "{suspect.personality}"
                  </div>

                  {/* Motive & Alibi */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#080b1e] border border-purple-950">
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold mb-0.5">
                        Suspected Motive
                      </div>
                      <div className="text-purple-200/90 leading-relaxed">
                        {suspect.motive}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#080b1e] border border-purple-950">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold mb-0.5">
                        Official Stated Alibi
                      </div>
                      <div className="text-purple-200/90 leading-relaxed">
                        {suspect.alibi}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Detective Classification & Action */}
                <div className="space-y-3 pt-3 border-t border-purple-900/30">
                  
                  {/* Status Tag buttons */}
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <span className="text-[11px] font-mono text-purple-400/70">Tag:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSetTag(suspect.id, 'cleared')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                          currentTag === 'cleared'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold'
                            : 'bg-black/30 text-emerald-400/70 border border-transparent hover:border-emerald-900'
                        }`}
                      >
                        Cleared
                      </button>
                      <button
                        onClick={() => handleSetTag(suspect.id, 'suspicious')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                          currentTag === 'suspicious'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500 font-bold'
                            : 'bg-black/30 text-amber-400/70 border border-transparent hover:border-amber-900'
                        }`}
                      >
                        Suspicious
                      </button>
                      <button
                        onClick={() => handleSetTag(suspect.id, 'prime')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                          currentTag === 'prime'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500 font-bold'
                            : 'bg-black/30 text-rose-400/70 border border-transparent hover:border-rose-900'
                        }`}
                      >
                        Prime Suspect
                      </button>
                    </div>
                  </div>

                  {/* Detective Notepad for this suspect */}
                  <div className="relative">
                    <input
                      type="text"
                      value={currentNote}
                      onChange={(e) => setNotes(prev => ({ ...prev, [suspect.id]: e.target.value }))}
                      placeholder="Add detective note (e.g. lied about the 9:30 timestamp)..."
                      className="w-full text-xs px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/40 text-purple-200 placeholder-purple-400/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Interrogate this suspect button */}
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onInterrogate(suspect.id);
                    }}
                    className="w-full py-2 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-purple-100 font-semibold text-xs border border-purple-600/40 flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Interrogation Channel</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

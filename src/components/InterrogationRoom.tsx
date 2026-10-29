import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  MessageSquare, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  HelpCircle, 
  Flame, 
  AlertCircle,
  Wine,
  Briefcase,
  UserCheck,
  Bot,
  Cpu,
  TrendingUp,
  Coins,
  Wrench,
  BookOpen,
  Scroll
} from 'lucide-react';
import { Suspect, ChatMessage, Clue, SuspectMood } from '../types/mystery';
import { soundEffects } from '../utils/audio';

interface InterrogationRoomProps {
  suspects: Suspect[];
  activeSuspectId: string;
  onSelectSuspect: (id: string) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  discoveredClues: Clue[];
}

export const InterrogationRoom: React.FC<InterrogationRoomProps> = ({
  suspects,
  activeSuspectId,
  onSelectSuspect,
  messages,
  onSendMessage,
  isLoading,
  discoveredClues,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSuspect = suspects.find(s => s.id === activeSuspectId) || suspects[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    soundEffects.playClick();
    await onSendMessage(text);
  };

  const handleQuickQuestion = async (q: string) => {
    if (isLoading) return;
    soundEffects.playClick();
    await onSendMessage(q);
  };

  const getSuspectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wine': return <Wine className="w-5 h-5 text-purple-300" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-300" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-emerald-300" />;
      case 'Bot': return <Bot className="w-5 h-5 text-cyan-300" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-300" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-pink-300" />;
      case 'Coins': return <Coins className="w-5 h-5 text-yellow-300" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-orange-300" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-300" />;
      case 'Scroll': return <Scroll className="w-5 h-5 text-teal-300" />;
      default: return <User className="w-5 h-5 text-purple-300" />;
    }
  };

  const getMoodBadge = (mood: SuspectMood) => {
    switch (mood) {
      case 'panicked':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-600/50 animate-pulse">PANICKED</span>;
      case 'nervous':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-600/50">NERVOUS</span>;
      case 'defensive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950/80 text-orange-400 border border-orange-600/50">DEFENSIVE</span>;
      case 'smug':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-600/50">SMUG</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-600/50">CALM</span>;
    }
  };

  // Quick prompt questions
  const quickQuestions = [
    `Where were you around the time of the incident?`,
    `What was your exact relationship with the victim?`,
    `Did you notice anything unusual or suspicious earlier?`,
    `Can you verify your alibi with an independent witness?`,
    ...(discoveredClues.length > 0 
      ? [`Can you explain the "${discoveredClues[0].title}" found during our investigation?`] 
      : []),
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0a0d24] border border-purple-900/40 shadow-xl overflow-hidden">
      
      {/* Suspect Selector Ribbon */}
      <div className="p-3 sm:p-4 bg-[#0d122e] border-b border-purple-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            Interrogation Target
          </span>
          <span className="text-[11px] text-purple-400/80 font-mono">
            {suspects.length} Persons of Interest
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {suspects.map((suspect) => {
            const isSelected = suspect.id === activeSuspectId;
            return (
              <button
                key={suspect.id}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectSuspect(suspect.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 relative ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-500 shadow-md shadow-purple-950/50'
                    : 'bg-[#080b1d] border-purple-950/60 hover:border-purple-800/60 text-purple-200/70'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center shrink-0">
                  {getSuspectIcon(suspect.avatarIcon)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{suspect.name}</div>
                  <div className="text-[10px] text-purple-300/70 truncate">{suspect.role}</div>
                  
                  {/* Mini Stress Bar */}
                  <div className="mt-1 w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        suspect.stressLevel > 70 ? 'bg-rose-500' : suspect.stressLevel > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${suspect.stressLevel}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Suspect Profile Header */}
      {activeSuspect && (
        <div className="px-4 py-3 bg-[#0a0e28] border-b border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center">
              {getSuspectIcon(activeSuspect.avatarIcon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{activeSuspect.name}</span>
                <span className="text-xs text-purple-300/80">({activeSuspect.role}, Age {activeSuspect.age})</span>
                {getMoodBadge(activeSuspect.mood)}
              </div>
              <p className="text-xs text-purple-300/60 truncate max-w-md">
                "{activeSuspect.personality}"
              </p>
            </div>
          </div>

          {/* Stress / Tension Meter */}
          <div className="flex items-center gap-2 bg-[#060814] px-3 py-1.5 rounded-lg border border-purple-900/40">
            <Activity className="w-4 h-4 text-purple-400" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-purple-400/80">SUSPECT TENSION</div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <span>{activeSuspect.stressLevel}%</span>
                <span className="text-[10px] font-normal text-purple-300/60">
                  {activeSuspect.stressLevel > 75 ? '(Cracking)' : activeSuspect.stressLevel > 45 ? '(Uneasy)' : '(Composed)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-purple-300/60 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm max-w-sm">
              The interrogation room is prepped. Select a question or enter your own deduction to interrogate <span className="text-purple-200 font-semibold">{activeSuspect?.name}</span>.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isPlayer = msg.sender === 'player';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/50 text-xs font-mono text-purple-300 shadow">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400/80 px-1">
                  <span>{isPlayer ? 'Detective (You)' : msg.suspectName || activeSuspect?.name}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {!isPlayer && msg.mood && (
                    <span className="ml-1">{getMoodBadge(msg.mood)}</span>
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isPlayer
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none shadow-md shadow-purple-950/40'
                      : 'bg-[#12163b] text-purple-100 border border-purple-800/40 rounded-tl-none shadow'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If this interrogation revealed a clue */}
                  {msg.revealedClue && (
                    <div className="mt-3 p-2.5 rounded-xl bg-purple-950/90 border border-purple-500/50 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-300 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-purple-200">
                          Forensic Clue Extracted: {msg.revealedClue.title}
                        </div>
                        <div className="text-[11px] text-purple-300/80 mt-0.5">
                          {msg.revealedClue.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2 text-purple-300/80 text-xs font-mono">
            <div className="w-7 h-7 rounded-lg bg-purple-900/50 flex items-center justify-center animate-pulse">
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="bg-[#12163b] p-3 rounded-2xl rounded-tl-none border border-purple-800/40 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="ml-1 text-xs">Analyzing suspect response & biometric signals...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 bg-[#080b1f] border-t border-purple-900/30 overflow-x-auto">
        <div className="flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-mono text-purple-400/80 uppercase whitespace-nowrap">
            Prompt Ideas:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              disabled={isLoading}
              className="text-xs whitespace-nowrap px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-800/40 hover:border-purple-600 transition disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input & "Send" Button */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-[#0a0e28] border-t border-purple-900/40">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={`Question ${activeSuspect?.name || 'suspect'} on their whereabouts, motive, or evidence...`}
            className="flex-1 px-4 py-2.5 text-sm bg-black/40 border border-purple-800/60 rounded-xl text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400 transition"
          />

          {/* REQUIRED BUTTON: "Send" */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-950/60 flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};

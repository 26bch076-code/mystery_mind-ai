/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  FolderSearch, 
  Users, 
  Compass, 
  HelpCircle, 
  Eye, 
  Gavel, 
  PlusCircle, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { InterrogationRoom } from './components/InterrogationRoom';
import { ClueBoard } from './components/ClueBoard';
import { SuspectDossier } from './components/SuspectDossier';
import { HintModal } from './components/HintModal';
import { AccusationModal } from './components/AccusationModal';
import { RevealSolutionModal } from './components/RevealSolutionModal';
import { 
  MysteryCase, 
  Difficulty, 
  ChatMessage, 
  Clue, 
  AccusationPayload, 
  AccusationResult, 
  CaseSolution 
} from './types/mystery';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentCase, setCurrentCase] = useState<MysteryCase | null>(null);
  const [activeTab, setActiveTab] = useState<'interrogate' | 'clues' | 'suspects'>('interrogate');
  const [activeSuspectId, setActiveSuspectId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hints, setHints] = useState<Array<{ number: number; text: string; focusArea: string }>>([]);
  const [solution, setSolution] = useState<CaseSolution | null>(null);
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);

  // Modals state
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(true);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [isAccusationOpen, setIsAccusationOpen] = useState<boolean>(false);
  const [isRevealOpen, setIsRevealOpen] = useState<boolean>(false);

  // Loaders
  const [isLoadingCase, setIsLoadingCase] = useState<boolean>(false);
  const [isInterrogating, setIsInterrogating] = useState<boolean>(false);
  const [isSearchingPoint, setIsSearchingPoint] = useState<boolean>(false);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [isLoadingReveal, setIsLoadingReveal] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);

  // Initialize or fetch initial starter case
  const fetchCase = async (difficulty: Difficulty = 'easy', generateAI: boolean = false, customTheme: string = '') => {
    try {
      setIsLoadingCase(true);
      const res = await fetch('/api/case/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, generateAI, customTheme }),
      });
      const data = await res.json();
      if (data.case) {
        setCurrentCase(data.case);
        setActiveSuspectId(data.case.suspects[0]?.id || '');
        setMessages([
          {
            id: `sys_${Date.now()}`,
            sender: 'system',
            text: `Inquiry initiated for "${data.case.title}". Review suspect statements and begin questioning.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: `insp_${Date.now()}`,
            sender: 'inspector',
            text: `Detective, we have cordoned off ${data.case.victim.crimeScene}. Lord Blackwood died at ${data.case.victim.timeOfDeath}. The suspects are detained in the parlor for your questioning.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
        setHints([]);
        setSolution(null);
        setAccusationResult(null);
      }
    } catch (err) {
      console.error('Failed to load case:', err);
    } finally {
      setIsLoadingCase(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchCase('easy');
  }, []);

  const handleStartInvestigation = async (difficulty: Difficulty, generateAI?: boolean, customTheme?: string) => {
    await fetchCase(difficulty, generateAI, customTheme);
    setIsBriefingOpen(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentCase || !activeSuspectId) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'player',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsInterrogating(true);

    try {
      const res = await fetch('/api/case/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: currentCase.id,
          suspectId: activeSuspectId,
          question: text,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const suspect = currentCase.suspects.find(s => s.id === activeSuspectId);

      // Sound reaction
      if (data.stressDelta && data.stressDelta > 10) {
        soundEffects.playTension();
      }

      const suspectMsg: ChatMessage = {
        id: `sus_${Date.now()}`,
        sender: 'suspect',
        suspectId: activeSuspectId,
        suspectName: suspect?.name,
        text: data.response || '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: data.mood,
        stressDelta: data.stressDelta,
        revealedClue: data.revealedClue,
      };

      setMessages(prev => [...prev, suspectMsg]);

      // Update suspect stress & clues in currentCase
      setCurrentCase(prev => {
        if (!prev) return null;
        const updatedSuspects = prev.suspects.map(s => {
          if (s.id === activeSuspectId) {
            return {
              ...s,
              stressLevel: data.stressLevel ?? s.stressLevel,
              mood: data.mood ?? s.mood,
            };
          }
          return s;
        });

        let updatedClues = prev.clues;
        if (data.revealedClue) {
          updatedClues = prev.clues.map(c => 
            c.id === data.revealedClue.id ? { ...c, discovered: true } : c
          );
        }

        return {
          ...prev,
          suspects: updatedSuspects,
          clues: updatedClues,
        };
      });

    } catch (err) {
      console.error('Interrogation request error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'system',
          text: 'The suspect fell silent and refused to answer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsInterrogating(false);
    }
  };

  const handleSearchPoint = async (pointId: string) => {
    if (!currentCase) return;
    setIsSearchingPoint(true);
    try {
      const res = await fetch('/api/case/search-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: currentCase.id, pointId }),
      });
      const data = await res.json();
      if (data.point) {
        setCurrentCase(prev => {
          if (!prev) return null;
          return {
            ...prev,
            crimeScenePoints: prev.crimeScenePoints.map(p => 
              p.id === pointId ? { ...p, searched: true } : p
            ),
            clues: data.allClues || prev.clues,
          };
        });

        if (data.discoveredClue) {
          setMessages(prev => [
            ...prev,
            {
              id: `clue_disc_${Date.now()}`,
              sender: 'system',
              text: `Evidence Discovered at ${data.point.name}: "${data.discoveredClue.title}" has been logged into the Evidence Locker.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Error searching point:', err);
    } finally {
      setIsSearchingPoint(false);
    }
  };

  const handleRequestHint = async () => {
    if (!currentCase) return;
    setIsLoadingHint(true);
    try {
      const res = await fetch('/api/case/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: currentCase.id }),
      });
      const data = await res.json();
      if (data.hintText) {
        setHints(prev => [
          ...prev,
          {
            number: data.hintNumber,
            text: data.hintText,
            focusArea: data.focusArea,
          }
        ]);
        setCurrentCase(prev => {
          if (!prev) return null;
          return {
            ...prev,
            hintsUsed: prev.hintsUsed + 1,
          };
        });
      }
    } catch (err) {
      console.error('Error requesting hint:', err);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSubmitAccusation = async (payload: AccusationPayload): Promise<AccusationResult | null> => {
    if (!currentCase) return null;
    try {
      const res = await fetch('/api/case/accuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: AccusationResult = await res.json();
      setAccusationResult(result);
      setSolution(result.solution);
      setCurrentCase(prev => prev ? { ...prev, status: result.isCorrect ? 'solved' : 'failed' } : null);
      return result;
    } catch (err) {
      console.error('Accusation failed:', err);
      return null;
    }
  };

  const handleConfirmReveal = async () => {
    if (!currentCase) return;
    setIsLoadingReveal(true);
    try {
      const res = await fetch('/api/case/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: currentCase.id }),
      });
      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
        setCurrentCase(prev => prev ? { ...prev, status: 'revealed' } : null);
      }
    } catch (err) {
      console.error('Error revealing solution:', err);
    } finally {
      setIsLoadingReveal(false);
    }
  };

  const handleToggleMute = () => {
    const isMuted = soundEffects.toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col noir-grid selection:bg-purple-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentCase={currentCase}
        onNewCase={() => setIsBriefingOpen(true)}
        onHint={() => setIsHintModalOpen(true)}
        onRevealSolution={() => setIsRevealOpen(true)}
        onAccuse={() => setIsAccusationOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('interrogate');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                activeTab === 'interrogate'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                  : 'bg-[#0d112d] text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Interrogation Room</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('clues');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                activeTab === 'clues'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                  : 'bg-[#0d112d] text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/60'
              }`}
            >
              <FolderSearch className="w-4 h-4" />
              <span>Crime Scene & Clues</span>
              {currentCase && (
                <span className="w-5 h-5 rounded-full bg-purple-950 text-[11px] font-mono flex items-center justify-center text-purple-300">
                  {currentCase.clues.filter(c => c.discovered).length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('suspects');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                activeTab === 'suspects'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                  : 'bg-[#0d112d] text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Suspect Dossiers</span>
              {currentCase && (
                <span className="w-5 h-5 rounded-full bg-purple-950 text-[11px] font-mono flex items-center justify-center text-purple-300">
                  {currentCase.suspects.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Case Summary banner */}
          {currentCase && (
            <div className="hidden lg:flex items-center gap-3 text-xs text-purple-300/80 font-mono">
              <span className="truncate max-w-xs">
                Victim: <strong className="text-white">{currentCase.victim.name}</strong>
              </span>
              <span>•</span>
              <span>TOD: <strong className="text-white">{currentCase.victim.timeOfDeath}</strong></span>
            </div>
          )}
        </div>

        {/* Tab Content Panes */}
        <div className="flex-1 min-h-[600px] flex flex-col">
          {activeTab === 'interrogate' && currentCase && (
            <InterrogationRoom
              suspects={currentCase.suspects}
              activeSuspectId={activeSuspectId}
              onSelectSuspect={(id) => setActiveSuspectId(id)}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isInterrogating}
              discoveredClues={currentCase.clues.filter(c => c.discovered)}
            />
          )}

          {activeTab === 'clues' && currentCase && (
            <ClueBoard
              clues={currentCase.clues}
              crimeScenePoints={currentCase.crimeScenePoints}
              onSearchPoint={handleSearchPoint}
              isSearching={isSearchingPoint}
            />
          )}

          {activeTab === 'suspects' && currentCase && (
            <SuspectDossier
              suspects={currentCase.suspects}
              onInterrogate={(id) => {
                setActiveSuspectId(id);
                setActiveTab('interrogate');
              }}
            />
          )}
        </div>

      </main>

      {/* Case Briefing / Welcome Modal with "Start Investigation" Button */}
      <CaseBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        currentCase={currentCase}
        onStartInvestigation={handleStartInvestigation}
        isLoading={isLoadingCase}
      />

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        onRequestHint={handleRequestHint}
        hints={hints}
        hintsRemaining={currentCase ? currentCase.hintsAvailable - currentCase.hintsUsed : 0}
        maxHints={currentCase?.hintsAvailable || 3}
        isLoading={isLoadingHint}
      />

      {/* Accusation Modal */}
      {currentCase && (
        <AccusationModal
          isOpen={isAccusationOpen}
          onClose={() => setIsAccusationOpen(false)}
          caseId={currentCase.id}
          suspects={currentCase.suspects}
          clues={currentCase.clues}
          onSubmitAccusation={handleSubmitAccusation}
          accusationResult={accusationResult}
          onResetAccusation={() => setAccusationResult(null)}
          onNewCase={() => setIsBriefingOpen(true)}
        />
      )}

      {/* Reveal Solution Modal */}
      {currentCase && (
        <RevealSolutionModal
          isOpen={isRevealOpen}
          onClose={() => setIsRevealOpen(false)}
          caseId={currentCase.id}
          solution={solution}
          onConfirmReveal={handleConfirmReveal}
          isLoading={isLoadingReveal}
          onNewCase={() => setIsBriefingOpen(true)}
        />
      )}

    </div>
  );
}

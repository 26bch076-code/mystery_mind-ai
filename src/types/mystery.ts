export type Difficulty = 'easy' | 'medium' | 'hard';

export type ClueCategory = 'Physical' | 'Document' | 'Alibi' | 'Forensic' | 'Digital';

export type SuspectMood = 'calm' | 'defensive' | 'nervous' | 'panicked' | 'smug';

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  avatarIcon: string;
  personality: string;
  motive: string;
  alibi: string;
  secret: string;
  initialStatement: string;
  stressLevel: number; // 0 - 100
  mood: SuspectMood;
  isCulprit?: boolean; // Kept hidden on client
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  category: ClueCategory;
  location: string;
  discovered: boolean;
  isKeyEvidence: boolean;
  details?: string;
}

export interface CrimeScenePoint {
  id: string;
  name: string;
  description: string;
  searched: boolean;
  clueId?: string;
  investigationNote?: string;
}

export interface VictimInfo {
  name: string;
  title: string;
  age: number;
  causeOfDeath: string;
  timeOfDeath: string;
  crimeScene: string;
  background: string;
}

export interface CaseSolution {
  culpritId: string;
  culpritName: string;
  weaponOrMethod: string;
  actualMotive: string;
  keyIncriminatingClue: string;
  timeline: Array<{ time: string; event: string }>;
  confession: string;
  breakdown: string;
}

export interface MysteryCase {
  id: string;
  title: string;
  difficulty: Difficulty;
  genre: string;
  synopsis: string;
  victim: VictimInfo;
  suspects: Suspect[];
  clues: Clue[];
  crimeScenePoints: CrimeScenePoint[];
  hintsAvailable: number;
  hintsUsed: number;
  status: 'investigating' | 'solved' | 'failed' | 'revealed';
  solution?: CaseSolution;
}

export interface ChatMessage {
  id: string;
  sender: 'player' | 'suspect' | 'inspector' | 'system';
  suspectId?: string;
  suspectName?: string;
  text: string;
  timestamp: string;
  mood?: SuspectMood;
  stressDelta?: number;
  revealedClue?: Clue;
}

export interface AccusationPayload {
  caseId: string;
  accusedSuspectId: string;
  murderWeapon: string;
  motive: string;
  keyClueId: string;
}

export interface AccusationResult {
  isCorrect: boolean;
  culpritMatch: boolean;
  weaponMatch: boolean;
  motiveMatch: boolean;
  clueMatch: boolean;
  score: number;
  rank: string;
  verdictNarrative: string;
  solution: CaseSolution;
}

export interface HintResponse {
  hintNumber: number;
  remainingHints: number;
  hintText: string;
  focusArea: string;
}

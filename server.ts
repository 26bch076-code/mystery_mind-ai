import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { MASTER_CASES, InternalCase } from './server/masterCases.ts';
import { MysteryCase, Suspect, Clue, AccusationPayload, AccusationResult, CaseSolution, SuspectMood } from './src/types/mystery.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side active case storage for maintaining airtight consistency
const activeCases = new Map<string, InternalCase>();

// Helper to mask solution and secret culprit flags for client payload
function sanitizeCaseForClient(internalCase: InternalCase): MysteryCase {
  const sanitizedSuspects: Suspect[] = internalCase.suspects.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    age: s.age,
    avatarIcon: s.avatarIcon,
    personality: s.personality,
    motive: s.motive,
    alibi: s.alibi,
    secret: s.secret,
    initialStatement: s.initialStatement,
    stressLevel: s.stressLevel,
    mood: s.mood,
    // Note: isCulprit omitted so client cannot cheat by inspecting state
  }));

  return {
    id: internalCase.id,
    title: internalCase.title,
    difficulty: internalCase.difficulty,
    genre: internalCase.genre,
    synopsis: internalCase.synopsis,
    victim: internalCase.victim,
    suspects: sanitizedSuspects,
    clues: internalCase.clues,
    crimeScenePoints: internalCase.crimeScenePoints,
    hintsAvailable: internalCase.hintsAvailable,
    hintsUsed: internalCase.hintsUsed,
    status: internalCase.status,
    // solution omitted until accused or revealed
  };
}

// Ensure default cases exist in active storage
for (const key of Object.keys(MASTER_CASES)) {
  const master = MASTER_CASES[key];
  activeCases.set(master.id, JSON.parse(JSON.stringify(master)));
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: !!apiKey });
});

// Endpoint: Start / Generate a new case
app.post('/api/case/new', async (req: Request, res: Response) => {
  try {
    const { difficulty = 'easy', generateAI = false, customTheme = '' } = req.body;
    const diff = (difficulty === 'medium' || difficulty === 'hard') ? difficulty : 'easy';

    if (generateAI && apiKey) {
      // Generate a dynamic case via Gemini
      const prompt = `Generate an engaging, logical fictional murder mystery case for a detective game.
Difficulty: ${diff.toUpperCase()} (${diff === 'easy' ? '3 suspects, clear clues' : diff === 'medium' ? '4 suspects, deeper motives' : '4 suspects, intricate locked room/cipher or forensic twist'}).
${customTheme ? `Theme / Setting: ${customTheme}` : 'Theme: Unique detective mystery (e.g. art heist, luxury train, biotech lab, or grand theatre)'}.

IMPORTANT REQUIREMENTS:
1. Provide a single definite culprit among the suspects.
2. The culprit's alibi must contain a subtle flaw that contradicts physical evidence or timeline.
3. Every innocent suspect must have an alibi and an innocent secret (like embezzlement or infidelity) that is NOT the murder.
4. Exactly one suspect must have isCulprit set to true.
5. Provide 4-5 clues and 4 crime scene points to investigate.
6. Provide a complete solution breakdown, timeline, and culprit confession.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              genre: { type: Type.STRING },
              synopsis: { type: Type.STRING },
              victim: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  age: { type: Type.INTEGER },
                  causeOfDeath: { type: Type.STRING },
                  timeOfDeath: { type: Type.STRING },
                  crimeScene: { type: Type.STRING },
                  background: { type: Type.STRING },
                },
                required: ['name', 'title', 'age', 'causeOfDeath', 'timeOfDeath', 'crimeScene', 'background'],
              },
              suspects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    age: { type: Type.INTEGER },
                    avatarIcon: { type: Type.STRING },
                    personality: { type: Type.STRING },
                    motive: { type: Type.STRING },
                    alibi: { type: Type.STRING },
                    secret: { type: Type.STRING },
                    initialStatement: { type: Type.STRING },
                    isCulprit: { type: Type.BOOLEAN },
                  },
                  required: ['id', 'name', 'role', 'age', 'personality', 'motive', 'alibi', 'secret', 'initialStatement', 'isCulprit'],
                },
              },
              clues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING },
                    location: { type: Type.STRING },
                    isKeyEvidence: { type: Type.BOOLEAN },
                    details: { type: Type.STRING },
                  },
                  required: ['id', 'title', 'description', 'category', 'location', 'isKeyEvidence'],
                },
              },
              crimeScenePoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    clueId: { type: Type.STRING },
                    investigationNote: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'description'],
                },
              },
              hints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              solution: {
                type: Type.OBJECT,
                properties: {
                  culpritId: { type: Type.STRING },
                  culpritName: { type: Type.STRING },
                  weaponOrMethod: { type: Type.STRING },
                  actualMotive: { type: Type.STRING },
                  keyIncriminatingClue: { type: Type.STRING },
                  confession: { type: Type.STRING },
                  breakdown: { type: Type.STRING },
                  timeline: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        event: { type: Type.STRING },
                      },
                      required: ['time', 'event'],
                    },
                  },
                },
                required: ['culpritId', 'culpritName', 'weaponOrMethod', 'actualMotive', 'keyIncriminatingClue', 'confession', 'breakdown', 'timeline'],
              },
            },
            required: ['title', 'genre', 'synopsis', 'victim', 'suspects', 'clues', 'crimeScenePoints', 'hints', 'solution'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const caseId = `case_ai_${Date.now()}`;

      const newCase: InternalCase = {
        id: caseId,
        title: parsed.title || 'The Enigma Protocol',
        difficulty: diff,
        genre: parsed.genre || 'Mystery Thriller',
        synopsis: parsed.synopsis || 'A mysterious crime awaits your deduction.',
        victim: parsed.victim,
        suspects: parsed.suspects.map((s: any, idx: number) => ({
          ...s,
          id: s.id || `suspect_${idx + 1}`,
          avatarIcon: s.avatarIcon || (idx % 2 === 0 ? 'UserCheck' : 'ShieldAlert'),
          stressLevel: 20,
          mood: 'calm' as SuspectMood,
          isCulprit: Boolean(s.isCulprit),
        })),
        clues: parsed.clues.map((c: any, idx: number) => ({
          ...c,
          id: c.id || `clue_${idx + 1}`,
          discovered: false,
          category: c.category || 'Physical',
        })),
        crimeScenePoints: parsed.crimeScenePoints.map((p: any, idx: number) => ({
          ...p,
          id: p.id || `point_${idx + 1}`,
          searched: false,
        })),
        hintsAvailable: 3,
        hintsUsed: 0,
        status: 'investigating',
        hints: parsed.hints || [
          'Examine the victim’s exact time of death versus suspect statements.',
          'Review the physical clues found at the crime scene.',
          'One suspect alibi directly contradicts the forensic evidence.',
        ],
        solution: parsed.solution,
      };

      // Store in memory
      activeCases.set(caseId, newCase);
      return res.json({ case: sanitizeCaseForClient(newCase) });
    }

    // Otherwise use curated Master Case for the difficulty
    const master = MASTER_CASES[diff] || MASTER_CASES.easy;
    const caseClone: InternalCase = JSON.parse(JSON.stringify(master));
    caseClone.id = `${master.id}_${Date.now()}`;
    activeCases.set(caseClone.id, caseClone);

    return res.json({ case: sanitizeCaseForClient(caseClone) });
  } catch (err: any) {
    console.error('Error generating case:', err);
    // Fallback safely to master easy case
    const master = MASTER_CASES.easy;
    const caseClone: InternalCase = JSON.parse(JSON.stringify(master));
    caseClone.id = `${master.id}_fallback_${Date.now()}`;
    activeCases.set(caseClone.id, caseClone);
    return res.json({ case: sanitizeCaseForClient(caseClone) });
  }
});

// Endpoint: Interrogate suspect
app.post('/api/case/interrogate', async (req: Request, res: Response) => {
  try {
    const { caseId, suspectId, question, history = [] } = req.body;
    const internalCase = activeCases.get(caseId);

    if (!internalCase) {
      return res.status(404).json({ error: 'Case not found or expired.' });
    }

    const suspect = internalCase.suspects.find(s => s.id === suspectId);
    if (!suspect) {
      return res.status(404).json({ error: 'Suspect not found.' });
    }

    // Check if question references any discovered clues
    const discoveredClues = internalCase.clues.filter(c => c.discovered);
    const discoveredTitles = discoveredClues.map(c => `"${c.title}" (${c.description})`).join(', ');

    if (!apiKey) {
      // Local fallback in-character interrogation
      const isCulprit = suspect.isCulprit;
      let text = '';
      let mood: SuspectMood = 'calm';
      let stressDelta = 5;

      const qLower = (question || '').toLowerCase();
      if (qLower.includes('alibi') || qLower.includes('where were you') || qLower.includes('time')) {
        text = `As I already explained: ${suspect.alibi}`;
        mood = 'defensive';
        stressDelta = 5;
      } else if (qLower.includes('kill') || qLower.includes('murder') || qLower.includes('poison') || qLower.includes('culprit')) {
        if (isCulprit) {
          text = `How dare you point fingers at me! I had no reason to end Lord Blackwood's life. You detectives love grasping at thin air!`;
          mood = 'panicked';
          stressDelta = 15;
        } else {
          text = `I had my disagreements with the victim, but I am certainly no murderer. Check the other suspects!`;
          mood = 'defensive';
          stressDelta = 8;
        }
      } else if (qLower.includes('motive') || qLower.includes('money') || qLower.includes('why') || qLower.includes('secret')) {
        text = `${suspect.motive}. But that does not prove anything.`;
        mood = 'nervous';
        stressDelta = 10;
      } else {
        text = `I am cooperating fully with the inquiry. ${suspect.initialStatement}`;
        mood = 'calm';
        stressDelta = 0;
      }

      suspect.stressLevel = Math.min(100, Math.max(0, suspect.stressLevel + stressDelta));
      suspect.mood = mood;

      return res.json({
        response: text,
        mood,
        stressLevel: suspect.stressLevel,
        stressDelta,
      });
    }

    // Build system prompt for Gemini
    const systemPrompt = `You are roleplaying as the suspect "${suspect.name}" (${suspect.role}, age ${suspect.age}) in an interactive fictional detective game.
You are being questioned by the player (Detective).

CASE DOSSIER:
- Case Title: "${internalCase.title}" (${internalCase.difficulty} difficulty)
- Setting: ${internalCase.victim.crimeScene}
- Victim: ${internalCase.victim.name}, ${internalCase.victim.title}. Cause of death: ${internalCase.victim.causeOfDeath} at ${internalCase.victim.timeOfDeath}.
- Your Personality: ${suspect.personality}
- Your Official Alibi: "${suspect.alibi}"
- Your Suspected Motive: "${suspect.motive}"
- Your Secret: "${suspect.secret}"
- Current Stress Level: ${suspect.stressLevel}% / 100

ARE YOU THE TRUE KILLER?
${suspect.isCulprit ? '>>> YES, YOU ARE THE CULPRIT! <<<' : '>>> NO, YOU ARE INNOCENT OF THE MURDER! <<<'}

TRUE CASE SOLUTION (for consistency):
- Culprit: ${internalCase.solution.culpritName}
- Weapon/Method: ${internalCase.solution.weaponOrMethod}
- True Motive: ${internalCase.solution.actualMotive}
- Key Incriminating Clue: ${internalCase.solution.keyIncriminatingClue}

Discovered Clues by Detective so far: ${discoveredTitles || 'None yet'}

ROLEPLAY INSTRUCTIONS:
1. Stay strictly in character as ${suspect.name}. Keep your response concise (2-4 sentences max), dramatic, and spoken directly to the detective.
2. If INNOCENT: You might be annoyed, terrified, or defensive about your own embarrassing secret, but you did NOT commit the murder. You can hint at things you saw or your true alibi.
3. If GUILTY (CULPRIT): Try to deflect and feign innocence, preserve your alibi, but if cornered with physical evidence or specific timing inconsistencies, show cracks, stammer, or become hostile/nervous. Do NOT freely confess unless stress is over 85% and evidence is overwhelming.
4. Calculate stressDelta (-10 to +25): increase stress if pressed with evidence, direct contradictions, or key facts; decrease slightly if the question is soft or flattering.
5. Determine your current mood: 'calm' | 'defensive' | 'nervous' | 'panicked' | 'smug'.

OUTPUT JSON FORMAT:
{
  "response": "Your spoken dialogue to the detective",
  "mood": "calm" | "defensive" | "nervous" | "panicked" | "smug",
  "stressDelta": number
}`;

    const recentHistory = (history || []).slice(-6).map((h: any) => `${h.sender.toUpperCase()}: ${h.text}`).join('\n');
    const userPrompt = `${recentHistory ? `Recent conversation transcript:\n${recentHistory}\n\n` : ''}Detective asks: "${question}"`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            mood: { type: Type.STRING },
            stressDelta: { type: Type.INTEGER },
          },
          required: ['response', 'mood', 'stressDelta'],
        },
      },
    });

    const parsed = JSON.parse(result.text || '{}');
    const mood: SuspectMood = ['calm', 'defensive', 'nervous', 'panicked', 'smug'].includes(parsed.mood)
      ? parsed.mood
      : 'defensive';
    const stressDelta = Number(parsed.stressDelta) || 5;

    suspect.stressLevel = Math.min(100, Math.max(0, suspect.stressLevel + stressDelta));
    suspect.mood = mood;

    // Check if this interrogation reveals an undiscovered clue associated with this suspect
    let revealedClue: Clue | undefined = undefined;
    if (suspect.stressLevel > 65) {
      const relatedUndiscovered = internalCase.clues.find(
        c => !c.discovered && (c.description.includes(suspect.name) || c.details?.includes(suspect.name))
      );
      if (relatedUndiscovered) {
        relatedUndiscovered.discovered = true;
        revealedClue = relatedUndiscovered;
      }
    }

    return res.json({
      response: parsed.response || `I have nothing more to say on that.`,
      mood,
      stressLevel: suspect.stressLevel,
      stressDelta,
      revealedClue,
    });
  } catch (err: any) {
    console.error('Error during interrogation:', err);
    return res.status(500).json({
      response: `The suspect looks startled and hesitates, crossing their arms defensively. "I need a moment to collect my thoughts, Detective."`,
      mood: 'defensive',
      stressLevel: 40,
      stressDelta: 5,
    });
  }
});

// Endpoint: Search crime scene point of interest to discover clues
app.post('/api/case/search-point', (req: Request, res: Response) => {
  const { caseId, pointId } = req.body;
  const internalCase = activeCases.get(caseId);

  if (!internalCase) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  const point = internalCase.crimeScenePoints.find(p => p.id === pointId);
  if (!point) {
    return res.status(404).json({ error: 'Crime scene point not found.' });
  }

  point.searched = true;
  let discoveredClue: Clue | null = null;

  if (point.clueId) {
    const clue = internalCase.clues.find(c => c.id === point.clueId);
    if (clue) {
      clue.discovered = true;
      discoveredClue = clue;
    }
  }

  res.json({
    point,
    discoveredClue,
    allClues: internalCase.clues,
  });
});

// Endpoint: Request Hint
app.post('/api/case/hint', async (req: Request, res: Response) => {
  try {
    const { caseId } = req.body;
    const internalCase = activeCases.get(caseId);

    if (!internalCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    if (internalCase.hintsUsed >= internalCase.hintsAvailable) {
      return res.status(400).json({ error: 'No remaining hints available for this case.' });
    }

    const hintIndex = internalCase.hintsUsed;
    let hintText = internalCase.hints[hintIndex] || 'Examine all suspect alibis against the physical evidence.';
    internalCase.hintsUsed += 1;

    // Optional dynamic AI touch if available
    if (apiKey) {
      const discoveredClues = internalCase.clues.filter(c => c.discovered).map(c => c.title);
      const prompt = `You are Chief Inspector Sterling providing an investigative hint to a detective playing MysteryMind AI.
Case: "${internalCase.title}" (${internalCase.difficulty})
Victim: ${internalCase.victim.name}, died of ${internalCase.victim.causeOfDeath}
Discovered clues so far: ${discoveredClues.join(', ') || 'None yet'}
Ground truth culprit: ${internalCase.solution.culpritName}
Key clue needed: ${internalCase.solution.keyIncriminatingClue}
Hint Tier: ${hintIndex + 1} of 3 (${hintIndex === 0 ? 'Subtle nudge' : hintIndex === 1 ? 'Focus on contradiction' : 'Direct investigative breakthrough'})
Base hint: "${hintText}"

Provide a crisp, atmospheric 1-2 sentence hint from the Chief Inspector guiding the player toward the next logical step without outright spoiling the murderer's identity.`;

      try {
        const hintAi = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        if (hintAi.text) {
          hintText = hintAi.text.trim();
        }
      } catch (e) {
        // use base hint
      }
    }

    return res.json({
      hintNumber: internalCase.hintsUsed,
      remainingHints: internalCase.hintsAvailable - internalCase.hintsUsed,
      hintText,
      focusArea: hintIndex === 0 ? 'Timeline & Alibis' : hintIndex === 1 ? 'Physical Evidence' : 'Crucial Contradiction',
    });
  } catch (err: any) {
    console.error('Error getting hint:', err);
    res.status(500).json({ error: 'Failed to retrieve hint.' });
  }
});

// Endpoint: Make Accusation
app.post('/api/case/accuse', async (req: Request, res: Response) => {
  try {
    const { caseId, accusedSuspectId, murderWeapon, motive, keyClueId }: AccusationPayload = req.body;
    const internalCase = activeCases.get(caseId);

    if (!internalCase) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    const solution = internalCase.solution;
    const culpritMatch = solution.culpritId === accusedSuspectId;

    // Check weapon match (fuzzy keyword matching)
    const weaponLower = (murderWeapon || '').toLowerCase();
    const trueWeaponLower = solution.weaponOrMethod.toLowerCase();
    const weaponKeywords = trueWeaponLower.split(/\s+/).filter(w => w.length > 3);
    const weaponMatch = weaponKeywords.some(kw => weaponLower.includes(kw)) || weaponLower.length > 5;

    // Check motive match
    const motiveLower = (motive || '').toLowerCase();
    const trueMotiveLower = solution.actualMotive.toLowerCase();
    const motiveKeywords = trueMotiveLower.split(/\s+/).filter(w => w.length > 3);
    const motiveMatch = motiveKeywords.some(kw => motiveLower.includes(kw)) || motiveLower.length > 5;

    // Check clue match
    const clueMatch = Boolean(keyClueId && internalCase.clues.some(c => c.id === keyClueId && c.isKeyEvidence));

    const isCorrect = culpritMatch;
    let score = 0;
    if (culpritMatch) score += 50;
    if (weaponMatch) score += 20;
    if (motiveMatch) score += 15;
    if (clueMatch) score += 15;
    score -= (internalCase.hintsUsed * 10);
    score = Math.max(10, Math.min(100, score));

    let rank = 'Rookie Gumshoe';
    if (isCorrect && score >= 85) rank = 'Master Detective (Sherlock Tier)';
    else if (isCorrect && score >= 65) rank = 'Senior Inspector';
    else if (isCorrect) rank = 'Consulting Sleuth';
    else rank = 'Suspended Gumshoe';

    let verdictNarrative = '';

    const accusedSuspect = internalCase.suspects.find(s => s.id === accusedSuspectId);

    if (apiKey) {
      const prompt = `You are the dramatic narrator and Chief Magistrate in a murder mystery game called MysteryMind AI.
Case: "${internalCase.title}"
Accused: ${accusedSuspect?.name} (${accusedSuspect?.role})
True Culprit: ${solution.culpritName}
Is the accusation correct? ${isCorrect ? 'YES, ACCURATE!' : 'NO, WRONG SUSPECT!'}
Player’s cited weapon/method: "${murderWeapon}" (True: ${solution.weaponOrMethod})
Player’s cited motive: "${motive}" (True: ${solution.actualMotive})
Score: ${score}/100, Rank: ${rank}

Write a dramatic, cinematic 3-paragraph courtroom/confrontation climax:
Paragraph 1: The tense confrontation where the detective lays down the charges.
Paragraph 2: The reaction of the accused (${isCorrect ? 'they break down or sneer in confession' : 'they are shocked, proving an alibi, while the real killer smiles in the shadows'}).
Paragraph 3: The final judicial resolution and detective assessment.`;

      try {
        const aiVerdict = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        if (aiVerdict.text) {
          verdictNarrative = aiVerdict.text.trim();
        }
      } catch (e) {
        // fallback
      }
    }

    if (!verdictNarrative) {
      if (isCorrect) {
        verdictNarrative = `The courtroom falls dead silent as you slam your dossier on the table. Point by point, you dismantle ${solution.culpritName}'s lies. Caught red-handed by the irrefutable evidence, they hang their head in defeat: "${solution.confession}"\n\nJustice is served! The Chief Inspector salutes your deductive prowess. Case officially closed.`;
      } else {
        verdictNarrative = `A gasp rings out across the room. ${accusedSuspect?.name} recoils in disbelief and immediately produces rock-solid corroboration clearing their name. An innocent person was wrongfully indicted, allowing ${solution.culpritName} to slip through the fingers of justice.\n\nYour detective badge is marked, but the truth must still be acknowledged.`;
      }
    }

    internalCase.status = isCorrect ? 'solved' : 'failed';

    const result: AccusationResult = {
      isCorrect,
      culpritMatch,
      weaponMatch,
      motiveMatch,
      clueMatch,
      score,
      rank,
      verdictNarrative,
      solution,
    };

    return res.json(result);
  } catch (err: any) {
    console.error('Error during accusation:', err);
    res.status(500).json({ error: 'Accusation evaluation failed.' });
  }
});

// Endpoint: Reveal Solution (functional reveal solution button)
app.post('/api/case/reveal', (req: Request, res: Response) => {
  const { caseId } = req.body;
  const internalCase = activeCases.get(caseId);

  if (!internalCase) {
    return res.status(404).json({ error: 'Case not found.' });
  }

  internalCase.status = 'revealed';
  res.json({
    solution: internalCase.solution,
    status: 'revealed',
  });
});

// Vite middleware for dev or static serving in prod
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MysteryMind AI server running on http://0.0.0.0:${PORT}`);
});

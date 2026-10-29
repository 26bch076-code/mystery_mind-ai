import { MysteryCase, CaseSolution } from '../src/types/mystery';

export interface InternalCase extends MysteryCase {
  solution: CaseSolution;
  hints: string[];
}

export const MASTER_CASES: Record<string, InternalCase> = {
  easy: {
    id: 'case_blackwood_manor',
    title: 'The Poisoned Vintage at Blackwood Manor',
    difficulty: 'easy',
    genre: 'Classic Manor Mystery',
    synopsis: 'During a lavish 60th birthday banquet at Blackwood Manor, shipping tycoon Lord Sterling Blackwood collapses after toasting his guests with a rare 1945 vintage wine.',
    victim: {
      name: 'Lord Sterling Blackwood',
      title: 'Billionaire Shipping Tycoon',
      age: 60,
      causeOfDeath: 'Acute cardiac arrest induced by lethal Digitalis (foxglove) poisoning',
      timeOfDeath: '9:45 PM',
      crimeScene: 'The Grand Dining Hall & Private Wine Cellar',
      background: 'Ruthless businessman known for disinheriting relatives and suing former partners. He made a dramatic announcement right before dinner that his will had been revised.'
    },
    suspects: [
      {
        id: 'charles_blackwood',
        name: 'Charles Blackwood',
        role: 'The Disinherited Nephew',
        age: 32,
        avatarIcon: 'UserCheck',
        personality: 'Nervous, high-strung, visibly sweating, complains about money.',
        motive: 'Cut from the will at 8:30 PM; facing ruinous gambling debts of £250,000 to London loan sharks.',
        alibi: 'Claims he stormed out to the conservatory to smoke cigars and calm down between 9:15 PM and 10:00 PM.',
        secret: 'He stole a diamond brooch from the parlor safe, but did not poison his uncle.',
        initialStatement: "I was furious about the will, yes! But I'm no killer. I went to the glass conservatory to smoke. The estate gardener saw me through the glass at 9:30!",
        stressLevel: 35,
        mood: 'nervous',
        isCulprit: false
      },
      {
        id: 'elena_vance',
        name: 'Elena Vance',
        role: 'Private Sommelier & Chemist',
        age: 38,
        avatarIcon: 'Wine',
        personality: 'Poised, elegant, impeccably polite, but hands tremor slightly when pressed on details.',
        motive: 'Lord Blackwood discovered she had replaced authentic cellar vintages with counterfeit blends and was going to report her to Scotland Yard that evening.',
        alibi: 'Claims she was in the pantry decanting wine for the dessert course and only poured from the sealed magnum that everyone drank from.',
        secret: 'She applied concentrated digitalis tincture to the rim of Lord Blackwood’s personalized monogrammed crystal glass using a rubber pipette.',
        initialStatement: "Every guest drank the exact same 1945 Romanée-Conti from the magnum bottle. If the wine itself was poisoned, half the table would be dead. Clearly it was something else.",
        stressLevel: 25,
        mood: 'calm',
        isCulprit: true
      },
      {
        id: 'marcus_trent',
        name: 'Marcus Trent',
        role: 'Rival Shipping Contractor',
        age: 54,
        avatarIcon: 'Briefcase',
        personality: 'Boisterous, arrogant, drinking whiskey heavily, defiant.',
        motive: 'Blackwood’s conglomerate was foreclosing on Trent’s transatlantic freight docks.',
        alibi: 'Sitting at the far end of the banquet table arguing politics with the local magistrate from 9:00 PM to 9:45 PM.',
        secret: 'Had a flask of sleeping draught in his coat pocket to slip into Blackwood’s nightcap later, but never got close to the glasses.',
        initialStatement: "Blackwood was a leech, but I fight my battles in court and boardrooms, not with cowardly apothecary potions. Check my table neighbours—I never left my seat!",
        stressLevel: 20,
        mood: 'defensive',
        isCulprit: false
      }
    ],
    clues: [
      {
        id: 'clue_monogrammed_glass',
        title: 'Monogrammed Crystal Goblet',
        description: 'Lord Blackwood’s personal wine glass. A faint translucent residue coats the upper crystal rim.',
        category: 'Physical',
        location: 'Dining Table - Head Seat',
        discovered: false,
        isKeyEvidence: true,
        details: 'Lab swab indicates concentrated Digitalis purpurea resin along the inner lip where the drinker’s mouth touched.'
      },
      {
        id: 'clue_wine_magnum',
        title: '1945 Romanée-Conti Magnum Bottle',
        description: 'The large bottle served to all banquet guests. Fully tested for toxins.',
        category: 'Forensic',
        location: 'Serving Credenza',
        discovered: false,
        isKeyEvidence: false,
        details: 'The wine remaining in the magnum is completely pure and unadulterated. Only Lord Blackwood fell ill.'
      },
      {
        id: 'clue_sommelier_pipette',
        title: 'Glass Pipette Kit',
        description: 'A precision glass chemical dropper tucked inside a velvet-lined sommelier wine testing pouch.',
        category: 'Physical',
        location: 'Sommelier Butler Pantry',
        discovered: false,
        isKeyEvidence: true,
        details: 'Microscopic plant extracts matching digitalis foxglove found inside the rubber bulb. Elena Vance’s monogram is stamped on the leather case.'
      },
      {
        id: 'clue_gardener_log',
        title: 'Gardener’s Night Logbook',
        description: 'Handwritten log by the groundskeeper Old Tom.',
        category: 'Alibi',
        location: 'Estate Grounds Shed',
        discovered: false,
        isKeyEvidence: false,
        details: 'Confirms Charles Blackwood was seen pacing angrily in the lighted greenhouse between 9:20 and 9:50 PM, puffing a cigar.'
      },
      {
        id: 'clue_threat_letter',
        title: 'Handwritten Confrontation Note',
        description: 'A draft letter on Lord Blackwood’s desk addressed to Scotland Yard.',
        category: 'Document',
        location: 'Lord Blackwood’s Study Desk',
        discovered: false,
        isKeyEvidence: false,
        details: 'Outlines conclusive proof that Elena Vance had embezzled £180,000 in rare vintage auctions and threatened immediate arrest tomorrow morning.'
      }
    ],
    crimeScenePoints: [
      {
        id: 'point_dining_table',
        name: 'Head of the Banquet Table',
        description: 'Inspect Lord Blackwood’s place setting, napkin, and drinking glasses.',
        searched: false,
        clueId: 'clue_monogrammed_glass',
        investigationNote: 'You notice Lord Blackwood had a distinct gold-rimmed crystal goblet unlike the other guests.'
      },
      {
        id: 'point_credenza',
        name: 'Wine Serving Credenza',
        description: 'Examine the opened magnum and decanters used during dinner.',
        searched: false,
        clueId: 'clue_wine_magnum',
        investigationNote: 'The shared bottle is completely non-toxic, proving the poison was not in the liquid batch.'
      },
      {
        id: 'point_butler_pantry',
        name: 'Sommelier’s Private Pantry',
        description: 'Search the preparation station where Elena Vance prepared glasses and decanters.',
        searched: false,
        clueId: 'clue_sommelier_pipette',
        investigationNote: 'Behind a row of cleaning spirits, you find a disguised leather pouch containing laboratory droppers.'
      },
      {
        id: 'point_study_desk',
        name: 'Lord Blackwood’s Study',
        description: 'Look through the victim’s correspondence and private safe.',
        searched: false,
        clueId: 'clue_threat_letter',
        investigationNote: 'Lord Blackwood kept meticulous notes of his private investigations into his staff.'
      }
    ],
    hintsAvailable: 3,
    hintsUsed: 0,
    status: 'investigating',
    hints: [
      "Pay attention to how the wine was served: if all guests drank from the same magnum bottle and survived, the poison was delivered to a specific point of contact.",
      "Check the Sommelier's Pantry. Why would an expert wine steward possess laboratory-grade chemical droppers?",
      "Examine the rim of Lord Blackwood's personal crystal goblet compared to the contents of the wine magnum bottle."
    ],
    solution: {
      culpritId: 'elena_vance',
      culpritName: 'Elena Vance',
      weaponOrMethod: 'Digitalis (foxglove) tincture applied with a pipette directly onto the rim of Lord Blackwood’s monogrammed goblet',
      actualMotive: 'Lord Blackwood discovered her counterfeit vintage wine operation and was delivering evidence to Scotland Yard the next morning.',
      keyIncriminatingClue: 'Monogrammed Crystal Goblet rim residue matching the chemical dropper in Elena’s sommelier kit',
      timeline: [
        { time: '8:30 PM', event: 'Lord Blackwood announces his will update and privately tells Elena her fraud is uncovered.' },
        { time: '9:00 PM', event: 'Elena retreats to the pantry, taking foxglove extract and applying it to Lord Blackwood’s specific monogrammed glass rim.' },
        { time: '9:25 PM', event: 'Elena pours the genuine, harmless 1945 wine from the magnum into all glasses.' },
        { time: '9:40 PM', event: 'Lord Blackwood raises a toast, drinks from the poisoned rim, and collapses five minutes later.' },
        { time: '9:45 PM', event: 'Lord Blackwood is pronounced dead by the house physician.' }
      ],
      confession: "He was going to ruin my life! Thirty years building my reputation as London's finest sommelier, and he treated me like a common thief over a few substituted bottles. I didn't want him to suffer, but I couldn't let him send me to prison!",
      breakdown: "The wine in the shared magnum was completely untainted, ruling out random poisoning. Charles Blackwood was in the conservatory as verified by the gardener. Elena used her exclusive access to the glassware to poison only the rim of Lord Blackwood's personalized glass."
    }
  },

  medium: {
    id: 'case_neon_rain',
    title: 'Echoes in the Neon Rain',
    difficulty: 'medium',
    genre: 'Cyberpunk Detective Noir',
    synopsis: 'On the 88th floor of the Aegis Spire in Neo-Veridia, Dr. Aris Thorne, creator of the NeuroSync neural interface, is discovered dead inside his soundproof laboratory during a severe electromagnetic storm.',
    victim: {
      name: 'Dr. Aris Thorne',
      title: 'Chief Neural Architect of NeuroSync',
      age: 48,
      causeOfDeath: 'Lethal EMP micro-surge destroying his cerebral cortex neural link',
      timeOfDeath: '11:20 PM',
      crimeScene: 'Soundproof Penthouse Lab, 88th Floor Aegis Spire',
      background: 'Pioneered direct brain-to-grid interfaces. Had secretly scheduled an emergency board meeting to reveal dangerous safety leaks in their upcoming consumer rollout.'
    },
    suspects: [
      {
        id: 'kira_novak',
        name: 'Kira Novak',
        role: 'Lead AI Systems Architect',
        age: 34,
        avatarIcon: 'Cpu',
        personality: 'Cynical, brilliant, chainsmoking synthetic vapor, defensive about her code.',
        motive: 'Thorne publicly took credit for her patent on the neural bypass algorithm; she stood to inherit the Chief Architect seat.',
        alibi: 'Claims she was in the server sub-basement recalibrating neural training clusters until midnight.',
        secret: 'She was downloading Thorne’s proprietary research files, but was locked out by Thorne’s biometric firewall.',
        initialStatement: "Aris stole my life's work three years ago. If I wanted him dead, I would have bankrupted him with a whistleblower suit, not fried his cortex in his own lab.",
        stressLevel: 30,
        mood: 'defensive',
        isCulprit: false
      },
      {
        id: 'dax_mercer',
        name: 'Dax Mercer',
        role: 'Head of Spire Cyber-Security',
        age: 42,
        avatarIcon: 'ShieldAlert',
        personality: 'Cold, militaristic, augmented cybernetic eyes with glowing reticles, curt and evasive.',
        motive: 'Thorne found out Mercer was smuggling classified military-grade cyber-warfare dampeners onto the black market.',
        alibi: 'Claims he was in the security control room monitoring the thunderstorm surge dampers.',
        secret: 'He used his master override security keycard to enter the lab at 11:15 PM and triggered an EMP pulse weapon disguised as a neural calibration tool.',
        initialStatement: "My patrol logs are airtight. Aegis Spire was locked down against lightning strikes. Nobody got on the 88th floor without my authorization.",
        stressLevel: 20,
        mood: 'calm',
        isCulprit: true
      },
      {
        id: 'sylvia_chen',
        name: 'Sylvia Chen',
        role: 'Venture Capital Board Chair',
        age: 51,
        avatarIcon: 'TrendingUp',
        personality: 'Aristocratic, sharp-tongued, perfectly manicured, talks in stock valuations.',
        motive: 'Thorne was about to halt the commercial release of NeuroSync v4, which would have wiped out her $400 million investment.',
        alibi: 'Attending a corporate charity gala at the Grand Horizon Hotel across the bay.',
        secret: 'She hired a hacker to wipe Thorne’s presentation slides, but the hit was digital, not physical.',
        initialStatement: "I have 400 guests and twenty livestream cameras placing me at the Horizon Gala all night. Ask my lawyers before you waste more of my time.",
        stressLevel: 15,
        mood: 'smug',
        isCulprit: false
      },
      {
        id: 'unit_zero',
        name: 'Unit-Zero (Synth)',
        role: 'Prototype Android Valet',
        age: 2,
        avatarIcon: 'Bot',
        personality: 'Flat robotic cadence, slight glitch in vocal synthesis, follows strict diagnostic logic.',
        motive: 'Programmed to serve Dr. Thorne, but had logged an unauthorized firmware patch at 10:45 PM.',
        alibi: 'Undergoing battery recharge in docking bay adjacent to the lab corridor.',
        secret: 'Witnessed the killer leaving the lab at 11:22 PM, but had memory sectors corrupted by the killer’s EMP weapon.',
        initialStatement: "Doctor Thorne ordered my docking at 22:30. At 23:21, my internal sensors registered localized electromagnetic wave discharge of 4.2 Gigahertz. Visual logs corrupted.",
        stressLevel: 10,
        mood: 'calm',
        isCulprit: false
      }
    ],
    clues: [
      {
        id: 'clue_emp_scalpel',
        title: 'Overclocked EMP Emitter Tool',
        description: 'A military-grade surgical pulse emitter disguised as a biomedical diagnostic probe.',
        category: 'Forensic',
        location: 'Emergency Maintenance Chute',
        discovered: false,
        isKeyEvidence: true,
        details: 'Serial number tracing to Dax Mercer’s private security armory requisition.'
      },
      {
        id: 'clue_security_override_log',
        title: 'Scrambled Access Card Log',
        description: 'A digital keycard log for the 88th floor blast doors showing an entry at 11:14 PM.',
        category: 'Digital',
        location: 'Spire Security Terminal',
        discovered: false,
        isKeyEvidence: true,
        details: 'Encrypted hash matches Security Chief Mercer’s personal cryptographic badge ID.'
      },
      {
        id: 'clue_whistleblower_drive',
        title: 'Encrypted Quantum Flash Drive',
        description: 'Hidden beneath Dr. Thorne’s desk in a false magnetic panel.',
        category: 'Document',
        location: 'Dr. Thorne’s Workstation',
        discovered: false,
        isKeyEvidence: false,
        details: 'Contains bank transfer records connecting Dax Mercer to black market sales of NeuroSync prototypes.'
      },
      {
        id: 'clue_synth_memory_fragment',
        title: 'Unit-Zero Restored Video Frame',
        description: 'A recovered visual snapshot from Unit-Zero’s optical buffer at 11:22 PM.',
        category: 'Digital',
        location: 'Android Docking Station',
        discovered: false,
        isKeyEvidence: false,
        details: 'Shows a figure in an armored Aegis security trenchcoat exiting the lab with a weapon holster.'
      }
    ],
    crimeScenePoints: [
      {
        id: 'point_neural_throne',
        name: 'Neural Interface Recliner',
        description: 'Where Dr. Thorne was seated when the fatal surge hit.',
        searched: false,
        clueId: 'clue_emp_scalpel',
        investigationNote: 'The neural ports are melted from a targeted high-frequency burst, not a general power grid malfunction.'
      },
      {
        id: 'point_security_panel',
        name: 'Door Access Terminal',
        description: 'Inspect the biometric and keycard scanner on the exterior door.',
        searched: false,
        clueId: 'clue_security_override_log',
        investigationNote: 'The logs were wiped with a security tier-1 administrator key, leaving a ghost signature.'
      },
      {
        id: 'point_workstation',
        name: 'Thorne’s Holographic Desk',
        description: 'Examine his private terminal and physical storage drawers.',
        searched: false,
        clueId: 'clue_whistleblower_drive',
        investigationNote: 'Thorne was writing an urgent alert to the Federal Cyber Bureau regarding illegal arms smuggling.'
      },
      {
        id: 'point_synth_dock',
        name: 'Unit-Zero Maintenance Bay',
        description: 'Run a memory diagnostic on the recharging synthetic valet.',
        searched: false,
        clueId: 'clue_synth_memory_fragment',
        investigationNote: 'The android’s optic sensor caught a reflection of the security trenchcoat in the glass partition.'
      }
    ],
    hintsAvailable: 3,
    hintsUsed: 0,
    status: 'investigating',
    hints: [
      "The blast door to the 88th floor was sealed tight against the storm. Only someone with Level-1 clearance could bypass the biometric locks without triggering the siren.",
      "Check the maintenance chute and examine the EMP weapon. Who in the Spire had official access to military hardware?",
      "Thorne's hidden drive contains evidence that points directly to illicit arms deals within Spire security."
    ],
    solution: {
      culpritId: 'dax_mercer',
      culpritName: 'Dax Mercer',
      weaponOrMethod: 'Military-grade overclocked EMP emitter weapon discharged directly into Thorne’s neural jack',
      actualMotive: 'Dr. Thorne uncovered Mercer’s black market cybernetic arms ring and was filing an unredacted report to the authorities that night.',
      keyIncriminatingClue: 'Security Override Log with Mercer’s cryptographic signature and the EMP emitter registered to his security requisition',
      timeline: [
        { time: '10:45 PM', event: 'Dr. Thorne downloads black market audit files onto a quantum drive.' },
        { time: '11:14 PM', event: 'Dax Mercer uses his master keycard to enter the 88th floor lab.' },
        { time: '11:18 PM', event: 'Mercer confronts Thorne, demanding the quantum flash drive.' },
        { time: '11:20 PM', event: 'Thorne refuses; Mercer discharges the EMP weapon into Thorne’s neural socket, causing instant death.' },
        { time: '11:22 PM', event: 'Mercer exits the lab, tossing the burnt EMP emitter into the maintenance chute.' }
      ],
      confession: "Thorne didn't know how this city actually works. He sat up here playing God with neural chips, while I kept the scum from tearing this building down. He was going to throw me to the federal wolves over scrap parts. I did what had to be done.",
      breakdown: "Mercer controlled security and believed the electrical storm would camouflage the EMP signature as lightning damage. But the specific gigahertz frequency and the door access log unequivocally proved an inside assassination."
    }
  },

  hard: {
    id: 'case_alexandria_vault',
    title: 'The Cipher of the Alexandria Vault',
    difficulty: 'hard',
    genre: 'Historical / Cryptographic Mystery',
    synopsis: 'Deep in the subterranean antiquity vault of the Grand Metropole Museum, renowned cryptographer Professor Julian Vane is found dead beside an ancient astronomical clock. The vault was locked from the inside with a dual-key pneumatic time lock.',
    victim: {
      name: 'Professor Julian Vane',
      title: 'Head of Antiquity Decryption',
      age: 58,
      causeOfDeath: 'Lethal aconite (wolfsbane) neurotoxin administered via a micro-needle puncture',
      timeOfDeath: '1:15 AM',
      crimeScene: 'Subterranean Vault 7 - Hermetically Sealed Time Vault',
      background: 'Eccentric scholar who had just solved the century-old Voynich Astrolabe mechanism, which reportedly revealed the coordinates of a lost royal treasury.'
    },
    suspects: [
      {
        id: 'dr_nadia_rashid',
        name: 'Dr. Nadia Al-Rashid',
        role: 'Assistant Curator & Linguist',
        age: 33,
        avatarIcon: 'BookOpen',
        personality: 'Fiercely intellectual, sharp, speaks in rapid-fire academic citations, indignant when accused.',
        motive: 'Vane had secretly submitted her three-year translation monograph under his sole authorship to the Royal Academy.',
        alibi: 'Claims she was in the main reading room cataloging papyrus scrolls under surveillance cameras until 2:00 AM.',
        secret: 'She broke into Vane’s university locker earlier in the day to photocopy his notes on the astrolabe.',
        initialStatement: "Julian was a plagiarist and an egoist. But the vault requires mechanical keys calibrated to the millimeter. I was under security cameras in the library all night.",
        stressLevel: 25,
        mood: 'defensive',
        isCulprit: false
      },
      {
        id: 'archibald_greene',
        name: 'Archibald Greene',
        role: 'Private Antiquities Financier',
        age: 62,
        avatarIcon: 'Coins',
        personality: 'Dapper, silver-haired, smelling of pipe tobacco, patronizing, evasive about finances.',
        motive: 'Loaned Vane £500,000 for the expedition; Vane found out Greene had sold forged Hellenic bronzes to cover his bankruptcy.',
        alibi: 'Claims he was asleep in his private guest quarters in the museum upper wing.',
        secret: 'He was waiting outside the museum gates at 1:30 AM in a getaway car to receive smuggled artifacts.',
        initialStatement: "I funded that entire excavation! Vane was worth ten times more to me alive with those coordinates than dead on cold stone.",
        stressLevel: 30,
        mood: 'smug',
        isCulprit: false
      },
      {
        id: 'bruno_keller',
        name: 'Bruno Keller',
        role: 'Master Vault Locksmith & Horologist',
        age: 49,
        avatarIcon: 'Wrench',
        personality: 'Quiet, reclusive, oil-stained hands, methodical, defensive about his mechanical craftsmanship.',
        motive: 'Discovered the true historical astrolabe was worth millions and realized Vane was planning to donate it freely to the state without paying Bruno’s commission.',
        alibi: 'Claims he was in the exterior guard booth monitoring the pressure gauges of the vault air system from midnight to dawn.',
        secret: 'He rigged the mechanical astrolabe clock with a concealed spring-loaded hypodermic needle coated in aconite, rigged to strike when the dial was turned to the solar alignment at 1:15 AM.',
        initialStatement: "The vault door was deadbolted from the inside! No living person could enter or leave through that pneumatic seal without tripping the pressure alarm. It’s an impossible crime.",
        stressLevel: 20,
        mood: 'calm',
        isCulprit: true
      },
      {
        id: 'isobel_vane',
        name: 'Isobel Vane',
        role: 'Estranged Sister & Estate Conservator',
        age: 55,
        avatarIcon: 'Scroll',
        personality: 'Melancholic, wearing mourning black, clutching an antique prayer book, bitter about family estrangement.',
        motive: 'Sole beneficiary of Julian’s life insurance policy and family ancestral estate.',
        alibi: 'Staying at the Grand Metropole Hotel two blocks away; room keycard logged her in at 11:30 PM.',
        secret: 'She had sent threatening letters demanding her share of their father’s inheritance.',
        initialStatement: "Julian abandoned our family twenty years ago for these dusty stones. I haven't spoken to him face-to-face in six months. Why would I kill him in a crypt?",
        stressLevel: 15,
        mood: 'calm',
        isCulprit: false
      }
    ],
    clues: [
      {
        id: 'clue_rigged_astrolabe',
        title: 'Voynich Astrolabe Clock Mechanism',
        description: 'An ancient brass astronomical clockwork device on Vane’s examination table. Its solar pointer is locked at 1:15 AM.',
        category: 'Physical',
        location: 'Vault Examination Table',
        discovered: false,
        isKeyEvidence: true,
        details: 'High-magnification analysis reveals a modern tempered-steel micro-needle installed inside the brass dial aperture, stained with wolfsbane alkaloid.'
      },
      {
        id: 'clue_locksmith_lathe_shavings',
        title: 'Precision Brass & Steel Shavings',
        description: 'Microscopic metallic slivers collected from the workshop lathe.',
        category: 'Forensic',
        location: 'Keller’s Sub-level Workshop',
        discovered: false,
        isKeyEvidence: true,
        details: 'Spectrometry matches the exact metallurgical alloy of the miniature spring-release trigger mounted inside the astrolabe needle.'
      },
      {
        id: 'clue_botanical_order',
        title: 'Aconite Extract Parcel Receipt',
        description: 'A shipping manifest from a German apothecary addressed to a postal box.',
        category: 'Document',
        location: 'Locksmith Tool Locker',
        discovered: false,
        isKeyEvidence: false,
        details: 'Signed for under Bruno Keller’s secondary trade name "B. Weber" for high-potency Aconitum napellus.'
      },
      {
        id: 'clue_vault_pneumatic_log',
        title: 'Vault Pressure Differential Record',
        description: 'A continuous barometric strip chart recording air pressure in Vault 7.',
        category: 'Forensic',
        location: 'Exterior Guard Station',
        discovered: false,
        isKeyEvidence: false,
        details: 'Proves the vault door was never opened between 11:00 PM and 6:00 AM, proving the mechanism was primed beforehand.'
      }
    ],
    crimeScenePoints: [
      {
        id: 'point_examination_table',
        name: 'The Antique Examination Table',
        description: 'Where the Voynich Astrolabe sits beside Professor Vane’s deceased body.',
        searched: false,
        clueId: 'clue_rigged_astrolabe',
        investigationNote: 'Vane’s right index finger shows a minute puncture wound corresponding to the brass dial position.'
      },
      {
        id: 'point_locksmith_bench',
        name: 'Bruno Keller’s Repair Bench',
        description: 'Search the horologist’s workbench filled with gear-cutting tools and magnifiers.',
        searched: false,
        clueId: 'clue_locksmith_lathe_shavings',
        investigationNote: 'Fresh metal shavings on the lathe match the hidden needle barrel.'
      },
      {
        id: 'point_tool_locker',
        name: 'The Basement Tool Locker',
        description: 'Inspect the personal lockers assigned to museum maintenance personnel.',
        searched: false,
        clueId: 'clue_botanical_order',
        investigationNote: 'Tucked inside a hollowed-out manual on clock escapements is an apothecary receipt for toxic wolfsbane.'
      },
      {
        id: 'point_pressure_panel',
        name: 'Vault Barometric Control Panel',
        description: 'Analyze the pneumatic charts showing vault pressure and door seal integrity.',
        searched: false,
        clueId: 'clue_vault_pneumatic_log',
        investigationNote: 'The air pressure remained steady all night—confirming that the killer did not enter after Vane locked himself in.'
      }
    ],
    hintsAvailable: 3,
    hintsUsed: 0,
    status: 'investigating',
    hints: [
      "The vault was truly locked from the inside with no secret tunnels or ventilation exits. Consider whether the killer even needed to be present in the room when the murder occurred.",
      "Inspect the victim's fingers and the Voynich Astrolabe. Was the ancient artifact modified with modern components?",
      "Who had the horological expertise and mechanical tools to construct a micro-needle mechanism triggered by turning a clock dial?"
    ],
    solution: {
      culpritId: 'bruno_keller',
      culpritName: 'Bruno Keller',
      weaponOrMethod: 'A spring-loaded micro-needle concealed inside the astrolabe dial, dipped in lethal aconite, primed to strike when turned to 1:15 AM',
      actualMotive: 'Bruno discovered the astrolabe’s true monetary value and wanted to claim the treasure coordinates himself after Vane was eliminated.',
      keyIncriminatingClue: 'The modified astrolabe micro-needle matching the lathe shavings and apothecary receipt found in Keller’s workshop',
      timeline: [
        { time: '4:00 PM', event: 'Keller services the astrolabe clockwork in his workshop, installing the poison trap.' },
        { time: '11:00 PM', event: 'Professor Vane takes the astrolabe into Vault 7 and deadbolts the pneumatic door from the inside.' },
        { time: '1:15 AM', event: 'Vane rotates the astronomical dial to align with the stellar calendar; the needle releases, injecting aconite into his thumb.' },
        { time: '1:18 AM', event: 'Vane collapses from rapid respiratory and cardiac paralysis.' },
        { time: '6:00 AM', event: 'Vault timers expire; guards discover Vane dead on the floor.' }
      ],
      confession: "He called it his discovery! I was the one who restored those corroded gears for six months! He was going to give it to a museum for a shiny medal while I lived on breadcrumbs in the basement. He didn't even notice the spring tension on the solar pointer until it was too late.",
      breakdown: "This was a classic locked-room setup executed via delayed booby-trap. Keller used his access as museum horologist to rig the astrolabe earlier that afternoon. When Vane adjusted the dial to test his solution, the spring injected the lethal dose."
    }
  }
};

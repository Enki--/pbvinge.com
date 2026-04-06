export type Confidence = 'High' | 'Medium' | 'Low';

export interface CourseConnection {
  title: string;
  relation: string;
  explanation: string;
}

export interface CourseStudyBook {
  canonicalTitle: string;
  noteTitle?: string;
  subtitle?: string;
  authors: string[];
  year: number | string;
  sourceConfidence: Confidence;
  notes: string;
  coverArt?: string;
  primarySourceUsed: string;
  notesFileReference: string;
  mainIdeas: string[];
  themes: string[];
  connectedBooks: CourseConnection[];
  confidence: Confidence;
}

export interface CourseStudyGuide {
  course: string;
  shortTitle: string;
  pageTitle: string;
  description: string;
  takeaways: string[];
  books: CourseStudyBook[];
}

export const courseStudyGuides: Record<string, CourseStudyGuide> = {
  '601': {
    course: 'SAASS 601',
    shortTitle: 'Foundations',
    pageTitle: 'SAASS 601 Comps Study Wall',
    description:
      'A cover-first review wall for SAASS 601 that keeps the books, core ideas, and conceptual links visible in one place.',
    takeaways: [
      'Strategy is an education in judgment, not a checklist.',
      'War is enduring, and its causes are multiple.',
      'Strategic choices are made under uncertainty by fallible humans and imperfect institutions.',
      'History is indispensable, but its lessons must be handled critically.',
      'Good strategy must align political purpose, moral restraint, and a plausible ending.',
    ],
    books: [
      {
        canonicalTitle: 'The Structure of Scientific Revolutions',
        authors: ['Thomas S. Kuhn'],
        year: 2012,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF is the 4th edition.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=3eP5Y_OOuzwC&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 1, pp. 16-17',
        mainIdeas: [
          'Knowledge advances through normal problem-solving until anomalies accumulate and trigger crisis.',
          'A paradigm defines legitimate questions, methods, and standards, constraining what practitioners can see and solve.',
          'Scientific revolutions replace one worldview with another that is partly incommensurable, after which textbooks retrospectively smooth the rupture.',
        ],
        themes: ['perception', 'uncertainty', 'organizational adaptation'],
        connectedBooks: [
          {
            title: 'Essence of Decision',
            relation: 'Shares framework',
            explanation:
              'The chosen analytic lens constrains which explanations and options appear valid.',
          },
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Extends',
            explanation:
              'Jervis provides a causal mechanism for how interpretive filters govern what leaders notice, discount, and misread.',
          },
          {
            title: 'Analogies at War',
            relation: 'Extends',
            explanation:
              'Khong shows how inherited frames structure judgment under uncertainty.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'Why War?',
        authors: ['Richard Overy'],
        year: 2024,
        sourceConfidence: 'High',
        notes: 'Matches the syllabus entry and PDF title matter.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=EDDXEAAAQBAJ&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 2, pp. 18-19',
        mainIdeas: [
          'War has no single cause; it emerges from layered biological, psychological, ecological, and historical drivers.',
          'Specific conflicts are most often propelled by the pursuit of resources, belief, power, and security, usually in combination.',
          'Because these motives are rooted in the human condition and the structure of political communities, war remains recurrent rather than aberrational.',
        ],
        themes: ['war causation', 'power politics', 'international system', 'uncertainty', 'security dilemma'],
        connectedBooks: [
          {
            title: 'The Landmark Thucydides',
            relation: 'Supports',
            explanation:
              'The narrative demonstrates how fear, power, and interest drive war.',
          },
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Extends',
            explanation:
              'Jervis provides the mechanism by which uncertainty and misread intentions turn competition into conflict.',
          },
          {
            title: 'Every War Must End',
            relation: 'Extends',
            explanation:
              'Overy explains why wars begin; Iklé explains why they persist and become hard to end.',
          },
          {
            title: 'Just and Unjust Wars',
            relation: 'Similar case, different conclusion',
            explanation:
              'Overy explains causation, while Walzer evaluates legitimacy and moral restraint.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Essence of Decision',
        subtitle: 'Explaining the Cuban Missile Crisis',
        authors: ['Graham T. Allison', 'Philip D. Zelikow'],
        year: 1999,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF is the 2nd edition.',
        coverArt:
          'https://books.google.com/books/content?id=9Kt7AAAAMAAJ&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 3, pp. 20-21',
        mainIdeas: [
          'Rational-actor explanations illuminate some state behavior but systematically miss how governments actually choose and implement policy.',
          'Organizational routines and standard operating procedures bound what officials can notice, propose, and execute in crisis.',
          'Outcomes are often political resultants of bargaining among actors and institutions with unequal power and divergent preferences.',
        ],
        themes: [
          'decision-making',
          'bounded rationality',
          'bureaucratic politics',
          'organizational behavior',
          'standard operating procedures',
        ],
        connectedBooks: [
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Extends',
            explanation:
              'Jervis adds cognitive mechanisms that shape how leaders interpret options inside Allison’s models.',
          },
          {
            title: 'Analogies at War',
            relation: 'Extends',
            explanation:
              'Khong specifies historical analogy as a bounded-rationality shortcut inside crisis decision-making.',
          },
          {
            title: 'When France Fell',
            relation: 'Supports',
            explanation:
              'The Vichy case demonstrates how rival bureaucracies and political agendas fragment coherent policy execution.',
          },
          {
            title: 'Every War Must End',
            relation: 'Supports',
            explanation:
              'Bargaining among institutions and actors obstructs settlement and termination choices.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Landmark Thucydides',
        subtitle: 'A Comprehensive Guide to the Peloponnesian War',
        authors: ['Thucydides', 'ed. Robert B. Strassler', 'trans. Richard Crawley'],
        year: 2008,
        sourceConfidence: 'Medium',
        notes:
          'Same book assigned across Days 4-5. Uploaded PDF notes a 2008 trade paperback edition of a work copyrighted 1996.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=pjt3ZGU61wIC&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 4, p. 22; Day 5, pp. 23-25',
        mainIdeas: [
          'The growth of Athenian power and Spartan fear made war structurally likely.',
          'Fear, honor, and interest recurrently drive state behavior and justify harsh choices.',
          'Imperial overreach, factional conflict, and alliance entanglement can convert strategic advantage into ruin.',
        ],
        themes: ['power politics', 'balance of power', 'alliance politics', 'grand strategy', 'escalation'],
        connectedBooks: [
          {
            title: 'Why War?',
            relation: 'Supports',
            explanation:
              'Thucydides supplies a canonical case of fear, power, and interest driving war.',
          },
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Extends',
            explanation:
              'Jervis provides a mechanism for how threat interpretation and spiral dynamics intensify rivalry.',
          },
          {
            title: 'Just and Unjust Wars',
            relation: 'Challenges',
            explanation:
              'Melian necessity collides with Walzer’s insistence that power does not erase rights.',
          },
          {
            title: 'Analogies at War',
            relation: 'Extends',
            explanation:
              'Thucydides functions as a reusable strategic analogy for later policymakers.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'Just and Unjust Wars',
        subtitle: 'A Moral Argument with Historical Illustrations',
        authors: ['Michael Walzer'],
        year: 2015,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF is the 5th edition.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=EuTQCQAAQBAJ&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 6, p. 26',
        mainIdeas: [
          'Aggression is the supreme crime of war because it violates the rights of political communities.',
          'Just cause does not erase restraints on means; noncombatant immunity and proportionality remain binding.',
          'Supreme emergency may explain rule-breaking but does not cancel moral responsibility for it.',
        ],
        themes: ['ethics', 'just war theory', 'legitimacy', 'escalation'],
        connectedBooks: [
          {
            title: 'The Landmark Thucydides',
            relation: 'Challenges',
            explanation:
              'Melian necessity and imperial logic directly contest Walzer’s claim that power does not erase rights.',
          },
          {
            title: 'Every War Must End',
            relation: 'Shares framework',
            explanation:
              'Both subordinate military action to political purpose and reject fighting detached from ends.',
          },
          {
            title: 'Why War?',
            relation: 'Similar case, different conclusion',
            explanation:
              'Overy explains recurring causes of war; Walzer evaluates the legitimacy and limits of using force.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'Analogies at War',
        subtitle: 'Korea, Munich, Dien Bien Phu, and the Vietnam Decisions of 1965',
        authors: ['Yuen Foong Khong'],
        year: 1992,
        sourceConfidence: 'High',
        notes: 'Full subtitle verified from title page.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=0irZ8O6jJt4C&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 7, pp. 27-28',
        mainIdeas: [
          'Leaders use historical analogies to diagnose situations, define stakes, and evaluate options under uncertainty.',
          'Analogies shape choice by supplying causal expectations, prescriptions, and moral judgments rather than serving as post hoc rhetoric.',
          'In 1965 Vietnam, Korea and Munich drove Johnson advisers toward intervention while Dien Bien Phu pulled toward caution.',
        ],
        themes: [
          'historical analogy',
          'decision-making',
          'perception',
          'cognitive bias',
          'uncertainty',
          'escalation',
        ],
        connectedBooks: [
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Supports',
            explanation:
              'Jervis provides the cognitive-bias mechanism through which analogies shape threat perception.',
          },
          {
            title: 'Essence of Decision',
            relation: 'Extends',
            explanation:
              'Khong specifies one bounded-rationality shortcut inside broader crisis decision processes.',
          },
          {
            title: 'The Landmark Thucydides',
            relation: 'Extends',
            explanation:
              'Classical cases become reusable templates that later leaders map onto new crises.',
          },
          {
            title: 'When France Fell',
            relation: 'Supports',
            explanation:
              'U.S. judgments about Vichy were filtered through historical analogies that shaped policy choice.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Perception and Misperception in International Politics',
        authors: ['Robert Jervis'],
        year: 2017,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF is the new paperback edition with a new preface.',
        coverArt:
          'https://books.google.com/books/content?id=nQUVvgAACAAJ&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 8, pp. 29-30',
        mainIdeas: [
          'International outcomes depend on how leaders interpret ambiguous signals, not only on material conditions.',
          'Cognitive bias and consistency pressures distort judgments of intentions, causation, and evidence.',
          'When states misread security-seeking behavior as aggression, the security dilemma and spiral dynamics can drive conflict and policy failure.',
        ],
        themes: [
          'perception',
          'misperception',
          'cognitive bias',
          'security dilemma',
          'deterrence',
          'uncertainty',
        ],
        connectedBooks: [
          {
            title: 'Analogies at War',
            relation: 'Supports',
            explanation:
              'Historical analogy is one recurring source of biased perception under uncertainty.',
          },
          {
            title: 'Essence of Decision',
            relation: 'Extends',
            explanation:
              'Psychological distortions complement organizational and bureaucratic explanations of policy choice.',
          },
          {
            title: 'Why War?',
            relation: 'Supports',
            explanation:
              'Insecurity and distrust become concrete pathways from competition to war.',
          },
          {
            title: 'When France Fell',
            relation: 'Supports',
            explanation:
              'Ambiguity and threat inflation distorted U.S. reading of Vichy and French actors.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'When France Fell',
        subtitle: 'The Vichy Crisis and the Fate of the Anglo-American Alliance',
        authors: ['Michael S. Neiberg'],
        year: 2021,
        sourceConfidence: 'Medium',
        notes:
          'Book identity is clear, but the syllabus lists 2023 while the uploaded PDF is a 2021 Harvard edition.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=4_M5EAAAQBAJ&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 9, pp. 31-32',
        mainIdeas: [
          'France’s collapse forced U.S. leaders to rethink American security and pushed the United States toward rearmament and wider global engagement.',
          'U.S. policy toward Vichy privileged short-term access and influence over legitimacy, creating durable strategic and moral costs.',
          'The Vichy crisis deepened Anglo-American and intra-French frictions because judgments about Pétain, de Gaulle, and Darlan were made through fear, ambiguity, and competing political agendas.',
        ],
        themes: [
          'grand strategy',
          'alliance politics',
          'legitimacy',
          'decision-making',
          'misperception',
          'historical analogy',
        ],
        connectedBooks: [
          {
            title: 'Essence of Decision',
            relation: 'Supports',
            explanation:
              'Competing institutions and bureaucratic interests fragmented U.S. policy toward Vichy.',
          },
          {
            title: 'Perception and Misperception in International Politics',
            relation: 'Supports',
            explanation:
              'Fear and ambiguity distorted U.S. assessment of Vichy intentions and risks.',
          },
          {
            title: 'Analogies at War',
            relation: 'Supports',
            explanation:
              'Historical analogies structured how U.S. officials interpreted Pétain, de Gaulle, and the likely consequences of action.',
          },
          {
            title: 'Just and Unjust Wars',
            relation: 'Similar case, different conclusion',
            explanation:
              'Neiberg narrates the collision between expediency and legitimacy, while Walzer supplies criteria for judging it.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Every War Must End',
        authors: ['Fred Charles Iklé'],
        year: 1971,
        sourceConfidence: 'Medium',
        notes:
          'Book identity is clear, but the syllabus specifies the 2005 second revised edition while the uploaded PDF is the 1971 original Columbia edition.',
        coverArt:
          'https://books.google.com/books/content?edge=curl&id=H1F_X_3gV-gC&img=1&printsec=frontcover&source=gbs_api&zoom=1',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes, Day 10, pp. 33-34',
        mainIdeas: [
          'Governments often decide how to fight without deciding how the war can end.',
          'As wars continue, political purposes shift and means can become detached from the ends that justified intervention.',
          'Termination is hard because military estimates are foggy, domestic coalitions resist compromise, and escalation creates new barriers to settlement.',
        ],
        themes: ['war termination', 'decision-making', 'misperception', 'escalation', 'uncertainty'],
        connectedBooks: [
          {
            title: 'Why War?',
            relation: 'Extends',
            explanation:
              'Overy explains onset; Iklé explains why wars outlive their initial causes and become hard to end.',
          },
          {
            title: 'Essence of Decision',
            relation: 'Supports',
            explanation:
              'Bargaining among institutions and actors constrains settlement and termination choices.',
          },
          {
            title: 'Just and Unjust Wars',
            relation: 'Shares framework',
            explanation:
              'Both insist that force remain tied to political purpose rather than self-perpetuating means.',
          },
          {
            title: 'The Landmark Thucydides',
            relation: 'Similar case, different conclusion',
            explanation:
              'Athens demonstrates how prestige and overreach can trap states in wars they cannot end on favorable terms.',
          },
        ],
        confidence: 'Medium',
      },
    ],
  },
  '600': {
    course: 'SAASS 600',
    shortTitle: 'Strategic Theory',
    pageTitle: 'SAASS 600 Comps Study Wall',
    description:
      'A cover-first review wall for SAASS 600 built around the course classics, their core arguments, and the debates that connect them.',
    takeaways: [
      'Strategy is a contest among rival theories, not a settled checklist.',
      'Political purpose must govern how force is organized, employed, and restrained.',
      'Indirect shaping, control of communications, and control of escalation often matter more than destruction alone.',
      'Single-domain theories explain something important, but never the whole of strategy.',
      'Theory matters when it educates judgment across history, technology, institutions, and uncertainty.',
    ],
    books: [
      {
        canonicalTitle: 'The Seven Military Classics of Ancient China',
        noteTitle: 'The Seven Military Classics Of Ancient China',
        subtitle: "[Wu ching ch'i shu]",
        authors: ['Ralph D. Sawyer', 'Mei-chun Sawyer'],
        year: 2007,
        sourceConfidence: 'High',
        notes:
          'Official syllabus book; uploaded PDF is a different edition (1993 Westview). Analytical columns synthesize the seven-text volume.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 44 (internal p. 37)',
        mainIdeas: [
          'Strategic advantage is created before battle through calculation, deception, and manipulation of conditions.',
          'Commanders win by concentrating force against weakness while preserving flexibility in formation and timing.',
          'Military success depends on political order because disciplined rule, administration, and a unified populace generate fighting power.',
        ],
        themes: ['strategy', 'grand strategy', 'decision-making', 'indirect approach', 'uncertainty'],
        connectedBooks: [
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy reformulates pre-battle shaping and dislocation as a modern theory of the indirect method.',
          },
          {
            title: 'The Science of Military Strategy',
            relation: 'Extends',
            explanation:
              'The Science of Military Strategy carries Chinese premises on initiative, deception, and shaping into contemporary doctrine.',
          },
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War insists reciprocal will and friction limit hopes of one-sided control.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'The Book of Deeds of Arms and of Chivalry',
        noteTitle: 'Book of Deeds of Arms and of Chivalry',
        authors: ['Christine de Pizan', 'ed. Charity Cannon Willard', 'trans. Sumner Willard'],
        year: 1999,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; title/credits verified in uploaded text.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 45 (internal p. 38)',
        mainIdeas: [
          'War is lawful only when authorized by rightful sovereign for defense, justice, or aid.',
          'Commanders must wage war with prudence, discipline, and clear political purpose rather than vengeance or plunder.',
          'Violence must remain bounded by law and chivalric obligation so that war restores order rather than destroying it.',
        ],
        themes: ['ethics', 'just war theory', 'legitimacy', 'strategy', 'decision-making'],
        connectedBooks: [
          {
            title: 'Strategy Before Clausewitz',
            relation: 'Extends',
            explanation:
              'Strategy Before Clausewitz reclassifies de Pizan as a strategist linking warfare and statecraft.',
          },
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War analyzes war as policy while suspending the legal-moral restrictions de Pizan treats as binding.',
          },
          {
            title: 'The Evolution of Strategy',
            relation: 'Supports',
            explanation:
              'The Evolution of Strategy places de Pizan inside a durable tradition of limited and restrained warfare.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'On War',
        authors: ['Carl von Clausewitz', 'ed. and trans. Michael Howard and Peter Paret'],
        year: 1984,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; indexed Princeton edition verified.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF pp. 47-48 (internal pp. 40-41)',
        mainIdeas: [
          'War is an instrument of policy, so political purpose determines the scale and object of force.',
          'Real war is shaped by chance, friction, and uncertainty, which defeat mechanical theories and fixed systems.',
          'Theory should educate judgment by relating violence, chance, and policy, not prescribe universal formulas.',
        ],
        themes: ['strategy', 'grand strategy', 'uncertainty', 'friction', 'operational art'],
        connectedBooks: [
          {
            title: 'The Strategy Bridge',
            relation: 'Supports',
            explanation:
              'The Strategy Bridge builds directly on Clausewitz’s claim that strategy must connect policy to action under uncertainty.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy also seeks a general theory, but recasts control rather than destruction as the practical object.',
          },
          {
            title: 'The Art of War',
            relation: 'Challenges',
            explanation:
              'The Art of War tries to codify strategy into durable operational rules that Clausewitz treats with suspicion.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Supports',
            explanation:
              'The Makers of Modern Strategy supplies the course’s principal interpretive essays on Clausewitz and Napoleon.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Art of War',
        authors: ['Antoine-Henri Jomini'],
        year: 2007,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF is an older English translation edition.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 51 (internal p. 44)',
        mainIdeas: [
          'War can be systematized through durable principles derived from historical campaigns.',
          'Campaign success comes from concentrating superior force on decisive points through interior lines and controlled lines of operation.',
          'Strategy is a distinct art of movement and positioning that links political purpose to battlefield decision.',
        ],
        themes: ['strategy', 'operational art', 'landpower', 'historical analogy'],
        connectedBooks: [
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War rejects Jomini’s confidence that universal rules can master war.',
          },
          {
            title: 'Roots of Strategy, Book 2',
            relation: 'Supports',
            explanation:
              'Roots of Strategy, Book 2 explicitly defends Jomini’s continuing utility for strategic education.',
          },
          {
            title: 'The Foundations of the Science of War',
            relation: 'Shares framework',
            explanation:
              'The Foundations of the Science of War likewise tries to derive systematic principles from military history.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Supports',
            explanation:
              'The Makers of Modern Strategy contextualizes Jomini as a continuing rival to Clausewitz rather than a discarded foil.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Mahan on Naval Strategy',
        subtitle: 'Selections from the Writings of Rear Admiral Alfred Thayer Mahan',
        authors: ['Alfred Thayer Mahan', 'intro./ed. John B. Hattendorf'],
        year: 2015,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF confirms full subtitle and editor.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 57 (internal p. 50)',
        mainIdeas: [
          'National greatness rests on sea power, which converts commerce, fleets, and bases into geopolitical influence.',
          'Command of the sea requires concentrated offensive fleets rather than dispersed local defense.',
          'Historical comparison reveals durable strategic principles despite changing technology.',
        ],
        themes: ['seapower', 'grand strategy', 'power politics', 'international system', 'historical analogy'],
        connectedBooks: [
          {
            title: 'Some Principles of Maritime Strategy',
            relation: 'Challenges',
            explanation:
              'Some Principles of Maritime Strategy shifts the decisive problem from fleet battle to control of communications and limited war.',
          },
          {
            title: 'The Sea Power of the State',
            relation: 'Extends',
            explanation:
              'The Sea Power of the State broadens Mahan’s sea power into a whole national maritime system.',
          },
          {
            title: 'The Command of the Air',
            relation: 'Similar case, different conclusion',
            explanation:
              'The Command of the Air transfers the logic of domain command to airpower and predicts independent decision from that domain.',
          },
          {
            title: 'The New Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The New Makers of Modern Strategy updates Mahan by placing him inside later debates about great-power rivalry and sea power.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Some Principles of Maritime Strategy',
        authors: ['Julian S. Corbett'],
        year: 2004,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; original-publication year conflicts across course materials.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 59 (internal p. 52)',
        mainIdeas: [
          'Maritime strategy is subordinate to political purpose and broader war aims, so navies cannot be understood apart from land operations.',
          'Control of maritime communications, not fleet destruction alone, is the central strategic problem at sea.',
          'Seapower enables limited and coercive strategies by regulating movement, access, and pressure rather than seeking decision only through battle.',
        ],
        themes: ['seapower', 'grand strategy', 'coercion', 'landpower', 'indirect approach'],
        connectedBooks: [
          {
            title: 'Mahan on Naval Strategy',
            relation: 'Challenges',
            explanation:
              'Mahan on Naval Strategy overweights decisive battle compared with Corbett’s emphasis on communications and political object.',
          },
          {
            title: 'On War',
            relation: 'Supports',
            explanation:
              'On War grounds Corbett’s claim that policy determines the use of naval force.',
          },
          {
            title: 'Air Power and Armies',
            relation: 'Shares framework',
            explanation:
              'Air Power and Armies also attacks communications to shape the campaign indirectly.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy makes Corbett’s control of passage and communications intelligible as a general logic of control.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Command of the Air',
        noteTitle: 'Command Of The Air',
        authors: ['Giulio Douhet', 'trans. Dino Ferrari'],
        year: 2021,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF is a different reprint edition.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 61 (internal p. 54)',
        mainIdeas: [
          'Airpower changes the character of war by opening direct attack on the enemy state and population.',
          'Command of the air is the decisive precondition because only the force that destroys enemy air capability can operate freely.',
          'Massed bombing against vital centers and morale will compel rapid political collapse and end the war.',
        ],
        themes: ['airpower', 'coercion', 'compellence', 'technological change', 'war termination'],
        connectedBooks: [
          {
            title: 'Air Power and Armies',
            relation: 'Challenges',
            explanation:
              'Air Power and Armies denies that airpower should seek decision independently of land operations.',
          },
          {
            title: 'Mahan on Naval Strategy',
            relation: 'Similar case, different conclusion',
            explanation:
              'Mahan on Naval Strategy also makes command of a domain central, but relies on fleet concentration and sea control rather than direct coercion of civilians.',
          },
          {
            title: 'Military Strategy',
            relation: 'Challenges',
            explanation:
              'Military Strategy treats Douhet as a single-domain theory that cannot stand as a universal account of strategy.',
          },
          {
            title: 'Makers of Modern Strategy',
            relation: 'Supports',
            explanation:
              'Makers of Modern Strategy frames Douhet as the founding statement of independent-airpower theory and tests its claims against later experience.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Air Power and Armies',
        authors: ['J. C. Slessor'],
        year: 2009,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF confirms original 1936 publication.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 63 (internal p. 56)',
        mainIdeas: [
          'Airpower yields greatest strategic value when it isolates enemy land forces by striking transport, supply, and communications.',
          'Air superiority is necessary, but its purpose is to enable joint campaigns rather than independent decision from the air alone.',
          'Concentrated air attack at decisive points multiplies landpower instead of replacing it.',
        ],
        themes: ['airpower', 'landpower', 'operational art', 'indirect approach', 'military innovation'],
        connectedBooks: [
          {
            title: 'The Command of the Air',
            relation: 'Challenges',
            explanation:
              'The Command of the Air treats airpower as independently decisive, whereas Slessor assigns it a complementary role inside land campaigns.',
          },
          {
            title: 'Some Principles of Maritime Strategy',
            relation: 'Shares framework',
            explanation:
              'Some Principles of Maritime Strategy also attacks communications to shape the campaign indirectly.',
          },
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy supplies the logic of dislocation that Slessor applies through air interdiction.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy classifies Slessor’s approach as one specific but durable way to impose control.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Strategy',
        authors: ['B. H. Liddell Hart'],
        year: 1991,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF confirms 2nd revised edition / 1991 reprint.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 65 (internal p. 58)',
        mainIdeas: [
          'Direct attack strengthens enemy resistance, so strategic success comes from upsetting the enemy’s balance through an indirect approach.',
          'Psychological dislocation of the enemy command is more decisive than physical destruction alone.',
          'Grand strategy must coordinate military and nonmilitary instruments so tactical success does not undermine political advantage.',
        ],
        themes: ['strategy', 'grand strategy', 'indirect approach', 'perception', 'decision-making'],
        connectedBooks: [
          {
            title: 'The Seven Military Classics of Ancient China',
            relation: 'Supports',
            explanation:
              'The Seven Military Classics of Ancient China anticipates the claim that strategic advantage should be created before battle.',
          },
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War doubts that indirect method can reliably escape friction and violent reciprocity.',
          },
          {
            title: 'Military Strategy',
            relation: 'Supports',
            explanation:
              'Military Strategy treats the indirect approach as the closest existing approximation to a general theory.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The Makers of Modern Strategy situates Liddell Hart’s doctrine of limited liability and mobile defense inside twentieth-century debate.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Foundations of the Science of War',
        authors: ['J. F. C. Fuller'],
        year: 1926,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF verifies title and author.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 67 (internal p. 60)',
        mainIdeas: [
          'War can be studied scientifically through recurring relationships among force, space, time, and morale.',
          'Military effectiveness depends on integrating moral and physical factors within a coherent set of strategic principles.',
          'Scientific method, training, and technology can reduce friction and improve economy of force.',
        ],
        themes: ['strategy', 'operational art', 'friction', 'military innovation', 'technological change'],
        connectedBooks: [
          {
            title: 'The Art of War',
            relation: 'Shares framework',
            explanation:
              'The Art of War likewise seeks teachable principles derived from historical campaigns.',
          },
          {
            title: 'On War',
            relation: 'Extends',
            explanation:
              'On War supplies the political and psychological depth Fuller tries to render more systematic.',
          },
          {
            title: 'Military Strategy',
            relation: 'Extends',
            explanation:
              'Military Strategy carries Fuller’s search for a general theory further by making control the central strategic concept.',
          },
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy also distills historical experience into portable strategic logic, though with more emphasis on indirection than science.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Military Strategy',
        subtitle: 'A General Theory of Power Control',
        authors: ['J. C. Wylie'],
        year: 1989,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; syllabus gives the full title.',
        primarySourceUsed: 'Syllabus',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 69 (internal p. 62)',
        mainIdeas: [
          'Existing single-domain theories capture only part of strategy, so a general theory must explain all forms of warfare.',
          'The practical object of strategy is control over the enemy, not destruction for its own sake.',
          'Sequential and cumulative methods are distinct but combinable ways to impose control across domains.',
        ],
        themes: ['strategy', 'grand strategy', 'uncertainty', 'coercion', 'indirect approach'],
        connectedBooks: [
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War explains war’s nature but does not itself provide the cross-domain general theory Wylie wanted.',
          },
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy offers an indirect logic that Wylie judges closest to general strategic truth.',
          },
          {
            title: 'The Strategy Bridge',
            relation: 'Shares framework',
            explanation:
              'The Strategy Bridge also pursues a general theory that links purpose to action under uncertainty.',
          },
          {
            title: 'Some Principles of Maritime Strategy',
            relation: 'Extends',
            explanation:
              'Some Principles of Maritime Strategy becomes, in Wylie’s terms, a communications-based theory of control rather than a standalone naval doctrine.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Strategy Bridge',
        subtitle: 'Theory for Practice',
        authors: ['Colin S. Gray'],
        year: 2011,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF states first publication in 2010.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 71 (internal p. 64)',
        mainIdeas: [
          'Strategy is a universal bridge that connects political purpose to tactical action.',
          'Enduring theory remains usable only when interpreted through historical context, institutions, and the adversary.',
          'Strategic performance is constrained by uncertainty and human limitation, so theory guides judgment rather than guaranteeing success.',
        ],
        themes: ['strategy', 'grand strategy', 'uncertainty', 'friction', 'decision-making'],
        connectedBooks: [
          {
            title: 'On War',
            relation: 'Supports',
            explanation:
              'On War anchors Gray’s claim that strategy must bridge political purpose and military action.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy also seeks a general theory above single-domain doctrine.',
          },
          {
            title: 'The Evolution of Strategy',
            relation: 'Supports',
            explanation:
              'The Evolution of Strategy supplies the historical range Gray uses to test his dicta.',
          },
          {
            title: 'The Science of Military Strategy',
            relation: 'Similar case, different conclusion',
            explanation:
              'The Science of Military Strategy also links theory to practice, but as state doctrine rather than a universal theory of strategy.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Sea Power of the State',
        authors: ['S. G. Gorshkov'],
        year: '1976 / 1980',
        sourceConfidence: 'High',
        notes: 'Printed-reader work; seminar intro cites 1976, uploaded translation is 1980.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 73 (internal p. 66)',
        mainIdeas: [
          'Sea power is an integrated national system combining navy, merchant marine, fishing fleet, science, and maritime infrastructure.',
          'Modern navies are instruments of state policy, strategic deterrence, and global influence, not mere fleet battle forces.',
          'Control and use of the world ocean reshape power politics, economic development, and maritime law.',
        ],
        themes: ['seapower', 'grand strategy', 'deterrence', 'power politics', 'international system'],
        connectedBooks: [
          {
            title: 'Mahan on Naval Strategy',
            relation: 'Extends',
            explanation:
              'Mahan on Naval Strategy links sea power to national power, but Gorshkov expands that logic to merchant, fishing, scientific, and legal instruments.',
          },
          {
            title: 'Some Principles of Maritime Strategy',
            relation: 'Challenges',
            explanation:
              'Some Principles of Maritime Strategy is more restrained about what navies can decide and how maritime power serves policy.',
          },
          {
            title: 'The Science of Military Strategy',
            relation: 'Supports',
            explanation:
              'The Science of Military Strategy likewise integrates force development, state aims, and multi-domain competition.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy clarifies Gorshkov’s maritime leverage as a form of strategic control.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Science of Military Strategy',
        noteTitle: 'The Science of Military Strategy 20',
        authors: [
          'Xiao Tianliang (editor-in-chief)',
          'Lou Yaoliang',
          'Kang Wuchao',
          'Cai Renzhao',
        ],
        year: '2020 / 2022',
        sourceConfidence: 'High',
        notes:
          'Printed-reader work; uploaded text is a 2022 translation of the 2020 revised Chinese edition.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 75 (internal p. 68)',
        mainIdeas: [
          'Strategy encompasses both the employment of force and the long-term construction of military capability.',
          'Active defense and deterrence require integrated control of crises, escalation, and war across multiple domains.',
          'Informationized and intelligent warfare demand multi-domain integrated joint operations backed by networked command systems.',
        ],
        themes: ['strategy', 'grand strategy', 'deterrence', 'escalation', 'cyber power', 'information warfare'],
        connectedBooks: [
          {
            title: 'The Strategy Bridge',
            relation: 'Similar case, different conclusion',
            explanation:
              'The Strategy Bridge also connects theory to practice, but Gray argues from universal theory while Xiao argues from Chinese state doctrine.',
          },
          {
            title: 'Military Strategy',
            relation: 'Shares framework',
            explanation:
              'Military Strategy likewise seeks a top-level theory that integrates multiple domains and methods.',
          },
          {
            title: 'The Sea Power of the State',
            relation: 'Supports',
            explanation:
              'The Sea Power of the State anticipates Xiao’s fusion of force development, state power, and strategic competition.',
          },
          {
            title: 'The Seven Military Classics of Ancient China',
            relation: 'Extends',
            explanation:
              'The Seven Military Classics of Ancient China supplies a longer Chinese inheritance of calculation, initiative, and shaping the enemy before battle.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Evolution of Strategy',
        subtitle: 'Thinking War from Antiquity to the Present',
        authors: ['Beatrice Heuser'],
        year: 2010,
        sourceConfidence: 'High',
        notes: 'Official syllabus book; uploaded PDF verifies title/subtitle/author.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 45 (internal p. 38, background mention)',
        mainIdeas: [
          'Strategic thought evolves through recurring debates rather than a linear march toward decisive battle.',
          'Changes in technology, political organization, and social structure reshape how states connect force to policy.',
          'Comparative history reveals enduring alternatives such as annihilation, attrition, limitation, and indirection within the practice of strategy.',
        ],
        themes: ['historical analogy', 'strategy', 'grand strategy', 'technological change', 'friction', 'indirect approach'],
        connectedBooks: [
          {
            title: 'On War',
            relation: 'Extends',
            explanation:
              'On War appears as one powerful answer within Heuser’s larger historical comparison of strategic traditions.',
          },
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy exemplifies the recurring appeal of indirection and dislocation that Heuser traces across eras.',
          },
          {
            title: 'The Seven Military Classics of Ancient China',
            relation: 'Similar case, different conclusion',
            explanation:
              'The Seven Military Classics of Ancient China shows that non-Western strategy reached durable insights by a different path.',
          },
          {
            title: 'The Strategy Bridge',
            relation: 'Supports',
            explanation:
              'The Strategy Bridge depends on the historical breadth that Heuser assembles.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Makers of Modern Strategy',
        subtitle: 'From Machiavelli to the Nuclear Age',
        authors: ['Peter Paret, ed.', 'Gordon A. Craig', 'Felix Gilbert'],
        year: 1986,
        sourceConfidence: 'High',
        notes:
          'Official syllabus book; uploaded PDF confirms fuller credit line. Analytical columns are scoped to the assigned Paret, Shy, and Bond/Alexander chapters used in the course.',
        coverArt:
          'https://books.google.com/books/content?id=IunBwgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 49 (internal p. 42)',
        mainIdeas: [
          'The assigned chapters explain Clausewitz, Napoleon, Jomini, and Liddell Hart as historically specific responses to changing war and politics.',
          'The volume shows strategic theory emerging from the interaction of political purpose, operational practice, and military institutions.',
          'It teaches comparison as the method for judging rival theories of annihilation, limited liability, maneuver, and policy control.',
        ],
        themes: ['historical analogy', 'strategy', 'grand strategy', 'operational art', 'decision-making'],
        connectedBooks: [
          {
            title: 'On War',
            relation: 'Supports',
            explanation:
              'On War receives its most important course-side interpretation through Paret’s assigned chapters.',
          },
          {
            title: 'The Art of War',
            relation: 'Supports',
            explanation:
              'The Art of War is contextualized through Shy’s reassessment of Jomini.',
          },
          {
            title: 'Strategy',
            relation: 'Supports',
            explanation:
              'Strategy is framed through Bond and Alexander’s discussion of limited liability and mobile defense.',
          },
          {
            title: 'The New Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The New Makers of Modern Strategy updates the same anthology model with later scholarship and contemporary concerns.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Strategy Before Clausewitz',
        subtitle: 'Linking Warfare and Statecraft, 1400-1830',
        authors: ['Beatrice Heuser'],
        year: 2018,
        sourceConfidence: 'Medium',
        notes:
          'Clearly used: the syllabus assigns Heuser’s chapter "Christine de Pizan, the First Modern Strategist" from this book. Analytical columns are scoped to that assigned chapter, not the full book.',
        coverArt:
          'https://books.google.com/books/content?id=ZrOLnQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        primarySourceUsed: 'Syllabus',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 45 (internal p. 38, background mention)',
        mainIdeas: [
          'Strategic thought linked warfare and statecraft well before Clausewitz formalized that relationship.',
          'Heuser argues Christine de Pizan should be read as a strategist, not merely as a moral commentator on war.',
          'Early modern strategic writing fused ethics, law, and military counsel rather than separating them into distinct literatures.',
        ],
        themes: ['historical analogy', 'strategy', 'grand strategy', 'ethics', 'legitimacy', 'just war theory'],
        connectedBooks: [
          {
            title: 'The Book of Deeds of Arms and of Chivalry',
            relation: 'Extends',
            explanation:
              'The Book of Deeds of Arms and of Chivalry becomes, in Heuser’s reading, a strategic text rather than merely a chivalric manual.',
          },
          {
            title: 'The Evolution of Strategy',
            relation: 'Supports',
            explanation:
              'The Evolution of Strategy reinforces the claim that serious strategic thought predates Clausewitz.',
          },
          {
            title: 'On War',
            relation: 'Similar case, different conclusion',
            explanation:
              'On War later systematizes the relationship between war and politics in a more analytical and less moral vocabulary.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'Roots of Strategy, Book 2',
        subtitle: '3 Military Classics',
        authors: [
          'Contains works by Ardant du Picq',
          'Carl von Clausewitz',
          'Antoine-Henri Jomini',
        ],
        year: 1987,
        sourceConfidence: 'High',
        notes:
          'Clearly used: the syllabus assigns Hittle’s introduction to Jomini from this volume. Analytical columns are scoped to that assigned introduction, not the full volume.',
        coverArt:
          'https://books.google.com/books/content?id=H_sZFmdEMEEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf PDF p. 53 (internal p. 46)',
        mainIdeas: [
          'Hittle argues Jomini remains indispensable because he makes campaign design and Napoleonic warfare analytically legible.',
          'Jomini complements rather than simply contradicts Clausewitz by clarifying decisive points, lines, and concentration.',
          'Professional military education benefits from reading the classics comparatively rather than treating any single theorist as sufficient.',
        ],
        themes: ['historical analogy', 'strategy', 'operational art', 'landpower'],
        connectedBooks: [
          {
            title: 'The Art of War',
            relation: 'Supports',
            explanation:
              'The Art of War receives its immediate course-side defense from Hittle’s introduction.',
          },
          {
            title: 'On War',
            relation: 'Challenges',
            explanation:
              'On War’s prestige is counterbalanced by the volume’s insistence that Jomini still teaches indispensable campaign logic.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The Makers of Modern Strategy revisits the same Clausewitz-Jomini debate with later scholarship.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'The New Makers of Modern Strategy',
        subtitle: 'From the Ancient World to the Digital Age',
        authors: ['Hal Brands, ed.'],
        year: 2023,
        sourceConfidence: 'High',
        notes:
          'Clearly used: the syllabus assigns John H. Maurer’s chapter on Mahan from this volume. Analytical columns are scoped to that assigned chapter, not the full anthology.',
        primarySourceUsed: 'PDF',
        notesFileReference: '-',
        mainIdeas: [
          'Maurer presents Mahan as a theorist of great-power rivalry in an international system shaped by maritime competition.',
          'He argues sea power rests on the interaction of naval force, commerce, access to resources, and political purpose.',
          'The chapter updates Mahan by using historical analysis to connect nineteenth-century sea power to contemporary strategic competition.',
        ],
        themes: ['historical analogy', 'strategy', 'grand strategy', 'seapower', 'international system'],
        connectedBooks: [
          {
            title: 'Mahan on Naval Strategy',
            relation: 'Supports',
            explanation:
              'Mahan on Naval Strategy supplies the primary text Maurer interprets and updates.',
          },
          {
            title: 'Some Principles of Maritime Strategy',
            relation: 'Challenges',
            explanation:
              'Some Principles of Maritime Strategy shifts the maritime debate away from Mahan’s strongest emphasis on sea power and command.',
          },
          {
            title: 'The Sea Power of the State',
            relation: 'Extends',
            explanation:
              'The Sea Power of the State broadens maritime power into a whole national system in a way Maurer helps contextualize.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The Makers of Modern Strategy is the earlier anthology tradition that this newer volume consciously updates.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Makers of Modern Strategy',
        subtitle: 'Military Thought from Machiavelli to Hitler',
        authors: ['Edward Mead Earle, ed.'],
        year: 1943,
        sourceConfidence: 'Medium',
        notes:
          'Clearly used: the syllabus assigns Edward Warner’s chapter on Douhet, Mitchell, and Seversky from this volume. Analytical columns are scoped to that assigned chapter, not the full anthology.',
        coverArt:
          'https://books.google.com/books/content?id=CXUMAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        primarySourceUsed: 'Syllabus',
        notesFileReference: '-',
        mainIdeas: [
          'Warner treats Douhet, Mitchell, and Seversky as a distinct interwar tradition arguing that airpower can bypass armies and strike decisive targets directly.',
          'The chapter shows command of the air and strategic bombing becoming the organizing concepts of that tradition.',
          'It demonstrates how technological optimism and extrapolation from new capabilities shaped airpower theory.',
        ],
        themes: ['historical analogy', 'strategy', 'grand strategy', 'airpower', 'technological change'],
        connectedBooks: [
          {
            title: 'The Command of the Air',
            relation: 'Supports',
            explanation:
              'The Command of the Air is the core text in the tradition Warner reconstructs.',
          },
          {
            title: 'Air Power and Armies',
            relation: 'Challenges',
            explanation:
              'Air Power and Armies offers the contrary claim that airpower serves strategy best when integrated with land campaigns.',
          },
          {
            title: 'The Makers of Modern Strategy',
            relation: 'Extends',
            explanation:
              'The Makers of Modern Strategy revises and enlarges the original anthology framework after World War II and the nuclear age.',
          },
        ],
        confidence: 'High',
      },
    ],
  },
};

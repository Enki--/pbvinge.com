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
      'War and strategy have to be understood at the level of first principles.',
      'War is always tied to politics, so strategy is about purpose before method.',
      'No single theorist is sufficient; good strategists learn by comparing rival theories.',
      'New domains and new technologies change warfare, but they do not erase enduring strategic problems.',
      'The end state of the course is your own evidence-based theory of war.',
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
  '632': {
    course: 'SAASS 632',
    shortTitle: 'World Order',
    pageTitle: 'SAASS 632 Comps Study Wall',
    description:
      'A cover-first review wall for SAASS 632 focused on order, legitimacy, systemic change, and the strategic tools that shape world politics short of war.',
    takeaways: [
      'This is a strategist’s course, not a paradigms course.',
      'Power is the baseline reality of international politics, but power is broader than force.',
      'International order is not natural or permanent; it is made, contested, and remade.',
      'Capabilities alone do not explain outcomes; perception, legitimacy, and narrative matter.',
      'The practical takeaway is applied statecraft.',
    ],
    books: [
      {
        canonicalTitle: "The Twenty Years' Crisis, 1919-1939",
        subtitle: '',
        authors: ['E. H. Carr'],
        year: 2016,
        sourceConfidence: 'High',
        notes: 'Syllabus lists Michael Cox as editor; uploaded PDF frames Cox as author of a new preface.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 1 section (p. 106)',
        mainIdeas: [
          'Utopianism misreads international politics because it treats moral aspirations as separable from power politics.',
          'Dominant states universalize their particular interests, so legitimacy claims often reflect underlying power relations.',
          'Stable international order requires peaceful adjustment between existing rules and shifts in the balance of power.',
        ],
        themes: ['power politics', 'legitimacy', 'balance of power', 'international order', 'ideational change'],
        connectedBooks: [
          {
            title: 'Man, the State, and War',
            relation: 'Shares framework',
            explanation:
              'Waltz and Carr both privilege structural power constraints over moral aspiration.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Extends',
            explanation:
              'Gilpin formalizes the mechanism of international-order change that Carr diagnoses.',
          },
          {
            title: 'Against the World',
            relation: 'Supports',
            explanation:
              'Zahra identifies the mass-political shocks that drove the breakdown of the interwar order Carr critiques.',
          },
          {
            title: 'After Victory',
            relation: 'Similar case, different conclusion',
            explanation:
              'Ikenberry also studies order after systemic rupture but argues institutions and restraint can stabilize power more durably.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Man, the State, and War',
        subtitle: 'A Theoretical Analysis',
        authors: ['Kenneth N. Waltz'],
        year: 2001,
        sourceConfidence: 'High',
        notes: '-',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 2 section (p. 107)',
        mainIdeas: [
          'Explanations of war fall into three images: human nature, domestic order, and the international system.',
          'The anarchic international system generates insecurity and self-help regardless of the character of particular states.',
          'First- and second-image factors shape who fights and when, but third-image structure explains why war recurs.',
        ],
        themes: ['war causation', 'international system', 'security dilemma', 'balance of power', 'uncertainty'],
        connectedBooks: [
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Shares framework',
            explanation:
              'Carr and Waltz both subordinate moral aspiration to structural power constraints.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Extends',
            explanation:
              'Gilpin adds a dynamic account of when shifts in relative power transform the international system Waltz treats as enduringly anarchic.',
          },
          {
            title: 'After Hegemony',
            relation: 'Challenges',
            explanation:
              'Keohane shows that regimes can change state calculations enough to sustain cooperation even under the anarchy Waltz treats as war-generating.',
          },
          {
            title: 'Rethinking the World',
            relation: 'Extends',
            explanation:
              'Legro adds collective ideas and domestic pressures to Waltz’s structural account of grand strategy.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Power',
        subtitle: 'A Radical View',
        authors: ['Steven Lukes'],
        year: '2005 / 2021',
        sourceConfidence: 'Medium',
        notes: 'Syllabus lists 2nd ed. (2005); uploaded PDF is 3rd ed. (2021).',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 2 section (p. 108)',
        mainIdeas: [
          'Power operates through three dimensions: overt decision-making, agenda control, and preference-shaping.',
          'The deepest dimension of power prevents conflict by shaping perceptions, beliefs, and desires before grievances become political demands.',
          'Domination endures when subordinates accept existing arrangements as natural or legitimate rather than contestable.',
        ],
        themes: ['decision-making', 'perception', 'legitimacy', 'ideational change'],
        connectedBooks: [
          {
            title: 'When Right Makes Might',
            relation: 'Extends',
            explanation:
              'Goddard turns hidden influence into a state-to-state mechanism through legitimation strategies that shape audience judgment.',
          },
          {
            title: 'Strategic Narratives',
            relation: 'Extends',
            explanation:
              'Miskimmon, O\'Loughlin, and Roselle specify narrative as a communicative mechanism of perception- and preference-shaping power.',
          },
          {
            title: 'Economic Statecraft',
            relation: 'Extends',
            explanation:
              'Baldwin translates abstract influence into concrete nonmilitary instruments that alter others’ choices without direct force.',
          },
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Shares framework',
            explanation:
              'Carr likewise argues that dominant actors present particular interests as universal moral claims.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'After Hegemony',
        subtitle: 'Cooperation and Discord in the World Political Economy',
        authors: ['Robert O. Keohane'],
        year: '2004 / 1984',
        sourceConfidence: 'Medium',
        notes:
          'Syllabus assigns 2004 Princeton edition; uploaded PDF appears to be the 1984 original edition.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 3 section (p. 109)',
        mainIdeas: [
          'Cooperation persists after hegemonic decline because regimes remain useful to self-interested states.',
          'Institutions foster cooperation by reducing uncertainty, lowering transaction costs, and supplying information for reciprocity.',
          'Because institutions are harder to create than to maintain, posthegemonic order usually changes through adaptation rather than collapse.',
        ],
        themes: ['international system', 'institutions', 'international order', 'uncertainty'],
        connectedBooks: [
          {
            title: 'After Victory',
            relation: 'Supports',
            explanation:
              'Ikenberry’s durable postwar orders depend on the same uncertainty-reducing institutions Keohane treats as functionally valuable.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Challenges',
            explanation:
              'Gilpin expects hegemonic decline to drive systemic revision; Keohane argues cooperation can survive that decline when institutions remain useful.',
          },
          {
            title: 'Man, the State, and War',
            relation: 'Challenges',
            explanation:
              'Waltz’s structural pessimism is narrowed because regimes can sustain cooperation under anarchy by updating expectations and reducing uncertainty.',
          },
          {
            title: 'Economic Statecraft',
            relation: 'Shares framework',
            explanation:
              'Baldwin and Keohane both show that states can influence others through institutional and economic incentives short of force.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Against the World',
        subtitle: 'Anti-Globalism and Mass Politics Between the World Wars',
        authors: ['Tara Zahra'],
        year: 2023,
        sourceConfidence: 'High',
        notes: '-',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 4 section (p. 110)',
        mainIdeas: [
          'Interwar anti-globalism expanded because war, migration, disease, and economic crisis created mass demand for protection.',
          'Mass backlash redirected state decision-making toward restriction, autarky, and exclusion.',
          'Because backlash made laissez-faire openness politically unsustainable, post-1945 cooperation had to pair openness with social protection.',
        ],
        themes: ['decision-making', 'perception', 'ideational change', 'international order'],
        connectedBooks: [
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Supports',
            explanation:
              'Zahra identifies the social shocks that caused the interwar liberal project Carr critiques to unravel.',
          },
          {
            title: 'After Victory',
            relation: 'Extends',
            explanation:
              'Ikenberry’s post-1945 order becomes politically viable because it embeds protection and legitimacy after the backlash Zahra documents.',
          },
          {
            title: 'Rethinking the World',
            relation: 'Shares framework',
            explanation:
              'Legro likewise treats crisis-driven shifts in collective ideas as drivers of state strategy.',
          },
        ],
        confidence: 'Medium',
      },
      {
        canonicalTitle: 'War and Change in World Politics',
        subtitle: '',
        authors: ['Robert Gilpin'],
        year: 1981,
        sourceConfidence: 'High',
        notes: '-',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 5 section (p. 111)',
        mainIdeas: [
          'States seek revision when expected benefits of changing the system exceed expected costs.',
          'Uneven growth creates disequilibrium between the distribution of power and the structure of international order.',
          'Systemic disequilibrium is usually resolved by hegemonic war that resets the rules and hierarchy around a new balance of power.',
        ],
        themes: ['power politics', 'balance of power', 'international system', 'international order', 'war causation'],
        connectedBooks: [
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Extends',
            explanation:
              'Gilpin supplies the causal mechanism of system change that Carr treats more polemically.',
          },
          {
            title: 'After Hegemony',
            relation: 'Challenges',
            explanation:
              'Keohane argues institutions can preserve cooperation after hegemonic decline instead of collapsing into revision.',
          },
          {
            title: 'After Victory',
            relation: 'Similar case, different conclusion',
            explanation:
              'Ikenberry also studies postwar settlement but emphasizes strategic restraint rather than equilibrium restored through war alone.',
          },
          {
            title: 'When Right Makes Might',
            relation: 'Extends',
            explanation:
              'Goddard adds legitimacy signaling to Gilpin’s material account of whether rising powers are accommodated or resisted.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Rethinking the World',
        subtitle: 'Great Power Strategies and International Order',
        authors: ['Jeffrey W. Legro'],
        year: 2005,
        sourceConfidence: 'High',
        notes: 'Syllabus punctuation differs slightly from the uploaded PDF subtitle line.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 6 section (p. 112)',
        mainIdeas: [
          'Grand-strategic change requires both collapse of an old orthodoxy and consolidation of a credible replacement.',
          'Policy orthodoxies change when events discredit prevailing ideas and create openings for alternatives.',
          'New orthodoxies endure when they align with strategic circumstances, attract social support, and appear effective early.',
        ],
        themes: ['grand strategy', 'perception', 'decision-making', 'ideational change', 'international order'],
        connectedBooks: [
          {
            title: 'Man, the State, and War',
            relation: 'Extends',
            explanation:
              'Legro adds ideational change and domestic pressures to Waltz’s structural account of strategy.',
          },
          {
            title: 'When Right Makes Might',
            relation: 'Supports',
            explanation:
              'Goddard likewise argues that interpretation and legitimation, not raw capability alone, shape responses to rising powers.',
          },
          {
            title: 'Strategic Narratives',
            relation: 'Shares framework',
            explanation:
              'Strategic Narratives explains how elites form, project, and contest the ideas Legro shows can become dominant orthodoxies.',
          },
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Shares framework',
            explanation:
              'Carr and Legro both treat prevailing ideas about order as causal forces that can collapse under pressure.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'After Victory',
        subtitle: 'Institutions, Strategic Restraint, and the Rebuilding of Order after Major Wars',
        authors: ['G. John Ikenberry'],
        year: 2019,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF is labeled New Edition (2019).',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 7 section (p. 114)',
        mainIdeas: [
          'Victorious states can turn wartime power into durable order by exercising strategic restraint instead of pure domination.',
          'Institutions make restraint credible by locking in rules, voice opportunities, and exit costs for weaker states.',
          'Durable postwar order depends on how power is organized after victory, not on material victory alone.',
        ],
        themes: ['grand strategy', 'legitimacy', 'international order', 'institutions', 'uncertainty'],
        connectedBooks: [
          {
            title: 'After Hegemony',
            relation: 'Supports',
            explanation:
              'Keohane explains why the institutions Ikenberry emphasizes remain valuable after hegemonic peaks.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Similar case, different conclusion',
            explanation:
              'Gilpin expects order to track shifts in relative power more tightly than Ikenberry’s argument about durable restraint.',
          },
          {
            title: 'Against the World',
            relation: 'Extends',
            explanation:
              'Zahra explains why post-1945 order builders had to promise protection and legitimacy, not just openness.',
          },
          {
            title: 'Pacific Power Paradox',
            relation: 'Similar case, different conclusion',
            explanation:
              'Jackson argues U.S. leadership in Asia can erode peace rather than simply stabilize it through restrained order-building.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'When Right Makes Might',
        subtitle: 'Rising Powers and World Order',
        authors: ['Stacie E. Goddard'],
        year: 2018,
        sourceConfidence: 'High',
        notes: '-',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 8 section (p. 115)',
        mainIdeas: [
          'Great powers judge rising states through legitimation strategies as well as capabilities.',
          'Accommodation is more likely when a rising power frames its aims as limited and consistent with existing rules; confrontation is more likely when it frames them as revolutionary.',
          'Legitimation shapes responses because audiences interpret signals through institutional vulnerability and multivocal rhetoric.',
        ],
        themes: ['legitimacy', 'perception', 'grand strategy', 'uncertainty', 'international order'],
        connectedBooks: [
          {
            title: 'Strategic Narratives',
            relation: 'Supports',
            explanation:
              'Strategic Narratives supplies the communication mechanisms through which legitimation strategies reach and shape audiences.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Extends',
            explanation:
              'Goddard adds a legitimacy filter to Gilpin’s material account of power transition.',
          },
          {
            title: 'Power',
            relation: 'Extends',
            explanation:
              'Lukes’s third dimension of power helps explain how rhetoric shapes what audiences accept as limited or revisionist aims.',
          },
          {
            title: 'Rethinking the World',
            relation: 'Shares framework',
            explanation:
              'Legro likewise shows that ideas and interpretation redirect strategic behavior.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Strategic Narratives',
        subtitle: 'Communication Power and the New World Order',
        authors: ['Alister Miskimmon', "Ben O'Loughlin", 'Laura Roselle'],
        year: '2014 / 2013',
        sourceConfidence: 'Medium',
        notes: 'Syllabus lists 2014; uploaded PDF states first published 2013.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 8 section (p. 116)',
        mainIdeas: [
          'Political actors use system, identity, and issue narratives to shape how audiences interpret the past, present, and future.',
          'Narrative power depends on formation, projection, and reception across contested media environments.',
          'Narratives affect policy because they legitimize action, structure expectations, and can trap leaders inside their own stories.',
        ],
        themes: ['perception', 'legitimacy', 'grand strategy', 'international order', 'ideational change'],
        connectedBooks: [
          {
            title: 'When Right Makes Might',
            relation: 'Supports',
            explanation:
              'Goddard’s legitimation strategies depend on the narrative resonance and reception mechanisms this book identifies.',
          },
          {
            title: 'Power',
            relation: 'Extends',
            explanation:
              'Lukes explains hidden influence in general; Miskimmon, O’Loughlin, and Roselle specify a communicative mechanism that shapes beliefs and behavior.',
          },
          {
            title: 'Rethinking the World',
            relation: 'Supports',
            explanation:
              'Legro’s collective ideas become politically consequential when elites can form, project, and entrench them narratively.',
          },
          {
            title: 'Pacific Power Paradox',
            relation: 'Extends',
            explanation:
              'Jackson shows that official stories about U.S. stabilizing power can misidentify the actual causes of peace in Asia.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Economic Statecraft',
        subtitle: 'New Edition',
        authors: ['David A. Baldwin'],
        year: 2020,
        sourceConfidence: 'High',
        notes:
          'Uploaded PDF is New Edition (2020); Ethan B. Kapstein contributes new-edition/afterword material.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 9 section (p. 117)',
        mainIdeas: [
          'Economic instruments are normal tools of power politics rather than secondary substitutes for force.',
          'Their effectiveness must be judged relative to goals, costs, and alternatives rather than binary success or failure.',
          'Sanctions, aid, trade, and finance alter behavior by reshaping incentives, capabilities, and bargaining leverage.',
        ],
        themes: ['coercion', 'deterrence', 'compellence', 'decision-making', 'power politics'],
        connectedBooks: [
          {
            title: 'After Hegemony',
            relation: 'Shares framework',
            explanation:
              'Keohane and Baldwin both analyze nonmilitary tools that alter incentives and behavior without direct force.',
          },
          {
            title: 'Pacific Power Paradox',
            relation: 'Extends',
            explanation:
              'Jackson’s account of Asian peace includes nonmilitary statecraft and interdependence that Baldwin treats as causal tools.',
          },
          {
            title: 'Power',
            relation: 'Extends',
            explanation:
              'Baldwin operationalizes power through concrete instruments that shape others’ choices short of war.',
          },
          {
            title: 'Strategic Narratives',
            relation: 'Extends',
            explanation:
              'Strategic Narratives shows how states communicate intentions; Baldwin shows how sanctions, aid, trade, and finance carry those signals in practice.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'The Global Cold War',
        subtitle: 'Third World Interventions and the Making of Our Times',
        authors: ['Odd Arne Westad'],
        year: 2005,
        sourceConfidence: 'High',
        notes: 'Uploaded PDF states first published 2005.',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 10 section (p. 118)',
        mainIdeas: [
          'The Cold War’s decisive struggles unfolded in the Third World, where superpower rivalry intersected with decolonization.',
          'U.S. and Soviet interventions were driven by universalist ideologies that justified expansive foreign commitments.',
          'These interventions transformed local conflicts, generated enduring violence, and helped produce the later crises of both superpowers.',
        ],
        themes: ['grand strategy', 'legitimacy', 'power politics', 'international order', 'coercion', 'ideational change'],
        connectedBooks: [
          {
            title: 'Against the World',
            relation: 'Extends',
            explanation:
              'Zahra and Westad both show how ideology and social upheaval reshape world politics beyond elite diplomacy.',
          },
          {
            title: 'Strategic Narratives',
            relation: 'Supports',
            explanation:
              'Strategic Narratives identifies the communicative mechanism by which universalist stories legitimize intervention.',
          },
          {
            title: "The Twenty Years' Crisis, 1919-1939",
            relation: 'Shares framework',
            explanation:
              'Carr likewise treats moral language as inseparable from struggles over power.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Extends',
            explanation:
              'Gilpin’s system-level competition appears here in practice as rival powers contest order through intervention in the Third World.',
          },
        ],
        confidence: 'High',
      },
      {
        canonicalTitle: 'Pacific Power Paradox',
        subtitle: 'American Statecraft and the Fate of the Asian Peace',
        authors: ['Van Jackson'],
        year: 2023,
        sourceConfidence: 'High',
        notes: '-',
        primarySourceUsed: 'PDF',
        notesFileReference: 'Consolidated Notes.pdf - Day 11 section (p. 119)',
        mainIdeas: [
          'Asian peace since 1979 emerged from a layered regional order rather than U.S. hegemony alone.',
          'U.S. statecraft has alternately reinforced and undermined peace through its military presence, alliance management, coercive diplomacy, and institutional choices.',
          'Strategy should be judged by whether it preserves the multiple conditions of peace rather than by whether it demonstrates primacy.',
        ],
        themes: ['grand strategy', 'alliance politics', 'coercion', 'deterrence', 'institutions', 'international order'],
        connectedBooks: [
          {
            title: 'After Victory',
            relation: 'Similar case, different conclusion',
            explanation:
              'Ikenberry sees durable order emerging from restrained leadership, whereas Jackson shows U.S. leadership can also erode the peace it claims to sustain.',
          },
          {
            title: 'After Hegemony',
            relation: 'Supports',
            explanation:
              'Keohane shows why institutions and interdependence can stabilize behavior independently of hegemonic force, which matches Jackson’s multi-causal account of Asian peace.',
          },
          {
            title: 'War and Change in World Politics',
            relation: 'Challenges',
            explanation:
              'Jackson rejects Gilpin-style monocausal accounts that collapse regional order into hegemonic power alone.',
          },
          {
            title: 'Strategic Narratives',
            relation: 'Extends',
            explanation:
              'Strategic Narratives helps explain how U.S. claims to be Asia’s stabilizer can drive policy even when those claims misdescribe causal reality.',
          },
        ],
        confidence: 'High',
      },
    ],
  },
};

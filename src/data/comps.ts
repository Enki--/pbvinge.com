export type Confidence = 'High' | 'Medium' | 'Low';

export interface CourseConnection {
  title: string;
  relation: string;
  explanation: string;
}

export interface CourseStudyBook {
  canonicalTitle: string;
  subtitle?: string;
  authors: string[];
  year: number;
  sourceConfidence: Confidence;
  notes: string;
  coverArt: string;
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
};

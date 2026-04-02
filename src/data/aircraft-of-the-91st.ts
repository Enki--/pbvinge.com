import imageSources from "./aircraft-of-the-91st-image-sources.json";

type SourceLink = {
  label: string;
  url: string;
};

type ImageSource = {
  slug: string;
  imagePath: string;
  descriptionUrl: string;
  license: string;
  artist: string;
  note: string;
};

type AircraftEntry = {
  slug: string;
  title: string;
  aliases: string[];
  years: string;
  sortYear: number;
  eraId: string;
  mission: string;
  summary: string;
  context: string;
  source: SourceLink;
  imageAlt: string;
};

export type AircraftCard = AircraftEntry & {
  image: ImageSource;
  imageArtist: string;
};

export const aircraftEras = [
  {
    id: "wwi",
    eyebrow: "1918 to 1919",
    title: "Over the Western Front",
    summary:
      "The 91st reached France as an observation unit and moved quickly through short-lived types before settling on the Salmson for combat work."
  },
  {
    id: "interwar",
    eyebrow: "1925 to 1936",
    title: "Interwar Experimentation",
    summary:
      "The squadron spent the interwar years cycling through Army Air Corps observation, amphibian, and utility aircraft as the mission matured."
  },
  {
    id: "transition",
    eyebrow: "1936 to 1943",
    title: "From Observation to War",
    summary:
      "Late-prewar observation aircraft gave way to liaison, attack, and fighter types as the 91st shifted toward reconnaissance in a global war."
  },
  {
    id: "mapping",
    eyebrow: "1943 to 1950",
    title: "Mapping the Postwar World",
    summary:
      "The squadron reinvented itself around photo mapping and long-range survey work, moving from Mitchells to Flying Fortresses and Beechcraft support aircraft."
  },
  {
    id: "cold-war",
    eyebrow: "1950 to 1954",
    title: "Korea and Strategic Reconnaissance",
    summary:
      "Korea and the early Cold War put the 91st into heavier reconnaissance aircraft built for depth, endurance, and survivability."
  },
  {
    id: "ficon",
    eyebrow: "1955 to 1957",
    title: "The FICON Detour",
    summary:
      "For a brief and unusual chapter, the squadron's mission revolved around RF-84 parasite reconnaissance aircraft tied to the FICON concept."
  },
  {
    id: "bergstrom",
    eyebrow: "1967 to 1991",
    title: "The Bergstrom Phantom Years",
    summary:
      "Reactivated in Texas, the 91st spent nearly a quarter century flying the RF-4C in the tactical reconnaissance role."
  }
] as const;

export const researchSources = [
  {
    label: "91st Aero Squadron",
    url: "https://en.wikipedia.org/wiki/91st_Aero_Squadron",
    note: "Used for WWI aircraft ordering and the Salmson-centered operational narrative."
  },
  {
    label: "AFHRA-derived lineage summary",
    url: "https://www.usafunithistory.com/PDF/75-100/91%20NETWORK%20WARFARE%20SQ.pdf",
    note: "Used as the backbone for aircraft/date verification across the interwar, WWII, Korea, and postwar periods."
  },
  {
    label: "91st archived sites",
    url: "/archives/91st",
    note: "Helpful for 91st-specific imagery and Korea-era context already preserved in this project."
  }
] as const;

const sourceWWI: SourceLink = {
  label: "91st Aero Squadron",
  url: "https://en.wikipedia.org/wiki/91st_Aero_Squadron"
};

const sourceLineage: SourceLink = {
  label: "AFHRA-derived lineage summary",
  url: "https://www.usafunithistory.com/PDF/75-100/91%20NETWORK%20WARFARE%20SQ.pdf"
};

const imagesBySlug = new Map(
  (imageSources as ImageSource[]).map((image) => [image.slug, image])
);

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const withImage = (entry: AircraftEntry): AircraftCard => {
  const image = imagesBySlug.get(entry.slug);
  if (!image) {
    throw new Error(`Missing image metadata for ${entry.slug}`);
  }

  return {
    ...entry,
    image,
    imageArtist: stripHtml(image.artist),
  };
};

export const aircraftTimeline = [
  withImage({
    slug: "ar-1-2",
    title: "Dorand AR.1 / AR.2",
    aliases: ["AR type"],
    years: "1918",
    sortYear: 1918,
    eraId: "wwi",
    mission: "Early reconnaissance",
    summary:
      "A brief transitional type in the squadron's first combat year before the Salmson became the signature WWI aircraft.",
    context:
      "The sourcing pass tightened this entry to 1918 rather than the broader 1917 to 1918 range in the draft list.",
    source: sourceWWI,
    imageAlt: "Dorand AR reconnaissance aircraft"
  }),
  withImage({
    slug: "salmson-2a2",
    title: "Salmson 2A2",
    aliases: ["Salmson 2"],
    years: "1918 to 1919",
    sortYear: 1918.1,
    eraId: "wwi",
    mission: "Primary observation aircraft",
    summary:
      "The aircraft most closely associated with the 91st's wartime service in France, used for the deep reconnaissance work that defined the squadron.",
    context:
      "The squadron received Salmson 2A2s in late April 1918 and flew them operationally through the end of the war and immediate aftermath.",
    source: sourceWWI,
    imageAlt: "Salmson 2A2 in United States Army service"
  }),
  withImage({
    slug: "breguet-14",
    title: "Breguet 14",
    aliases: [],
    years: "1918 to 1919",
    sortYear: 1918.2,
    eraId: "wwi",
    mission: "Observation and transition aircraft",
    summary:
      "A less central but still documented WWI-era type in the broader 91st equipment mix during the squadron's first operational cycle.",
    context:
      "The verification pass extended the draft's 1918-only date into 1919 to match the lineage-style summaries.",
    source: sourceWWI,
    imageAlt: "Breguet 14 biplane"
  }),
  withImage({
    slug: "dh-4",
    title: "DH-4",
    aliases: [],
    years: "1918; 1919 to c.1928",
    sortYear: 1918.3,
    eraId: "wwi",
    mission: "Observation and postwar workhorse",
    summary:
      "One of the few aircraft in the 91st story that bridges the First World War and the long interwar lull that followed.",
    context:
      "The DH-4 appears in both the WWI list and the postwar observation lineup, which makes it a useful hinge between the eras.",
    source: sourceWWI,
    imageAlt: "Airco DH-4 biplane"
  }),
  withImage({
    slug: "spad-xiii",
    title: "SPAD XIII",
    aliases: [],
    years: "1918 to 1919",
    sortYear: 1918.4,
    eraId: "wwi",
    mission: "WWI-era supplementary type",
    summary:
      "Listed in squadron aircraft summaries for the fluid final phase of the war and the occupation period rather than as the main squadron mount.",
    context:
      "This entry, like the Breguet 14, reflects a broader late-war aircraft environment around the 91st more than a long principal assignment.",
    source: sourceWWI,
    imageAlt: "SPAD XIII fighter"
  }),
  withImage({
    slug: "oa-1",
    title: "OA-1",
    aliases: ["Loening OA-1A family"],
    years: "1925 to 1930",
    sortYear: 1925,
    eraId: "interwar",
    mission: "Amphibious observation",
    summary:
      "A reminder that the interwar 91st did more than fly dry-land observation aircraft; amphibious utility and observation types were part of the mix too.",
    context:
      "The image used here represents the Loening OA family rather than a 91st-marked aircraft.",
    source: sourceLineage,
    imageAlt: "Loening amphibious aircraft representing the OA-1 family"
  }),
  withImage({
    slug: "c-1",
    title: "C-1",
    aliases: ["Douglas C-1"],
    years: "1925 to 1930",
    sortYear: 1925.1,
    eraId: "interwar",
    mission: "Utility and transport support",
    summary:
      "The 91st's interwar lineup included utility aircraft that supported the observation mission even when they were not front-line scouts themselves.",
    context:
      "This was part of the same broad transition period that still included the DH-4 and newer observation types.",
    source: sourceLineage,
    imageAlt: "Douglas C-1 transport aircraft"
  }),
  withImage({
    slug: "o-2",
    title: "O-2",
    aliases: ["Douglas O-2"],
    years: "c.1926 to 1930",
    sortYear: 1926,
    eraId: "interwar",
    mission: "Observation",
    summary:
      "The O-2 marks the squadron's move toward newer dedicated observation aircraft in the late 1920s.",
    context:
      "The date remains approximate because the lineage-style sources give a late-1920s span rather than a sharply bounded assignment date.",
    source: sourceLineage,
    imageAlt: "Douglas O-2 observation aircraft"
  }),
  withImage({
    slug: "o-25a",
    title: "O-25A",
    aliases: ["O-25"],
    years: "1930 to 1936",
    sortYear: 1930,
    eraId: "interwar",
    mission: "Primary early-1930s observation aircraft",
    summary:
      "The O-25A sits at the center of the 91st's early-1930s story and shows how much the observation mission had modernized since the DH-4 years.",
    context:
      "The best image located was of the closely related O-25C family, which is flagged in the image note.",
    source: sourceLineage,
    imageAlt: "Douglas O-25 family observation aircraft"
  }),
  withImage({
    slug: "oa-2",
    title: "OA-2",
    aliases: [],
    years: "1930 to 1936",
    sortYear: 1930.1,
    eraId: "interwar",
    mission: "Amphibious support aircraft",
    summary:
      "The OA-2 remained part of the mix during the O-25 era, underlining how varied the squadron's interwar fleet could be.",
    context:
      "As with the OA-1 card, the image is representative of the Loening amphibian family rather than a 91st-specific airframe.",
    source: sourceLineage,
    imageAlt: "Loening amphibian representing the OA-2 family"
  }),
  withImage({
    slug: "c-6",
    title: "C-6",
    aliases: ["Sikorsky C-6A family"],
    years: "1930 to 1936",
    sortYear: 1930.2,
    eraId: "interwar",
    mission: "Utility and transport support",
    summary:
      "The squadron's aircraft roster in the 1930s mixed classic observation platforms with utility types that expanded what the unit could do.",
    context:
      "The C-6 appears in the verified lineup during the same period as the O-25A, OA-2, and C-8.",
    source: sourceLineage,
    imageAlt: "Sikorsky C-6A aircraft"
  }),
  withImage({
    slug: "c-8",
    title: "C-8",
    aliases: ["Fairchild C-8"],
    years: "1930 to 1936",
    sortYear: 1930.3,
    eraId: "interwar",
    mission: "Utility and transport support",
    summary:
      "Another supporting aircraft from the O-25 era, the C-8 rounds out the squadron's unusually broad prewar equipment list.",
    context:
      "The sourced image is an exact Fairchild C-8, though not a 91st-marked aircraft.",
    source: sourceLineage,
    imageAlt: "Fairchild C-8 aircraft"
  }),
  withImage({
    slug: "o-46",
    title: "O-46",
    aliases: ["Douglas O-46"],
    years: "1936 to 1942",
    sortYear: 1936,
    eraId: "transition",
    mission: "Late-interwar observation",
    summary:
      "The O-46 was the 91st's principal aircraft in the final prewar years, a bridge between the interwar Army Air Corps and the pressure of mobilization.",
    context:
      "This was the squadron's most durable late-interwar assignment before the fast wartime transition accelerated.",
    source: sourceLineage,
    imageAlt: "Douglas O-46 observation aircraft"
  }),
  withImage({
    slug: "o-47",
    title: "O-47",
    aliases: ["North American O-47"],
    years: "1941 to 1943",
    sortYear: 1941,
    eraId: "transition",
    mission: "Observation during mobilization",
    summary:
      "The O-47 lived in the overlap between peacetime observation doctrine and a wartime reality that was already changing too fast for the type.",
    context:
      "Lineage summaries show the O-47 across both the prewar and early wartime transition windows, so the page collapses that overlap into a single 1941 to 1943 span.",
    source: sourceLineage,
    imageAlt: "North American O-47 observation aircraft"
  }),
  withImage({
    slug: "o-52",
    title: "O-52 Owl",
    aliases: ["O-52"],
    years: "1941 to 1942",
    sortYear: 1941.1,
    eraId: "transition",
    mission: "Observation",
    summary:
      "An early-war observation type that captures the last moment before the squadron's mission set became more aggressively reconnaissance-oriented.",
    context:
      "The O-52 appears alongside the O-47 in the short prewar-to-war transition.",
    source: sourceLineage,
    imageAlt: "Curtiss O-52 Owl aircraft"
  }),
  withImage({
    slug: "o-49",
    title: "O-49 Vigilant",
    aliases: ["O-49"],
    years: "1941 to c.1943",
    sortYear: 1941.2,
    eraId: "transition",
    mission: "Reconnaissance and liaison",
    summary:
      "The O-49 belongs to the 91st's early-war reconnaissance period, when classic observation gave way to more flexible battlefield roles.",
    context:
      "The date remains approximate because the lineage summary gives a c.1943 end point rather than a single turnover date.",
    source: sourceLineage,
    imageAlt: "Stinson O-49 Vigilant aircraft"
  }),
  withImage({
    slug: "a-20",
    title: "A-20 Havoc",
    aliases: ["A-20"],
    years: "1942 to 1943",
    sortYear: 1942,
    eraId: "transition",
    mission: "Attack and armed reconnaissance",
    summary:
      "The A-20 signals a clear change in tone: the 91st was no longer living only in the world of slow observation machines.",
    context:
      "This assignment sits inside the same broader wartime transition that also brought the DB-7, L-series liaison aircraft, P-40, and B-25 into the picture.",
    source: sourceLineage,
    imageAlt: "Douglas A-20 Havoc in flight"
  }),
  withImage({
    slug: "db-7",
    title: "DB-7",
    aliases: ["Douglas Boston family"],
    years: "1942 to 1943",
    sortYear: 1942.1,
    eraId: "transition",
    mission: "Attack and reconnaissance transition",
    summary:
      "The DB-7 belongs to the same transitional wartime moment as the A-20, reflecting how the 91st moved through multiple related aircraft families before settling on dedicated mapping types.",
    context:
      "The image uses a RAF Boston-family aircraft because that is the clearest rights-safe DB-7-family photo located in the sourcing pass.",
    source: sourceLineage,
    imageAlt: "Douglas DB-7 or Boston family aircraft"
  }),
  withImage({
    slug: "l-4",
    title: "L-4 Grasshopper",
    aliases: ["L-4"],
    years: "1942 to 1943",
    sortYear: 1942.2,
    eraId: "transition",
    mission: "Liaison and utility",
    summary:
      "The tiny L-4 shows how broad the 91st's wartime tool kit had become during the observation-to-reconnaissance handoff.",
    context:
      "The L-4 and L-5 appear together in the verified roster for this short wartime transition period.",
    source: sourceLineage,
    imageAlt: "Piper L-4 Grasshopper"
  }),
  withImage({
    slug: "l-5",
    title: "L-5 Sentinel",
    aliases: ["L-5"],
    years: "1942 to 1943",
    sortYear: 1942.3,
    eraId: "transition",
    mission: "Liaison and utility",
    summary:
      "A more capable liaison aircraft than the L-4, the L-5 fits the same early-war moment when the 91st needed flexibility more than a single clean doctrinal identity.",
    context:
      "Like several other cards in this stretch, this one reflects a very compressed and overlapping assignment window.",
    source: sourceLineage,
    imageAlt: "Stinson L-5 Sentinel"
  }),
  withImage({
    slug: "p-40",
    title: "P-40 Warhawk",
    aliases: ["P-40"],
    years: "1942 to 1943",
    sortYear: 1942.4,
    eraId: "transition",
    mission: "Fighter support within reconnaissance transition",
    summary:
      "The P-40 is a reminder that the 91st's wartime aircraft list was not neatly confined to one mission family during the 1942 to 1943 churn.",
    context:
      "The verified roster includes the P-40 in the same early-war transition period as the A-20, DB-7, L-series aircraft, and B-25.",
    source: sourceLineage,
    imageAlt: "Curtiss P-40 Warhawk"
  }),
  withImage({
    slug: "b-25",
    title: "B-25 Mitchell",
    aliases: ["B-25"],
    years: "1943",
    sortYear: 1943,
    eraId: "mapping",
    mission: "Transition into mapping",
    summary:
      "The B-25 appears as the 91st turned toward mapping and photo reconnaissance, and the sourced image is a direct 91st Photographic Mapping Squadron photograph.",
    context:
      "This short assignment is best understood as the runway into the dedicated F-10 mapping phase rather than a long separate chapter.",
    source: sourceLineage,
    imageAlt: "91st Photographic Mapping Squadron B-25 Mitchell"
  }),
  withImage({
    slug: "f-10",
    title: "F-10 Mitchell",
    aliases: ["B-25 / F-10"],
    years: "1943 to 1945",
    sortYear: 1943.1,
    eraId: "mapping",
    mission: "Photographic mapping",
    summary:
      "This is the aircraft that defines the 91st's mapping phase: a Mitchell remade around cameras and cartography.",
    context:
      "Per your direction, the card uses the right-hand designation as the primary label because it is the more accurate one.",
    source: sourceLineage,
    imageAlt: "North American F-10 Mitchell reconnaissance aircraft"
  }),
  withImage({
    slug: "f-9",
    title: "F-9 Flying Fortress",
    aliases: ["B-17 / F-9"],
    years: "1945 to 1950",
    sortYear: 1945,
    eraId: "mapping",
    mission: "Long-range photo reconnaissance",
    summary:
      "After the Mitchell mapping years, the 91st scaled up into the Flying Fortress-based F-9 for deeper, longer-ranging photographic work.",
    context:
      "The Commons file title reflects a QB-17 label, but the page metadata identifies the reconnaissance F-9 version.",
    source: sourceLineage,
    imageAlt: "Boeing F-9 Flying Fortress reconnaissance aircraft"
  }),
  withImage({
    slug: "f-2",
    title: "F-2 Expeditor",
    aliases: ["F-2"],
    years: "1945 to 1948",
    sortYear: 1945.1,
    eraId: "mapping",
    mission: "Postwar reconnaissance support",
    summary:
      "Flying beside the larger F-9, the Beechcraft F-2 gave the squadron a lighter reconnaissance aircraft during the first postwar years.",
    context:
      "This shorter assignment overlaps the F-9 period rather than replacing it.",
    source: sourceLineage,
    imageAlt: "Beechcraft F-2 aircraft"
  }),
  withImage({
    slug: "b-50",
    title: "B-50 Superfortress",
    aliases: ["B-50"],
    years: "1949 to 1950",
    sortYear: 1949,
    eraId: "mapping",
    mission: "Early strategic reconnaissance transition",
    summary:
      "The B-50 sits at the seam between postwar mapping work and the heavier strategic reconnaissance world of the Korean War years.",
    context:
      "It is best read as a transition aircraft for the 91st rather than as the core platform of a long stable era.",
    source: sourceLineage,
    imageAlt: "Boeing B-50 Superfortress"
  }),
  withImage({
    slug: "rb-50",
    title: "RB-50 Superfortress",
    aliases: ["RB-50"],
    years: "1950; 1951 to 1954",
    sortYear: 1950,
    eraId: "cold-war",
    mission: "Strategic reconnaissance",
    summary:
      "The reconnaissance B-50 brought the 91st into the big-airframe, long-range strategic world that defined the early 1950s.",
    context:
      "The verified lineage gives this aircraft in two blocks, one in 1950 and another from 1951 to 1954.",
    source: sourceLineage,
    imageAlt: "Boeing RB-50 or closely related reconnaissance B-50 family aircraft"
  }),
  withImage({
    slug: "rb-29",
    title: "RB-29 Superfortress",
    aliases: ["RB-29"],
    years: "1950 to 1954",
    sortYear: 1950.1,
    eraId: "cold-war",
    mission: "Core Korea-era reconnaissance",
    summary:
      "If one aircraft defines the 91st's Korea-era identity, it is the RB-29. The image used here is a 91st-specific aircraft from that mission set.",
    context:
      "This is the backbone aircraft of the squadron's Korean War reconnaissance chapter.",
    source: sourceLineage,
    imageAlt: "91st Strategic Reconnaissance Squadron RB-29"
  }),
  withImage({
    slug: "rb-45",
    title: "RB-45C Tornado",
    aliases: ["RB-45"],
    years: "1951 to 1954",
    sortYear: 1951,
    eraId: "cold-war",
    mission: "Jet reconnaissance",
    summary:
      "The RB-45 marks the 91st's early jet-reconnaissance step, layered into the same Korea and early Cold War period dominated by piston-powered heavies.",
    context:
      "Its presence in the lineup shows that the squadron's early-1950s story was more technologically mixed than a single-aircraft narrative suggests.",
    source: sourceLineage,
    imageAlt: "North American RB-45C Tornado"
  }),
  withImage({
    slug: "b-29",
    title: "B-29 Superfortress",
    aliases: ["B-29"],
    years: "1952 to 1953",
    sortYear: 1952,
    eraId: "cold-war",
    mission: "Korea-era supplement",
    summary:
      "The B-29 remained in the broader aircraft mix even while reconnaissance-specialized versions did most of the identity-shaping work.",
    context:
      "This is a short supporting assignment in the middle of the longer RB-29 and RB-50 period.",
    source: sourceLineage,
    imageAlt: "Boeing B-29 Superfortress in flight"
  }),
  withImage({
    slug: "rf-84k",
    title: "RF-84K Thunderflash",
    aliases: ["RBF-84"],
    years: "1955 to 1957",
    sortYear: 1955,
    eraId: "ficon",
    mission: "FICON parasite reconnaissance",
    summary:
      "This is the short, strange, and technically ambitious FICON chapter: a reconnaissance fighter designed to be carried and recovered by a larger aircraft.",
    context:
      "As requested, the more accurate right-hand designation is used as the primary label.",
    source: sourceLineage,
    imageAlt: "Republic RF-84K Thunderflash hooking up to a mothership"
  }),
  withImage({
    slug: "rf-84f",
    title: "RF-84F Thunderflash",
    aliases: ["RF-84"],
    years: "1956 to 1957",
    sortYear: 1956,
    eraId: "ficon",
    mission: "Late strategic reconnaissance",
    summary:
      "The RF-84F sits in the same brief late-1950s window as the RF-84K and closes out the squadron's post-Korea strategic-reconnaissance experiment.",
    context:
      "This is another case where the draft shorthand has been tightened to the more precise right-hand designation.",
    source: sourceLineage,
    imageAlt: "Republic RF-84F Thunderflash"
  }),
  withImage({
    slug: "rf-4c",
    title: "RF-4C Phantom II",
    aliases: ["RF-4"],
    years: "1967 to 1991",
    sortYear: 1967,
    eraId: "bergstrom",
    mission: "Tactical reconnaissance",
    summary:
      "The Bergstrom years are the longest single chapter on the page, and the RF-4C is the aircraft that came to define the modern 91st Tactical Reconnaissance Squadron.",
    context:
      "The image used here is 91st TRS-specific and anchors the page's final era.",
    source: sourceLineage,
    imageAlt: "91st Tactical Reconnaissance Squadron RF-4C Phantom II"
  })
];

export const heroAircraft = aircraftTimeline.filter((entry) =>
  ["ar-1-2", "o-46", "rb-29", "rf-4c"].includes(entry.slug)
);

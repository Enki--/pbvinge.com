import React, { useEffect, useMemo, useRef, useState } from "react";
import "../css/ribbon-chart.css";
import { extractRibbonChartData, ribbonImportWarnings, RIBBON_SAVE_SCHEMA, RIBBON_SAVE_SCHEMA_VERSION, RIBBON_MAX_FILE_BYTES, type RibbonRankEntry, type RibbonPlanningDate } from "../utils/ribbonChartFile";
import { SCOD_REFERENCE, rankReferenceForYear, shiftedGradeAnchor, promotionDropSource, pinOnTimelineValue } from "../utils/ribbonPlanning";

const SAVE_SCHEMA = RIBBON_SAVE_SCHEMA;
const SAVE_SCHEMA_VERSION = RIBBON_SAVE_SCHEMA_VERSION;
const RIBBON_CHART_VERSION = "2.7";
const DEFAULT_EAD_YEAR = 2014;
const DEFAULT_STARTING_YEAR = 2024;
const DEFAULT_TIMELINE_VIEW_YEARS = 10;
const MAX_TIMELINE_YEARS = 30;
const MIN_SEGMENT_YEARS = 0.5;
const FAMILY_KID_COUNT = 3;

const RANK_OPTIONS = ["Col", "Lt Col", "Maj", "Capt", "1st Lt", "2d Lt"];
const YEAR_GROUP_OPTIONS = Array.from({ length: 30 }, (_, index) => String(2026 - index));
const TIMELINE_YEAR_OPTIONS = Array.from({ length: 76 }, (_, index) => 1980 + index);
const DEFAULT_VECTOR_ROW_LABELS = ["Vec 1", "Vec 2", "Vec 3"];
const GRADE_OPTIONS = [
  { value: -1, label: "Pre-K" },
  { value: 0, label: "K" },
  ...Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: `${index + 1}${["st", "nd", "rd"][index] ?? "th"}` })),
  { value: 13, label: "Grad" }
];
const PROMOTION_YEAR_GROUP_MILESTONES = [
  { label: "IPZ Capt", offset: 4 },
  { label: "IPZ Maj", offset: 9 },
  { label: "IPZ Lt Col", offset: 14 },
  { label: "IPZ Col", offset: 20 }
] as const;

const IDE_OPTIONS = [
  "IDE Programs", "ACSC", "ACSC_PAS", "AFIT PhD", "AF_Legis", "AFIT Masters", "Army_CS", "ASAM",
  "AU_FELLOW_A", "AU_FELLOW_B", "AU_FELLOW_C", "CNCS", "CSAF Presitgous Capt PhD",
  "CSAF Presitgous Capt Prog", "CSAF_BH", "CSAF_HVD", "CSAF_JHU", "CSAF_PRIN", "DARPA", "DOE", "EQ Credit",
  "FGN_BRAZIL_IDE", "FGN_CAN", "FGN_CHILE", "FGN_COLOM", "FGN_GERM", "FGN_NORW", "FGN_SPAIN",
  "FGN_UKCS", "FGN_WHISC", "JTMOBFEL", "Lincoln", "McConn", "NIU", "NLTFP_ARG_IDE",
  "NLTFP_IDA_IDE", "NLTFP_LAW_IDE", "NLTFP_LOS_IDE", "NLTFP_OAK_IDE", "NLTFP_SAN_IDE",
  "NPS HOME", "NPS MASTER", "NPS_SOIW", "OLMSTED SCHOLAR", "POLAD", "SANDS", "SDM_IDE",
  "STR_COM", "STR_POL_DC", "STR_POL_HI", "TEST PILOT SCHOOL", "USAFA_AOC", "USMC_CS"
];

const SDE_OPTIONS = [
  "SDE Programs", "AFIT PhD", "Army WC", "ASLSP", "AU_LORENZ", "AWC", "CISA", "DIRNSA Fellowship",
  "EQ Credit", "ES_NATL_SEC", "FGN_FRANCE", "FGN_GENEV", "FGN_IADC", "FGN_MARSHALL",
  "Instructor ACSC", "IRMC", "JAWS", "JFK_Harv", "NATO_Aug17", "NATO_FEB18", "NDF_ALT_COUN",
  "NDF_BELF", "NDF_BELF_NUC", "NDF_CNAS", "NDF_CRS", "NDF_CRS_NUC", "NDF_FLETCH",
  "NDF_HOOVER", "NDF_IDA", "NDF_ISD", "NDF_MIT", "NDF_STIM_NUC", "NDF_TWI", "NLTFP_ARG",
  "NLTFP_IDA", "NLTFP_LOS", "NLTFP_OAK", "NVWC", "NWC", "RAND", "RAND_ASIA", "RAND_N",
  "SAASS PhD", "SDM_SDE", "SECDEF", "USAFA_GP", "USMC_WC"
];

const VECTOR_COLORS = [
  { id: "green", label: "Green", background: "#94d31b", foreground: "#111827" },
  { id: "blue", label: "Blue", background: "#2563eb", foreground: "#ffffff" },
  { id: "red", label: "Red", background: "#dc2626", foreground: "#ffffff" },
  { id: "yellow", label: "Yellow", background: "#fde047", foreground: "#111827" },
  { id: "orange", label: "Orange", background: "#f97316", foreground: "#111827" },
  { id: "purple", label: "Purple", background: "#7c3aed", foreground: "#ffffff" },
  { id: "slate", label: "Slate", background: "#64748b", foreground: "#ffffff" }
] as const;

type VectorColorId = (typeof VECTOR_COLORS)[number]["id"];
type DragMode = "move" | "resize-left" | "resize-right";

interface ChartIdentity {
  rank: string;
  name: string;
  jobLocation: string;
  dor: string;
  das: string;
  yearGroup: string;
  adjustedYearGroup: string;
}

interface EligibilityGroup {
  select: boolean;
  candidate: boolean;
}

interface EligibilityState {
  de: EligibilityGroup;
  do: EligibilityGroup;
  sqCc: EligibilityGroup;
}

interface TimelineData {
  eadYear: number;
  startingYear: number;
  promotion: string[];
  leadership: string[];
  developmentalEducation: string[];
  careerFieldEducation: string[];
  personal: string[];
}

interface VectorSegment {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  color: VectorColorId;
}

interface VectorRow {
  id: string;
  label: string;
  segments: VectorSegment[];
}

interface FamilyKid {
  id: string;
  enabled: boolean;
  label: string;
  startGrade: number;
}

interface JobExperiences {
  deployment: boolean;
  deployments: string;
  shortTour: boolean;
  returnDate: string;
  cyberEngineer: boolean;
  expedComms: boolean;
  dodinOps: boolean;
  dco: boolean;
  oco: boolean;
  crewCc: boolean;
  teamLead: boolean;
  fltCc: boolean;
  msnCc: boolean;
  directorOfOperations: boolean;
  detCc: boolean;
  cagExecAide: boolean;
  cagExecAideText: string;
  instructorUct: boolean;
  instructorCyber200Cyber300: boolean;
  instructorWic: boolean;
  instructorSosBmtOts: boolean;
  staffJoint: boolean;
  staffHaf: boolean;
  staffMajcom: boolean;
  staffNaf: boolean;
  jtQualified: boolean;
  jpmeI: boolean;
  jpmeIi: boolean;
  sqCcTours: boolean;
  sqCcToursText: string;
}

interface Highlights {
  operational: string;
  awards: string;
  certs: string;
}

interface EducationAchievements {
  pde: boolean;
  pdeDetails: string;
  pdeDg: boolean;
  aad: boolean;
  aadDetails: string;
  honors: boolean;
  cyber200: boolean;
  cyber200Details: string;
  cyber300: boolean;
  cyber300Details: string;
  ide: boolean;
  ideProgram: string;
  ideDg: boolean;
  cyber400: boolean;
  cyber400Details: string;
  sde: boolean;
  sdeProgram: string;
  sdeDg: boolean;
  ewi: boolean;
  ews: boolean;
  asg: boolean;
  wic: boolean;
  wicDg: boolean;
  cnodp: boolean;
  darpa: boolean;
  ldc: boolean;
  c2wac: boolean;
  specialProgramsOther: string;
}

interface OpbEntry {
  year: string;
  bottomLineRater: string;
  bottomLineAdditionalRater: string;
}

interface ChartData {
  identity: ChartIdentity;
  rankHistory: RibbonRankEntry[];
  planningDates: RibbonPlanningDate[];
  eligibility: EligibilityState;
  timeline: TimelineData;
  vectors: VectorRow[];
  familyTrackerEnabled: boolean;
  familyKids: FamilyKid[];
  jobExperiences: JobExperiences;
  highlights: Highlights;
  education: EducationAchievements;
  opbs: OpbEntry[];
}

interface RibbonSaveFile {
  schema: typeof SAVE_SCHEMA;
  schemaVersion: typeof SAVE_SCHEMA_VERSION;
  savedAt: string;
  data: ChartData;
}

interface DragState {
  rowId: string;
  segmentId: string;
  mode: DragMode;
  pointerId: number;
  startX: number;
  trackWidth: number;
  initialStart: number;
  initialEnd: number;
  lowerBound: number;
  upperBound: number;
  timelineStart: number;
  timelineEnd: number;
}

interface SelectedSegment {
  row: VectorRow;
  segment: VectorSegment;
}

type TimelineMilestone = [string, string];
type TimelineViewYears = 10 | 20;
type CareerViewAnchor = "ead" | "view";
type TimelineRowKey = keyof Omit<TimelineData, "eadYear" | "startingYear">;
interface TimelineCellInfo {
  title: string;
  milestones: TimelineMilestone[];
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const snapHalfYear = (value: number) => Math.round(value * 2) / 2;
const blankRow = () => Array.from({ length: MAX_TIMELINE_YEARS }, () => "");
const clampTimelineYear = (value: number) => clamp(Number.isFinite(value) ? Math.round(value) : DEFAULT_STARTING_YEAR, 1980, 2055);

const colorFor = (colorId: VectorColorId) => VECTOR_COLORS.find((color) => color.id === colorId) ?? VECTOR_COLORS[0];

const yearsFor = (startingYear: number, count = MAX_TIMELINE_YEARS) => Array.from({ length: count }, (_, index) => startingYear + index);
const timelineDataIndexForYear = (eadYear: number, year: number) => {
  const index = year - eadYear;
  return index >= 0 && index < MAX_TIMELINE_YEARS ? index : null;
};
const getScodForRank = (rank: string) => SCOD_REFERENCE.dates[rank] ?? "Choose held grade";
const getTimelineCellInfo = (key: TimelineRowKey, label: string, year: number, dates: RibbonPlanningDate[] = []): TimelineCellInfo | null => {
  if (!["promotion", "leadership", "developmentalEducation"].includes(key) || !label.trim()) return null;
  return {
    title: `${label} — ${year} editable planning estimate`,
    milestones: [
      ...dates.filter((date) => date.date.startsWith(`${year}-`) && date.kind === (key === "promotion" ? "promotion" : key === "leadership" ? "command" : "education")).map<TimelineMilestone>((date) => [date.label || "Date estimate", `${date.date} — editable estimate`]),
      ["Authority", "No verified annual schedule is stored for this milestone."],
      ["Dates", "Enter the applicable dated announcement or your estimate in Planning dates below."],
      ["Promotion", "Board consideration and selection do not establish a pin-on date."],
      ["Verify", "Check the applicable annual MyFSS/PSDM/MyVector announcement and your competitive category."]
    ]
  };
};

const setLabelForYear = (row: string[], years: number[], targetYear: number, label: string) => {
  const index = years.findIndex((year) => year === targetYear);
  if (index >= 0) {
    row[index] = label;
  }
};

const setLabelForRange = (row: string[], years: number[], startYear: number, endYear: number, label: string) => {
  for (let year = startYear; year <= endYear; year += 1) {
    setLabelForYear(row, years, year, label);
  }
};

const buildTimelineRows = (eadYear: number, adjustedYearGroup: number) => {
  const years = yearsFor(eadYear);
  const promotion = blankRow();
  const leadership = blankRow();
  const developmentalEducation = blankRow();
  const careerFieldEducation = blankRow();

  PROMOTION_YEAR_GROUP_MILESTONES.forEach(({ label, offset }) => {
    setLabelForYear(promotion, years, adjustedYearGroup + offset, label);
  });

  setLabelForRange(careerFieldEducation, years, adjustedYearGroup + 6, adjustedYearGroup + 8, "Cyber 200");
  setLabelForRange(careerFieldEducation, years, adjustedYearGroup + 12, adjustedYearGroup + 15, "Cyber 300");

  setLabelForRange(developmentalEducation, years, adjustedYearGroup + 4, adjustedYearGroup + 7, "SOS");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 9, "IDE 1st Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 10, "IDE 2nd Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 11, "IDE 3rd Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 12, "IDE Last Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 16, "SDE 1st Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 17, "SDE 2nd Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 18, "SDE 3rd Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 19, "SDE 4th Look");
  setLabelForYear(developmentalEducation, years, adjustedYearGroup + 20, "SDE Last Look");

  setLabelForRange(leadership, years, adjustedYearGroup + 10, adjustedYearGroup + 12, "DO or CC");
  setLabelForRange(leadership, years, adjustedYearGroup + 13, adjustedYearGroup + 16, "Command");
  setLabelForRange(leadership, years, adjustedYearGroup + 17, adjustedYearGroup + 19, "CC or Gp/CD");

  return { promotion, leadership, developmentalEducation, careerFieldEducation };
};

const createDefaultFamilyKids = (): FamilyKid[] => (
  Array.from({ length: FAMILY_KID_COUNT }, (_, index) => ({
    id: `kid-${index + 1}`,
    enabled: false,
    label: "",
    startGrade: 0
  }))
);

const gradeLabelFor = (grade: number) => {
  if (grade <= -1) return "Pre-K";
  if (grade === 0) return "K";
  if (grade >= 13) return "Grad";
  return GRADE_OPTIONS.find((option) => option.value === grade)?.label ?? String(grade);
};

const normalizeGrade = (value: unknown) => {
  const grade = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;
  return grade;
};

const createDefaultChart = (): ChartData => {
  const eadYear = DEFAULT_EAD_YEAR;
  const startingYear = DEFAULT_STARTING_YEAR;
  const adjustedYearGroup = 2012;
  const rows = buildTimelineRows(eadYear, adjustedYearGroup);

  return {
    rankHistory: [],
    planningDates: [],
    identity: {
      rank: "Lt Col",
      name: "First, Last, Middle",
      jobLocation: "Job, Duty Location",
      dor: "13 Jan 2019",
      das: "13 Jan 2019",
      yearGroup: "2012",
      adjustedYearGroup: "2012"
    },
    eligibility: {
      de: { select: false, candidate: false },
      do: { select: false, candidate: false },
      sqCc: { select: false, candidate: false }
    },
    timeline: {
      eadYear,
      startingYear,
      ...rows,
      personal: blankRow()
    },
    vectors: [
      {
        id: "vec-1",
        label: "Vec 1",
        segments: [
          { id: "vec1-current", label: "Current Job", startYear: 2024, endYear: 2026, color: "green" },
          { id: "vec1-next", label: "XXXXXXXXXX", startYear: 2026, endYear: 2029, color: "green" },
          { id: "vec1-later", label: "XXXXXXXXXX", startYear: 2029, endYear: 2032, color: "green" },
          { id: "vec1-final", label: "XXXXXXXXXX", startYear: 2032, endYear: 2034, color: "green" }
        ]
      },
      {
        id: "vec-2",
        label: "Vec 2",
        segments: [
          { id: "vec2-current", label: "Current Job", startYear: 2024, endYear: 2025.5, color: "yellow" },
          { id: "vec2-one", label: "XXXXXXXXXX", startYear: 2025.5, endYear: 2027.5, color: "green" },
          { id: "vec2-two", label: "XXXXXXXXXX", startYear: 2027.5, endYear: 2029.5, color: "green" },
          { id: "vec2-three", label: "XXXXXXXXXX", startYear: 2029.5, endYear: 2031.5, color: "green" },
          { id: "vec2-four", label: "XXXXXXXXXX", startYear: 2031.5, endYear: 2034, color: "green" }
        ]
      },
      {
        id: "vec-3",
        label: "Vec 3",
        segments: [
          { id: "vec3-current", label: "Current Job", startYear: 2024, endYear: 2025.5, color: "green" },
          { id: "vec3-one", label: "XXXXXXXXXX", startYear: 2025.5, endYear: 2027.5, color: "green" },
          { id: "vec3-two", label: "XXXXXXXXXX", startYear: 2027.5, endYear: 2029.5, color: "green" },
          { id: "vec3-three", label: "XXXXXXXXXX", startYear: 2029.5, endYear: 2031.5, color: "green" },
          { id: "vec3-four", label: "XXXXXXXXXX", startYear: 2031.5, endYear: 2034, color: "green" }
        ]
      }
    ],
    familyTrackerEnabled: false,
    familyKids: createDefaultFamilyKids(),
    jobExperiences: {
      deployment: false,
      deployments: "",
      shortTour: false,
      returnDate: "",
      cyberEngineer: false,
      expedComms: false,
      dodinOps: false,
      dco: false,
      oco: false,
      crewCc: false,
      teamLead: false,
      fltCc: false,
      msnCc: false,
      directorOfOperations: false,
      detCc: false,
      cagExecAide: false,
      cagExecAideText: "",
      instructorUct: false,
      instructorCyber200Cyber300: false,
      instructorWic: false,
      instructorSosBmtOts: false,
      staffJoint: false,
      staffHaf: false,
      staffMajcom: false,
      staffNaf: false,
      jtQualified: false,
      jpmeI: false,
      jpmeIi: false,
      sqCcTours: false,
      sqCcToursText: ""
    },
    highlights: {
      operational: "",
      awards: "",
      certs: ""
    },
    education: {
      pde: false,
      pdeDetails: "",
      pdeDg: false,
      aad: false,
      aadDetails: "",
      honors: false,
      cyber200: false,
      cyber200Details: "",
      cyber300: false,
      cyber300Details: "",
      ide: false,
      ideProgram: "IDE Programs",
      ideDg: false,
      cyber400: false,
      cyber400Details: "",
      sde: false,
      sdeProgram: "SDE Programs",
      sdeDg: false,
      ewi: false,
      ews: false,
      asg: false,
      wic: false,
      wicDg: false,
      cnodp: false,
      darpa: false,
      ldc: false,
      c2wac: false,
      specialProgramsOther: ""
    },
    opbs: [
      { year: "2023", bottomLineRater: "", bottomLineAdditionalRater: "" },
      { year: "2022", bottomLineRater: "", bottomLineAdditionalRater: "" },
      { year: "2021", bottomLineRater: "", bottomLineAdditionalRater: "" }
    ]
  };
};

const normalizeStringArray = (value: unknown, length: number) => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, index) => (typeof source[index] === "string" ? source[index] : ""));
};

const normalizeFamilyKids = (value: unknown): FamilyKid[] => {
  const source = Array.isArray(value) ? value : [];
  const base = createDefaultFamilyKids();

  return base.map((fallback, index) => {
    const incoming = source[index] as Partial<FamilyKid> | undefined;
    return {
      ...incoming,
      id: typeof incoming?.id === "string" ? incoming.id : fallback.id,
      enabled: typeof incoming?.enabled === "boolean" ? incoming.enabled : fallback.enabled,
      label: typeof incoming?.label === "string" ? incoming.label : fallback.label,
      startGrade: normalizeGrade(incoming?.startGrade)
    };
  });
};

const normalizeVectorRows = (value: unknown, _timelineStart: number): VectorRow[] => {
  const incoming = (value ?? []) as VectorRow[];
  const usedIds = new Set(incoming.map((row) => row.id));
  return Array.from({ length: 3 }, (_, i) => {
    const row = incoming[i];
    if (row) return { ...row, segments: row.segments.map((segment) => ({ ...segment })).sort((a, b) => a.startYear - b.startYear) };
    let id = `vec-${i + 1}`;
    while (usedIds.has(id)) id = `empty-${id}`;
    usedIds.add(id);
    return { id, label: DEFAULT_VECTOR_ROW_LABELS[i], segments: [] };
  });
};

const normalizeJobExperiences = (value: unknown, base: JobExperiences): JobExperiences => {
  const incoming = value && typeof value === "object"
    ? value as Partial<JobExperiences> & { instructorUctCyberWic?: boolean }
    : {};
  const { instructorUctCyberWic, ...current } = incoming;
  const legacyInstructor = instructorUctCyberWic === true;

  return {
    ...base,
    ...current,
    instructorUct: current.instructorUct ?? legacyInstructor,
    instructorCyber200Cyber300: current.instructorCyber200Cyber300 ?? legacyInstructor,
    instructorWic: current.instructorWic ?? legacyInstructor
  };
};

const normalizeChart = (input: Partial<ChartData>): ChartData => {
  const base = createDefaultChart();
  const timelineStart = typeof input.timeline?.startingYear === "number" ? clampTimelineYear(input.timeline.startingYear) : base.timeline.startingYear;
  const timelineEad = typeof input.timeline?.eadYear === "number" ? clampTimelineYear(input.timeline.eadYear) : timelineStart;
  const legacyInput = input as Partial<ChartData> & { oprs?: OpbEntry[] };
  const incomingOpbs = Array.isArray(input.opbs) ? input.opbs : legacyInput.oprs;

  return {
    ...input,
    rankHistory: input.rankHistory ?? [],
    planningDates: input.planningDates ?? [],
    identity: { ...base.identity, jobLocation: "", dor: "", das: "", yearGroup: "", adjustedYearGroup: "", ...input.identity },
    eligibility: {
      ...input.eligibility,
      de: { ...base.eligibility.de, ...input.eligibility?.de },
      do: { ...base.eligibility.do, ...input.eligibility?.do },
      sqCc: { ...base.eligibility.sqCc, ...input.eligibility?.sqCc }
    },
    timeline: {
      ...input.timeline,
      eadYear: timelineEad,
      startingYear: timelineStart,
      promotion: normalizeStringArray(input.timeline?.promotion, MAX_TIMELINE_YEARS),
      leadership: normalizeStringArray(input.timeline?.leadership, MAX_TIMELINE_YEARS),
      developmentalEducation: normalizeStringArray(input.timeline?.developmentalEducation, MAX_TIMELINE_YEARS),
      careerFieldEducation: normalizeStringArray(input.timeline?.careerFieldEducation, MAX_TIMELINE_YEARS),
      personal: normalizeStringArray(input.timeline?.personal, MAX_TIMELINE_YEARS)
    },
    vectors: normalizeVectorRows(input.vectors, timelineEad),
    familyTrackerEnabled: typeof input.familyTrackerEnabled === "boolean" ? input.familyTrackerEnabled : base.familyTrackerEnabled,
    familyKids: normalizeFamilyKids(input.familyKids),
    jobExperiences: normalizeJobExperiences(input.jobExperiences, base.jobExperiences),
    highlights: { ...base.highlights, ...input.highlights },
    education: { ...base.education, ...input.education },
    opbs: Array.isArray(incomingOpbs) && incomingOpbs.length
      ? incomingOpbs.slice(0, 3).map((opb, index) => ({ ...base.opbs[index], ...opb }))
      : base.opbs.map((entry) => ({ ...entry, year: "" }))
  };
};

const fileSafeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ribbon-chart";
const createSegmentId = () => `segment-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const findSegmentNeighbors = (row: VectorRow, segmentId: string, timelineStart: number, timelineEnd: number) => {
  const ordered = row.segments.slice().sort((a, b) => a.startYear - b.startYear);
  const index = ordered.findIndex((segment) => segment.id === segmentId);
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
    lowerBound: index > 0 ? ordered[index - 1].endYear : timelineStart,
    upperBound: index >= 0 && index < ordered.length - 1 ? ordered[index + 1].startYear : timelineEnd
  };
};

const updateSegmentInRows = (rows: VectorRow[], rowId: string, segmentId: string, updater: (segment: VectorSegment) => VectorSegment) => (
  rows.map((row) => row.id === rowId
    ? {
        ...row,
        segments: row.segments
          .map((segment) => segment.id === segmentId ? updater(segment) : segment)
          .sort((a, b) => a.startYear - b.startYear)
      }
    : row
  )
);

const shiftVectorRows = (rows: VectorRow[], deltaYears: number): VectorRow[] => (
  rows.map((row) => ({
    ...row,
    segments: row.segments.map((segment) => ({
      ...segment,
      startYear: snapHalfYear(segment.startYear + deltaYears),
      endYear: snapHalfYear(segment.endYear + deltaYears)
    }))
  }))
);

const shiftFamilyKids = (kids: FamilyKid[], deltaYears: number): FamilyKid[] => (
  kids.map((kid) => ({
    ...kid,
    startGrade: shiftedGradeAnchor(kid.startGrade, deltaYears)
  }))
);

const CheckTile: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ label, checked, onChange, className = "", children }) => (
  <label className={`ribbon-check-tile ${checked ? "is-checked" : ""} ${className}`}>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
    <span>{label}</span>
    {children}
  </label>
);

const RibbonChartPage: React.FC = () => {
  const [chart, setChart] = useState<ChartData>(() => createDefaultChart());
  const timelineViewYears: TimelineViewYears = DEFAULT_TIMELINE_VIEW_YEARS;
  const [isCareerViewOpen, setCareerViewOpen] = useState(false);
  const [careerViewAnchor, setCareerViewAnchor] = useState<CareerViewAnchor>("ead");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>("vec1-current");
  const [promotionDropIndex, setPromotionDropIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRequest = useRef(0);
  const dirtyRef = useRef(false);
  const activeReader = useRef<FileReader | null>(null);
  const promotionDragRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragRef = useRef<DragState | null>(null);

  const years = useMemo(() => yearsFor(chart.timeline.startingYear, timelineViewYears), [chart.timeline.startingYear, timelineViewYears]);
  const rankScod = getScodForRank(chart.identity.rank);
  const scodTimeline = useMemo(
    () => yearsFor(chart.timeline.eadYear).map((year) => rankReferenceForYear(chart.identity, chart.rankHistory, year)),
    [chart.identity, chart.rankHistory, chart.timeline.eadYear]
  );
  const careerStart = chart.timeline.eadYear;
  const careerEnd = chart.timeline.eadYear + MAX_TIMELINE_YEARS;
  const timelineStart = chart.timeline.startingYear;
  const timelineEnd = chart.timeline.startingYear + timelineViewYears;
  const careerDisplayStart = careerViewAnchor === "ead" ? chart.timeline.eadYear : chart.timeline.startingYear;
  const careerDisplayEnd = careerDisplayStart + MAX_TIMELINE_YEARS;
  const careerYears = useMemo(() => yearsFor(careerDisplayStart, MAX_TIMELINE_YEARS), [careerDisplayStart]);
  const visibleCareerStart = Math.max(timelineStart, careerStart);
  const visibleCareerEnd = Math.min(timelineEnd, careerEnd);
  const ribbonSheetStyle = {
    "--ribbon-year-count": timelineViewYears,
    "--ribbon-sheet-min-width": "1180px"
  } as React.CSSProperties;

  const selectedSegment = useMemo<SelectedSegment | null>(() => {
    if (!selectedSegmentId) return null;
    for (const row of chart.vectors) {
      const segment = row.segments.find((candidate) => candidate.id === selectedSegmentId);
      if (segment) return { row, segment };
    }
    return null;
  }, [chart.vectors, selectedSegmentId]);

  useEffect(() => {
    if (!selectedSegmentId) return;
    const selectionStart = isCareerViewOpen ? careerDisplayStart : timelineStart;
    const selectionEnd = isCareerViewOpen ? careerDisplayEnd : timelineEnd;
    const visibleSegments = chart.vectors.flatMap((row) => (
      row.segments.filter((segment) => segment.endYear > Math.max(selectionStart, chart.timeline.eadYear) && segment.startYear < Math.min(selectionEnd, chart.timeline.eadYear + MAX_TIMELINE_YEARS))
    ));
    if (!visibleSegments.some((segment) => segment.id === selectedSegmentId)) {
      setSelectedSegmentId(visibleSegments[0]?.id ?? null);
    }
  }, [careerDisplayEnd, careerDisplayStart, chart.vectors, isCareerViewOpen, selectedSegmentId, timelineEnd, timelineStart]);

  useEffect(() => {
    if (!dirty) return undefined;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Keep the legacy fallback for browsers that still require returnValue.
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  useEffect(() => () => { importRequest.current += 1; activeReader.current?.abort(); }, []);

  useEffect(() => {
    if (!isCareerViewOpen) return undefined;
    const dialog = dialogRef.current; const modal = modalRef.current;
    if (!dialog || !modal) return undefined;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const isolated: Array<{ node: HTMLElement; inert: boolean; hidden: string | null }> = [];
    let branch: HTMLElement = modal;
    while (branch.parentElement) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling !== branch && sibling instanceof HTMLElement && !["SCRIPT", "STYLE"].includes(sibling.tagName)) {
          isolated.push({ node: sibling, inert: sibling.inert, hidden: sibling.getAttribute("aria-hidden") });
          sibling.inert = true; sibling.setAttribute("aria-hidden", "true");
        }
      }
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')).filter((el) => !el.closest('[inert], [hidden]'));
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setCareerViewOpen(false); }
      if (event.key === "Tab") {
        const items = focusable(); const first = items[0] ?? dialog; const last = items.at(-1) ?? dialog;
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    const keepFocus = (event: FocusEvent) => { if (event.target instanceof Node && !dialog.contains(event.target)) (focusable()[0] ?? dialog).focus(); };
    const priorOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    (dialog.querySelector<HTMLElement>('.ribbon-career-close-button') ?? dialog).focus();
    document.addEventListener("keydown", handleKeyDown); document.addEventListener("focusin", keepFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown); document.removeEventListener("focusin", keepFocus);
      for (const { node, inert, hidden } of isolated) { node.inert = inert; if (hidden === null) node.removeAttribute("aria-hidden"); else node.setAttribute("aria-hidden", hidden); }
      document.body.style.overflow = priorOverflow; if (opener?.isConnected) opener.focus();
    };
  }, [isCareerViewOpen]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const deltaYears = ((event.clientX - drag.startX) / drag.trackWidth) * (drag.timelineEnd - drag.timelineStart);
      let nextStart = drag.initialStart;
      let nextEnd = drag.initialEnd;

      if (drag.mode === "move") {
        const duration = drag.initialEnd - drag.initialStart;
        nextStart = clamp(snapHalfYear(drag.initialStart + deltaYears), drag.lowerBound, drag.upperBound - duration);
        nextEnd = nextStart + duration;
      }

      if (drag.mode === "resize-left") {
        nextStart = clamp(snapHalfYear(drag.initialStart + deltaYears), drag.lowerBound, drag.initialEnd - MIN_SEGMENT_YEARS);
      }

      if (drag.mode === "resize-right") {
        nextEnd = clamp(snapHalfYear(drag.initialEnd + deltaYears), drag.initialStart + MIN_SEGMENT_YEARS, drag.upperBound);
      }

      setChart((current) => ({
        ...current,
        vectors: updateSegmentInRows(current.vectors, drag.rowId, drag.segmentId, (segment) => ({
          ...segment,
          startYear: nextStart,
          endYear: nextEnd
        }))
      }));
      dirtyRef.current = true;
      setDirty(true);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (dragRef.current && event.pointerId === dragRef.current.pointerId) {
        dragRef.current = null;
        document.body.classList.remove("ribbon-is-dragging");
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const updateChart = (updater: (current: ChartData) => ChartData) => {
    setChart((current) => updater(current));
    dirtyRef.current = true;
    setDirty(true);
    setImportMessage("");
  };

  const updateIdentity = (key: keyof ChartIdentity, value: string) => {
    updateChart((current) => ({ ...current, identity: { ...current.identity, [key]: value } }));
  };

  const updateYearGroup = (value: string) => {
    updateChart((current) => ({
      ...current,
      identity: {
        ...current.identity,
        yearGroup: value,
        adjustedYearGroup: value
      }
    }));
  };

  const updateEligibility = (group: keyof EligibilityState, key: keyof EligibilityGroup, value: boolean) => {
    updateChart((current) => ({
      ...current,
      eligibility: {
        ...current.eligibility,
        [group]: { ...current.eligibility[group], [key]: value }
      }
    }));
  };

  const updateTimelineCell = (key: TimelineRowKey, index: number, value: string) => {
    updateChart((current) => {
      const row = current.timeline[key].slice();
      row[index] = value;
      return { ...current, timeline: { ...current.timeline, [key]: row } };
    });
  };

  const movePromotionMilestone = (sourceIndex: number, targetIndex: number) => {
    if (
      sourceIndex === targetIndex ||
      sourceIndex < 0 ||
      sourceIndex >= MAX_TIMELINE_YEARS ||
      targetIndex < 0 ||
      targetIndex >= MAX_TIMELINE_YEARS
    ) {
      return;
    }

    updateChart((current) => {
      const promotion = current.timeline.promotion.slice();
      const moving = promotion[sourceIndex];
      if (!moving) return current;
      promotion[sourceIndex] = promotion[targetIndex] ?? "";
      promotion[targetIndex] = moving;
      return { ...current, timeline: { ...current.timeline, promotion } };
    });
  };

  const updateTimelineStart = (value: number) => {
    const nextYear = clampTimelineYear(value);
    updateChart((current) => {
      const deltaYears = nextYear - current.timeline.startingYear;
      return {
        ...current,
        timeline: { ...current.timeline, startingYear: nextYear },
        familyKids: shiftFamilyKids(current.familyKids, deltaYears)
      };
    });
  };

  const updateTimelineEad = (value: number) => {
    const nextYear = clampTimelineYear(value);
    updateChart((current) => {
      const deltaYears = nextYear - current.timeline.eadYear;
      return {
        ...current,
        timeline: { ...current.timeline, eadYear: nextYear },
        vectors: shiftVectorRows(current.vectors, deltaYears)
      };
    });
  };

  const populateTimeline = () => {
    updateChart((current) => ({
      ...current,
      timeline: {
        ...current.timeline,
        ...buildTimelineRows(current.timeline.eadYear, Number(current.identity.adjustedYearGroup))
      },
      opbs: current.opbs.map((opb, index) => ({
        ...opb,
        year: String(current.timeline.startingYear - index - 1)
      }))
    }));
  };

  const updateJobExperience = <K extends keyof JobExperiences>(key: K, value: JobExperiences[K]) => {
    updateChart((current) => ({ ...current, jobExperiences: { ...current.jobExperiences, [key]: value } }));
  };

  const updateHighlights = <K extends keyof Highlights>(key: K, value: Highlights[K]) => {
    updateChart((current) => ({ ...current, highlights: { ...current.highlights, [key]: value } }));
  };

  const updateEducation = <K extends keyof EducationAchievements>(key: K, value: EducationAchievements[K]) => {
    updateChart((current) => ({ ...current, education: { ...current.education, [key]: value } }));
  };

  const updateOpb = (index: number, key: keyof OpbEntry, value: string) => {
    updateChart((current) => {
      const opbs = current.opbs.slice();
      opbs[index] = { ...opbs[index], [key]: value };
      return { ...current, opbs };
    });
  };

  const beginSegmentDrag = (
    event: React.PointerEvent<HTMLElement>,
    row: VectorRow,
    segment: VectorSegment,
    mode: DragMode,
    displayStart = timelineStart,
    displayEnd = timelineEnd,
    trackKey = row.id
  ) => {
    const track = trackRefs.current[trackKey];
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const neighbors = findSegmentNeighbors(row, segment.id, careerStart, careerEnd);

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedSegmentId(segment.id);
    dragRef.current = {
      rowId: row.id,
      segmentId: segment.id,
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      trackWidth: rect.width,
      initialStart: segment.startYear,
      initialEnd: segment.endYear,
      lowerBound: neighbors.lowerBound,
      upperBound: neighbors.upperBound,
      timelineStart: displayStart,
      timelineEnd: displayEnd
    };
    document.body.classList.add("ribbon-is-dragging");
  };

  const updateSelectedSegment = (patch: Partial<VectorSegment>) => {
    if (!selectedSegment) return;
    updateChart((current) => ({
      ...current,
      vectors: updateSegmentInRows(current.vectors, selectedSegment.row.id, selectedSegment.segment.id, (segment) => ({
        ...segment,
        ...patch
      }))
    }));
  };

  const updateSelectedSegmentBounds = (key: "startYear" | "endYear", value: number) => {
    if (!selectedSegment) return;
    const neighbors = findSegmentNeighbors(selectedSegment.row, selectedSegment.segment.id, careerStart, careerEnd);
    const snapped = snapHalfYear(value);

    if (key === "startYear") {
      updateSelectedSegment({
        startYear: clamp(Number.isFinite(snapped) ? snapped : selectedSegment.segment.startYear, neighbors.lowerBound, selectedSegment.segment.endYear - MIN_SEGMENT_YEARS)
      });
    } else {
      updateSelectedSegment({
        endYear: clamp(Number.isFinite(snapped) ? snapped : selectedSegment.segment.endYear, selectedSegment.segment.startYear + MIN_SEGMENT_YEARS, neighbors.upperBound)
      });
    }
  };

  const updateVectorRowLabel = (rowId: string, label: string) => {
    updateChart((current) => ({
      ...current,
      vectors: current.vectors.map((row) => row.id === rowId ? { ...row, label } : row)
    }));
  };

  const updateFamilyTrackerEnabled = (enabled: boolean) => {
    updateChart((current) => ({ ...current, familyTrackerEnabled: enabled }));
  };

  const updateFamilyKid = <K extends keyof FamilyKid>(index: number, key: K, value: FamilyKid[K]) => {
    updateChart((current) => {
      const familyKids = current.familyKids.slice();
      familyKids[index] = { ...familyKids[index], [key]: value };
      return { ...current, familyKids };
    });
  };

  const renderFamilyCell = (year: number) => {
    const gradeOffset = year - chart.timeline.startingYear;
    return (
      <div key={`family-${year}`} className="ribbon-family-cell" aria-label={`Kids grades ${year}`}>
        {chart.familyKids.map((kid, kidIndex) => {
          if (!kid.enabled) return null;
          const label = kid.label.trim() || `Kid ${kidIndex + 1}`;
          const grade = gradeLabelFor(kid.startGrade + gradeOffset);
          return <span key={kid.id} title={`${label}: ${grade}`}>{label}: {grade}</span>;
        })}
      </div>
    );
  };

  const addSegmentToRow = (row: VectorRow, displayStart = visibleCareerStart, displayEnd = visibleCareerEnd) => {
    const addStart = Math.max(displayStart, careerStart);
    const addEnd = Math.min(displayEnd, careerEnd);

    if (addEnd - addStart < 1) {
      setImportMessage("Move Start Year inside the EAD 30-year window before adding a vector block.");
      return;
    }

    const ordered = row.segments.slice().sort((a, b) => a.startYear - b.startYear);
    const boundaries = [
      { start: addStart, end: ordered[0]?.startYear ?? addEnd },
      ...ordered.map((segment, index) => ({
        start: segment.endYear,
        end: ordered[index + 1]?.startYear ?? addEnd
      }))
    ].map((candidate) => ({
      start: Math.max(candidate.start, addStart),
      end: Math.min(candidate.end, addEnd)
    }));
    const gap = boundaries.find((candidate) => candidate.end - candidate.start >= 1);

    if (!gap) {
      setImportMessage("That vector row is full. Shrink or delete a block before adding another.");
      return;
    }

    const nextSegment: VectorSegment = {
      id: createSegmentId(),
      label: "New block",
      startYear: gap.start,
      endYear: Math.min(gap.start + 1, gap.end),
      color: "blue"
    };

    updateChart((current) => ({
      ...current,
      vectors: current.vectors.map((candidate) => candidate.id === row.id
        ? { ...candidate, segments: [...candidate.segments, nextSegment].sort((a, b) => a.startYear - b.startYear) }
        : candidate
      )
    }));
    setSelectedSegmentId(nextSegment.id);
  };

  const deleteSelectedSegment = () => {
    if (!selectedSegment) return;
    const vectors = chart.vectors.map((row) => row.id === selectedSegment.row.id
      ? { ...row, segments: row.segments.filter((segment) => segment.id !== selectedSegment.segment.id) }
      : row
    );
    setSelectedSegmentId(vectors.flatMap((row) => row.segments)[0]?.id ?? null);
    updateChart((current) => ({ ...current, vectors }));
  };

  const saveChart = () => {
    const payload: RibbonSaveFile = {
      schema: SAVE_SCHEMA,
      schemaVersion: SAVE_SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      data: chart
    };
    try { extractRibbonChartData(payload); } catch (error) { setImportMessage(error instanceof Error ? error.message : "Review the chart before saving."); return; }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileSafeName(chart.identity.name)}-17x-ribbon-chart.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    dirtyRef.current = false;
    setDirty(false);
    setImportMessage("Saved chart file.");
  };

  const loadChartFile = (file: File) => {
    const request = ++importRequest.current;
    activeReader.current?.abort();
    if (!file.name.toLowerCase().endsWith(".json") || file.size > RIBBON_MAX_FILE_BYTES) { setImportMessage("Choose a ribbon-chart .json file smaller than 2 MB."); return; }
    const reader = new FileReader(); activeReader.current = reader;
    reader.onload = () => {
      if (request !== importRequest.current) return;
      try {
        const data = extractRibbonChartData(JSON.parse(String(reader.result)) as unknown);
        const normalized = normalizeChart(data as unknown as Partial<ChartData>);
        if (dirtyRef.current && !window.confirm("Replace this chart and discard its unsaved changes? Save first if you want to keep them.")) { setImportMessage("Load canceled; current chart retained."); return; }
        if (request !== importRequest.current) return;
        dragRef.current = null; document.body.classList.remove("ribbon-is-dragging");
        setChart(normalized);
        setSelectedSegmentId(normalized.vectors.flatMap((row) => row.segments)[0]?.id ?? null);
        dirtyRef.current = false; setDirty(false);
        setImportMessage(["Loaded chart file.", ...ribbonImportWarnings(data)].join(" "));
      } catch (error) { setImportMessage(error instanceof Error ? error.message : "Could not read this chart; current chart retained."); }
    };
    reader.onerror = () => { if (request === importRequest.current) setImportMessage("Could not read this file; current chart retained."); };
    reader.readAsText(file);
  };

  const resetChart = () => {
    if (!window.confirm("Reset this chart to the default template?")) return;
    importRequest.current += 1; activeReader.current?.abort();
    dragRef.current = null; document.body.classList.remove("ribbon-is-dragging");
    const next = createDefaultChart();
    setChart(next);
    setSelectedSegmentId("vec1-current");
    dirtyRef.current = false;
    setDirty(false);
    setImportMessage("Reset chart.");
  };

  const renderTimelineCell = (
    label: string,
    key: TimelineRowKey,
    year: number,
    index: number,
    yearCount: number,
    isCareerOverview = false
  ) => {
    const dataIndex = timelineDataIndexForYear(chart.timeline.eadYear, year);
    if (key === "promotion") {
      return renderPromotionCell(label, year, index, yearCount, dataIndex, isCareerOverview);
    }

    if (dataIndex === null) {
      return (
        <input
          key={`${key}-${year}`}
          className="ribbon-cell-input ribbon-cell-input-outside"
          value=""
          placeholder="-"
          disabled
          readOnly
          aria-label={`${label} ${year} outside EAD window`}
        />
      );
    }

    const value = chart.timeline[key][dataIndex] ?? "";
    const cellInfo = getTimelineCellInfo(key, value, year, chart.planningDates);

    if (isCareerOverview) {
      return (
        <textarea
          key={`${key}-${year}`}
          className="ribbon-cell-input ribbon-career-cell-textarea"
          rows={2}
          value={value}
          onChange={(event) => updateTimelineCell(key, dataIndex, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
      );
    }

    if (!cellInfo) {
      return (
        <input
          key={`${key}-${year}`}
          className="ribbon-cell-input"
          value={value}
          onChange={(event) => updateTimelineCell(key, dataIndex, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
      );
    }

    const tooltipId = `${isCareerOverview ? "career" : "main"}-${key}-${year}-cycle-info`;
    const edgeClass = index <= 1 ? " ribbon-info-cell-left-edge" : index >= yearCount - 2 ? " ribbon-info-cell-right-edge" : "";
    return (
      <div key={`${key}-${year}`} className={`ribbon-info-cell${edgeClass}`}>
        <input
          className="ribbon-cell-input"
          value={value}
          onChange={(event) => updateTimelineCell(key, dataIndex, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
        <button
          type="button"
          className="ribbon-cycle-info-button"
          aria-label={`${value} timeline dates`}
          aria-describedby={tooltipId}
        >
          i
        </button>
        <div id={tooltipId} className="ribbon-cycle-popover" role="tooltip">
          <strong>{cellInfo.title}</strong>
          <dl>
            {cellInfo.milestones.map(([milestone, timing], milestoneIndex) => (
              <div key={`${milestone}-${milestoneIndex}`}>
                <dt>{milestone}</dt>
                <dd>{timing}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  };

  const renderPromotionCell = (
    label: string,
    year: number,
    index: number,
    yearCount: number,
    dataIndex: number | null,
    isCareerOverview = false
  ) => {
    if (dataIndex === null) {
      return (
        <input
          key={`promotion-${year}`}
          className="ribbon-cell-input ribbon-cell-input-outside"
          value=""
          placeholder="-"
          disabled
          readOnly
          aria-label={`${label} ${year} outside EAD window`}
        />
      );
    }

    const value = chart.timeline.promotion[dataIndex] ?? "";
    const cellInfo = getTimelineCellInfo("promotion", value, year, chart.planningDates);

    if (isCareerOverview) {
      return (
        <textarea
          key={`promotion-${year}`}
          className={`ribbon-cell-input ribbon-career-cell-textarea ribbon-career-promotion-cell${value ? " has-promotion" : ""}`}
          rows={2}
          value={value}
          onChange={(event) => updateTimelineCell("promotion", dataIndex, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
      );
    }

    const tooltipId = `${isCareerOverview ? "career" : "main"}-promotion-${year}-cycle-info`;
    const edgeClass = index <= 1 ? " ribbon-info-cell-left-edge" : index >= yearCount - 2 ? " ribbon-info-cell-right-edge" : "";
    const cellClass = [
      "ribbon-info-cell",
      "ribbon-promotion-cell",
      edgeClass,
      value ? "has-promotion" : "",
      promotionDropIndex === dataIndex ? "is-drop-target" : ""
    ].filter(Boolean).join(" ");

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const sourceIndex = promotionDropSource(Array.from(event.dataTransfer.types), event.dataTransfer.getData("application/x-ribbon-promotion-index"), promotionDragRef.current);
      if (sourceIndex !== null) {
        movePromotionMilestone(sourceIndex, dataIndex);
      }
      promotionDragRef.current = null;
      setPromotionDropIndex(null);
    };

    return (
      <div
        key={`promotion-${year}`}
        className={cellClass}
        onDragEnter={(event) => {
          if (promotionDragRef.current === null || !Array.from(event.dataTransfer.types).includes("application/x-ribbon-promotion-index")) return;
          event.preventDefault();
          setPromotionDropIndex(dataIndex);
        }}
        onDragOver={(event) => {
          if (promotionDragRef.current === null || !Array.from(event.dataTransfer.types).includes("application/x-ribbon-promotion-index")) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setPromotionDropIndex(dataIndex);
        }}
        onDragLeave={() => {
          if (promotionDropIndex === dataIndex) setPromotionDropIndex(null);
        }}
        onDrop={handleDrop}
      >
        <input
          className="ribbon-cell-input"
          value={value}
          onChange={(event) => updateTimelineCell("promotion", dataIndex, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
        {value && (
          <button
            type="button"
            className="ribbon-promotion-drag-handle"
            draggable
            aria-label={`Move ${value}`}
            title="Drag to move promotion year. Arrow keys move one year."
            onDragStart={(event) => {
              promotionDragRef.current = dataIndex;
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("application/x-ribbon-promotion-index", String(dataIndex));
            }}
            onDragEnd={() => {
              promotionDragRef.current = null;
              setPromotionDropIndex(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                movePromotionMilestone(dataIndex, dataIndex - 1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                movePromotionMilestone(dataIndex, dataIndex + 1);
              }
            }}
          >
            Drag
          </button>
        )}
        {cellInfo && (
          <>
            <button
              type="button"
              className="ribbon-cycle-info-button"
              aria-label={`${value} timeline dates`}
              aria-describedby={tooltipId}
            >
              i
            </button>
            <div id={tooltipId} className="ribbon-cycle-popover" role="tooltip">
              <strong>{cellInfo.title}</strong>
              <dl>
                {cellInfo.milestones.map(([milestone, timing], milestoneIndex) => (
                  <div key={`${milestone}-${milestoneIndex}`}>
                    <dt>{milestone}</dt>
                    <dd>{timing}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTimelineRow = (label: string, key: TimelineRowKey, displayYears: number[], isCareerOverview = false) => (
    <>
      <div className="ribbon-timeline-label">{label}</div>
      {displayYears.map((year, index) => renderTimelineCell(label, key, year, index, displayYears.length, isCareerOverview))}
    </>
  );

  const renderTimelineGrid = (displayYears: number[], className = "", scope = "main") => {
    const yearCount = displayYears.length;
    const displayStart = displayYears[0] ?? timelineStart;
    const displayEnd = displayStart + yearCount;
    const isCareerOverview = scope === "career";
    const gridStyle = { "--ribbon-year-count": yearCount } as React.CSSProperties;

    return (
      <div className={`ribbon-timeline-grid ${className}`} style={gridStyle}>
        <div className="ribbon-timeline-label">Pin-on history</div>
        {displayYears.map((year) => <div key={`pin-on-${year}`} className="ribbon-family-cell ribbon-pin-on-cell" title={pinOnTimelineValue(chart, year) || "No dated pin-on entered"}>{pinOnTimelineValue(chart, year)}</div>)}
        {renderTimelineRow("Board estimates", "promotion", displayYears, isCareerOverview)}
        {renderTimelineRow("Leadership", "leadership", displayYears, isCareerOverview)}
        {renderTimelineRow("PME", "developmentalEducation", displayYears, isCareerOverview)}
        {renderTimelineRow("Career Field Edu", "careerFieldEducation", displayYears, isCareerOverview)}

        <div className="ribbon-timeline-label">Calendar Year</div>
        {displayYears.map((year) => <div key={year} className="ribbon-year-cell">{year}</div>)}

        <div className="ribbon-timeline-label ribbon-scod-label">SCOD reference</div>
        {displayYears.map((year) => {
          const dataIndex = timelineDataIndexForYear(chart.timeline.eadYear, year);
          const scodEntry = dataIndex === null ? null : scodTimeline[dataIndex];
          return (
            <div key={`scod-${year}`} className="ribbon-scod-cell" title={scodEntry ? `${scodEntry.rank}: ${scodEntry.basis}. Published SCOD reference; verify promotion-select rules and actual evaluation closeout.` : "No dated grade entered for this year; historical rank is unknown."}>
              {scodEntry?.scod ?? "-"}
            </div>
          );
        })}

        {chart.vectors.map((row, rowIndex) => {
          const trackKey = `${scope}-${row.id}`;
          return (
            <React.Fragment key={row.id}>
              <div className="ribbon-timeline-label ribbon-vector-label">
                <input
                  className="ribbon-vector-name-input"
                  value={row.label}
                  onChange={(event) => updateVectorRowLabel(row.id, event.currentTarget.value)}
                  placeholder={`Vec ${rowIndex + 1}`}
                  aria-label={`Vector ${rowIndex + 1} name`}
                />
                <button type="button" onClick={() => addSegmentToRow(row, displayStart, displayEnd)}>Add block</button>
              </div>
              <div
                className="ribbon-vector-track"
                ref={(node) => { trackRefs.current[trackKey] = node; }}
                style={{
                  gridColumn: `span ${yearCount}`,
                  backgroundSize: `${100 / yearCount}% 100%`
                }}
              >
                {row.segments.map((segment) => {
                  const color = colorFor(segment.color);
                  const visibleStart = Math.max(segment.startYear, displayStart, careerStart);
                  const visibleEnd = Math.min(segment.endYear, displayEnd, careerEnd);
                  if (visibleEnd <= visibleStart) return null;
                  const left = ((visibleStart - displayStart) / yearCount) * 100;
                  const width = ((visibleEnd - visibleStart) / yearCount) * 100;
                  return (
                    <div
                      key={segment.id}
                      className={`ribbon-vector-segment ${selectedSegmentId === segment.id ? "is-selected" : ""}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: color.background,
                        color: color.foreground
                      }}
                      onPointerDown={(event) => beginSegmentDrag(event, row, segment, "move", displayStart, displayEnd, trackKey)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${row.label} ${segment.label} ${segment.startYear} to ${segment.endYear}`}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedSegmentId(segment.id);
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="ribbon-vector-handle ribbon-vector-handle-left"
                        aria-label={`Resize start for ${segment.label}`}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          beginSegmentDrag(event, row, segment, "resize-left", displayStart, displayEnd, trackKey);
                        }}
                      />
                      <span>{segment.label}</span>
                      <button
                        type="button"
                        className="ribbon-vector-handle ribbon-vector-handle-right"
                        aria-label={`Resize end for ${segment.label}`}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          beginSegmentDrag(event, row, segment, "resize-right", displayStart, displayEnd, trackKey);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

        {chart.familyTrackerEnabled && (
          <>
            <div className="ribbon-timeline-label ribbon-family-label">Kids Grades</div>
            {displayYears.map((year) => renderFamilyCell(year))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="pbv-ribbon">
      <header className="ribbon-toolbar">
        <div>
          <p className="ribbon-eyebrow">17X Ribbon Chart</p>
          <h1>Cyber Operations Officer Ribbon Chart</h1>
          <a className="ribbon-related-link" href="/17x-join-spouse">Compare two careers in the Join Spouse planner</a>
        </div>
        <div className="ribbon-actions" aria-label="Ribbon chart actions">
          <div className="ribbon-populate-group" aria-label="Timeline setup">
            <span className="ribbon-populate-title">Timeline Setup</span>
            <label className="ribbon-year-control">
              <span>EAD</span>
              <select
                value={chart.timeline.eadYear}
                onChange={(event) => updateTimelineEad(Number(event.currentTarget.value))}
              >
                {TIMELINE_YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="ribbon-year-control">
              <span>Start Year</span>
              <select
                value={chart.timeline.startingYear}
                onChange={(event) => updateTimelineStart(Number(event.currentTarget.value))}
              >
                {TIMELINE_YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="ribbon-year-control">
              <span>YG</span>
              <select value={chart.identity.yearGroup} onChange={(event) => updateYearGroup(event.currentTarget.value)}>
                {!YEAR_GROUP_OPTIONS.includes(chart.identity.yearGroup) && <option value={chart.identity.yearGroup}>{chart.identity.yearGroup || "Choose year"}</option>}
                {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="ribbon-year-control">
              <span>Adj YG</span>
              <select value={chart.identity.adjustedYearGroup} onChange={(event) => updateIdentity("adjustedYearGroup", event.currentTarget.value)}>
                {!YEAR_GROUP_OPTIONS.includes(chart.identity.adjustedYearGroup) && <option value={chart.identity.adjustedYearGroup}>{chart.identity.adjustedYearGroup || "Choose year"}</option>}
                {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <div className="ribbon-view-toggle">
              <span>View</span>
              <button type="button" className="ribbon-career-open-button" aria-haspopup="dialog" onClick={() => setCareerViewOpen(true)}>
                Open 30 Year View
              </button>
            </div>
            <label className="ribbon-feature-toggle">
              <span>Kids</span>
              <input
                type="checkbox"
                checked={chart.familyTrackerEnabled}
                onChange={(event) => updateFamilyTrackerEnabled(event.currentTarget.checked)}
              />
              <i aria-hidden="true" />
            </label>
            <button type="button" className="ribbon-populate-button" onClick={populateTimeline}>Populate Timeline</button>
          </div>
          <div className="ribbon-file-actions">
            <button type="button" onClick={saveChart}>Save</button>
            <button type="button" onClick={() => fileInputRef.current?.click()}>Load</button>
            <button type="button" onClick={() => window.print()}>Print</button>
            <button type="button" onClick={resetChart}>Reset</button>
          </div>
          <input
            ref={fileInputRef}
            className="ribbon-file-input"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) loadChartFile(file);
              event.currentTarget.value = "";
            }}
          />
        </div>
      </header>

      <section className="ribbon-planning-panel" aria-labelledby="ribbon-planning-title">
        <h2 id="ribbon-planning-title">Rank history and planning dates</h2>
        <p>The rank selector is your current held grade. Dated pin-on entries establish grade history; board consideration and selection remain separate. Dates you enter are planning data, not verified orders.</p>
        <p><a href={SCOD_REFERENCE.url} target="_blank" rel="noreferrer">Published SCOD reference — 17 February 2022</a>: recurring grade dates, phased in during 2022–2023. The chart shows a year-end grade reference, not a determination of your actual evaluation closeout. Promotion-select rules and unit/myEval records can change applicability.</p>
        <details>
          <summary>Enter dated pin-on history</summary>
          <p>Current rank/DOR supplies one dated anchor when DOR is valid. Earlier grades remain unknown until entered. Future pin-on dates should be marked Estimate.</p>
          {chart.rankHistory.map((entry, index) => (
            <div className="ribbon-planning-entry" key={entry.id}>
              <label>Grade <select value={entry.rank} onChange={(event) => { const rank = event.target.value; updateChart((current) => ({ ...current, rankHistory: current.rankHistory.map((v) => v.id === entry.id ? { ...v, rank } : v) })); }}>{RANK_OPTIONS.map((rank) => <option key={rank}>{rank}</option>)}</select></label>
              <label>Pin-on date <input type="date" value={entry.date} onChange={(event) => { const date = event.target.value; updateChart((current) => ({ ...current, rankHistory: current.rankHistory.map((v) => v.id === entry.id ? { ...v, date } : v) })); }} /></label>
              <label>Basis <select value={entry.basis} onChange={(event) => { const basis = event.target.value as RibbonRankEntry["basis"]; updateChart((current) => ({ ...current, rankHistory: current.rankHistory.map((v) => v.id === entry.id ? { ...v, basis } : v) })); }}><option value="entered">Entered history</option><option value="estimate">Estimate</option></select></label>
              <button type="button" aria-label={`Remove pin-on entry ${index + 1}`} onClick={() => updateChart((current) => ({ ...current, rankHistory: current.rankHistory.filter((v) => v.id !== entry.id) }))}>Remove</button>
            </div>
          ))}
          <button type="button" disabled={chart.rankHistory.length >= 80} onClick={() => updateChart((current) => ({ ...current, rankHistory: [...current.rankHistory, { id: createSegmentId(), rank: "2d Lt", date: "", basis: "entered" }] }))}>Add pin-on entry</button>
        </details>
        <details>
          <summary>Enter editable board, school and command date estimates</summary>
          <p>No verified annual schedule is included. Populate Timeline creates editable year-group estimates; it does not copy CY26 dates into other years. Add dates from your applicable announcement and verify them before taking action.</p>
          {chart.planningDates.map((entry, index) => (
            <div className="ribbon-planning-entry" key={entry.id}>
              <label>Milestone <input value={entry.label} maxLength={500} onChange={(event) => { const label = event.target.value; updateChart((current) => ({ ...current, planningDates: current.planningDates.map((v) => v.id === entry.id ? { ...v, label } : v) })); }} /></label>
              <label>Date estimate <input type="date" value={entry.date} onChange={(event) => { const date = event.target.value; updateChart((current) => ({ ...current, planningDates: current.planningDates.map((v) => v.id === entry.id ? { ...v, date } : v) })); }} /></label>
              <label>Category <select value={entry.kind} onChange={(event) => { const kind = event.target.value as RibbonPlanningDate["kind"]; updateChart((current) => ({ ...current, planningDates: current.planningDates.map((v) => v.id === entry.id ? { ...v, kind } : v) })); }}><option value="promotion">Board</option><option value="education">School</option><option value="command">Command</option></select></label>
              <span>Editable estimate</span><button type="button" aria-label={`Remove planning date ${index + 1}`} onClick={() => updateChart((current) => ({ ...current, planningDates: current.planningDates.filter((v) => v.id !== entry.id) }))}>Remove</button>
            </div>
          ))}
          <button type="button" disabled={chart.planningDates.length >= 150} onClick={() => updateChart((current) => ({ ...current, planningDates: [...current.planningDates, { id: createSegmentId(), label: "", date: "", kind: "promotion" }] }))}>Add planning date</button>
        </details>
      </section>

      {importMessage && <p className="ribbon-status" role="status">{importMessage}</p>}

      <div className="ribbon-scroll">
        <section className="ribbon-sheet" style={ribbonSheetStyle} aria-label="Cyber Operations Officer Ribbon Chart editor">
          <header className="ribbon-sheet-header">
            <div className="ribbon-badge" aria-hidden="true">
              <span>17X</span>
            </div>
            <div className="ribbon-title-block">
              <div className="ribbon-title-row">
                <h2>Cyber Operations Officer Ribbon Chart</h2>
                <span>Version {RIBBON_CHART_VERSION}</span>
              </div>
              <div className="ribbon-identity-row">
                <div className="ribbon-rank-cell">
                  <select value={chart.identity.rank} onChange={(event) => updateIdentity("rank", event.currentTarget.value)} aria-label="Current rank">
                    {!RANK_OPTIONS.includes(chart.identity.rank) && <option value={chart.identity.rank}>Legacy {chart.identity.rank}: choose held grade</option>}
                    {RANK_OPTIONS.map((rank) => <option key={rank} value={rank}>{rank}</option>)}
                  </select>
                  <span className="ribbon-scod-pill">Current grade reference: {rankScod}</span>
                </div>
                <input value={chart.identity.name} onChange={(event) => updateIdentity("name", event.currentTarget.value)} aria-label="Name" />
                <label>
                  <span>DOR</span>
                  <input value={chart.identity.dor} onChange={(event) => updateIdentity("dor", event.currentTarget.value)} />
                </label>
                <label>
                  <span>DAS</span>
                  <input value={chart.identity.das} onChange={(event) => updateIdentity("das", event.currentTarget.value)} />
                </label>
                <label>
                  <span>YG</span>
                  <input className="ribbon-linked-field" value={chart.identity.yearGroup} readOnly aria-label="Year group from Timeline Setup" />
                </label>
              </div>
              <div className="ribbon-identity-row ribbon-identity-row-secondary">
                <input value={chart.identity.jobLocation} onChange={(event) => updateIdentity("jobLocation", event.currentTarget.value)} aria-label="Job and duty location" />
                <label>
                  <span>Adj YG</span>
                  <input className="ribbon-linked-field" value={chart.identity.adjustedYearGroup} readOnly aria-label="Adjusted year group from Timeline Setup" />
                </label>
              </div>
              <div className="ribbon-eligibility-row">
                {([
                  ["de", "DE"],
                  ["do", "DO"],
                  ["sqCc", "Sq/CC"]
                ] as const).map(([group, label]) => (
                  <fieldset key={group}>
                    <legend>{label}</legend>
                    <CheckTile label="Select" checked={chart.eligibility[group].select} onChange={(checked) => updateEligibility(group, "select", checked)} />
                    <CheckTile label="Candidate" checked={chart.eligibility[group].candidate} onChange={(checked) => updateEligibility(group, "candidate", checked)} />
                  </fieldset>
                ))}
              </div>
            </div>
          </header>

          {renderTimelineGrid(years)}

          <section className="ribbon-segment-editor" aria-label="Selected vector block">
            {selectedSegment ? (
              <>
                <div className="ribbon-segment-heading">
                  <strong>{selectedSegment.row.label}</strong>
                  <span>{selectedSegment.segment.startYear} to {selectedSegment.segment.endYear}</span>
                </div>
                <label>
                  <span>Label</span>
                  <input value={selectedSegment.segment.label} onChange={(event) => updateSelectedSegment({ label: event.currentTarget.value })} />
                </label>
                <label>
                  <span>Start</span>
                  <input
                    type="number"
                    step={0.5}
                    min={careerStart}
                    max={selectedSegment.segment.endYear - MIN_SEGMENT_YEARS}
                    value={selectedSegment.segment.startYear}
                    onChange={(event) => updateSelectedSegmentBounds("startYear", Number(event.currentTarget.value))}
                  />
                </label>
                <label>
                  <span>End</span>
                  <input
                    type="number"
                    step={0.5}
                    min={selectedSegment.segment.startYear + MIN_SEGMENT_YEARS}
                    max={careerEnd}
                    value={selectedSegment.segment.endYear}
                    onChange={(event) => updateSelectedSegmentBounds("endYear", Number(event.currentTarget.value))}
                  />
                </label>
                <div className="ribbon-color-swatches" role="radiogroup" aria-label="Vector color">
                  {VECTOR_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      className={selectedSegment.segment.color === color.id ? "is-selected" : ""}
                      style={{ backgroundColor: color.background }}
                      aria-label={color.label}
                      onClick={() => updateSelectedSegment({ color: color.id })}
                    />
                  ))}
                </div>
                <button type="button" className="ribbon-delete-button" onClick={deleteSelectedSegment}>Delete block</button>
              </>
            ) : (
              <p>No vector block selected.</p>
            )}
          </section>

          {chart.familyTrackerEnabled && (
            <section className="ribbon-family-editor" aria-label="Kids grade tracker">
              <div className="ribbon-family-editor-heading">
                <strong>Kids Grade Tracker</strong>
                <span>Set each kid's grade for fall {chart.timeline.startingYear}; each year increments by one.</span>
              </div>
              {chart.familyKids.map((kid, index) => (
                <div key={kid.id} className="ribbon-family-kid-editor">
                  <CheckTile
                    label={`Kid ${index + 1}`}
                    checked={kid.enabled}
                    onChange={(checked) => updateFamilyKid(index, "enabled", checked)}
                  />
                  <label>
                    <span>Name</span>
                    <input
                      value={kid.label}
                      onChange={(event) => updateFamilyKid(index, "label", event.currentTarget.value)}
                      placeholder="Initials or name"
                    />
                  </label>
                  <label>
                    <span>Fall {chart.timeline.startingYear}</span>
                    <select
                      value={Math.max(-1, Math.min(13, kid.startGrade))}
                      onChange={(event) => updateFamilyKid(index, "startGrade", Number(event.currentTarget.value))}
                    >
                      {GRADE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                </div>
              ))}
            </section>
          )}

          <div className="ribbon-lower-grid">
            <section className="ribbon-panel ribbon-job-panel">
              <h2>Job Experiences</h2>
              <div className="ribbon-panel-row">
                <CheckTile label="Deployment" checked={chart.jobExperiences.deployment} onChange={(checked) => updateJobExperience("deployment", checked)} />
                <input value={chart.jobExperiences.deployments} onChange={(event) => updateJobExperience("deployments", event.currentTarget.value)} placeholder="Deployments" />
                <CheckTile label="Short Tour" checked={chart.jobExperiences.shortTour} onChange={(checked) => updateJobExperience("shortTour", checked)} />
                <input value={chart.jobExperiences.returnDate} onChange={(event) => updateJobExperience("returnDate", event.currentTarget.value)} placeholder="Return Date [i]" />
              </div>
              <div className="ribbon-job-columns">
                <div>
                  <h3>Lines of Operation</h3>
                  <CheckTile label="Developer" checked={chart.jobExperiences.cyberEngineer} onChange={(checked) => updateJobExperience("cyberEngineer", checked)} />
                  <CheckTile label="Exped. Comms" checked={chart.jobExperiences.expedComms} onChange={(checked) => updateJobExperience("expedComms", checked)} />
                  <CheckTile label="DoDIN Ops" checked={chart.jobExperiences.dodinOps} onChange={(checked) => updateJobExperience("dodinOps", checked)} />
                  <CheckTile label="DCO" checked={chart.jobExperiences.dco} onChange={(checked) => updateJobExperience("dco", checked)} />
                  <CheckTile label="OCO" checked={chart.jobExperiences.oco} onChange={(checked) => updateJobExperience("oco", checked)} />
                </div>
                <div>
                  <h3>Leadership</h3>
                  <CheckTile label="Crew CC" checked={chart.jobExperiences.crewCc} onChange={(checked) => updateJobExperience("crewCc", checked)} />
                  <CheckTile label="CMF Team Lead" checked={chart.jobExperiences.teamLead} onChange={(checked) => updateJobExperience("teamLead", checked)} />
                  <CheckTile label="Flt CC" checked={chart.jobExperiences.fltCc} onChange={(checked) => updateJobExperience("fltCc", checked)} />
                  <CheckTile label="Msn CC" checked={chart.jobExperiences.msnCc} onChange={(checked) => updateJobExperience("msnCc", checked)} />
                  <CheckTile label="Sq/DO" checked={chart.jobExperiences.directorOfOperations} onChange={(checked) => updateJobExperience("directorOfOperations", checked)} />
                  <CheckTile label="Det CC" checked={chart.jobExperiences.detCc} onChange={(checked) => updateJobExperience("detCc", checked)} />
                </div>
              </div>
              <div className="ribbon-panel-row ribbon-job-text-row">
                <CheckTile label="Sq/CC Tours" checked={chart.jobExperiences.sqCcTours} onChange={(checked) => updateJobExperience("sqCcTours", checked)} />
                <input
                  value={chart.jobExperiences.sqCcToursText}
                  onChange={(event) => updateJobExperience("sqCcToursText", event.currentTarget.value)}
                  placeholder="List sq commanded"
                />
              </div>
              <div className="ribbon-panel-row ribbon-instructor-row">
                <span className="ribbon-row-label">Instructor</span>
                <div className="ribbon-instructor-options">
                  <CheckTile label="UCT" checked={chart.jobExperiences.instructorUct} onChange={(checked) => updateJobExperience("instructorUct", checked)} />
                  <CheckTile label="Cyber 200 / 300" checked={chart.jobExperiences.instructorCyber200Cyber300} onChange={(checked) => updateJobExperience("instructorCyber200Cyber300", checked)} />
                  <CheckTile label="WIC" checked={chart.jobExperiences.instructorWic} onChange={(checked) => updateJobExperience("instructorWic", checked)} />
                  <CheckTile label="SOS / BMT / OTS" checked={chart.jobExperiences.instructorSosBmtOts} onChange={(checked) => updateJobExperience("instructorSosBmtOts", checked)} />
                </div>
              </div>
              <div className="ribbon-panel-row ribbon-staff-row">
                <span className="ribbon-row-label">Staff</span>
                <div className="ribbon-staff-options">
                  <CheckTile label="Joint" checked={chart.jobExperiences.staffJoint} onChange={(checked) => updateJobExperience("staffJoint", checked)} />
                  <CheckTile label="HAF" checked={chart.jobExperiences.staffHaf} onChange={(checked) => updateJobExperience("staffHaf", checked)} />
                  <CheckTile label="MAJCOM" checked={chart.jobExperiences.staffMajcom} onChange={(checked) => updateJobExperience("staffMajcom", checked)} />
                  <CheckTile label="NAF" checked={chart.jobExperiences.staffNaf} onChange={(checked) => updateJobExperience("staffNaf", checked)} />
                  <CheckTile label="JT Qualified [i]" checked={chart.jobExperiences.jtQualified} onChange={(checked) => updateJobExperience("jtQualified", checked)} />
                  <CheckTile label="JPME I" checked={chart.jobExperiences.jpmeI} onChange={(checked) => updateJobExperience("jpmeI", checked)} />
                  <CheckTile label="JPME II" checked={chart.jobExperiences.jpmeIi} onChange={(checked) => updateJobExperience("jpmeIi", checked)} />
                </div>
              </div>
              <div className="ribbon-panel-row ribbon-job-text-row">
                <CheckTile label="CAG / Exec / Aide" checked={chart.jobExperiences.cagExecAide} onChange={(checked) => updateJobExperience("cagExecAide", checked)} />
                <input
                  value={chart.jobExperiences.cagExecAideText}
                  onChange={(event) => updateJobExperience("cagExecAideText", event.currentTarget.value)}
                  placeholder="Level / Role"
                />
              </div>
            </section>

            <section className="ribbon-panel ribbon-highlights-panel">
              <h2>Highlights</h2>
              <label>
                <span>Operational Experiences: [i]</span>
                <textarea value={chart.highlights.operational} onChange={(event) => updateHighlights("operational", event.currentTarget.value)} />
              </label>
              <label>
                <span>Awards (Wg Lvl or Equiv & higher): [i]</span>
                <textarea value={chart.highlights.awards} onChange={(event) => updateHighlights("awards", event.currentTarget.value)} />
              </label>
              <label>
                <span>Certs/Professional Courses/Published Articles: [i]</span>
                <textarea value={chart.highlights.certs} onChange={(event) => updateHighlights("certs", event.currentTarget.value)} />
              </label>
            </section>

            <section className="ribbon-panel ribbon-education-panel">
              <h2>Education/Professional Achievements</h2>
              <div className="ribbon-education-row">
                <CheckTile label="PDE" checked={chart.education.pde} onChange={(checked) => updateEducation("pde", checked)} />
                <input value={chart.education.pdeDetails} onChange={(event) => updateEducation("pdeDetails", event.currentTarget.value)} />
                <CheckTile label="DG" checked={chart.education.pdeDg} onChange={(checked) => updateEducation("pdeDg", checked)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="AAD" checked={chart.education.aad} onChange={(checked) => updateEducation("aad", checked)} />
                <input value={chart.education.aadDetails} onChange={(event) => updateEducation("aadDetails", event.currentTarget.value)} />
                <CheckTile label="Honors" checked={chart.education.honors} onChange={(checked) => updateEducation("honors", checked)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="Cyber 200" checked={chart.education.cyber200} onChange={(checked) => updateEducation("cyber200", checked)} />
                <input value={chart.education.cyber200Details} onChange={(event) => updateEducation("cyber200Details", event.currentTarget.value)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="Cyber 300" checked={chart.education.cyber300} onChange={(checked) => updateEducation("cyber300", checked)} />
                <input value={chart.education.cyber300Details} onChange={(event) => updateEducation("cyber300Details", event.currentTarget.value)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="IDE" checked={chart.education.ide} onChange={(checked) => updateEducation("ide", checked)} />
                <input
                  list="ribbon-ide-program-options"
                  value={chart.education.ideProgram}
                  onChange={(event) => updateEducation("ideProgram", event.currentTarget.value)}
                  placeholder="IDE program"
                />
                <datalist id="ribbon-ide-program-options">
                  {IDE_OPTIONS.map((option) => <option key={option} value={option} />)}
                </datalist>
                <CheckTile label="DG" checked={chart.education.ideDg} onChange={(checked) => updateEducation("ideDg", checked)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="Cyber 400" checked={chart.education.cyber400} onChange={(checked) => updateEducation("cyber400", checked)} />
                <input value={chart.education.cyber400Details} onChange={(event) => updateEducation("cyber400Details", event.currentTarget.value)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="SDE" checked={chart.education.sde} onChange={(checked) => updateEducation("sde", checked)} />
                <input
                  list="ribbon-sde-program-options"
                  value={chart.education.sdeProgram}
                  onChange={(event) => updateEducation("sdeProgram", event.currentTarget.value)}
                  placeholder="SDE program"
                />
                <datalist id="ribbon-sde-program-options">
                  {SDE_OPTIONS.map((option) => <option key={option} value={option} />)}
                </datalist>
                <CheckTile label="DG" checked={chart.education.sdeDg} onChange={(checked) => updateEducation("sdeDg", checked)} />
              </div>
              <div className="ribbon-special-programs">
                <span>Special Programs</span>
                <CheckTile label="EWI" checked={chart.education.ewi} onChange={(checked) => updateEducation("ewi", checked)} />
                <CheckTile label="EWS" checked={chart.education.ews} onChange={(checked) => updateEducation("ews", checked)} />
                <CheckTile label="ASG" checked={chart.education.asg} onChange={(checked) => updateEducation("asg", checked)} />
                <CheckTile label="WIC" checked={chart.education.wic} onChange={(checked) => updateEducation("wic", checked)} />
                <CheckTile label="WIC DG" checked={chart.education.wicDg} onChange={(checked) => updateEducation("wicDg", checked)} />
                <CheckTile label="CNODP" checked={chart.education.cnodp} onChange={(checked) => updateEducation("cnodp", checked)} />
                <CheckTile label="DARPA" checked={chart.education.darpa} onChange={(checked) => updateEducation("darpa", checked)} />
                <CheckTile label="LDC" checked={chart.education.ldc} onChange={(checked) => updateEducation("ldc", checked)} />
                <CheckTile label="C2WAC" checked={chart.education.c2wac} onChange={(checked) => updateEducation("c2wac", checked)} />
                <label className="ribbon-special-programs-other">
                  <span>Other</span>
                  <textarea
                    value={chart.education.specialProgramsOther}
                    onChange={(event) => updateEducation("specialProgramsOther", event.currentTarget.value)}
                    placeholder="List other special programs"
                  />
                </label>
              </div>
            </section>
          </div>

          <section className="ribbon-opb-panel">
            <h2>Last 3 OPBs</h2>
            <div className="ribbon-opb-grid">
              <div className="ribbon-opb-heading">Year</div>
              <div className="ribbon-opb-heading">Bottom line + Rater</div>
              <div className="ribbon-opb-heading">Bottom line + Additional Rater</div>
              {chart.opbs.map((opb, index) => (
                <React.Fragment key={`opb-${index}`}>
                  <input value={opb.year} onChange={(event) => updateOpb(index, "year", event.currentTarget.value)} aria-label={`OPB ${index + 1} year`} />
                  <textarea value={opb.bottomLineRater} onChange={(event) => updateOpb(index, "bottomLineRater", event.currentTarget.value)} aria-label={`OPB ${index + 1} bottom line and rater`} />
                  <textarea value={opb.bottomLineAdditionalRater} onChange={(event) => updateOpb(index, "bottomLineAdditionalRater", event.currentTarget.value)} aria-label={`OPB ${index + 1} bottom line and additional rater`} />
                </React.Fragment>
              ))}
            </div>
          </section>
        </section>
      </div>

      {isCareerViewOpen && (
        <div
          ref={modalRef}
          className="ribbon-career-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCareerViewOpen(false);
          }}
        >
          <section ref={dialogRef} tabIndex={-1} className="ribbon-career-dialog" role="dialog" aria-modal="true" aria-labelledby="ribbon-career-title">
            <header className="ribbon-career-header">
              <div>
                <p className="ribbon-eyebrow">30 Year View</p>
                <h2 id="ribbon-career-title">30 Year Timeline</h2>
                <span className="ribbon-career-range">{careerDisplayStart} - {careerDisplayEnd - 1}</span>
              </div>
              <div className="ribbon-career-header-actions">
                <div className="ribbon-career-anchor-toggle" role="group" aria-label="30 year timeline start">
                  <span>Range</span>
                  <div>
                    <button
                      type="button"
                      className={careerViewAnchor === "ead" ? "is-selected" : ""}
                      aria-pressed={careerViewAnchor === "ead"}
                      onClick={() => setCareerViewAnchor("ead")}
                    >
                      EAD + 29
                    </button>
                    <button
                      type="button"
                      className={careerViewAnchor === "view" ? "is-selected" : ""}
                      aria-pressed={careerViewAnchor === "view"}
                      onClick={() => setCareerViewAnchor("view")}
                    >
                      View Year + 29
                    </button>
                  </div>
                </div>
                <button type="button" className="ribbon-career-close-button" onClick={() => setCareerViewOpen(false)}>Close</button>
              </div>
            </header>
            <div className="ribbon-career-body">
              {renderTimelineGrid(careerYears, "ribbon-career-grid", "career")}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default RibbonChartPage;

import React, { useEffect, useMemo, useRef, useState } from "react";
import "../css/ribbon-chart.css";

const SAVE_SCHEMA = "pbvinge-17x-ribbon-chart";
const SAVE_SCHEMA_VERSION = 6;
const YEAR_COUNT = 10;
const MIN_SEGMENT_YEARS = 0.5;
const FAMILY_KID_COUNT = 3;

const RANK_OPTIONS = ["Col", "Col(s)", "Lt Col", "Lt Col(s)", "Maj", "Maj(s)", "Capt", "1st Lt", "2d Lt"];
const YEAR_GROUP_OPTIONS = Array.from({ length: 29 }, (_, index) => String(2025 - index));
const STARTING_YEAR_OPTIONS = Array.from({ length: 32 }, (_, index) => 2024 + index);
const DEFAULT_VECTOR_ROW_LABELS = ["Vec 1", "Vec 2", "Vec 3"];
const GRADE_OPTIONS = [
  { value: -1, label: "Pre-K" },
  { value: 0, label: "K" },
  ...Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: `${index + 1}${["st", "nd", "rd"][index] ?? "th"}` })),
  { value: 13, label: "Grad" }
];
const SCOD_BY_RANK: Record<string, string> = {
  "2d Lt": "31 Oct",
  "1st Lt": "31 Oct",
  Capt: "31 Aug",
  Maj: "31 May",
  "Lt Col": "31 May",
  Col: "28 Feb"
};
const BASE_RANK_BY_OPTION: Record<string, string> = {
  "2d Lt": "2d Lt",
  "1st Lt": "1st Lt",
  Capt: "Capt",
  Maj: "Maj",
  "Maj(s)": "Maj",
  "Lt Col": "Lt Col",
  "Lt Col(s)": "Lt Col",
  Col: "Col",
  "Col(s)": "Col"
};
const RANK_ORDER: Record<string, number> = {
  "2d Lt": 1,
  "1st Lt": 2,
  Capt: 3,
  Maj: 4,
  "Lt Col": 5,
  Col: 6
};
const PROMOTION_RANK_BY_LABEL: Record<string, string> = {
  "IPZ Capt": "Capt",
  "IPZ Maj": "Maj",
  "IPZ Lt Col": "Lt Col",
  "IPZ Col": "Col"
};

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
  instructorUctCyberWic: boolean;
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
  eligibility: EligibilityState;
  timeline: TimelineData;
  vectors: VectorRow[];
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
type FieldGradePromotionRank = "Maj" | "Lt Col" | "Col";
type PromotionYearOffset = -1 | 0;

interface TimelineCellInfo {
  title: string;
  milestones: TimelineMilestone[];
}

interface FieldGradePromotionSchedule {
  boardPrefix: "P04" | "P05" | "P06";
  gradeName: string;
  aPopulation: string;
  bPopulation: string;
  rows: Array<[string, string, PromotionYearOffset, string, PromotionYearOffset]>;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const snapHalfYear = (value: number) => Math.round(value * 2) / 2;
const blankRow = () => Array.from({ length: YEAR_COUNT }, () => "");
const clampStartingYear = (value: number) => clamp(Number.isFinite(value) ? Math.round(value) : 2024, 2024, 2055);

const colorFor = (colorId: VectorColorId) => VECTOR_COLORS.find((color) => color.id === colorId) ?? VECTOR_COLORS[0];

const yearsFor = (startingYear: number) => Array.from({ length: YEAR_COUNT }, (_, index) => startingYear + index);
const shortYear = (year: number) => String(year).slice(-2).padStart(2, "0");
const dateForBoardYear = (monthDay: string, boardYear: number, offset: PromotionYearOffset) => `${monthDay} ${boardYear + offset}`;
const boardCode = (prefix: FieldGradePromotionSchedule["boardPrefix"], year: number, suffix: "A" | "B") => (
  `${prefix}${shortYear(year)}${suffix}`
);
const medicalBoardCode = (prefix: FieldGradePromotionSchedule["boardPrefix"], year: number) => (
  `M${prefix.slice(1)}${shortYear(year)}A`
);
const normalizeRank = (rank: string) => BASE_RANK_BY_OPTION[rank] ?? "Maj";
const getScodForRank = (rank: string) => SCOD_BY_RANK[normalizeRank(rank)] ?? "31 May";
const getScodTimeline = (startingRank: string, promotionRow: string[]) => {
  let effectiveRank = normalizeRank(startingRank);

  return promotionRow.map((promotionLabel) => {
    const promotedRank = PROMOTION_RANK_BY_LABEL[promotionLabel.trim()];
    if (promotedRank && RANK_ORDER[promotedRank] > RANK_ORDER[effectiveRank]) {
      effectiveRank = promotedRank;
    }

    return {
      rank: effectiveRank,
      scod: getScodForRank(effectiveRank)
    };
  });
};
const FIELD_GRADE_PROMOTION_SCHEDULES: Record<FieldGradePromotionRank, FieldGradePromotionSchedule> = {
  Maj: {
    boardPrefix: "P04",
    gradeName: "Major",
    aPopulation: "Major, LAF-A/C/F/I/N and LAF-J/CHAP",
    bPopulation: "Major, NC/MSC/BSC and MC/DC",
    rows: [
      ["PRF accounting date", "Aug 9", -1, "Aug 23", -1],
      ["PRF cutoff date", "Nov 7", -1, "Nov 14", -1],
      ["AF-level PRFs due", "Dec 2", -1, "Dec 9", -1],
      ["Remaining PRFs due AFPC", "Dec 7", -1, "Dec 14", -1],
      ["Letters received by AFPC", "Dec 27", -1, "Jan 10", 0],
      ["Central board convenes", "Jan 6", 0, "Jan 20", 0]
    ]
  },
  "Lt Col": {
    boardPrefix: "P05",
    gradeName: "Lieutenant Colonel",
    aPopulation: "Lt Col, LAF-A/C/F/I/N/X",
    bPopulation: "Lt Col, LAF-J/CHAP/NC/MSC/BSC and MC/DC",
    rows: [
      ["PRF accounting date", "Jun 6", 0, "Jul 4", 0],
      ["OPBs flow", "Jun 11", 0, "Jul 9", 0],
      ["MPF OPB suspense", "Jun 21", 0, "Jul 19", 0],
      ["Senior-rater RIP/DQHB flows", "Jul 7", 0, "Aug 4", 0],
      ["AFPC opt-out cutoff", "Jul 11", 0, "Aug 8", 0],
      ["AF Student MLR", "Aug 25", 0, "Sep 22", 0],
      ["Final allocation date", "Aug 28", 0, "Sep 25", 0],
      ["PRF cutoff date", "Sep 4", 0, "Oct 2", 0],
      ["ML MLR complete / codes updated", "Sep 24", 0, "Oct 22", 0],
      ["AF-level PRFs and MELs due", "Sep 29", 0, "Oct 27", 0],
      ["Remaining PRFs due AFPC", "Oct 4", 0, "Nov 1", 0],
      ["AF-level MLR", "Oct 6", 0, "Nov 3", 0],
      ["Letters received by AFPC", "Oct 24", 0, "Nov 21", 0],
      ["Central board convenes", "Nov 3", 0, "Dec 1", 0]
    ]
  },
  Col: {
    boardPrefix: "P06",
    gradeName: "Colonel",
    aPopulation: "Colonel, LAF-A/C/F/I/N/X",
    bPopulation: "Colonel, LAF-J/CHAP/NC/MSC/BSC and MC/DC",
    rows: [
      ["PRF accounting date", "Oct 4", -1, "Oct 18", -1],
      ["PRF cutoff date", "Jan 2", 0, "Jan 16", 0],
      ["AF-level PRFs due", "Jan 27", 0, "Feb 10", 0],
      ["Remaining PRFs due AFPC", "Feb 1", 0, "Feb 15", 0],
      ["Letters received by AFPC", "Feb 21", 0, "Mar 7", 0],
      ["Central board convenes", "Mar 3", 0, "Mar 17", 0]
    ]
  }
};
const getDevelopmentalEducationCycle = (label: string, year: number): TimelineCellInfo | null => {
  const trimmed = label.trim();
  const cycleType = trimmed.startsWith("IDE") ? "IDE" : trimmed.startsWith("SDE") ? "SDE" : "";
  if (!cycleType) return null;

  const priorYear = year - 1;
  return {
    title: `${trimmed} - ${year} ${cycleType} school-selection cycle`,
    milestones: [
      ["Senior rater accountability", `1 Nov ${priorYear}`],
      ["ODP-DE / nomination window", `Dec ${priorYear}-Jan ${year}`],
      ["Central PME board activity", `Feb-Mar ${year}`],
      ["Development Teams vector", `Mar-Jun ${year}`],
      ["School Match Board", `Around 1 Jun ${year}`],
      ["DEDB / school designation", `Late Jun-Jul ${year}`],
      ["Public / field announcement", `Expected late Jun ${year}; verify annual PSDM/MyFSS schedule`]
    ]
  };
};
const getCommandSelectionCycle = (label: string, year: number): TimelineCellInfo | null => {
  const trimmed = label.trim();
  if (!trimmed) return null;

  const normalized = trimmed.toUpperCase();
  const isCommandOrDoCell = (
    normalized.includes("COMMAND") ||
    normalized.includes("GP/CD") ||
    normalized.includes("SQ/DO") ||
    /\bCC\b/.test(normalized) ||
    /\bDO\b/.test(normalized)
  );
  if (!isCommandOrDoCell) return null;

  return {
    title: `${trimmed} - ${year} 17X command / DO cycle`,
    milestones: [
      ["MyVector Candidate SOI opens", `14 Jan ${year}`],
      ["Non-17X add cutoff", `21 Jan ${year}`],
      ["Records freeze", `25 Jan ${year}`],
      ["MyVector Candidate SOI closes", `4 Feb ${year}`],
      ["Endorsement window closes", `18 Feb ${year}`],
      ["17X Spring DT", `13-17 Apr ${year}`],
      ["Command Candidate List PSDM", `Summer ${year}`],
      ["Consolidated Command Selection PSDM", `Fall ${year}`],
      ["17X Gp/CD and Sq/DO Selection PSDM", `Fall ${year}`],
      ["Source note", "Dates are shifted from the 2026 schedule; verify exact annual MyVector/PSDM dates"]
    ]
  };
};
const promotionRankFromLabel = (label: string) => {
  const normalized = label.trim().replace(/\s+/g, " ").replace(/^IPZ\s+/i, "").toLowerCase();
  const rankByLabel: Record<string, string> = {
    "2d lt": "2d Lt",
    "2nd lt": "2d Lt",
    "second lieutenant": "2d Lt",
    "1st lt": "1st Lt",
    "first lieutenant": "1st Lt",
    capt: "Capt",
    captain: "Capt",
    maj: "Maj",
    major: "Maj",
    "lt col": "Lt Col",
    ltcol: "Lt Col",
    "lieutenant colonel": "Lt Col",
    col: "Col",
    colonel: "Col"
  };

  return rankByLabel[normalized] ?? null;
};
const getFieldGradePromotionCycle = (label: string, targetRank: FieldGradePromotionRank, year: number): TimelineCellInfo => {
  const schedule = FIELD_GRADE_PROMOTION_SCHEDULES[targetRank];
  const aBoard = boardCode(schedule.boardPrefix, year, "A");
  const bBoard = `${boardCode(schedule.boardPrefix, year, "B")} / ${medicalBoardCode(schedule.boardPrefix, year)}`;
  const boardRows = schedule.rows.map<TimelineMilestone>(([milestone, aDate, aOffset, bDate, bOffset]) => [
    milestone,
    `${aBoard}: ${dateForBoardYear(aDate, year, aOffset)}; ${bBoard}: ${dateForBoardYear(bDate, year, bOffset)}`
  ]);

  return {
    title: `${label} - CY${shortYear(year)} ${schedule.gradeName} board milestones`,
    milestones: [
      ["A-board population", `${aBoard}: ${schedule.aPopulation}`],
      ["B/M-board population", `${bBoard}: ${schedule.bPopulation}`],
      ...boardRows,
      ["PRF accounting", "AFPC matches eligibles to senior raters using MilPDS unit assignment data"],
      ["PRF cutoff", "Senior raters sign on or after this date; it is not the final submission deadline"],
      ["Source note", "Dates roll from the CY26 milestone schedule; verify exact annual PSDM/MyFSS weekend and holiday shifts"]
    ]
  };
};
const getPromotionCycle = (label: string, year: number): TimelineCellInfo | null => {
  const trimmed = label.trim();
  const targetRank = promotionRankFromLabel(trimmed);
  if (!targetRank) return null;

  const priorYear = year - 1;

  if (targetRank === "2d Lt") {
    return {
      title: `${trimmed} - accession / initial grade`,
      milestones: [
        ["DOR start point", "Commissioning or extended active duty date"],
        ["Used for", "Starts the clock for first lieutenant timing"],
        ["Next promotion", "First lieutenant normally after 2 years TIG as a 2d Lt"]
      ]
    };
  }

  if (targetRank === "1st Lt") {
    return {
      title: `${trimmed} - promotion to first lieutenant`,
      milestones: [
        ["Eligibility", "2 years TIG as a 2d Lt"],
        ["Pin-on timing", `${year}, if this cell is the officer's 2d Lt DOR + 2 years`],
        ["Process note", "No central promotion board; NQP or delay actions are handled separately"]
      ]
    };
  }

  if (targetRank === "Capt") {
    return {
      title: `${trimmed} - promotion to captain`,
      milestones: [
        ["Eligibility", "2 years TIG as a 1st Lt"],
        ["IPZ consideration", `Quarterly cycle in ${priorYear}, one year before expected pin-on`],
        ["A-cycle", `1 Jan-31 Mar ${priorYear} -> Jan-Mar ${year} promotions`],
        ["B-cycle", `1 Apr-30 Jun ${priorYear} -> Apr-Jun ${year} promotions`],
        ["C-cycle", `1 Jul-30 Sep ${priorYear} -> Jul-Sep ${year} promotions`],
        ["D-cycle", `1 Oct-31 Dec ${priorYear} -> Oct-Dec ${year} promotions`],
        ["Results", "Selections announced by email about 60-90 days after cycle closeout"]
      ]
    };
  }

  if (targetRank === "Maj" || targetRank === "Lt Col" || targetRank === "Col") {
    return getFieldGradePromotionCycle(trimmed, targetRank, year);
  }

  return null;
};
const getTimelineCellInfo = (key: keyof Omit<TimelineData, "startingYear">, label: string, year: number) => {
  if (key === "promotion") return getPromotionCycle(label, year);
  if (key === "leadership") return getCommandSelectionCycle(label, year);
  if (key === "developmentalEducation") return getDevelopmentalEducationCycle(label, year);
  return null;
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

const buildTimelineRows = (startingYear: number, adjustedYearGroup: number) => {
  const years = yearsFor(startingYear);
  const promotion = blankRow();
  const leadership = blankRow();
  const developmentalEducation = blankRow();
  const careerFieldEducation = blankRow();

  setLabelForYear(promotion, years, adjustedYearGroup + 4, "IPZ Capt");
  setLabelForYear(promotion, years, adjustedYearGroup + 8, "IPZ Maj");
  setLabelForYear(promotion, years, adjustedYearGroup + 13, "IPZ Lt Col");
  setLabelForYear(promotion, years, adjustedYearGroup + 20, "IPZ Col");

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
  return clamp(grade, -1, 13);
};

const createDefaultChart = (): ChartData => {
  const startingYear = 2024;
  const adjustedYearGroup = 2012;
  const rows = buildTimelineRows(startingYear, adjustedYearGroup);

  return {
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
      instructorUctCyberWic: false,
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
      id: typeof incoming?.id === "string" ? incoming.id : fallback.id,
      enabled: typeof incoming?.enabled === "boolean" ? incoming.enabled : fallback.enabled,
      label: typeof incoming?.label === "string" ? incoming.label : fallback.label,
      startGrade: normalizeGrade(incoming?.startGrade)
    };
  });
};

const normalizeVectorRows = (value: unknown, timelineStart: number): VectorRow[] => {
  const base = createDefaultChart().vectors;
  if (!Array.isArray(value)) return base;

  const timelineEnd = timelineStart + YEAR_COUNT;
  return DEFAULT_VECTOR_ROW_LABELS.map((defaultLabel, rowIndex) => {
    const fallback = base[rowIndex];
    const incoming = value.find((row) => {
      if (typeof row !== "object" || row === null) return false;
      const candidate = row as Partial<VectorRow>;
      return candidate.id === fallback.id || candidate.label === defaultLabel;
    }) as Partial<VectorRow> | undefined;
    const segments = Array.isArray(incoming?.segments) ? incoming.segments : fallback.segments;

    return {
      id: typeof incoming?.id === "string" ? incoming.id : fallback.id,
      label: typeof incoming?.label === "string" ? incoming.label : defaultLabel,
      segments: segments
        .map((segment, segmentIndex) => {
          const partial = segment as Partial<VectorSegment>;
          const start = typeof partial.startYear === "number" ? partial.startYear : timelineStart + segmentIndex;
          const end = typeof partial.endYear === "number" ? partial.endYear : start + 1;
          const color = VECTOR_COLORS.some((option) => option.id === partial.color) ? partial.color as VectorColorId : "green";
          return {
            id: typeof partial.id === "string" ? partial.id : `${fallback.id}-${segmentIndex}`,
            label: typeof partial.label === "string" ? partial.label : "New block",
            startYear: clamp(snapHalfYear(start), timelineStart, timelineEnd - MIN_SEGMENT_YEARS),
            endYear: clamp(snapHalfYear(end), timelineStart + MIN_SEGMENT_YEARS, timelineEnd),
            color
          };
        })
        .filter((segment) => segment.endYear - segment.startYear >= MIN_SEGMENT_YEARS)
        .sort((a, b) => a.startYear - b.startYear)
    };
  });
};

const normalizeChart = (input: Partial<ChartData>): ChartData => {
  const base = createDefaultChart();
  const timelineStart = typeof input.timeline?.startingYear === "number" ? clampStartingYear(input.timeline.startingYear) : base.timeline.startingYear;
  const legacyInput = input as Partial<ChartData> & { oprs?: OpbEntry[] };
  const incomingOpbs = Array.isArray(input.opbs) ? input.opbs : legacyInput.oprs;

  return {
    identity: { ...base.identity, ...input.identity },
    eligibility: {
      de: { ...base.eligibility.de, ...input.eligibility?.de },
      do: { ...base.eligibility.do, ...input.eligibility?.do },
      sqCc: { ...base.eligibility.sqCc, ...input.eligibility?.sqCc }
    },
    timeline: {
      startingYear: timelineStart,
      promotion: normalizeStringArray(input.timeline?.promotion, YEAR_COUNT),
      leadership: normalizeStringArray(input.timeline?.leadership, YEAR_COUNT),
      developmentalEducation: normalizeStringArray(input.timeline?.developmentalEducation, YEAR_COUNT),
      careerFieldEducation: normalizeStringArray(input.timeline?.careerFieldEducation, YEAR_COUNT),
      personal: normalizeStringArray(input.timeline?.personal, YEAR_COUNT)
    },
    vectors: normalizeVectorRows(input.vectors, timelineStart),
    familyKids: normalizeFamilyKids(input.familyKids),
    jobExperiences: { ...base.jobExperiences, ...input.jobExperiences },
    highlights: { ...base.highlights, ...input.highlights },
    education: { ...base.education, ...input.education },
    opbs: Array.isArray(incomingOpbs) && incomingOpbs.length
      ? incomingOpbs.slice(0, 3).map((opb, index) => ({ ...base.opbs[index], ...opb }))
      : base.opbs
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
    startGrade: normalizeGrade(kid.startGrade + deltaYears)
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
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>("vec1-current");
  const [dirty, setDirty] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragRef = useRef<DragState | null>(null);

  const years = useMemo(() => yearsFor(chart.timeline.startingYear), [chart.timeline.startingYear]);
  const rankScod = getScodForRank(chart.identity.rank);
  const scodTimeline = useMemo(
    () => getScodTimeline(chart.identity.rank, chart.timeline.promotion),
    [chart.identity.rank, chart.timeline.promotion]
  );
  const timelineStart = chart.timeline.startingYear;
  const timelineEnd = chart.timeline.startingYear + YEAR_COUNT;

  const selectedSegment = useMemo<SelectedSegment | null>(() => {
    if (!selectedSegmentId) return null;
    for (const row of chart.vectors) {
      const segment = row.segments.find((candidate) => candidate.id === selectedSegmentId);
      if (segment) return { row, segment };
    }
    return null;
  }, [chart.vectors, selectedSegmentId]);

  useEffect(() => {
    if (!dirty) return undefined;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

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
    setDirty(true);
    setImportMessage("");
  };

  const updateIdentity = (key: keyof ChartIdentity, value: string) => {
    updateChart((current) => ({ ...current, identity: { ...current.identity, [key]: value } }));
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

  const updateTimelineCell = (key: keyof Omit<TimelineData, "startingYear">, index: number, value: string) => {
    updateChart((current) => {
      const row = current.timeline[key].slice();
      row[index] = value;
      return { ...current, timeline: { ...current.timeline, [key]: row } };
    });
  };

  const updateTimelineStart = (value: number) => {
    const nextYear = clampStartingYear(value);
    updateChart((current) => {
      const deltaYears = nextYear - current.timeline.startingYear;
      return {
        ...current,
        timeline: { ...current.timeline, startingYear: nextYear },
        vectors: shiftVectorRows(current.vectors, deltaYears),
        familyKids: shiftFamilyKids(current.familyKids, deltaYears)
      };
    });
  };

  const populateTimeline = () => {
    updateChart((current) => ({
      ...current,
      timeline: {
        ...current.timeline,
        ...buildTimelineRows(current.timeline.startingYear, Number(current.identity.adjustedYearGroup))
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
    mode: DragMode
  ) => {
    const track = trackRefs.current[row.id];
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const neighbors = findSegmentNeighbors(row, segment.id, timelineStart, timelineEnd);

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
      timelineStart,
      timelineEnd
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
    const neighbors = findSegmentNeighbors(selectedSegment.row, selectedSegment.segment.id, timelineStart, timelineEnd);
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

  const updateFamilyKid = <K extends keyof FamilyKid>(index: number, key: K, value: FamilyKid[K]) => {
    updateChart((current) => {
      const familyKids = current.familyKids.slice();
      familyKids[index] = { ...familyKids[index], [key]: value };
      return { ...current, familyKids };
    });
  };

  const renderFamilyCell = (index: number) => {
    return (
      <div key={`family-${years[index]}`} className="ribbon-family-cell" aria-label={`Kids grades ${years[index]}`}>
        {chart.familyKids.map((kid, kidIndex) => {
          if (!kid.enabled) return null;
          const label = kid.label.trim() || `Kid ${kidIndex + 1}`;
          const grade = gradeLabelFor(kid.startGrade + index);
          return <span key={kid.id} title={`${label}: ${grade}`}>{label}: {grade}</span>;
        })}
      </div>
    );
  };

  const addSegmentToRow = (row: VectorRow) => {
    const ordered = row.segments.slice().sort((a, b) => a.startYear - b.startYear);
    const boundaries = [
      { start: timelineStart, end: ordered[0]?.startYear ?? timelineEnd },
      ...ordered.map((segment, index) => ({
        start: segment.endYear,
        end: ordered[index + 1]?.startYear ?? timelineEnd
      }))
    ];
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
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${fileSafeName(chart.identity.name)}-17x-ribbon-chart.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setDirty(false);
    setImportMessage("Saved chart file.");
  };

  const loadChartFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid chart file");
        const candidate = parsed as Partial<RibbonSaveFile> | Partial<ChartData>;
        const data = "schema" in candidate && candidate.schema === SAVE_SCHEMA ? (candidate as Partial<RibbonSaveFile>).data : candidate;
        if (!data) throw new Error("Missing chart data");
        const normalized = normalizeChart(data as Partial<ChartData>);
        setChart(normalized);
        setSelectedSegmentId(normalized.vectors.flatMap((row) => row.segments)[0]?.id ?? null);
        setDirty(false);
        setImportMessage("Loaded chart file.");
      } catch {
        setImportMessage("Could not load that file.");
      }
    };
    reader.readAsText(file);
  };

  const resetChart = () => {
    if (!window.confirm("Reset this chart to the default template?")) return;
    const next = createDefaultChart();
    setChart(next);
    setSelectedSegmentId("vec1-current");
    setDirty(false);
    setImportMessage("Reset chart.");
  };

  const renderTimelineCell = (label: string, key: keyof Omit<TimelineData, "startingYear">, value: string, index: number) => {
    const year = years[index];
    const cellInfo = getTimelineCellInfo(key, value, year);

    if (!cellInfo) {
      return (
        <input
          key={`${key}-${year}`}
          className="ribbon-cell-input"
          value={value}
          onChange={(event) => updateTimelineCell(key, index, event.currentTarget.value)}
          aria-label={`${label} ${year}`}
        />
      );
    }

    const tooltipId = `${key}-${year}-cycle-info`;
    const edgeClass = index <= 1 ? " ribbon-info-cell-left-edge" : index >= YEAR_COUNT - 2 ? " ribbon-info-cell-right-edge" : "";
    return (
      <div key={`${key}-${year}`} className={`ribbon-info-cell${edgeClass}`}>
        <input
          className="ribbon-cell-input"
          value={value}
          onChange={(event) => updateTimelineCell(key, index, event.currentTarget.value)}
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
            {cellInfo.milestones.map(([milestone, timing]) => (
              <div key={milestone}>
                <dt>{milestone}</dt>
                <dd>{timing}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  };

  const renderTimelineRow = (label: string, key: keyof Omit<TimelineData, "startingYear">) => (
    <>
      <div className="ribbon-timeline-label">{label}</div>
      {chart.timeline[key].map((value, index) => renderTimelineCell(label, key, value, index))}
    </>
  );

  return (
    <div className="pbv-ribbon">
      <header className="ribbon-toolbar">
        <div>
          <p className="ribbon-eyebrow">17X Ribbon Chart</p>
          <h1>Cyber Operations Officer Ribbon Chart</h1>
        </div>
        <div className="ribbon-actions" aria-label="Ribbon chart actions">
          <div className="ribbon-populate-group" aria-label="Timeline setup">
            <span className="ribbon-populate-title">Timeline Setup</span>
            <label className="ribbon-year-control">
              <span>Start Year</span>
              <select
                value={chart.timeline.startingYear}
                onChange={(event) => updateTimelineStart(Number(event.currentTarget.value))}
              >
                {STARTING_YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="ribbon-year-control">
              <span>YG</span>
              <select value={chart.identity.yearGroup} onChange={(event) => updateIdentity("yearGroup", event.currentTarget.value)}>
                {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label className="ribbon-year-control">
              <span>Adj YG</span>
              <select value={chart.identity.adjustedYearGroup} onChange={(event) => updateIdentity("adjustedYearGroup", event.currentTarget.value)}>
                {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
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

      {importMessage && <p className="ribbon-status">{importMessage}</p>}

      <div className="ribbon-scroll">
        <section className="ribbon-sheet" aria-label="Cyber Operations Officer Ribbon Chart editor">
          <header className="ribbon-sheet-header">
            <div className="ribbon-badge" aria-hidden="true">
              <span>17X</span>
            </div>
            <div className="ribbon-title-block">
              <div className="ribbon-title-row">
                <h2>Cyber Operations Officer Ribbon Chart</h2>
                <span>Version 1.9.0</span>
              </div>
              <div className="ribbon-identity-row">
                <div className="ribbon-rank-cell">
                  <select value={chart.identity.rank} onChange={(event) => updateIdentity("rank", event.currentTarget.value)} aria-label="Rank">
                    {RANK_OPTIONS.map((rank) => <option key={rank} value={rank}>{rank}</option>)}
                  </select>
                  <span className="ribbon-scod-pill">SCOD: {rankScod}</span>
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
                  <select value={chart.identity.yearGroup} onChange={(event) => updateIdentity("yearGroup", event.currentTarget.value)}>
                    {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </div>
              <div className="ribbon-identity-row ribbon-identity-row-secondary">
                <input value={chart.identity.jobLocation} onChange={(event) => updateIdentity("jobLocation", event.currentTarget.value)} aria-label="Job and duty location" />
                <label>
                  <span>Adj YG</span>
                  <select value={chart.identity.adjustedYearGroup} onChange={(event) => updateIdentity("adjustedYearGroup", event.currentTarget.value)}>
                    {YEAR_GROUP_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
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

          <div className="ribbon-timeline-grid">
            {renderTimelineRow("Promotion", "promotion")}
            {renderTimelineRow("Leadership", "leadership")}
            {renderTimelineRow("PME", "developmentalEducation")}
            {renderTimelineRow("Career Field Edu", "careerFieldEducation")}

            <div className="ribbon-timeline-label">Calendar Year</div>
            {years.map((year) => <div key={year} className="ribbon-year-cell">{year}</div>)}

            <div className="ribbon-timeline-label ribbon-scod-label">SCOD</div>
            {years.map((year, index) => {
              const scodEntry = scodTimeline[index] ?? { rank: normalizeRank(chart.identity.rank), scod: rankScod };
              return (
                <div key={`scod-${year}`} className="ribbon-scod-cell" title={`${scodEntry.rank} SCOD`}>
                  {scodEntry.scod}
                </div>
              );
            })}

            {chart.vectors.map((row, rowIndex) => (
              <React.Fragment key={row.id}>
                <div className="ribbon-timeline-label ribbon-vector-label">
                  <input
                    className="ribbon-vector-name-input"
                    value={row.label}
                    onChange={(event) => updateVectorRowLabel(row.id, event.currentTarget.value)}
                    placeholder={`Vec ${rowIndex + 1}`}
                    aria-label={`Vector ${rowIndex + 1} name`}
                  />
                  <button type="button" onClick={() => addSegmentToRow(row)}>Add block</button>
                </div>
                <div
                  className="ribbon-vector-track"
                  ref={(node) => { trackRefs.current[row.id] = node; }}
                  style={{
                    backgroundSize: `${100 / YEAR_COUNT}% 100%`
                  }}
                >
                  {row.segments.map((segment) => {
                    const color = colorFor(segment.color);
                    const left = ((segment.startYear - timelineStart) / YEAR_COUNT) * 100;
                    const width = ((segment.endYear - segment.startYear) / YEAR_COUNT) * 100;
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
                        onPointerDown={(event) => beginSegmentDrag(event, row, segment, "move")}
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
                            beginSegmentDrag(event, row, segment, "resize-left");
                          }}
                        />
                        <span>{segment.label}</span>
                        <button
                          type="button"
                          className="ribbon-vector-handle ribbon-vector-handle-right"
                          aria-label={`Resize end for ${segment.label}`}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            beginSegmentDrag(event, row, segment, "resize-right");
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}

            <div className="ribbon-timeline-label ribbon-family-label">Kids Grades</div>
            {years.map((_, index) => renderFamilyCell(index))}
          </div>

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
                    min={timelineStart}
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
                    max={timelineEnd}
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
                    value={kid.startGrade}
                    onChange={(event) => updateFamilyKid(index, "startGrade", Number(event.currentTarget.value))}
                  >
                    {GRADE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>
            ))}
          </section>

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
              <div className="ribbon-panel-row">
                <span className="ribbon-row-label">Instructor</span>
                <CheckTile label="UCT / Cyber 200 / Cyber 300 / WIC" checked={chart.jobExperiences.instructorUctCyberWic} onChange={(checked) => updateJobExperience("instructorUctCyberWic", checked)} />
                <CheckTile label="SOS / BMT / OTS" checked={chart.jobExperiences.instructorSosBmtOts} onChange={(checked) => updateJobExperience("instructorSosBmtOts", checked)} />
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
                <CheckTile label="Cyber 200 [i]" checked={chart.education.cyber200} onChange={(checked) => updateEducation("cyber200", checked)} />
                <input value={chart.education.cyber200Details} onChange={(event) => updateEducation("cyber200Details", event.currentTarget.value)} />
              </div>
              <div className="ribbon-education-row">
                <CheckTile label="Cyber 300 [i]" checked={chart.education.cyber300} onChange={(checked) => updateEducation("cyber300", checked)} />
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
    </div>
  );
};

export default RibbonChartPage;

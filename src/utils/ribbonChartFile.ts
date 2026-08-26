export const RIBBON_SAVE_SCHEMA = "pbvinge-17x-ribbon-chart";
export const RIBBON_TIMELINE_YEARS = 30;

export interface RibbonComparisonIdentity {
  name: string;
  rank: string;
}

export interface RibbonComparisonTimeline {
  eadYear: number;
  startingYear: number;
  promotion: string[];
  developmentalEducation: string[];
}

export interface RibbonComparisonSegment {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  color: string;
}

export interface RibbonComparisonVector {
  id: string;
  label: string;
  segments: RibbonComparisonSegment[];
}

export interface RibbonComparisonChart {
  identity: RibbonComparisonIdentity;
  timeline: RibbonComparisonTimeline;
  vectorOne: RibbonComparisonVector;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => (
  typeof value === "object" && value !== null && !Array.isArray(value)
);

const requiredRecord = (value: unknown, label: string): UnknownRecord => {
  if (!isRecord(value)) throw new Error(`${label} is missing.`);
  return value;
};

const stringValue = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;

const yearValue = (value: unknown, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.round(value), 1980), 2055);
};

const stringArray = (value: unknown) => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: RIBBON_TIMELINE_YEARS }, (_, index) => stringValue(source[index]));
};

/**
 * Extracts the chart payload from both current save envelopes and legacy raw
 * chart JSON. Keeping this in one place prevents the editor and comparison
 * page from silently disagreeing about whether a file is a ribbon chart.
 */
export const extractRibbonChartData = (input: unknown): UnknownRecord => {
  if (!isRecord(input)) throw new Error("This file does not contain a ribbon chart.");

  if ("schema" in input) {
    if (input.schema !== RIBBON_SAVE_SCHEMA) {
      throw new Error("This JSON file was created by a different tool.");
    }
    return requiredRecord(input.data, "Chart data");
  }

  if (!isRecord(input.identity) || !isRecord(input.timeline)) {
    throw new Error("This file does not contain recognizable ribbon-chart data.");
  }

  return input;
};

const comparisonSegments = (value: unknown, eadYear: number): RibbonComparisonSegment[] => {
  if (!Array.isArray(value)) return [];
  const careerEnd = eadYear + RIBBON_TIMELINE_YEARS;

  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) return [];
    const rawStart = typeof entry.startYear === "number" && Number.isFinite(entry.startYear)
      ? entry.startYear
      : eadYear + index;
    const rawEnd = typeof entry.endYear === "number" && Number.isFinite(entry.endYear)
      ? entry.endYear
      : rawStart + 1;
    const startYear = Math.min(Math.max(Math.round(rawStart * 2) / 2, eadYear), careerEnd - 0.5);
    const endYear = Math.min(Math.max(Math.round(rawEnd * 2) / 2, startYear + 0.5), careerEnd);
    if (endYear <= startYear) return [];

    return [{
      id: stringValue(entry.id, `vec-1-segment-${index + 1}`),
      label: stringValue(entry.label, "Career block"),
      startYear,
      endYear,
      color: stringValue(entry.color, "green")
    }];
  }).sort((a, b) => a.startYear - b.startYear);
};

const comparisonVectorOne = (value: unknown, eadYear: number): RibbonComparisonVector => {
  const rows = Array.isArray(value) ? value.filter(isRecord) : [];
  const row = rows.find((candidate) => candidate.id === "vec-1")
    ?? rows.find((candidate) => stringValue(candidate.label).trim().toLowerCase() === "vec 1")
    ?? rows[0];

  return {
    id: stringValue(row?.id, "vec-1"),
    label: stringValue(row?.label, "Vec 1"),
    segments: comparisonSegments(row?.segments, eadYear)
  };
};

export const parseRibbonComparisonChart = (input: unknown): RibbonComparisonChart => {
  const data = extractRibbonChartData(input);
  const identity = requiredRecord(data.identity, "Member identity");
  const timeline = requiredRecord(data.timeline, "Career timeline");
  const eadYear = yearValue(timeline.eadYear, Number.NaN);

  if (!Number.isFinite(eadYear)) {
    throw new Error("The chart is missing a valid EAD year.");
  }

  if (!Array.isArray(timeline.promotion) || !Array.isArray(timeline.developmentalEducation)) {
    throw new Error("The chart is missing its Promotion or PME timeline.");
  }

  return {
    identity: {
      name: stringValue(identity.name, "Unnamed member").trim() || "Unnamed member",
      rank: stringValue(identity.rank, "Member").trim() || "Member"
    },
    timeline: {
      eadYear,
      startingYear: yearValue(timeline.startingYear, eadYear),
      promotion: stringArray(timeline.promotion),
      developmentalEducation: stringArray(timeline.developmentalEducation)
    },
    vectorOne: comparisonVectorOne(data.vectors, eadYear)
  };
};

export const ribbonTimelineValue = (
  chart: RibbonComparisonChart,
  key: "promotion" | "developmentalEducation",
  year: number
) => {
  const index = year - chart.timeline.eadYear;
  return index >= 0 && index < RIBBON_TIMELINE_YEARS ? chart.timeline[key][index] ?? "" : "";
};

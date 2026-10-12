export const RIBBON_SAVE_SCHEMA = "pbvinge-17x-ribbon-chart";
export const RIBBON_SAVE_SCHEMA_VERSION = 12;
export const RIBBON_TIMELINE_YEARS = 30;
export const RIBBON_MAX_FILE_BYTES = 2_000_000;
export const RIBBON_COLOR_IDS = ["green", "blue", "red", "yellow", "orange", "purple", "slate"] as const;
export const RIBBON_RANKS = ["2d Lt", "1st Lt", "Capt", "Maj", "Lt Col", "Col"] as const;
export interface RibbonRankEntry { id: string; rank: string; date: string; basis: "entered" | "estimate"; }
export interface RibbonPlanningDate { id: string; label: string; date: string; kind: "promotion" | "education" | "command"; }
export interface RibbonComparisonIdentity { name: string; rank: string; dor?: string; }
export interface RibbonComparisonTimeline { eadYear: number; startingYear: number; promotion: string[]; developmentalEducation: string[]; }
export interface RibbonComparisonSegment { id: string; label: string; startYear: number; endYear: number; color: string; }
export interface RibbonComparisonVector { id: string; label: string; segments: RibbonComparisonSegment[]; }
export interface RibbonComparisonChart { identity: RibbonComparisonIdentity; timeline: RibbonComparisonTimeline; vectors: RibbonComparisonVector[]; rankHistory?: RibbonRankEntry[]; planningDates?: RibbonPlanningDate[]; warnings?: string[]; }
type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);
const record = (value: unknown, path: string) => { if (!isRecord(value)) throw new Error(`${path} must be an object.`); return value; };
const text = (value: unknown, path: string, limit = 2000) => {
  if (typeof value !== "string" || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error(`${path} must be text of at most ${limit} characters.`);
};
const numeric = (value: unknown, path: string, min: number, max: number, step = 1) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max || Math.abs(value / step - Math.round(value / step)) > 1e-8) throw new Error(`${path} must be between ${min} and ${max} in increments of ${step}.`);
};
const list = (value: unknown, path: string, max: number): unknown[] => {
  if (!Array.isArray(value) || value.length > max) throw new Error(`${path} must be an array with at most ${max} entries.`);
  return value;
};
const validateFields = (value: unknown, path: string, strings: string[], booleans: string[] = []) => {
  const item = record(value, path);
  for (const [key, field] of Object.entries(item)) {
    if (strings.includes(key)) text(field, `${path}.${key}`);
    else if (booleans.includes(key) && typeof field !== "boolean") throw new Error(`${path}.${key} must be true or false.`);
  }
};
const safeTree = (value: unknown, depth = 0) => {
  if (depth > 12) throw new Error("Chart data is nested too deeply.");
  if (Array.isArray(value)) { if (value.length > 1000) throw new Error("Chart contains too many entries."); value.forEach((v) => safeTree(v, depth + 1)); }
  else if (isRecord(value)) {
    if (Object.keys(value).length > 200) throw new Error("Chart contains too many fields.");
    for (const [key, v] of Object.entries(value)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) throw new Error(`Unsupported chart field: ${key}.`);
      safeTree(v, depth + 1);
    }
  } else if (typeof value === "number" && !Number.isFinite(value)) throw new Error("Chart contains a non-finite number.");
  else if (typeof value === "string" && value.length > 20_000) throw new Error("Chart contains an oversized text field.");
};
const validateDate = (value: unknown, path: string) => {
  text(value, path, 10);
  if (value === "") return;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value as string) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new Error(`${path} must be a valid YYYY-MM-DD date.`);
};
/** Validates before normalization/state changes. Versions 1–11 retain their optional legacy sections. */
export const extractRibbonChartData = (input: unknown): UnknownRecord => {
  const envelope = record(input, "Ribbon chart"); safeTree(input);
  let data = envelope;
  if (Object.hasOwn(envelope, "schema")) {
    if (envelope.schema !== RIBBON_SAVE_SCHEMA) throw new Error("This JSON file was created by a different tool.");
    numeric(envelope.schemaVersion, "schemaVersion", 1, RIBBON_SAVE_SCHEMA_VERSION);
    if (envelope.savedAt !== undefined) text(envelope.savedAt, "savedAt", 80);
    data = record(envelope.data, "Chart data");
    if ((envelope.schemaVersion as number) >= 11) {
      const required = ["eligibility", "vectors", "familyTrackerEnabled", "familyKids", "jobExperiences", "highlights", "education", "opbs"];
      if (envelope.schemaVersion === RIBBON_SAVE_SCHEMA_VERSION) required.push("rankHistory", "planningDates");
      for (const key of required) {
        if (!Object.hasOwn(data, key)) throw new Error(`Current chart is missing ${key}.`);
      }
    }
  }
  const identity = record(data.identity, "Member identity");
  text(identity.name, "identity.name", 300); text(identity.rank, "identity.rank", 30);
  if (![...RIBBON_RANKS, "Maj(s)", "Lt Col(s)", "Col(s)"].includes(identity.rank as never)) throw new Error("identity.rank is not a supported officer grade.");
  validateFields(identity, "identity", ["name", "rank", "jobLocation", "dor", "das", "yearGroup", "adjustedYearGroup"]);
  const timeline = record(data.timeline, "Career timeline");
  numeric(timeline.eadYear, "timeline.eadYear", 1980, 2055);
  if (timeline.startingYear !== undefined) numeric(timeline.startingYear, "timeline.startingYear", 1980, 2055);
  for (const key of ["promotion", "developmentalEducation", "leadership", "careerFieldEducation", "personal"]) {
    if (timeline[key] === undefined && !["promotion", "developmentalEducation"].includes(key) && !(Object.hasOwn(envelope, "schema") && (envelope.schemaVersion as number) >= 11)) continue;
    list(timeline[key], `timeline.${key}`, RIBBON_TIMELINE_YEARS).forEach((v, i) => text(v, `timeline.${key}[${i}]`, 1000));
  }
  const vectorIds = new Set<string>(); const segmentIds = new Set<string>();
  list(data.vectors, "vectors", 3).forEach((v, i) => {
    const row = record(v, `vectors[${i}]`); text(row.id, `vectors[${i}].id`, 100); text(row.label, `vectors[${i}].label`, 300);
    if (!row.id || vectorIds.has(row.id as string)) throw new Error("Vector IDs must be nonempty and unique."); vectorIds.add(row.id as string);
    list(row.segments, `vectors[${i}].segments`, 150).forEach((v, j) => {
      const seg = record(v, `vectors[${i}].segments[${j}]`); text(seg.id, "Block ID", 100); text(seg.label, "Block label", 1000);
      if (!seg.id || segmentIds.has(seg.id as string)) throw new Error("Block IDs must be nonempty and unique across the chart."); segmentIds.add(seg.id as string);
      numeric(seg.startYear, "Block start", 1900, 2200, 0.5); numeric(seg.endYear, "Block end", 1900, 2200, 0.5);
      if ((seg.endYear as number) <= (seg.startYear as number)) throw new Error("A career block must end after it starts.");
      if (!RIBBON_COLOR_IDS.includes(seg.color as never)) throw new Error(`Unsupported block color: ${String(seg.color)}.`);
    });
  });
  if (data.eligibility !== undefined) {
    const groups = record(data.eligibility, "eligibility");
    for (const key of ["de", "do", "sqCc"]) if (groups[key] !== undefined) validateFields(groups[key], `eligibility.${key}`, [], ["select", "candidate"]);
  }
  if (data.familyTrackerEnabled !== undefined && typeof data.familyTrackerEnabled !== "boolean") throw new Error("familyTrackerEnabled must be true or false.");
  if (data.familyKids !== undefined) list(data.familyKids, "familyKids", 3).forEach((v) => {
    const kid = record(v, "Child"); validateFields(kid, "Child", ["id", "label"], ["enabled"]); numeric(kid.startGrade, "Child grade anchor", -1000, 1000);
  });
  if (data.jobExperiences !== undefined) validateFields(data.jobExperiences, "jobExperiences", ["deployments", "returnDate", "cagExecAideText", "sqCcToursText"], ["deployment", "shortTour", "cyberEngineer", "expedComms", "dodinOps", "dco", "oco", "crewCc", "teamLead", "fltCc", "msnCc", "directorOfOperations", "detCc", "cagExecAide", "instructorUct", "instructorCyber200Cyber300", "instructorWic", "instructorSosBmtOts", "staffJoint", "staffHaf", "staffMajcom", "staffNaf", "jtQualified", "jpmeI", "jpmeIi", "sqCcTours", "instructorUctCyberWic"]);
  if (data.highlights !== undefined) validateFields(data.highlights, "highlights", ["operational", "awards", "certs"]);
  if (data.education !== undefined) validateFields(data.education, "education", ["pdeDetails", "aadDetails", "cyber200Details", "cyber300Details", "ideProgram", "cyber400Details", "sdeProgram", "specialProgramsOther"], ["pde", "pdeDg", "aad", "honors", "cyber200", "cyber300", "ide", "ideDg", "cyber400", "sde", "sdeDg", "ewi", "ews", "asg", "wic", "wicDg", "cnodp", "darpa", "ldc", "c2wac"]);
  for (const key of ["opbs", "oprs"]) if (data[key] !== undefined) list(data[key], key, 3).forEach((v) => validateFields(v, key, ["year", "bottomLineRater", "bottomLineAdditionalRater"]));
  const rankIds = new Set<string>();
  if (data.rankHistory !== undefined) list(data.rankHistory, "rankHistory", 80).forEach((v) => {
    const entry = record(v, "Pin-on entry"); text(entry.id, "Pin-on ID", 100); if (!entry.id || rankIds.has(entry.id as string)) throw new Error("Pin-on IDs must be nonempty and unique."); rankIds.add(entry.id as string); if (!RIBBON_RANKS.includes(entry.rank as never)) throw new Error("Pin-on grade is invalid.");
    validateDate(entry.date, "Pin-on date"); if (!["entered", "estimate"].includes(entry.basis as string)) throw new Error("Pin-on basis must be entered or estimate.");
  });
  const planningIds = new Set<string>();
  if (data.planningDates !== undefined) list(data.planningDates, "planningDates", 150).forEach((v) => {
    const entry = record(v, "Planning date"); text(entry.id, "Planning ID", 100); if (!entry.id || planningIds.has(entry.id as string)) throw new Error("Planning IDs must be nonempty and unique."); planningIds.add(entry.id as string); text(entry.label, "Planning label", 500); validateDate(entry.date, "Planning date");
    if (!["promotion", "education", "command"].includes(entry.kind as string)) throw new Error("Planning-date category is invalid.");
  });
  return data;
};
export const ribbonImportWarnings = (data: UnknownRecord): string[] => {
  const ead = (data.timeline as UnknownRecord).eadYear as number;
  const hidden = (data.vectors as RibbonComparisonVector[]).flatMap((r) => r.segments).filter((s) => s.endYear <= ead || s.startYear >= ead + 30).length;
  const warnings = hidden ? [`${hidden} career block${hidden === 1 ? " is" : "s are"} outside the EAD window and hidden; original dates are retained in the saved chart.`] : [];
  if ((data.identity as UnknownRecord).rank && String((data.identity as UnknownRecord).rank).endsWith("(s)")) warnings.push("This file uses a legacy selected-grade label. Choose the actual current rank; selection does not establish a pin-on date.");
  return warnings;
};
export const parseRibbonComparisonChart = (input: unknown): RibbonComparisonChart => {
  const data = extractRibbonChartData(input); const identity = data.identity as UnknownRecord; const timeline = data.timeline as UnknownRecord;
  const eadYear = timeline.eadYear as number;
  const pad = (value: unknown) => Array.from({ length: RIBBON_TIMELINE_YEARS }, (_, i) => (value as string[])[i] ?? "");
  return {
    identity: { name: (identity.name as string).trim() || "Unnamed member", rank: identity.rank as string, dor: identity.dor as string | undefined },
    timeline: { eadYear, startingYear: (timeline.startingYear as number | undefined) ?? eadYear, promotion: pad(timeline.promotion), developmentalEducation: pad(timeline.developmentalEducation) },
    vectors: (data.vectors as RibbonComparisonVector[]).map((r) => ({ ...r, segments: r.segments.map((s) => ({ ...s })).sort((a, b) => a.startYear - b.startYear) })),
    rankHistory: (data.rankHistory as RibbonRankEntry[] | undefined)?.map((entry) => ({ ...entry })) ?? [],
    planningDates: (data.planningDates as RibbonPlanningDate[] | undefined)?.map((entry) => ({ ...entry })) ?? [],
    warnings: ribbonImportWarnings(data)
  };
};
export const ribbonTimelineValue = (chart: RibbonComparisonChart, key: "promotion" | "developmentalEducation", year: number) => {
  const index = year - chart.timeline.eadYear;
  return index >= 0 && index < RIBBON_TIMELINE_YEARS ? chart.timeline[key][index] ?? "" : "";
};

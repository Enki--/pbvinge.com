import { RIBBON_RANKS, type RibbonRankEntry, type RibbonComparisonChart } from "./ribbonChartFile";
export const SCOD_REFERENCE = {
  published: "2022-02-17",
  url: "https://www.afpc.af.mil/News/Article-Display/Article/2938590/air-force-announces-officer-performance-report-static-closeout-dates-beginning/",
  dates: { "2d Lt": "31 Oct", "1st Lt": "31 Oct", Capt: "31 Aug", Maj: "31 May", "Lt Col": "31 May", Col: "28 Feb" } as Record<string, string>
};
export const dateOnly = (value: string): string | null => {
  let normalized = value.trim();
  const english = normalized.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (english) {
    const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(english[2].toLowerCase());
    if (month < 0) return null;
    normalized = `${english[3]}-${String(month + 1).padStart(2, "0")}-${english[1].padStart(2, "0")}`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return null;
  const parsed = new Date(`${normalized}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === normalized ? normalized : null;
};
/** Board consideration labels never establish a pin-on. The selector represents today's held grade. */
export const rankReferenceForYear = (
  identity: { rank: string; dor: string }, history: RibbonRankEntry[], year: number, currentYear = new Date().getFullYear()
): { rank: string; scod: string; basis: string } | null => {
  const currentRank = RIBBON_RANKS.includes(identity.rank as never) ? identity.rank : null;
  const currentDor = dateOnly(identity.dor);
  const entries = history.filter((e) => dateOnly(e.date)).map((e) => ({ ...e }));
  if (currentRank && currentDor && Number(currentDor.slice(0, 4)) <= currentYear) entries.push({ id: "current-dor", rank: currentRank, date: currentDor, basis: "entered" });
  const latest = entries.filter((e) => e.date <= `${year}-12-31`).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const rank = latest?.rank ?? (year >= currentYear ? currentRank : null);
  if (!rank) return null;
  const begins = ["2d Lt", "1st Lt"].includes(rank) ? 2022 : 2023;
  return {
    rank,
    scod: year < begins ? "Not established" : SCOD_REFERENCE.dates[rank],
    basis: latest ? `${latest.basis === "estimate" ? "Estimated" : "Entered"} pin-on; year-end grade reference` : "Current grade carried forward as an estimate; year-end reference"
  };
};
export const shiftedGradeAnchor = (grade: number, deltaYears: number) => grade + deltaYears;
export const intersectCareerRange = (start: number, end: number, ead: number, viewStart = ead, viewEnd = ead + 30) => {
  const visibleStart = Math.max(start, ead, viewStart); const visibleEnd = Math.min(end, ead + 30, viewEnd);
  return visibleEnd > visibleStart ? { start: visibleStart, end: visibleEnd } : null;
};
export const promotionDropSource = (types: readonly string[], raw: string, activeIndex: number | null, length = 30) => {
  if (!types.includes("application/x-ribbon-promotion-index") || !/^\d+$/.test(raw) || activeIndex === null) return null;
  const index = Number(raw);
  return Number.isInteger(index) && index >= 0 && index < length && index === activeIndex ? index : null;
};

export const pinOnTimelineValue = (chart: Pick<RibbonComparisonChart, "identity" | "rankHistory">, year: number) => {
  const entries = (chart.rankHistory ?? []).filter((entry) => dateOnly(entry.date)).map((entry) => ({ ...entry }));
  const dor = dateOnly(chart.identity.dor ?? "");
  if (dor && RIBBON_RANKS.includes(chart.identity.rank as never) && !entries.some((entry) => entry.rank === chart.identity.rank && entry.date === dor)) entries.push({ id: "current-dor", rank: chart.identity.rank, date: dor, basis: "entered" });
  return entries.filter((entry) => entry.date.startsWith(`${year}-`)).sort((a, b) => a.date.localeCompare(b.date)).map((entry) => `${entry.rank} ${entry.date.slice(5)}${entry.basis === "estimate" ? " (est.)" : ""}`).join("; ");
};

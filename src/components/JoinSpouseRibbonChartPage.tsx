import React, { useEffect, useMemo, useRef, useState } from "react";
import "../css/join-spouse-ribbon-chart.css";
import {
  parseRibbonComparisonChart,
  ribbonTimelineValue,
  type RibbonComparisonChart,
  type RibbonComparisonSegment,
  type RibbonComparisonVector
} from "../utils/ribbonChartFile";
import { buildJoinSpousePdf, joinSpousePdfFilename } from "../utils/joinSpousePdf";

type RangeYears = 10 | 20 | 30;
type MemberNumber = 1 | 2;

interface MemberSlotState {
  chart: RibbonComparisonChart | null;
  fileName: string;
  error: string;
}

const emptyMember = (): MemberSlotState => ({ chart: null, fileName: "", error: "" });
const YEAR_OPTIONS = Array.from({ length: 76 }, (_, index) => 1980 + index);

const VECTOR_COLORS: Record<string, { background: string; foreground: string }> = {
  green: { background: "#94d31b", foreground: "#111827" },
  blue: { background: "#2563eb", foreground: "#ffffff" },
  red: { background: "#dc2626", foreground: "#ffffff" },
  yellow: { background: "#fde047", foreground: "#111827" },
  orange: { background: "#f97316", foreground: "#ffffff" },
  purple: { background: "#7c3aed", foreground: "#ffffff" },
  slate: { background: "#64748b", foreground: "#ffffff" }
};

const MemberUploadCard: React.FC<{
  memberNumber: MemberNumber;
  state: MemberSlotState;
  onFile: (file: File) => void;
  onRemove: () => void;
}> = ({ memberNumber, state, onFile, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setDragging] = useState(false);
  const memberLabel = `Member ${memberNumber}`;

  const receiveFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <section
      className={`join-upload-card join-upload-card-${memberNumber}${isDragging ? " is-dragging" : ""}${state.chart ? " is-loaded" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        receiveFiles(event.dataTransfer.files);
      }}
      aria-labelledby={`join-member-${memberNumber}-title`}
    >
      <div className="join-upload-number" aria-hidden="true">{memberNumber}</div>
      <div className="join-upload-copy">
        <p className="join-card-kicker">{memberLabel}</p>
        {state.chart ? (
          <>
            <h2 id={`join-member-${memberNumber}-title`}>{state.chart.identity.rank} {state.chart.identity.name}</h2>
            <p className="join-upload-meta">
              <span>{state.fileName}</span>
              <span>EAD {state.chart.timeline.eadYear}</span>
              <span>Starts {state.chart.timeline.startingYear}</span>
            </p>
          </>
        ) : (
          <>
            <h2 id={`join-member-${memberNumber}-title`}>Upload ribbon chart JSON</h2>
            <p>Drop the member&apos;s saved chart here or choose the file from this device.</p>
          </>
        )}
        {state.error && <p className="join-upload-error" role="alert">{state.error}</p>}
      </div>
      <div className="join-upload-actions">
        <button type="button" className="join-button join-button-secondary" onClick={() => inputRef.current?.click()}>
          {state.chart ? "Replace JSON" : "Choose JSON"}
        </button>
        {state.chart && <button type="button" className="join-button join-button-quiet" onClick={onRemove}>Remove</button>}
      </div>
      <input
        ref={inputRef}
        className="join-file-input"
        type="file"
        accept="application/json,.json"
        aria-label={`Upload ${memberLabel} ribbon chart JSON`}
        onChange={(event) => {
          receiveFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </section>
  );
};

const timelineCell = (chart: RibbonComparisonChart, key: "promotion" | "developmentalEducation", year: number) => {
  const outsideCareer = year < chart.timeline.eadYear || year >= chart.timeline.eadYear + 30;
  const value = ribbonTimelineValue(chart, key, year);
  return (
    <div
      key={`${key}-${year}`}
      className={`join-timeline-cell join-${key === "promotion" ? "promotion" : "pme"}-cell${value ? " has-value" : ""}${outsideCareer ? " is-outside" : ""}`}
      title={value ? `${value} - ${year}` : outsideCareer ? `Outside this member's 30-year EAD window` : `${year}: no milestone entered`}
    >
      {value || (outsideCareer ? <span aria-hidden="true">-</span> : null)}
    </div>
  );
};

const VectorTrack: React.FC<{
  chart: RibbonComparisonChart;
  vector: RibbonComparisonVector;
  startYear: number;
  rangeYears: RangeYears;
}> = ({ chart, vector, startYear, rangeYears }) => {
  const endYear = startYear + rangeYears;
  const visibleSegments = vector.segments.flatMap((segment: RibbonComparisonSegment) => {
    const visibleStart = Math.max(segment.startYear, startYear);
    const visibleEnd = Math.min(segment.endYear, endYear);
    return visibleEnd > visibleStart ? [{ segment, visibleStart, visibleEnd }] : [];
  });

  return (
    <div
      className="join-vector-track"
      style={{ backgroundSize: `${100 / rangeYears}% 100%` }}
      aria-label={`${chart.identity.name} ${vector.label}`}
    >
      {visibleSegments.map(({ segment, visibleStart, visibleEnd }) => {
        const segmentColor = VECTOR_COLORS[segment.color] ?? VECTOR_COLORS.green;
        return (
          <div
            key={segment.id}
            className="join-vector-segment"
            style={{
              left: `${((visibleStart - startYear) / rangeYears) * 100}%`,
              width: `${((visibleEnd - visibleStart) / rangeYears) * 100}%`,
              background: segmentColor.background,
              color: segmentColor.foreground
            }}
            title={`${segment.label}: ${segment.startYear}-${segment.endYear}`}
          >
            <span>{segment.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const MemberTimeline: React.FC<{
  memberNumber: MemberNumber;
  chart: RibbonComparisonChart;
  years: number[];
  startYear: number;
  rangeYears: RangeYears;
}> = ({ memberNumber, chart, years, startYear, rangeYears }) => (
  <>
    <div className={`join-member-heading join-member-heading-${memberNumber}`}>
      <span>Member {memberNumber}</span>
      <strong>{chart.identity.rank} {chart.identity.name}</strong>
      <small>EAD {chart.timeline.eadYear}</small>
    </div>

    <div className="join-row-label">Promotion</div>
    {years.map((year) => timelineCell(chart, "promotion", year))}

    <div className="join-row-label">PME</div>
    {years.map((year) => timelineCell(chart, "developmentalEducation", year))}

    {chart.vectors.map((vector, index) => (
      <React.Fragment key={vector.id}>
        <div className="join-row-label">{vector.label || `Vec ${index + 1}`}</div>
        <VectorTrack chart={chart} vector={vector} startYear={startYear} rangeYears={rangeYears} />
      </React.Fragment>
    ))}
  </>
);

const JoinSpouseRibbonChartPage: React.FC = () => {
  const [memberOne, setMemberOne] = useState<MemberSlotState>(() => emptyMember());
  const [memberTwo, setMemberTwo] = useState<MemberSlotState>(() => emptyMember());
  const [startYear, setStartYear] = useState(2024);
  const [rangeYears, setRangeYears] = useState<RangeYears>(10);
  const [pdfMessage, setPdfMessage] = useState("");

  const loadedMembers = memberOne.chart && memberTwo.chart
    ? [memberOne.chart, memberTwo.chart] as [RibbonComparisonChart, RibbonComparisonChart]
    : null;

  useEffect(() => {
    if (!memberOne.chart || !memberTwo.chart) return;
    setStartYear(Math.min(memberOne.chart.timeline.startingYear, memberTwo.chart.timeline.startingYear));
    setPdfMessage("");
  }, [memberOne.chart, memberTwo.chart]);

  const years = useMemo(
    () => Array.from({ length: rangeYears }, (_, index) => startYear + index),
    [rangeYears, startYear]
  );

  const loadMember = async (memberNumber: MemberNumber, file: File) => {
    const setMember = memberNumber === 1 ? setMemberOne : setMemberTwo;
    try {
      if (!file.name.toLowerCase().endsWith(".json")) throw new Error("Choose a .json file saved from the ribbon-chart page.");
      const parsed = JSON.parse(await file.text()) as unknown;
      const chart = parseRibbonComparisonChart(parsed);
      setMember({ chart, fileName: file.name, error: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "That file could not be read.";
      setMember((current) => ({ ...current, error: message }));
    }
  };

  const downloadPdf = () => {
    if (!loadedMembers) return;
    try {
      const bytes = buildJoinSpousePdf({ members: loadedMembers, startYear, yearCount: rangeYears });
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = joinSpousePdfFilename(loadedMembers);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setPdfMessage(`PDF downloaded with ${rangeYears / 10} ${rangeYears === 10 ? "page" : "pages"}.`);
    } catch {
      setPdfMessage("The PDF could not be generated. Please try again.");
    }
  };

  const chartStyle = {
    "--join-year-count": rangeYears,
    "--join-chart-min-width": `${148 + rangeYears * 82}px`
  } as React.CSSProperties;

  return (
    <div className="join-page">
      <header className="join-hero">
        <div>
          <p className="join-eyebrow">17X Ribbon Chart</p>
          <h1>Join Spouse Career Planner</h1>
          <p className="join-lede">
            Place two career plans on one calendar to see promotion, PME, and all three career vector options together.
          </p>
        </div>
        <a className="join-editor-link" href="/17x-ribbon-chart">Open individual ribbon chart</a>
      </header>

      <section className="join-upload-panel" aria-labelledby="join-upload-title">
        <div className="join-panel-heading">
          <div>
            <p className="join-step">Step 1</p>
            <h2 id="join-upload-title">Load both career plans</h2>
          </div>
          <p className="join-privacy-note">
            <span aria-hidden="true">&#10003;</span> Private by design: files are read only in this browser and are never uploaded.
          </p>
        </div>
        <div className="join-upload-grid">
          <MemberUploadCard memberNumber={1} state={memberOne} onFile={(file) => loadMember(1, file)} onRemove={() => setMemberOne(emptyMember())} />
          <MemberUploadCard memberNumber={2} state={memberTwo} onFile={(file) => loadMember(2, file)} onRemove={() => setMemberTwo(emptyMember())} />
        </div>
      </section>

      {loadedMembers ? (
        <section className="join-comparison" aria-labelledby="join-comparison-title">
          <div className="join-comparison-toolbar">
            <div>
              <p className="join-step">Step 2</p>
              <h2 id="join-comparison-title">Compare the plan</h2>
            </div>
            <div className="join-view-controls">
              <label className="join-year-control">
                <span>Start year</span>
                <select value={startYear} onChange={(event) => setStartYear(Number(event.currentTarget.value))}>
                  {YEAR_OPTIONS.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
              <div className="join-range-control">
                <span>Range</span>
                <div role="group" aria-label="Career plan year range">
                  {([10, 20, 30] as RangeYears[]).map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={rangeYears === count ? "is-selected" : ""}
                      aria-pressed={rangeYears === count}
                      onClick={() => setRangeYears(count)}
                    >
                      {count} years
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="join-button join-button-primary" onClick={downloadPdf}>
                Download PDF
              </button>
            </div>
          </div>

          {pdfMessage && <p className="join-pdf-status" role="status">{pdfMessage}</p>}

          <div className="join-chart-scroll">
            <div className="join-chart" style={chartStyle} aria-label={`Join spouse career comparison, ${startYear} through ${startYear + rangeYears - 1}`}>
              <div className="join-calendar-label">Calendar year</div>
              {years.map((year) => <div key={year} className="join-calendar-year">{year}</div>)}
              <MemberTimeline memberNumber={1} chart={loadedMembers[0]} years={years} startYear={startYear} rangeYears={rangeYears} />
              <div className="join-member-divider" aria-hidden="true" />
              <MemberTimeline memberNumber={2} chart={loadedMembers[1]} years={years} startYear={startYear} rangeYears={rangeYears} />
            </div>
          </div>
          <p className="join-chart-hint">Tip: hover a milestone or career block to see its exact year or range.</p>
        </section>
      ) : (
        <section className="join-empty-state" aria-live="polite">
          <div aria-hidden="true" className="join-empty-icon">1 + 2</div>
          <div>
            <h2>The shared timeline appears here</h2>
            <p>Load both members&apos; JSON files to align their career plans by calendar year.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default JoinSpouseRibbonChartPage;

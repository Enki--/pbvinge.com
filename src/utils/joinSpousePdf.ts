import type { RibbonComparisonChart, RibbonComparisonSegment } from "./ribbonChartFile";
import { ribbonTimelineValue } from "./ribbonChartFile";

export interface JoinSpousePdfOptions {
  members: [RibbonComparisonChart, RibbonComparisonChart];
  startYear: number;
  yearCount: 10 | 20 | 30;
  generatedAt?: Date;
}

const PAGE_WIDTH = 792;
const PAGE_HEIGHT = 612;
const YEARS_PER_PAGE = 10;

type Rgb = [number, number, number];

const color = (hex: string): Rgb => {
  const normalized = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255) as Rgb;
};

const COLORS = {
  ink: color("#172033"),
  muted: color("#5f6b7a"),
  border: color("#cbd5e1"),
  pale: color("#f8fafc"),
  white: color("#ffffff"),
  memberOne: color("#1d4ed8"),
  memberTwo: color("#0f766e"),
  promotion: color("#fff7d6"),
  pme: color("#eaf4ff"),
  empty: color("#f3f6fa")
};

const VECTOR_COLORS: Record<string, { background: Rgb; foreground: Rgb }> = {
  green: { background: color("#94d31b"), foreground: color("#111827") },
  blue: { background: color("#2563eb"), foreground: COLORS.white },
  red: { background: color("#dc2626"), foreground: COLORS.white },
  yellow: { background: color("#fde047"), foreground: color("#111827") },
  orange: { background: color("#f97316"), foreground: COLORS.white },
  purple: { background: color("#7c3aed"), foreground: COLORS.white },
  slate: { background: color("#64748b"), foreground: COLORS.white }
};

const number = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
};

const rgbCommand = (value: Rgb) => value.map(number).join(" ");

const ascii = (value: string) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[\u2010-\u2015]/g, "-")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, "\"")
  .replace(/[^\x20-\x7e]/g, "?");

const pdfEscape = (value: string) => ascii(value).replace(/([\\()])/g, "\\$1");

const estimatedWidth = (value: string, fontSize: number, bold = false) => {
  const units = ascii(value).split("").reduce((total, character) => {
    if (" ilI1.,:;'|".includes(character)) return total + 0.28;
    if ("MW@%&".includes(character)) return total + 0.82;
    if (character === " ") return total + 0.3;
    return total + 0.52;
  }, 0);
  return units * fontSize * (bold ? 1.04 : 1);
};

const truncate = (value: string, maxWidth: number, fontSize: number, bold = false) => {
  const clean = ascii(value).trim();
  if (estimatedWidth(clean, fontSize, bold) <= maxWidth) return clean;
  let result = clean;
  while (result.length && estimatedWidth(`${result}...`, fontSize, bold) > maxWidth) result = result.slice(0, -1);
  return `${result.trimEnd()}...`;
};

const wrapText = (value: string, maxWidth: number, fontSize: number, maxLines: number, bold = false) => {
  const words = ascii(value).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let line = "";
  let consumedWords = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (estimatedWidth(candidate, fontSize, bold) <= maxWidth) {
      line = candidate;
      consumedWords += 1;
      continue;
    }
    if (line) lines.push(line);
    line = estimatedWidth(word, fontSize, bold) <= maxWidth ? word : truncate(word, maxWidth, fontSize, bold);
    consumedWords += 1;
    if (lines.length >= maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && consumedWords < words.length) {
    const lastLine = lines[maxLines - 1];
    let shortened = lastLine;
    while (shortened.length && estimatedWidth(`${shortened}...`, fontSize, bold) > maxWidth) shortened = shortened.slice(0, -1);
    lines[maxLines - 1] = `${shortened.trimEnd()}...`;
  }
  return lines;
};

class PdfCanvas {
  private commands: string[] = [];

  rect(x: number, y: number, width: number, height: number, fill: Rgb, stroke: Rgb = COLORS.border, lineWidth = 0.6) {
    const pdfY = PAGE_HEIGHT - y - height;
    this.commands.push(
      `q ${number(lineWidth)} w ${rgbCommand(stroke)} RG ${rgbCommand(fill)} rg ${number(x)} ${number(pdfY)} ${number(width)} ${number(height)} re B Q`
    );
  }

  text(value: string, x: number, y: number, fontSize: number, options: {
    bold?: boolean;
    fill?: Rgb;
    align?: "left" | "center" | "right";
    maxWidth?: number;
  } = {}) {
    const bold = options.bold ?? false;
    const fill = options.fill ?? COLORS.ink;
    const maxWidth = options.maxWidth;
    const clean = maxWidth ? truncate(value, maxWidth, fontSize, bold) : ascii(value);
    const textWidth = estimatedWidth(clean, fontSize, bold);
    let drawX = x;
    if (options.align === "center") drawX -= textWidth / 2;
    if (options.align === "right") drawX -= textWidth;
    const baseline = PAGE_HEIGHT - y - fontSize;
    this.commands.push(
      `BT /${bold ? "F2" : "F1"} ${number(fontSize)} Tf ${rgbCommand(fill)} rg 1 0 0 1 ${number(drawX)} ${number(baseline)} Tm (${pdfEscape(clean)}) Tj ET`
    );
  }

  textBox(value: string, x: number, y: number, width: number, height: number, options: {
    fontSize?: number;
    bold?: boolean;
    fill?: Rgb;
    maxLines?: number;
    align?: "left" | "center";
  } = {}) {
    const fontSize = options.fontSize ?? 7.5;
    const bold = options.bold ?? false;
    const fill = options.fill ?? COLORS.ink;
    const maxLines = options.maxLines ?? 3;
    const align = options.align ?? "center";
    const lines = wrapText(value, Math.max(width - 8, 1), fontSize, maxLines, bold);
    const lineHeight = fontSize + 2;
    const blockHeight = lines.length * lineHeight;
    const firstY = y + Math.max((height - blockHeight) / 2, 2);
    lines.forEach((line, index) => {
      this.text(
        line,
        align === "center" ? x + width / 2 : x + 4,
        firstY + index * lineHeight,
        fontSize,
        { bold, fill, align, maxWidth: width - 8 }
      );
    });
  }

  output() {
    return this.commands.join("\n");
  }
}

const drawCellRow = (
  canvas: PdfCanvas,
  label: string,
  values: string[],
  x: number,
  y: number,
  labelWidth: number,
  cellWidth: number,
  rowHeight: number,
  activeFill: Rgb
) => {
  canvas.rect(x, y, labelWidth, rowHeight, COLORS.pale);
  canvas.textBox(label, x, y, labelWidth, rowHeight, { fontSize: 8, bold: true, maxLines: 2, align: "left" });
  values.forEach((value, index) => {
    const cellX = x + labelWidth + index * cellWidth;
    canvas.rect(cellX, y, cellWidth, rowHeight, value ? activeFill : COLORS.white);
    if (value) canvas.textBox(value, cellX, y, cellWidth, rowHeight, { fontSize: 7.2, bold: true, maxLines: 4 });
  });
};

const visibleSegments = (segments: RibbonComparisonSegment[], startYear: number, endYear: number) => (
  segments.flatMap((segment) => {
    const visibleStart = Math.max(segment.startYear, startYear);
    const visibleEnd = Math.min(segment.endYear, endYear);
    return visibleEnd > visibleStart ? [{ segment, visibleStart, visibleEnd }] : [];
  })
);

const drawVectorRow = (
  canvas: PdfCanvas,
  chart: RibbonComparisonChart,
  startYear: number,
  x: number,
  y: number,
  labelWidth: number,
  cellWidth: number,
  rowHeight: number
) => {
  const endYear = startYear + YEARS_PER_PAGE;
  canvas.rect(x, y, labelWidth, rowHeight, COLORS.pale);
  canvas.textBox(chart.vectorOne.label || "Vec 1", x, y, labelWidth, rowHeight, { fontSize: 8, bold: true, maxLines: 2, align: "left" });

  for (let index = 0; index < YEARS_PER_PAGE; index += 1) {
    canvas.rect(x + labelWidth + index * cellWidth, y, cellWidth, rowHeight, COLORS.white);
  }

  visibleSegments(chart.vectorOne.segments, startYear, endYear).forEach(({ segment, visibleStart, visibleEnd }) => {
    const segmentX = x + labelWidth + (visibleStart - startYear) * cellWidth;
    const segmentWidth = (visibleEnd - visibleStart) * cellWidth;
    const segmentColor = VECTOR_COLORS[segment.color] ?? VECTOR_COLORS.green;
    canvas.rect(segmentX, y + 7, segmentWidth, rowHeight - 14, segmentColor.background, COLORS.ink, 0.7);
    if (segmentWidth >= 24) {
      canvas.textBox(segment.label, segmentX, y + 7, segmentWidth, rowHeight - 14, {
        fontSize: 7,
        bold: true,
        fill: segmentColor.foreground,
        maxLines: 2
      });
    }
  });
};

const drawMember = (
  canvas: PdfCanvas,
  chart: RibbonComparisonChart,
  memberNumber: 1 | 2,
  pageStart: number,
  x: number,
  y: number,
  labelWidth: number,
  cellWidth: number
) => {
  const accent = memberNumber === 1 ? COLORS.memberOne : COLORS.memberTwo;
  const tableWidth = labelWidth + cellWidth * YEARS_PER_PAGE;
  const headerHeight = 28;
  const rowHeight = 54;
  const vectorHeight = 50;
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, index) => pageStart + index);

  canvas.rect(x, y, tableWidth, headerHeight, accent, accent);
  canvas.text(`MEMBER ${memberNumber}`, x + 10, y + 7, 8, { bold: true, fill: COLORS.white });
  canvas.text(`${chart.identity.rank} ${chart.identity.name}`, x + 78, y + 5, 11, {
    bold: true,
    fill: COLORS.white,
    maxWidth: tableWidth - 88
  });

  const promotionY = y + headerHeight;
  drawCellRow(
    canvas,
    "Promotion",
    years.map((year) => ribbonTimelineValue(chart, "promotion", year)),
    x,
    promotionY,
    labelWidth,
    cellWidth,
    rowHeight,
    COLORS.promotion
  );

  const pmeY = promotionY + rowHeight;
  drawCellRow(
    canvas,
    "PME",
    years.map((year) => ribbonTimelineValue(chart, "developmentalEducation", year)),
    x,
    pmeY,
    labelWidth,
    cellWidth,
    rowHeight,
    COLORS.pme
  );

  drawVectorRow(canvas, chart, pageStart, x, pmeY + rowHeight, labelWidth, cellWidth, vectorHeight);
  return headerHeight + rowHeight * 2 + vectorHeight;
};

const createPageContent = (
  options: JoinSpousePdfOptions,
  pageStart: number,
  pageNumber: number,
  totalPages: number
) => {
  const canvas = new PdfCanvas();
  const marginX = 32;
  const tableX = marginX;
  const tableWidth = PAGE_WIDTH - marginX * 2;
  const labelWidth = 112;
  const cellWidth = (tableWidth - labelWidth) / YEARS_PER_PAGE;
  const generatedAt = options.generatedAt ?? new Date();

  canvas.text("JOIN SPOUSE CAREER PLAN", tableX, 27, 17, { bold: true, fill: COLORS.ink });
  canvas.text(`${pageStart}-${pageStart + YEARS_PER_PAGE - 1}`, PAGE_WIDTH - marginX, 29, 10, {
    bold: true,
    fill: COLORS.muted,
    align: "right"
  });
  canvas.text("Promotion, professional military education, and primary career vector", tableX, 49, 8.5, { fill: COLORS.muted });

  const calendarY = 70;
  const calendarHeight = 26;
  canvas.rect(tableX, calendarY, labelWidth, calendarHeight, COLORS.ink, COLORS.ink);
  canvas.textBox("Calendar year", tableX, calendarY, labelWidth, calendarHeight, { fontSize: 8, bold: true, fill: COLORS.white, align: "left" });
  for (let index = 0; index < YEARS_PER_PAGE; index += 1) {
    const cellX = tableX + labelWidth + index * cellWidth;
    canvas.rect(cellX, calendarY, cellWidth, calendarHeight, COLORS.ink, COLORS.white, 0.45);
    canvas.text(String(pageStart + index), cellX + cellWidth / 2, calendarY + 7, 9, { bold: true, fill: COLORS.white, align: "center" });
  }

  const firstY = calendarY + calendarHeight;
  const memberHeight = drawMember(canvas, options.members[0], 1, pageStart, tableX, firstY, labelWidth, cellWidth);
  const secondY = firstY + memberHeight + 12;
  drawMember(canvas, options.members[1], 2, pageStart, tableX, secondY, labelWidth, cellWidth);

  const footerY = PAGE_HEIGHT - 26;
  canvas.text(
    `Generated ${generatedAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} - Data stays on the user's device`,
    tableX,
    footerY,
    7.5,
    { fill: COLORS.muted }
  );
  canvas.text(`Page ${pageNumber} of ${totalPages}`, PAGE_WIDTH - marginX, footerY, 7.5, {
    fill: COLORS.muted,
    align: "right"
  });

  return canvas.output();
};

const createPdf = (contents: string[]) => {
  const objects: string[] = [];
  const pageObjectIds = contents.map((_, index) => 5 + index * 2);
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Count ${contents.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  contents.forEach((content, index) => {
    const pageId = pageObjectIds[index];
    const contentId = pageId + 1;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
};

export const buildJoinSpousePdf = (options: JoinSpousePdfOptions) => {
  const totalPages = Math.ceil(options.yearCount / YEARS_PER_PAGE);
  const contents = Array.from({ length: totalPages }, (_, index) => (
    createPageContent(options, options.startYear + index * YEARS_PER_PAGE, index + 1, totalPages)
  ));
  return createPdf(contents);
};

export const joinSpousePdfFilename = (members: [RibbonComparisonChart, RibbonComparisonChart]) => {
  const safe = (value: string) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const names = members.map((member, index) => safe(member.identity.name) || `member-${index + 1}`);
  return `join-spouse-career-plan-${names.join("-")}.pdf`;
};

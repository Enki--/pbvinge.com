import React from "react";
import type { Era } from "../types/timeline";
import { formatRange, sortEvents } from "../utils/timeline";
import EventItem from "./EventItem";

interface EraCardProps {
  era: Era;
  isOpen: boolean;
  onToggle: () => void;
}

const resolveTheme = (era: Era): string => {
  if (era.tags?.includes("Airpower")) return "sunset";
  if (era.tags?.includes("Cold War")) return "mint";
  if (era.tags?.includes("Wars")) return "indigo";
  return "neutral";
};

const EraCard: React.FC<EraCardProps> = ({ era, isOpen, onToggle }) => {
  const theme = resolveTheme(era);
  const rangeLabel = formatRange(era.range.start, era.range.end);
  const sortedEvents = sortEvents(era.events);

  return (
    <section className={`pbv-era-card${isOpen ? " is-open" : ""}`} data-theme={theme}>
      <header
        className="pbv-era-header"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div>
          <p className="pbv-era-name">{era.title}</p>
          <p className="pbv-era-range">{rangeLabel}</p>
        </div>
        <span className="pbv-era-toggle" aria-hidden="true" />
      </header>
      {isOpen && (
        <div className="pbv-era-body">
          {era.summary && <p className="pbv-era-summary">{era.summary}</p>}
          {era.tags && (
            <div className="pbv-era-tags">
              {era.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <ul className="pbv-era-events">
            {sortedEvents.map((event, i) => (
              <li key={("date" in event ? event.date : event.dateRange.join("-")) + i} className="pbv-event-row">
                <EventItem event={event} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default EraCard;

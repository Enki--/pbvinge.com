import type { Era } from "../types/timeline";
import timelineData from "../data/timeline.json";
import React, { useState, useMemo, useEffect } from "react";
import FilterChips from "./FilterChips";
import EraCard from "./EraCard";
import { parseDate } from "../utils/timeline";
import "../css/timeline.css";

const TAGS = [
  "All",
  "Wars",
  "Cold War",
  "Airpower",
  "Economic Statecraft",
  "Space & Missiles"
];

const TimelinePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeEraId, setActiveEraId] = useState<string | null>(null);
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      setActiveEraId(hash);
    }
  }, []);

  const eras: Era[] = useMemo(() => {
    let filtered = timelineData.eras as Era[];
    if (activeFilter !== "All") {
      filtered = filtered.filter(e => e.tags?.includes(activeFilter));
    }
    return filtered.slice().sort((a, b) => parseDate(a.range.start) - parseDate(b.range.start));
  }, [activeFilter]);

  return (
    <div className="pbv-timeline">
      <div className="pbv-timeline-header">
        <h1 className="pbv-timeline-title">Major Events Timeline</h1>
        <p className="pbv-timeline-desc">Interactive, chronological timeline of major events from Patrick Vinge’s readings.</p>
      </div>
      <FilterChips value={activeFilter} onChange={setActiveFilter} tags={TAGS} />
      <section className="pbv-timeline-vertical">
        <div className="pbv-timeline-axis" aria-hidden="true" />
        {eras.map(era => (
          <EraCard
            key={era.id}
            era={era}
            isOpen={activeEraId === era.id}
            onToggle={() => setActiveEraId(activeEraId === era.id ? null : era.id)}
          />
        ))}
      </section>
    </div>
  );
};

export default TimelinePage;

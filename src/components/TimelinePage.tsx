import type { Era } from "../types/timeline";
import timelineData from "../data/timeline.json";
import React, { useState, useMemo, useEffect } from "react";
import FilterChips from "./FilterChips";
import EraCard from "./EraCard";
import EraBand from "./EraBand";
import DetailPanel from "./DetailPanel";
import { parseDate } from "../utils/timeline";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <main className="pbv-timeline-main">
      <nav aria-label="Breadcrumb" className="pbv-breadcrumb mb-4">
        <a href="/">Home</a> &gt; <a href="/research">Research</a> &gt; <span>Major Events Timeline</span>
      </nav>
      <h1 className="pbv-timeline-title">Major Events Timeline</h1>
      <p className="pbv-timeline-desc mb-6">Interactive, chronological timeline of major events from Patrick Vinge’s readings.</p>
      <FilterChips value={activeFilter} onChange={setActiveFilter} tags={TAGS} />
      {isMobile ? (
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
      ) : (
        <section className="pbv-timeline-horizontal">
          <div className="pbv-timeline-axis-horizontal" aria-hidden="true" />
          <div className="pbv-timeline-bands">
            {eras.map(era => (
              <EraBand
                key={era.id}
                era={era}
                isActive={activeEraId === era.id}
                onSelect={() => setActiveEraId(era.id)}
              />
            ))}
          </div>
          {activeEraId && (
            <DetailPanel
              era={eras.find(e => e.id === activeEraId)!}
              onClose={() => setActiveEraId(null)}
            />
          )}
        </section>
      )}
    </main>
  );
};

export default TimelinePage;

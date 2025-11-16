import React, { useMemo, useState } from "react";
import type { President } from "../types/presidents";
import presidentsData from "../data/presidents.json";
import FilterChips from "./FilterChips";
import PresidentCard from "./PresidentCard";
import "../css/presidents.css";

const PARTY_FILTERS = ["All", "Democratic", "Republican"] as const;

type PartyFilter = (typeof PARTY_FILTERS)[number];

const PresidentsPage: React.FC = () => {
  const [filter, setFilter] = useState<PartyFilter>("All");

  const administrations = useMemo(() => {
    const entries = (presidentsData.presidents as President[]).slice().sort((a, b) => Number(a.term.start) - Number(b.term.start));
    if (filter === "All") return entries;
    return entries.filter(president => president.party === filter);
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value as PartyFilter);
  };

  return (
    <div className="pbv-presidents">
      <div className="pbv-presidents-header">
        <h1>U.S. Presidents Since World War I</h1>
        <p>
          Quick reference for administrations from Woodrow Wilson to today, highlighting the vice presidents,
          cabinet secretaries who shaped strategy, and the wars, conflicts, and landmark events they managed.
        </p>
      </div>
      <FilterChips tags={[...PARTY_FILTERS]} value={filter} onChange={handleFilterChange} label="Party filter" />
      <section className="pbv-president-grid">
        {administrations.map(president => (
          <PresidentCard key={president.id} president={president} />
        ))}
      </section>
    </div>
  );
};

export default PresidentsPage;

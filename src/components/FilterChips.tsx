import React from "react";

interface FilterChipsProps {
  value: string;
  onChange: (tag: string) => void;
  tags: string[];
}

const FilterChips: React.FC<FilterChipsProps> = ({ value, onChange, tags }) => (
  <nav className="pbv-filter-chips" aria-label="Timeline Filters">
    {tags.map(tag => (
      <button
        key={tag}
        className={`pbv-chip${value === tag ? " pbv-chip-active" : ""}`}
        aria-pressed={value === tag}
        onClick={() => onChange(tag)}
        tabIndex={0}
        style={{ borderRadius: 10, marginRight: 12, padding: '6px 18px' }}
      >
        {tag}
      </button>
    ))}
  </nav>
);

export default FilterChips;

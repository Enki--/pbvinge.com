import React from "react";

interface FilterChipsProps {
  value: string;
  onChange: (tag: string) => void;
  tags: string[];
  label?: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({ value, onChange, tags, label = "Filters" }) => (
  <nav className="pbv-filter-chips" aria-label={label}>
    {tags.map(tag => (
      <button
        key={tag}
        type="button"
        className={`pbv-chip${value === tag ? " pbv-chip-active" : ""}`}
        aria-pressed={value === tag}
        onClick={() => onChange(tag)}
      >
        {tag}
      </button>
    ))}
  </nav>
);

export default FilterChips;

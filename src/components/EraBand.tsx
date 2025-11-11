import React from "react";
import type { Era } from "../types/timeline";

interface EraBandProps {
  era: Era;
  isActive: boolean;
  onSelect: () => void;
}

const EraBand: React.FC<EraBandProps> = ({ era, isActive, onSelect }) => (
  <div
    className={`pbv-era-band${isActive ? ' pbv-era-band-active' : ''}`}
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    style={{
      background: era.id === 'vietnam' ? '#FFF0E6' : era.tags?.includes('Cold War') ? '#EAF6EA' : '#E6F0FF',
      border: '1px solid #B5C7E0',
      borderRadius: 14,
      marginRight: 24,
      minWidth: 260,
      padding: 18,
      boxShadow: '0 2px 8px #0001',
      cursor: 'pointer',
      outline: isActive ? '2px solid #3B82F6' : 'none',
      fontFamily: 'serif',
      fontWeight: 600
    }}
    aria-label={era.title}
    aria-pressed={isActive}
  >
    {era.title} ({era.range.start.slice(0,4)}{era.range.end ? `–${era.range.end.slice(0,4)}` : ''})
  </div>
);

export default EraBand;

import React from "react";
import type { Era } from "../types/timeline";
import EventItem from "./EventItem";

interface DetailPanelProps {
  era: Era;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ era, onClose }) => (
  <aside className="pbv-detail-panel" style={{ position: 'fixed', top: 0, right: 0, width: 400, height: '100%', background: '#fff', borderLeft: '1px solid #D2D2D2', boxShadow: '-2px 0 12px #0002', zIndex: 100, padding: 24, overflowY: 'auto', borderRadius: '16px 0 0 16px' }}>
    <button onClick={onClose} aria-label="Close panel" style={{ position: 'absolute', top: 16, right: 16, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
    <h2 style={{ fontFamily: 'serif', fontWeight: 700 }}>{era.title} <span style={{ fontWeight: 400, fontSize: 18 }}>({era.range.start.slice(0,4)}{era.range.end ? `–${era.range.end.slice(0,4)}` : ''})</span></h2>
    <p style={{ marginBottom: 18 }}>{era.summary}</p>
    <ul>
      {era.events.sort((a, b) => (a.date || a.dateRange?.[0]).localeCompare(b.date || b.dateRange?.[0])).map((event, i) => (
        <li key={i}><EventItem event={event} /></li>
      ))}
    </ul>
  </aside>
);

export default DetailPanel;

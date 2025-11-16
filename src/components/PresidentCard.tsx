import React from "react";
import type { President } from "../types/presidents";

interface PresidentCardProps {
  president: President;
}

const formatTerm = (term: President["term"]): string => {
  if (!term.end) return term.start;
  return `${term.start}-${term.end}`;
};

const PresidentCard: React.FC<PresidentCardProps> = ({ president }) => {
  const partyClass = president.party === "Democratic" ? "pbv-party-dem" : "pbv-party-gop";
  return (
    <article className="pbv-president-card" id={president.id}>
      <header className="pbv-president-header">
        <div>
          <p className="pbv-president-name">{president.name}</p>
          <p className="pbv-president-term">{formatTerm(president.term)}</p>
        </div>
        <span className={`pbv-president-party ${partyClass}`}>{president.party}</span>
      </header>
      {president.summary && <p className="pbv-president-summary">{president.summary}</p>}
      {president.vicePresident && (
        <p className="pbv-president-vice">
          <strong>Vice President:</strong> {president.vicePresident}
        </p>
      )}
      <div className="pbv-president-sections">
        <section className="pbv-president-section">
          <h3>Cabinet & Advisers</h3>
          <ul className="pbv-cabinet-list">
            {president.cabinet.map(member => (
              <li key={`${president.id}-${member.role}-${member.name}`} className="pbv-cabinet-item">
                <p className="pbv-cabinet-role">{member.role}</p>
                <p className="pbv-cabinet-name">{member.name}</p>
                {member.notes && <p className="pbv-cabinet-notes">{member.notes}</p>}
              </li>
            ))}
          </ul>
        </section>
        <section className="pbv-president-section">
          <h3>Wars & Major Events</h3>
          <ul className="pbv-president-events">
            {president.events.map((event, index) => (
              <li key={`${president.id}-${event.period}-${index}`}>
                <span className="pbv-event-period">{event.period}</span>
                <p className="pbv-event-description">{event.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
};

export default PresidentCard;

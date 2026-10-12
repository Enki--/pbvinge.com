import React from "react";
import type { President, PresidentSource } from "../types/presidents";

interface PresidentCardProps {
  president: President;
}

const formatTerm = (term: President["term"]): string => {
  return `${term.start}–${term.end ?? "ongoing at snapshot"}`;
};

const Sources: React.FC<{ sources?: PresidentSource[] }> = ({ sources }) => {
  if (!sources?.length) return null;
  return (
    <p className="pbv-president-sources">
      Sources: {sources.map((source, index) => (
        <React.Fragment key={source.url}>
          {index > 0 && "; "}
          <a href={source.url}>{source.label}</a>
        </React.Fragment>
      ))}
    </p>
  );
};

const PresidentCard: React.FC<PresidentCardProps> = ({ president }) => {
  const partyClass = president.party === "Democratic" ? "pbv-party-dem" : "pbv-party-gop";
  return (
    <article className="pbv-president-card" id={president.id}>
      <header className="pbv-president-header">
        <div>
          <h2 className="pbv-president-name">{president.name}</h2>
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
      <Sources sources={president.sources} />
      <div className="pbv-president-sections">
        <section className="pbv-president-section">
          <h3>Cabinet & Advisers</h3>
          <ul className="pbv-cabinet-list">
            {president.cabinet.map(member => (
              <li key={`${president.id}-${member.role}-${member.name}`} className="pbv-cabinet-item">
                <p className="pbv-cabinet-role">{member.role}</p>
                <p className="pbv-cabinet-name">{member.name}</p>
                {member.notes && <p className="pbv-cabinet-notes">{member.notes}</p>}
                <Sources sources={member.sources} />
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
                <Sources sources={event.sources} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
};

export default PresidentCard;

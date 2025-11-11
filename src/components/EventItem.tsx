import React from "react";
import type { Era } from "../types/timeline";

interface EventItemProps {
  event: Era["events"][number];
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const isRange = "dateRange" in event;
  const start = isRange ? event.dateRange[0] : event.date;
  const end = isRange ? event.dateRange[1] : undefined;
  const label = end ? `${start.slice(0, 4)}–${end.slice(0, 4)}` : start.slice(0, 4);

  return (
    <div className="pbv-event-content">
      <span className="pbv-event-date">{label}</span>
      <div className="pbv-event-text">
        <p className="pbv-event-title">{event.title}</p>
        {event.notes && <p className="pbv-event-notes">{event.notes}</p>}
      </div>
    </div>
  );
};

export default EventItem;

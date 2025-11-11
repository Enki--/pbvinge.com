import React from "react";
import type { Era } from "../types/timeline";

interface EventItemProps {
  event: Era["events"][number];
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  if ("date" in event) {
    return <span><b>{event.date.slice(0,4)}</b>: {event.title}{event.notes ? ` — ${event.notes}` : ''}</span>;
  }
  if ("dateRange" in event) {
    return <span><b>{event.dateRange[0].slice(0,4)}–{event.dateRange[1].slice(0,4)}</b>: {event.title}{event.notes ? ` — ${event.notes}` : ''}</span>;
  }
  return null;
};

export default EventItem;

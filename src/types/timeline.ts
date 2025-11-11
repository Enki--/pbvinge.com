export type Era = {
  id: string;
  title: string;
  range: { start: string; end?: string };
  summary?: string;
  tags?: string[];
  events: (
    | { date: string; title: string; notes?: string }
    | { dateRange: [string, string]; title: string; notes?: string }
  )[];
};

export type CabinetMember = {
  role: string;
  name: string;
  notes?: string;
};

export type AdministrationEvent = {
  period: string;
  description: string;
};

export type President = {
  id: string;
  name: string;
  term: { start: string; end?: string };
  party: "Democratic" | "Republican";
  vicePresident?: string;
  summary?: string;
  cabinet: CabinetMember[];
  events: AdministrationEvent[];
};

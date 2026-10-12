export type PresidentSource = {
  label: string;
  url: string;
};

export type CabinetMember = {
  role: string;
  name: string;
  notes?: string;
  sources?: PresidentSource[];
};

export type AdministrationEvent = {
  period: string;
  description: string;
  sources?: PresidentSource[];
};

export type President = {
  id: string;
  name: string;
  term: { start: string; end?: string };
  party: "Democratic" | "Republican";
  vicePresident?: string;
  summary?: string;
  sources?: PresidentSource[];
  cabinet: CabinetMember[];
  events: AdministrationEvent[];
};

export type TimelineType =
  | "feeding"
  | "sleep"
  | "growth"
  | "medication"
  | "vaccination";
export interface TimelineItem {
  id: string;
  type: TimelineType;
  title: string;
  subtitle?: string;
  timestamp: string;
  status?: string;
  payload?: unknown;
}
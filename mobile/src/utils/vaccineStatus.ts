import { Vaccination } from "../models/Vaccination";
export type VaccineStatus =
  | "completed"
  | "today"
  | "upcoming"
  | "overdue";
export function getVaccineStatus(
  vaccine: Vaccination
): VaccineStatus {
  if (vaccine.completed === 1) {
    return "completed";
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(vaccine.dueDate);
  due.setHours(0, 0, 0, 0);
  if (due.getTime() === today.getTime()) {
    return "today";
  }
  if (due < today) {
    return "overdue";
  }
  return "upcoming";
}
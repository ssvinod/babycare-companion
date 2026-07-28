import { create } from "zustand";
import DashboardRepository from "../database/DashboardRepository";
interface DashboardState {
  todayFeedings: number;
  todayQuantity: number;
  lastFeeding: string | null;
  latestWeight: number | null;
  nextVaccine: string | null;
  nextVaccineDate: string | null;
  nextSleep: string | null;
  nextSleepTime: string | null;
  refresh: () => void;
}
export const useDashboardStore = create<DashboardState>((set) => ({
  todayFeedings: 0,
  todayQuantity: 0,
  lastFeeding: null,
  latestWeight: null,
  nextVaccine: null,
  nextVaccineDate: null,
  nextSleep: null,
  nextSleepTime: null,
  refresh: () => {
    const repo = new DashboardRepository();
    const summary = repo.getSummary();
    console.log("Dashboard Summary:", summary);
    set({
      todayFeedings: summary.todayFeedings,
      todayQuantity: summary.todayQuantity,
      lastFeeding: summary.lastFeeding,
      latestWeight: summary.latestWeight,
      nextVaccine: summary.nextVaccine,
      nextVaccineDate: summary.nextVaccineDate,
      nextSleep: summary.nextSleep,
      nextSleepTime: summary.nextSleepTime,
    });
  },
}));
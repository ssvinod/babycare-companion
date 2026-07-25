import { create } from "zustand";
import DashboardRepository from "../database/DashboardRepository";

interface DashboardState {
  todayFeedings: number;
  lastFeeding: string | null;

  refresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  todayFeedings: 0,
  lastFeeding: null,

  refresh: () => {
    const repo = new DashboardRepository();
    const summary = repo.getSummary();

    set({
      todayFeedings: summary.todayFeedings,
      lastFeeding: summary.lastFeeding,
    });
  },
}));
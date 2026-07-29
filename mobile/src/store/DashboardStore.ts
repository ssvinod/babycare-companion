import { create } from "zustand";
import DashboardRepository, {
  DashboardMedication,
} from "../database/DashboardRepository";
interface DashboardState {
  todayFeedings: number;
  todayQuantity: number;
  lastFeeding: string | null;
  latestWeight: number | null;
  nextVaccine: string | null;
  nextVaccineDate: string | null;
  nextSleep: string | null;
  nextSleepTime: string | null;
  todayMedications:
    DashboardMedication[];
  refresh: () => void;
}
export const useDashboardStore =
  create<DashboardState>(
    (set) => ({
      todayFeedings: 0,
      todayQuantity: 0,
      lastFeeding: null,
      latestWeight: null,
      nextVaccine: null,
      nextVaccineDate: null,
      nextSleep: null,
      nextSleepTime: null,
      todayMedications: [],
      refresh: () => {
        const repository =
          new DashboardRepository();
        const summary =
          repository.getSummary();
        set(summary);
      },
    })
  );
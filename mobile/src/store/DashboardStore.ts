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
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
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
      loading: false,
      error: null,
      refresh: async () => {
        set({
          loading: true,
          error: null,
        });
        try {
          const repository =
            new DashboardRepository();
          const summary =
            await repository.getSummary();
          set({
            ...summary,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error(
            "Failed to refresh dashboard:",
            error
          );
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to load dashboard",
          });
        }
      },
    })
  );
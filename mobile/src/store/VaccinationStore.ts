import { create } from "zustand";
import VaccinationRepository from "../database/VaccinationRepository";
import { Vaccination } from "../models/Vaccination";
interface VaccinationState {
  vaccines: Vaccination[];
  upcoming: number;
  completed: number;
  loadVaccinations(): Promise<void>;
  markCompleted(id: number): Promise<void>;
  markPending(id: number): Promise<void>;
}
export const useVaccinationStore =
create<VaccinationState>((set, get) => ({
  vaccines: [],
  upcoming: 0,
  completed: 0,
  async loadVaccinations() {
    const repo =
      new VaccinationRepository();
    set({
      vaccines:
        await repo.getAll(),
      upcoming:
        await repo.upcomingCount(),
      completed:
        await repo.completedCount(),
    });
  },
  async markCompleted(id) {
    const repo =
      new VaccinationRepository();
    await repo.markCompleted(id);
    await get().loadVaccinations();
  },
  async markPending(id) {
    const repo =
      new VaccinationRepository();
    await repo.markPending(id);
    await get().loadVaccinations();
  },
}));
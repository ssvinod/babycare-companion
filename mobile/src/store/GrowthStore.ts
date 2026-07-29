import { create } from "zustand";
import GrowthRepository from "../database/GrowthRepository";
import { Growth } from "../models/Growth";
interface GrowthStore {
  growths: Growth[];
  loadGrowths(): Promise<void>;
  addGrowth(
    growth: Growth
  ): Promise<void>;
  updateGrowth(
    growth: Growth
  ): Promise<void>;
  deleteGrowth(
    id: number
  ): Promise<void>;
}
export const useGrowthStore =
  create<GrowthStore>((set, get) => ({
    growths: [],
    loadGrowths: async () => {
      const repo =
        new GrowthRepository();
      const data =
        await repo.getAll();
      set({
        growths: data,
      });
    },
    addGrowth: async (growth) => {
      const repo =
        new GrowthRepository();
      await repo.insert(growth);
      await get().loadGrowths();
    },
    updateGrowth: async (growth) => {
      const repo =
        new GrowthRepository();
      await repo.update(growth);
      await get().loadGrowths();
    },
    deleteGrowth: async (id) => {
      const repo =
        new GrowthRepository();
      await repo.delete(id);
      await get().loadGrowths();
    },
  }));
import { create } from "zustand";
import { Baby } from "../models/Baby";
import BabyRepository from "../database/BabyRepository";

interface BabyStore {
  baby: Baby | null;
  loading: boolean;
  loadBaby: () => Promise<void>;
  setBaby: (baby: Baby) => Promise<void>;
}

export const useBabyStore = create<BabyStore>((set) => ({
  baby: null,
  loading: true,
  loadBaby: async () => {
    const repo = new BabyRepository();
    const baby = await repo.getBaby();
    set({
      baby,
      loading: false,
    });
  },

  setBaby: async (baby) => {
    const repo = new BabyRepository();
    await repo.saveBaby(baby);
    set({
      baby,
    });
  },
}));
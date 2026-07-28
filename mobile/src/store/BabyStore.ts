import { create } from "zustand";
import { Baby } from "../models/Baby";
import BabyRepository from "../database/BabyRepository";
import VaccinationRepository from "../database/VaccinationRepository";
import { generateVaccinationSchedule } from "../utils/generateVaccinationSchedule";
import { useDashboardStore } from "./DashboardStore";
interface BabyStore {
  baby: Baby | null;
  loading: boolean;
  loadBaby(): Promise<void>;
  setBaby(baby: Baby): Promise<void>;
}
export const useBabyStore = create<BabyStore>((set) => ({
  baby: null,
  loading: true,
  loadBaby: async () => {
    console.log("Loading Baby...");
    const repo = new BabyRepository();
    const baby = await repo.getBaby();
    console.log("Loaded Baby:", baby);
    if (baby) {
      const vaccinationRepo = new VaccinationRepository();
      const count = await vaccinationRepo.count();
      console.log("Vaccination Count:", count);
      if (count === 0) {
        const schedule = generateVaccinationSchedule(
          baby.birthDate
        );
        console.log(
          "Generating Vaccines:",
          schedule.length
        );
        await vaccinationRepo.insertMany(schedule);
        useDashboardStore.getState().refresh();
        console.log(
          "Vaccination Schedule Created"
        );
      }
      // Refresh dashboard AFTER vaccination generation
      useDashboardStore.getState().refresh();
    }
    set({
      baby,
      loading: false,
    });
  },
  setBaby: async (baby) => {
    console.log("Saving Baby...");
    const repo = new BabyRepository();
    await repo.saveBaby(baby);
    console.log("Baby Saved");
    const vaccinationRepo =
      new VaccinationRepository();
    const count =
      await vaccinationRepo.count();
    console.log("Vaccination Count:", count);
    if (count === 0) {
      const schedule =
        generateVaccinationSchedule(
          baby.birthDate
        );
      console.log(
        "Generating Vaccines:",
        schedule.length
      );
      await vaccinationRepo.insertMany(
        schedule
      );
      console.log(
        "Vaccination Schedule Created"
      );
    }
    useDashboardStore.getState().refresh();
    set({
      baby,
    });
  },
}));
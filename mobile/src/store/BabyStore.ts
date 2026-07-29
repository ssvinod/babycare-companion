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
    const GrowthRepository =
      (await import("../database/GrowthRepository"))
        .default;
    const growthRepo =
      new GrowthRepository();
    const latest =
      await growthRepo.latest();

    const weightChanged =
      Number(latest?.weight ?? -1) !==
      Number(baby.weight ?? 0);

    const heightChanged =
      Number(latest?.height ?? -1) !==
      Number(baby.height ?? 0);

    if (
      baby.weight != null &&
      baby.height != null &&
      (weightChanged || heightChanged)
    ) {
      await growthRepo.insert({
        date: new Date().toISOString(),
        weight: baby.weight ?? 0,
        height: baby.height ?? 0,
        headCircumference:
          Number(latest?.headCircumference ?? 0),
        notes: "Profile Updated",
      });
    }
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
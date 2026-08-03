import { create } from "zustand";
import * as Notifications from "expo-notifications";
import { Baby } from "../models/Baby";
import BabyRepository from "../database/BabyRepository";
import GrowthRepository from "../database/GrowthRepository";
import VaccinationRepository from "../database/VaccinationRepository";
import DatabaseRepository from "../database/DatabaseRepository";
import { generateVaccinationSchedule } from "../utils/generateVaccinationSchedule";
import { useDashboardStore } from "./DashboardStore";
interface BabyStore {
  baby: Baby | null;
  loading: boolean;
  loadBaby(): Promise<void>;
  setBaby(
    baby: Baby
  ): Promise<void>;
  deleteBabyProfile(): Promise<void>;
}
export const useBabyStore = create<BabyStore>((set) => ({
  baby: null,
  loading: false,
  loadBaby: async () => {
    try {
      console.log("Loading Baby...");
      const repository = new BabyRepository();
      const baby = await repository.getBaby();
      console.log("Loaded Baby:", baby);
      set({
        baby,
        loading: false,
      });
      if (baby) {
        await useDashboardStore
          .getState()
          .refresh();
      }
    } catch (error) {
      console.error(
        "Unable to load baby:",
        error
      );
      set({
        baby: null,
        loading: false,
      });
      throw error;
    }
  },
  setBaby: async (baby) => {
    console.log("Saving Baby...");
    const babyRepository =
      new BabyRepository();
    await babyRepository.saveBaby(baby);
    const hasValidWeight =
      typeof baby.weight === "number" &&
      Number.isFinite(baby.weight) &&
      baby.weight > 0;
    const hasValidHeight =
      typeof baby.height === "number" &&
      Number.isFinite(baby.height) &&
      baby.height > 0;
    if (
      hasValidWeight &&
      hasValidHeight
    ) {
      const growthRepository =
        new GrowthRepository();
      const latest =
        await growthRepository.latest();
      const weightChanged =
        Number(latest?.weight ?? -1) !==
        Number(baby.weight);
      const heightChanged =
        Number(latest?.height ?? -1) !==
        Number(baby.height);
      if (
        !latest ||
        weightChanged ||
        heightChanged
      ) {
        await growthRepository.insert({
          date: new Date().toISOString(),
          weight: baby.weight as number,
          height: baby.height as number,
          headCircumference:
            latest?.headCircumference ??
            null,
          notes: latest
            ? "Profile Updated"
            : "Birth Measurement",
        });
      }
    }
    const vaccinationRepository =
      new VaccinationRepository();
    const vaccinationCount =
      await vaccinationRepository.count();
    if (vaccinationCount === 0) {
      const schedule =
        generateVaccinationSchedule(
          baby.birthDate
        );
      await vaccinationRepository.insertMany(
        schedule
      );
    }
    set({
      baby,
      loading: false,
    });
    await useDashboardStore
      .getState()
      .refresh();
    console.log("Baby Saved");
  },
  deleteBabyProfile: async () => {
    console.log(
      "Deleting baby profile..."
    );
    try {
      await Notifications
        .cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn(
        "Unable to cancel notifications:",
        error
      );
    }
    const repository =
      new DatabaseRepository();
    await repository.resetEverything();
    useDashboardStore
      .getState()
      .reset();
    set({
      baby: null,
      loading: false,
    });
    console.log(
      "Baby profile deleted successfully."
    );
  },
}));
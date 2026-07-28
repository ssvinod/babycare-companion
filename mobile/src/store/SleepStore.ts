import { create } from "zustand";
import SleepRepository from "../database/SleepRepository";
import { Sleep } from "../models/Sleep";
interface SleepStore {
  sleeps: Sleep[];
  activeSleep: Sleep | null;
  loadSleeps(): Promise<void>;
  startSleep(): Promise<void>;
  finishSleep(
    id: number,
    endTime: string
  ): Promise<void>;
  deleteSleep(id: number): Promise<void>;
}
export const useSleepStore =
create<SleepStore>((set, get) => ({
  sleeps: [],
  activeSleep: null,
  loadSleeps: async () => {
    const repo = new SleepRepository();
    const data = await repo.getAll();
    const active = await repo.getActiveSleep();
    set({
      sleeps: data,
      activeSleep: active,
    });
  },
  startSleep: async () => {
    console.log("SleepStore.startSleep()");
  
    const repo = new SleepRepository();
  
    await repo.startSleep(
      new Date().toISOString()
    );
  
    console.log("Loading sleeps...");
  
    await get().loadSleeps();
  
    console.log("Active Sleep:", get().activeSleep);
  },
  finishSleep: async (
    id,
    endTime
  ) => {
    const repo = new SleepRepository();
    await repo.finishSleep(
      id,
      endTime
    );
    await get().loadSleeps();
  },
  deleteSleep: async id => {
    const repo = new SleepRepository();
    await repo.delete(id);
    await get().loadSleeps();
  },
}));
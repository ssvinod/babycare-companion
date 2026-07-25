import { create } from "zustand";

import FeedingRepository from "../database/FeedingRepository";
import { Feeding } from "../models/Feeding";
import { useDashboardStore } from "./DashboardStore";;

interface FeedingStore {
  feedings: Feeding[];

  loadFeedings: () => Promise<void>;

  addFeeding: (
    feeding: Feeding
  ) => Promise<void>;
  deleteFeeding:(id:number)=>Promise<void>;
}

export const useFeedingStore =
create<FeedingStore>((set) => ({

  feedings: [],

  loadFeedings: async () => {
    const repo = new FeedingRepository();

    const data =
      await repo.getAll();

    set({
      feedings: data,
    });
  },

  addFeeding: async (feeding) => {
    const repo = new FeedingRepository();
    await repo.insert(feeding);
    const updated = await repo.getAll();
    set({
      feedings: updated,
    });
    useDashboardStore.getState().refresh();
  },
  deleteFeeding:async(id)=>{
    const repo=new FeedingRepository();
    await repo.delete(id);
    const updated=
    await repo.getAll();
    set({
    feedings:updated,
    });
  },
}));
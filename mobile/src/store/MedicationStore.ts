import { create } from "zustand";
import { Medication } from "../models/Medication";
import MedicationRepository from "../database/MedicationRepository";
interface MedicationState {
  medications: Medication[];
  loading: boolean;
  loadMedications: () => Promise<void>;
  addMedication: (
    medication: Omit<
      Medication,
      "id"
    >
  ) => Promise<void>;
  markCompleted: (
    id: number
  ) => Promise<void>;
  markPending: (
    id: number
  ) => Promise<void>;
  deleteMedication: (
    id: number
  ) => Promise<void>;
}
const repository =
  new MedicationRepository();
export const useMedicationStore =
  create<MedicationState>(
    (set, get) => ({
      medications: [],
      loading: false,
      loadMedications:
        async () => {
          try {
            set({
              loading: true,
            });
            const medications =
              await repository.getAll();
            set({
              medications,
            });
          } catch (error) {
            console.error(
              "Unable to load medications:",
              error
            );
          } finally {
            set({
              loading: false,
            });
          }
        },
      addMedication:
        async (medication) => {
          await repository.insert(
            medication
          );
          await get().loadMedications();
        },
      markCompleted:
        async (id) => {
          await repository.markCompleted(
            id
          );
          await get().loadMedications();
        },
      markPending:
        async (id) => {
          await repository.markPending(
            id
          );
          await get().loadMedications();
        },
      deleteMedication:
        async (id) => {
          await repository.delete(id);
          await get().loadMedications();
        },
    })
  );
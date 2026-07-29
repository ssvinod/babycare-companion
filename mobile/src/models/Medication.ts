export interface Medication {
  id?: number;
  medicine: string;
  dosage?: string;
  unit?: string;
  frequency?: string;
  reminderTime?: string;
  notes?: string;
  completed: number;
  completedAt?: string | null;
  createdAt: string;
}
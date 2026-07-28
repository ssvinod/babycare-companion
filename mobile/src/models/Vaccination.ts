export interface Vaccination {
  id?: number;
  vaccine: string;
  dueDate: string;
  completed: number;
  completedDate?: string | null;
}
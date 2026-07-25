export interface BabyProfile {
  id: string;
  name: string;
  dob: string;
  gender: "Male" | "Female";
  weightKg: number;
  heightCm: number;
}
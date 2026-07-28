import { initializeDatabase } from "./database";
import { runMigrations } from "./migrations";
import BabyRepository from "./BabyRepository";
import VaccinationRepository from "./VaccinationRepository";
import { generateVaccinationSchedule } from "../utils/generateVaccinationSchedule";
export async function initDatabase(): Promise<void> {
  initializeDatabase();
  runMigrations();
  const babyRepo =
    new BabyRepository();
  const baby =
    await babyRepo.getBaby();
  if (!baby) {
    console.log("No Baby Profile Found");
    return;
  }
  const vaccinationRepo =
    new VaccinationRepository();
  const count =
    await vaccinationRepo.count();
  console.log(
    "Vaccination Count:",
    count
  );
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
}
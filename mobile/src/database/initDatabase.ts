import { initializeDatabase, logDatabaseState } from './database';
import { runMigrations } from './migrations';
import BabyRepository from './BabyRepository';
import VaccinationRepository from './VaccinationRepository';
import { generateVaccinationSchedule } from '../utils/generateVaccinationSchedule';
export async function initDatabase(): Promise<void> {
    initializeDatabase();
    runMigrations();
    logDatabaseState();
    const babyRepository = new BabyRepository();
    const baby = await babyRepository.getBaby();
    if (!baby) {
        return;
    }
    const vaccinationRepository = new VaccinationRepository();
    const vaccinationCount = await vaccinationRepository.count();
    if (vaccinationCount === 0) {
        const schedule = generateVaccinationSchedule(baby.birthDate);
        await vaccinationRepository.insertMany(schedule);
    }
}

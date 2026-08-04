import { initializeDatabase, logDatabaseState } from './database';
import { runMigrations } from './migrations';
import BabyRepository from './BabyRepository';
import VaccinationRepository from './VaccinationRepository';
import { generateVaccinationSchedule } from '../utils/generateVaccinationSchedule';
export async function initDatabase(): Promise<void> {
    console.log('Initializing database...');
    initializeDatabase();
    runMigrations();
    logDatabaseState();
    const babyRepository = new BabyRepository();
    const baby = await babyRepository.getBaby();
    if (!baby) {
        console.log('No Baby Profile Found');
        console.log('Database initialization completed');
        return;
    }
    const vaccinationRepository = new VaccinationRepository();
    const vaccinationCount = await vaccinationRepository.count();
    console.log('Vaccination Count:', vaccinationCount);
    if (vaccinationCount === 0) {
        const schedule = generateVaccinationSchedule(baby.birthDate);
        console.log('Generating Vaccines:', schedule.length);
        await vaccinationRepository.insertMany(schedule);
        console.log('Vaccination Schedule Created');
    }
    console.log('Database initialization completed');
}

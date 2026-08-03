import { db } from "./database";
export default class DatabaseRepository {
  async clearFeeding(): Promise<void> {
    db.execSync(`
      DELETE FROM feeding;
      DELETE FROM sqlite_sequence
      WHERE name='feeding';
    `);
  }
  async clearSleep(): Promise<void> {
    db.execSync(`
      DELETE FROM sleep;
      DELETE FROM sqlite_sequence
      WHERE name='sleep';
    `);
  }
  async clearGrowth(): Promise<void> {
    db.execSync(`
      DELETE FROM growth;
      DELETE FROM sqlite_sequence
      WHERE name='growth';
    `);
  }
  async clearMedication(): Promise<void> {
    db.execSync(`
      DELETE FROM medication_dose;
      DELETE FROM medication;
      DELETE FROM sqlite_sequence
      WHERE name='medication';
      DELETE FROM sqlite_sequence
      WHERE name='medication_dose';
    `);
  }
  async clearVaccinations(): Promise<void> {
    db.execSync(`
      DELETE FROM vaccination;
      DELETE FROM sqlite_sequence
      WHERE name='vaccination';
    `);
  }
  async clearProfile(): Promise<void> {
    db.execSync(`
      DELETE FROM profile;
    `);
  }
  async resetEverything(): Promise<void> {
    db.withTransactionSync(() => {
      db.execSync(`
        DELETE FROM medication_dose;
        DELETE FROM medication;
        DELETE FROM feeding;
        DELETE FROM sleep;
        DELETE FROM growth;
        DELETE FROM vaccination;
        DELETE FROM profile;
        DELETE FROM sqlite_sequence
        WHERE name IN (
          'feeding',
          'sleep',
          'growth',
          'medication',
          'medication_dose',
          'vaccination'
        );
      `);
    });
    console.log("Database reset completed.");
  }
}
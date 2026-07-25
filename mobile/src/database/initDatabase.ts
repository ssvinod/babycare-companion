import { initializeDatabase } from "./database";
import { runMigrations } from "./migrations";

export async function initDatabase(): Promise<void> {
  initializeDatabase();
  runMigrations();
}
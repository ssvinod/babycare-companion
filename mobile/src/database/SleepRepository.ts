import { db } from './database';
import { Sleep } from '../models/Sleep';

export default class SleepRepository {
    async getAll(): Promise<Sleep[]> {
        return db.getAllSync<Sleep>(`
      SELECT *
      FROM sleep
      ORDER BY startTime DESC
    `);
    }

    async startSleep(startTime: string): Promise<void> {
        console.log('Repository startSleep()');

        db.runSync(
            `
      INSERT INTO sleep (
        startTime,
        endTime,
        durationMinutes
      )
      VALUES (?, NULL, NULL)
      `,
            [startTime]
        );

        console.log('Sleep started successfully');
    }

    async finishSleep(id: number, endTime: string): Promise<void> {
        const sleep = db.getFirstSync<{
            startTime: string;
        }>(
            `
      SELECT startTime
      FROM sleep
      WHERE id = ?
      `,
            [id]
        );

        if (!sleep) return;

        const start = new Date(sleep.startTime).getTime();
        const end = new Date(endTime).getTime();

        const durationMinutes = Math.round((end - start) / 60000);

        db.runSync(
            `
      UPDATE sleep
      SET
        endTime = ?,
        durationMinutes = ?
      WHERE id = ?
      `,
            [endTime, durationMinutes, id]
        );
    }

    async getActiveSleep(): Promise<Sleep | null> {
        return (
            db.getFirstSync<Sleep>(
                `
        SELECT *
        FROM sleep
        WHERE endTime IS NULL
        ORDER BY startTime DESC
        LIMIT 1
        `
            ) ?? null
        );
    }

    async delete(id: number): Promise<void> {
        db.runSync(
            `
      DELETE FROM sleep
      WHERE id = ?
      `,
            [id]
        );
    }
}

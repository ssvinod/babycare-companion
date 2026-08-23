import { db } from './database';
import { DocumentRecord } from '../models/DocumentRecord';

export default class DocumentRepository {
    async getAll(): Promise<DocumentRecord[]> {
        return db.getAllSync<DocumentRecord>(`
            SELECT *
            FROM document
            ORDER BY createdAt DESC;
        `);
    }

    async insert(document: DocumentRecord): Promise<void> {
        db.runSync(
            `
            INSERT INTO document (
                name,
                uri,
                mimeType,
                category,
                createdAt
            )
            VALUES (?, ?, ?, ?, ?);
            `,
            [
                document.name,
                document.uri,
                document.mimeType ?? null,
                document.category,
                document.createdAt,
            ]
        );
    }

    async delete(id: number): Promise<void> {
        db.runSync(
            `
            DELETE FROM document
            WHERE id = ?;
            `,
            [id]
        );
    }
}

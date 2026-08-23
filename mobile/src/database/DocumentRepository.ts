import { db } from './database';
import { DocumentRecord } from '../models/DocumentRecord';
export default class DocumentRepository {
    async getAll(): Promise<DocumentRecord[]> {
        return db.getAllSync<DocumentRecord>(`
            SELECT *
            FROM document
            ORDER BY
                pinned DESC,
                favorite DESC,
                COALESCE(
                    documentDate,
                    createdAt
                ) DESC,
                createdAt DESC;
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
                tags,
                notes,
                documentDate,
                pinned,
                favorite,
                createdAt
            )
            VALUES (
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            );
            `,
            [
                document.name,
                document.uri,
                document.mimeType ?? null,
                document.category,
                document.tags ?? null,
                document.notes ?? null,
                document.documentDate ?? null,
                document.pinned,
                document.favorite,
                document.createdAt,
            ]
        );
    }
    async update(document: DocumentRecord): Promise<void> {
        if (document.id === undefined) {
            return;
        }
        db.runSync(
            `
            UPDATE document
            SET
                name = ?,
                category = ?,
                tags = ?,
                notes = ?,
                documentDate = ?,
                pinned = ?,
                favorite = ?
            WHERE id = ?;
            `,
            [
                document.name,
                document.category,
                document.tags ?? null,
                document.notes ?? null,
                document.documentDate ?? null,
                document.pinned,
                document.favorite,
                document.id,
            ]
        );
    }
    async togglePinned(id: number, pinned: boolean): Promise<void> {
        db.runSync(
            `
            UPDATE document
            SET pinned = ?
            WHERE id = ?;
            `,
            [pinned ? 1 : 0, id]
        );
    }
    async toggleFavorite(id: number, favorite: boolean): Promise<void> {
        db.runSync(
            `
            UPDATE document
            SET favorite = ?
            WHERE id = ?;
            `,
            [favorite ? 1 : 0, id]
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

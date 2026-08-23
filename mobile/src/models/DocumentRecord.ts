export interface DocumentRecord {
    id?: number;
    name: string;
    uri: string;
    mimeType?: string | null;
    category: string;
    tags?: string | null;
    notes?: string | null;
    documentDate?: string | null;
    pinned: number;
    favorite: number;
    createdAt: string;
}

export interface DocumentRecord {
    id?: number;
    name: string;
    uri: string;
    mimeType?: string | null;
    category: string;
    createdAt: string;
}

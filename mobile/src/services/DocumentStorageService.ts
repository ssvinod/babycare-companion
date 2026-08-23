import * as FileSystem from 'expo-file-system/legacy';

const DOCUMENT_DIR = `${FileSystem.documentDirectory}niva-documents/`;

async function ensureDirectory(): Promise<void> {
    const info = await FileSystem.getInfoAsync(DOCUMENT_DIR);

    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(DOCUMENT_DIR, {
            intermediates: true,
        });
    }
}

function extensionFromName(name: string): string {
    const match = /\.([a-zA-Z0-9]+)$/.exec(name);

    return match ? `.${match[1]}` : '';
}

function safeFileName(originalName: string): string {
    const extension = extensionFromName(originalName);

    const base =
        originalName
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 60) || 'document';

    return `${Date.now()}-${base}` + extension;
}

export async function saveDocumentFile(
    sourceUri: string,
    originalName: string
): Promise<string> {
    await ensureDirectory();

    const destination = DOCUMENT_DIR + safeFileName(originalName);

    await FileSystem.copyAsync({
        from: sourceUri,
        to: destination,
    });

    return destination;
}

export async function deleteDocumentFile(uri: string): Promise<void> {
    try {
        const info = await FileSystem.getInfoAsync(uri);

        if (info.exists) {
            await FileSystem.deleteAsync(uri, {
                idempotent: true,
            });
        }
    } catch (error) {
        console.warn('Unable to delete document file:', error);
    }
}

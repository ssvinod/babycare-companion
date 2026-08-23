import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
import DocumentRepository from '../../database/DocumentRepository';
import { DocumentRecord } from '../../models/DocumentRecord';
import {
    deleteDocumentFile,
    saveDocumentFile,
} from '../../services/DocumentStorageService';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
const repository = new DocumentRepository();
function displayDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}
function typeIcon(mimeType?: string | null): string {
    if (mimeType === 'application/pdf') {
        return '📄';
    }
    if (mimeType?.startsWith('image/')) {
        return '🖼️';
    }
    return '📎';
}
export default function ScanScreen() {
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [busy, setBusy] = useState(false);
    const [previewDocument, setPreviewDocument] = useState<DocumentRecord | null>(null);
    const loadDocuments = useCallback(async () => {
        const records = await repository.getAll();
        setDocuments(records);
    }, []);
    useFocusEffect(
        useCallback(() => {
            void loadDocuments();
        }, [loadDocuments])
    );
    async function saveRecord(
        sourceUri: string,
        name: string,
        mimeType: string | null | undefined,
        category: string
    ) {
        const savedUri = await saveDocumentFile(sourceUri, name);
        await repository.insert({
            name,
            uri: savedUri,
            mimeType: mimeType ?? null,
            category,
            createdAt: new Date().toISOString(),
        });
        await loadDocuments();
    }
    async function scanWithCamera() {
        try {
            setBusy(true);
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert(
                    'Camera permission required',
                    'Allow camera access to capture a medical document.'
                );
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 0.9,
                allowsEditing: false,
            });
            if (result.canceled || !result.assets[0]) {
                return;
            }
            const asset = result.assets[0];
            const name = asset.fileName ?? `scan-${Date.now()}.jpg`;
            await saveRecord(
                asset.uri,
                name,
                asset.mimeType ?? 'image/jpeg',
                'Scanned Document'
            );
            Alert.alert(
                'Document saved',
                'The scanned document is now stored locally in Niva.'
            );
        } catch (error) {
            console.error('Unable to scan document:', error);
            Alert.alert('Unable to save document', 'Please try again.');
        } finally {
            setBusy(false);
        }
    }
    async function importDocument() {
        try {
            setBusy(true);
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
                multiple: false,
            });
            if (result.canceled || !result.assets[0]) {
                return;
            }
            const asset = result.assets[0];
            await saveRecord(asset.uri, asset.name, asset.mimeType, 'Imported Document');
            Alert.alert('Document imported', 'The file is now stored locally in Niva.');
        } catch (error) {
            console.error('Unable to import document:', error);
            Alert.alert('Import failed', 'The selected document could not be saved.');
        } finally {
            setBusy(false);
        }
    }
    async function openDocument(document: DocumentRecord) {
        try {
            if (
                document.mimeType?.startsWith('image/') ||
                document.mimeType === 'application/pdf'
            ) {
                setPreviewDocument(document);
                return;
            }
            await shareDocument(document);
        } catch (error) {
            console.error('Unable to open document:', error);
            Alert.alert(
                'Unable to open document',
                'This file type cannot be previewed inside Niva.'
            );
        }
    }
    async function shareDocument(document: DocumentRecord) {
        try {
            const available = await Sharing.isAvailableAsync();
            if (!available) {
                Alert.alert(
                    'Sharing unavailable',
                    'Sharing is not available on this device.'
                );
                return;
            }
            await Sharing.shareAsync(document.uri, {
                dialogTitle: document.name,
                mimeType: document.mimeType ?? undefined,
            });
        } catch (error) {
            console.error('Unable to share document:', error);
            Alert.alert('Unable to open document', 'Please try again.');
        }
    }
    function confirmDelete(document: DocumentRecord) {
        if (document.id === undefined) {
            return;
        }
        Alert.alert('Delete document?', `Remove "${document.name}" from Niva?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteDocumentFile(document.uri);
                    await repository.delete(document.id!);
                    await loadDocuments();
                },
            },
        ]);
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Documents" icon="📷" />
            <View style={styles.heroCard}>
                <Text style={styles.heroIcon}>📄</Text>
                <View style={styles.heroText}>
                    <Text style={styles.heroTitle}>Medical Documents</Text>
                    <Text style={styles.heroDescription}>
                        Keep prescriptions, vaccination cards and medical reports together
                        with the baby's records.
                    </Text>
                </View>
            </View>
            <View style={styles.actionRow}>
                <Pressable
                    disabled={busy}
                    onPress={() => {
                        void scanWithCamera();
                    }}
                    style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.pressed,
                        busy && styles.disabled,
                    ]}
                >
                    <Text style={styles.actionIcon}>📷</Text>
                    <Text style={styles.actionTitle}>Scan</Text>
                    <Text style={styles.actionSubtitle}>Camera</Text>
                </Pressable>
                <Pressable
                    disabled={busy}
                    onPress={() => {
                        void importDocument();
                    }}
                    style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.pressed,
                        busy && styles.disabled,
                    ]}
                >
                    <Text style={styles.actionIcon}>📁</Text>
                    <Text style={styles.actionTitle}>Import</Text>
                    <Text style={styles.actionSubtitle}>PDF / Image</Text>
                </Pressable>
            </View>
            {busy ? (
                <View style={styles.busyCard}>
                    <ActivityIndicator color="#059669" />
                    <Text style={styles.busyText}>Saving document...</Text>
                </View>
            ) : null}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Documents</Text>
                <Text style={styles.sectionCount}>{documents.length}</Text>
            </View>
            {documents.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>📂</Text>
                    <Text style={styles.emptyTitle}>No documents yet</Text>
                    <Text style={styles.emptyText}>
                        Scan a prescription or import a PDF/image to keep it with the
                        baby's records.
                    </Text>
                </View>
            ) : (
                documents.map((document) => (
                    <Pressable
                        key={document.id ?? document.uri}
                        onPress={() => {
                            void openDocument(document);
                        }}
                        onLongPress={() => confirmDelete(document)}
                        style={({ pressed }) => [
                            styles.documentCard,
                            pressed && styles.pressed,
                        ]}
                    >
                        <View style={styles.documentIcon}>
                            <Text style={styles.documentIconText}>
                                {typeIcon(document.mimeType)}
                            </Text>
                        </View>
                        <View style={styles.documentContent}>
                            <Text numberOfLines={1} style={styles.documentName}>
                                {document.name}
                            </Text>
                            <Text style={styles.documentMeta}>
                                {document.category}
                                {' • '}
                                {displayDate(document.createdAt)}
                            </Text>
                            <Text style={styles.documentHint}>
                                Tap to view • Hold to delete
                            </Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>
                ))
            )}
            <Modal
                visible={previewDocument !== null}
                animationType="fade"
                presentationStyle="fullScreen"
                onRequestClose={() => setPreviewDocument(null)}
            >
                <View style={styles.previewScreen}>
                    {previewDocument ? (
                        <Image
                            source={{
                                uri: previewDocument.uri,
                            }}
                            resizeMode="contain"
                            style={styles.previewImage}
                        />
                    ) : null}
                    <View style={styles.previewTopTitle}>
                        <Text numberOfLines={1} style={styles.previewTitle}>
                            {previewDocument?.name ?? 'Document'}
                        </Text>
                    </View>
                    <View style={styles.previewControls}>
                        <Pressable
                            onPress={() => setPreviewDocument(null)}
                            style={({ pressed }) => [
                                styles.previewControlButton,
                                pressed && styles.previewControlPressed,
                            ]}
                        >
                            <Text style={styles.previewControlIcon}>✕</Text>
                            <Text style={styles.previewControlText}>Close</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                if (previewDocument) {
                                    void shareDocument(previewDocument);
                                }
                            }}
                            style={({ pressed }) => [
                                styles.previewControlButton,
                                pressed && styles.previewControlPressed,
                            ]}
                        >
                            <Text style={styles.previewControlIcon}>↗</Text>
                            <Text style={styles.previewControlText}>Share</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    heroCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        borderRadius: 22,
        backgroundColor: '#ECFDF5',
        padding: 18,
    },
    heroIcon: {
        marginRight: 14,
        fontSize: 34,
    },
    heroText: {
        flex: 1,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#065F46',
    },
    heroDescription: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        color: '#047857',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 18,
    },
    actionButton: {
        flex: 1,
        minHeight: 118,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        padding: 14,
    },
    actionIcon: {
        fontSize: 30,
    },
    actionTitle: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: '900',
        color: '#111827',
    },
    actionSubtitle: {
        marginTop: 2,
        fontSize: 11,
        color: '#9CA3AF',
    },
    pressed: {
        opacity: 0.76,
    },
    disabled: {
        opacity: 0.5,
    },
    busyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 16,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        padding: 14,
    },
    busyText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    sectionCount: {
        minWidth: 28,
        textAlign: 'center',
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        fontWeight: '800',
        color: '#4B5563',
    },
    emptyCard: {
        minHeight: 190,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        padding: 28,
    },
    emptyIcon: {
        fontSize: 38,
    },
    emptyTitle: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: '900',
        color: '#111827',
    },
    emptyText: {
        marginTop: 7,
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 19,
        color: '#6B7280',
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        padding: 14,
    },
    documentIcon: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 15,
        backgroundColor: '#EEF2FF',
    },
    documentIconText: {
        fontSize: 23,
    },
    documentContent: {
        flex: 1,
        minWidth: 0,
    },
    documentName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111827',
    },
    documentMeta: {
        marginTop: 3,
        fontSize: 11,
        color: '#6B7280',
    },
    documentHint: {
        marginTop: 4,
        fontSize: 10,
        color: '#9CA3AF',
    },
    chevron: {
        marginLeft: 8,
        fontSize: 28,
        color: '#9CA3AF',
    },
    previewScreen: {
        flex: 1,
        backgroundColor: '#111827',
    },
    previewImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    previewTopTitle: {
        position: 'absolute',
        top: 58,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    previewTitle: {
        maxWidth: '85%',
        borderRadius: 12,
        backgroundColor: 'rgba(17, 24, 39, 0.72)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    previewControls: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 34,
        flexDirection: 'row',
        gap: 12,
    },
    previewControlButton: {
        flex: 1,
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        borderRadius: 18,
        backgroundColor: 'rgba(17, 24, 39, 0.88)',
    },
    previewControlPressed: {
        opacity: 0.72,
    },
    previewControlIcon: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    previewControlText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
    },
});

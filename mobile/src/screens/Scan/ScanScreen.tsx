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
    TextInput,
    ScrollView,
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
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const loadDocuments = useCallback(async () => {
        const records = await repository.getAll();
        setDocuments(records);
    }, []);
    const categories = [
        'All',
        'Prescription',
        'Lab Report',
        'Vaccination Record',
        'Insurance',
        'Medical Report',
        'Other',
    ];
    const categoryLabels: Record<string, string> = {
        All: 'All',
        Prescription: 'Prescription',
        'Lab Report': 'Lab',
        'Vaccination Record': 'Vaccines',
        Insurance: 'Insurance',
        'Medical Report': 'Reports',
        Other: 'Other',
    };
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
        const now = new Date().toISOString();
        await repository.insert({
            name,
            uri: savedUri,
            mimeType: mimeType ?? null,
            category,
            tags: null,
            notes: null,
            documentDate: now,
            pinned: 0,
            favorite: 0,
            createdAt: now,
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
            if (document.mimeType?.startsWith('image/')) {
                setPreviewDocument(document);
                return;
            }
            if (document.mimeType === 'application/pdf') {
                if (Platform.OS === 'ios') {
                    /*
                     * iOS WKWebView can render
                     * local multi-page PDFs.
                     */
                    setPreviewDocument(document);
                    return;
                }
                /*
                 * Android WebView does not have
                 * a reliable built-in PDF viewer,
                 * so open with the system viewer.
                 */
                const contentUri = await FileSystem.getContentUriAsync(document.uri);
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: contentUri,
                    flags: 1,
                    type: 'application/pdf',
                });
                return;
            }
            await shareDocument(document);
        } catch (error) {
            console.error('Unable to open document:', error);
            Alert.alert('Unable to open document', 'This document could not be opened.');
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
    const visibleDocuments = documents.filter((document) => {
        const query = searchText.trim().toLowerCase();
        const matchesCategory =
            selectedCategory === 'All' || document.category === selectedCategory;
        const searchableText = [
            document.name,
            document.category,
            document.tags,
            document.notes,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        const matchesSearch = query.length === 0 || searchableText.includes(query);
        return matchesCategory && matchesSearch;
    });
    return (
        <ScreenLayout>
            <View style={styles.documentsHeader}>
                <MaterialCommunityIcons
                    name="file-document-outline"
                    size={24}
                    color="#059669"
                />
                <Text style={styles.documentsHeaderTitle}>Documents</Text>
            </View>
            <View style={styles.heroCard}>
                <MaterialCommunityIcons
                    name="file-document-outline"
                    size={24}
                    color="#059669"
                    style={styles.heroIcon}
                />
                <View style={styles.heroText}>
                    <Text style={styles.heroTitle}>Medical Documents</Text>
                    <Text numberOfLines={1} style={styles.heroDescription}>
                        Prescriptions, reports and vaccination records
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
                        styles.scanButton,
                        pressed && styles.pressed,
                        busy && styles.disabled,
                    ]}
                >
                    <MaterialCommunityIcons
                        name="camera-outline"
                        size={24}
                        color="#FFFFFF"
                        style={styles.actionIcon}
                    />
                    <Text style={styles.actionTitle}>Scan</Text>
                </Pressable>
                <Pressable
                    disabled={busy}
                    onPress={() => {
                        void importDocument();
                    }}
                    style={({ pressed }) => [
                        styles.actionButton,
                        styles.importButton,
                        pressed && styles.pressed,
                        busy && styles.disabled,
                    ]}
                >
                    <MaterialCommunityIcons
                        name="file-import-outline"
                        size={24}
                        color="#FFFFFF"
                        style={styles.actionIcon}
                    />
                    <Text style={styles.actionTitle}>Import</Text>
                </Pressable>
            </View>
            {busy ? (
                <View style={styles.busyCard}>
                    <ActivityIndicator color="#059669" />
                    <Text style={styles.busyText}>Saving document...</Text>
                </View>
            ) : null}
            <View style={styles.searchCard}>
                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search documents, tags or notes"
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    returnKeyType="search"
                />
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
            >
                {categories.map((category) => {
                    const active = selectedCategory === category;
                    return (
                        <Pressable
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={[
                                styles.categoryChip,
                                active && styles.categoryChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryChipText,
                                    active && styles.categoryChipTextActive,
                                ]}
                            >
                                {categoryLabels[category] ?? category}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Documents</Text>
                <Text style={styles.sectionCount}>{visibleDocuments.length}</Text>
            </View>
            {visibleDocuments.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>📂</Text>
                    <Text style={styles.emptyTitle}>No documents yet</Text>
                    <Text style={styles.emptyText}>
                        Scan a prescription or import a PDF/image to keep it with the
                        baby's records.
                    </Text>
                </View>
            ) : (
                visibleDocuments.map((document) => (
                    <Pressable
                        key={document.id ?? document.uri}
                        onPress={() => {
                            void openDocument(document);
                        }}
                        onLongPress={() => setEditingDocument(document)}
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
                            {document.tags ? (
                                <Text numberOfLines={1} style={styles.documentTags}>
                                    🏷️ {document.tags}
                                </Text>
                            ) : null}
                            {document.notes ? (
                                <Text numberOfLines={1} style={styles.documentNotes}>
                                    {document.notes}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.documentActions}>
                            <Pressable
                                hitSlop={10}
                                onPress={async (event) => {
                                    event.stopPropagation();
                                    if (document.id === undefined) {
                                        return;
                                    }
                                    await repository.togglePinned(
                                        document.id,
                                        document.pinned !== 1
                                    );
                                    await loadDocuments();
                                }}
                            >
                                <Text style={styles.documentActionIcon}>
                                    {document.pinned === 1 ? '📌' : '📍'}
                                </Text>
                            </Pressable>
                            <Pressable
                                hitSlop={10}
                                onPress={async (event) => {
                                    event.stopPropagation();
                                    if (document.id === undefined) {
                                        return;
                                    }
                                    await repository.toggleFavorite(
                                        document.id,
                                        document.favorite !== 1
                                    );
                                    await loadDocuments();
                                }}
                            >
                                <Text style={styles.documentActionIcon}>
                                    {document.favorite === 1 ? '❤️' : '♡'}
                                </Text>
                            </Pressable>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>
                ))
            )}
            <Modal
                visible={editingDocument !== null}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setEditingDocument(null)}
            >
                <View style={styles.editScreen}>
                    <View style={styles.editHeader}>
                        <Pressable onPress={() => setEditingDocument(null)}>
                            <Text style={styles.editCancel}>Cancel</Text>
                        </Pressable>
                        <Text style={styles.editTitle}>Document Details</Text>
                        <Pressable
                            onPress={async () => {
                                if (!editingDocument) {
                                    return;
                                }
                                await repository.update(editingDocument);
                                await loadDocuments();
                                setEditingDocument(null);
                            }}
                        >
                            <Text style={styles.editSave}>Save</Text>
                        </Pressable>
                    </View>
                    {editingDocument ? (
                        <ScrollView contentContainerStyle={styles.editContent}>
                            <Text style={styles.fieldLabel}>Name</Text>
                            <TextInput
                                value={editingDocument.name}
                                onChangeText={(name) =>
                                    setEditingDocument({
                                        ...editingDocument,
                                        name,
                                    })
                                }
                                style={styles.fieldInput}
                            />
                            <Text style={styles.fieldLabel}>Category</Text>
                            <View style={styles.categoryWrap}>
                                {[
                                    'Prescription',
                                    'Lab Report',
                                    'Vaccination Record',
                                    'Insurance',
                                    'Medical Report',
                                    'Other',
                                ].map((category) => {
                                    const active = editingDocument.category === category;
                                    return (
                                        <Pressable
                                            key={category}
                                            onPress={() =>
                                                setEditingDocument({
                                                    ...editingDocument,
                                                    category,
                                                })
                                            }
                                            style={[
                                                styles.editCategoryChip,
                                                active && styles.editCategoryChipActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.editCategoryText,
                                                    active &&
                                                        styles.editCategoryTextActive,
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                            <Text style={styles.fieldLabel}>Tags</Text>
                            <TextInput
                                value={editingDocument.tags ?? ''}
                                onChangeText={(tags) =>
                                    setEditingDocument({
                                        ...editingDocument,
                                        tags,
                                    })
                                }
                                placeholder="e.g. fever, 2 month visit"
                                style={styles.fieldInput}
                            />
                            <Text style={styles.fieldLabel}>Notes</Text>
                            <TextInput
                                value={editingDocument.notes ?? ''}
                                onChangeText={(notes) =>
                                    setEditingDocument({
                                        ...editingDocument,
                                        notes,
                                    })
                                }
                                placeholder="Optional notes"
                                multiline
                                style={[styles.fieldInput, styles.notesInput]}
                            />
                            <Pressable
                                onPress={() => {
                                    const current = editingDocument;
                                    setEditingDocument(null);
                                    setTimeout(() => {
                                        confirmDelete(current);
                                    }, 250);
                                }}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>
                                    Delete Document
                                </Text>
                            </Pressable>
                        </ScrollView>
                    ) : null}
                </View>
            </Modal>
            <Modal
                visible={previewDocument !== null}
                animationType="fade"
                presentationStyle="fullScreen"
                onRequestClose={() => setPreviewDocument(null)}
            >
                <View style={styles.previewScreen}>
                    {previewDocument ? (
                        previewDocument.mimeType === 'application/pdf' &&
                        Platform.OS === 'ios' ? (
                            <WebView
                                source={{
                                    uri: previewDocument.uri,
                                }}
                                originWhitelist={['*']}
                                allowingReadAccessToURL={previewDocument.uri}
                                allowFileAccess
                                javaScriptEnabled
                                startInLoadingState
                                renderLoading={() => (
                                    <View style={styles.pdfLoading}>
                                        <ActivityIndicator size="large" color="#FFFFFF" />
                                        <Text style={styles.pdfLoadingText}>
                                            Opening PDF...
                                        </Text>
                                    </View>
                                )}
                                style={styles.previewPdf}
                            />
                        ) : (
                            <Image
                                source={{
                                    uri: previewDocument.uri,
                                }}
                                resizeMode="contain"
                                style={styles.previewImage}
                            />
                        )
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
        minHeight: 64,
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    heroIcon: {
        marginRight: 10,
    },
    heroTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '900',
        color: '#065F46',
    },
    heroDescription: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 16,
        color: '#047857',
    },
    heroText: {
        flex: 1,
        justifyContent: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    actionButton: {
        flex: 1,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingHorizontal: 12,
    },
    scanButton: {
        height: 50,
        backgroundColor: '#059669',
    },
    importButton: {
        height: 50,
        backgroundColor: '#2563EB',
    },
    actionIcon: {
        marginRight: 8,
    },
    actionTitle: {
        fontSize: 15,
        lineHeight: 19,
        fontWeight: '900',
        color: '#FFFFFF',
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
    previewPdf: {
        flex: 1,
        width: '100%',
        backgroundColor: '#E5E7EB',
    },
    pdfLoading: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
    },
    pdfLoadingText: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    searchCard: {
        marginBottom: 8,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
    },
    searchInput: {
        minHeight: 48,
        fontSize: 14,
        color: '#111827',
    },
    categoryRow: {
        gap: 7,
        paddingBottom: 10,
    },
    categoryChip: {
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    categoryChipActive: {
        backgroundColor: '#059669',
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    documentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 8,
    },
    documentActionIcon: {
        fontSize: 17,
    },
    documentTags: {
        marginTop: 4,
        fontSize: 10,
        color: '#7C3AED',
    },
    documentNotes: {
        marginTop: 3,
        fontSize: 10,
        color: '#6B7280',
    },
    editScreen: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    editHeader: {
        minHeight: 78,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingBottom: 14,
        backgroundColor: '#FFFFFF',
    },
    editCancel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    editTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111827',
    },
    editSave: {
        fontSize: 14,
        fontWeight: '900',
        color: '#059669',
    },
    editContent: {
        padding: 20,
        paddingBottom: 50,
    },
    fieldLabel: {
        marginTop: 16,
        marginBottom: 7,
        fontSize: 12,
        fontWeight: '800',
        color: '#374151',
    },
    fieldInput: {
        minHeight: 48,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        fontSize: 14,
        color: '#111827',
    },
    notesInput: {
        minHeight: 110,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    editCategoryChip: {
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingVertical: 9,
    },
    editCategoryChipActive: {
        backgroundColor: '#059669',
    },
    editCategoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    editCategoryTextActive: {
        color: '#FFFFFF',
    },
    deleteButton: {
        marginTop: 30,
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#FEE2E2',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#B91C1C',
    },
    documentsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    documentsHeaderTitle: {
        marginLeft: 10,
        fontSize: 28,
        fontWeight: '900',
        color: '#111827',
    },
});

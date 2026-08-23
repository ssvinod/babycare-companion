import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Vaccination } from '../../models/Vaccination';
interface Props {
    vaccine: Vaccination;
    title: string;
    vaccineNames: string[];
    description: string[];
    note?: string;
    status: 'completed' | 'upcoming' | 'today' | 'overdue';
    onComplete: () => void;
    onPending: () => void;
}
function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export default function VaccinationCard({
    vaccine,
    title,
    vaccineNames,
    description,
    note,
    status,
    onComplete,
    onPending,
}: Props) {
    const [expanded, setExpanded] = useState(false);
    const statusInfo = {
        completed: {
            label: 'Completed',
            color: '#15803D',
            background: '#DCFCE7',
        },
        upcoming: {
            label: 'Upcoming',
            color: '#1D4ED8',
            background: '#DBEAFE',
        },
        today: {
            label: 'Due Today',
            color: '#A16207',
            background: '#FEF3C7',
        },
        overdue: {
            label: 'Overdue',
            color: '#B91C1C',
            background: '#FEE2E2',
        },
    }[status];
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleArea}>
                    <Text style={styles.icon}>💉</Text>
                    <View style={styles.titleContent}>
                        <Text style={styles.title}>{title}</Text>
                        <Text
                            numberOfLines={expanded ? undefined : 2}
                            style={styles.vaccineNames}
                        >
                            {vaccineNames.join(' • ')}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: statusInfo.background,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            {
                                color: statusInfo.color,
                            },
                        ]}
                    >
                        {statusInfo.label}
                    </Text>
                </View>
            </View>
            <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Due</Text>
                    <Text style={styles.dateValue}>{formatDate(vaccine.dueDate)}</Text>
                </View>
                <View style={styles.dateDivider} />
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Completed</Text>
                    <Text style={styles.dateValue}>
                        {vaccine.completed === 1
                            ? formatDate(vaccine.completedDate)
                            : '—'}
                    </Text>
                </View>
            </View>
            <Pressable
                onPress={() => setExpanded((current) => !current)}
                style={styles.detailsToggle}
            >
                <Text style={styles.detailsToggleText}>
                    {expanded ? 'Hide details ▲' : 'Protection details ▼'}
                </Text>
            </Pressable>
            {expanded ? (
                <View style={styles.details}>
                    <Text style={styles.protectsTitle}>Protects against</Text>
                    <View style={styles.diseaseGrid}>
                        {description.map((disease) => (
                            <View key={disease} style={styles.diseaseItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.diseaseText}>{disease}</Text>
                            </View>
                        ))}
                    </View>
                    {note ? <Text style={styles.note}>{note}</Text> : null}
                </View>
            ) : null}
            <Pressable
                onPress={status === 'completed' ? onPending : onComplete}
                style={({ pressed }) => [
                    styles.actionButton,
                    status === 'completed' ? styles.pendingButton : styles.completeButton,
                    pressed && styles.pressed,
                ]}
            >
                <Text
                    style={[
                        styles.actionText,
                        status === 'completed' ? styles.pendingText : styles.completeText,
                    ]}
                >
                    {status === 'completed' ? '↩ Mark Pending' : '✓ Mark Completed'}
                </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 9,
        borderRadius: 17,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 13,
        paddingTop: 12,
        paddingBottom: 11,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    titleArea: {
        flex: 1,
        flexDirection: 'row',
        minWidth: 0,
    },
    icon: {
        marginTop: 1,
        marginRight: 7,
        fontSize: 16,
    },
    titleContent: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111827',
    },
    vaccineNames: {
        marginTop: 3,
        fontSize: 11,
        lineHeight: 15,
        fontWeight: '700',
        color: '#4F46E5',
    },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '900',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        paddingVertical: 7,
    },
    dateItem: {
        flex: 1,
        paddingHorizontal: 9,
    },
    dateDivider: {
        width: 1,
        height: 28,
        backgroundColor: '#E5E7EB',
    },
    dateLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    dateValue: {
        marginTop: 1,
        fontSize: 12,
        fontWeight: '900',
        color: '#111827',
    },
    detailsToggle: {
        alignSelf: 'flex-start',
        marginTop: 7,
        paddingVertical: 3,
    },
    detailsToggleText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#6B7280',
    },
    details: {
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 7,
    },
    protectsTitle: {
        marginBottom: 4,
        fontSize: 11,
        fontWeight: '900',
        color: '#374151',
    },
    diseaseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 8,
        rowGap: 3,
    },
    diseaseItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        marginRight: 3,
        fontSize: 11,
        color: '#6B7280',
    },
    diseaseText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 14,
        color: '#6B7280',
    },
    note: {
        marginTop: 6,
        fontSize: 9,
        lineHeight: 13,
        fontWeight: '600',
        color: '#92400E',
    },
    actionButton: {
        minHeight: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        borderRadius: 12,
    },
    completeButton: {
        backgroundColor: '#4F6EF7',
    },
    pendingButton: {
        backgroundColor: '#EEF2FF',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '900',
    },
    completeText: {
        color: '#FFFFFF',
    },
    pendingText: {
        color: '#4338CA',
    },
    pressed: {
        opacity: 0.72,
    },
});

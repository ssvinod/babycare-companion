import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import ScreenTitle from '../../components/common/ScreenTitle';
interface FAQItem {
    id: string;
    question: string;
    answer: string;
}
const FAQ_ITEMS: FAQItem[] = [
    {
        id: 'local-storage',
        question: "Where is my baby's information stored?",
        answer: 'Niva currently stores the baby profile and care records locally on this device. No account is required, and records are not automatically uploaded to a cloud service.',
    },
    {
        id: 'profile-photo',
        question: 'Where is the profile photo stored?',
        answer: "The baby profile photo is copied into Niva's private application storage on this device. Replacing or removing the photo deletes the previous local copy.",
    },
    {
        id: 'medication',
        question: 'How do medication reminders work?',
        answer: 'Niva schedules reminders using the times configured for each medication. Notifications require device permission and may behave differently in Expo Go. Use a development or release build for proper native testing.',
    },
    {
        id: 'timeline',
        question: 'Why does Timeline not show future vaccinations?',
        answer: 'Timeline focuses on completed or recorded care events. Upcoming vaccinations remain available in Records and the vaccination section so Timeline stays useful and manageable.',
    },
    {
        id: 'growth',
        question: 'Where should weight and height be updated?',
        answer: 'Weight and height change over time, so they should be entered through Growth History rather than repeatedly editing the baby profile.',
    },
    {
        id: 'delete',
        question: 'What happens when I remove the baby profile?',
        answer: 'The baby profile, feeding records, sleep records, growth history, medications, medication doses, vaccinations, scheduled notifications and locally stored profile photo are permanently removed.',
    },
    {
        id: 'backup',
        question: 'Can I back up or export my records?',
        answer: 'Backup, restore and pediatrician-friendly export are planned features. Until they are released, removing the app or clearing its data may permanently remove locally stored records.',
    },
];
interface FAQRowProps {
    item: FAQItem;
    expanded: boolean;
    onPress: () => void;
}
function FAQRow({ item, expanded, onPress }: FAQRowProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{
                expanded,
            }}
            onPress={onPress}
            style={({ pressed }) => [styles.faqCard, pressed && styles.faqCardPressed]}
        >
            <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>
                    ›
                </Text>
            </View>
            {expanded ? <Text style={styles.answer}>{item.answer}</Text> : null}
        </Pressable>
    );
}
export default function HelpScreen() {
    const [expandedId, setExpandedId] = useState<string | null>(FAQ_ITEMS[0].id);
    function toggleItem(id: string) {
        setExpandedId((current) => (current === id ? null : id));
    }
    async function openDeviceSettings() {
        try {
            await Linking.openSettings();
        } catch (error) {
            console.warn('Unable to open device settings:', error);
        }
    }
    return (
        <ScreenLayout>
            <ScreenTitle title="Help & FAQ" icon="❓" />
            <View style={styles.introCard}>
                <Text style={styles.introTitle}>Using Niva</Text>
                <Text style={styles.introText}>
                    Find answers about local storage, tracking, profile photos, reminders
                    and profile removal.
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {FAQ_ITEMS.map((item) => (
                <FAQRow
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    onPress={() => toggleItem(item.id)}
                />
            ))}
            <Text style={styles.sectionTitle}>Device Permissions</Text>
            <Pressable
                accessibilityRole="button"
                onPress={() => {
                    void openDeviceSettings();
                }}
                style={({ pressed }) => [
                    styles.settingsRow,
                    pressed && styles.settingsRowPressed,
                ]}
            >
                <View style={styles.settingsIcon}>
                    <Text style={styles.settingsIconText}>⚙️</Text>
                </View>
                <View style={styles.settingsText}>
                    <Text style={styles.settingsTitle}>Open Device Settings</Text>
                    <Text style={styles.settingsSubtitle}>
                        Manage camera, photos and notification permissions
                    </Text>
                </View>
                <Text style={styles.settingsChevron}>›</Text>
            </Pressable>
            <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Testing reminders</Text>
                <Text style={styles.tipText}>
                    Native notification behavior is not fully represented in Expo Go. Test
                    reminders using the installed development build or a release build.
                </Text>
            </View>
        </ScreenLayout>
    );
}
const styles = StyleSheet.create({
    introCard: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#ECFDF5',
        padding: 18,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#065F46',
    },
    introText: {
        marginTop: 7,
        fontSize: 14,
        lineHeight: 21,
        color: '#047857',
    },
    sectionTitle: {
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 3,
        fontSize: 15,
        fontWeight: '900',
        color: '#374151',
    },
    faqCard: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 14,
    },
    faqCardPressed: {
        backgroundColor: '#F9FAFB',
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    question: {
        flex: 1,
        marginRight: 12,
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 20,
        color: '#111827',
    },
    chevron: {
        fontSize: 24,
        lineHeight: 24,
        color: '#6B7280',
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    chevronExpanded: {
        transform: [
            {
                rotate: '-90deg',
            },
        ],
    },
    answer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
        fontSize: 13,
        lineHeight: 20,
        color: '#4B5563',
    },
    settingsRow: {
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    settingsRowPressed: {
        backgroundColor: '#ECFDF5',
    },
    settingsIcon: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderRadius: 13,
        backgroundColor: '#D1FAE5',
    },
    settingsIconText: {
        fontSize: 20,
    },
    settingsText: {
        flex: 1,
    },
    settingsTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#065F46',
    },
    settingsSubtitle: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 17,
        color: '#047857',
    },
    settingsChevron: {
        marginLeft: 10,
        fontSize: 25,
        color: '#059669',
    },
    tipCard: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        padding: 16,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#4338CA',
    },
    tipText: {
        marginTop: 6,
        fontSize: 13,
        lineHeight: 19,
        color: '#4F46E5',
    },
});

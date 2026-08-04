import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Baby } from '../../models/Baby';
import { calculateAge } from '../../utils/calculateAge';
interface Props {
    baby: Baby;
}
function formatBirthDate(value: string) {
    if (!value) {
        return 'Not provided';
    }
    const parts = value.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return value;
}
export default function ProfileHeader({ baby }: Props) {
    const genderLabel = baby.gender === 'boy' ? 'Boy' : 'Girl';
    return (
        <View style={styles.card}>
            <Text style={styles.avatar}>{baby.gender === 'boy' ? '👦' : '👧'}</Text>
            <Text style={styles.name}>{baby.name}</Text>
            <Text style={styles.info}>{genderLabel}</Text>
            <Text style={styles.info}>Born {formatBirthDate(baby.birthDate)}</Text>
            <Text style={styles.age}>{calculateAge(baby.birthDate)}</Text>
            {baby.bloodGroup ? (
                <View style={styles.bloodGroupBadge}>
                    <Text style={styles.bloodGroupText}>
                        Blood Group: {baby.bloodGroup}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        fontSize: 54,
        marginBottom: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
    },
    info: {
        marginTop: 6,
        color: '#6B7280',
        fontSize: 16,
    },
    age: {
        marginTop: 12,
        fontWeight: '700',
        color: '#4F46E5',
        fontSize: 18,
    },
    bloodGroupBadge: {
        marginTop: 14,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
    },
    bloodGroupText: {
        color: '#B91C1C',
        fontWeight: '700',
        fontSize: 14,
    },
});

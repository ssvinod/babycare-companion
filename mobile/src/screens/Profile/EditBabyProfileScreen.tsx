import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScreenTitle from '../../components/common/ScreenTitle';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useBabyStore } from '../../store/BabyStore';
import BabyPhotoPicker from '../../components/profile/BabyPhotoPicker';
import { deleteProfilePhoto } from '../../services/ProfilePhotoService';
type Gender = 'boy' | 'girl';
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export default function EditBabyProfileScreen() {
    const navigation = useNavigation<any>();
    const { baby, setBaby } = useBabyStore();
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<Gender>('girl');
    const [bloodGroup, setBloodGroup] = useState('');
    const [saving, setSaving] = useState(false);
    const [photo, setPhoto] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (!baby) {
            return;
        }
        setName(baby.name ?? '');
        setDob(formatDOB(baby.birthDate));
        setGender(baby.gender === 'boy' ? 'boy' : 'girl');
        setBloodGroup(baby.bloodGroup ?? '');
        setPhoto(baby.photo);
    }, [baby]);
    function formatDOB(value: string) {
        if (!value) {
            return '';
        }
        const parts = value.split('-');
        if (parts.length !== 3) {
            return value;
        }
        if (parts[0].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return value;
    }
    function toISODate(value: string) {
        const parts = value.split('-');
        if (parts.length !== 3) {
            return value;
        }
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    function maskDate(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        if (digits.length <= 2) {
            return digits;
        }
        if (digits.length <= 4) {
            return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        }
        return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
    }
    function isValidDOB(value: string) {
        const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
        if (!match) {
            return false;
        }
        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);
        const date = new Date(year, month - 1, day);
        const isRealDate =
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;
        const isNotFuture = date.getTime() <= new Date().getTime();
        return isRealDate && isNotFuture;
    }
    async function save() {
        if (!baby || saving) {
            return;
        }
        const trimmedName = name.trim();
        if (!trimmedName) {
            Alert.alert('Baby name required', "Please enter the baby's name.");
            return;
        }
        if (!isValidDOB(dob)) {
            Alert.alert(
                'Invalid date of birth',
                'Enter the date in DD-MM-YYYY format. Example: 22-06-2026.'
            );
            return;
        }
        try {
            setSaving(true);
            const previousPhoto = baby.photo;
            await setBaby({
                ...baby,
                name: trimmedName,
                birthDate: toISODate(dob),
                gender,
                bloodGroup: bloodGroup || undefined,
                photo,
            });
            if (previousPhoto && previousPhoto !== photo) {
                deleteProfilePhoto(previousPhoto);
            }
            Alert.alert('Profile updated', 'Baby profile saved successfully.', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Profile save failed:', error);
            Alert.alert(
                'Unable to save',
                'Something went wrong while saving the profile.'
            );
        } finally {
            setSaving(false);
        }
    }
    if (!baby) {
        return null;
    }
    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                >
                    <ScreenTitle title="Edit Baby Profile" icon="👶" />
                    <BabyPhotoPicker photo={photo} gender={gender} onChange={setPhoto} />
                    <Text style={styles.label}>Baby Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter baby name"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="words"
                        returnKeyType="next"
                    />
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        value={dob}
                        onChangeText={(value) => setDob(maskDate(value))}
                        placeholder="DD-MM-YYYY"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                    <Text style={styles.helper}>Format: DD-MM-YYYY</Text>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderRow}>
                        <Pressable
                            onPress={() => setGender('boy')}
                            style={[
                                styles.genderButton,
                                gender === 'boy' && styles.selectedButton,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.genderText,
                                    gender === 'boy' && styles.selectedText,
                                ]}
                            >
                                👦 Boy
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setGender('girl')}
                            style={[
                                styles.genderButton,
                                gender === 'girl' && styles.selectedButton,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.genderText,
                                    gender === 'girl' && styles.selectedText,
                                ]}
                            >
                                👧 Girl
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={styles.label}>Blood Group</Text>
                    <Text style={styles.helper}>
                        Select one of: A+, A−, B+, B−, AB+, AB−, O+, O−
                    </Text>
                    <View style={styles.bloodGroupGrid}>
                        {BLOOD_GROUPS.map((group) => {
                            const selected = bloodGroup === group;
                            return (
                                <Pressable
                                    key={group}
                                    onPress={() => setBloodGroup(selected ? '' : group)}
                                    style={[
                                        styles.bloodGroupButton,
                                        selected && styles.selectedButton,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bloodGroupText,
                                            selected && styles.selectedText,
                                        ]}
                                    >
                                        {group}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    <Text style={styles.note}>
                        Weight and height are managed in Growth History because they
                        change over time.
                    </Text>
                    <PrimaryButton
                        title={saving ? 'Saving...' : 'Save Profile'}
                        onPress={save}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#EEF2F8',
    },
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#EEF2F8',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 80,
    },
    label: {
        marginTop: 18,
        marginBottom: 7,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    input: {
        minHeight: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        fontSize: 16,
        color: '#111827',
    },
    helper: {
        marginTop: 7,
        fontSize: 13,
        color: '#6B7280',
    },
    genderRow: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        minHeight: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    bloodGroupGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 12,
        marginBottom: 10,
    },
    bloodGroupButton: {
        width: '22%',
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    bloodGroupText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    selectedButton: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    selectedText: {
        color: '#FFFFFF',
    },
    note: {
        marginTop: 16,
        marginBottom: 22,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#E0E7FF',
        color: '#4338CA',
        fontSize: 14,
        lineHeight: 20,
    },
});

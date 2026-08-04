import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import BabyRepository from '../../database/BabyRepository';
import { useBabyStore } from '../../store/BabyStore';

export default function OnboardingScreen() {
    const { setBaby } = useBabyStore();

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl'>('girl');

    async function saveProfile() {
        const repo = new BabyRepository();

        const baby = {
            id: '1',
            name,
            birthDate,
            gender,
            weight: 0,
            height: 0,
            bloodGroup: '',
            photo: '',
        };

        await repo.saveBaby(baby);

        setBaby(baby);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome 👶</Text>

            <TextInput
                placeholder="Baby Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Birth Date (YYYY-MM-DD)"
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />

            <Button title="Save" onPress={saveProfile} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#EEF2F8',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 25,
    },

    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
});

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
interface Props {
    name: string;
    age: string;
    photo?: string;
    gender: 'boy' | 'girl';
    onPress?: () => void;
}
export default function HeroCard({ name, age, photo, gender, onPress }: Props) {
    const fallbackAvatar = gender === 'boy' ? '👦' : '👧';
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${name}'s profile`}
            onPress={onPress}
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        >
            <LinearGradient colors={['#6C8CFF', '#4F6EF7']} style={styles.container}>
                <View style={styles.avatar}>
                    {photo ? (
                        <Image
                            source={{
                                uri: photo,
                            }}
                            style={styles.photo}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text style={styles.avatarText}>{fallbackAvatar}</Text>
                    )}
                </View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>{age}</Text>
                <View style={styles.profileHint}>
                    <Text style={styles.profileHintText}>View Profile</Text>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    pressable: {
        marginBottom: 24,
        borderRadius: 24,
    },
    pressed: {
        opacity: 0.88,
        transform: [
            {
                scale: 0.99,
            },
        ],
    },
    container: {
        alignItems: 'center',
        borderRadius: 24,
        paddingVertical: 24,
        paddingHorizontal: 18,
    },
    avatar: {
        width: 94,
        height: 94,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.85)',
        borderRadius: 47,
        backgroundColor: '#FFFFFF',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontSize: 46,
    },
    name: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    age: {
        marginTop: 5,
        fontSize: 16,
        color: '#E8EDFF',
    },
    profileHint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 13,
        paddingVertical: 6,
    },
    profileHintText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    chevron: {
        marginLeft: 5,
        fontSize: 18,
        lineHeight: 18,
        color: '#FFFFFF',
    },
});

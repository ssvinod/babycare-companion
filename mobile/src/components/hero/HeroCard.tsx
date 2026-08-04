import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  LinearGradient,
} from "expo-linear-gradient";
interface Props {
  name: string;
  age: string;
  photo?: string;
  gender:
    | "boy"
    | "girl";
}
export default function HeroCard({
  name,
  age,
  photo,
  gender,
}: Props) {
  const fallbackAvatar =
    gender === "boy"
      ? "👦"
      : "👧";
  return (
    <LinearGradient
      colors={[
        "#6C8CFF",
        "#4F6EF7",
      ]}
      style={styles.container}
    >
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
          <Text
            style={
              styles.avatarText
            }
          >
            {fallbackAvatar}
          </Text>
        )}
      </View>
      <Text style={styles.name}>
        {name}
      </Text>
      <Text style={styles.age}>
        {age}
      </Text>
    </LinearGradient>
  );
}
const styles =
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginBottom: 24,
      borderRadius: 24,
      paddingVertical: 28,
    },
    avatar: {
      width: 94,
      height: 94,
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 3,
      borderColor:
        "rgba(255,255,255,0.85)",
      borderRadius: 47,
      backgroundColor:
        "#FFFFFF",
    },
    photo: {
      width: "100%",
      height: "100%",
    },
    avatarText: {
      fontSize: 46,
    },
    name: {
      fontSize: 28,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    age: {
      marginTop: 6,
      fontSize: 16,
      color: "#E8EDFF",
    },
  });
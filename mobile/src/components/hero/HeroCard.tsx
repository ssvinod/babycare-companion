import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

interface Props {
  name: string;
  age: string;
}

export default function HeroCard({
  name,
  age,
}: Props) {
  return (
    <LinearGradient
      colors={["#6C8CFF", "#4F6EF7"]}
      style={styles.container}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👶</Text>
      </View>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.age}>{age}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 44,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  age: {
    color: "#E8EDFF",
    marginTop: 6,
    fontSize: 16,
  },
});
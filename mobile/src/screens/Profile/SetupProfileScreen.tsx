import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { useBabyStore } from "../../store/BabyStore";
export default function SetupProfileScreen() {
  const { setBaby } = useBabyStore();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  async function save() {
    await setBaby({
      id: "1",
      name,
      gender: "girl",
      birthDate,
      weight: 0,
      height: 0,
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome 👶
      </Text>
      <Text style={styles.subtitle}>
        Create your baby's profile
      </Text>
      <TextInput
        placeholder="Baby Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Birth Date (YYYY-MM-DD)"
        value={birthDate}
        onChangeText={setBirthDate}
        style={styles.input}
      />
      <Pressable
        style={styles.button}
        onPress={save}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#EEF2F8",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    color: "#666",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4F6EF7",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
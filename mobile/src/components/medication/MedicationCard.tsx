import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Medication } from "../../models/Medication";
interface Props {
  medication: Medication;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
export default function MedicationCard({
  medication,
  onComplete,
  onEdit,
  onDelete,
}: Props) {
  const completed = medication.completed === 1;
  return (
    <View
      style={[
        styles.card,
        completed && styles.completedCard,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          💊 {medication.medicine}
        </Text>
        <View
          style={[
            styles.badge,
            completed
              ? styles.green
              : styles.orange,
          ]}
        >
          <Text style={styles.badgeText}>
            {completed
              ? "Given"
              : "Pending"}
          </Text>
        </View>
      </View>
      {!!medication.dosage && (
        <Text style={styles.detail}>
          Dose: {medication.dosage}{" "}
          {medication.unit}
        </Text>
      )}
      {!!medication.frequency && (
        <Text style={styles.detail}>
          {medication.frequency}
        </Text>
      )}
      {!!medication.reminderTime && (
        <Text style={styles.detail}>
          ⏰ {medication.reminderTime}
        </Text>
      )}
      {completed &&
        medication.completedAt && (
          <Text style={styles.time}>
            Given on{" "}
            {new Date(
              medication.completedAt
            ).toLocaleString()}
          </Text>
        )}
      <View style={styles.buttons}>
        <Pressable
          style={styles.primary}
          onPress={onComplete}
        >
          <Text style={styles.primaryText}>
            {completed
              ? "Mark Pending"
              : "Mark Given"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.secondary}
          onPress={onEdit}
        >
          <Text>Edit</Text>
        </Pressable>
        <Pressable
          style={styles.delete}
          onPress={onDelete}
        >
          <Text style={{ color: "#B91C1C" }}>
            Delete
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  completedCard: {
    borderColor: "#22C55E",
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  green: {
    backgroundColor: "#DCFCE7",
  },
  orange: {
    backgroundColor: "#FEF3C7",
  },
  badgeText: {
    fontWeight: "700",
  },
  detail: {
    marginTop: 8,
    color: "#555",
  },
  time: {
    marginTop: 10,
    color: "#15803D",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 18,
    gap: 10,
  },
  primary: {
    flex: 1,
    backgroundColor: "#4F6EF7",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondary: {
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  delete: {
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },
});
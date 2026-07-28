import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Growth } from "../../models/Growth";
import { formatDisplayDateTime } from "../../utils/dateUtils";
interface Props {
  growth: Growth;
  onDelete: () => void;
}
export default function GrowthCard({
  growth,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>
        {formatDisplayDateTime(growth.date)}
      </Text>
      <Text style={styles.value}>
        ⚖️ {growth.weight} kg
      </Text>
      <Text style={styles.value}>
        📏 {growth.height} cm
      </Text>
      <Text style={styles.value}>
        🧠 {growth.headCircumference} cm
      </Text>
      <Pressable
        style={styles.delete}
        onPress={onDelete}
      >
        <Text style={styles.deleteText}>
          Delete
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  date: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  delete: {
    marginTop: 14,
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "#EF4444",
    fontWeight: "700",
  },
});
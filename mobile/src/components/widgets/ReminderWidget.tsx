import React from "react";
import {
  View,
 Text,
  StyleSheet,
} from "react-native";

export default function ReminderWidget() {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>
        Upcoming Reminder
      </Text>

      <Text style={styles.reminder}>
        💉 Next vaccination in 12 days
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7ED",

    borderRadius: 20,

    padding: 20,

    marginBottom: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  reminder: {
    fontSize: 18,
    color: "#B45309",
  },
});
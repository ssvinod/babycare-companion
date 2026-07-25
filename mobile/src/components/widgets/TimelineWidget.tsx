import React from "react";
import {
  View,
 Text,
  StyleSheet,
} from "react-native";

const events = [
  {
    time: "08:00",
    icon: "🍼",
    title: "Breastfeeding",
  },
  {
    time: "10:30",
    icon: "😴",
    title: "Morning Nap",
  },
  {
    time: "12:30",
    icon: "🍼",
    title: "Formula",
  },
];

export default function TimelineWidget() {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>
        Today's Timeline
      </Text>

      {events.map((item) => (
        <View
          key={item.time}
          style={styles.row}
        >
          <Text style={styles.time}>
            {item.time}
          </Text>

          <Text style={styles.icon}>
            {item.icon}
          </Text>

          <Text style={styles.title}>
            {item.title}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  time: {
    width: 70,
    color: "#666",
    fontWeight: "600",
  },

  icon: {
    fontSize: 24,
    width: 40,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
  },
});
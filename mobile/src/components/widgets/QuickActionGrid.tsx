import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

const actions = [
  {
    icon: "🍼",
    title: "Feeding",
    color: "#DBEAFE",
  },
  {
    icon: "😴",
    title: "Sleep",
    color: "#F3E8FF",
  },
  {
    icon: "📈",
    title: "Growth",
    color: "#FEF3C7",
  },
  {
    icon: "💉",
    title: "Vaccines",
    color: "#DCFCE7",
  },
];

export default function QuickActionGrid() {
  return (
    <View style={styles.grid}>
      {actions.map((item) => (
        <Pressable
          key={item.title}
          style={styles.card}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={styles.icon}>
              {item.icon}
            </Text>
          </View>

          <Text style={styles.title}>
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 28,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },

  icon: {
    fontSize: 28,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
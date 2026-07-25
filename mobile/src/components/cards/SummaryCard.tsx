import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
interface Props {
  icon: string;
  title: string;
  value: string;
  color?: string;
}
export default function SummaryCard({
  icon,
  title,
  value,
  color = "#4F6EF7",
}: Props) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: color + "22" },
        ]}
      >
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.value}>
          {value}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 30,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    color: "#6B7280",
    fontSize: 15,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
}
export default function QuickActionCard({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        disabled && styles.disabledCard,
        pressed &&
          !disabled &&
          styles.pressedCard,
      ]}
    >
      <Text style={styles.icon}>
        {icon}
      </Text>
      <Text
        style={[
          styles.title,
          disabled &&
            styles.disabledTitle,
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    width: "30%",
    minHeight: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
  disabledCard: {
    backgroundColor: "#F3F4F6",
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 29,
    marginBottom: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
  },
  disabledTitle: {
    color: "#6B7280",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: "#9CA3AF",
  },
});
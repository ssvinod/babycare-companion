import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
}
export default function ProfileRow({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  disabled = false,
}: Props) {
  const canPress =
    Boolean(onPress) && !disabled;
  return (
    <Pressable
      disabled={!canPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.disabledRow,
        pressed &&
          canPress &&
          styles.pressedRow,
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {icon}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              disabled &&
                styles.disabledText,
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                disabled &&
                  styles.disabledSubtitle,
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {showArrow && canPress ? (
        <Text style={styles.arrow}>
          ›
        </Text>
      ) : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  pressedRow: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
  disabledRow: {
    backgroundColor: "#F8FAFC",
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  icon: {
    fontSize: 21,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  disabledText: {
    color: "#6B7280",
  },
  disabledSubtitle: {
    color: "#9CA3AF",
  },
  arrow: {
    marginLeft: 12,
    fontSize: 28,
    lineHeight: 30,
    color: "#9CA3AF",
  },
});
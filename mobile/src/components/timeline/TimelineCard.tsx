import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";
import {
  TimelineItem,
  TimelineType,
} from "../../types/Timeline";
interface Props {
  item: TimelineItem;
}
interface TimelineAppearance {
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
}
function getAppearance(
  type: TimelineType
): TimelineAppearance {
  switch (type) {
    case "feeding":
      return {
        icon: "restaurant",
        backgroundColor: "#DBEAFE",
        iconColor: "#2563EB",
      };
    case "sleep":
      return {
        icon: "moon",
        backgroundColor: "#EDE9FE",
        iconColor: "#7C3AED",
      };
    case "growth":
      return {
        icon: "trending-up",
        backgroundColor: "#FEF3C7",
        iconColor: "#D97706",
      };
    case "medication":
      return {
        icon: "medkit",
        backgroundColor: "#FCE7F3",
        iconColor: "#DB2777",
      };
    case "vaccination":
      return {
        icon: "shield-checkmark",
        backgroundColor: "#DCFCE7",
        iconColor: "#16A34A",
      };
  }
}
function formatTimestamp(
  timestamp: string
): string {
  const date = new Date(timestamp);
  if (
    Number.isNaN(date.getTime())
  ) {
    return timestamp;
  }
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function formatStatus(
  status?: string
): string | null {
  if (!status) {
    return null;
  }
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}
export default function TimelineCard({
  item,
}: Props) {
  const appearance =
    getAppearance(item.type);
  const status =
    formatStatus(item.status);
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              appearance.backgroundColor,
          },
        ]}
      >
        <Ionicons
          name={appearance.icon}
          size={23}
          color={appearance.iconColor}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {status ? (
            <View style={styles.statusBadge}>
              <Text
                style={styles.statusText}
              >
                {status}
              </Text>
            </View>
          ) : null}
        </View>
        {item.subtitle ? (
          <Text style={styles.subtitle}>
            {item.subtitle}
          </Text>
        ) : null}
        <Text style={styles.timestamp}>
          {formatTimestamp(
            item.timestamp
          )}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 19,
    color: "#4B5563",
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  statusBadge: {
    marginLeft: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
});
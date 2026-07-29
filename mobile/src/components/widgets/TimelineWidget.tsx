import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useNavigation,
} from "@react-navigation/native";
import { useDashboardStore } from "../../store/DashboardStore";
function displayTime(
  value: string
): string {
  const match =
    /^(\d{2}):(\d{2})$/.exec(
      value
    );
  if (!match) {
    return value;
  }
  const date = new Date();
  date.setHours(
    Number(match[1]),
    Number(match[2]),
    0,
    0
  );
  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
}
export default function TimelineWidget() {
  const navigation =
    useNavigation<any>();
  const todayMedications =
    useDashboardStore(
      (state) =>
        state.todayMedications
    );
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          Today's Medications
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate(
              "Medication"
            )
          }
        >
          <Text style={styles.viewAll}>
            View all
          </Text>
        </Pressable>
      </View>
      {todayMedications.length ===
      0 ? (
        <Text style={styles.empty}>
          No medication reminders scheduled for today.
        </Text>
      ) : (
        todayMedications.map(
          (item, index) => {
            const dose = [
              item.dosage,
              item.unit,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <View
                key={`${item.id}-${item.time}-${index}`}
                style={styles.row}
              >
                <Text
                  style={styles.time}
                >
                  {displayTime(
                    item.time
                  )}
                </Text>
                <Text
                  style={styles.icon}
                >
                  💊
                </Text>
                <View
                  style={styles.details}
                >
                  <Text
                    style={
                      styles.title
                    }
                  >
                    {item.medicine}
                  </Text>
                  {dose ? (
                    <Text
                      style={
                        styles.dose
                      }
                    >
                      {dose}
                    </Text>
                  ) : null}
                </View>
                <View
                  style={[
                    styles.status,
                    item.completed ===
                    1
                      ? styles.givenStatus
                      : styles.pendingStatus,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.completed ===
                      1
                        ? styles.givenText
                        : styles.pendingText,
                    ]}
                  >
                    {item.completed ===
                    1
                      ? "Given"
                      : "Pending"}
                  </Text>
                </View>
              </View>
            );
          }
        )
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  header: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },
  viewAll: {
    color: "#2563EB",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  time: {
    width: 78,
    color: "#4B5563",
    fontWeight: "700",
    fontSize: 13,
  },
  icon: {
    width: 36,
    fontSize: 22,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  dose: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 13,
  },
  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  pendingStatus: {
    backgroundColor: "#FEF3C7",
  },
  givenStatus: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  pendingText: {
    color: "#92400E",
  },
  givenText: {
    color: "#166534",
  },
  empty: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 21,
  },
});
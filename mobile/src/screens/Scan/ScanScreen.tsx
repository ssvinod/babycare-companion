import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
export default function ScanScreen() {
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Scan"
        icon="📷"
      />
      <View style={styles.card}>
        <Text style={styles.icon}>
          📷
        </Text>
        <Text style={styles.title}>
          Document Scan
        </Text>
        <Text style={styles.description}>
          Scan prescriptions, vaccination records and medical reports.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Coming Soon
          </Text>
        </View>
      </View>
    </ScreenLayout>
  );
}
const styles =
  StyleSheet.create({
    card: {
      marginTop: 20,
      padding: 30,
      borderRadius: 22,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
    },
    icon: {
      fontSize: 52,
    },
    title: {
      marginTop: 14,
      color: "#111827",
      fontSize: 22,
      fontWeight: "800",
    },
    description: {
      marginTop: 10,
      color: "#6B7280",
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
    badge: {
      marginTop: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#EEF2FF",
    },
    badgeText: {
      color: "#4338CA",
      fontWeight: "800",
    },
  });
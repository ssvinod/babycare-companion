import React, {
  useCallback,
} from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { Medication } from "../../models/Medication";
import { useMedicationStore } from "../../store/MedicationStore";
export default function MedicationScreen() {
  const navigation =
    useNavigation<any>();
  const {
    medications,
    loading,
    loadMedications,
    markCompleted,
    markPending,
    deleteMedication,
  } = useMedicationStore();
  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );
  function confirmDelete(
    medication: Medication
  ) {
    if (!medication.id) {
      return;
    }
    Alert.alert(
      "Delete medication?",
      `${medication.medicine} will be permanently removed.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMedication(
              medication.id!
            ),
        },
      ]
    );
  }
  function doseText(
    medication: Medication
  ) {
    if (
      medication.dosage &&
      medication.unit
    ) {
      return `${medication.dosage} ${medication.unit}`;
    }
    return (
      medication.dosage ||
      medication.unit ||
      "Dose not specified"
    );
  }
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Medication"
        icon="💊"
      />
      <PrimaryButton
        title="+ Add Medication"
        onPress={() =>
          navigation.navigate(
            "AddMedication"
          )
        }
      />
      {loading &&
      medications.length === 0 ? (
        <Text style={styles.empty}>
          Loading medications...
        </Text>
      ) : null}
      {!loading &&
      medications.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            💊
          </Text>
          <Text style={styles.emptyTitle}>
            No medication added
          </Text>
          <Text style={styles.emptyText}>
            Add medicines, doses and reminder times here.
          </Text>
        </View>
      ) : null}
      {medications.map(
        (medication) => {
          const completed =
            medication.completed === 1;
          return (
            <View
              key={String(
                medication.id
              )}
              style={[
                styles.card,
                completed &&
                  styles.completedCard,
              ]}
            >
              <View
                style={styles.cardHeader}
              >
                <View
                  style={styles.titleArea}
                >
                  <Text
                    style={[
                      styles.medicineName,
                      completed &&
                        styles.completedName,
                    ]}
                  >
                    {medication.medicine}
                  </Text>
                  <Text
                    style={styles.dose}
                  >
                    {doseText(
                      medication
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    completed
                      ? styles.givenBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      completed
                        ? styles.givenText
                        : styles.pendingText,
                    ]}
                  >
                    {completed
                      ? "Given"
                      : "Pending"}
                  </Text>
                </View>
              </View>
              {medication.frequency ? (
                <Text
                  style={styles.detail}
                >
                  🔁{" "}
                  {medication.frequency}
                </Text>
              ) : null}
              {medication.reminderTime ? (
                <Text
                  style={styles.detail}
                >
                  ⏰{" "}
                  {medication.reminderTime}
                </Text>
              ) : null}
              {medication.notes ? (
                <Text
                  style={styles.notes}
                >
                  {medication.notes}
                </Text>
              ) : null}
              {completed &&
              medication.completedAt ? (
                <Text
                  style={
                    styles.completedAt
                  }
                >
                  Given on{" "}
                  {new Date(
                    medication.completedAt
                  ).toLocaleString(
                    "en-IN"
                  )}
                </Text>
              ) : null}
              <View
                style={styles.actions}
              >
                <Pressable
                  style={[
                    styles.actionButton,
                    completed
                      ? styles.pendingButton
                      : styles.givenButton,
                  ]}
                  onPress={() => {
                    if (
                      !medication.id
                    ) {
                      return;
                    }
                    if (completed) {
                      markPending(
                        medication.id
                      );
                    } else {
                      markCompleted(
                        medication.id
                      );
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.actionText,
                      completed
                        ? styles.pendingButtonText
                        : styles.givenButtonText,
                    ]}
                  >
                    {completed
                      ? "Mark Pending"
                      : "Mark Given"}
                  </Text>
                </Pressable>
                <Pressable
                  style={
                    styles.deleteButton
                  }
                  onPress={() =>
                    confirmDelete(
                      medication
                    )
                  }
                >
                  <Text
                    style={
                      styles.deleteText
                    }
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }
      )}
    </ScreenLayout>
  );
}
const styles =
  StyleSheet.create({
    card: {
      padding: 18,
      marginBottom: 14,
      borderRadius: 18,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    completedCard: {
      backgroundColor: "#F0FDF4",
      borderColor: "#BBF7D0",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    titleArea: {
      flex: 1,
    },
    medicineName: {
      color: "#111827",
      fontSize: 19,
      fontWeight: "800",
    },
    completedName: {
      color: "#166534",
    },
    dose: {
      marginTop: 5,
      color: "#4B5563",
      fontSize: 15,
      fontWeight: "600",
    },
    statusBadge: {
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 20,
    },
    pendingBadge: {
      backgroundColor: "#FEF3C7",
    },
    givenBadge: {
      backgroundColor: "#DCFCE7",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "800",
    },
    pendingText: {
      color: "#92400E",
    },
    givenText: {
      color: "#166534",
    },
    detail: {
      marginTop: 12,
      color: "#374151",
      fontSize: 15,
    },
    notes: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: "#F3F4F6",
      color: "#4B5563",
      fontSize: 14,
      lineHeight: 20,
    },
    completedAt: {
      marginTop: 10,
      color: "#15803D",
      fontSize: 13,
      fontWeight: "600",
    },
    actions: {
      flexDirection: "row",
      marginTop: 16,
      gap: 10,
    },
    actionButton: {
      flex: 1,
      minHeight: 45,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13,
    },
    givenButton: {
      backgroundColor: "#4F6EF7",
    },
    pendingButton: {
      backgroundColor: "#FEF3C7",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "800",
    },
    givenButtonText: {
      color: "#FFFFFF",
    },
    pendingButtonText: {
      color: "#92400E",
    },
    deleteButton: {
      minWidth: 86,
      minHeight: 45,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13,
      backgroundColor: "#FEE2E2",
    },
    deleteText: {
      color: "#B91C1C",
      fontSize: 14,
      fontWeight: "800",
    },
    emptyCard: {
      padding: 28,
      borderRadius: 20,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
    },
    emptyIcon: {
      fontSize: 44,
      marginBottom: 10,
    },
    emptyTitle: {
      color: "#111827",
      fontSize: 19,
      fontWeight: "800",
    },
    emptyText: {
      marginTop: 7,
      color: "#6B7280",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },
    empty: {
      marginTop: 30,
      color: "#6B7280",
      fontSize: 16,
      textAlign: "center",
    },
  });
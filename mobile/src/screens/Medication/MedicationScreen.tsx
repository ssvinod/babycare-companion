import React, {
  useCallback,
  useMemo,
  useState,
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
import { MedicationDose } from "../../models/MedicationDose";
import { useMedicationStore } from "../../store/MedicationStore";
import MedicationDoseService, {
  TodayMedicationDose,
} from "../../services/MedicationDoseService";
export default function MedicationScreen() {
  const navigation =
    useNavigation<any>();
  const {
    medications,
    loading,
    loadMedications,
    deleteMedication,
  } = useMedicationStore();
  const [
    todayDoses,
    setTodayDoses,
  ] = useState<TodayMedicationDose[]>(
    []
  );
  const [
    loadingDoses,
    setLoadingDoses,
  ] = useState(false);
  const [
    updatingDoseId,
    setUpdatingDoseId,
  ] = useState<number | null>(
    null
  );
  const loadScreen = useCallback(
    async () => {
      setLoadingDoses(true);
      try {
        await loadMedications();
        const doses =
          await MedicationDoseService
            .getTodayDoses();
        setTodayDoses(doses);
      } catch (error) {
        console.error(
          "Failed to load medication doses:",
          error
        );
        Alert.alert(
          "Unable to load medication",
          "Please try again."
        );
      } finally {
        setLoadingDoses(false);
      }
    },
    [loadMedications]
  );
  useFocusEffect(
    useCallback(() => {
      loadScreen();
    }, [loadScreen])
  );
  const dosesByMedication =
    useMemo(() => {
      const grouped =
        new Map<
          number,
          MedicationDose[]
        >();
      todayDoses.forEach(
        ({ dose }) => {
          const current =
            grouped.get(
              dose.medicationId
            ) ?? [];
          current.push(dose);
          grouped.set(
            dose.medicationId,
            current
          );
        }
      );
      return grouped;
    }, [todayDoses]);
  async function reloadDoses() {
    const doses =
      await MedicationDoseService
        .getTodayDoses();
    setTodayDoses(doses);
  }
  async function updateDose(
    dose: MedicationDose,
    action:
      | "taken"
      | "skipped"
      | "pending"
  ) {
    if (!dose.id) {
      return;
    }
    setUpdatingDoseId(dose.id);
    try {
      if (action === "taken") {
        await MedicationDoseService
          .markTaken(dose.id);
      } else if (
        action === "skipped"
      ) {
        await MedicationDoseService
          .markSkipped(dose.id);
      } else {
        await MedicationDoseService
          .markPending(dose.id);
      }
      await reloadDoses();
    } catch (error) {
      console.error(
        "Failed to update dose:",
        error
      );
      Alert.alert(
        "Unable to update dose",
        "Please try again."
      );
    } finally {
      setUpdatingDoseId(null);
    }
  }
  function confirmDelete(
    medication: Medication
  ) {
    if (!medication.id) {
      return;
    }
    Alert.alert(
      "Delete medication?",
      `${medication.medicine} and its dose history will be permanently removed.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMedication(
              medication.id!
            );
            await reloadDoses();
          },
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
  function formatTime(
    time: string
  ) {
    const [
      hoursText,
      minutesText,
    ] = time.split(":");
    const hours =
      Number(hoursText);
    const minutes =
      Number(minutesText);
    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }
    const date = new Date();
    date.setHours(
      hours,
      minutes,
      0,
      0
    );
    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }
  function completedDoseCount(
    doses: MedicationDose[]
  ) {
    return doses.filter(
      (dose) =>
        dose.status === "taken"
    ).length;
  }
  const activeMedications =
    medications.filter(
      (medication) =>
        medication.completed !== 1
    );
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
      {loading ||
      loadingDoses ? (
        <Text style={styles.loading}>
          Loading today's medication...
        </Text>
      ) : null}
      {!loading &&
      !loadingDoses &&
      activeMedications.length ===
        0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            💊
          </Text>
          <Text style={styles.emptyTitle}>
            No active medication
          </Text>
          <Text style={styles.emptyText}>
            Add a medicine and its
            reminder times to begin
            tracking each dose.
          </Text>
        </View>
      ) : null}
      {activeMedications.map(
        (medication) => {
          if (!medication.id) {
            return null;
          }
          const doses =
            dosesByMedication.get(
              medication.id
            ) ?? [];
          const takenCount =
            completedDoseCount(doses);
          const allTaken =
            doses.length > 0 &&
            takenCount ===
              doses.length;
          return (
            <View
              key={medication.id}
              style={[
                styles.card,
                allTaken &&
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
                    style={
                      styles.medicineName
                    }
                  >
                    {
                      medication.medicine
                    }
                  </Text>
                  <Text
                    style={styles.doseText}
                  >
                    {doseText(
                      medication
                    )}
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBadge,
                    allTaken
                      ? styles.completeBadge
                      : styles.incompleteBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.progressText,
                      allTaken
                        ? styles.completeText
                        : styles.incompleteText,
                    ]}
                  >
                    {doses.length > 0
                      ? `${takenCount}/${doses.length}`
                      : "No times"}
                  </Text>
                </View>
              </View>
              {medication.frequency ? (
                <Text
                  style={styles.detail}
                >
                  🔁{" "}
                  {
                    medication.frequency
                  }
                </Text>
              ) : null}
              <Text
                style={
                  styles.todayHeading
                }
              >
                Today's doses
              </Text>
              {doses.length === 0 ? (
                <View
                  style={
                    styles.noDoseCard
                  }
                >
                  <Text
                    style={
                      styles.noDoseText
                    }
                  >
                    No reminder times
                    configured.
                  </Text>
                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        "EditMedication",
                        {
                          medication,
                        }
                      )
                    }
                  >
                    <Text
                      style={
                        styles.addTimesText
                      }
                    >
                      Add reminder times
                    </Text>
                  </Pressable>
                </View>
              ) : (
                doses.map((dose) => {
                  const updating =
                    updatingDoseId ===
                    dose.id;
                  return (
                    <View
                      key={dose.id}
                      style={
                        styles.doseRow
                      }
                    >
                      <View
                        style={
                          styles.doseInfo
                        }
                      >
                        <Text
                          style={
                            styles.doseTime
                          }
                        >
                          {formatTime(
                            dose.scheduledTime
                          )}
                        </Text>
                        <Text
                          style={[
                            styles.doseStatus,
                            dose.status ===
                              "taken" &&
                              styles.takenStatus,
                            dose.status ===
                              "skipped" &&
                              styles.skippedStatus,
                          ]}
                        >
                          {dose.status ===
                          "taken"
                            ? "Given"
                            : dose.status ===
                              "skipped"
                            ? "Skipped"
                            : "Pending"}
                        </Text>
                        {dose.takenAt ? (
                          <Text
                            style={
                              styles.takenAt
                            }
                          >
                            Given at{" "}
                            {new Date(
                              dose.takenAt
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour:
                                  "numeric",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </Text>
                        ) : null}
                      </View>
                      {dose.status ===
                      "pending" ? (
                        <View
                          style={
                            styles.doseActions
                          }
                        >
                          <Pressable
                            disabled={
                              updating
                            }
                            style={
                              styles.givenButton
                            }
                            onPress={() =>
                              updateDose(
                                dose,
                                "taken"
                              )
                            }
                          >
                            <Text
                              style={
                                styles.givenButtonText
                              }
                            >
                              Given
                            </Text>
                          </Pressable>
                          <Pressable
                            disabled={
                              updating
                            }
                            style={
                              styles.skipButton
                            }
                            onPress={() =>
                              updateDose(
                                dose,
                                "skipped"
                              )
                            }
                          >
                            <Text
                              style={
                                styles.skipButtonText
                              }
                            >
                              Skip
                            </Text>
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          disabled={updating}
                          style={
                            styles.undoButton
                          }
                          onPress={() =>
                            updateDose(
                              dose,
                              "pending"
                            )
                          }
                        >
                          <Text
                            style={
                              styles.undoButtonText
                            }
                          >
                            Undo
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })
              )}
              {medication.notes ? (
                <Text
                  style={styles.notes}
                >
                  {medication.notes}
                </Text>
              ) : null}
              <View
                style={
                  styles.bottomActions
                }
              >
                <Pressable
                  style={
                    styles.editButton
                  }
                  onPress={() =>
                    navigation.navigate(
                      "EditMedication",
                      {
                        medication,
                      }
                    )
                  }
                >
                  <Text
                    style={
                      styles.editText
                    }
                  >
                    Edit
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
const styles = StyleSheet.create({
  loading: {
    marginTop: 24,
    color: "#6B7280",
    fontSize: 15,
    textAlign: "center",
  },
  card: {
    marginTop: 14,
    padding: 18,
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
  doseText: {
    marginTop: 5,
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "600",
  },
  progressBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  incompleteBadge: {
    backgroundColor: "#FEF3C7",
  },
  completeBadge: {
    backgroundColor: "#DCFCE7",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "800",
  },
  incompleteText: {
    color: "#92400E",
  },
  completeText: {
    color: "#166534",
  },
  detail: {
    marginTop: 12,
    color: "#374151",
    fontSize: 15,
  },
  todayHeading: {
    marginTop: 18,
    marginBottom: 8,
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  doseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  doseInfo: {
    flex: 1,
  },
  doseTime: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  doseStatus: {
    marginTop: 3,
    color: "#92400E",
    fontSize: 13,
    fontWeight: "700",
  },
  takenStatus: {
    color: "#15803D",
  },
  skippedStatus: {
    color: "#B91C1C",
  },
  takenAt: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },
  doseActions: {
    flexDirection: "row",
    gap: 8,
  },
  givenButton: {
    minWidth: 68,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#4F6EF7",
  },
  givenButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  skipButton: {
    minWidth: 56,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#FEE2E2",
  },
  skipButtonText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "800",
  },
  undoButton: {
    minWidth: 62,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
  },
  undoButtonText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "800",
  },
  noDoseCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
  },
  noDoseText: {
    color: "#9A3412",
    fontSize: 14,
  },
  addTimesText: {
    marginTop: 7,
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "800",
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
  bottomActions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  editButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
  },
  editText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "800",
  },
  deleteButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
  },
  deleteText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "800",
  },
  emptyCard: {
    marginTop: 18,
    padding: 28,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 10,
    fontSize: 44,
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
});
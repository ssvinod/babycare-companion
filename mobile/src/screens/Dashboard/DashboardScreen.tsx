import React, {
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFocusEffect,
} from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import HeroCard from "../../components/hero/HeroCard";
import QuickActionGrid from "../../components/widgets/QuickActionGrid";
import SummaryCard from "../../components/cards/SummaryCard";
import TimelineWidget from "../../components/widgets/TimelineWidget";
import ReminderWidget from "../../components/widgets/ReminderWidget";
import {
  calculateAge,
} from "../../utils/calculateAge";
import {
  useBabyStore,
} from "../../store/BabyStore";
import {
  useDashboardStore,
} from "../../store/DashboardStore";
function formatDateTime(
  value: string | null
): string {
  if (!value) {
    return "No feeding recorded";
  }
  const date =
    new Date(value);
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }
  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
}
function formatDate(
  value: string | null
): string {
  if (!value) {
    return "";
  }
  const date =
    new Date(value);
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }
  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}
function formatDuration(
  totalMinutes: number
): string {
  if (totalMinutes <= 0) {
    return "No completed sleep yet";
  }
  const hours =
    Math.floor(
      totalMinutes / 60
    );
  const minutes =
    totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${minutes} min`;
}
function medicationSummary(
  pending: number,
  completed: number,
  skipped: number
): string {
  const total =
    pending +
    completed +
    skipped;
  if (total === 0) {
    return "No doses scheduled";
  }
  if (pending > 0) {
    return (
      `${pending} pending • ` +
      `${completed} given`
    );
  }
  if (skipped > 0) {
    return (
      `${completed} given • ` +
      `${skipped} skipped`
    );
  }
  return `All ${completed} doses given`;
}
export default function DashboardScreen() {
  const {
    baby,
    loadBaby,
  } = useBabyStore();
  const {
    todayFeedings,
    todayQuantity,
    todaySleepMinutes,
    lastFeeding,
    latestWeight,
    nextVaccine,
    nextVaccineDate,
    pendingMedicationDoses,
    completedMedicationDoses,
    skippedMedicationDoses,
    refresh,
    loading,
    error,
  } = useDashboardStore();
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );
  useEffect(() => {
    async function initialize() {
      await loadBaby();
      await refresh();
    }
    void initialize();
  }, [
    loadBaby,
    refresh,
  ]);
  if (!baby) {
    return null;
  }
  return (
    <ScreenLayout>
      <HeroCard
        name={baby.name}
        age={calculateAge(
          baby.birthDate
        )}
        photo={baby.photo}
        gender={baby.gender}
      />
      <QuickActionGrid />
      <ScreenTitle
        title="Today's Summary"
        icon="📋"
      />
      {loading ? (
        <Text
          style={
            styles.statusText
          }
        >
          Refreshing today’s summary...
        </Text>
      ) : null}
      {!loading && error ? (
        <View
          style={
            styles.errorCard
          }
        >
          <Text
            style={
              styles.errorTitle
            }
          >
            Dashboard unavailable
          </Text>
          <Text
            style={
              styles.errorText
            }
          >
            {error}
          </Text>
        </View>
      ) : null}
      <SummaryCard
        icon="🍼"
        title="Today's Feed"
        value={
          todayQuantity > 0
            ? `${todayFeedings} feeds • ${todayQuantity} ml`
            : `${todayFeedings} feeds`
        }
        color="#2563EB"
      />
      <SummaryCard
        icon="😴"
        title="Today's Sleep"
        value={formatDuration(
          todaySleepMinutes
        )}
        color="#7C3AED"
      />
      <SummaryCard
        icon="💊"
        title="Medication"
        value={medicationSummary(
          pendingMedicationDoses,
          completedMedicationDoses,
          skippedMedicationDoses
        )}
        color="#DB2777"
      />
      <SummaryCard
        icon="💉"
        title="Next Vaccination"
        value={
          nextVaccine
            ? `${nextVaccine}\n${formatDate(
              nextVaccineDate
            )}`
            : "All vaccinations completed"
        }
        color="#16A34A"
      />
      <SummaryCard
        icon="📈"
        title="Latest Weight"
        value={
          latestWeight !== null
            ? `${latestWeight} kg`
            : "No growth record"
        }
        color="#F59E0B"
      />
      <SummaryCard
        icon="🕒"
        title="Last Feeding"
        value={formatDateTime(
          lastFeeding
        )}
        color="#0F766E"
      />
      <TimelineWidget />
      <ReminderWidget />
    </ScreenLayout>
  );
}
const styles =
  StyleSheet.create({
    statusText: {
      marginBottom: 14,
      textAlign: "center",
      fontSize: 13,
      fontWeight: "600",
      color: "#6B7280",
    },
    errorCard: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#FECACA",
      borderRadius: 16,
      backgroundColor: "#FEF2F2",
      padding: 14,
    },
    errorTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#991B1B",
    },
    errorText: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: "#B91C1C",
    },
  });
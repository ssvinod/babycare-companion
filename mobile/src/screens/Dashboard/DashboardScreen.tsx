import React, { useEffect } from "react";
import ScreenLayout from "../../components/common/ScreenLayout";
import HeroCard from "../../components/hero/HeroCard";
import QuickActionGrid from "../../components/widgets/QuickActionGrid";
import SummaryCard from "../../components/cards/SummaryCard";
import ScreenTitle from "../../components/common/ScreenTitle";
import { calculateAge } from "../../utils/calculateAge";
import { useBabyStore } from "../../store/BabyStore";
import { useDashboardStore } from "../../store/DashboardStore";
import TimelineWidget from "../../components/widgets/TimelineWidget";
import ReminderWidget from "../../components/widgets/ReminderWidget";
import ProgressSection from "../../components/widgets/ProgressSection";
function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export default function DashboardScreen() {
  const { baby, loadBaby } = useBabyStore();
  const {
    todayFeedings,
    lastFeeding,
    latestWeight,
    nextVaccine,
    nextVaccineDate,
    nextSleepTime,
    refresh,
  } = useDashboardStore();
  useEffect(() => {
    async function load() {
      await loadBaby();
      // wait until BabyStore finishes generating vaccine schedule
      refresh();
    }
    load();
  }, []);
  if (!baby) return null;
  return (
    <ScreenLayout>
      <HeroCard
        name={baby.name}
        age={calculateAge(baby.birthDate)}
      />
      <QuickActionGrid />
      <ProgressSection />
      <TimelineWidget />
      <ReminderWidget />
      <ScreenTitle
        title="Today's Summary"
        icon="📋"
      />
      <SummaryCard
        icon="🍼"
        title="Today's Feedings"
        value={todayFeedings.toString()}
        color="#2563EB"
      />
      <SummaryCard
        icon="🕒"
        title="Last Feeding"
        value={formatDateTime(lastFeeding)}
      />
      <SummaryCard
        icon="😴"
        title="Sleep"
        value="Track more sleep to predict naps"
        color="#7C3AED"
      />
      <SummaryCard
        icon="💉"
        title="Next Vaccination"
        value={
          nextVaccine
            ? `${nextVaccine}\n${formatDate(nextVaccineDate)}`
            : "All vaccinations completed"
        }
        color="#16A34A"
      />
      <SummaryCard
        icon="📈"
        title="Latest Weight"
        value={
          latestWeight != null
            ? `${latestWeight} kg`
            : "--"
        }
        color="#F59E0B"
      />
    </ScreenLayout>
  );
}
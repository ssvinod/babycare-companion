import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFocusEffect,
} from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import TimelineCard from "../../components/timeline/TimelineCard";
import TimelineService from "../../services/TimelineService";
import {
  TimelineItem,
  TimelineType,
} from "../../types/Timeline";
type TimelineFilter =
  | "all"
  | TimelineType;
interface FilterOption {
  label: string;
  value: TimelineFilter;
}
const FILTERS: FilterOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Feed",
    value: "feeding",
  },
  {
    label: "Sleep",
    value: "sleep",
  },
  {
    label: "Medication",
    value: "medication",
  },
  {
    label: "Growth",
    value: "growth",
  },
  {
    label: "Vaccination",
    value: "vaccination",
  },
];
export default function TimelineScreen() {
  const [items, setItems] =
    useState<TimelineItem[]>([]);
  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<TimelineFilter>("all");
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const loadTimeline =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const timelineItems =
          await TimelineService.getTimeline();
        setItems(timelineItems);
      } catch (loadError) {
        console.error(
          "Failed to load timeline:",
          loadError
        );
        setError(
          "Unable to load timeline records."
        );
      } finally {
        setLoading(false);
      }
    }, []);
  useFocusEffect(
    useCallback(() => {
      void loadTimeline();
    }, [loadTimeline])
  );
  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") {
      return items;
    }
    return items.filter(
      item =>
        item.type === selectedFilter
    );
  }, [items, selectedFilter]);
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Timeline"
        icon="🕒"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.filterContainer
        }
      >
        {FILTERS.map(filter => {
          const selected =
            selectedFilter ===
            filter.value;
          return (
            <Pressable
              key={filter.value}
              onPress={() =>
                setSelectedFilter(
                  filter.value
                )
              }
              style={[
                styles.filterChip,
                selected &&
                  styles.selectedFilterChip,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected &&
                    styles.selectedFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {loading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator
            size="large"
            color="#4F46E5"
          />
          <Text style={styles.stateText}>
            Loading timeline...
          </Text>
        </View>
      ) : null}
      {!loading && error ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateIcon}>
            ⚠️
          </Text>
          <Text style={styles.stateTitle}>
            Timeline unavailable
          </Text>
          <Text style={styles.stateText}>
            {error}
          </Text>
          <Pressable
            onPress={() =>
              void loadTimeline()
            }
            style={({ pressed }) => [
              styles.retryButton,
              pressed &&
                styles.retryButtonPressed,
            ]}
          >
            <Text
              style={styles.retryButtonText}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}
      {!loading &&
      !error &&
      filteredItems.length === 0 ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateIcon}>
            🗓️
          </Text>
          <Text style={styles.stateTitle}>
            No timeline records
          </Text>
          <Text style={styles.stateText}>
            Records added through Feed,
            Sleep, Growth, Medication and
            Vaccination will appear here.
          </Text>
        </View>
      ) : null}
      {!loading && !error
        ? filteredItems.map(item => (
            <TimelineCard
              key={item.id}
              item={item}
            />
          ))
        : null}
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  filterContainer: {
    paddingBottom: 18,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    marginRight: 9,
  },
  selectedFilterChip: {
    backgroundColor: "#4F46E5",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  selectedFilterText: {
    color: "#FFFFFF",
  },
  stateCard: {
    minHeight: 260,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 34,
  },
  stateIcon: {
    fontSize: 38,
    marginBottom: 14,
  },
  stateTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  stateText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },
  retryButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonPressed: {
    opacity: 0.75,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
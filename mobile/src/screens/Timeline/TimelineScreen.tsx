import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
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
import TimelineService, {
  ClearableTimelineType,
} from "../../services/TimelineService";
import {
  TimelineItem,
  TimelineType,
} from "../../types/Timeline";
type TimelineFilter =
  | "all"
  | TimelineType;
type TimelineRange =
  | "today"
  | "7days"
  | "30days"
  | "all";
interface FilterOption {
  label: string;
  value: TimelineFilter;
}
interface RangeOption {
  label: string;
  value: TimelineRange;
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
const RANGES: RangeOption[] = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "7 Days",
    value: "7days",
  },
  {
    label: "30 Days",
    value: "30days",
  },
  {
    label: "All",
    value: "all",
  },
];
function startOfToday(): Date {
  const date = new Date();
  date.setHours(
    0,
    0,
    0,
    0
  );
  return date;
}
function startOfTomorrow(): Date {
  const date =
    startOfToday();
  date.setDate(
    date.getDate() + 1
  );
  return date;
}
function rangeStart(
  range: TimelineRange
): Date | null {
  if (range === "all") {
    return null;
  }
  const start =
    startOfToday();
  if (range === "7days") {
    start.setDate(
      start.getDate() - 6
    );
  }
  if (range === "30days") {
    start.setDate(
      start.getDate() - 29
    );
  }
  return start;
}
function defaultRangeForFilter(
  filter: TimelineFilter
): TimelineRange {
  if (
    filter === "feeding" ||
    filter === "sleep"
  ) {
    return "today";
  }
  if (
    filter === "growth" ||
    filter === "vaccination"
  ) {
    return "all";
  }
  return "7days";
}
function itemIsInRange(
  item: TimelineItem,
  range: TimelineRange
): boolean {
  if (range === "all") {
    return true;
  }
  const timestamp =
    new Date(
      item.timestamp
    ).getTime();
  if (
    Number.isNaN(timestamp)
  ) {
    return false;
  }
  const start =
    rangeStart(range);
  if (!start) {
    return true;
  }
  const end =
    startOfTomorrow();
  return (
    timestamp >= start.getTime() &&
    timestamp < end.getTime()
  );
}
function isClearableFilter(
  filter: TimelineFilter
): filter is ClearableTimelineType {
  return (
    filter === "feeding" ||
    filter === "sleep" ||
    filter === "medication"
  );
}
function historyName(
  filter: ClearableTimelineType
): string {
  if (filter === "feeding") {
    return "feed";
  }
  if (filter === "sleep") {
    return "sleep";
  }
  return "medication";
}
function historyTitle(
  filter: ClearableTimelineType
): string {
  if (filter === "feeding") {
    return "Feed";
  }
  if (filter === "sleep") {
    return "Sleep";
  }
  return "Medication";
}
function clearConfirmationMessage(
  filter: ClearableTimelineType
): string {
  if (filter === "feeding") {
    return (
      "This permanently removes all feeding " +
      "records. This action cannot be undone."
    );
  }
  if (filter === "sleep") {
    return (
      "This permanently removes completed " +
      "sleep records. An active sleep session " +
      "will remain available."
    );
  }
  return (
    "This permanently removes medication dose " +
    "history. Medication schedules and reminders " +
    "will remain available."
  );
}
function emptyStateMessage(
  filter: TimelineFilter,
  range: TimelineRange
): string {
  const selectedRangeLabel =
    RANGES.find(
      option =>
        option.value === range
    )?.label ?? "selected range";
  if (filter === "all") {
    return (
      `No activity was found for ` +
      `${selectedRangeLabel.toLowerCase()}.`
    );
  }
  const selectedFilterLabel =
    FILTERS.find(
      option =>
        option.value === filter
    )?.label ?? "timeline";
  return (
    `No ${selectedFilterLabel.toLowerCase()} ` +
    `records were found for ` +
    `${selectedRangeLabel.toLowerCase()}.`
  );
}
export default function TimelineScreen() {
  const [items, setItems] =
    useState<TimelineItem[]>(
      []
    );
  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState<TimelineFilter>(
    "all"
  );
  const [
    selectedRange,
    setSelectedRange,
  ] = useState<TimelineRange>(
    "7days"
  );
  const [loading, setLoading] =
    useState(true);
  const [clearing, setClearing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(
      null
    );
  const loadTimeline =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const timelineItems =
          await TimelineService.getTimeline();
        setItems(
          timelineItems
        );
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
  const handleFilterChange =
    useCallback(
      (
        filter: TimelineFilter
      ) => {
        setSelectedFilter(
          filter
        );
        setSelectedRange(
          defaultRangeForFilter(
            filter
          )
        );
      },
      []
    );
  const clearSelectedHistory =
    useCallback(() => {
      if (
        !isClearableFilter(
          selectedFilter
        )
      ) {
        return;
      }
      const type =
        selectedFilter;
      Alert.alert(
        `Clear ${historyTitle(type)} History?`,
        clearConfirmationMessage(type),
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Clear History",
            style: "destructive",
            onPress: async () => {
              try {
                setClearing(true);
                await TimelineService.clearHistory(
                  type
                );
                await loadTimeline();
              } catch (clearError) {
                console.error(
                  "Failed to clear timeline history:",
                  clearError
                );
                Alert.alert(
                  "Unable to clear history",
                  "The history could not be cleared. Please try again."
                );
              } finally {
                setClearing(false);
              }
            },
          },
        ]
      );
    }, [
      selectedFilter,
      loadTimeline,
    ]);
  const filteredItems =
    useMemo(() => {
      return items.filter(
        item => {
          const matchesType =
            selectedFilter ===
              "all" ||
            item.type ===
              selectedFilter;
          if (!matchesType) {
            return false;
          }
          return itemIsInRange(
            item,
            selectedRange
          );
        }
      );
    }, [
      items,
      selectedFilter,
      selectedRange,
    ]);
  const showClearHistory =
    isClearableFilter(
      selectedFilter
    );
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
        {FILTERS.map(
          filter => {
            const selected =
              selectedFilter ===
              filter.value;
            return (
              <Pressable
                key={
                  filter.value
                }
                disabled={
                  loading ||
                  clearing
                }
                onPress={() =>
                  handleFilterChange(
                    filter.value
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.filterChip,
                  selected &&
                    styles.selectedFilterChip,
                  pressed &&
                    styles.chipPressed,
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
          }
        )}
      </ScrollView>
      <View
        style={
          styles.rangeSection
        }
      >
        <Text
          style={
            styles.rangeLabel
          }
        >
          Date range
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.rangeContainer
          }
        >
          {RANGES.map(
            range => {
              const selected =
                selectedRange ===
                range.value;
              return (
                <Pressable
                  key={
                    range.value
                  }
                  disabled={
                    loading ||
                    clearing
                  }
                  onPress={() =>
                    setSelectedRange(
                      range.value
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.rangeChip,
                    selected &&
                      styles.selectedRangeChip,
                    pressed &&
                      styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.rangeText,
                      selected &&
                        styles.selectedRangeText,
                    ]}
                  >
                    {range.label}
                  </Text>
                </Pressable>
              );
            }
          )}
        </ScrollView>
      </View>
      {showClearHistory ? (
        <Pressable
          disabled={
            clearing ||
            loading
          }
          onPress={
            clearSelectedHistory
          }
          style={({
            pressed,
          }) => [
            styles.clearHistoryRow,
            pressed &&
              styles.clearHistoryRowPressed,
            (clearing ||
              loading) &&
              styles.clearHistoryRowDisabled,
          ]}
        >
          <View
            style={
              styles.clearHistoryLeft
            }
          >
            <Text
              style={
                styles.clearHistoryIcon
              }
            >
              🗑️
            </Text>
            <Text
              style={
                styles.clearHistoryText
              }
            >
              Clear{" "}
              {historyName(
                selectedFilter
              )}{" "}
              history
            </Text>
          </View>
          {clearing ? (
            <ActivityIndicator
              size="small"
              color="#DC2626"
            />
          ) : (
            <Text
              style={
                styles.clearHistoryChevron
              }
            >
              ›
            </Text>
          )}
        </Pressable>
      ) : null}
      {loading ? (
        <View
          style={
            styles.stateCard
          }
        >
          <ActivityIndicator
            size="large"
            color="#4F46E5"
          />
          <Text
            style={
              styles.stateText
            }
          >
            Loading timeline...
          </Text>
        </View>
      ) : null}
      {!loading && error ? (
        <View
          style={
            styles.stateCard
          }
        >
          <Text
            style={
              styles.stateIcon
            }
          >
            ⚠️
          </Text>
          <Text
            style={
              styles.stateTitle
            }
          >
            Timeline unavailable
          </Text>
          <Text
            style={
              styles.stateText
            }
          >
            {error}
          </Text>
          <Pressable
            disabled={clearing}
            onPress={() =>
              void loadTimeline()
            }
            style={({
              pressed,
            }) => [
              styles.retryButton,
              pressed &&
                styles.retryButtonPressed,
            ]}
          >
            <Text
              style={
                styles.retryButtonText
              }
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}
      {!loading &&
      !error &&
      filteredItems.length ===
        0 ? (
        <View
          style={
            styles.stateCard
          }
        >
          <Text
            style={
              styles.stateIcon
            }
          >
            🗓️
          </Text>
          <Text
            style={
              styles.stateTitle
            }
          >
            No timeline records
          </Text>
          <Text
            style={
              styles.stateText
            }
          >
            {emptyStateMessage(
              selectedFilter,
              selectedRange
            )}
          </Text>
        </View>
      ) : null}
      {!loading && !error
        ? filteredItems.map(
            item => (
              <TimelineCard
                key={item.id}
                item={item}
              />
            )
          )
        : null}
    </ScreenLayout>
  );
}
const styles =
  StyleSheet.create({
    filterContainer: {
      paddingBottom: 12,
      paddingRight: 8,
    },
    filterChip: {
      marginRight: 9,
      borderRadius: 999,
      backgroundColor:
        "#F3F4F6",
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    selectedFilterChip: {
      backgroundColor:
        "#4F46E5",
    },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#4B5563",
    },
    selectedFilterText: {
      color: "#FFFFFF",
    },
    rangeSection: {
      marginBottom: 10,
    },
    rangeLabel: {
      marginBottom: 8,
      fontSize: 13,
      fontWeight: "700",
      color: "#6B7280",
    },
    rangeContainer: {
      paddingRight: 8,
    },
    rangeChip: {
      marginRight: 8,
      borderRadius: 999,
      backgroundColor:
        "#EEF2FF",
      paddingHorizontal: 13,
      paddingVertical: 7,
    },
    selectedRangeChip: {
      backgroundColor:
        "#312E81",
    },
    rangeText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#4338CA",
    },
    selectedRangeText: {
      color: "#FFFFFF",
    },
    chipPressed: {
      opacity: 0.75,
    },
    clearHistoryRow: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 14,
      borderWidth: 1,
      borderColor: "#FECACA",
      borderRadius: 12,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 13,
      paddingVertical: 8,
    },
    clearHistoryRowPressed: {
      backgroundColor:
        "#FEF2F2",
    },
    clearHistoryRowDisabled: {
      opacity: 0.5,
    },
    clearHistoryLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    clearHistoryIcon: {
      marginRight: 8,
      fontSize: 15,
    },
    clearHistoryText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#B91C1C",
    },
    clearHistoryChevron: {
      marginLeft: 8,
      fontSize: 24,
      lineHeight: 24,
      fontWeight: "500",
      color: "#DC2626",
    },
    stateCard: {
      minHeight: 260,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 22,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 28,
      paddingVertical: 34,
    },
    stateIcon: {
      marginBottom: 14,
      fontSize: 38,
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
      backgroundColor:
        "#4F46E5",
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
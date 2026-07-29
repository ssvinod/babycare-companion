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
  SectionList,
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
interface TimelineSection {
  key: string;
  title: string;
  subtitle: string;
  data: TimelineItem[];
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
  const rangeLabel =
    RANGES.find(
      option =>
        option.value === range
    )?.label ?? "selected range";
  if (filter === "all") {
    return (
      `No activity was found for ` +
      `${rangeLabel.toLowerCase()}.`
    );
  }
  const filterLabel =
    FILTERS.find(
      option =>
        option.value === filter
    )?.label ?? "timeline";
  return (
    `No ${filterLabel.toLowerCase()} records ` +
    `were found for ` +
    `${rangeLabel.toLowerCase()}.`
  );
}
function localDateKey(
  timestamp: string
): string | null {
  const date =
    new Date(timestamp);
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }
  const year =
    date.getFullYear();
  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );
  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );
  return `${year}-${month}-${day}`;
}
function dateFromKey(
  key: string
): Date {
  const [
    year,
    month,
    day,
  ] = key
    .split("-")
    .map(Number);
  return new Date(
    year,
    month - 1,
    day
  );
}
function dayDifference(
  date: Date
): number {
  const today =
    startOfToday();
  const target =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  return Math.round(
    (
      today.getTime() -
      target.getTime()
    ) /
      86400000
  );
}
function sectionTitle(
  date: Date
): string {
  const difference =
    dayDifference(date);
  if (difference === 0) {
    return "Today";
  }
  if (difference === 1) {
    return "Yesterday";
  }
  if (
    difference > 1 &&
    difference < 7
  ) {
    return date.toLocaleDateString(
      undefined,
      {
        weekday: "long",
      }
    );
  }
  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year:
        date.getFullYear() ===
        new Date().getFullYear()
          ? undefined
          : "numeric",
    }
  );
}
function sectionSubtitle(
  date: Date
): string {
  return date.toLocaleDateString(
    undefined,
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
}
function groupTimelineItems(
  items: TimelineItem[]
): TimelineSection[] {
  const grouped =
    new Map<
      string,
      TimelineItem[]
    >();
  items.forEach(item => {
    const key =
      localDateKey(
        item.timestamp
      );
    if (!key) {
      return;
    }
    const current =
      grouped.get(key) ?? [];
    current.push(item);
    grouped.set(
      key,
      current
    );
  });
  return Array.from(
    grouped.entries()
  )
    .sort(
      (
        [firstKey],
        [secondKey]
      ) =>
        dateFromKey(
          secondKey
        ).getTime() -
        dateFromKey(
          firstKey
        ).getTime()
    )
    .map(
      (
        [key, sectionItems]
      ): TimelineSection => {
        const date =
          dateFromKey(key);
        return {
          key,
          title:
            sectionTitle(date),
          subtitle:
            sectionSubtitle(date),
          data: sectionItems.sort(
            (
              first,
              second
            ) =>
              new Date(
                second.timestamp
              ).getTime() -
              new Date(
                first.timestamp
              ).getTime()
          ),
        };
      }
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
  const sections =
    useMemo(
      () =>
        groupTimelineItems(
          filteredItems
        ),
      [filteredItems]
    );
  const showClearHistory =
    isClearableFilter(
      selectedFilter
    );
  const renderHeader =
    useCallback(
      () => (
        <View>
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
        </View>
      ),
      [
        selectedFilter,
        selectedRange,
        loading,
        clearing,
        showClearHistory,
        handleFilterChange,
        clearSelectedHistory,
      ]
    );
  const renderEmpty =
    useCallback(() => {
      if (loading) {
        return (
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
        );
      }
      if (error) {
        return (
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
        );
      }
      return (
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
      );
    }, [
      loading,
      error,
      selectedFilter,
      selectedRange,
      loadTimeline,
    ]);
  return (
    <ScreenLayout
      scroll={false}
      contentStyle={
        styles.screenContent
      }
    >
      <SectionList
        style={styles.list}
        sections={sections}
        keyExtractor={
          item => item.id
        }
        renderItem={({
          item,
        }) => (
          <TimelineCard
            item={item}
          />
        )}
        renderSectionHeader={({
          section,
        }) => (
          <View
            style={
              styles.sectionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                {section.title}
              </Text>
              {section.title !==
              section.subtitle ? (
                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  {section.subtitle}
                </Text>
              ) : null}
            </View>
            <View
              style={
                styles.sectionCountBadge
              }
            >
              <Text
                style={
                  styles.sectionCountText
                }
              >
                {section.data.length}
              </Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          renderHeader
        }
        ListEmptyComponent={
          renderEmpty
        }
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContent
        }
        SectionSeparatorComponent={() => (
          <View
            style={
              styles.sectionSeparator
            }
          />
        )}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={8}
      />
    </ScreenLayout>
  );
}
const styles =
  StyleSheet.create({
    screenContent: {
      paddingBottom: 0,
    },

    list: {
      flex: 1,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: 140,
    },
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
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
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
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginHorizontal: -20,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 9,
      backgroundColor:
        "#EEF2F8",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#111827",
    },
    sectionSubtitle: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "600",
      color: "#6B7280",
    },
    sectionCountBadge: {
      minWidth: 28,
      height: 28,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 14,
      backgroundColor:
        "#E0E7FF",
      paddingHorizontal: 8,
    },
    sectionCountText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#4338CA",
    },
    sectionSeparator: {
      height: 8,
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
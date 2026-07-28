import React, { useEffect, } from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useFeedingStore, } from "../../store/FeedingStore";
import { useDashboardStore } from "../../store/DashboardStore";
import FeedingCard from "../../components/cards/FeedingCard";
import { getDateLabel } from "../../utils/dateUtils";

export default function FeedingScreen({
  navigation,
}: any) {

  const {
    feedings,
    loadFeedings,
    deleteFeeding,
  }=useFeedingStore();
  const {
    todayFeedings,
    todayQuantity,
    lastFeeding,
    refresh,
  } = useDashboardStore();
  const groupedFeedings = feedings.reduce(
    (groups: Record<string, typeof feedings>, feeding) => {
      const key = getDateLabel(feeding.time);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(feeding);
      return groups;
    },
    {}
  );

  useEffect(() => {
    loadFeedings();
  }, []);

  return (
    <ScreenLayout>

      <ScreenTitle
        title="Feeding"
        icon="🍼"
      />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Feeding Summary
        </Text>
        <View style={styles.summaryRow}>
          <Text>Today's Feedings</Text>
          <Text>{todayFeedings}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Total Quantity</Text>
          <Text>{todayQuantity} ml</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Last Feeding</Text>
          <Text>{lastFeeding ?? "--"}</Text>
        </View>
      </View>

      {Object.entries(groupedFeedings).map(
        ([date, items]) => (
          <View key={date}>
            <Text style={styles.sectionTitle}>
              {date}
            </Text>
            {items.map(feed => (
              <FeedingCard
                key={feed.id}
                feeding={feed}
                onDelete={async () => {
                  await deleteFeeding(feed.id!);
                  refresh();
                }}
              />
            ))}

          </View>
        )
      )}

      <PrimaryButton
        title="+ Add Feeding"
        onPress={() =>
            navigation.navigate("AddFeeding")
        }
      />

    </ScreenLayout>
  );
}

const styles = StyleSheet.create({

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
    marginTop: 10,
  },

});
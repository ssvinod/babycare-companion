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
  const { refresh } = useDashboardStore();
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

const styles = StyleSheet.create ({
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
    marginTop: 10,
  },
});
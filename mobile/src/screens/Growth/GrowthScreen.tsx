import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import GrowthCard from "../../components/cards/GrowthCard";
import { useGrowthStore } from "../../store/GrowthStore";
import { getDateLabel } from "../../utils/dateUtils";
export default function GrowthScreen({
  navigation,
}: any) {
  const {
    growths,
    loadGrowths,
    deleteGrowth,
  } = useGrowthStore();
  useEffect(() => {
    loadGrowths();
  }, []);
  const grouped = growths.reduce(
    (
      groups: Record<string, typeof growths>,
      item
    ) => {
      const key = getDateLabel(item.date);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {}
  );
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Growth"
        icon="📈"
      />
      {Object.entries(grouped).map(
        ([date, items]) => (
          <View key={date}>
            <Text style={styles.header}>
              {date}
            </Text>
            {items.map(item => (
              <GrowthCard
                key={item.id}
                growth={item}
                onDelete={() =>
                  deleteGrowth(item.id!)
                }
              />
            ))}
          </View>
        )
      )}
      <PrimaryButton
        title="+ Add Growth"
        onPress={() =>
          navigation.navigate("AddGrowth")
        }
      />
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  header: {
    fontWeight: "700",
    color: "#6B7280",
    marginVertical: 10,
  },
});
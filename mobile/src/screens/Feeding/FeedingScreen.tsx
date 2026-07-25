import React, {
  useEffect,
} from "react";

import {
  View,
  Text,
} from "react-native";

import ScreenLayout
from "../../components/common/ScreenLayout";

import ScreenTitle
from "../../components/common/ScreenTitle";

import PrimaryButton
from "../../components/common/PrimaryButton";

import {
  useFeedingStore,
} from "../../store/FeedingStore";
import { useDashboardStore } from "../../store/DashboardStore";
import FeedingCard from "../../components/cards/FeedingCard";

export default function FeedingScreen({
  navigation,
}: any) {

  const {
    feedings,
    loadFeedings,
    deleteFeeding,
  }=useFeedingStore();
  const { refresh } = useDashboardStore();

  useEffect(() => {
    loadFeedings();
  }, []);

  return (
    <ScreenLayout>

      <ScreenTitle
        title="Feeding"
        icon="🍼"
      />

      {feedings.map(feed=>(
        <FeedingCard
          key={feed.id}
          feeding={feed}
          onDelete={async () => {
            await deleteFeeding(feed.id!);
            refresh();
          }}
        />
      ))}

      <PrimaryButton
        title="+ Add Feeding"
        onPress={() =>
            navigation.navigate("AddFeeding")
        }
      />

    </ScreenLayout>
  );
}
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import GrowthCard from "../../components/cards/GrowthCard";
import { useGrowthStore } from "../../store/GrowthStore";
export default function GrowthScreen() {
  const navigation = useNavigation<any>();
  const {
    growths,
    loadGrowths,
    deleteGrowth,
  } = useGrowthStore();
  useFocusEffect(
    useCallback(() => {
      void loadGrowths();
    }, [loadGrowths])
  );
  const confirmDelete = (
    id: number | undefined
  ) => {
    if (id === undefined) {
      return;
    }
    Alert.alert(
      "Delete growth record?",
      "This measurement will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteGrowth(id);
          },
        },
      ]
    );
  };
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Growth"
        icon="📈"
      />
      <PrimaryButton
        title="+ Add Growth"
        onPress={() =>
          navigation.navigate("AddGrowth")
        }
      />
      <FlatList
        scrollEnabled={false}
        data={growths}
        keyExtractor={(item) =>
          String(item.id)
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No growth records yet.
          </Text>
        }
        renderItem={({ item }) => (
          <GrowthCard
            growth={item}
            onEdit={() =>
              navigation.navigate(
                "EditGrowth",
                {
                  growth: item,
                }
              )
            }
            onDelete={() =>
              confirmDelete(item.id)
            }
          />
        )}
      />
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  empty: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});
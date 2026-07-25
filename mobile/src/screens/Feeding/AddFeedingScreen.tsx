import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useFeedingStore } from "../../store/FeedingStore";
export default function AddFeedingScreen({ navigation }: any) {
  const { addFeeding } = useFeedingStore();
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  async function save() {
    await addFeeding({
      time: new Date().toISOString(),
      type,
      quantity: Number(quantity),
      notes: "",
    });
    navigation.goBack();
  }
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Add Feeding"
        icon="🍼"
      />
      <TextInput
        style={styles.input}
        placeholder="Type (Formula / Breastfeeding)"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (ml)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <PrimaryButton
        title="Save Feeding"
        onPress={save}
      />
    </ScreenLayout>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
  },
});
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        console.log("PRIMARY BUTTON PRESSED");
        onPress();
      }}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4F6EF7",
    marginTop: 24,
    marginBottom: 24,
  },

  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

interface Props {
  title: string;
  progress: number;
  color: string;
}

export default function ProgressRingCard({
  title,
  progress,
  color,
}: Props) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.circle,
          {
            borderColor: color,
          },
        ]}
      >
        <Text style={styles.percent}>
          {progress}%
        </Text>
      </View>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,

    justifyContent: "center",
    alignItems: "center",
  },

  percent: {
    fontWeight: "700",
    fontSize: 16,
  },

  title: {
    marginTop: 14,
    fontWeight: "600",
  },
});
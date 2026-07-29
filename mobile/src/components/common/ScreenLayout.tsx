import React, { ReactNode } from "react";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface Props {
  children: ReactNode;
  scroll?: boolean;
}

export default function ScreenLayout({
  children,
  scroll = true,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.container,
            styles.content,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EEF2F8",
  },

  container: {
    flex: 1,
    backgroundColor: "#EEF2F8",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
});
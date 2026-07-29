import React, {
  ReactNode,
} from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
interface Props {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}
export default function ScreenLayout({
  children,
  scroll = true,
  contentStyle,
}: Props) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      {scroll ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.scrollContent,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.container,
            styles.fixedContent,
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        "#EEF2F8",
    },
    container: {
      flex: 1,
      backgroundColor:
        "#EEF2F8",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 100,
    },
    fixedContent: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 0,
    },
  });
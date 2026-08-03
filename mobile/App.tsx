import React, {
  useEffect,
  useState,
} from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  initDatabase,
} from "./src/database/initDatabase";
import {
  configureMedicationNotifications,
} from "./src/services/MedicationNotificationService";
import {
  useBabyStore,
} from "./src/store/BabyStore";
type StartupState =
  | "loading"
  | "ready"
  | "error";
const MINIMUM_STARTUP_TIME_MS =
  2500;
export default function App() {
  const [
    startupState,
    setStartupState,
  ] = useState<StartupState>(
    "loading"
  );
  const [
    startupError,
    setStartupError,
  ] = useState<string | null>(
    null
  );
  async function initialiseApp() {
    const startedAt =
      Date.now();
    try {
      setStartupState(
        "loading"
      );
      setStartupError(
        null
      );
      await initDatabase();
      await useBabyStore
        .getState()
        .loadBaby();
      await configureMedicationNotifications();
      const elapsed =
        Date.now() -
        startedAt;
      const remaining =
        Math.max(
          0,
          MINIMUM_STARTUP_TIME_MS -
            elapsed
        );
      if (remaining > 0) {
        await new Promise<void>(
          resolve => {
            setTimeout(
              resolve,
              remaining
            );
          }
        );
      }
      setStartupState(
        "ready"
      );
    } catch (error) {
      console.error(
        "App initialization failed:",
        error
      );
      setStartupError(
        error instanceof Error
          ? error.message
          : "Unknown startup error"
      );
      setStartupState(
        "error"
      );
    }
  }
  useEffect(() => {
    void initialiseApp();
  }, []);
  if (
    startupState === "loading"
  ) {
    return (
      <ImageBackground
        source={require(
          "./assets/niva-startup.png"
        )}
        style={
          styles.startupBackground
        }
        resizeMode="cover"
      />
    );
  }
  if (
    startupState === "error"
  ) {
    return (
      <SafeAreaView
        style={styles.errorSafe}
      >
        <View
          style={styles.errorContent}
        >
          <Text
            style={styles.errorIcon}
          >
            ⚠️
          </Text>
          <Text
            style={styles.errorTitle}
          >
            Unable to start Niva
          </Text>
          <Text
            style={
              styles.errorMessage
            }
          >
            {startupError ??
              "The app could not be initialized."}
          </Text>
          <Pressable
            onPress={() => {
              void initialiseApp();
            }}
            style={({ pressed }) => [
              styles.retryButton,
              pressed &&
                styles.retryButtonPressed,
            ]}
          >
            <Text
              style={
                styles.retryButtonText
              }
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  return <AppNavigator />;
}
const styles =
  StyleSheet.create({
    startupBackground: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor:
        "#FFFDF8",
    },
    errorSafe: {
      flex: 1,
      backgroundColor:
        "#FFFDF8",
    },
    errorContent: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      paddingHorizontal: 28,
    },
    errorIcon: {
      fontSize: 48,
    },
    errorTitle: {
      marginTop: 16,
      fontSize: 22,
      fontWeight: "900",
      color: "#111827",
    },
    errorMessage: {
      marginTop: 10,
      textAlign: "center",
      fontSize: 14,
      lineHeight: 21,
      color: "#6B7280",
    },
    retryButton: {
      marginTop: 22,
      borderRadius: 14,
      backgroundColor:
        "#079669",
      paddingHorizontal: 22,
      paddingVertical: 12,
    },
    retryButtonPressed: {
      opacity: 0.75,
    },
    retryButtonText: {
      fontSize: 15,
      fontWeight: "800",
      color: "#FFFFFF",
    },
  });
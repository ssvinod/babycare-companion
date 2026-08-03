import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
const BUTTON_DELAY_MS = 250;
export default function WelcomeScreen({
  navigation,
}: any) {
  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;
  const [
    buttonVisible,
    setButtonVisible,
  ] = useState(false);
  useEffect(() => {
    const timer =
      setTimeout(() => {
        setButtonVisible(
          true
        );
        Animated.timing(
          opacity,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver:
              true,
          }
        ).start();
      }, BUTTON_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [opacity]);
  return (
    <ImageBackground
      source={require(
        "../../../assets/niva-startup.png"
      )}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView
        style={styles.safe}
      >
        <View
          style={styles.content}
        >
          <View
            style={styles.spacer}
          />
          {buttonVisible ? (
            <Animated.View
              style={[
                styles.actionArea,
                {
                  opacity,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Get started"
                onPress={() =>
                  navigation.navigate(
                    "Setup"
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.button,
                  pressed &&
                    styles.buttonPressed,
                ]}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Get Started
                </Text>
              </Pressable>
              <Text
                style={
                  styles.privacyText
                }
              >
                Your baby's information
                stays locally on this
                device.
              </Text>
            </Animated.View>
          ) : null}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles =
  StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor:
        "#FFFDF8",
    },
    safe: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent:
        "space-between",
      paddingHorizontal: 26,
      paddingBottom: 22,
    },
    spacer: {
      flex: 1,
    },
    actionArea: {
      paddingTop: 14,
    },
    button: {
      minHeight: 56,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 18,
      backgroundColor:
        "#079669",
      shadowColor: "#065F46",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      elevation: 5,
    },
    buttonPressed: {
      opacity: 0.82,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    privacyText: {
      marginTop: 12,
      textAlign: "center",
      fontSize: 12,
      lineHeight: 17,
      color: "#60756D",
    },
  });
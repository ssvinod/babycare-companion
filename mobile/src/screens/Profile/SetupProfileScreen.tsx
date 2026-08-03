import React, {
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import DateInput from "../../components/common/DateInput";
import { useBabyStore } from "../../store/BabyStore";
type Gender =
  | "boy"
  | "girl";
export default function SetupProfileScreen() {
  const setBaby =
    useBabyStore(
      state => state.setBaby
    );
  const [name, setName] =
    useState("");
  const [
    birthDate,
    setBirthDate,
  ] = useState("");
  const [
    gender,
    setGender,
  ] = useState<
    Gender | null
  >(null);
  const [
    weight,
    setWeight,
  ] = useState("");
  const [
    height,
    setHeight,
  ] = useState("");
  const [
    saving,
    setSaving,
  ] = useState(false);
  async function save() {
    const trimmedName =
      name.trim();
    if (!trimmedName) {
      Alert.alert(
        "Baby name required",
        "Please enter the baby's name."
      );
      return;
    }
    if (!birthDate) {
      Alert.alert(
        "Date of birth required",
        "Enter a valid date using DD-MM-YYYY."
      );
      return;
    }
    const selectedDate =
      new Date(
        `${birthDate}T00:00:00`
      );
    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      Alert.alert(
        "Invalid date of birth",
        "Enter a valid date using DD-MM-YYYY."
      );
      return;
    }
    if (
      selectedDate.getTime() >
      Date.now()
    ) {
      Alert.alert(
        "Invalid date of birth",
        "The date of birth cannot be in the future."
      );
      return;
    }
    if (!gender) {
      Alert.alert(
        "Gender required",
        "Please select Boy or Girl."
      );
      return;
    }
    const parsedWeight =
      weight.trim() === ""
        ? undefined
        : Number(weight);
    const parsedHeight =
      height.trim() === ""
        ? undefined
        : Number(height);
    if (
      parsedWeight !== undefined &&
      (
        !Number.isFinite(
          parsedWeight
        ) ||
        parsedWeight <= 0
      )
    ) {
      Alert.alert(
        "Invalid weight",
        "Enter a valid weight or leave it blank."
      );
      return;
    }
    if (
      parsedHeight !== undefined &&
      (
        !Number.isFinite(
          parsedHeight
        ) ||
        parsedHeight <= 0
      )
    ) {
      Alert.alert(
        "Invalid height",
        "Enter a valid height or leave it blank."
      );
      return;
    }
    try {
      setSaving(true);
      await setBaby({
        id: "1",
        name: trimmedName,
        gender,
        birthDate,
        weight: parsedWeight,
        height: parsedHeight,
      });
    } catch (error) {
      console.error(
        "Unable to create profile:",
        error
      );
      Alert.alert(
        "Unable to create profile",
        "Please try again."
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <SafeAreaView
      style={styles.safe}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <View
            style={
              styles.brandSection
            }
          >
            <View
              style={
                styles.logoContainer
              }
            >
              <Text
                style={styles.logo}
              >
                👶
              </Text>
            </View>
            <Text
              style={
                styles.appName
              }
            >
              Niva 
            </Text>
            <Text
              style={
                styles.tagline
              }
            >
              Growing Healthy. Together.
            </Text>
          </View>
          <View
            style={styles.card}
          >
            <Text
              style={
                styles.title
              }
            >
              Create Baby Profile
            </Text>
            <Text
              style={
                styles.subtitle
              }
            >
              Add the basic details to
              begin tracking health,
              growth and care.
            </Text>
            <Text
              style={styles.label}
            >
              Baby Name *
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Example: Viha"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text
              style={styles.label}
            >
              Gender *
            </Text>
            <View
              style={
                styles.genderRow
              }
            >
              <Pressable
                onPress={() =>
                  setGender("boy")
                }
                style={[
                  styles.genderButton,
                  gender === "boy" &&
                    styles.selectedGenderButton,
                ]}
              >
                <Text
                  style={
                    styles.genderIcon
                  }
                >
                  👦
                </Text>
                <Text
                  style={[
                    styles.genderText,
                    gender === "boy" &&
                      styles.selectedGenderText,
                  ]}
                >
                  Boy
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  setGender("girl")
                }
                style={[
                  styles.genderButton,
                  gender === "girl" &&
                    styles.selectedGenderButton,
                ]}
              >
                <Text
                  style={
                    styles.genderIcon
                  }
                >
                  👧
                </Text>
                <Text
                  style={[
                    styles.genderText,
                    gender === "girl" &&
                      styles.selectedGenderText,
                  ]}
                >
                  Girl
                </Text>
              </Pressable>
            </View>
            <Text
              style={styles.label}
            >
              Date of Birth *
            </Text>
            <DateInput
              value={birthDate}
              onChange={
                setBirthDate
              }
            />
            <Text
              style={styles.helper}
            >
              Enter the date as
              DD-MM-YYYY. Hyphens are
              added automatically.
            </Text>
            <Text
              style={styles.label}
            >
              Birth Weight
            </Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={
                setWeight
              }
              placeholder="Optional, in kg"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            <Text
              style={styles.label}
            >
              Birth Height
            </Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={
                setHeight
              }
              placeholder="Optional, in cm"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
            <Pressable
              disabled={saving}
              onPress={() => {
                if (!saving) {
                  void save();
                }
              }}
              style={({ pressed }) => [
                styles.button,
                pressed &&
                  styles.buttonPressed,
                saving &&
                  styles.buttonDisabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Continue
                </Text>
              )}
            </Pressable>
          </View>
          <Text
            style={
              styles.privacyNote
            }
          >
            Your baby's information is
            stored locally on this
            device.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 50,
    },
    brandSection: {
      alignItems: "center",
      marginBottom: 26,
    },
    logoContainer: {
      width: 82,
      height: 82,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 26,
      backgroundColor:
        "#E0E7FF",
    },
    logo: {
      fontSize: 44,
    },
    appName: {
      marginTop: 16,
      fontSize: 29,
      fontWeight: "900",
      color: "#111827",
      textAlign: "center",
    },
    tagline: {
      marginTop: 7,
      fontSize: 16,
      fontWeight: "600",
      color: "#4F46E5",
    },
    card: {
      borderRadius: 24,
      backgroundColor:
        "#FFFFFF",
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "900",
      color: "#111827",
    },
    subtitle: {
      marginTop: 7,
      marginBottom: 6,
      fontSize: 14,
      lineHeight: 21,
      color: "#6B7280",
    },
    label: {
      marginTop: 18,
      marginBottom: 8,
      fontSize: 15,
      fontWeight: "800",
      color: "#374151",
    },
    input: {
      minHeight: 54,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 16,
      backgroundColor:
        "#F9FAFB",
      paddingHorizontal: 16,
      fontSize: 17,
      color: "#111827",
    },
    helper: {
      marginTop: -10,
      fontSize: 12,
      lineHeight: 17,
      color: "#6B7280",
    },
    genderRow: {
      flexDirection: "row",
      gap: 12,
    },
    genderButton: {
      flex: 1,
      minHeight: 82,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 17,
      backgroundColor:
        "#F9FAFB",
    },
    selectedGenderButton: {
      borderColor: "#4F46E5",
      backgroundColor:
        "#EEF2FF",
    },
    genderIcon: {
      marginRight: 8,
      fontSize: 25,
    },
    genderText: {
      fontSize: 16,
      fontWeight: "800",
      color: "#4B5563",
    },
    selectedGenderText: {
      color: "#4338CA",
    },
    button: {
      minHeight: 56,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 26,
      borderRadius: 16,
      backgroundColor:
        "#4F46E5",
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 17,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    privacyNote: {
      marginTop: 18,
      textAlign: "center",
      fontSize: 12,
      color: "#6B7280",
    },
  });
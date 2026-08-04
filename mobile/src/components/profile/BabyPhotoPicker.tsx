import React, {
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker
  from "expo-image-picker";
import {
  saveProfilePhoto,
} from "../../services/ProfilePhotoService";
interface Props {
  photo?: string;
  gender:
    | "boy"
    | "girl";
  onChange: (
    photo?: string
  ) => void;
}
export default function BabyPhotoPicker({
  photo,
  gender,
  onChange,
}: Props) {
  const [
    processing,
    setProcessing,
  ] = useState(false);
  const fallbackAvatar =
    gender === "boy"
      ? "👦"
      : "👧";
  async function handleResult(
    result:
      ImagePicker.ImagePickerResult
  ) {
    if (
      result.canceled ||
      !result.assets[0]
    ) {
      return;
    }
    try {
      setProcessing(true);
      const savedUri =
        saveProfilePhoto(
          result.assets[0].uri
        );
      onChange(savedUri);
    } catch (error) {
      console.error(
        "Unable to save profile photo:",
        error
      );
      Alert.alert(
        "Unable to save photo",
        "The selected photo could not be saved."
      );
    } finally {
      setProcessing(false);
    }
  }
  async function takePhoto() {
    const permission =
      await ImagePicker
        .requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Camera permission required",
        "Allow camera access to take a baby profile photo."
      );
      return;
    }
    const result =
      await ImagePicker
        .launchCameraAsync({
          mediaTypes: [
            "images",
          ],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          cameraType:
            ImagePicker
              .CameraType
              .back,
        });
    await handleResult(
      result
    );
  }
  async function choosePhoto() {
    const permission =
      await ImagePicker
        .requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo permission required",
        "Allow photo access to choose a baby profile photo."
      );
      return;
    }
    const result =
      await ImagePicker
        .launchImageLibraryAsync({
          mediaTypes: [
            "images",
          ],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
    await handleResult(
      result
    );
  }
  function showOptions() {
    const buttons:
      Parameters<
        typeof Alert.alert
      >[2] = [
        {
          text:
            "Take Photo",
          onPress: () => {
            void takePhoto();
          },
        },
        {
          text:
            "Choose from Library",
          onPress: () => {
            void choosePhoto();
          },
        },
      ];
    if (photo) {
      buttons.push({
        text:
          "Remove Photo",
        style:
          "destructive",
        onPress: () =>
          onChange(
            undefined
          ),
      });
    }
    buttons.push({
      text: "Cancel",
      style: "cancel",
    });
    Alert.alert(
      "Baby Profile Photo",
      "Choose how you want to update the photo.",
      buttons
    );
  }
  return (
    <View
      style={styles.container}
    >
      <Pressable
        disabled={processing}
        onPress={showOptions}
        style={({ pressed }) => [
          styles.avatarButton,
          pressed &&
            styles.avatarPressed,
        ]}
      >
        {photo ? (
          <Image
            source={{
              uri: photo,
            }}
            style={styles.photo}
          />
        ) : (
          <View
            style={
              styles.fallback
            }
          >
            <Text
              style={
                styles.fallbackText
              }
            >
              {fallbackAvatar}
            </Text>
          </View>
        )}
        <View
          style={
            styles.cameraBadge
          }
        >
          {processing ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.cameraIcon
              }
            >
              📷
            </Text>
          )}
        </View>
      </Pressable>
      <Pressable
        disabled={processing}
        onPress={showOptions}
      >
        <Text
          style={
            styles.actionText
          }
        >
          {photo
            ? "Change Photo"
            : "Add Photo"}
        </Text>
      </Pressable>
      <Text
        style={styles.helper}
      >
        Stored privately on this
        device
      </Text>
    </View>
  );
}
const styles =
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginBottom: 10,
    },
    avatarButton: {
      position: "relative",
      width: 112,
      height: 112,
      borderRadius: 56,
    },
    avatarPressed: {
      opacity: 0.82,
    },
    photo: {
      width: 112,
      height: 112,
      borderRadius: 56,
      borderWidth: 3,
      borderColor:
        "#FFFFFF",
    },
    fallback: {
      width: 112,
      height: 112,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 56,
      borderWidth: 3,
      borderColor:
        "#FFFFFF",
      backgroundColor:
        "#D1FAE5",
    },
    fallbackText: {
      fontSize: 56,
    },
    cameraBadge: {
      position: "absolute",
      right: 1,
      bottom: 2,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent:
        "center",
      borderRadius: 18,
      borderWidth: 3,
      borderColor:
        "#FFFFFF",
      backgroundColor:
        "#079669",
    },
    cameraIcon: {
      fontSize: 16,
    },
    actionText: {
      marginTop: 10,
      fontSize: 15,
      fontWeight: "800",
      color: "#079669",
    },
    helper: {
      marginTop: 3,
      fontSize: 12,
      color: "#6B7280",
    },
  });
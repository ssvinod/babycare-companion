import React, {
  useCallback,
} from "react";
import {
  useFocusEffect,
} from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenTitle from "../../components/common/ScreenTitle";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileRow from "../../components/profile/ProfileRow";
import { useBabyStore } from "../../store/BabyStore";
export default function SettingsScreen({
  navigation,
}: any) {
  const {
    baby,
    loadBaby,
  } = useBabyStore();
  useFocusEffect(
    useCallback(() => {
      loadBaby();
    }, [loadBaby])
  );
  if (!baby) {
    return null;
  }
  return (
    <ScreenLayout>
      <ScreenTitle
        title="Profile"
        icon="👶"
      />
      <ProfileHeader baby={baby} />
      <ProfileRow
        icon="✏️"
        title="Edit Baby Profile"
        subtitle="Update name, date of birth, gender and blood group"
        onPress={() =>
          navigation.navigate(
            "EditBabyProfile"
          )
        }
      />
      <ProfileRow
        icon="📈"
        title="Growth History"
        subtitle="View weight, height and head-circumference records"
        onPress={() =>
          navigation.navigate(
            "GrowthHistory"
          )
        }
      />
      <ProfileRow
        icon="💉"
        title="Vaccination History"
        subtitle="View upcoming and completed vaccinations"
        onPress={() =>
          navigation.navigate(
            "VaccinationDetails"
          )
        }
      />
      <ProfileRow
        icon="💊"
        title="Medication"
        subtitle="Track medicines and dosage information"
        onPress={() =>
          navigation.navigate(
            "Medication"
          )
        }
      />
      <ProfileRow
        icon="💾"
        title="Backup Data"
        subtitle="Coming soon"
        disabled
        showArrow={false}
      />
      <ProfileRow
        icon="📄"
        title="Export Health Report"
        subtitle="Coming soon"
        disabled
        showArrow={false}
      />
      <ProfileRow
        icon="ℹ️"
        title="About BabyCare Companion"
        subtitle="App information and version details"
        disabled
        showArrow={false}
      />
    </ScreenLayout>
  );
}
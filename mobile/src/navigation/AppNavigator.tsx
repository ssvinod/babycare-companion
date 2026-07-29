import React, {
  useEffect,
} from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import SetupProfileScreen from "../screens/Profile/SetupProfileScreen";
import EditBabyProfileScreen from "../screens/Profile/EditBabyProfileScreen";
import AddFeedingScreen from "../screens/Feeding/AddFeedingScreen";
import FeedingScreen from "../screens/Feeding/FeedingScreen";
import AddGrowthScreen from "../screens/Growth/AddGrowthScreen";
import AddMedicationScreen from "../screens/Medication/AddMedicationScreen";
import GrowthScreen from "../screens/Growth/GrowthScreen";
import EditGrowthScreen from "../screens/Growth/EditGrowthScreen";
import VaccinationScreen from "../screens/Vaccination/VaccinationScreen";
import SleepScreen from "../screens/Sleep/SleepScreen";
import MedicationScreen from "../screens/Medication/MedicationScreen";
import ScanScreen from "../screens/Scan/ScanScreen";
import EditMedicationScreen from "../screens/Medication/EditMedicationScreen";
import { useBabyStore } from "../store/BabyStore";
const Stack =
  createNativeStackNavigator();
export default function AppNavigator() {
  const {
    baby,
    loading,
    loadBaby,
  } = useBabyStore();
  useEffect(() => {
    loadBaby();
  }, [loadBaby]);
  if (loading) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        {!baby ? (
          <Stack.Screen
            name="Setup"
            component={SetupProfileScreen}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={BottomTabs}
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="EditBabyProfile"
              component={EditBabyProfileScreen}
            />
            <Stack.Screen
              name="FeedingRecords"
              component={FeedingScreen}
            />
            <Stack.Screen
              name="AddFeeding"
              component={AddFeedingScreen}
            />
            <Stack.Screen
              name="AddGrowth"
              component={AddGrowthScreen}
            />
            <Stack.Screen
              name="EditGrowth"
              component={EditGrowthScreen}
            />
            <Stack.Screen
              name="GrowthHistory"
              component={GrowthScreen}
            />
            <Stack.Screen
              name="SleepDetails"
              component={SleepScreen}
            />
            <Stack.Screen
              name="VaccinationDetails"
              component={VaccinationScreen}
            />
            <Stack.Screen
              name="Medication"
              component={MedicationScreen}
            />
            <Stack.Screen
              name="AddMedication"
              component={AddMedicationScreen}
            />
            <Stack.Screen
              name="EditMedication"
              component={EditMedicationScreen}
            />
            <Stack.Screen
              name="Scan"
              component={ScanScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
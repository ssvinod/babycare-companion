import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import SetupProfileScreen from "../screens/Profile/SetupProfileScreen";
import AddFeedingScreen from "../screens/Feeding/AddFeedingScreen";

import { useBabyStore } from "../store/BabyStore";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const {
    baby,
    loading,
    loadBaby,
  } = useBabyStore();

  useEffect(() => {
    loadBaby();
  }, []);

  if (loading) return null;

  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        {baby ? (

          <>
            <Stack.Screen
              name="Main"
              component={BottomTabs}
            />

            <Stack.Screen
              name="AddFeeding"
              component={AddFeedingScreen}
            />
          </>

        ) : (

          <Stack.Screen
            name="Setup"
            component={SetupProfileScreen}
          />

        )}

      </Stack.Navigator>

    </NavigationContainer>

  );
}
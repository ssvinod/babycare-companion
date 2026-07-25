import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import FeedingScreen from "../screens/Feeding/FeedingScreen";
import SleepScreen from "../screens/Sleep/SleepScreen";
import GrowthScreen from "../screens/Growth/GrowthScreen";
import VaccinationScreen from "../screens/Vaccination/VaccinationScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#4F46E5",

        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
        },

        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = "ellipse";

          switch (route.name) {
            case "Home":
              icon = "home";
              break;

            case "Feeding":
              icon = "restaurant";
              break;

            case "Sleep":
              icon = "moon";
              break;

            case "Growth":
              icon = "bar-chart";
              break;

            case "Vaccination":
              icon = "shield-checkmark";
              break;

            case "Profile":
              icon = "person-circle";
              break;
          }

          return (
            <Ionicons
              name={icon}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Feeding"
        component={FeedingScreen}
      />

      <Tab.Screen
        name="Sleep"
        component={SleepScreen}
      />

      <Tab.Screen
        name="Growth"
        component={GrowthScreen}
      />

      <Tab.Screen
        name="Vaccination"
        component={VaccinationScreen}
      />

      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
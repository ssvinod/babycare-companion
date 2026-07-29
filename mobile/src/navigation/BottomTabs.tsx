import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  Ionicons,
} from "@expo/vector-icons";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import TimelineScreen from "../screens/Timeline/TimelineScreen";
import RecordsScreen from "../screens/Records/RecordsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
const Tab = createBottomTabNavigator();
type AddAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};
const ADD_ACTIONS: AddAction[] = [
  {
    label: "Add Feed",
    icon: "restaurant",
    route: "AddFeeding",
  },
  {
    label: "Add Sleep",
    icon: "moon",
    route: "SleepDetails",
  },
  {
    label: "Add Growth",
    icon: "bar-chart",
    route: "AddGrowth",
  },
  {
    label: "Add Medication",
    icon: "medkit",
    route: "AddMedication",
  },
  {
    label: "Record Vaccination",
    icon: "shield-checkmark",
    route: "VaccinationDetails",
  },
  {
    label: "Scan Document",
    icon: "scan",
    route: "Scan",
  },
];
function EmptyAddScreen() {
  return null;
}
function AddTabButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add record"
      onPress={onOpen}
      style={({ pressed }) => [
        styles.addButtonWrapper,
        pressed && styles.addButtonPressed,
      ]}
    >
      <View style={styles.addButton}>
        <Ionicons
          name="add"
          size={32}
          color="#FFFFFF"
        />
      </View>
      <Text style={styles.addButtonLabel}>
        Add
      </Text>
    </Pressable>
  );
}
export default function BottomTabs({
  navigation,
}: any) {
  const [isAddOpen, setIsAddOpen] =
    useState(false);
  const closeAdd = () => {
    setIsAddOpen(false);
  };
  const openRoute = (route: string) => {
    closeAdd();
    navigation.navigate(route);
  };
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#4F46E5",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({
            color,
            size,
            focused,
          }) => {
            let icon: keyof typeof Ionicons.glyphMap =
              "ellipse";
            switch (route.name) {
              case "Home":
                icon = focused
                  ? "home"
                  : "home-outline";
                break;
              case "Timeline":
                icon = focused
                  ? "time"
                  : "time-outline";
                break;
              case "Records":
                icon = focused
                  ? "folder-open"
                  : "folder-open-outline";
                break;
              case "Profile":
                icon = focused
                  ? "person-circle"
                  : "person-circle-outline";
                break;
            }
            return (
              <Ionicons
                name={icon}
                size={size}
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
          name="Timeline"
          component={TimelineScreen}
        />
        <Tab.Screen
          name="Add"
          component={EmptyAddScreen}
          listeners={{
            tabPress: event => {
              event.preventDefault();
              setIsAddOpen(true);
            },
          }}
          options={{
            tabBarButton: () => (
              <AddTabButton
                onOpen={() =>
                  setIsAddOpen(true)
                }
              />
            ),
          }}
        />
        <Tab.Screen
          name="Records"
          component={RecordsScreen}
        />
        <Tab.Screen
          name="Profile"
          component={SettingsScreen}
        />
      </Tab.Navigator>
      <Modal
        visible={isAddOpen}
        transparent
        animationType="fade"
        onRequestClose={closeAdd}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={closeAdd}
        >
          <Pressable
            style={styles.sheet}
            onPress={event =>
              event.stopPropagation()
            }
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Add Record
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={closeAdd}
                hitSlop={12}
              >
                <Ionicons
                  name="close"
                  size={26}
                  color="#374151"
                />
              </Pressable>
            </View>
            <View style={styles.actionGrid}>
              {ADD_ACTIONS.map(action => (
                <Pressable
                  key={action.label}
                  onPress={() =>
                    openRoute(action.route)
                  }
                  style={({ pressed }) => [
                    styles.actionCard,
                    pressed &&
                      styles.actionCardPressed,
                  ]}
                >
                  <View
                    style={
                      styles.actionIconContainer
                    }
                  >
                    <Ionicons
                      name={action.icon}
                      size={26}
                      color="#4F46E5"
                    />
                  </View>
                  <Text
                    style={styles.actionLabel}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  addButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -20,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },
  addButtonLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  actionCard: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  actionCardPressed: {
    opacity: 0.72,
  },
  actionIconContainer: {
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  actionLabel: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
});
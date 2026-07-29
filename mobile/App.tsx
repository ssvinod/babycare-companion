import {
  useEffect,
} from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/database/initDatabase";
import {
  configureMedicationNotifications,
} from "./src/services/MedicationNotificationService";
export default function App() {
  useEffect(() => {
    async function initialise() {
      await initDatabase();
      await configureMedicationNotifications();
    }
    void initialise();
  }, []);
  return <AppNavigator />;
}
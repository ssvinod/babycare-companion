import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/database/initDatabase";
import { db } from "./src/database/database";

console.log(
  "GROWTH SCHEMA:",
  db.getAllSync(`
    PRAGMA table_info(growth)
  `)
);
export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return <AppNavigator />;
}
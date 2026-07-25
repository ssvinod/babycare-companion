import { View, Text, StyleSheet } from "react-native";
import Colors from "../common/AppColors";
import Typography from "../common/AppTypography";
export default function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: Colors.subtitle,
    fontSize: Typography.body,
  },
});
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text variant="displaySmall" style={styles.title}>
          404
        </Text>
        <Text variant="titleLarge" style={styles.subtitle}>
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Button mode="contained" style={styles.button}>
            Go to home screen
          </Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
  },
});

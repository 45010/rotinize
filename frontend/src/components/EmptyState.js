import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, List, useTheme } from "react-native-paper";

export default function EmptyState({
  icon = "clipboard-text-outline",
  title,
  description,
  actionLabel,
  onAction,
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <List.Icon icon={icon} color={theme.colors.primary} style={{ margin: 0 }} />
      
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      
      {description && (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      )}

      {onAction && (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onAction}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {actionLabel}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 16,
  },
  title: {
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
  },
  button: {
    width: "70%",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
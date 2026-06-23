import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Checkbox, Text, useTheme } from "react-native-paper";
import CategoryChip from "./CategoryChip";

export default function TaskCard({
  title,
  subtitle,
  status,
  categoryId,
  themeColor,
  onPress,
}) {

  const theme = useTheme();
  const isDone = status === 2;

  return (
    <Card
      mode="elevated"
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Checkbox
          status={isDone ? "checked" : "unchecked"}
          onPress={onPress}
          color={themeColor}
        />
        
        <View style={styles.textContainer}>
          <Text
            variant="bodyLarge"
            style={{
              textDecorationLine: isDone ? "line-through" : "none",
              color: isDone ? theme.colors.outline : theme.colors.onSurface,
            }}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.outline }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {categoryId !== undefined && categoryId !== null && (
          <CategoryChip 
            categoryId={categoryId} 
            style={styles.chip} 
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  chip: {
    height: 26,
    alignSelf: "center",
  },
});
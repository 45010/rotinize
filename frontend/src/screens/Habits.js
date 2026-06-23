import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Button,
  useTheme,
  FAB,
  Card,
  Text,
  ActivityIndicator,
  IconButton,
  Menu,
} from "react-native-paper";

import Container from "../components/Container";
import AppHeader from "../components/AppHeader";
import FilterSelector from "../components/FilterSelector.js";
import EmptyState from "../components/EmptyState.js";
import CategoryChip from "../components/CategoryChip.js";
import { habitsService } from "../services/habitsService.js";

const HABIT_CATEGORIES = [
  { label: "Alimentação", value: "0" },
  { label: "Exercício físico", value: "1" },
  { label: "Estudos", value: "2" },
  { label: "Trabalho", value: "3" },
  { label: "Finanças", value: "4" },
  { label: "Casa", value: "5" },
  { label: "Saúde", value: "6" },
  { label: "Autocuidado", value: "7" },
  { label: "Social", value: "8" },
  { label: "Lazer", value: "9" },
  { label: "Outros", value: "10" },
];

const Habits = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showArchived, setShowArchived] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = {
      isActive: !showArchived,
      category: selectedCategory,
    };

    const result = await habitsService.getAll(params);

    if (result.success) {
      setHabits(result.data);
    } else {
      setError(result.error);
      Alert.alert("Erro", "Não foi possível carregar seus hábitos.");
    }

    setIsLoading(false);
  }, [showArchived, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();

      return () => {};
    }, [loadHabits])
  );

  const handleCardPress = (habitId) => {
    navigation.navigate("HabitDetails", { habitId: habitId });
  };

  const renderHabitCard = ({ item }) => (
      <Card 
        style={{ marginBottom: 18, opacity: showArchived ? 0.7 : 1 }} 
        onPress={() => handleCardPress(item.id)}
      >
        <Card.Title 
          title={item.name}
          titleStyle={{ fontWeight: "bold" }}
          subtitle={item.goalSummary}
          right={(props) => <IconButton {...props} icon="dots-vertical" iconColor={theme.colors.primary} onPress={() => handleCardPress(item.id)} />}
        />
        <Card.Content style={styles.card}>
          <CategoryChip
            style={{ marginRight: 10 }}
            categoryId={item.category}
          />
        </Card.Content>
      </Card>
  );

  return (
    <>
      <AppHeader title="Seus hábitos" />

      <FilterSelector
        categories={HABIT_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        isArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
      />

      {isLoading ? (
        <Container style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
        </Container>
      ) : error ? (
        <Container style={styles.center}>
          <Text style={{ marginBottom: 16 }}>Erro: {error}</Text>
          <Button mode="contained" onPress={loadHabits}>
            Tentar Novamente
          </Button>
        </Container>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={showArchived ? "archive-off" : "clipboard-edit-outline"}
          title={
            showArchived
              ? "Nenhum hábito arquivado."
              : selectedCategory !== null
              ? "Nenhum hábito nesta categoria."
              : "Sem hábitos por aqui."
          }
          description={
            !showArchived
              ? "Toque no botão abaixo para criar o primeiro."
              : null
          }
          actionLabel="Novo Hábito"
          onAction={
            !showArchived ? () => navigation.navigate("CreateHabit") : null
          }
        />
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabitCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!showArchived && habits.length > 0 && (
        <FAB
          icon="plus"
          style={styles.fabIcon}
          onPress={() => navigation.navigate("CreateHabit")}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  listContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 80,
  },
  card: {
    padding: 16,
    elevation: 2,
    rowGap: 8,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  fabContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  fabBig: {
    width: "70%",
  },
  fabIcon: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Habits;

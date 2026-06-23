import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { colors } from '../constants/colors.js';

import IndicatorCard from '../components/IndicatorItem.js';
import Container from '../components/Container';
import AppHeader from '../components/AppHeader';


// Dados estáticos para simulação
const MOCK_DATA = {
  habits: [
    { id: '1', name: 'Bem-estar', completed: 25, scheduled: 30, color: colors.secondaryBase},
    { id: '2', name: 'Saúde', completed: 18, scheduled: 20, color: colors.tertiaryBase},
    { id: '3', name: 'Educação', completed: 28, scheduled: 30, color: colors.primaryBase},
    { id: '4', name: 'Hobbies', completed: 30, scheduled: 30, color: '#3cac65ff'},
    { id: '5', name: 'Carreira', completed: 15, scheduled: 20, color: '#da7fc8ff'},
    { id: '6', name: 'Produtividade', completed: 10, scheduled: 30, color: '#f56868ff'},
  ],
};

const HabitConsistency = () => {
  const [consistencyRate, setConsistencyRate] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalScheduled, setTotalScheduled] = useState(0);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    // Simula o carregamento dos dados
    const { habits: habitData } = MOCK_DATA;
    setHabits(habitData);

    // Calcula os totais a partir dos hábitos individuais
    const completedSum = habitData.reduce((sum, habit) => sum + habit.completed, 0);
    const scheduledSum = habitData.reduce((sum, habit) => sum + habit.scheduled, 0);

    setTotalCompleted(completedSum);
    setTotalScheduled(scheduledSum);

    if (scheduledSum > 0) {
      const rate = (completedSum / scheduledSum) * 100;
      setConsistencyRate(rate);
    }
  }, []);

  // Componente para renderizar cada item da lista de hábitos
  const renderHabitItem = ({ item }) => {
    const habitRate = item.scheduled > 0 ? (item.completed / item.scheduled) * 100 : 0;

    return (
      <IndicatorCard
        name={item.name}
        indicatorRate={habitRate} 
        completed={item.completed} 
        scheduled={item.scheduled}
        color={item.color}
        backgroundColor={item.color} />
    );
  };

  return (
      <Container>
        <FlatList
          style={{ padding: 0 }}
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabitItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <>
              <Card style={{ marginTop: 15 }}>
                <View style={styles.card}>
                  <Text style={styles.title}>Consistência nos hábitos</Text>
                  <Text style={styles.description}>
                    Percentual de conclusão de todos os seus objetivos de
                    hábitos no mês.
                  </Text>

                  <View style={styles.indicatorContainer}>
                    <Text style={styles.percentage}>
                      {consistencyRate.toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.summary}>
                      <Text style={styles.summaryText}>
                        <Text style={styles.bold}>Concluídos:</Text>{" "}
                        {totalCompleted}
                      </Text>
                      <Text style={styles.summaryText}>
                        <Text style={styles.bold}>Programados:</Text>{" "}
                        {totalScheduled}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>

              <Text style={styles.listTitle}>Consistência por categoria</Text>
            </>
          }
        />
      </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 2,
    paddingBottom: 25,
    rowGap: 25,
  },
  card: {
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
  },
  indicatorContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#5EABE5",
    marginBottom: 25,
  },
  percentage: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5EABE5",
  },
  detailsContainer: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 15,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  summaryText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 35,
  },
});

export default HabitConsistency;
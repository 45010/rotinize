import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import {
  useTheme,
  Text,
  Card,
  ProgressBar,
  Avatar,
  ActivityIndicator,
  Portal,
  Dialog,
  TextInput,
  Button,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import AppHeader from "../components/AppHeader";
import TaskCard from "../components/TaskCard";
import { dashboardService } from "../services/dashboardService";
import { tasksService } from "../services/tasksService";
import { habitTasksService } from "../services/habitTasksService";

export default function TodayScreen({ navigation }) {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [completedQuantity, setCompletedQuantity] = useState(0);
  const [completedDuration, setCompletedDuration] = useState(new Date(2025, 0, 1, 0, 0, 0, 0));

  const loadDashboard = useCallback(async () => {
    const response = await dashboardService.getToday();
    if (response.success) {
      setData(response.data);
    } else {
      Alert.alert("Erro", response.error);
    }
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleToggleSingleTask = async (task) => {
    const newStatus = task.status === 0 ? 2 : 0;
    const response = await tasksService.update(task.id, {
      ...task,
      status: newStatus,
    });

    if (response.success) {
      await loadDashboard();
    } else {
      Alert.alert("Erro", response.error || "Não foi possível atualizar.");
    }
  };

  const handleOpenHabitTaskStatusModal = (habitTask) => {
    setSelectedTask(habitTask);

    if (habitTask.targetQuantity) setCompletedQuantity(habitTask.completedQuantity || 0);
    
    if (habitTask.targetDuration) {
      let duration = new Date(2025, 0, 1, 0, 0, 0, 0);
      if (habitTask.completedDuration) {
        const parts = habitTask.completedDuration.split(":");
        if (parts.length === 3) {
          duration.setHours(
            parseInt(parts[0]),
            parseInt(parts[1]),
            parseInt(parts[2])
          );
        }
      }

      setCompletedDuration(duration);
    }

    setIsModalVisible(true);
  }

  const handleUpdateHabitTaskStatus = async (habitTask) => {
    const payload = {};

    if (habitTask.metricType === 0) {
      payload.status = habitTask.status === 0 ? 2 : 0;
    } else if (habitTask.metricType === 1) {
      payload.completedQuantity = completedQuantity;
    } else if (habitTask.metricType === 2) {
      const durationString = `${String(completedDuration.getHours()).padStart(2, '0')}:${String(completedDuration.getMinutes()).padStart(2, '0')}:${String(completedDuration.getSeconds()).padStart(2, '0')}`;
      payload.completedDuration = durationString;
    }

    const response = await habitTasksService.updateStatus(habitTask.id, payload);

    if (response.success) {
      await loadDashboard();
      setIsModalVisible(false);
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível atualizar a tarefa."
      );
    }
  }

  const getHabitTaskGoalString = (habitTask) => {
    if (habitTask.targetQuantity) {
      return `Meta: ${habitTask.completedQuantity || 0}/${habitTask.targetQuantity} ${habitTask.quantityUnit}`;
    }
    if (habitTask.targetDuration) {
      return `Meta: ${habitTask.completedDuration || 0}/${habitTask.targetDuration}`;
    }
    return "Meta: Concluir";
  };

  const StatCard = ({ title, completed, total, color, icon }) => {
    const progress = total > 0 ? completed / total : 0;
    return (
      <Card style={[styles.statCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <View style={styles.statHeader}>
            <Avatar.Icon size={32} icon={icon} style={{ backgroundColor: color }} />
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {completed}/{total}
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ marginTop: 8, marginBottom: 4 }}>
            {title}
          </Text>
          <ProgressBar progress={progress} color={color} style={{ height: 6, borderRadius: 3 }} />
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Comece seu dia" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text variant="titleLarge" style={styles.dateHeader}>
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long", day: "numeric", month: "short",
          })}
        </Text>

        {data && (
          <View style={styles.statsRow}>
            <StatCard
              title="Hábitos"
              completed={data.habitTasksCompleted}
              total={data.habitTasksTotal}
              color={theme.colors.primary}
              icon="repeat"
            />
            <StatCard
              title="Tarefas"
              completed={data.singleTasksCompleted}
              total={data.singleTasksTotal}
              color={theme.colors.secondary}
              icon="check"
            />
          </View>
        )}

        {/* SEÇÃO ROTINA */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Rotina</Text>
        </View>

        {data?.habitTasks && data.habitTasks.length > 0 ? (
          data.habitTasks.map((habitTask) => (
            <TaskCard
              key={habitTask.id}
              title={habitTask.title}
              status={habitTask.status}
              categoryId={habitTask.category}
              subtitle={getHabitTaskGoalString(habitTask)}
              onPress={() => habitTask.metricType === 0 ? 
                handleUpdateHabitTaskStatus(habitTask) :
                handleOpenHabitTaskStatusModal(habitTask)
              }
              themeColor={theme.colors.primary}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum hábito agendado para hoje.</Text>
        )}

        {/* SEÇÃO PENDÊNCIAS */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Pendências</Text>
        </View>

        {data?.singleTasks && data.singleTasks.length > 0 ? (
          data.singleTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              status={task.status}
              categoryId={task.category}
              onPress={() => handleToggleSingleTask(task)}
              themeColor={theme.colors.secondary}
              subtitle={task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma tarefa pendente para hoje.</Text>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Portal>
        <Dialog
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <Dialog.Title>Atualizar Status</Dialog.Title>
          <Dialog.Content>

              {/* Tipo de métrica = Quantidade */}
                {selectedTask.metricType === 1 && (
                  <>
                    <TextInput
                      label="Quantidade concluída"
                      value={String(completedQuantity)}
                      keyboardType="numeric"
                      onChangeText={value => setCompletedQuantity(Number(value))}
                      right={<TextInput.Affix text={"/" + selectedTask.targetQuantity + " " + selectedTask.quantityUnit} />}
                    />
                  </>
                )}

                {/* Tipo de métrica = Duração */}
                {selectedTask.metricType === 2 && (
                  <>
                    <TextInput
                      label="Tempo concluído"
                      mode="outlined"
                      value={completedDuration.toLocaleTimeString()}
                      right={<TextInput.Affix text={"/" + selectedTask.targetDuration} />}
                      onFocus={() => { setShowTimePicker(true); }}
                    />
                    {showTimePicker && (
                      <DateTimePicker
                        value={completedDuration}
                        mode="time"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          setShowTimePicker(false);
                          if (selectedDate) {
                            setCompletedDuration(selectedDate);
                          }
                        }}
                      />
                    )}
                  </>
                )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsModalVisible(false)}>Cancelar</Button>
            <Button onPress={() => handleUpdateHabitTaskStatus(selectedTask)}>Atualizar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  scrollContent: { 
    padding: 16 
  },
  dateHeader: { 
    marginBottom: 16, 
    textTransform: "capitalize", 
    fontWeight: "300" 
  },
  statsRow: { 
    flexDirection: "row", 
    gap: 12, 
    marginBottom: 24 
  },
  statCard: { 
    flex: 1, 
    borderRadius: 12 
  },
  statHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 8 
  },
  sectionTitle: { 
    fontWeight: "bold", 
    fontSize: 18 
  },
  emptyText: { 
    fontStyle: "italic", 
    opacity: 0.6, 
    marginBottom: 8 
  },
});
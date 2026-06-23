import React, { useState, useEffect, useCallback } from "react";
import { Alert, View, ScrollView, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Button,
  ActivityIndicator,
  Text,
  FAB,
  Portal,
  List,
  useTheme,
  Divider,
  Chip,
  Card,
  Dialog,
  TextInput,
} from "react-native-paper";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

import Container from "../components/Container.js";
import HabitForm from "../components/HabitForm.js";
import { habitsService } from "../services/habitsService.js";
import { habitTasksService } from "../services/habitTasksService.js";

// --- Configuração do Calendário (PT-BR) ---
LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar','Abr','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'br';

const CATEGORY_MAP = {
  0: "Alimentação",
  1: "Exercício físico",
  2: "Estudos",
  3: "Trabalho",
  4: "Finanças",
  5: "Casa",
  6: "Saúde",
  7: "Autocuidado",
  8: "Social",
  9: "Lazer",
  10: "Outros",
};

const RECURRENCE_TYPE_MAP = {
  1: "por dia",
  2: "por semana",
  3: "por mês",
  4: "por ano",
};

const DAYS_MAP = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const HabitSummaryView = ({ habitData, markedDates, onDayPress, historyLoading, stats }) => {
  const theme = useTheme();

  const getCategoryName = (id) => CATEGORY_MAP[id] || "Sem Categoria";

  const formatGoal = () => {
    switch (habitData.metricType) {
      case 1:
        return `Meta: ${habitData.targetQuantity || 0} ${habitData.quantityUnit || ""}`;
      case 2:
        return `Meta: ${habitData.targetDuration || "00:00:00"}`;
      case 0:
      default:
        return "Meta: Sim ou Não";
    }
  };

  const formatRecurrence = () => {
    if (habitData.recurrenceType === 0) {
      const days = habitData.specificDays?.map((d) => DAYS_MAP[d]).join(", ") || "Nenhum";
      return `Dias específicos: ${days}`;
    } else {
      const interval = RECURRENCE_TYPE_MAP[habitData.recurrenceType] || "";
      return `Frequência: ${habitData.frequency || 0} vez(es) ${interval}`;
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Não definida";
  };

  return (
    <ScrollView contentContainerStyle={styles.summaryContainer} showsVerticalScrollIndicator={false}>
      <Text variant="headlineSmall" style={{alignItems: 'center'}}>
        {habitData.name}
        {!habitData.isActive && (
          <Chip disabled compact style={{ marginLeft: 10 }}>
            Arquivado
          </Chip>
        )}
      </Text>
      {habitData.description ? (
        <Text style={styles.summaryDescription}>{habitData.description}</Text>
      ) : null}

      <List.Section>
        <List.Subheader style={styles.summarySubheader}>
          Sobre o hábito
        </List.Subheader>
        <List.Item
          title="Categoria"
          description={getCategoryName(habitData.category)}
          left={() => <List.Icon icon="tag" color={theme.colors.primary} />}
        />
        <Divider></Divider>
        <List.Item
          title="Objetivo"
          description={formatGoal()}
          left={() => (
            <List.Icon icon="bullseye-arrow" color={theme.colors.secondary} />
          )}
        />
        <Divider></Divider>
        <List.Item
          title="Recorrência"
          description={formatRecurrence()}
          left={() => <List.Icon icon="repeat" color={theme.colors.tertiary} />}
        />
        <Divider></Divider>
        <List.Item
          title="Data de Início"
          description={formatDate(habitData.startDate)}
          left={() => (
            <List.Icon icon="calendar-start" color={theme.colors.primary} />
          )}
        />
        <Divider></Divider>
        {habitData.endDate && (
          <List.Item
            title="Data Final"
            description={formatDate(habitData.endDate)}
            left={() => (
              <List.Icon icon="calendar-end" color={theme.colors.secondary} />
            )}
          />
        )}
      </List.Section>

      <List.Section>
        <List.Subheader style={styles.summarySubheader}>Histórico de tarefas</List.Subheader>

          <List.Item
            title="Taxa de sucesso"
            description={`${stats?.rate || 0}% (${stats?.completed || 0}/${stats?.total || 0} tarefas)`}
            left={() => (
              <List.Icon icon="check-all" color={theme.colors.primary} />
            )}
          />
            {historyLoading ? (
                <ActivityIndicator animating={true} />
            ) : (
                <Card style={styles.card}>
                    <Calendar
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        theme={{
                            todayTextColor: theme.colors.secondary,
                            arrowColor: theme.colors.primary,
                            textDayFontWeight: '400',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: 'bold',
                        }}
                    />

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                            <Text variant="bodySmall">Concluído</Text>
                        </View>
                        <View style={styles.legendItem}>
                             <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
                             <Text variant="bodySmall">Pendente</Text>
                        </View>
                    </View>
                </Card>
            )}
      </List.Section>

    </ScrollView>
  );
};

const HabitDetails = ({ route, navigation }) => {
  const { habitId } = route.params;
  const theme = useTheme();

  const [habitData, setHabitData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const [tasksByDate, setTasksByDate] = useState({});

  const [stats, setStats] = useState({ rate: 0, completed: 0, total: 0 });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [completedQuantity, setCompletedQuantity] = useState(0);
  const [completedDuration, setCompletedDuration] = useState(new Date(2025, 0, 1, 0, 0, 0, 0));

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const isFocused = useIsFocused();

  const fetchHabit = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await habitsService.getById(habitId);

    if (result.success) {
      setHabitData(result.data);
    } else {
      setError(result.error);
      Alert.alert("Erro", "Não foi possível carregar os dados do hábito.");
    }

    setLoading(false);
  }, [habitId]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const response = await habitTasksService.getByHabitId(habitId);

    if (response.success) {
      const marks = {};
      const taskMap = {};
      const today = new Date().toISOString().split('T')[0];

      let completedCount = 0;
      let totalCount = 0;

      response.data.forEach((task) => {
        const dateKey = task.dueDate.split("T")[0];
        taskMap[dateKey] = task;

        if (task.status === 2) { // Concluído
          marks[dateKey] = {
            selected: true,
            selectedColor: theme.colors.primary,
          };
        } else if (dateKey <= today) { // Passado e pendente
             marks[dateKey] = {
               marked: true,
               dotColor: theme.colors.error,
             };
        }

        if (dateKey <= today) {
            totalCount++;
            if (task.status === 2) {
                completedCount++;
            }
        }
      });

      const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      setStats({ rate, completed: completedCount, total: totalCount });
      setMarkedDates(marks);
      setTasksByDate(taskMap);
    }
    setHistoryLoading(false);
  }, [habitId, theme.colors]);
  
  useEffect(() => {
    fetchHabit();
    loadHistory();
  }, [fetchHabit, loadHistory]);

  const handleDayPress = (day) => {
    const dateClicked = day.dateString;
    const task = tasksByDate[dateClicked];

    if (!task) {
      Alert.alert("Indisponível", "Não há tarefa registrada para este dia.");
      return;
    }

    console.log("Task for selected date:", task);
    setSelectedTask(task);
    if (task.targetQuantity) setCompletedQuantity(task.completedQuantity || 0);
    
    if (task.targetDuration) {
      let duration = new Date(2025, 0, 1, 0, 0, 0, 0);
      if (task.completedDuration) {
        const parts = task.completedDuration.split(":");
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
  };

const handleUpdateTaskStatus = async (task) => {
    const payload = {};

    if (task.metricType === 0) {
      payload.status = task.status === 0 ? 2 : 0;
    } else if (task.metricType === 1) {
      payload.completedQuantity = completedQuantity;
    } else if (task.metricType === 2) {
      const durationString = `${String(completedDuration.getHours()).padStart(2, '0')}:${String(completedDuration.getMinutes()).padStart(2, '0')}:${String(completedDuration.getSeconds()).padStart(2, '0')}`;
      payload.completedDuration = durationString;
    }

    const response = await habitTasksService.updateStatus(task.id, payload);

    if (response.success) {
      await loadHistory();
      await fetchHabit();
      setIsModalVisible(false);
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível atualizar a tarefa."
      );
    }
  }

  const handleToggleActive = async () => {
    const active = habitData.isActive ? false : true;

    const response = await habitsService.updateActive(habitId, active);
    if (response.success) {
      await fetchHabit();
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível atualizar a tarefa."
      );
    }
  };

  const executeDelete = async () => {
    setLoading(true);

    try {
      const result = await habitsService.delete(habitId);

      if (result.success) {
        navigation.navigate("Main");

        Alert.alert("Sucesso", "Hábito excluído com sucesso");
      } else {
        Alert.alert(
          "Erro ao excluir hábito",
          result.error || "Erro desconhecido"
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza de que deseja excluir esse hábito? Essa ação é irreversível e irá excluir todo o histórico de tarefas do hábito.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir hábito",
          onPress: () => executeDelete(),
          style: "destructive",
        },
      ]
    );
  };

  const handleUpdate = async (payload) => {
    setLoading(true);

    try {
      const result = await habitsService.update(habitId, payload);

      if (result.success) {
        Alert.alert("Sucesso", "Hábito atualizado com sucesso");
        setIsEditing(false);

        await fetchHabit();
      } else {
        Alert.alert(
          "Erro ao atualizar hábito",
          result.error || "Erro desconhecido"
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Erro: {error}</Text>
        <Button onPress={fetchHabit}>Tentar Novamente</Button>
      </Container>
    );
  }

  return (
    <Container>
      {isEditing ? (
        <HabitForm
          initialData={habitData}
          readOnly={!isEditing}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isLoading={loading}
          submitButtonText={isEditing ? "Salvar alterações" : "Editar"}
        />
      ) : (
        <HabitSummaryView 
          habitData={habitData} 
          markedDates={markedDates}
          onDayPress={handleDayPress}
          historyLoading={historyLoading}
          stats={stats}
        />
      )}

            <Portal>
        <Dialog
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
        >
          <Dialog.Title>Atualizar status</Dialog.Title>
          <Dialog.Content>

              {selectedTask.metricType === 0 && (
                  <>
                  {selectedTask.status === 2 ? (
                    <Text>Essa tarefa foi concluída. Atualizar o status para não concluída?</Text>
                    ) : (
                    <Text>Essa tarefa não foi concluída. Atualizar o status para concluída?</Text>
                    )}
                  </>
                  )    
              }
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
            <Button onPress={() => handleUpdateTaskStatus(selectedTask)}>Atualizar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{ padding: 16 }}>
        {!isEditing && (
          <View>
            <Portal>
              {habitData.isActive ? (
                <FAB.Group
                  open={open}
                  visible={isFocused}
                  icon={"pencil"}
                  style={{ bottom: 26 }}
                  actions={[
                    {
                      icon: "pencil",
                      label: "Editar",
                      onPress: () => setIsEditing(true),
                    },
                    {
                      icon: "archive-arrow-down",
                      label: "Arquivar",
                      onPress: () => handleToggleActive(),
                    },
                    {
                      icon: "trash-can",
                      label: "Excluir",
                      onPress: () => handleDelete(),
                    },
                  ]}
                  onStateChange={onStateChange}
                  onPress={() => {
                    if (open) {
                    }
                  }}
                />
              ) : (
                <FAB.Group
                  open={open}
                  visible={isFocused}
                  icon={"pencil"}
                  style={{ bottom: 26 }}
                  actions={[
                    {
                      icon: "archive-arrow-up",
                      label: "Desarquivar",
                      onPress: () => handleToggleActive(),
                    },
                    {
                      icon: "trash-can",
                      label: "Excluir",
                      onPress: () => handleDelete(),
                    },
                  ]}
                  onStateChange={onStateChange}
                  onPress={() => {
                    if (open) {
                    }
                  }}
                />
              )}
            </Portal>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  summaryContainer: {
    paddingTop: 20
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summarySubheader: {
    paddingInline: 0,
    fontSize: 14,
    fontWeight: 600,
  },
  summaryDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    padding: 8,
    backgroundColor: 'white',
    margin: 2,
    marginBottom: 60,
  },
  legendContainer: { 
    flexDirection: 'row', 
    marginTop: 16, 
    justifyContent: 'center', 
    gap: 16 },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 },
  dot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6 }
});

export default HabitDetails;

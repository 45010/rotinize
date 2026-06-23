import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import {
  Button,
  Card,
  RadioButton,
  Text,
  useTheme,
  Portal,
  Dialog,
  TextInput,
  ActivityIndicator,
  FAB,
  HelperText,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

import AppHeader from "../../components/AppHeader";
import FilterSelector from "../../components/FilterSelector";
import EmptyState from "../../components/EmptyState";
import CategoryChip from "../../components/CategoryChip";
import { tasksService } from "../../services/tasksService";

const CATEGORY_ITEMS = [
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

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const toLocalISOString = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; 
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, -1);
};

export default function TasksScreen() {
  const theme = useTheme();
  const primary = theme.colors.primary;

  // --- ESTADOS DE DADOS ---
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DE FILTROS ---
  const [showCompleted, setShowCompleted] = useState(false); // false = status 0, true = status 2
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- ESTADOS DE MODAL/FORM ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [category, setCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState(CATEGORY_ITEMS);
  const [dueDate, setDueDate] = useState(new Date());
  const [conclusionDate, setConclusionDate] = useState(null);

  const [mode, setMode] = useState('date');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // --- CARREGAMENTO DE DADOS ---
  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    const params = {
      status: showCompleted ? 2 : 0,
      category: selectedCategory,
    };

    const response = await tasksService.getAll(params);

    if (response.success) {
      setTasks(response.data);
    } else {
      setError(response.error);
      Alert.alert("Erro", "Não foi possível carregar as tarefas.");
    }
    setIsLoading(false);
  }, [showCompleted, selectedCategory]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // --- AÇÕES ---
  const handleToggleTask = async (task) => {
    const newStatus = task.status === 0 ? 2 : 0;
    const response = await tasksService.update(task.id, {
      ...task,
      status: newStatus,
    });

    if (response.success) {
      await loadTasks();
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível atualizar a tarefa."
      );
    }
  };

  const handleSaveTask = async () => {
    if (!validateForm()) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      status: selectedTask ? selectedTask.status : 0,
      dueDate: toLocalISOString(dueDate),
      category: parseInt(category, 10),
    };

    let response;
    if (selectedTask) {
      response = await tasksService.update(selectedTask.id, payload);
    } else {
      response = await tasksService.create(payload);
    }

    if (response.success) {
      await loadTasks();
      handleCloseModal();
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível salvar a tarefa."
      );
    }
  };

  const handleDeleteTask = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza de que deseja excluir essa tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => executeDeleteTask(),
          style: "destructive",
        },
      ]
    );
  };

  const executeDeleteTask = async () => {
    if (!selectedTask) return;
    const response = await tasksService.delete(selectedTask.id);
    if (response.success) {
      await loadTasks();
      handleCloseModal();
    } else {
      Alert.alert(
        "Erro",
        response.error || "Não foi possível excluir a tarefa."
      );
    }
  };

  // --- HELPERS DE FORM ---
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(null);
    setDueDate(new Date());
    setConclusionDate(null);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Título da tarefa é obrigatório";
      isValid = false;
    }
    if (!category) {
      newErrors.category = "Categoria da tarefa é obrigatória";
      isValid = false;
    }

    const normalizedDueDate = new Date(dueDate);
    normalizedDueDate.setHours(0, 0, 0, 0);

    if (
      !selectedTask &&
      (!normalizedDueDate || normalizedDueDate < startOfToday)
    ) {
      newErrors.dueDate =
        "Data de vencimento não pode ser antes da data de hoje.";
      isValid = false;
    }

    if (conclusionDate && conclusionDate < dueDate) {
      newErrors.conclusionDate =
        "Data de conclusão não pode ser após data de vencimento.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOpenNewModal = () => {
    setSelectedTask(null);
    setErrors({});
    resetForm();
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setErrors({});
    setTitle(task.title);
    setDescription(task.description || "");
    setCategory(String(task.category));
    setDueDate(new Date(task.dueDate));
    setConclusionDate(
      task.conclusionDate ? new Date(task.conclusionDate) : null
    );
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setErrors({});
    setSelectedTask(null);
    resetForm();
  };

const onDueDateChange = (event, selectedDate) => {
  // Se o usuário cancelar, fecha tudo
  if (event.type === 'dismissed') {
    setShowDatePicker(false);
    return;
  }

  const currentDate = selectedDate || dueDate;

  if (mode === 'date') {
    // 1. Usuário escolheu a DATA
    setShowDatePicker(false); // Fecha o picker de data
    
    // Atualiza apenas a parte da data, mantendo a hora atual/anterior
    const newDate = new Date(dueDate);
    newDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    setDueDate(newDate);

    // 2. Abre imediatamente o picker de HORA (apenas Android)
    if (Platform.OS === 'android') {
        setMode('time');
        setShowDatePicker(true);
    }
  } else {
    // 3. Usuário escolheu a HORA
    setShowDatePicker(false);
    
    // Atualiza apenas a hora
    const newDate = new Date(dueDate);
    newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
    setDueDate(newDate);
    
    if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
    // Reseta o modo para a próxima vez
    setMode('date'); 
  }
};

// Função para iniciar o processo (chamada no onFocus do Input)
const showMode = (currentMode) => {
  setShowDatePicker(true);
  setMode(currentMode);
};

  // --- COMPONENTES DE RENDERIZAÇÃO ---

  const renderItem = ({ item }) => (
    <Card
      mode="elevated"
      style={[styles.card, { opacity: showCompleted ? 0.6 : 1 }]}
      onPress={() => handleToggleTask(item)}
      onLongPress={() => handleOpenEditModal(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <View style={styles.cardTextContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.cardTitle,
                item.status === 2 && {
                  textDecorationLine: "line-through",
                  color: theme.colors.outline,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text variant="bodySmall">
              {new Date(item.dueDate).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </Text>
            <CategoryChip 
              categoryId={item.category}
              style={styles.chip}
            />
          </View>
        </View>
        <RadioButton.Android
          value="done"
          status={item.status === 2 ? "checked" : "unchecked"}
          onPress={() => handleToggleTask(item)}
          color={primary}
          uncheckedColor={theme.colors.outline}
        />
      </View>
    </Card>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <AppHeader title="Suas tarefas" />
        <View style={styles.listContainer}>
          <Text style={{ marginBottom: 16, textAlign: "center" }}>
            Erro ao carregar tarefas: {error}
          </Text>
          <Button mode="contained" onPress={loadTasks}>
            Tentar Novamente
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Suas tarefas" />

      <FilterSelector
        categories={CATEGORY_ITEMS}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        isArchived={showCompleted}
        onToggleArchived={() => setShowCompleted(!showCompleted)}
      />

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={showCompleted ? "archive-off" : "clipboard-edit-outline"}
            title={
              showCompleted
                ? "Nenhuma tarefa concluída arquivada."
                : selectedCategory !== null
                ? "Nenhuma tarefa nesta categoria."
                : "Sem tarefas por aqui."
            }
            description={
              !showCompleted
                ? "Toque em “Nova Tarefa” para criar uma tarefa."
                : null
            }
            actionLabel="Nova Tarefa"
            onAction={
              !showCompleted
                ? handleOpenNewModal
                : null
            }
          />
        ) : (
          <>
            <FlatList
              data={tasks}
              keyExtractor={(i) => String(i.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />

            {!showCompleted && (
              <FAB
                icon="plus"
                style={styles.fabIcon}
                onPress={handleOpenNewModal}
              />
            )}
          </>
        )}
      </View>

      {/* Modal de Criar/Editar */} 
      <Portal>
        <Dialog visible={isModalVisible} onDismiss={handleCloseModal}>
          <Dialog.Title>
            {selectedTask ? "Editar Tarefa" : "Nova Tarefa"}
          </Dialog.Title>
          <Dialog.Content style={styles.taskForm}>
            <TextInput
              label="Título"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              mode="outlined"
              error={!!errors.title}
            />
            {!!errors.title && (
              <HelperText type="error">{errors.title}</HelperText>
            )}

            <TextInput
              label="Descrição (opcional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
            />

            <DropDownPicker
              open={openCategoryDropdown}
              value={category}
              items={categoryItems}
              setOpen={setOpenCategoryDropdown}
              setValue={(cat) => {
                setCategory(cat);
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
              setItems={setCategoryItems}
              placeholder="Selecione uma categoria"
              style={
                !errors.category
                  ? styles.dropdownPicker
                  : [
                      styles.dropdownPicker,
                      { borderColor: theme.colors.error, borderWidth: 2 },
                    ]
              }
              textStyle={{ fontFamily: "sans-serif", fontSize: 16 }}
              placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
              zIndex={3000}
              zIndexInverse={1000}
            />
            {!!errors.category && (
              <HelperText type="error">{errors.category}</HelperText>
            )}

            <TextInput
              label="Data de vencimento"
              mode="outlined"
              value={dueDate.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              //value={dueDate.toLocaleDateString()}
              right={<TextInput.Icon icon="calendar" />}
              //onFocus={() => setShowDatePicker(true)}
              onFocus={() => showMode('date')}
              showSoftInputOnFocus={false}
              error={!!errors.dueDate}
            />
            {!!errors.dueDate && (
              <HelperText type="error">{errors.dueDate}</HelperText>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode={mode}
                display="default"
                is24Hour={true}
                onChange={onDueDateChange}
              />
            )}
            {!!conclusionDate && (
              <Text>
                Tarefa concluída em: {conclusionDate.toLocaleDateString()}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            {selectedTask && (
              <Button
                onPress={handleDeleteTask}
                textColor={theme.colors.error}
                style={styles.deleteButton}
              >
                Excluir
              </Button>
            )}
            <View style={styles.spacer} />
            <Button onPress={handleCloseModal}>Cancelar</Button>
            <Button onPress={handleSaveTask}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1, paddingTop: 8, paddingHorizontal: 0 },
  loader: { paddingTop: 50 },
  listContent: { paddingVertical: 4, paddingBottom: 96 },
  card: { marginHorizontal: 16, marginVertical: 10, padding: 12 },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  cardLeft: { flexDirection: "row", flex: 1 },
  cardTextContainer: { marginLeft: 8, flexShrink: 1 },
  cardTitle: { fontWeight: "600" },
  chip: { marginTop: 8 },
  fabContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: "center",
  },
  fab: { width: "70%" },
  fabIcon: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  fabLabel: { fontSize: 16, fontWeight: "700" },
  taskForm: { rowGap: 12 },
  dropdownPicker: {
    borderRadius: 5,
    minHeight: 51,
    borderColor: "rgb(124, 117, 126)",
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  deleteButton: { marginRight: "auto" },
  spacer: { flex: 1 },
});

import React, { useReducer, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Switch,
  Divider,
  SegmentedButtons,
  useTheme,
  HelperText,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

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

const DAYS_ITEMS = [
  { label: "Domingo", value: 0 },
  { label: "Segunda", value: 1 },
  { label: "Terça", value: 2 },
  { label: "Quarta", value: 3 },
  { label: "Quinta", value: 4 },
  { label: "Sexta", value: 5 },
  { label: "Sábado", value: 6 },
];

const RECURRENCE_TYPE_ITEMS = [
  { label: "por dia", value: "1" },
  { label: "por semana", value: "2" },
  { label: "por mês", value: "3" },
  { label: "por ano", value: "4" },
];

// Início do dia de hoje para comparação de datas
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

// Centralização de todo o estado do formulário e lógica em um useReducer
const initialState = {
  formData: {
    name: "",
    description: "",
    category: "",
    startDate: new Date(),
    includeEndDate: false,
    endDate: null,
    metricType: "",
    targetQuantity: "",
    quantityUnit: "",
    targetDuration: new Date(2025, 0, 1, 0, 0, 0, 0),
    recurrence: "",
    frequency: "",
    selectedDays: [],
    recurrenceType: "",
  },

  ui: {
    showStartDatePicker: false,
    showEndDatePicker: false,
    showDurationPicker: false,
    openCategoryDropdown: false,
    openDaysDropdown: false,
    openRecurrenceTypeDropdown: false,
  },

  errors: {},
};

// Converte dados da API (para edição) em estado do formulário
const hydrateData = (data) => {
  if (!data) return initialState.formData;

  const isPartialData = data.isPartial === true;

  let duration = new Date(2025, 0, 1, 0, 0, 0, 0);
  if (data.targetDuration) {
    const parts = data.targetDuration.split(":");
    if (parts.length === 3) {
      duration.setHours(
        parseInt(parts[0]),
        parseInt(parts[1]),
        parseInt(parts[2])
      );
    }
  }

    if (isPartialData) {
    return {
      ...initialState.formData,
      name: data.name || "",
      description: data.description || "",
      category: data.category !== undefined ? String(data.category) : "",
    };
  }

  // Mapeia os dados da API para o estado do formulário
  return {
    ...initialState.formData,
    ...data,
    category: String(data.category),
    metricType: data.metricType,
    recurrence: data.recurrenceType === 0 ? "dias" : "intervalo",
    recurrenceType: data.recurrenceType === 0 ? "" : String(data.recurrenceType),
    frequency: data.frequency !== null ? String(data.frequency) : "",
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
    endDate: data.endDate ? new Date(data.endDate) : null,
    includeEndDate: !!data.endDate,
    targetDuration: duration,
    targetQuantity: data.targetQuantity !== null ? String(data.targetQuantity) : "",
    selectedDays: data.specificDays || [],
  };
};

function formReducer(state, action) {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...initialState,
        formData: hydrateData(action.payload),
      };
    case "UPDATE_FIELD":
      // Atualiza um campo no formData
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
        // Limpa o erro associado a esse campo
        errors: {
          ...state.errors,
          [action.payload.field]: "",
        },
      };
    case "SET_ERRORS":
      // Define múltiplos erros (usado pela validação)
      return { ...state, errors: action.payload };
    case "TOGGLE_UI":
      // Alterna um booleano na UI (ex: abrir/fechar pickers)
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload.field]: action.payload.value,
        },
      };
    case "TOGGLE_END_DATE":
      // Lógica específica para o switch de data final
      const newIncludeEndDate = !state.formData.includeEndDate;
      return {
        ...state,
        formData: {
          ...state.formData,
          includeEndDate: newIncludeEndDate,
          endDate: newIncludeEndDate ? state.formData.endDate : null, // Limpa a data final se desmarcado
        },
        errors: {
          ...state.errors,
          endDate: "", // Limpa erro da data final
        },
      };
    default:
      return state;
  }
}

// Função auxiliar para verificar se a hora é zero
function isTimeZero(date) {
  return (
    date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
  );
}

const HabitForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  readOnly = false,
  submitButtonText = "Salvar",
}) => {

  const theme = useTheme();

  // Estado e dispatch centralizados
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { formData, ui, errors } = state;
  const [categoryItems, setCategoryItems] = useState(CATEGORY_ITEMS);
  const [daysItems, setDaysItems] = useState(DAYS_ITEMS);
  const [localSelectedDays, setLocalSelectedDays] = useState([]);
  const [recurrenceTypeItems, setRecurrenceTypeItems] = useState(
    RECURRENCE_TYPE_ITEMS
  );

  // Efeito para preencher o formulário quando 'initialData' for carregado (modo edição)
  useEffect(() => {
    if (initialData) {
      dispatch({ type: "LOAD_DATA", payload: initialData });
      setLocalSelectedDays(initialData.specificDays || []);
    }
  }, [initialData]); 

  // Efeito para sincronizar o 'localSelectedDays' com o reducer
  useEffect(() => {
    handleInputChange("selectedDays", localSelectedDays);
  }, [localSelectedDays]);

  // Função genérica para atualizar campos do formulário
  const handleInputChange = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", payload: { field, value } });
  };

  // Função genérica para controlar a visibilidade de UIs
  const toggleUi = (field, value) => {
    dispatch({ type: "TOGGLE_UI", payload: { field, value } });
  };

  // Validação do formulário
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Nome do hábito é obrigatório";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Categoria do hábito é obrigatória";
      isValid = false;
    }

    const startDateNormalized = new Date(formData.startDate);
    startDateNormalized.setHours(0, 0, 0, 0);

    if (!initialData && (startDateNormalized < startOfToday)) {
      newErrors.startDate =
        "Data de início deve ser maior ou igual à data de hoje";
      isValid = false;
    }

    if (
      formData.includeEndDate &&
      (!formData.endDate || formData.endDate < formData.startDate)
    ) {
      newErrors.endDate = "Data de término não pode ser menor que a data de início";
      isValid = false;
    }

    if (!formData.recurrence.trim()) {
      newErrors.recurrence = "É obrigatório escolher um tipo de recorrência";
      isValid = false;
    }

    if (formData.recurrence === "dias" && formData.selectedDays.length === 0) {
      newErrors.selectedDays =
        "Selecione pelo menos um dia para esse tipo de recorrência";
      isValid = false;
    }

    if (formData.recurrence === "intervalo") {
      if (!formData.frequency || Number(formData.frequency) <= 0) {
        newErrors.frequency =
          "Frequência é obrigatória e deve ser maior que zero";
        isValid = false;
      }
      if (!formData.recurrenceType) {
        newErrors.recurrenceType = "Tipo de intervalo é obrigatório";
        isValid = false;
      }
    }

    if (formData.metricType === "") {
      newErrors.metricType =
        "É obrigatório escolher um tipo de métrica do objetivo";
      isValid = false;
    }

    if (
      formData.metricType === 1 &&
      (!formData.targetQuantity || Number(formData.targetQuantity) <= 0)
    ) {
      newErrors.targetQuantity =
        "Quantidade alvo é obrigatória e deve ser maior do que zero";
      isValid = false;
    }

    if (formData.metricType === 2 && isTimeZero(formData.targetDuration)) {
      newErrors.targetDuration =
        "A duração alvo é obrigatória e deve ser maior do que zero";
      isValid = false;
    }

    dispatch({ type: "SET_ERRORS", payload: newErrors });
    return isValid;
  };

  const onChangeStartDate = (event, selectedDate) => {
    toggleUi("showStartDatePicker", Platform.OS === "ios");
    if (selectedDate) {
      handleInputChange("startDate", selectedDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    toggleUi("showEndDatePicker", Platform.OS === "ios");
    if (selectedDate) {
      handleInputChange("endDate", selectedDate);
    }
  };

  const onChangeDuration = (event, selectedDate) => {
    toggleUi("showDurationPicker", false);
    if (selectedDate) {
      handleInputChange("targetDuration", selectedDate);
    }
  };

  // Função de Submit Interna
  const handleInternalSubmit = () => {
    console.log("=== FORM SUBMIT: Button clicked ===");
    if (validateForm()) {
      console.log("FORM SUBMIT: Validation passed, preparing payload");

      const pad = (num) => String(num).padStart(2, "0");
      const duration = formData.targetDuration;
      const durationString = `${pad(duration.getHours())}:${pad(duration.getMinutes())}:${pad(duration.getSeconds())}`;

      const payload = {
        name: (formData.name || '').trim(),
        description: (formData.description || '').trim() || null,
        category: Number(formData.category),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        recurrenceType:
          formData.recurrence === "dias" ? 0 : Number(formData.recurrenceType),
        specificDays:
          formData.recurrence === "dias" ? formData.selectedDays : null,
        frequency:
          formData.recurrence === "intervalo"
            ? Number(formData.frequency)
            : null,
        metricType: formData.metricType,
        targetQuantity:
          formData.metricType === 1 ? Number(formData.targetQuantity) : null,
        quantityUnit:
          formData.metricType === 1
            ? ((formData.quantityUnit || '').trim() || null) 
            : null,
        targetDuration: formData.metricType === 2 ? durationString : null,
      };

      // Chama a função do pai (CreateHabit ou EditHabit)
      onSubmit(payload);
    } else {
      console.log("FORM SUBMIT: Validation failed");
    }
  };

  // Formulário
  return (
    <ScrollView
      style={{ paddingTop: 20, backgroundColor: "#FFF" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        {/* Definições gerais do hábito */}
        <View style={styles.sectionContainer}>
          
          <Text style={styles.sectionTitle}>Definições do hábito</Text>

          <TextInput
            editable={!readOnly}
            label="Nome do hábito"
            mode="outlined"
            value={formData.name}
            placeholder="Nome do hábito (ex.: Fazer academia)"
            onChangeText={(value) => handleInputChange("name", value)}
            error={!!errors.name}
          />
          {!!errors.name && (
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>
          )}

          <DropDownPicker
            disabled={readOnly}
            open={ui.openCategoryDropdown}
            value={formData.category}
            items={categoryItems}
            setOpen={(value) => toggleUi("openCategoryDropdown", value)}
            setValue={(callback) =>
              handleInputChange("category", callback(formData.category))
            }
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
            textStyle={{
                fontFamily: 'sans-serif',
                fontSize: 16,
      
            }}
            placeholderStyle={{
              color: theme.colors.onSurfaceVariant
            }}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="MODAL"
          />
          {!!errors.category && (
            <HelperText type="error" visible={!!errors.category}>
              {errors.category}
            </HelperText>
          )}

          <TextInput
            editable={!readOnly}
            label="Descrição (opcional)"
            mode="outlined"
            value={formData.description}
            placeholder="Descreva seu hábito (opcional)"
            onChangeText={(value) => handleInputChange("description", value)}
          />

          {/* Start Date Picker */}
          <TextInput
            editable={!readOnly}
            label="Data de início"
            mode="outlined"
            value={formData.startDate.toLocaleDateString()}
            right={<TextInput.Icon icon="calendar" />}
            onFocus={() => !readOnly && toggleUi("showStartDatePicker", true)}
            error={!!errors.startDate}
          />
          {!!errors.startDate && (
            <HelperText type="error" visible={!!errors.startDate}>
              {errors.startDate}
            </HelperText>
          )}

          {ui.showStartDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}

          {/* End Date Picker*/}
          <View style={styles.switchContainer}>
            <Switch
              disabled={readOnly}
              value={formData.includeEndDate}
              onValueChange={() => dispatch({ type: "TOGGLE_END_DATE" })}
            />
            <Text>Incluir data de término</Text>
          </View>

          {formData.includeEndDate && (
            <TextInput
              label="Data de término"
              mode="outlined"
              value={
                formData.endDate ? formData.endDate.toLocaleDateString() : ""
              }
              right={<TextInput.Icon icon="calendar" />}
              onFocus={() => !readOnly && toggleUi("showEndDatePicker", true)}
              error={!!errors.endDate}
            />
          )}
          {formData.includeEndDate && !!errors.endDate && (
            <HelperText type="error" visible={!!errors.endDate}>
              {errors.endDate}
            </HelperText>
          )}

          {ui.showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate || new Date()}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={formData.startDate}
            />
          )}
        </View>

        <Divider />

        {/* Definições do objetivo */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Objetivo</Text>

          <Text>Como deseja medir o seu progresso?</Text>
          <SegmentedButtons
            disabled={readOnly}
            value={formData.metricType}
            onValueChange={(value) => !readOnly && handleInputChange("metricType", value)}
            buttons={[
              { value: 0, label: "Sim ou não", icon: "check" },
              { value: 1, label: "Quantidade", icon: "numeric" },
              { value: 2, label: "Duração", icon: "timer-outline" },
            ]}
          />
          {!!errors.metricType && (
            <HelperText type="error" visible={!!errors.metricType}>
              {errors.metricType}
            </HelperText>
          )}

          {formData.metricType === 0 && (
            <View style={styles.optionsContainer}>
              <Text>
                Registre se você teve ou não sucesso com sua atividade.
              </Text>
            </View>
          )}

          {formData.metricType === 1 && (
            <View style={styles.optionsContainer}>
              <View style={styles.inputGroup}>
              <TextInput
                editable={!readOnly}
                style={{ width: "40%" }}
                label="Quantidade alvo"
                mode="outlined"
                value={formData.targetQuantity}
                onChangeText={(value) =>
                  handleInputChange("targetQuantity", value)
                }
                keyboardType="numeric"
                error={!!errors.targetQuantity}
              />
              <TextInput
                editable={!readOnly}
                style={{ width: "58%" }}
                label="Unidade de medida"
                mode="outlined"
                value={formData.quantityUnit}
                onChangeText={(value) =>
                  handleInputChange("quantityUnit", value)
                }
              />
              {!!errors.metricType && (
                <HelperText type="error" visible={!!errors.targetQuantity}>
                  {errors.targetQuantity}
                </HelperText>
              )}
              </View>
            </View>
          )}

          {formData.metricType === 2 && (
            <View style={styles.optionsContainer}>
              <TextInput
                label="Duração alvo"
                mode="outlined"
                value={formData.targetDuration.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                right={<TextInput.Icon icon="timer-outline" />}
                onFocus={() =>
                  !readOnly && toggleUi("showDurationPicker", true)
                }
                error={!!errors.targetDuration}
              />
              {!!errors.targetDuration && (
                <HelperText type="error" visible={!!errors.targetDuration}>
                  {errors.targetDuration}
                </HelperText>
              )}
              {ui.showDurationPicker && (
                <DateTimePicker
                  value={formData.targetDuration}
                  mode="time"
                  display="spinner"
                  onChange={onChangeDuration}
                />
              )}
            </View>
          )}
        </View>

        <Divider />

        {/* Definições da recorrência */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recorrência</Text>

          <Text>De que forma essa atividade irá se repetir?</Text>
          <SegmentedButtons
            value={formData.recurrence}
            onValueChange={(value) => !readOnly && handleInputChange("recurrence", value)}
            buttons={[
              {
                value: "dias",
                label: "Dias específicos",
              },
              {
                value: "intervalo",
                label: "Vezes por período",
              },
            ]}
          />
          {!!errors.recurrence && (
            <HelperText type="error" visible={!!errors.recurrence}>
              {errors.recurrence}
            </HelperText>
          )}

          {/* Opções condicionais */}
          {formData.recurrence === "dias" && (
            <View style={styles.optionsContainer}>
              <Text>
                Selecione os dias da semana em que irá realizar a atividade:
              </Text>

              <DropDownPicker
                disabled={readOnly}
                open={ui.openDaysDropdown}
                value={localSelectedDays}
                items={daysItems}
                setOpen={(value) => toggleUi("openDaysDropdown", value)}
                setValue={setLocalSelectedDays}
                setItems={setDaysItems}
                placeholder="Selecione um ou mais dias"
                style={
                  !errors.selectedDays
                    ? styles.dropdownPicker
                    : [
                        styles.dropdownPicker,
                        { borderColor: theme.colors.error, borderWidth: 2 },
                      ]
                }
                textStyle={{
                    fontFamily: 'sans-serif',
                    fontSize: 16,
          
                }}
                placeholderStyle={{
                  color: theme.colors.onSurfaceVariant
                }}
                multiple={true}
                mode="BADGE"
                badgeDotColors={[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.tertiary,
                ]}
                zIndex={2000}
                zIndexInverse={2000}
                listMode="MODAL"
              />
              {!!errors.selectedDays && (
                <HelperText type="error" visible={!!errors.selectedDays}>
                  {errors.selectedDays}
                </HelperText>
              )}
            </View>
          )}

          {formData.recurrence === "intervalo" && (
            <View style={styles.optionsContainer}>
              <Text>Com que frequência você irá realizar essa atividade?</Text>

              <View style={styles.inputGroup}>
                <View style={{ width: "40%" }}>
                  <TextInput
                    editable={!readOnly}
                    label="Frequência"
                    mode="outlined"
                    value={formData.frequency}
                    placeholder="Quantidade"
                    onChangeText={(value) =>
                      handleInputChange("frequency", value)
                    }
                    keyboardType="numeric"
                    right={<TextInput.Affix text="vezes" />}
                    error={!!errors.frequency}
                  />
                  {!!errors.frequency && (
                    <HelperText type="error" visible={!!errors.frequency}>
                      {errors.frequency}
                    </HelperText>
                  )}
                </View>

                <View style={{ width: "58%" }}>
                  <DropDownPicker
                    disabled={readOnly}
                    open={ui.openRecurrenceTypeDropdown}
                    value={formData.recurrenceType}
                    items={recurrenceTypeItems}
                    setOpen={(value) =>
                      toggleUi("openRecurrenceTypeDropdown", value)
                    }
                    setValue={(callback) =>
                      handleInputChange(
                        "recurrenceType",
                        callback(formData.recurrenceType)
                      )
                    }
                    setItems={setRecurrenceTypeItems}
                    placeholder="Escolha o intervalo"
                    style={
                      !errors.recurrenceType
                        ? [
                            styles.dropdownPicker,
                            {
                              marginTop: 7
                            }
                          ]
                        : [
                            styles.dropdownPicker,
                            {
                              borderColor: theme.colors.error,
                              borderWidth: 2,
                            },
                          ]
                    }
                    textStyle={{
                        fontFamily: 'sans-serif',
                        fontSize: 16,
              
                    }}
                    placeholderStyle={{
                      color: theme.colors.onSurfaceVariant
                    }}
                    zIndex={1000}
                    zIndexInverse={3000}
                    listMode="MODAL"
                  />
                  {!!errors.recurrenceType && (
                    <HelperText type="error" visible={!!errors.recurrenceType}>
                      {errors.recurrenceType}
                    </HelperText>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <Divider />
        <View>

          <Button
            mode="contained"
            uppercase={false}
            onPress={handleInternalSubmit}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            {submitButtonText}
          </Button>

        {!readOnly && onCancel && (
          <Button
            mode="outlined"
            uppercase={false}
            style={{marginTop: 10}}
            onPress={onCancel}
            loading={isLoading}
            disabled={isLoading}
          >
            Cancelar edição
          </Button>
        )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    rowGap: 20,
    paddingBottom: 30,
  },
  sectionContainer: {
    rowGap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  optionsContainer: {
    rowGap: 10,
    borderRadius: 5,
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownPicker: {
    borderRadius: 5,
    minHeight: 51,
    borderColor: "rgb(124, 117, 126)",
  },
});

export default HabitForm;

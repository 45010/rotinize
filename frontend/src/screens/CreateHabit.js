import React, { useState } from "react";
import { Alert } from "react-native";
import Container from "../components/Container.js";
import { habitsService } from "../services/habitsService.js";
import HabitForm from "../components/HabitForm.js"; 

const CreateHabit = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);

  const prefilledData = route?.params?.prefilledData || null;

  const handleCreate = async (payload) => {
    setLoading(true);

    try {
      const result = await habitsService.create(payload);

      if (result.success && result.data) {
        const newHabitId = result.data.id;
        navigation.replace('HabitDetails', { habitId: newHabitId }); 

        Alert.alert('Sucesso', 'Hábito criado com sucesso!');

      } else {
        Alert.alert('Erro ao criar hábito', result.error || 'Erro desconhecido');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <HabitForm
        initialData={prefilledData}
        onSubmit={handleCreate}
        isLoading={loading}
        submitButtonText="Criar Hábito"
        readOnly={false} 
      />
    </Container>
  );
};

export default CreateHabit;
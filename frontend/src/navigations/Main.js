import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTab from "./BottomTab";
import TasksScreen from "../screens/Tasks/TasksScreen";
import Habitos from "../screens/Habitos";
import Habits from "../screens/Habits";
import Progress from "../screens/Progress";
import ExploreScreen from "../screens/ExploreScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HabitConsistency from "../screens/HabitConsistency";
import IndicadorTempoFoco from "../screens/IndicadorTempoFoco";
import CreateHabit from "../screens/CreateHabit";
import HabitDetails from "../screens/HabitDetails";
import TodayScreen from "../screens/TodayScreen"

// adicionar novas telas quando forem desenvolvidas
const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTab" component={BottomTab} />

      <Stack.Screen name="Hoje" component={TodayScreen} />

      <Stack.Screen name="Tarefas" component={TasksScreen} />

      {/* <Stack.Screen name="Habitos" component={Habitos} /> */}

      <Stack.Screen name="Habits" component={Habits} />

      <Stack.Screen name="Explore" component={ExploreScreen} />

      <Stack.Screen 
        name="Progresso" 
        component={Progress} 
        options={{
          headerShown: true,
          title: "Seu progresso",
        }}
    />

      <Stack.Screen
        name="Configuracoes"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: "Configurações",
        }}
      />

      <Stack.Screen
        name="HabitConsistency"
        component={HabitConsistency}
        options={{
          headerShown: true,
          title: "Consistência nos hábitos",
        }}
      />

      <Stack.Screen
        name="IndicadorTempoFoco"
        component={IndicadorTempoFoco}
        options={{
          headerShown: true,
          title: "Tempo de foco",
        }}
      />

      <Stack.Screen
        name="CreateHabit"
        component={CreateHabit}
        options={{
          headerShown: true,
          title: "Criar hábito",
        }}
      />

      <Stack.Screen
        name="HabitDetails"
        component={HabitDetails}
        options={{
          headerShown: true,
          title: "Detalhes do hábito",
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;

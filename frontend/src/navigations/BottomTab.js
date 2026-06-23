import React, { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

import TasksScreen from '../screens/Tasks/TasksScreen';
import Habitos from '../screens/Habitos';
import Habits from '../screens/Habits';
import Progress from '../screens/Progress';
import ExploreScreen from '../screens/ExploreScreen';
import TimerScreen from '../screens/TimerScreen';
import TodayScreen from '../screens/TodayScreen';

const BottomTab = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // const [index, setIndex] = useState(() => {
  //   const initialIndex = route.params?.initialIndex;
  //   return initialIndex !== undefined ? initialIndex : 0;
  // });

  // useEffect(() => {
  //   if (route.params?.initialIndex !== index) {   
  //     navigation.setParams({ initialIndex: index });
  //   }
  // }, [index, navigation, route.params?.initialIndex]);

  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (route.params?.initialIndex !== undefined) {
      setIndex(route.params.initialIndex);
    }
  }, [route.params?.initialIndex]);
  
  useEffect(() => {
    navigation.setParams({ initialIndex: index });
  }, [index, navigation]);


  
  const [routes] = useState([
    { key: 'hoje', title: 'Hoje', focusedIcon: 'calendar-today', unfocusedIcon: 'calendar-today' },
    { key: 'tarefas', title: 'Tarefas', focusedIcon: 'list-box', unfocusedIcon: 'list-box-outline' },
    //{ key: 'habitos', title: 'Hábitos', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline' },
    { key: 'habitos', title: 'Hábitos', focusedIcon: 'trophy', unfocusedIcon: 'trophy-outline' },
    //{ key: 'progresso', title: 'Progresso', focusedIcon: 'chart-line', unfocusedIcon: 'chart-line' }, 
    { key: 'explorar', title: 'Explorar', focusedIcon: 'compass', unfocusedIcon: 'compass-outline' },
    { key: 'timer', title: 'Timer', focusedIcon: 'timer', unfocusedIcon: 'timer-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    hoje: TodayScreen,
    tarefas: TasksScreen,
    //habitos: Habitos,
    habitos: Habits,
    //progresso: Progress,
    explorar: ExploreScreen,
    timer: TimerScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ 
        backgroundColor: '#F8F6F7',
        height: 100
      }}
      activeColor='#FF9901'
      inactiveColor='#A09CAB'
      labeled={true}
      sceneAnimationEnabled={false}
      activeIndicatorStyle={{
        backgroundColor: '#FCC97D',
        borderRadius: 16,
        width: 64,
        height: 32,
        transform: [{ scale: 1 }],
      }}
      theme={{
        colors: {
          secondaryContainer: '#FCC97D',
        },
        animation: {
          scale: 1.0,
        }
      }}
      shifting={false}
      compact={false}
    />
  );
};

export default BottomTab;
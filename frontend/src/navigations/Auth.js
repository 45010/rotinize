import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Landing from '../screens/Landing';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from './Main';


const Stack = createNativeStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={Landing}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Fazer login',
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          title: 'Cadastro',
        }}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Auth;
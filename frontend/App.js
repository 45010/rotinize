import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { theme } from './src/constants/theme';
import Auth from './src/navigations/Auth';
import { DrawerContainer } from './src/components/Drawer';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <DrawerContainer>
            <Auth />
          </DrawerContainer>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
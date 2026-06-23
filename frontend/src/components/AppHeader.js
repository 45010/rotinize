import React from 'react';
import { Appbar } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDrawer } from './Drawer';

export default function AppHeader({ title }) {
  const navigation = useNavigation();
  const { openDrawer } = useDrawer();

  return (
    <Appbar.Header style={{ backgroundColor: '#fff' }}>
      <Appbar.Action 
        icon="menu" 
        onPress={openDrawer}
      />
      {title ? (
        <Appbar.Content title={title} />
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <Appbar.Action icon="account-circle-outline" onPress={() => navigation.navigate("Configuracoes")} />
    </Appbar.Header>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, Animated, ScrollView, Alert } from 'react-native';
import { Drawer as PaperDrawer, Avatar, Text, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export function DrawerContainer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-280));
  const [currentScreen, setCurrentScreen] = useState('Tarefas');
  const navigation = useNavigation();

  const openDrawer = () => {
    try {
      const state = navigation.getState();
      const activeRoute = state.routes[state.index];
      
      if (activeRoute.name === 'Main' && activeRoute.state) {
        const mainState = activeRoute.state;
        const mainActiveRoute = mainState.routes[mainState.index];
        
        if (mainActiveRoute.name === 'BottomTab' && mainActiveRoute.params?.initialIndex !== undefined) {
          const tabIndex = mainActiveRoute.params.initialIndex;
          const screens = ['Hoje', 'Tarefas', 'Habitos', 'Explorar', 'Timer'];
          setCurrentScreen(screens[tabIndex] || 'Hoje');
          //const screens = ['Tarefas', 'Habitos', 'Progresso', 'Explorar', 'Timer'];
          //setCurrentScreen(screens[tabIndex] || 'Tarefas');
        } else if (mainActiveRoute.name === 'Tarefas') {
          setCurrentScreen('Tarefas');
        } else if (mainActiveRoute.name === 'Configuracoes') {
          setCurrentScreen('Configuracoes');
        } else if (mainActiveRoute.name === 'Habitos') {
          setCurrentScreen('Habitos');
        } else if (mainActiveRoute.name === 'Explore') {
          setCurrentScreen('Explorar');
        } else if (mainActiveRoute.name === 'Progresso') {
          setCurrentScreen('Progresso');
        } else {
          setCurrentScreen('Hoje');
        }
      } else if (activeRoute.name === 'BottomTab' && activeRoute.params?.initialIndex !== undefined) {
        const tabIndex = activeRoute.params.initialIndex;
        const screens = ['Hoje', 'Tarefas', 'Habitos', 'Explorar', 'Timer'];
        setCurrentScreen(screens[tabIndex] || 'Hoje');
        // const screens = ['Tarefas', 'Habitos', 'Progresso', 'Explorar', 'Timer'];
        // setCurrentScreen(screens[tabIndex] || 'Tarefas');
      } else if (activeRoute.name === 'Configuracoes') {
        setCurrentScreen('Configuracoes');
      } else {
        setCurrentScreen('Hoje');
      }
    } catch (error) {
      setCurrentScreen('Hoje');
    }

    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, toggleDrawer, isOpen }}>
      {children}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1} 
            onPress={closeDrawer}
          />
          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <DrawerContent onClose={closeDrawer} navigation={navigation} currentScreen={currentScreen} />
          </Animated.View>
        </View>
      </Modal>
    </DrawerContext.Provider>
  );
}

function DrawerContent({ onClose, navigation, currentScreen }) {
  const [activeScreen, setActiveScreen] = useState(currentScreen);
  const [userData, setUserData] = useState({ nome: 'Usuário', email: '' });
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoadingUser(true);
    try {
      const result = await userService.getProfile();
      if (result.success) {
        setUserData({
          nome: result.data.nome || 'Usuário',
          email: result.data.email || ''
        });
      }
    } catch (error) {
      console.log('Erro ao carregar dados do usuário no drawer:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              
              onClose();
              
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            }
          }
        }
      ]
    );
  };

  const handleBottomTabNavigation = (screen, tabIndex) => {
    setActiveScreen(screen);
    onClose();
    
    try {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTab',
          params: { initialIndex: tabIndex },
          merge: true,
        })
      );
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  const handleNavigation = (screen, routeName) => { 
    setActiveScreen(screen);
    onClose();
    
    try {
      if (routeName) {
        navigation.navigate(routeName);
      }
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  return (
    <ScrollView style={styles.drawer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo-rotinize-completa.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <PaperDrawer.Section style={styles.section}>
        <PaperDrawer.Item
          label="Hoje"
          icon="calendar-today"
          active={activeScreen === 'Hoje'}
          onPress={() => handleBottomTabNavigation('Hoje', 0)} 
          style={[styles.drawerItem, activeScreen === 'Hoje' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Tarefas"
          icon="list-box-outline"
          active={activeScreen === 'Tarefas'}
          onPress={() => handleBottomTabNavigation('Tarefas', 1)}
          style={[styles.drawerItem, activeScreen === 'Tarefas' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Hábitos"
          icon="trophy-outline"
          active={activeScreen === 'Habitos'}
          onPress={() => handleBottomTabNavigation('Habitos', 2)}
          style={[styles.drawerItem, activeScreen === 'Habitos' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Explorar"
          icon="compass-outline"
          active={activeScreen === 'Explorar'}
          onPress={() => handleBottomTabNavigation('Explorar', 3)}
          style={[styles.drawerItem, activeScreen === 'Explorar' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Timer"
          icon="timer-outline"
          active={activeScreen === 'Timer'}
          onPress={() => handleBottomTabNavigation('Timer', 4)}
          style={[styles.drawerItem, activeScreen === 'Timer' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Progresso"
          icon="chart-line"
          active={activeScreen === 'Progresso'}
          onPress={() => handleNavigation('Progresso', 'Progresso')} 
          style={[styles.drawerItem, activeScreen === 'Progresso' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
      </PaperDrawer.Section>

      <PaperDrawer.Section style={styles.section}>
        <PaperDrawer.Item
          label="Notificações"
          icon="bell-outline"
          right={() => <Badge style={styles.badge}>3</Badge>}
          active={activeScreen === 'Notificacoes'}
          onPress={() => handleNavigation('Notificacoes')}
          style={[styles.drawerItem, activeScreen === 'Notificacoes' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Configurações"
          icon="cog-outline"
          active={activeScreen === 'Configuracoes'}
          onPress={() => handleNavigation('Configuracoes', 'Configuracoes')}
          style={[styles.drawerItem, activeScreen === 'Configuracoes' && styles.activeItem]}
          theme={{ colors: { primary: '#2E77B3', onSecondaryContainer: '#2E77B3', secondaryContainer: '#E3F2FD' } }}
        />
        <PaperDrawer.Item
          label="Logout"
          icon="logout"
          onPress={() => {
            handleLogout();
          }}
          style={styles.drawerItem}
          theme={{ colors: { primary: '#FF3333' } }}
        />
      </PaperDrawer.Section>

      <View style={styles.profileContainer}>
        <Avatar.Text 
          size={40} 
          label={userData.nome ? userData.nome.charAt(0).toUpperCase() : 'U'} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text variant="bodyMedium" style={styles.userName}>
            {loadingUser ? 'Carregando...' : userData.nome}
          </Text>
          {userData.email ? (
            <Text variant="bodySmall" style={styles.userEmail}>
              {userData.email}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#ffffff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 10,
  },
  drawer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'flex-start',
  },
  logo: {
    width: 120,
    height: 40,
  },
  section: {
    marginTop: 8,
  },
  drawerItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  activeItem: {
    backgroundColor: '#E3F2FD',
  },
  badge: {
    backgroundColor: '#FF9901',
    marginRight: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  avatar: {
    backgroundColor: '#5EABE5',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default DrawerContainer;
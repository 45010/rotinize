import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';

// Função utilitária reutilizada do pomodoroService
const makeAuthenticatedRequest = async (url, options = {}) => {
  console.log('USER SERVICE: Making request to:', url);
  console.log('USER SERVICE: Options:', options);
  
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) {
    console.log('USER SERVICE: No token found');
    return { success: false, error: 'Token não encontrado. Faça login novamente.' };
  }

  console.log('USER SERVICE: Token found, making request...');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  console.log('USER SERVICE: Response status:', response.status);
  console.log('USER SERVICE: Response ok:', response.ok);

  if (!response.ok) {
    if (response.status === 401) {
      console.log('USER SERVICE: 401 - Removing token');
      await AsyncStorage.removeItem('authToken');
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }
    
    const errorText = await response.text();
    console.log('USER SERVICE: Error text:', errorText);
    return {
      success: false,
      error: errorText || `Erro ${response.status}`,
    };
  }

  const data = await response.json();
  console.log('USER SERVICE: Success data:', data);
  return { success: true, data };
};

export const userService = {
  async getProfile() {
    try {
      console.log('USER SERVICE: Getting user profile...');
      const result = await makeAuthenticatedRequest(API_ENDPOINTS.USER.PROFILE, {
        method: 'GET',
      });
      
      console.log('USER SERVICE: Get profile result:', result);
      return result;
    } catch (error) {
      console.error('USER SERVICE: Get profile error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async updateProfile(userData) {
    try {
      console.log('USER SERVICE: Updating user profile...');
      console.log('USER SERVICE: Update data:', userData);
      
      const result = await makeAuthenticatedRequest(API_ENDPOINTS.USER.PROFILE, {
        method: 'PUT',
        body: JSON.stringify({
          Nome: userData.nome,
          Email: userData.email
        }),
      });
      
      console.log('USER SERVICE: Update profile result:', result);
      return result;
    } catch (error) {
      console.error('USER SERVICE: Update profile error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async changePassword(passwordData) {
    try {
      console.log('USER SERVICE: Changing password...');
      
      const result = await makeAuthenticatedRequest(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          SenhaAtual: passwordData.senhaAtual,
          NovaSenha: passwordData.novaSenha
        }),
      });
      
      console.log('USER SERVICE: Change password result:', result);
      return result;
    } catch (error) {
      console.error('USER SERVICE: Change password error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  }
};

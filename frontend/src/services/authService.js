import { API_ENDPOINTS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email, senha) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Senha: senha }),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: typeof data === 'string' ? data : 'Erro ao fazer login',
        };
      }

      if (data && data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        console.log('Token salvo no AsyncStorage');
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async register(nome, email, senha) {
    try {
      console.log('Making register request...');
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Nome: nome, Email: email, Senha: senha }),
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          error: typeof data === 'string' ? data : 'Erro ao registrar usuário',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';

const makeAuthenticatedRequest = async (url, options = {}) => {
  console.log('AUTH REQUEST: Making request to:', url);
  console.log('AUTH REQUEST: Options:', options);
  
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) {
    console.log('AUTH REQUEST: No token found');
    return { success: false, error: 'Token não encontrado. Faça login novamente.' };
  }

  console.log('AUTH REQUEST: Token found, length:', token.length);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  console.log('AUTH REQUEST: Response status:', response.status);
  console.log('AUTH REQUEST: Response ok:', response.ok);

  if (!response.ok) {
    if (response.status === 401) {
      console.log('AUTH REQUEST: 401 - Removing token');
      await AsyncStorage.removeItem('authToken');
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }
    
    const errorText = await response.text();
    console.log('AUTH REQUEST: Error text:', errorText);
    return {
      success: false,
      error: errorText || `Erro ${response.status}`,
    };
  }

  const data = await response.json();
  console.log('AUTH REQUEST: Success data:', data);
  return { success: true, data };
};

export const pomodoroService = {
  async startSession(flow) {
    try {
      const userId = "user-temp";
      
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/start`, {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          flow: flow
        }),
      });
    } catch (error) {
      console.error('Start session error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async pauseSession(sessionId) {
    try {
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/pause/${sessionId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Pause session error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async resumeSession(sessionId) {
    try {
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/resume/${sessionId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Resume session error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async completePhase(sessionId) {
    try {
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/complete-phase/${sessionId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Complete phase error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async stopSession(sessionId) {
    try {
      console.log('POMODORO SERVICE: Stopping session ID:', sessionId);
      const url = `${API_ENDPOINTS.POMODORO.BASE}/stop/${sessionId}`;
      console.log('POMODORO SERVICE: URL:', url);
      
      const result = await makeAuthenticatedRequest(url, {
        method: 'POST',
      });
      
      console.log('POMODORO SERVICE: Stop result:', result);
      return result;
    } catch (error) {
      console.error('POMODORO SERVICE: Stop session error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async getSessionStatus(sessionId) {
    try {
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/status/${sessionId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Get session status error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  },

  async getUserHistory(userId = "user-temp") {
    try {
      return await makeAuthenticatedRequest(`${API_ENDPOINTS.POMODORO.BASE}/history/${userId}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Get user history error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor.',
      };
    }
  }
};

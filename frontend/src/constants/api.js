import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiHost = () => {
  console.log('=== API HOST DETECTION ===');
  console.log('Platform:', Platform.OS);
  console.log('Constants.manifest:', Constants.manifest);
  console.log('Constants.expoConfig:', Constants.expoConfig);

  if (Platform.OS === 'web') {
    console.log('Using localhost (web)');
    return 'localhost';
  }

  let debuggerHost = null;

  if (Constants.manifest?.debuggerHost) {
    debuggerHost = Constants.manifest.debuggerHost;
    console.log('Got debuggerHost from manifest:', debuggerHost);
  }

  else if (Constants.manifest2?.extra?.expoGo?.debuggerHost) {
    debuggerHost = Constants.manifest2.extra.expoGo.debuggerHost;
    console.log('Got debuggerHost from manifest2:', debuggerHost);
  }

  else if (Constants.expoConfig?.hostUri) {
    debuggerHost = Constants.expoConfig.hostUri;
    console.log('Got debuggerHost from expoConfig:', debuggerHost);
  }

  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return host;
  }

  return 'localhost';
};

const API_HOST = getApiHost();
const AZURE_HOST = 'https://rotinize-api-dev-c4c4c5cqc5e8gaba.brazilsouth-01.azurewebsites.net';
//export const API_BASE_URL = `http://${API_HOST}:5228/api`;
export const API_BASE_URL = `${AZURE_HOST}/api`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/user/change-password`,
  },
  HABITS: {
    CREATE: `${API_BASE_URL}/habits`,
    GET_ALL: `${API_BASE_URL}/habits`,
    GET_BY_ID: (id) => `${API_BASE_URL}/habits/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/habits/${id}`,
    UPDATE_ACTIVE: (id) => `${API_BASE_URL}/habits/${id}/active`, 
    DELETE: (id) => `${API_BASE_URL}/habits/${id}`,
  },
  POMODORO: {
    BASE: `${API_BASE_URL}/pomodoro`,
  },
  TASKS: {
    CREATE: `${API_BASE_URL}/tasks`,
    GET_ALL: `${API_BASE_URL}/tasks`,
    GET_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/tasks/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/tasks/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/tasks/${id}`,
  },
  HABIT_TASKS: {
    GET_BY_ID: (id) => `${API_BASE_URL}/habit-tasks/${id}`,
    GET_BY_HABIT_ID: (habitId) => `${API_BASE_URL}/habits/${habitId}/tasks`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/habit-tasks/${id}`,
  },
  DASHBOARD: {
    TODAY: `${API_BASE_URL}/dashboard/today`,
  }
};

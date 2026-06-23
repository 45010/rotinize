import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api'; 

const apiAuthenticatedClient = axios.create({
  baseURL: API_BASE_URL,
});

apiAuthenticatedClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiAuthenticatedClient;
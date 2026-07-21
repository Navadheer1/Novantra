import axios from 'axios';
import { getApiUrl, apiFetch } from './apiConfig';

export { getApiUrl, apiFetch };

// Get the base API URL from env variables
const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can dynamically inject the Clerk token into the requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const uploadFile = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const generateAIResponse = async (promptType: string, data: any, token: string) => {
  const response = await api.post('/api/ai/generate', { promptType, data }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

export const createMeeting = async (startupId: string, token: string) => {
  const response = await api.post('/api/meetings', { startupId }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

export default api;

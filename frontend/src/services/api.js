import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getHealthStatus = () => API.get('/health');
export const predictPrice = (data) => API.post('/predict', data);
export const getPredictionHistory = (params) => API.get('/predictions', { params });
export const getPredictionById = (id) => API.get(`/predictions/${id}`);
export const deletePrediction = (id) => API.delete(`/predictions/${id}`);
export const getModelInfo = () => API.get('/model-info');

export default API;

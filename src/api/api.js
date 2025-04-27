import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // ajuste se necessário
});

// Intercepta todas as requisições para adicionar o token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Confere se o headers existem antes
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

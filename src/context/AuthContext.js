import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token encontrado no localStorage:", token); // <-- AQUI pra ver se carregou o token na inicialização
    if (token) setAuthenticated(true);
  }, []);

 // AuthContext.js
const login = async (username, password) => {
  const res = await api.post('/auth/token', { username, password });
  localStorage.setItem('token', res.data.accessToken);
  localStorage.setItem('username', username);
  setAuthenticated(true);
};

  

  const logout = () => {
    console.log("Fazendo logout");
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // << ADICIONAR AQUI
    setAuthenticated(false);
    navigate('/login');
  };
  

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

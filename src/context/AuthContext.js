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

  const login = async (username, password) => {
    console.log("Tentando login com:", username, password); // <-- Antes de tentar enviar

    try {
      const res = await api.post('/auth/token', { username, password });
      console.log("Resposta recebida do backend:", res); // <-- Logar o response inteiro para ver status, headers, etc.
      
      console.log("AccessToken recebido:", res.data.accessToken);
      
      localStorage.setItem('token', res.data.accessToken);
      
      setAuthenticated(true);
      
      console.log("Usuário autenticado, navegando para chamados...");
      navigate('/chamados');
    } catch (error) {
      console.error("Erro no login:", error.response ? error.response.data : error.message); // <-- Melhor log de erro
      alert('Login inválido');
    }
  };

  const logout = () => {
    console.log("Fazendo logout");
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

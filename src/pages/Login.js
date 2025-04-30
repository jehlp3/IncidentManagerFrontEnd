import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import loginLogo from '../assets/login.png'; // <- Importa a imagem

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/chamados');
    } catch (error) {
      toast.error('Usuário ou senha inválidos!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <div className="logo">
          <img src={loginLogo} alt="Login Logo" />
        </div>
        <h2>Acesse a sua conta</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Usuário</label>
          <input 
            type="text" 
            placeholder="Digite seu username" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />

          <label>Senha</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />

          <div className="options">
            <label className="remember">
              <input type="checkbox" disabled={loading} />
              Lembre minhas preferências
            </label>
            <span className="forgot">Esqueceu sua senha?</span>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <p className="signup-text">
          Não tem uma conta? <span>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}

export default Login;

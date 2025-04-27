import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chamados from './pages/Chamados';
import ChamadoDetalhes from './pages/ChamadoDetalhes';
import CadastroUsuario from './pages/CadastroUsuario';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chamados" element={<Chamados />} />
          <Route path="/chamados/:id" element={<ChamadoDetalhes />} />
          <Route path="/usuarios/novo" element={<CadastroUsuario />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

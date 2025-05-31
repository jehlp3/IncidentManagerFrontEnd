import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Chamados from './pages/Chamados';
import ChamadoDetalhes from './pages/ChamadoDetalhes';
import CadastroUsuario from './pages/CadastroUsuario';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; 

// IMPORTAR novos componentes
import RelatorioChamados from './pages/RelatorioChamados';
import RelatorioUsuarios from './pages/RelatorioUsuarios';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Página inicial: Login sem Header e Sidebar */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />


          {/* Rotas protegidas: com Header e Sidebar */}
          <Route path="/chamados" element={<Layout><Chamados /></Layout>} />
          <Route path="/chamados/:id" element={<Layout><ChamadoDetalhes /></Layout>} />
          <Route path="/usuarios/novo" element={<Layout><CadastroUsuario /></Layout>} />
          <Route path="/relatorios/chamados" element={<Layout><RelatorioChamados /></Layout>} />
          <Route path="/relatorios/usuarios" element={<Layout><RelatorioUsuarios /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
